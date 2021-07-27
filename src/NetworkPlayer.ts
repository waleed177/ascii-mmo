import { NetworkEntity } from './NetworkEntity';
import { SettingPositionData } from '../client/shared/SettingPositionData'
import { ClientHandler } from './ClientHandler';
import { Inventory } from './Inventory';
import { Quests } from './Quests';
import { TileMapObject } from './TileMapObject';
import { Vector3 } from '../client/shared/Vector3';
import { GameObject } from '../client/shared/GameObject';
import { tilesInfo } from './TileInfo';

export class NetworkPlayer extends NetworkEntity {
    inventory: Inventory;
    quests: Quests;
    clientHandler: ClientHandler;
    shouldBeSerialized: boolean = false;
    saving: boolean = false;

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
                        coll.processCollisionWith(this, newPos);
                        //let tile = coll.getTileAtWorldSpace(newPos);
                        /*if (tilesInfo.has(tile)) {
                            let tileInfo = tilesInfo.get(tile);
                            if (tileInfo.obtainable) {
                                coll.setTileAtWorldSpace(newPos, " ");
                                this.inventory.addItem({
                                    name: tileInfo.name,
                                    quantity: 1
                                })
                            }
                        }
                        coll.commitChanges();*/
                        
                    }
                });
            }
            
        });
    }

    public update() {
        if (this.clientHandler.userInfo && this.clientHandler.userInfo.isModified() && !this.saving) {
            this.saving = true;
            this.clientHandler.userInfo.save().then((user) => {
                this.saving = false;
            });
        }
    }

    public ready() {
        this.inventory = new Inventory(this.clientHandler);
        this.quests = new Quests(this.clientHandler);
    }

    public load() {
        this.inventory.load();
    }
}
