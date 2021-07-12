import { CharSprite } from "./CharSprite.js";
import { EmitForGameObjectData } from "./shared/EmitForGameObjectData.js";
import { Entity } from "./Entity.js";
import { Player } from "./Player.js";
import { Socket } from "./Socket.js";
import { SpawnGameObjectData } from "./shared/SpawnGameObjectData.js";
import { Vector2 } from "./shared/Vector2.js";
import { World } from "./shared/World.js";
import { LocalPlayerIdData } from "./shared/LocalPlayerIdData.js";

export class NetworkWorld extends World {
    public playerId: number;    
    public socket: Socket;
    
    constructor(socket: Socket) {
        super();
        this.socket = socket;

        socket.on("emitForGameObject", (data: EmitForGameObjectData) => {
            this.children.get(data.id).messageHandler.handle(socket, data.json);
        });

        socket.on("spawnGameObject", (data: SpawnGameObjectData) => {
            var child: Entity;
            if(data.prefab == "entityCharSprite") {
                child = new Entity();
            } else if (data.prefab == "player") {
                child = new Player();
            }
            child.init(data.data);
            child.sprite = new CharSprite(new Vector2(0, 0), data.sprite);
            child.position = new Vector2(data.x, data.y);
            child.id = data.id;
            this.addChild(child);
        });

        socket.on("receiveLocalPlayerId", (data: LocalPlayerIdData) => {
            this.playerId = data.id;
        });
    }
}
