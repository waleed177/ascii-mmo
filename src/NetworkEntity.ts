import { PrefabName } from '../client/shared/Prefabs';
import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { Vector3 } from '../client/shared/Vector3';
import { ServerGameObject } from './ServerGameObject';
import { ServerSerializedGameObject } from './ServerSerializedGameObject';

export class NetworkEntity extends ServerGameObject {
    public position = new Vector3(0, 0, 0);
    public sprite: string = ' ';
    public prefab: PrefabName = 'entityCharSprite';
    public data: object = {};

    deserialize(data: ServerSerializedGameObject){
        super.deserialize(data);
        this.id = data.publicData.id;
        this.sprite = data.publicData.sprite;
        this.position.x = data.publicData.x;
        this.position.y = data.publicData.y;
        this.position.z = data.publicData.z;
        this.prefab = data.publicData.prefab;
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
}