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

import { PrefabName } from '../client/shared/Prefabs';
import { trim_amount } from '../client/shared/Utils';
import { TileMapObject } from './TileMapObject';


export class Laser extends TileMapObject {
    saving: boolean = false;
    private life: number = 3;

    constructor(length:number, rotation: number) {
        super();
        this.prefab = "tileMap";
        this.sprite = " ";
        
       
        this.setupWithText("─".repeat(length) + ">");
        this.tilemap.rotateRight(-rotation);
    }

    update() { 
        if(this.life <= 0) {
            this.world.queueRemoveChild(this);
        } else {
            this.life -= 1;
        }
    }
}
