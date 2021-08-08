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

export class SpaceShip extends TileMapObject {
    private arrow_positions = new Map<string, Map<string, Vector3>>();
    private direction: DirectionSymbol;

    constructor() {
        super();

        this.direction = "^";
        this.setupWithText(trim_amount(`
  #####
 #  ^o #
# <   > #
#       
#   v   #
#########`, 1, "left"));
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

    processCollisionWith(obj: ServerGameObject, pos: Vector3) {
        if(obj instanceof NetworkPlayer) {
            let tile = this.getTileAtWorldSpace(pos);
            let dir = new Vector3(0, 0, 0);
            
            let rotation_number = subtract_direction_symbols(tile as DirectionSymbol, this.direction as DirectionSymbol);

            var colls =  this.world.findEntitiesCollidingWith(this);
         
           
            if (tile == "o") {
                let collisions = this.world.raycast(obj.position, direction_symbol_to_vector[this.direction], 20, this);
                let distance = 20;
                if (collisions.length > 0) {
                    let tilemap = collisions[0].gameObject;
                    if(tilemap instanceof TileMapObject) {
                        distance = Math.round(collisions[0].position.sub(obj.position).length())-2;
                        if(distance < 0) distance = 0;
                        tilemap.damageTilesAtWorldSpace(collisions[0].position, 2);
                        tilemap.commitChanges();
                    }
                }

                let direction_vector = direction_symbol_to_vector[this.direction];
                let laser = new Laser(distance, direction_symbol_to_number[this.direction]);
                if(this.direction == ">" || this.direction  == "v") {
                    laser.position = obj.position.add(direction_vector.mul(2));
                } else {
                    laser.position = obj.position.add(direction_vector.mul(distance+2));
                }
                this.world.addChild(laser);
            }

            //todo figure this out later.
            if ("^><v".indexOf(tile) >= 0) {
                console.log(rotation_number);

                this.direction = tile as DirectionSymbol;
                dir = direction_symbol_to_vector[this.direction];

                this.tilemap.rotateRight(-rotation_number);
                this.commitChanges();

                var new_position = this.position.add(dir.mul(2));

                this.rotateAndMovePositionsOfEntities(colls, (go) => go instanceof TileMapObject, rotation_number, new_position, this.tilemap.width, this.tilemap.height);
                
                this.position = new_position;
            }
            this.emitPosition();
        }
    }
}
