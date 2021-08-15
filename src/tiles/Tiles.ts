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

import { Tile } from "./Tile";

class TileManager {
    public tiles = new Map<string, Tile>();
    public tilesByChar = new Map<string, Tile>();
}

export var tileManager = new TileManager();

interface TileConstructor {
    new(): Tile
}

function addTile(tile: TileConstructor) {
    var instance = new tile();
    tileManager.tiles.set(instance.id, instance);
    instance.chars.forEach((value) => {
        tileManager.tilesByChar.set(value, instance);
    })
}

export class Wall extends Tile {
    public id = "wall";
    public displayName = "Wall";
    public chars = ["┌", "─", "┐", "│", "#"];
}
addTile(Wall);

export class Chest extends Tile {
    public id = "chest";
    public displayName = "Chest";
    public chars = ["█"];
}
addTile(Chest);

export class Floor extends Tile {
    public id = "floor";
    public displayName = "Floor";
    public chars = ["."];
}
addTile(Floor);

export class Arrow extends Tile {
    public id = "arrow";
    public displayName = "Arrow";
    public chars = ["<", "^", ">", "v"];
    
}
addTile(Arrow);