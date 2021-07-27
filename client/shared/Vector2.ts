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

export class Vector2 {
    
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    sub(vector: Vector2) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }
    
    add(vector: Vector2) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    pmul(vector: Vector2) {
        return new Vector2(this.x * vector.x, this.y * vector.y);
    }
    
    pdiv(vector: Vector2) {
        return new Vector2(this.x / vector.x, this.y / vector.y);
    }
    
    mul(scalar: number) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    
    div(scalar: number) {
        return new Vector2(this.x / scalar, this.y / scalar);
    }
    
}
