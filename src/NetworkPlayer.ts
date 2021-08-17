//#region PREAMBLE
/*
    This is an ASCII MMO game.
    Copyright (C) 2021 waleed177 <potatoxel@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, version 3 of the
    License only.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
//#endregion

import { NetworkEntity } from './NetworkEntity';
import { SettingPositionData } from '../client/shared/SettingPositionData'
import { ClientHandler } from './ClientHandler';
import { Inventory } from './Inventory';
import { Quests } from './Quests';
import { TileMapObject } from './TileMapObject';
import { Vector3 } from '../client/shared/Vector3';
import { GameObject } from '../client/shared/GameObject';
import { tilesInfo } from './TileInfo';
import { NPC } from './NPC';
import { InventoryUpdatedData } from '../client/shared/InventoryUpdatedData';
import { Chest } from './Chest';
import { itemManager } from './items/Items';

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
                collisions = this.world.findEntitiesPreciseCollidingWithPoint(newPos);
                let collisions_with_bounds = this.world.findEntitiesCollidingWithPoint(newPos);
                let in_bounds_with_tilemap = false;
                for(let i = 0; i < collisions_with_bounds.length; i++) {
                    if (collisions_with_bounds[i] instanceof TileMapObject) {
                        in_bounds_with_tilemap = true;
                        break;
                    }
                }
                collision = collisions.length > 0 || !in_bounds_with_tilemap;
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
                var coll_with_tilemap = false;
                collisions.forEach((coll) => {
                    if(coll instanceof TileMapObject) {
                        coll_with_tilemap = true;
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

        this.messageHandler.on("useClosestEntity", (sender, data) => {
            let res = this.world.findEntitiesWithinRadius(sender.player.position, 1);
            for(let i = 0; i < res.length; i++) {
                let entity = res[i];
                entity.use(sender);
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
        this.inventory.updateDisplay = () => {
            this.world.server.inventoryDisplay.emitInventoryUpdate(
                this.clientHandler,
                {
                    items: this.inventory.items
                } as InventoryUpdatedData
            );
        }
        this.inventory.updateDisplay();

        this.quests = new Quests(this.clientHandler);
    }

    public load() {
        this.inventory.load();
    }

    public placeInventorySelectedItemAt(position: Vector3){ 
        let item = itemManager.items.get(
            this.inventory.selectedItem.id
        );

        if(item) {
            let thing = item.constructEntity(this.world, position);
            if(thing) {
                thing.position = position;
                this.world.addChild(thing);
                this.inventory.takeItem(this.inventory.selectedItem.id, 1);
            }
        }
        
    }
}
