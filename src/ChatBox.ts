import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ServerGameObject } from './ServerGameObject';
import { ChatMessageData } from '../client/shared/ChatMessageData';
import { NPC } from './NPC';
import { dialogues } from './NPCData';
import { GameObject } from '../client/shared/GameObject';
import { TileMapObject } from './TileMapObject';
import { Vector3 } from '../client/shared/Vector3';
import { Mob } from './Mob';
import { UserModel, User, comparePassword, UserDocument } from './models/UserModel';

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
                    case "loadtxtmap": {
                        var tilemap = this.world.convertTextFileToTileMapObject(sp[1]);
                        tilemap.position = sender.player.position;
                        this.world.addChild(tilemap);
                        break;
                    }
                    case "setspawnpointhere": {
                        this.world.spawnPoint = sender.player.position.clone();
                        break;
                    }
                    case "spawnmob": {
                        let mob = new Mob();
                        mob.position = sender.player.position;
                        this.world.addChild(mob); 
                        break;
                    }
                    case "additem": {
                        sender.player.inventory.addItem({
                            name: sp[1],
                            quantity: Number.parseInt(sp[2])
                        });
                        break;
                    }
                    case "register": {
                        let username = sp[1];
                        let password = sp[2];
                        let user = new UserModel({
                            username: username,
                            password: password
                        } as User);
                        user.save();
                        break;
                    }
                    case "login": {
                        let username = sp[1];
                        let password = sp[2];
                        UserModel.findOne({
                            username: username
                        }).then((user) => {
                            if (user && comparePassword(user, password)) {
                                this.emitTo(sender, 'message', {
                                    message: "sys> logged in!"
                                } as ChatMessageData);
                                sender.login(user);
                            } else {
                                this.emitTo(sender, 'message', {
                                    message: "sys> somethin not workin."
                                } as ChatMessageData);
                            }
                        });
                        
                    }
                }
            } else {
                let message =  sender.userInfo.username + ": " + data.message;
                
                this.emit('message', {
                    message: message
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
