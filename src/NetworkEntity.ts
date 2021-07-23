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