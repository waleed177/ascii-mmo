import {MessageHandler} from "./MessageHandler.js"
import { SpawnGameObjectData } from "./SpawnGameObjectData.js";
import { Vector3 } from "./Vector3.js";
import { World } from "./World.js";

export class GameObject {
    world: World;

    public messageHandler = new MessageHandler();
    public id: number;

    update() {

    }

    draw() {

    }

    guiDraw() {
        
    }

    public init(data: SpawnGameObjectData) {
        
    }

    public ready() {

    }

    public collidesWith(gameObject: GameObject) {
        return false;
    }

    public collidesWithPoint(position: Vector3) {
        return false;
    }
}
