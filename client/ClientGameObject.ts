import { NetworkWorld } from "./NetworkWorld.js";
import { EmitForGameObjectData } from "./shared/EmitForGameObjectData.js";
import { GameObject } from "./shared/GameObject.js";

export class ClientGameObject extends GameObject {
    world: NetworkWorld;


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
