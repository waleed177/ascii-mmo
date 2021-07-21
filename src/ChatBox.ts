import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ServerGameObject } from './ServerGameObject';
import { ChatMessageData } from '../client/shared/ChatMessageData';
import { NPC } from './NPC';
import { dialogues } from './NPCData';
import { GameObject } from '../client/shared/GameObject';
import { TileMapObject } from './TileMapObject';

export class ChatBox extends ServerGameObject {
    shouldBeSerialized = false;
    
    constructor() {
        super();

        this.messageHandler.on("message", (sender, data: ChatMessageData) => {
            if(data.message.startsWith("/")) {
                var sp = data.message.substr(1).split(" ");
                var cmd = sp[0];
                switch(cmd) {
                    case "pnpc": {
                        var npc = new NPC();
                        npc.sprite = sp[1];
                        npc.dialogueName = sp[2];
                        npc.position = sender.player.position.clone();
                        this.world.addChild(npc);
                        break;
                    }
                    case "remc": {
                        let condition: (gameObject: GameObject) => boolean;
                        condition = _ => true;

                        for(let i = 1; i < sp.length; i++) {
                            let old_condition = condition;
                            switch(sp[i]) {
                                case "all": {
                                    condition = _ => true;
                                    break;
                                }
                                case "o":
                                case "others": {
                                    condition = gameObject => old_condition(gameObject) && gameObject != sender.player;
                                    break;
                                }
                                case "nt":
                                case "nontilemap": {
                                    condition = gameObject => old_condition(gameObject) && !(gameObject instanceof TileMapObject);
                                    break;
                                }
                            }
                        }

                        this.world.findCollisionsWithPoint(sender.player.position).forEach(
                            (gameObject, index, array) => {
                                if (condition(gameObject))
                                    this.world.removeChild(gameObject as ServerGameObject);
                            } 
                        );
                        break;
                    }
                    case "save": {
                        this.world.save();
                        break;
                    }
                    case "tilemap": {
                        var tilemap = new TileMapObject();
                        tilemap.setup(Number.parseInt(sp[1]), Number.parseInt(sp[2]), Number.parseInt(sp[3]));
                        tilemap.position = sender.player.position;
                        this.world.addChild(tilemap);
                        break;
                    }
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
