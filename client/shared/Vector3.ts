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

export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    sub(vector: Vector3) {
        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }
    
    add(vector: Vector3) {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    pmul(vector: Vector3) {
        return new Vector3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
    }
    
    pdiv(vector: Vector3) {
        return new Vector3(this.x / vector.x, this.y / vector.y, this.z / vector.z);
    }
    
    mul(scalar: number) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    
    div(scalar: number) {
        return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    }
    
    length() {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }

    equals(vector: Vector3) {
        return vector.x == this.x && vector.y == this.y && vector.z == this.z;
    }

    sum() {
        return this.x + this.y + this.z;
    }

    abs() {
        return new Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    }

    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    } 
}
