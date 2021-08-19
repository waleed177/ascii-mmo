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

import {direction_number_modulo, rotate_symbol} from "./DirectionUtils.js";
import { Vector3 } from "./Vector3.js";

export class TileMap {
    public tilemap: Array<Array<Array<string>>>;
    public width: number;
    public height: number;
    public depth: number;
    public onSetTile: (position: Vector3, newTile: string) => void;

    constructor(width: number, height: number, depth: number) {
        this.initializeTilemap(width, height, depth);
    }

    private initializeTilemap(width: number, height: number, depth: number) {
        this.tilemap = new Array<Array<Array<string>>>();

        for (let x = 0; x < width; x++) {
            let row = new Array<Array<string>>();
            for (let y = 0; y < height; y++) {
                let thingy = new Array<string>();
                for (let z = 0; z < depth; z++) {
                    thingy.push(" ");
                }
                row.push(thingy);
            }
            this.tilemap.push(row);
        }

        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    public clear() {
        this.fillTiles(0, 0, 0, this.width, this.height, this.depth, ' ');
    }

    public inBounds(x: number, y: number, z: number) {
        return 0 <= x && x < this.width && 0 <= y && y < this.height && 0 <= z && z < this.depth;
    }

    public fillTiles(xFrom: number, yFrom: number, zFrom: number, xTo: number, yTo: number, zTo: number, char: string) {
        for(let x = xFrom; x <= xTo; x++)
            for(let y = yFrom; y <= yTo; y++)
                for(let z = zFrom; y <= zTo; z++)
                    this.setTile(x, y, z, char);
    }

    public writeText(x: number, y: number, z: number, str: string) {
        for(let i = 0; i < str.length; i++) {
            this.setTile(x + i, y, z, str[i]);
        }
    }

    public setTile(x: number, y: number, z: number, char: string) {
        if(this.inBounds(x, y, z)){
            this.tilemap[x][y][z] = char;
            if(this.onSetTile)
                this.onSetTile(new Vector3(x,y,z), char);
        }
    }

    public getTile(x: number, y: number, z: number) {
        if(this.inBounds(x, y, z))
            return this.tilemap[x][y][z];
        else
            return ' ';    
    }

    useMap(tilemap: string[][][]) {
        this.tilemap = tilemap;
    }

    rotateRightOnce() {
        let old_tilemap = this.tilemap;
        this.initializeTilemap(this.height, this.width, this.depth);
        for(let x = 0; x < this.height; x++)
            for(let y = 0; y < this.width; y++)
                for(let z = 0; z < this.depth; z++)
                    this.setTile(this.width-y-1, x, z, rotate_symbol(old_tilemap[x][y][z], 1));
    }

    rotateRight(amount: number) {
        let amount_cleaned = direction_number_modulo(amount);
        for(let i = 0; i < amount_cleaned; i++) {
            this.rotateRightOnce();
        }
    }
}
