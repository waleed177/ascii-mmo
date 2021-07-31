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

import { Vector3 } from "./Vector3.js";

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

var rotate_symbol_right = new Map([
    ["^", ">"],
    [">", "v"],
    ["v", "<"],
    ["<", "^"],
    ["│", "─"],
    ["─", "│"],
]);

export function subtract_direction_symbols(symbol1: DirectionSymbol, symbol2: DirectionSymbol) {
    var num1 = direction_symbol_to_number[symbol1];
    var num2 = direction_symbol_to_number[symbol2];
    return direction_number_modulo(num1-num2);
}

export function direction_number_modulo(num: number): 0 | 1 | 2 | 3{
    let res = num % 4;
    if (res < 0) {
        return 4+res as 0 | 1 | 2 | 3;
    } else {
        return res as 0 | 1 | 2 | 3;
    }
}

export function direction_symbol_add(symbol1: DirectionSymbol, amount: number) {
    return number_to_direction_symbol[
        direction_number_modulo(direction_symbol_to_number[symbol1] + amount)
    ];
}

export function rotate_symbol(symbol: string, amount: number) {
    let amount_cleaned = direction_number_modulo(amount);
    let res = symbol;
    if(rotate_symbol_right.has(res))
        for(let i = 0; i < amount_cleaned; i++) {
            res = rotate_symbol_right.get(res);
        }
    return res;
}