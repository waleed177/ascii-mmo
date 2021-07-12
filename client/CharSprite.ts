import { Sprite } from "./shared/Sprite.js";
import { renderer } from "./Client.js";
import { Vector2 } from "./shared/Vector2.js";

export class CharSprite extends Sprite {
    char: string;

    constructor(position: Vector2, char: string) {
        super(position);
        this.char = char;
    }

    public draw(position: Vector2): void {
        renderer.setTile(position.x + this.position.x, position.y + this.position.y, this.char);
    }
}