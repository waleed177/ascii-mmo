//#region PREAMBLE
/*
    This is an ASCII MMO game.
    Copyright (C) 2021 waleed177 <potatoxel@gmail.com>
    Copyright (C) 2021 metamuffin <muffin@metamuffin.org>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, version 3 of the
    License only.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
//#endregion

import { Vector3 } from "./shared/Vector3.js";

//TODO REMOVE CODE DUPLICATION :(
//TODO, RENDERER SHOULD NOT NEED DEPTH, ONLY CHECK IF camera z is THE SAME AS TILE
export class Renderer {
    private context: CanvasRenderingContext2D;
    private tilemap: Array<Array<Array<string>>>;
    public width: number;
    public height: number;
    public depth: number;
    public tileWidth: number = 10;
    public tileHeight: number = 10;

    public cameraPosition: Vector3 = new Vector3(0, 0, 0);

    constructor(context: CanvasRenderingContext2D, depth: number) {
        this.context = context;
        this.tilemap = new Array<Array<Array<string>>>();

        context.clearRect(0, 0, 600, 600);
        context.font = "10px serif";
        
        const resize = () => {
            this.width = Math.floor(window.innerWidth / this.tileWidth)
            this.height = Math.floor(window.innerHeight / this.tileHeight)
            this.context.canvas.width = this.width * this.tileWidth;
            this.context.canvas.height = this.height * this.tileHeight;
            this.tilemap = []
            for(let x = 0; x < this.width; x++) {
                let row = new Array<Array<string>>();
                for(let y = 0; y < this.height; y++) {
                    let thingy = new Array<string>();
                    for(let z = 0; z < depth; z++) {
                        thingy.push(" ");
                    }
                    row.push(thingy);
                }
                this.tilemap.push(row);
            }
        }
        
        this.width = 0;
        this.height = 0;
        this.depth = depth;

        resize()
        window.addEventListener("resize", () => resize())        
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


