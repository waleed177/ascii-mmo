import { PrefabName } from '../client/shared/Prefabs';
import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { Vector3 } from '../client/shared/Vector3';
import { ServerGameObject } from './ServerGameObject';

export class NetworkEntity extends ServerGameObject {
    public position = new Vector3(0, 0, 0);
    public sprite: string = ' ';
    public prefab: PrefabName = 'entityCharSprite';
    public data: object = {};

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