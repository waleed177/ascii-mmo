import { ClientGameObject } from "./ClientGameObject.js";
import { EntityChangedPositionData } from "./shared/EntityChangedPositionData.js";
import { Sprite } from "./shared/Sprite.js";
import { Vector3 } from "./shared/Vector3.js";
import { SettingPositionData } from "./shared/SettingPositionData.js";
import { Socket } from "./Socket.js";

export class Entity extends ClientGameObject {
    public sprite: Sprite;
    public position: Vector3;

    constructor() {
        super();
        this.position = new Vector3(0, 0, 0);
        this.messageHandler.on("settingPosition", (sender: Socket, data: SettingPositionData) => {
            this.position = new Vector3(data.x, data.y, data.z);
        });
    }

    public draw() {
        this.sprite.draw(this.position);
    }

    public update() {

    }

    protected sendNewPosition() {
        this.emit(
            'settingPosition',
            {
                x: this.position.x,
                y: this.position.y,
                z: this.position.z
            } as SettingPositionData
        )
    }
}
