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

    draw() {
        for(let i = 0; i < this.items.length; i++) {
            renderer.writeText(
                0, renderer.height-i-1, 
                (this.cursorLocation == i ? ">" : "") + this.items[i].name + " " +  this.items[i].quantity
            );
        }
    }
}

