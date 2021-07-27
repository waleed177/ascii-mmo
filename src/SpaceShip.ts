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

export class SpaceShip extends TileMapObject {

    constructor() {
        super();
        this.setupWithText(`
#########
#   ^   #
# <   > #
#       
#   V   #
#########
        `.trim());
    }

    getPrivateData() {
        return {
            prefab: "spaceship"
        } as {prefab: PrefabName}
    }

    processCollisionWith(obj: ServerGameObject, pos: Vector3) {
        let tile = this.getTileAtWorldSpace(pos);
        if (tile == "^") {
            this.position.y -= 1;
        } else if (tile == "V") {
            this.position.y += 1;
        } else if (tile == ">") {
            this.position.x += 1;
        } else if (tile == "<") {
            this.position.x -= 1;
        }
        this.emitPosition();
    }
}
