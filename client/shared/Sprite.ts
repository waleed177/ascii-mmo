import { Vector2 } from "./Vector2.js";

export abstract class Sprite {
    public position: Vector2;

    constructor(position: Vector2) {
        this.position = position;
    }

    abstract draw(position: Vector2): void;
}
