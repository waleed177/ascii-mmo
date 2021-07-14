import { Vector2 } from "./shared/Vector2.js";

export class Renderer {
    private context: CanvasRenderingContext2D;
    private tilemap: Array<Array<string>>;
    public width: number;
    public height: number;
    public tileWidth: number = 10;
    public tileHeight: number = 10;

    public cameraPosition: Vector2 = new Vector2(0, 0);

    constructor(context: CanvasRenderingContext2D, width: number, height: number) {
        this.context = context;
        this.tilemap = new Array<Array<string>>();

        context.clearRect(0, 0, 600, 600);
        context.font = "10px serif";
        
        for(let x = 0; x < width; x++) {
            let row = new Array<string>();
            for(let y = 0; y < height; y++) {
                row.push(".");
            }
            this.tilemap.push(row);
        }

        this.width = width;
        this.height = height;
    }

    public clear() {
        this.fillTilesScreenCoord(0, 0, this.width, this.height, ' ');
    }

    private getScreenPosition(vector: Vector2) {
        return this.cameraPosition.sub(vector);
    }

    public inBounds(x: number, y: number) {
        x -= this.cameraPosition.x;
        y -= this.cameraPosition.y;
        return this.inScreenBounds(x, y);
    }

    private inScreenBounds(x: number, y: number) {
        return 0 <= x && x < this.width && 0 <= y && y < this.height;
    }

    public fillTiles(xFrom: number, yFrom: number, xTo: number, yTo: number, char: string) {
        for(let x = xFrom; x <= xTo; x++)
            for(let y = yFrom; y <= yTo; y++)
                this.setTile(x, y, char);
    }

    public fillTilesScreenCoord(xFrom: number, yFrom: number, xTo: number, yTo: number, char: string) {
        for(let x = xFrom; x <= xTo; x++)
            for(let y = yFrom; y <= yTo; y++)
                this.setTileScreenCoord(x, y, char);
    }

    public writeText(x: number, y: number, str: string) {
        for(let i = 0; i < str.length; i++) {
            this.setTile(x + i, y, str[i]);
        }
    }

    public writeTextScreenCoord(x: number, y: number, str: string) {
        for(let i = 0; i < str.length; i++) {
            this.setTileScreenCoord(x + i, y, str[i]);
        }
    }

    public setTile(x: number, y: number, char: string) {
        if(this.inBounds(x, y))
            this.tilemap[x - this.cameraPosition.x][y - this.cameraPosition.y] = char;
    }

    public setTileScreenCoord(x: number, y: number, char: string) {
        if(this.inScreenBounds(x, y))
            this.tilemap[x][y] = char;
    }

    public getTile(x: number, y: number) {
        if(this.inBounds(x, y))
            return this.tilemap[x - this.cameraPosition.x][y - this.cameraPosition.y];
        else
            return ' ';    
    }

    public getTileScreenCoord(x: number, y: number) {
        if(this.inScreenBounds(x, y))
            return this.tilemap[x][y];
        else
            return ' ';    
    }

    public render() {
        for (let x = 0; x < this.width; x++)
            for (let y = 0; y < this.height; y++) {
                this.context.fillStyle = "#ffffff";
                this.context.fillText(this.getTileScreenCoord(x, y), x * this.tileWidth, this.tileHeight * (y+1));
            }
    }
}


