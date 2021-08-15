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

import { InventoryUpdatedData } from '../client/shared/InventoryUpdatedData';
import { ItemData } from '../client/shared/Item';
import { ClientHandler } from './ClientHandler';
import { InventoryDisplay } from './InventoryDisplay';

export class Inventory {
    public items = new Array<ItemData>();
    private clientHandler: ClientHandler;
    public updateDisplay: () => void;
    private selectedItemId: number = -1;

    constructor(clientHandler: ClientHandler) {
        this.clientHandler = clientHandler;
    }

    get selectedItem() {
        if (0 <= this.selectedItemId && this.selectedItemId < this.items.length)
        return this.items[this.selectedItemId];
    }

    selectItemId(id: number) {
        if(0 <= id && id < this.items.length)
            this.selectedItemId = id;
    }

    useItemId(id: number) {  
        this.selectItemId(id);
        console.log(this.selectedItem);
        if(this.selectedItem.name == "chest") {
            this.clientHandler.player.world.server.worldEditor.setEditModeFor(
                this.clientHandler, true, "$position"
            );
        }
        this.save();
        this.updateDisplay();
    }

    addItem(itemData: ItemData) {
        let found = false;
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i].name == itemData.name) {
                this.items[i].quantity += itemData.quantity;
                found = true;
                break;
            }
        }
        if(!found)
            this.items.push(itemData);
        this.save();
        this.updateDisplay();
    }

    private indexOfItem(name: string): number {
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i].name == name) {
                return i;
            }
        }
        return -1;
    }

    hasItem(name: string, amount: number): boolean {
        let index = this.indexOfItem(name);
        if (index == -1) return false;
        return this.items[index].quantity >= amount;
    }

    takeItem(name: string, amount: number): boolean {
        if(!this.hasItem(name, amount)) return false;
        let index = this.indexOfItem(name);
        let item = this.items[index];
        item.quantity -= amount;
        if(item.quantity <= 0) {
            this.items.splice(index, 1);
        }
        this.save();
        this.updateDisplay();
        return true;
    }

    getItemName(location: number) {
        return this.items[location].name;
    }
    
    load() {
        this.items = this.clientHandler.userInfo.inventory;
        this.updateDisplay();
    }

    save() {
        if(this.clientHandler != null)
            this.clientHandler.userInfo.markModified("inventory");       
    }
}
