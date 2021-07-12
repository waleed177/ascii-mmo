import { EmitForGameObjectData } from "./shared/EmitForGameObjectData.js";
import { Entity } from "./Entity.js";
import { Player } from "./Player.js";
import { Socket } from "./Socket.js";
import { SpawnGameObjectData } from "./shared/SpawnGameObjectData.js";
import { World } from "./shared/World.js";
import { LocalPlayerIdData } from "./shared/LocalPlayerIdData.js";
import { ChatBox } from "./ChatBox.js";
import { PrefabInstantiator } from "./GameObjectInstantiator.js";

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

        socket.on("emitForGameObject", (data: EmitForGameObjectData) => {
            this.children.get(data.id).messageHandler.handle(socket, data.json);
        });

        socket.on("spawnGameObject", (data: SpawnGameObjectData) => {
            this.addChild(this.instantiator.instantiate(data));
        });

        socket.on("receiveLocalPlayerId", (data: LocalPlayerIdData) => {
            this.playerId = data.id;
        });
    }
}
