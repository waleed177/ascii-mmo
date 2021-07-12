import { NetworkEntity } from './NetworkEntity';
import { SettingPositionData } from '../client/shared/SettingPositionData'

export class NetworkPlayer extends NetworkEntity {
    constructor() {
        super();
        this.sprite = 'P';
        this.prefab = 'player';

        this.messageHandler.on('settingPosition', (data: SettingPositionData) => {
            this.position.x = data.x;
            this.position.y = data.y;
            this.emit('settingPosition', data);
        });
    }
}
