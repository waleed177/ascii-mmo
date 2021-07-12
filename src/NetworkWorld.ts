import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { World } from '../client/shared/World';
import { ClientHandler } from './ClientHandler';
import { Server } from './Server';
import { ServerGameObject } from './ServerGameObject';

export class NetworkWorld extends World {
    server: Server;
    private freeId = 0;

    constructor(server: Server) {
        super();
        this.server = server;
    }

    addChild(gameObject: ServerGameObject) {
        gameObject.world = this;
        gameObject.id = this.getFreeId();
        super.addChild(gameObject);
        this.server.broadcast('spawnGameObject', gameObject.getPublicData());
    }

    sendWorldTo(client: ClientHandler) {
        this.children.forEach((gameObject: ServerGameObject, key, map) => {
            client.emit('spawnGameObject', gameObject.getPublicData());
        });
    }

    private getFreeId() {
        return this.freeId++;
    }
}
