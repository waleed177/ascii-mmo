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

import { NetworkWorld } from "./NetworkWorld.js";
import { EmitForGameObjectData } from "./shared/EmitForGameObjectData.js";
import { GameObject } from "./shared/GameObject.js";
import { MessageHandler } from "./shared/MessageHandler.js";
import { Socket } from "./Socket.js";

export class ClientGameObject extends GameObject {
    world: NetworkWorld;
    messageHandler: MessageHandler<Socket>;

    emit(type: string, data: object) {
        this.world.socket.emit('emitForGameObject', {
            id: this.id,
            json: {
                type: type,
                json: data
            }
        } as EmitForGameObjectData);
    }
}
