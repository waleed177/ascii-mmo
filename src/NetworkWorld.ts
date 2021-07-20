import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { World } from '../client/shared/World';
import { ClientHandler } from './ClientHandler';
import { RemoveGameObjectData } from '../client/shared/RemoveGameObjectData';
import { Server } from './Server';
import { ServerGameObject } from './ServerGameObject';
import * as fs from 'fs';
import * as path from 'path';

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

    removeChild(gameObject: ServerGameObject) {
        super.removeChild(gameObject);
        this.server.broadcast('removeGameObject', {
            id: gameObject.id
        } as RemoveGameObjectData);
    }

    sendWorldTo(client: ClientHandler) {
        this.children.forEach((gameObject: ServerGameObject, key, map) => {
            client.emit('spawnGameObject', gameObject.getPublicData());
        });
    }

    serialize() {
        let res: Array<any> = [];
        this.children.forEach((gameObject: ServerGameObject, key, map) => {
            if(gameObject.shouldBeSerialized)
                res.push(gameObject.serialize());
        });
        return res;
    }

    save() {
        console.log("Saved to: " + path.join(__dirname, 'test.json'));
        fs.writeFile(path.join(__dirname, 'test.json'), JSON.stringify(this.serialize()), ()=>{});
    }

    private getFreeId() {
        return this.freeId++;
    }
}
