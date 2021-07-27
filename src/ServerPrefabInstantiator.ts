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

import { PrefabInstantiator } from '../client/shared/GameObjectInstantiator';
import { PrefabName } from '../client/shared/Prefabs';
import { ServerGameObject } from './ServerGameObject';
import { ServerSerializedGameObject } from './ServerSerializedGameObject';

export class ServerPrefabInstantiator extends PrefabInstantiator {


    instantiateServerObject(data: ServerSerializedGameObject) {
        let privateData: {prefab?: PrefabName} = data.privateData;
        let prefab = privateData.prefab !== undefined ? privateData.prefab : data.publicData.prefab;
        let res = new (this.prefabs.get(prefab))() as ServerGameObject;
        res.deserialize(data);
        res.id = data.publicData.id;
        return res;
    }
    
}