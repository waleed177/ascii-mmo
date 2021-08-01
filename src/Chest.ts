import { PrefabName } from '../client/shared/Prefabs';
import { ClientHandler } from './ClientHandler';
import { NetworkEntity } from './NetworkEntity';

export class Chest extends NetworkEntity {

    constructor() {
        super();
        this.prefab = "chest";
        this.sprite = "█";

        this.data = {
            displayItems: ["A", "B", "C"]
        }

        this.messageHandler.on("useItem", (sender, data) => {

        });
    }

    use(clientHandler: ClientHandler) {
        this.emitTo(clientHandler, "open", {});
    }

}
