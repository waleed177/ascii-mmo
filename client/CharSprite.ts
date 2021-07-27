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

import { Sprite } from "./shared/Sprite.js";
import { renderer } from "./Client.js";
import { Vector3 } from "./shared/Vector3.js";

export class CharSprite extends Sprite {
    char: string;

    constructor(position: Vector3, char: string) {
        super(position);
        this.char = char;
    }

    public draw(position: Vector3): void {
        renderer.setTile(position.x + this.position.x, position.y + this.position.y, position.z + this.position.z, this.char);
    }
}