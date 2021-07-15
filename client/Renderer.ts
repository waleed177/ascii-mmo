import { Vector3 } from "./shared/Vector3.js";

//TODO REMOVE CODE DUPLICATION :(
export class Renderer {
    private context: CanvasRenderingContext2D;
    private tilemap: Array<Array<Array<string>>>;
    public width: number;
    public height: number;
    public depth: number;
    public tileWidth: number = 10;
    public tileHeight: number = 10;

    public cameraPosition: Vector3 = new Vector3(0, 0, 0);

    constructor(context: CanvasRenderingContext2D, width: number, height: number, depth: number) {
        this.context = context;
        this.tilemap = new Array<Array<Array<string>>>();

        context.clearRect(0, 0, 600, 600);
        context.font = "10px serif";
        
        for(let x = 0; x < width; x++) {
            let row = new Array<Array<string>>();
            for(let y = 0; y < height; y++) {
                let thingy = new Array<string>();
                for(let z = 0; z < depth; z++) {
                    thingy.push(" ");
                }
                row.push(thingy);
            }
            this.tilemap.push(row);
        }

        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    public clear() {
        this.fillTilesScreenCoord(0, 0, 0, this.width, this.height, this.depth, ' ');
    }

    private getScreenPosition(vector: Vector3) {
        return this.cameraPosition.sub(vector);
    }

    public inBounds(x: number, y: number, z: number) {
        x -= this.cameraPosition.x;
        y -= this.cameraPosition.y;
        z -= this.cameraPosition.z;
        return this.inScreenBounds(x, y, z);
    }

    private inScreenBounds(x: number, y: number, z: number) {
        return 0 <= x && x < this.width && 0 <= y && y < this.height && 0 <= z && z < this.depth;
    }

    public fillTiles(xFrom: number, yFrom: number, zFrom: number, xTo: number, yTo: number, zTo: number, char: string) {
        for(let x = xFrom; x <= xTo; x++)
            for(let y = yFrom; y <= yTo; y++)
                for(let z = zFrom; z <= zTo; z++)
                    this.setTile(x, y, z, char);
    }

    public fillTilesScreenCoord(xFrom: number, yFrom: number, zFrom: number, xTo: number, yTo: number, zTo: number, char: string) {
        for(let x = xFrom; x <= xTo; x++)
            for(let y = yFrom; y <= yTo; y++)
                for(let z = zFrom; z <= zTo; z++)
                    this.setTileScreenCoord(x, y, z, char);
    }

    public writeText(x: number, y: number, z: number, str: string) {
        for(let i = 0; i < str.length; i++) {
            this.setTile(x + i, y, z, str[i]);
        }
    }

    public writeTextScreenCoord(x: number, y: number, z: number, str: string, centered: boolean = false) {
        if (centered) {
            x -= Math.floor(str.length/2);
        }
        for(let i = 0; i < str.length; i++) {
            this.setTileScreenCoord(x + i, y, z, str[i]);
        }
    }

    public setTile(x: number, y: number, z: number, char: string) {
        if(this.inBounds(x, y, z))
            this.tilemap[x - this.cameraPosition.x][y - this.cameraPosition.y][z - this.cameraPosition.z] = char;
    }

    public setTileScreenCoord(x: number, y: number, z: number, char: string) {
        if(this.inScreenBounds(x, y, z))
            this.tilemap[x][y][z] = char;
    }

    public getTile(x: number, y: number, z: number) {
        if(this.inBounds(x, y, z))
            return this.tilemap[x - this.cameraPosition.x][y - this.cameraPosition.y][z - this.cameraPosition.z];
        else
            return ' ';    
    }

    public getTileScreenCoord(x: number, y: number, z: number) {
        if(this.inScreenBounds(x, y, z))
            return this.tilemap[x][y][z];
        else
            return ' ';    
    }

    public render() {
        let z = this.cameraPosition.z;
        for (let x = 0; x < this.width; x++)
            for (let y = 0; y < this.height; y++) {
                this.context.fillStyle = "#ffffff";
                this.context.fillText(this.getTileScreenCoord(x, y, z), x * this.tileWidth, this.tileHeight * (y+1));
            }
    }
}


