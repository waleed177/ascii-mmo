type TileInfo = {
    obtainable: boolean;
    name: string;
};

export var tilesInfo = new Map<string, TileInfo>([
    ["│", {
        name: "wall",
        obtainable: false
    }],
    [".", {
        name: "floor",
        obtainable: false
    }]
]);
