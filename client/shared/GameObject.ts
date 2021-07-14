import {MessageHandler} from "./MessageHandler.js"
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

    public init(data: any) {
        
    }

    public ready() {

    }
}
