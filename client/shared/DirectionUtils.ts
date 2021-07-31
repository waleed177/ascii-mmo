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

import { Vector3 } from "./Vector3";

export type DirectionSymbol = ">" | "^" | "<" | "v";

export var direction_symbol_to_number = {
    ">": 0,
    "^": 1,
    "<": 2,
    "v": 3
}

export var direction_symbol_to_vector = {
    ">": new Vector3(1, 0, 0),
    "^": new Vector3(0, -1, 0),
    "<": new Vector3(-1, 0, 0),
    "v": new Vector3(0, 1, 0)
}

export var number_to_direction_symbol = {
    0: ">",
    1: "^",
    2: "<",
    3: "v"
}

export function subtract_direction_symbols(symbol1: DirectionSymbol, symbol2: DirectionSymbol) {
    var num1 = direction_symbol_to_number[symbol1];
    var num2 = direction_symbol_to_number[symbol2];
    var res = (num1-num2) % 4;
    if (res < 0) {
        return 4+res;
    } else {
        return res;
    }
}

export function direction_symbol_add(symbol1: DirectionSymbol, amount: number) {
    return number_to_direction_symbol[
        (Math.abs(direction_symbol_to_number[symbol1] + amount) % 4) as 0 | 1 | 2 | 3
    ];
}

