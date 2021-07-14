import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ServerGameObject } from './ServerGameObject';
import { ChatMessageData } from '../client/shared/ChatMessageData';

export class ChatBox extends ServerGameObject {

    constructor() {
        super();

        this.messageHandler.on("message", (sender, data: ChatMessageData) => {
            this.emit('message', {
                message: "anon: " + data.message
            } as ChatMessageData);
        });

    }

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: " ",
            x: 0,
            y: 0,
            z: 0,
            prefab: "chatBox",
            data: {}
        };
    }
}
