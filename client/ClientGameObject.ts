import { NetworkWorld } from "./NetworkWorld.js";
import { EmitForGameObjectData } from "./shared/EmitForGameObjectData.js";
import { GameObject } from "./shared/GameObject.js";
import { MessageHandler } from "./shared/MessageHandler.js";
import { Socket } from "./Socket.js";

export class ClientGameObject extends GameObject {
    world: NetworkWorld;
    messageHandler: MessageHandler<Socket>;

    emit(type: string, data: object) {
        this.world.socket.emit('emitForGameObject', {
            id: this.id,
            json: {
                type: type,
                json: data
            }
        } as EmitForGameObjectData);
    }
}
