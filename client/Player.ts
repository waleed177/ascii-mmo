import { CharSprite } from "./CharSprite.js";
import { Entity } from "./Entity.js";
import { Vector2 } from "./shared/Vector2.js";
import { keyboard } from "./Client.js";
export class Player extends Entity {
    constructor() {
        super();
        this.sprite = new CharSprite(new Vector2(0, 0), 'P');
    }

    init(data: object) {

    }

    update() {
        if (this.world.playerId == this.id)
            this.handleMovement();
    }

    private handleMovement() {
        if (keyboard.isKeyDown("d") || keyboard.isKeyDown("D")) {
            this.position.x += 1;
            this.sendNewPosition();
        }

        if (keyboard.isKeyDown("a") || keyboard.isKeyDown("A")) {
            this.position.x -= 1;
            this.sendNewPosition();
        }

        if (keyboard.isKeyDown("s") || keyboard.isKeyDown("S")) {
            this.position.y += 1;
            this.sendNewPosition();
        }

        if (keyboard.isKeyDown("w") || keyboard.isKeyDown("W")) {
            this.position.y -= 1;
            this.sendNewPosition();
        }
    }
}
