import { EmitForGameObjectData } from "./shared/EmitForGameObjectData.js";
import { Entity } from "./Entity.js";
import { Player } from "./Player.js";
import { Socket } from "./Socket.js";
import { SpawnGameObjectData } from "./shared/SpawnGameObjectData.js";
import { World } from "./shared/World.js";
import { LocalPlayerIdData } from "./shared/LocalPlayerIdData.js";
import { ChatBox } from "./ChatBox.js";
import { PrefabInstantiator } from "./GameObjectInstantiator.js";
import { RemoveGameObjectData } from "./shared/RemoveGameObjectData.js";
import { Inventory } from './Inventory.js';
import { TileMapObject } from "./TileMapObject.js";
import { NPC } from './NPC.js';
import { QuestDisplay } from './QuestDisplay.js';
import { WorldEditor } from './WorldEditor.js';

export class NetworkWorld extends World {
    public playerId: number;    
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
        });
    }
}
