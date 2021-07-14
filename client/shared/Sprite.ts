import { Vector3 } from "./Vector3.js";

export abstract class Sprite {
    public position: Vector3;

    constructor(position: Vector3) {
        this.position = position;
    }

    abstract draw(position: Vector3): void;
}
