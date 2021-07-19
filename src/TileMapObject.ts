import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ServerGameObject } from './ServerGameObject';
import { TileMap } from '../client/shared/TileMap';
import { RecieveTileMapData } from '../client/shared/RecieveTileMapData';
import { Vector3 } from '../client/shared/Vector3';
import { NetworkEntity } from './NetworkEntity';

export class TileMapObject extends NetworkEntity {
    public tilemap: TileMap;

    constructor(width: number, height: number, depth: number) {
        super();
        this.tilemap = new TileMap(width, height, depth);
    }

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: " ",
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            prefab: "tileMap",
            data: {
                tilemap: this.tilemap.tilemap,
                width: this.tilemap.width,
                height: this.tilemap.height,
                depth: this.tilemap.depth
            } as RecieveTileMapData
        };
    }

    public commitChanges() {
        this.emit("map", {
            tilemap: this.tilemap.tilemap,
            width: this.tilemap.width,
            height: this.tilemap.height,
            depth: this.tilemap.depth
        } as RecieveTileMapData);
    }

    collidesWithPoint(point: Vector3) {
        return this.position.x <= point.x && point.x < this.position.x + this.tilemap.width
            && this.position.y <= point.y && point.y < this.position.y + this.tilemap.height;
    }
}
