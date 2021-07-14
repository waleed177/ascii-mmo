import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ServerGameObject } from './ServerGameObject';
import { InventoryUpdatedData } from '../client/shared/InventoryUpdatedData';
import { ClientHandler } from './ClientHandler';
import { UseItemData } from '../client/shared/UseItemData';

export class InventoryDisplay extends ServerGameObject {
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
