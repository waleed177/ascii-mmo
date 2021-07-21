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
