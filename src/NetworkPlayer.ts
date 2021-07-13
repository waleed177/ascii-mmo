import { NetworkEntity } from './NetworkEntity';
import { SettingPositionData } from '../client/shared/SettingPositionData'
import { ClientHandler } from './ClientHandler';
import { Inventory } from './Inventory';

export class NetworkPlayer extends NetworkEntity {
    inventory: Inventory;
    clientHandler: ClientHandler;

    constructor(clientHandler: ClientHandler) {
        super();
        this.sprite = 'P';
        this.prefab = 'player';
        this.clientHandler = clientHandler;
        
        this.messageHandler.on('settingPosition', (sender: ClientHandler, data: SettingPositionData) => {
            this.position.x = data.x;
            this.position.y = data.y;
            this.emit('settingPosition', data);
        });
    }

    public ready() {
        this.inventory = new Inventory(this.clientHandler);
    }
}
