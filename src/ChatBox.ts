import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ServerGameObject } from './ServerGameObject';
import { ChatMessageData } from '../client/shared/ChatMessageData';
import { Vector3 } from '../client/shared/Vector3';
import { NPC } from './NPC';
import { dialogues } from './NPCData';

export class ChatBox extends ServerGameObject {

    constructor() {
        super();

        this.messageHandler.on("message", (sender, data: ChatMessageData) => {
            if(data.message.startsWith("/")) {
                var sp = data.message.substr(1).split(" ");
                var cmd = sp[0];
                if(cmd == "pnpc") {
                    var npc = new NPC(sp[1], dialogues.get(sp[2]));
                    npc.position = sender.player.position;
                    this.world.addChild(npc);
                }
            } else {
                this.emit('message', {
                    message: "anon: " + data.message
                } as ChatMessageData);
            }
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
