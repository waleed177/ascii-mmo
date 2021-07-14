export class TileMap {
    public tilemap: Array<Array<string>>;
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.tilemap = new Array<Array<string>>();
        
        for(let x = 0; x < width; x++) {
            let row = new Array<string>();
            for(let y = 0; y < height; y++) {
                row.push(" ");
            }
            this.tilemap.push(row);
        }

        this.width = width;
        this.height = height;
    }

    public clear() {
        this.fillTiles(0, 0, this.width, this.height, ' ');
    }

    public inBounds(x: number, y: number) {
        return 0 <= x && x < this.width && 0 <= y && y < this.height;
    }

    public fillTiles(xFrom: number, yFrom: number, xTo: number, yTo: number, char: string) {
        for(let x = xFrom; x <= xTo; x++)
            for(let y = yFrom; y <= yTo; y++)
                this.setTile(x, y, char);
    }

    public writeText(x: number, y: number, str: string) {
        for(let i = 0; i < str.length; i++) {
            this.setTile(x + i, y, str[i]);
        }
    }

    public setTile(x: number, y: number, char: string) {
        if(this.inBounds(x, y))
            this.tilemap[x][y] = char;
    }

    public getTile(x: number, y: number) {
        if(this.inBounds(x, y))
            return this.tilemap[x][y];
        else
            return ' ';    
    }
}
