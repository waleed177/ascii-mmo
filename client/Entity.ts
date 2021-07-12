import { ClientGameObject } from "./ClientGameObject.js";
import { EntityChangedPositionData } from "./shared/EntityChangedPositionData.js";
import { Sprite } from "./shared/Sprite.js";
import { Vector2 } from "./shared/Vector2.js";
import { SettingPositionData } from "./shared/SettingPositionData.js";
import { Socket } from "./Socket.js";

export class Entity extends ClientGameObject {
    public sprite: Sprite;
    public position: Vector2;

    constructor() {
        super();
        this.position = new Vector2(0, 0);
        this.messageHandler.on("settingPosition", (sender: Socket, data: SettingPositionData) => {
            this.position = new Vector2(data.x, data.y);
        });
    }

    public draw() {
        this.sprite.draw(this.position);
    }

    public update() {

    }

    public init(data: object) {
        
    }

    protected sendNewPosition() {
        this.emit(
            'settingPosition',
            {
                x: this.position.x,
                y: this.position.y
            } as SettingPositionData
        )
    }
}
