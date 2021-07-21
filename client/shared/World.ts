import { GameObject } from "./GameObject.js";
import { Vector3 } from "./Vector3.js";

export class World {
    protected children = new Map<number, GameObject>();
    protected queuedToBeRemovedChildren = new Array<number>();

    constructor() {
    }

    update() {
        this.queuedToBeRemovedChildren.forEach((value, index, array) => {
            this.children.delete(value);
        });

        this.children.forEach((gameObject, key, map) => {
            gameObject.update();
        });
    }

    draw() {
        this.children.forEach((gameObject, key, map) => {
            gameObject.draw();
        });
    }

    guiDraw() {
        this.children.forEach((gameObject, key, map) => {
            gameObject.guiDraw();
        });
    }

    addChild(gameObject: GameObject) {
        gameObject.world = this;
        gameObject.ready();
        this.children.set(gameObject.id, gameObject);
    }

    removeChild(gameObject: GameObject) {
        this.children.delete(gameObject.id);
    }

    removeChildById(id: number) {
        this.children.delete(id);
    }

    queueRemoveChild(gameObject: GameObject) {
        this.queuedToBeRemovedChildren.push(gameObject.id);
    }

    getChild(id: number) {
        return this.children.get(id);
    }

    findCollisionsWithPoint(point: Vector3)   {
        let res: Array<GameObject> = [];
        this.children.forEach((gameObject, key, map) => {
            if(gameObject.collidesWithPoint(point)) {
                res.push(gameObject);
            }
        });
        return res;
    }
}
