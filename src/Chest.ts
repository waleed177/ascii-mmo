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
import { UseItemData } from '../client/shared/UseItemData';
import { ClientHandler } from './ClientHandler';
import { Inventory } from './Inventory';
import { NetworkEntity } from './NetworkEntity';

export class Chest extends NetworkEntity {
    private inventory: Inventory;

    constructor() {
        super();
        this.prefab = "chest";
        this.sprite = "█";

        this.data = {
            displayItems: []
        }
        
        this.messageHandler.on("useItem", (sender, data: UseItemData) => {
            if(data.id >= this.inventory.items.length) return;
            let name = this.inventory.getItemName(data.id);

            let tookItem = this.inventory.takeItem(
                name,
                1
            );
            if(tookItem)
                sender.player.inventory.addItem({
                    name: name,
                    quantity: 1
                });
        });
    }

    ready() {
        this.inventory = new Inventory(null);
        this.inventory.updateDisplay = () => {this.updateData()};

        this.inventory.addItem({
            name: "waw",
            quantity: 10
        });
    }

    use(clientHandler: ClientHandler) {
        this.emitTo(clientHandler, "open", {});
    }

    generateDisplay() {
        let res = new Array<string>();
        this.inventory.items.forEach((value, index, array) => {
            res.push(value.name + " " + value.quantity);
        });
        return res;
    }

    updateData() {
        let data = this.data as RecieveItemListData;
        data.displayItems = this.generateDisplay();
        this.emit("recieveItems", data);
    }
}
