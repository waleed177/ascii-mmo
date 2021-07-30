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
import { NetworkEntity } from './NetworkEntity';

export class Mob extends NetworkEntity {

    constructor() {
        super();
        this.prefab = "entityCharSprite";
        this.sprite = "c";

    }

    getPrivateData() {
        return {
            prefab: 'mob'
        } as {prefab: PrefabName}
    }

    update() {
        let lastPos = this.position.clone();
        this.position.x += Math.round(Math.random()*2 - 1);
        this.position.y += Math.round(Math.random()*2 - 1);
        if(this.world.findEntitiesPreciseCollidingWithPoint(this.position).length >0)
            this.position = lastPos;
        this.emitPosition();
    }

}
