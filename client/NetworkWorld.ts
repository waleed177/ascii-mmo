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

import { EmitForGameObjectData } from "./shared/EmitForGameObjectData.js";
import { Entity } from "./Entity.js";
import { Player } from "./Player.js";
import { Socket } from "./Socket.js";
import { SpawnGameObjectData } from "./shared/SpawnGameObjectData.js";
import { World } from "./shared/World.js";
import { LocalPlayerIdData } from "./shared/LocalPlayerIdData.js";
import { ChatBox } from "./ChatBox.js";
import { PrefabInstantiator } from "./shared/GameObjectInstantiator.js";
import { RemoveGameObjectData } from "./shared/RemoveGameObjectData.js";
import { Inventory } from './Inventory.js';
import { TileMapObject } from "./TileMapObject.js";
import { NPC } from './NPC.js';
import { QuestDisplay } from './QuestDisplay.js';
import { WorldEditor } from './WorldEditor.js';
import { Vector3 } from "./shared/Vector3.js";

export class NetworkWorld extends World {
    public playerId: number;  
    public player: Player;  
    public socket: Socket;
    private instantiator = new PrefabInstantiator();

    constructor(socket: Socket) {
        super();
        this.socket = socket;

        this.instantiator.bind("entityCharSprite", Entity);
        this.instantiator.bind("player", Player);
        this.instantiator.bind("chatBox", ChatBox);
        this.instantiator.bind("inventory", Inventory);
        this.instantiator.bind("tileMap", TileMapObject);
        this.instantiator.bind("npc", NPC);
        this.instantiator.bind("questDisplay", QuestDisplay);
        this.instantiator.bind("worldEditor", WorldEditor);

        socket.on("emitForGameObject", (data: EmitForGameObjectData) => {
            this.children.get(data.id).messageHandler.handle(socket, data.json);
        });

        socket.on("spawnGameObject", (data: SpawnGameObjectData) => {
            this.addChild(this.instantiator.instantiate(data));
        });

        socket.on("removeGameObject", (data: RemoveGameObjectData) => {
            this.removeChildById(data.id);
        });

        socket.on("receiveLocalPlayerId", (data: LocalPlayerIdData) => {
            this.playerId = data.id;
            this.player = this.children.get(data.id) as Player;
            this.player.clientOwned = true;
        });
    }

    findEntitiesWithinRadius(position: Vector3, radius: number) {
        let res: Array<Entity> = [];
        this.children.forEach((gameObject, key, map) => {
            if(gameObject instanceof Entity) {
                if(gameObject.position.sub(position).length() <= radius) {
                    res.push(gameObject);
                }
            }
        });
        return res;
    }
}
