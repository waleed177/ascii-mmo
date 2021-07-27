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
import { Mob } from './Mob';
import { MovingThing } from './MovingThing';

type WorldSaveFormat = {
    spawnPoint: Vector3,
    gameObjects: Array<ServerSerializedGameObject>
}

export class NetworkWorld extends World {
    server: Server;
    private freeId = 0;

    public instantiator = new ServerPrefabInstantiator();
    spawnPoint: Vector3 = new Vector3(0, 0, 0);

    constructor(server: Server) {
        super();
        this.server = server;
        
        this.instantiator.bind("tileMap", TileMapObject);
        this.instantiator.bind("npc", NPC);
        this.instantiator.bind("mob", Mob);
        this.instantiator.bind("movingThing", MovingThing);
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
        let data = new Array<ServerSerializedGameObject>();
        
        this.children.forEach((gameObject: ServerGameObject, key, map) => {
            if(gameObject.shouldBeSerialized)
                data.push(gameObject.serialize());
        });

        let res: WorldSaveFormat = {
            spawnPoint: this.spawnPoint,
            gameObjects: data
        };
        return res;
    }

    save() {
        console.log("Saved to: " + path.join(__dirname, 'test.json'));
        fs.writeFile(path.join(__dirname, '../test.json'), JSON.stringify(this.serialize()), ()=>{});
    }

    load() {
        try {
            const data: WorldSaveFormat = JSON.parse(fs.readFileSync(path.join(__dirname, '../test.json'), 'utf8'));
            
            data.gameObjects.forEach((objData, index, array) => {
                var gameObject = this.instantiator.instantiateServerObject(objData);
                this.addChild(gameObject);
            });

            this.spawnPoint = new Vector3(data.spawnPoint.x, data.spawnPoint.y, data.spawnPoint.z);
            
            console.log("loaded world!");
        } catch (err) {
            console.error(err);
        }
    }

    convertTextFileToTileMapObject(filePath: string): TileMapObject {
        return this.convertTextToTileMap(fs.readFileSync(path.join(__dirname, filePath), 'utf8'));
    }

    private convertTextToTileMap(text: string) {
        let res = new TileMapObject();
        res.setupWithText(text);
        return res;
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

    findEntitiesCollidingWithPoint(position: Vector3) {
        let res: Array<NetworkEntity> = [];
        this.children.forEach((gameObject, key, map) => {
            if(gameObject instanceof NetworkEntity && gameObject.preciseCollidesWithPoint(position)) 
                res.push(gameObject);
        });
        return res;
    }
}
