import { keyboard, renderer } from "./Client.js";
import { Entity } from "./Entity.js";
import { RecieveTileMapData } from "./shared/RecieveTileMapData.js";
import { SpawnGameObjectData } from "./shared/SpawnGameObjectData.js";
import { Vector3 } from "./shared/Vector3.js";

export class TileMapObject extends Entity {
    private tilemap: Array<Array<Array<string>>>;
    private size: Vector3;

    constructor() {
        super();

        this.messageHandler.on("map", (sender, data: RecieveTileMapData) => {
            this.tilemap = data.tilemap;
            this.size = new Vector3(data.width, data.height, data.depth);
        });
    }

    init(spawnData: SpawnGameObjectData) {
        super.init(spawnData);
        let data = spawnData.data as RecieveTileMapData;
        this.tilemap = data.tilemap;
        this.size = new Vector3(data.width, data.height, data.depth);
    }

    draw(){
        if (this.tilemap != null) {
            var z = renderer.cameraPosition.z - this.position.z;
            if ( 0 <= z && z < this.size.z)
                for(let x = 0; x < this.size.x; x++)
                    for(let y = 0; y < this.size.y; y++) {
                        if(this.tilemap[x][y][z] != " ")
                            renderer.setTile(this.position.x + x, this.position.y + y, this.position.z + z, this.tilemap[x][y][z]);
                        if(keyboard.isKeyDown("t"))
                            renderer.setTile(this.position.x + x, this.position.y + y, this.position.z + z, "T");
                    }
        }
    }
}
