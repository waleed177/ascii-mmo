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

import { GameObject } from '../client/shared/GameObject';
import { PrefabName } from '../client/shared/Prefabs';
import { SettingPositionData } from '../client/shared/SettingPositionData';
import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { Vector3 } from '../client/shared/Vector3';
import { ClientHandler } from './ClientHandler';
import { ServerGameObject } from './ServerGameObject';
import { ServerSerializedGameObject } from './ServerSerializedGameObject';

export class NetworkEntity extends ServerGameObject {
    private _position = new Vector3(0, 0, 0);
    public get position() {
        return this._position;
    }
    public set position(value) {
        this._position = value.clone();
    }
    public sprite: string = ' ';
    public prefab: PrefabName = 'entityCharSprite';
    public privatePrefab: PrefabName = null;
    public data: object = {};

    deserialize(data: ServerSerializedGameObject){
        super.deserialize(data);
        this.id = data.publicData.id;
        this.sprite = data.publicData.sprite;
        this.position.x = data.publicData.x;
        this.position.y = data.publicData.y;
        this.position.z = data.publicData.z;
        this.prefab = data.publicData.prefab;
        let privateData: {prefab?: PrefabName} = data.privateData;
        if(privateData.prefab !== undefined)
            this.privatePrefab = privateData.prefab;
        this.data = data.publicData.data;
    }

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: this.sprite,
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            prefab: this.prefab,
            data: this.data
        }
    }

    collidesWith(obj: ServerGameObject): boolean {
        if(obj instanceof NetworkEntity) {
            return this.collidesWithPoint(obj.position);
        }
        return false;
    }

    collidesWithPoint(v: Vector3) {
        return v.equals(this.position);
    }

    emitPosition(except: ClientHandler[] = null) {
        this.emit('settingPosition', {
            x: this.position.x,
            y: this.position.y,
            z: this.position.z
        } as SettingPositionData, except);
    }
}