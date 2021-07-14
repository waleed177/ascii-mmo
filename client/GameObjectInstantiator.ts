import { CharSprite } from "./CharSprite.js";
import { Entity } from "./Entity.js";
import { SpawnGameObjectData } from "./shared/SpawnGameObjectData.js";
import { Vector3 } from "./shared/Vector3.js";
import { GameObject } from "./shared/GameObject.js";
import { PrefabName } from "./shared/Prefabs.js";

interface GameObjectInstantiator {
    new(): GameObject;
}
export class PrefabInstantiator {
    private prefabs: Map<string, GameObjectInstantiator>;

    constructor() {
        this.prefabs = new Map<string, GameObjectInstantiator>();
    }

    instantiate(data: SpawnGameObjectData) {
        let res = new (this.prefabs.get(data.prefab))();
        res.init(data.data);
        if (res instanceof Entity) {
            (res as Entity).sprite = new CharSprite(new Vector3(0, 0, 0), data.sprite);
            (res as Entity).position = new Vector3(data.x, data.y, data.z);
        }
        res.id = data.id;
        return res;
    }

    bind(prefabName: PrefabName, instantiator: GameObjectInstantiator) {
        this.prefabs.set(prefabName, instantiator);
    }
}
