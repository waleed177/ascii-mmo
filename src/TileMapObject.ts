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

export class TileMapObject extends NetworkEntity {
    public tilemap: TileMap;


    setup(width: number, height: number, depth: number) {
        this.tilemap = new TileMap(width, height, depth);
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
}
