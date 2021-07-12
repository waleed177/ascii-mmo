import { CharSprite } from "./CharSprite.js";
import { Entity } from "./Entity.js";
import { SpawnGameObjectData } from "./shared/SpawnGameObjectData.js";
import { Vector2 } from "./shared/Vector2.js";
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
            (res as Entity).sprite = new CharSprite(new Vector2(0, 0), data.sprite);
            (res as Entity).position = new Vector2(data.x, data.y);
        }
        res.id = data.id;
        return res;
    }

    bind(prefabName: PrefabName, instantiator: GameObjectInstantiator) {
        this.prefabs.set(prefabName, instantiator);
    }
}
