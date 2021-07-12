import { GameObject } from "./GameObject.js";

export class World {
    protected children = new Map<number, GameObject>();

    constructor() {
    }

    update() {
        this.children.forEach((gameObject, key, map) => {
            gameObject.update();
        });
    }

    draw() {
        this.children.forEach((gameObject, key, map) => {
            gameObject.draw();
        });
    }

    addChild(gameObject: GameObject) {
        gameObject.world = this;
        this.children.set(gameObject.id, gameObject);
    }

    getChild(id: number) {
        return this.children.get(id);
    }
}
