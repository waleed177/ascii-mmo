export class TileMap {
    public tilemap: Array<Array<Array<string>>>;
    public width: number;
    public height: number;
    public depth: number;

    constructor(width: number, height: number, depth: number) {
        this.tilemap = new Array<Array<Array<string>>>();
        
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
        this.fillTiles(0, 0, 0, this.width, this.height, this.depth, ' ');
    }

    public inBounds(x: number, y: number, z: number) {
        return 0 <= x && x < this.width && 0 <= y && y < this.height && 0 <= z && z < this.depth;
    }

    public fillTiles(xFrom: number, yFrom: number, zFrom: number, xTo: number, yTo: number, zTo: number, char: string) {
        for(let x = xFrom; x <= xTo; x++)
            for(let y = yFrom; y <= yTo; y++)
                for(let z = zFrom; y <= zTo; z++)
                    this.setTile(x, y, z, char);
    }

    public writeText(x: number, y: number, z: number, str: string) {
        for(let i = 0; i < str.length; i++) {
            this.setTile(x + i, y, z, str[i]);
        }
    }

    public setTile(x: number, y: number, z: number, char: string) {
        if(this.inBounds(x, y, z))
            this.tilemap[x][y][z] = char;
    }

    public getTile(x: number, y: number, z: number) {
        if(this.inBounds(x, y, z))
            return this.tilemap[x][y][z];
        else
            return ' ';    
    }

    useMap(tilemap: string[][][]) {
        this.tilemap = tilemap;
    }
}
