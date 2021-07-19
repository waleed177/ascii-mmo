import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ServerGameObject } from './ServerGameObject';
import { PlaceTileData } from '../client/shared/PlaceTileData';
import { Vector3 } from '../client/shared/Vector3';
import { TileMapObject } from './TileMapObject';


export class WorldEditor extends ServerGameObject {
    constructor() {
        super();

        this.messageHandler.on("place", (sender, data: PlaceTileData) => {
            var colls = this.world.findCollisionsWithPoint(new Vector3(data.x, data.y, data.z));
            colls.forEach((gameObject, index, array) => {
                if (gameObject instanceof TileMapObject) {
                    gameObject.tilemap.setTile(
                        data.x-gameObject.position.x,
                        data.y-gameObject.position.y,
                        data.z, data.tile);
                    gameObject.commitChanges();
                }
            });
        });
    }

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: " ",
            x: 0,
            y: 0,
            z: 0,
            prefab: "worldEditor",
            data: {}
        };
    }
}
