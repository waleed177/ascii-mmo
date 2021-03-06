//#region PREAMBLE
/*
    This is an ASCII MMO game.
    Copyright (C) 2021 waleed177 <potatoxel@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, version 3 of the
    License only.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
//#endregion

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
import { MovingThing } from './MovingThing';
import { SpaceShip } from './SpaceShip';
import { Chest } from './Chest';
import { ResourceGenerator } from './ResourceGenerator';

export class ChatBox extends ServerGameObject {
    shouldBeSerialized = false;
    
    constructor() {
        super();

        this.messageHandler.on("message", (sender, data: ChatMessageData) => {
            
            if(data.message.startsWith("/")) {
                var sp = data.message.substr(1).split(" ");
                var cmd = sp[0];
                if(cmd == "server_credits") {
                    this.emitTo(sender, 'message', {
                        message: "sys> Copyright (C) 2021 waleed177"
                    } as ChatMessageData);
                }
                if(sender.userInfo == null) {
                    switch(cmd) {
                        case "key": {
                            let key = sp[1];
                            if (key == this.world.server.alphaKey) {
                                sender.hasKey = true;
                            }
                            break;
                        }
                        case "register": {
                            if(sender.hasKey) {
                                let username = sp[1];
                                let password = sp[2];

                                UserModel.findOne({
                                    username: username
                                }).then(userFound => {
                                    if(userFound) {
                                        this.emitTo(sender, 'message', {
                                            message: "sys> y u register with existing username"
                                        } as ChatMessageData);
                                    } else {
                                        let user = new UserModel({
                                            username: username,
                                            password: password
                                        } as User);
                                        user.save();

                                        this.emitTo(sender, 'message', {
                                            message: "sys> goodjob."
                                        } as ChatMessageData);
                                    }
                                })
                            }
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
                            break;
                        }
                    }
                } else {
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
                        case "spawnship": {
                            let thing = new SpaceShip();
                            thing.position = sender.player.position;
                            this.world.addChild(thing); 
                            break;
                        }
                        case "spawnchest": {
                            let thing = new Chest();
                            thing.position = sender.player.position;
                            this.world.addChild(thing); 
                            break;
                        }
                        case "spawnres": {
                            let thing = new ResourceGenerator();
                            thing.position = sender.player.position;
                            this.world.addChild(thing); 
                            break;
                        }
                        case "spawnthing": {
                            let thing = new MovingThing();
                            thing.position = sender.player.position;
                            thing.velocity = new Vector3(
                                Number.parseInt(sp[1]),
                                Number.parseInt(sp[2]),
                                0
                            )
                            this.world.addChild(thing); 
                            break;
                        }
                        case "additem": {
                            sender.player.inventory.addItem(
                                sp[1],
                                Number.parseInt(sp[2])
                            );
                            break;
                        }
                        case "clearinv": {
                            sender.player.inventory.clear();
                            break;
                        }
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
