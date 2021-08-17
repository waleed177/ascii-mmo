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

import { ItemData } from '../client/shared/Item';
import { PrefabName } from '../client/shared/Prefabs';
import { Chest } from './Chest';
import { NetworkEntity } from './NetworkEntity';

export class ResourceGenerator extends NetworkEntity {

    constructor() {
        super();
        this.prefab = "entityCharSprite";
        this.sprite = "R";
        
        this.every(4, () => {
            var neighbors = this.get4Neighbors();
            neighbors.forEach((value, index, array) => {
                if (value instanceof Chest) {
                    value.inventory.addItem("r", 1);
                }
            });
        });
    }

    getPrivateData() {
        return {
            prefab: 'resourceGenerator'
        } as { prefab: PrefabName; };
    }

    update() {
        super.update();

    }

}
