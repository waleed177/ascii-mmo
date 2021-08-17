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
import { itemManager } from './items/Items';

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
    
    clear() {
        this.items.splice(0, this.items.length);
        this.save();
        this.updateDisplay();
    }

    selectItemId(id: number) {
        if(0 <= id && id < this.items.length)
            this.selectedItemId = id;
    }

    useItemId(id: number) {  
        this.selectItemId(id);

        let item = itemManager.items.get(
            this.selectedItem.id
        );

        if(item) {
            if(item.isPlacable(this.clientHandler.player.world)) {
                this.clientHandler.player.world.server.worldEditor.setEditModeFor(
                    this.clientHandler, true, "$position"
                );
            } else {
                if(item.useItem(this.clientHandler)) {
                    this.takeItem(this.selectedItem.id, 1);
                }
            }
        }

        this.save();
        this.updateDisplay();
    }

    addItem(id: string, quantity: number) {
        let found = false;
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i].id == id) {
                this.items[i].quantity += quantity;
                found = true;
                break;
            }
        }
        if(!found)
            this.items.push(
                itemManager.items.get(id).instanceData(quantity)
            );
        this.save();
        this.updateDisplay();
    }

    private indexOfItem(id: string): number {
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i].id == id) {
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

    getItemDisplayName(location: number) {
        return this.items[location].displayName;
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
