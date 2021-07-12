import { NetworkEntity } from './NetworkEntity';
import { SettingPositionData } from '../client/shared/SettingPositionData'
import { ClientHandler } from './ClientHandler';

export class NetworkPlayer extends NetworkEntity {
    constructor() {
        super();
        this.sprite = 'P';
        this.prefab = 'player';

        this.messageHandler.on('settingPosition', (sender: ClientHandler, data: SettingPositionData) => {
            this.position.x = data.x;
            this.position.y = data.y;
            this.emit('settingPosition', data);
        });
    }
}
