//#region PREAMBLE
/*
    This is an ASCII MMO game.
    Copyright (C) 2021 waleed177 <potatoxel@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, version 3 of the
    License only.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
//#endregion

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
