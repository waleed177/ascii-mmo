import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { World } from '../client/shared/World';
import { ClientHandler } from './ClientHandler';
import { RemoveGameObjectData } from '../client/shared/RemoveGameObjectData';
import { Server } from './Server';
import { ServerGameObject } from './ServerGameObject';
import * as fs from 'fs';
import * as path from 'path';
import { TileMapObject } from './TileMapObject';
import { NPC } from './NPC';
import { Vector3 } from '../client/shared/Vector3';
import { NetworkEntity } from './NetworkEntity';
import { ServerPrefabInstantiator } from './ServerPrefabInstantiator';
import { ServerSerializedGameObject } from './ServerSerializedGameObject';

export class NetworkWorld extends World {
    server: Server;
    private freeId = 0;

    private instantiator = new ServerPrefabInstantiator();

    constructor(server: Server) {
        super();
        this.server = server;
        
        this.instantiator.bind("tileMap", TileMapObject);
        this.instantiator.bind("npc", NPC);
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
        let res: Array<ServerSerializedGameObject> = [];
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

    load() {
        try {
            const data: Array<ServerSerializedGameObject> = JSON.parse(fs.readFileSync(path.join(__dirname, 'test.json'), 'utf8'));
            data.forEach((objData, index, array) => {
                var gameObject = this.instantiator.instantiateServerObject(objData);
                this.addChild(gameObject);
            });
            console.log("loaded world!");
        } catch (err) {
            console.error(err);
        }
    }

    private getFreeId() {
        return this.freeId++;
    }

    findEntitiesWithinRadius(position: Vector3, radius: number) {
        let res: Array<NetworkEntity> = [];
        this.children.forEach((gameObject, key, map) => {
            if(gameObject instanceof NetworkEntity) {
                if(gameObject.position.sub(position).length() <= radius) {
                    res.push(gameObject);
                }
            }
        });
        return res;
    }
}
