import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ServerGameObject } from './ServerGameObject';
import { TileMap } from '../client/shared/TileMap';
import { RecieveTileMapData } from '../client/shared/RecieveTileMapData';
import { Vector3 } from '../client/shared/Vector3';
import { NetworkEntity } from './NetworkEntity';
import { ServerSerializedGameObject } from './ServerSerializedGameObject';

export class TileMapObject extends NetworkEntity {
    public tilemap: TileMap;


    setup(width: number, height: number, depth: number) {
        this.tilemap = new TileMap(width, height, depth);
    }

    deserialize(data: ServerSerializedGameObject) {
        super.deserialize(data);
        let publicData = data.publicData.data as RecieveTileMapData;
        this.setup(publicData.width, publicData.height, publicData.depth);
        this.tilemap.useMap(publicData.tilemap);
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
