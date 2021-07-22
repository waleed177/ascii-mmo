import { PrefabInstantiator } from '../client/shared/GameObjectInstantiator';
import { PrefabName } from '../client/shared/Prefabs';
import { ServerGameObject } from './ServerGameObject';
import { ServerSerializedGameObject } from './ServerSerializedGameObject';

export class ServerPrefabInstantiator extends PrefabInstantiator {


    instantiateServerObject(data: ServerSerializedGameObject) {
        let privateData: {prefab?: PrefabName} = data.privateData;
        let prefab = privateData.prefab !== undefined ? privateData.prefab : data.publicData.prefab;
        let res = new (this.prefabs.get(prefab))() as ServerGameObject;
        res.deserialize(data);
        res.id = data.publicData.id;
        return res;
    }
    
}