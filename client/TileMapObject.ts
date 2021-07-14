import { renderer } from "./Client.js";
import { Entity } from "./Entity.js";
import { RecieveTileMapData } from "./shared/RecieveTileMapData.js";
import { Vector2 } from "./shared/Vector2.js";

export class TileMapObject extends Entity {
    private tilemap: Array<Array<string>>;
    private size: Vector2;

    constructor() {
        super();

        this.messageHandler.on("map", (sender, data: RecieveTileMapData) => {
            this.tilemap = data.tilemap;
            this.size = new Vector2(data.width, data.height);
        });
    }

    init(data: RecieveTileMapData) {
        this.tilemap = data.tilemap;
        this.size = new Vector2(data.width, data.height);
    }

    draw(){
        if (this.tilemap != null) {
            for(let x = 0; x < this.size.x; x++)
                for(let y = 0; y < this.size.y; y++)
                    if(this.tilemap[x][y] != " ")
                        renderer.setTile(this.position.x + x, this.position.y + y, this.tilemap[x][y]);
        }
    }
}
