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

import { RecieveItemListData } from '../client/shared/RecieveItemListData';
import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ClientHandler } from './ClientHandler';
import { ServerGameObject } from './ServerGameObject';

export class QuestsDisplay extends ServerGameObject {
    shouldBeSerialized = false;

    constructor() {
        super();

    }

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: " ",
            x: 0,
            y: 0,
            z: 0,
            prefab: "questDisplay",
            data: {
                displayItems: [ ]
            } as RecieveItemListData
        };
    }

    emitDisplayUpdate(client: ClientHandler, items: Array<string>) {
        this.emitTo(client, 'recieveItems', {
            displayItems: items
        } as RecieveItemListData);
    }
}