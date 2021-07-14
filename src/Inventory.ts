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
        
        this.items = [
            {
                name: "FESH",
                quantity: 10
            },
            {
                name: "FESH22",
                quantity: 12
            }
        ]

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
        this.items[id].quantity -= 1;

        var playerPos = this.clientHandler.player.position;
        this.clientHandler.player.world.server.tilemap.tilemap.setTile(
            playerPos.x,
            playerPos.y,
            0,
            id + ""
        );
        this.clientHandler.player.world.server.tilemap.commitChanges();
        this.updateDisplay();
    }
}
