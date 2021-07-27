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

import {MessageHandler} from "./MessageHandler.js"
import { SpawnGameObjectData } from "./SpawnGameObjectData.js";
import { Vector3 } from "./Vector3.js";
import { World } from "./World.js";

export class GameObject {
    world: World;

    public messageHandler = new MessageHandler();
    public id: number;
    public clientOwned: boolean = false;

    update() {

    }

    draw() {

    }

    guiDraw() {
        
    }

    public init(data: SpawnGameObjectData) {
        
    }

    public ready() {

    }

    public collidesWith(gameObject: GameObject) {
        return false;
    }

    public collidesWithPoint(position: Vector3) {
        return false;
    }

    public preciseCollidesWithPoint(position: Vector3) {
        return false;
    }
}
