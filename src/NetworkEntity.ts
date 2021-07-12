import { PrefabName } from '../client/shared/Prefabs';
import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { Vector2 } from '../client/shared/Vector2';
import { ServerGameObject } from './ServerGameObject';

export class NetworkEntity extends ServerGameObject {
    public position = new Vector2(0, 0);
    public sprite: string = ' ';
    public prefab: PrefabName = 'entityCharSprite';
    public data: object = {};

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: this.sprite,
            x: this.position.x,
            y: this.position.y,
            prefab: this.prefab,
            data: this.data
        }
    }
}