import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ServerGameObject } from './ServerGameObject';
import { TileMap } from '../client/shared/TileMap';
import { RecieveTileMapData } from '../client/shared/RecieveTileMapData';

export class TileMapObject extends ServerGameObject {
    public tilemap: TileMap;

    constructor(width: number, height: number, depth: number) {
        super();
        this.tilemap = new TileMap(width, height, depth);
    }

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: " ",
            x: 0,
            y: 0,
            z: 0,
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
}
