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

import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ServerGameObject } from './ServerGameObject';
import { InventoryUpdatedData } from '../client/shared/InventoryUpdatedData';
import { ClientHandler } from './ClientHandler';
import { UseItemData } from '../client/shared/UseItemData';

export class InventoryDisplay extends ServerGameObject {
    shouldBeSerialized = false;

    constructor() {
        super();

        this.messageHandler.on("useItem", (sender, data: UseItemData) => {
            sender.player.inventory.useItemId(data.id);
        });
    }

    emitInventoryUpdate(client: ClientHandler, update: InventoryUpdatedData) {
        this.emitTo(client, "update", update);
    }

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: " ",
            x: 0,
            y: 0,
            z: 0,
            prefab: "inventory",
            data: {}
        };
    }
}


