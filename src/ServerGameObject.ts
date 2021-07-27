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

import { GameObject } from '../client/shared/GameObject';
import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ClientHandler } from './ClientHandler';
import { NetworkWorld } from './NetworkWorld';
import { EmitForGameObjectData } from '../client/shared/EmitForGameObjectData';
import { MessageHandler } from '../client/shared/MessageHandler';
import { ServerSerializedGameObject } from './ServerSerializedGameObject';
import { Vector3 } from '../client/shared/Vector3';

export class ServerGameObject extends GameObject {
    world: NetworkWorld;
    messageHandler: MessageHandler<ClientHandler>;
    shouldBeSerialized: boolean = true;

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: " ",
            x: -1,
            y: -1,
            z: -1,
            prefab: "entityCharSprite",
            data: {}
        }
    }

    getPrivateData(): any {
        return {};
    }

    serialize(): ServerSerializedGameObject {
        return {
            publicData: this.getPublicData(),
            privateData: this.getPrivateData()
        }
    }

    deserialize(data: ServerSerializedGameObject) {

    }

    emit(type: string, data: any, except: ClientHandler[] = null) {
        this.world.server.broadcast('emitForGameObject', {
            id: this.id,
            json: {
                type: type,
                json: data
            }
        } as EmitForGameObjectData, except);
    }

    emitTo(client: ClientHandler, type: string, data: any) {
        client.emit('emitForGameObject', {
            id: this.id,
            json: {
                type: type,
                json: data
            }
        } as EmitForGameObjectData);
    }


    processCollisionWith(obj: ServerGameObject, pos: Vector3) {

    }
}
