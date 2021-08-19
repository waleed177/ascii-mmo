import { Vector3 } from "../../client/shared/Vector3";
import { TileMapObject } from "../TileMapObject";

export type PeriodicFunction = {
    func: (tileMap: TileMapObject, localPosition: Vector3) => void;
    period: number;
    timeLeft: number;
};
