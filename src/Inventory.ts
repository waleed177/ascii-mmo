import { InventoryUpdatedData } from '../client/shared/InventoryUpdatedData';
import { ItemData } from '../client/shared/Item';
import { ClientHandler } from './ClientHandler';
import { InventoryDisplay } from './InventoryDisplay';

export class Inventory {
    private items = new Array<ItemData>();
    private clientHandler: ClientHandler;
    private inventoryDisplay: InventoryDisplay;

    constructor(clientHandler: ClientHandler) {
        this.clientHandler = clientHandler;
        this.inventoryDisplay = this.clientHandler.player.world.server.inventoryDisplay;
        
        this.updateDisplay();
    }

    private updateDisplay() {
        this.inventoryDisplay.emitInventoryUpdate(
            this.clientHandler,
            {
                items: this.items
            } as InventoryUpdatedData
        );
    }

    useItemId(id: number) {
        let item = this.items[id];
        item.quantity -= 1;
        if(item.quantity <= 0) {
            this.items.splice(id, 1);
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
    
    load() {
        this.items = this.clientHandler.userInfo.inventory;
        this.updateDisplay();
    }

    save() {
        this.clientHandler.userInfo.markModified("inventory");
        this.clientHandler.userInfo.save();
    }
}
