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

import { Vector3 } from "../../client/shared/Vector3";
import { ClientHandler } from "../ClientHandler";
import { TileMapObject } from "../TileMapObject";
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

class WallTile extends Tile {
    public id = "wall";
    public displayName = "Wall";
    public chars = ["┌", "─", "┐", "│", "#"];
}
addTile(WallTile);

class ChestTile extends Tile {
    public id = "chest";
    public displayName = "Chest";
    public chars = ["█"];
}
addTile(ChestTile);

class FloorTile extends Tile {
    public id = "floor";
    public displayName = "Floor";
    public chars = ["."];
}
addTile(FloorTile);

class ArrowTile extends Tile {
    public id = "arrow";
    public displayName = "Arrow";
    public chars = ["<", "^", ">", "v"];
}
addTile(ArrowTile);

class BasicResourceGeneratorTile extends Tile {
    public id = "generators_resources_basic";
    public displayName = "Basic resources generator";
    public chars = ["R"];
    public everyList = [
        {
            func: (client: ClientHandler, tileMap: TileMapObject, localPosition: Vector3) => {
                
            },
            period: 1
        }
    ];
}
