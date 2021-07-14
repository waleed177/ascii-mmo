import { Sprite } from "./shared/Sprite.js";
import { renderer } from "./Client.js";
import { Vector3 } from "./shared/Vector3.js";

export class CharSprite extends Sprite {
    char: string;

    constructor(position: Vector3, char: string) {
        super(position);
        this.char = char;
    }

    public draw(position: Vector3): void {
        renderer.setTile(position.x + this.position.x, position.y + this.position.y, position.z + this.position.z, this.char);
    }
}