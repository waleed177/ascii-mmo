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
import { DirectionSymbol, direction_symbol_add, subtract_direction_symbols } from '../client/shared/DirectionUtils';
import { NetworkEntity } from './NetworkEntity';

export class SpaceShip extends TileMapObject {
    private sprites = new Map<string, string>();
    private arrow_positions = new Map<string, Map<string, Vector3>>();
    private current_sprite: string;

    constructor() {
        super();
        this.sprites.set("^",trim_amount(`
  #####
 #  ^  #
# <   > #
#       
#   v   #
#########`, 1, "left"));

        this.sprites.set("v",trim_amount(`
#########
#   ^   #
        #
# <   > #
 #  v  #
  #####`, 1, "left"));

        this.sprites.set(">",trim_amount(`
####
#   #
#  ^ #
#    #
#<  >#
#    #
#  v #
#   #
## #`       , 1, "left"));

        this.sprites.set("<",trim_amount(`
  # ##
 #   #
# ^  #
#    #
#<  >#
#    #
# v  #
 #   #
  ####`, 1, "left"));
        this.current_sprite = "^";
        this.setupWithText(this.sprites.get("^"));

        this.sprites.forEach((value, key, map) => {
            let lines = value.split("\n");
            let position_map = new Map<string, Vector3>();
            this.arrow_positions.set(key, position_map);
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                for (let j = 0; j < line.length; j++) {
                    let char = line[j];
                    if ("^><v".indexOf(char) >= 0) {
                        position_map.set(char, new Vector3(j, i, 0));
                    }
                }
            }
        });
    }

    getPrivateData() {
        return {
            prefab: "spaceship"
        } as {prefab: PrefabName}
    }

    processCollisionWith(obj: ServerGameObject, pos: Vector3) {
        if(obj instanceof NetworkPlayer) {
            let tile = this.getTileAtWorldSpace(pos);
            let local_pos = pos.sub(this.position);
            let mlocal_pos = new Vector3(local_pos.y, local_pos.x, local_pos.z);
            let dir = new Vector3(0, 0, 0);

            let vertical_flip = this.current_sprite == "^" && tile == "v" || this.current_sprite == "v" && tile == "^";
            let horizontal_flip = this.current_sprite == "<" && tile == ">" || this.current_sprite == ">" && tile == "<";
            
            let rotation_number = subtract_direction_symbols(tile as DirectionSymbol, this.current_sprite as DirectionSymbol);

            var colls =  this.world.findEntitiesCollidingWith(this);

            if (tile == "^") {
                this.setupWithText(this.sprites.get("^"));
                this.commitChanges();
                dir = new Vector3(0, -1, 0);
            } else if (tile == "v") {
                this.setupWithText(this.sprites.get("v"));
                this.commitChanges();
                dir = new Vector3(0, 1, 0);
            } else if (tile == ">") {
                this.setupWithText(this.sprites.get(">"));
                this.commitChanges();
                dir = new Vector3(1, 0, 0);
            } else if (tile == "<") {
                this.setupWithText(this.sprites.get("<"));
                this.commitChanges();
                dir = new Vector3(-1, 0, 0);
            }

            //todo figure this out later.
            if ("^><v".indexOf(tile) >= 0) {
                console.log(rotation_number);

                this.current_sprite = tile;

                var new_position = obj.position.sub(this.arrow_positions.get(this.current_sprite).get(tile)).add(dir.mul(2));

                colls.forEach((gameObject, index, array) => {
                    if (gameObject instanceof NetworkEntity && gameObject != obj) {
                        let offset = gameObject.position.sub(this.position);
                       

                        if(vertical_flip || horizontal_flip) {
                            gameObject.position = offset.pmul(new Vector3(-1, -1, 1)).add(new_position).add(new Vector3(this.tilemap.width-1, this.tilemap.height-1, 0));
                        } else if(rotation_number >0) {
                            if(rotation_number==3) {
                                gameObject.position = new Vector3(this.tilemap.width-offset.y-1, offset.x, offset.z).add(new_position);
                            } else {
                                gameObject.position = new Vector3(offset.y, this.tilemap.height-offset.x-1, offset.z).add(new_position);
                            }
                        } else {
                            gameObject.position = gameObject.position.add(dir);
                        }
                        gameObject.emitPosition();
                    }
                });
                this.position = new_position;
            }
            this.emitPosition();
        }
    }
}
