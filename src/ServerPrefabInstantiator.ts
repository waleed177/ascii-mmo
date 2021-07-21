import { PrefabInstantiator } from '../client/shared/GameObjectInstantiator';
import { ServerGameObject } from './ServerGameObject';
import { ServerSerializedGameObject } from './ServerSerializedGameObject';

export class ServerPrefabInstantiator extends PrefabInstantiator {


    instantiateServerObject(data: ServerSerializedGameObject) {
        let res = new (this.prefabs.get(data.publicData.prefab))() as ServerGameObject;
        res.deserialize(data);
        res.id = data.publicData.id;
        return res;
    }
    
}