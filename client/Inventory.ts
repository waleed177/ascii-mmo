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

import { keyboard, renderer } from "./Client.js";
import { ClientGameObject } from "./ClientGameObject.js";
import { InventoryUpdatedData } from "./shared/InventoryUpdatedData.js";
import { Item, ItemData } from "./shared/Item.js";
import { UseItemData } from "./shared/UseItemData.js";

export class Inventory extends ClientGameObject {
    private items = new Array<ItemData>();
    private cursorLocation: number = 0;
    private _usingKeyboard: boolean = false;
    private get usingKeyboard(): boolean {
        return this._usingKeyboard;
    }
    private set usingKeyboard(value: boolean) {
        this._usingKeyboard = value;
        if(this.usingKeyboard) {
            keyboard.claimOwnership("inventory");
        } else {
            keyboard.releaseOwnership("inventory");
        }
    }

    constructor() {
        super();
        this.messageHandler.on("update", (sender, data: InventoryUpdatedData) => {
            this.items = data.items;
        });

        keyboard.addKeyDownListener("inventory", (ev) => {    
            if(ev.key.toLowerCase() == "i") {
                this.usingKeyboard = !this.usingKeyboard;
            } else if (this.usingKeyboard) {
                if(ev.key == "w") {
                    this.cursorLocation += 1;
                } else if(ev.key == "s") {
                    this.cursorLocation -= 1;
                } else if(ev.key == "Enter") {
                    this.emit("useItem", {
                        id: this.cursorLocation
                    } as UseItemData);
                }
                this.cursorLocation = Math.max(0, Math.min(this.items.length-1, this.cursorLocation));
            }
        });
    }

    guiDraw() {
        for(let i = 0; i < this.items.length; i++) {
            renderer.writeTextScreenCoord(
                0, renderer.height-i-1, 0,
                (this.cursorLocation == i ? ">" : "") + this.items[i].name + " " +  this.items[i].quantity
            );
        }
    }

    
}

