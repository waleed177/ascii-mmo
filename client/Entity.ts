import { ClientGameObject } from "./ClientGameObject.js";
import { EntityChangedPositionData } from "./shared/EntityChangedPositionData.js";
import { Sprite } from "./shared/Sprite.js";
import { Vector3 } from "./shared/Vector3.js";
import { SettingPositionData } from "./shared/SettingPositionData.js";
import { Socket } from "./Socket.js";
import { SpawnGameObjectData } from "./shared/SpawnGameObjectData.js";
import { CharSprite } from "./CharSprite.js";

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

    protected sendNewPosition(position: Vector3 = null) {
        let pos = position ? position : this.position;
        this.emit(
            'settingPosition',
            {
                x: pos.x,
                y: pos.y,
                z: pos.z
            } as SettingPositionData
        )
    }

    public init(data: SpawnGameObjectData) {
        this.sprite = new CharSprite(new Vector3(0, 0, 0), data.sprite);
        this.position = new Vector3(data.x, data.y, data.z);
    }
}
