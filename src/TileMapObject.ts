//#region PREAMBLE
/*
    This is an ASCII MMO game.
    Copyright (C) 2021 waleed177 <potatoxel@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, version 3 of the
    License only.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
//#endregion

import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ServerGameObject } from './ServerGameObject';
import { TileMap } from '../client/shared/TileMap';
import { RecieveTileMapData } from '../client/shared/RecieveTileMapData';
import { Vector3 } from '../client/shared/Vector3';
import { NetworkEntity } from './NetworkEntity';
import { ServerSerializedGameObject } from './ServerSerializedGameObject';
import { GameObject } from '../client/shared/GameObject';
import { NetworkPlayer } from './NetworkPlayer';
import { tileManager } from './tiles/Tiles';
import { ITileBehaviour } from './tiles/Tile';
import { ClientHandler } from './ClientHandler';
import { PeriodicFunction } from './tiles/PeriodicFunction';

export class TileMapObject extends NetworkEntity {
    public tilemap: TileMap;
    protected tileBehaviourOverrides = new Map<string, ITileBehaviour>();
    protected periodicFunctions = new Map<string, [PeriodicFunction, Vector3]>();

    setup(width: number, height: number, depth: number) {
        this.tilemap = new TileMap(width, height, depth);
        this.tilemap.onSetTile = (position, newTile) => {
            var tile = tileManager.tilesByChar.get(newTile);
            if(tile != null && tile.periodicFunction != null) {
                this.periodicFunctions.set(
                    position.toString(), [tile.periodicFunction, position]
                );
            } else {
                this.periodicFunctions.delete(position.toString());
            }
        };
    }

    setupWithText(text: string) {
        let lines = text.split("\n");

        let height = lines.length;
        let width = lines[0].length;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.length > width)
                width = line.length;
        }
        this.setup(width, height, 1);
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            for (let j = 0; j < line.length; j++) {
                this.tilemap.setTile(j, i, 0, line[j]);
            }
        }
    }
    
    deserialize(data: ServerSerializedGameObject) {
        super.deserialize(data);
        let publicData = data.publicData.data as RecieveTileMapData;
        this.setup(publicData.width, publicData.height, publicData.depth);
        this.tilemap.useMap(publicData.tilemap);
    }

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: " ",
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            prefab: "tileMap",
            data: {
                tilemap: this.tilemap.tilemap,
                width: this.tilemap.width,
                height: this.tilemap.height,
                depth: this.tilemap.depth
            } as RecieveTileMapData
        };
    }

    public commitChanges() {
        this.emit("map", {
            tilemap: this.tilemap.tilemap,
            width: this.tilemap.width,
            height: this.tilemap.height,
            depth: this.tilemap.depth
        } as RecieveTileMapData);
    }

    collidesWith(obj: ServerGameObject): boolean {
        if(obj instanceof NetworkEntity) {
            return this.collidesWithPoint(obj.position);
        }
    }

    collidesWithPoint(point: Vector3) {
        return this.position.x <= point.x && point.x < this.position.x + this.tilemap.width
            && this.position.y <= point.y && point.y < this.position.y + this.tilemap.height;
    }
    
    preciseCollidesWithPoint(point: Vector3) {
        if (!this.collidesWithPoint(point))
            return false;
        let point2 = point.sub(this.position);
        return " .".indexOf(this.tilemap.getTile(point2.x, point2.y, point2.z)) == -1;
    }

    getTileAtWorldSpace(point: Vector3) {
        let point2 = point.sub(this.position);
        return this.tilemap.getTile(point2.x, point2.y, point2.z);
    }

    setTileAtWorldSpace(point: Vector3, char: string) {
        let point2 = point.sub(this.position);
        this.tilemap.setTile(point2.x, point2.y, point2.z, char);
    }

    damageTileAtWorldSpace(position: Vector3) {
        this.setTileAtWorldSpace(position, ' ');
    }

    damageTilesAtWorldSpace(position: Vector3, radius: number) {
        for(let x = position.x-radius; x < position.x+radius; x++)
            for(let y = position.y-radius; y < position.y+radius; y++)
                for(let z = position.z-radius; z < position.z+radius; z++)
                    this.damageTileAtWorldSpace(new Vector3(x,y,z));
    }

    processCollisionWith(obj: ServerGameObject, pos: Vector3) {
        if(obj instanceof NetworkPlayer) {
            let tileSymbol = this.getTileAtWorldSpace(pos);
            let dir = new Vector3(0, 0, 0);

            if(!tileManager.tilesByChar.has(tileSymbol)) return;

            let tile = tileManager.tilesByChar.get(tileSymbol);

            if(this.tileBehaviourOverrides.has(tileSymbol)) {
                this.tileBehaviourOverrides.get(tileSymbol).collide(
                    this, pos.sub(this.position), obj, tileSymbol
                );
            } else {
                tile.collide(this, pos.sub(this.position), obj, tileSymbol);
            }
        }
    }

    overrideTileBehaviour(chars: string[], behaviour: ITileBehaviour) {
        chars.forEach((value) => {
            this.tileBehaviourOverrides.set(value, behaviour);
        });
    }

    use(client: ClientHandler) {
        var stop = false;
        client.player.position.get4Neighbors().forEach((vector) => {
            if(stop) return;
            var tile = tileManager.tilesByChar
                .get(this.getTileAtWorldSpace(vector));
            if(tile && tile.use(client, this, vector.sub(this.position))) {
                stop = true;
            }
        });
    }

    update() {
        this.periodicFunctions.forEach((value, key, map) => {
            value[0].timeLeft -= 1;
            if (value[0].timeLeft <= 0) {
                value[0].func(this, value[1]);
            }
        });
    }
}
