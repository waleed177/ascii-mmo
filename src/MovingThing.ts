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
import { Vector3 } from '../client/shared/Vector3';
import { NetworkEntity } from './NetworkEntity';


export class MovingThing extends NetworkEntity {
    public velocity: Vector3 = new Vector3(1, 0, 0);

    constructor() {
        super();
        this.prefab = "entityCharSprite";
        this.sprite = "k";
    }

    getPrivateData() {
        return {
            prefab: "movingThing"
        } as {prefab: PrefabName}
    }

    update() {
        let lastPos = this.position.clone();
        this.position = this.position.add(this.velocity);
        if(this.world.findEntitiesCollidingWithPoint(this.position).length >0) {
            this.position = lastPos;
            this.velocity = this.velocity.mul(-1);
        }
        this.emitPosition();
    }
}
