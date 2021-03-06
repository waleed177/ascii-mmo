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

export function trim_amount(str: String, amount: number, dir: "left" | "right" | "both") {
    if (dir == "left") {
        return str.substr(amount, str.length-amount);
    } else if(dir == "right") {
        return str.substr(0, str.length-amount);
    } else if(dir == "both") {
        return str.substr(amount, str.length-2*amount);
    }
}