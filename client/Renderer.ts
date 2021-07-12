
export class Renderer {
    private context: CanvasRenderingContext2D;
    private tilemap: Array<Array<string>>;
    public width: number;
    public height: number;

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
        this.fillTiles(0, 0, this.width, this.height, '.');
    }

    public inBounds(x: number, y: number) {
        return 0 < x && x < this.width && 0 < y && y < this.height;
    }

    public fillTiles(xFrom: number, yFrom: number, xTo: number, yTo: number, char: string) {
        for(let x = xFrom; x < xTo; x++)
            for(let y = yFrom; y < yTo; y++)
                this.setTile(x, y, char);
    }

    public setTile(x: number, y: number, char: string) {
        if(this.inBounds(x, y))
            this.tilemap[x][y] = char;
    }

    public getTile(x: number, y: number) {
        return this.tilemap[x][y];
    }

    public render() {
        for (let x = 0; x < this.width; x++)
            for (let y = 0; y < this.height; y++) {
                this.context.fillStyle = "#ff0000";
                this.context.fillText(this.getTile(x, y), x * 10, y * 10);
            }
    }
}


