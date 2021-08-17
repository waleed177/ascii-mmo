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

import { Vector3 } from "../../client/shared/Vector3";
import { Chest } from "../Chest";
import { ClientHandler } from "../ClientHandler";
import { NetworkWorld } from "../NetworkWorld";
import { tileManager } from "../tiles/Tiles";
import { Item } from "./Item";

class ItemManager {
    public items = new Map<string, Item>();
}
export var itemManager = new ItemManager();

interface ItemConstructor {
    new(): Item
}

function addItem(item: ItemConstructor) {
    let instance = new item();
    itemManager.items.set(instance.id, instance);
}

class ChestItem extends Item {
    public id = "chest";
    public displayName = "Chest";

    public getTile(world: NetworkWorld, position: Vector3) {
        return tileManager.tiles.get("chest");
    }

    public constructEntity(world: NetworkWorld, position: Vector3) {
        return new Chest();
    }

    public isPlacable(world: NetworkWorld) {
        return true;
    }
}
addItem(ChestItem);

class FoodItem extends Item {
    public id = "move3r";
    public displayName = "Move 3 R";

    public useItem(clientHandler: ClientHandler) {
        clientHandler.player.position.x += 3;
        clientHandler.player.emitPosition();
        return true;
    }
}
addItem(FoodItem);