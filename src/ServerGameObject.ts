import { GameObject } from '../client/shared/GameObject';
import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ClientHandler } from './ClientHandler';
import { NetworkWorld } from './NetworkWorld';
import { EmitForGameObjectData } from '../client/shared/EmitForGameObjectData';
import { MessageHandler } from '../client/shared/MessageHandler';

export class ServerGameObject extends GameObject {
    world: NetworkWorld;
    messageHandler: MessageHandler<ClientHandler>;
    
    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: " ",
            x: -1,
            y: -1,
            prefab: "entityCharSprite",
            data: {}
        }
    }

    emit(type: string, data: object) {
        this.world.server.broadcast('emitForGameObject', {
            id: this.id,
            json: {
                type: type,
                json: data
            }
        } as EmitForGameObjectData);
    }
}
