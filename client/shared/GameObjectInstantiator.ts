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

import { SpawnGameObjectData } from "./SpawnGameObjectData.js";
import { GameObject } from "./GameObject.js";
import { PrefabName } from "./Prefabs.js";

interface GameObjectInstantiator {
    new(): GameObject;
}
export class PrefabInstantiator {
    protected prefabs: Map<string, GameObjectInstantiator>;

    constructor() {
        this.prefabs = new Map<string, GameObjectInstantiator>();
    }

    instantiate(data: SpawnGameObjectData) {
        let res = new (this.prefabs.get(data.prefab))();
        res.init(data);
        res.id = data.id;
        return res;
    }

    bind(prefabName: PrefabName, instantiator: GameObjectInstantiator) {
        this.prefabs.set(prefabName, instantiator);
    }
}
