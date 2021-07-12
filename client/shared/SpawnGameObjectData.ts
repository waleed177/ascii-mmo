import { PrefabName } from "./Prefabs.js";

export interface SpawnGameObjectData {
    id: number;
    sprite: string; //temporary
    x: number;
    y: number;
    prefab: PrefabName;
    data: object;
}

