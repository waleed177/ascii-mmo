import { GameObject } from '../client/shared/GameObject';
import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ClientHandler } from './ClientHandler';
import { NetworkWorld } from './NetworkWorld';
import { EmitForGameObjectData } from '../client/shared/EmitForGameObjectData';
import { MessageHandler } from '../client/shared/MessageHandler';
import { ServerSerializedGameObject } from './ServerSerializedGameObject';

export class ServerGameObject extends GameObject {
    world: NetworkWorld;
    messageHandler: MessageHandler<ClientHandler>;
    shouldBeSerialized: boolean = true;

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: " ",
            x: -1,
            y: -1,
            z: -1,
            prefab: "entityCharSprite",
            data: {}
        }
    }

    getPrivateData(): any {
        return {};
    }

    serialize(): ServerSerializedGameObject {
        return {
            publicData: this.getPublicData(),
            privateData: this.getPrivateData()
        }
    }

    deserialize(data: ServerSerializedGameObject) {

    }

    emit(type: string, data: any, except: ClientHandler[] = null) {
        this.world.server.broadcast('emitForGameObject', {
            id: this.id,
            json: {
                type: type,
                json: data
            }
        } as EmitForGameObjectData, except);
    }

    emitTo(client: ClientHandler, type: string, data: any) {
        client.emit('emitForGameObject', {
            id: this.id,
            json: {
                type: type,
                json: data
            }
        } as EmitForGameObjectData);
    }
}
