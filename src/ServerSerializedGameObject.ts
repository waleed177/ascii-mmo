import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';

export type ServerSerializedGameObject = {
    publicData: SpawnGameObjectData;
    privateData: any;
};
