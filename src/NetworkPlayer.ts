import { NetworkEntity } from './NetworkEntity';
import { SettingPositionData } from '../client/shared/SettingPositionData'
import { ClientHandler } from './ClientHandler';
import { Inventory } from './Inventory';
import { Quests } from './Quests';
import { TileMapObject } from './TileMapObject';
import { Vector3 } from '../client/shared/Vector3';

export class NetworkPlayer extends NetworkEntity {
    inventory: Inventory;
    quests: Quests;
    clientHandler: ClientHandler;
    shouldBeSerialized: boolean = false;
    
    constructor(clientHandler: ClientHandler) {
        super();
        this.sprite = 'P';
        this.prefab = 'player';
        this.clientHandler = clientHandler;
        
        this.messageHandler.on('settingPosition', (sender: ClientHandler, data: SettingPositionData) => {
            if (sender != this.clientHandler) return;
            let collision = false;
            let newPos = new Vector3(data.x, data.y, data.z);

            if(newPos.sub(this.position).abs().sum() > 1) {
                collision = true;
            } else {
                collision = this.world.findEntitiesCollidingWithPoint(newPos).length >0;
            }
            
            if (!collision) {
                this.position.x = data.x;
                this.position.y = data.y;  
            } else {
                data.x = this.position.x;
                data.y = this.position.y;
            }

            this.emitPosition();
            
        });
    }

    public ready() {
        this.inventory = new Inventory(this.clientHandler);
        this.quests = new Quests(this.clientHandler);
    }
}
