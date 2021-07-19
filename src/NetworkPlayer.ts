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
                this.world.findCollisionsWithPoint(newPos).forEach(
                    (gameObject, index, array) => {
                        if(gameObject instanceof TileMapObject) {
                            var tile = gameObject.tilemap.getTile(
                                newPos.x - gameObject.position.x,
                                newPos.y - gameObject.position.y,
                                0
                            );

                            if(tile != " ") {
                                collision = true;
                            }
                        }
                    }
                )
            }
            
            if (!collision) {
                this.position.x = data.x;
                this.position.y = data.y;  
            } else {
                data.x = this.position.x;
                data.y = this.position.y;
            }

            this.emit('settingPosition', data);
            
        });
    }

    public ready() {
        this.inventory = new Inventory(this.clientHandler);
        this.quests = new Quests(this.clientHandler);
    }
}
