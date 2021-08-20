
export class TileMeta {
    public displayHeight: number = 1
    public displayColor: string = "white"

    constructor() { }
    setHeight(v: number): TileMeta { this.displayHeight = v; return this }
    setColor(v: string): TileMeta { this.displayColor = v; return this }

    static byTile(tile: string): TileMeta {
        if (!TILE_METADATA[tile]) return DEFAULT_METADATA
        return TILE_METADATA[tile]
    }
}

const DEFAULT_METADATA = new TileMeta().setColor("white").setHeight(1)
var TILE_METADATA: { [key: string]: TileMeta } = {
    "P": new TileMeta().setColor("#ffbbbb"),
    "p": new TileMeta().setColor("#ff4444"),
};
["┌", "─", "┐", "│", "#"].forEach(t => { TILE_METADATA[t] = new TileMeta().setHeight(3).setColor("white") })

