import { Entity } from "../Entity.js";
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

    findEntitiesWithinRadius(position: Vector3, radius: number) {
        let res: Array<Entity> = [];
        this.children.forEach((gameObject, key, map) => {
            if(gameObject instanceof Entity) {
                if(gameObject.position.sub(position).length() <= radius) {
                    res.push(gameObject);
                }
            }
        });
        return res;
    }
}
