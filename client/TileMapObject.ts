import { keyboard, renderer } from "./Client.js";
import { Entity } from "./Entity.js";
import { RecieveTileMapData } from "./shared/RecieveTileMapData.js";
import { SpawnGameObjectData } from "./shared/SpawnGameObjectData.js";
import { Vector3 } from "./shared/Vector3.js";
import { TileMap } from './shared/TileMap.js';

export class TileMapObject extends Entity {
    public tilemap: TileMap;
    private size: Vector3;

    constructor() {
        super();

        this.messageHandler.on("map", (sender, data: RecieveTileMapData) => {   
            if (this.tilemap == null
                || this.tilemap.width != data.width
                || this.tilemap.height != data.height
                || this.tilemap.depth != data.depth) {
                this.tilemap = new TileMap(data.width, data.height, data.depth);
            }
            this.tilemap.useMap(data.tilemap);
        });
    }

    init(spawnData: SpawnGameObjectData) {
        super.init(spawnData);
        let data = spawnData.data as RecieveTileMapData;
        this.tilemap = new TileMap(data.width, data.height, data.depth);
        this.tilemap.useMap(data.tilemap);
        this.size = new Vector3(data.width, data.height, data.depth);
    }

    draw(){
        if (this.tilemap != null) {
            var z = renderer.cameraPosition.z - this.position.z;
            if ( 0 <= z && z < this.size.z)
                for(let x = 0; x < this.size.x; x++)
                    for(let y = 0; y < this.size.y; y++) {
                        if(this.tilemap.getTile(x, y, z) != " ")
                            renderer.setTile(this.position.x + x, this.position.y + y, this.position.z + z, this.tilemap.getTile(x, y, z));
                        if(keyboard.isKeyDown("t"))
                            renderer.setTile(this.position.x + x, this.position.y + y, this.position.z + z, "T");
                    }
        }
    }

    collidesWithPoint(point: Vector3) {
        return this.position.x <= point.x && point.x < this.position.x + this.size.x
            && this.position.y <= point.y && point.y < this.position.y + this.size.y;
    }
}
