import { NetworkEntity } from './NetworkEntity';
import { SettingPositionData } from '../client/shared/SettingPositionData'
import { ClientHandler } from './ClientHandler';
import { Inventory } from './Inventory';
import { Quests } from './Quests';
import { TileMapObject } from './TileMapObject';
import { Vector3 } from '../client/shared/Vector3';
import { GameObject } from '../client/shared/GameObject';

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
            let collisions = new Array<GameObject>();
            let newPos = new Vector3(data.x, data.y, data.z);
            let delta = newPos.sub(this.position).abs().sum();

            if(delta > 1) {
                collision = true;
            } else {
                collisions = this.world.findEntitiesCollidingWithPoint(newPos);
                collision = collisions.length > 0;
            }
            
            if (!collision) {
                this.position.x = data.x;
                this.position.y = data.y;  
            } else {
                data.x = this.position.x;
                data.y = this.position.y;
            }

            if (delta > 3) {
                this.emitPosition();
            } else {
                this.emitPosition([this.clientHandler]);
            }

            if (delta <= 1) {
                collisions.forEach((coll) => {
                    if(coll instanceof TileMapObject) {
                        let tile = coll.getTileAtWorldSpace(newPos);
                        if (tile == "│") {
                            coll.setTileAtWorldSpace(newPos, " ");
                            this.inventory.addItem({
                                name: "|",
                                quantity: 1
                            })
                        }
                        coll.commitChanges();
                    }
                });
            }
            
        });
    }

    public ready() {
        this.inventory = new Inventory(this.clientHandler);
        this.quests = new Quests(this.clientHandler);
    }

    public load() {
        this.inventory.load();
    }
}
