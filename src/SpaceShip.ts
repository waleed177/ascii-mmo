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

import { PrefabName } from '../client/shared/Prefabs';
import { Vector3 } from '../client/shared/Vector3';
import { ServerGameObject } from './ServerGameObject';
import { TileMapObject } from './TileMapObject';
import { trim_amount } from '../client/shared/Utils';
import { NetworkPlayer } from './NetworkPlayer';
import { DirectionSymbol, direction_symbol_add, direction_symbol_to_number, direction_symbol_to_vector, subtract_direction_symbols } from '../client/shared/DirectionUtils';
import { ServerSerializedGameObject } from './ServerSerializedGameObject';
import { Laser } from './Laser';
import { ITileBehaviour } from './tiles/Tile';
import { ClientHandler } from './ClientHandler';
import { NetworkEntity } from './NetworkEntity';


class ArrowBehaviour implements ITileBehaviour {

    use(client: ClientHandler, tileMap: TileMapObject, localPosition: Vector3): void {
        
    }

    collide(tileMap: TileMapObject, localPosition: Vector3, collider: ServerGameObject, tileSymbol: string): void {
        
        if(tileMap instanceof SpaceShip) {
            let colls = tileMap.world.findEntitiesCollidingWith(tileMap);
         
            let rotation_number = subtract_direction_symbols(
                tileSymbol as DirectionSymbol, tileMap.direction as DirectionSymbol
            );

            tileMap.direction = tileSymbol as DirectionSymbol;
            let dir: Vector3 = direction_symbol_to_vector[tileMap.direction];

            tileMap.tilemap.rotateRight(-rotation_number);

            let new_position = tileMap.position.add(dir.mul(2));

            tileMap.rotateAndMovePositionsOfEntities(
                colls,
                (go) => !go.movable,
                rotation_number,
                new_position,
                tileMap.tilemap.width, tileMap.tilemap.height
            );
            
            tileMap.position = new_position;
            tileMap.commitChanges();
            tileMap.emitPosition();
        }
    }
}

class ShootingBehaviour implements ITileBehaviour {
    use(client: ClientHandler, tileMap: TileMapObject, localPosition: Vector3): void {
        
    }

    collide(tileMap: TileMapObject, localPosition: Vector3, collider: ServerGameObject, tileSymbol: string): void {
        
        if(tileMap instanceof SpaceShip && collider instanceof NetworkEntity) {
            let collisions = tileMap.world.raycast(collider.position, direction_symbol_to_vector[tileMap.direction], 20, tileMap);
            let distance = 20;
            if (collisions.length > 0) {
                let tilemap = collisions[0].gameObject;
                if(tilemap instanceof TileMapObject) {
                    distance = Math.round(collisions[0].position.sub(collider.position).length())-2;
                    if(distance < 0) distance = 0;
                    tilemap.damageTilesAtWorldSpace(collisions[0].position, 2);
                    tilemap.commitChanges();
                }
            }

            let direction_vector = direction_symbol_to_vector[tileMap.direction];
            let laser = new Laser(distance, direction_symbol_to_number[tileMap.direction]);
            if(tileMap.direction == ">" || tileMap.direction  == "v") {
                laser.position = collider.position.add(direction_vector.mul(2));
            } else {
                laser.position = collider.position.add(direction_vector.mul(distance+2));
            }
            tileMap.world.addChild(laser);
        }
    }
    
}

export class SpaceShip extends TileMapObject {

    public direction: DirectionSymbol;

    constructor() {
        super();

        this.direction = "^";
        this.setupWithText(trim_amount(`
  #####  
 #  ^o #
#       #
#       
#<     >#
#       #
#       #
#   v   #
#########`, 1, "left"));

        this.overrideTileBehaviour(["<", "^", ">", "v"], new ArrowBehaviour());
        this.overrideTileBehaviour(["o"], new ShootingBehaviour());
    }

    deserialize(data: ServerSerializedGameObject) {
        super.deserialize(data);
        let publicData = data.publicData.data as {direction: DirectionSymbol};
        this.direction = publicData.direction;
    }

    getPublicData() {
        let res = super.getPublicData();
        let data = res.data as {direction: DirectionSymbol};
        data.direction = this.direction;
        return res;
    }

    getPrivateData() {
        return {
            prefab: "spaceship"
        } as {prefab: PrefabName}
    }

}
