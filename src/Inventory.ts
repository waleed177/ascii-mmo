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
    
    load() {
        this.items = this.clientHandler.userInfo.inventory;
        this.updateDisplay();
    }

    save() {
        this.clientHandler.userInfo.markModified("inventory");       
    }
}
