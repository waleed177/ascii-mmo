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

import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ServerGameObject } from './ServerGameObject';
import { PlaceTileData } from '../client/shared/PlaceTileData';
import { Vector3 } from '../client/shared/Vector3';
import { TileMapObject } from './TileMapObject';
import { ClientHandler } from './ClientHandler';


export class WorldEditor extends ServerGameObject {
    shouldBeSerialized = false;

    constructor() {
        super();

        this.messageHandler.on("place", (sender, data: PlaceTileData) => {
            var colls = this.world.findCollisionsWithPoint(new Vector3(data.x, data.y, data.z));

            if(data.tile == "$position") {
                sender.player.placeInventorySelectedItemAt(new Vector3(data.x, data.y, data.z));
                this.setEditModeFor(sender, false, ' ');
                
            } else {
                colls.forEach((gameObject, index, array) => {
                    if (gameObject instanceof TileMapObject) {
                        gameObject.tilemap.setTile(
                            data.x-gameObject.position.x,
                            data.y-gameObject.position.y,
                            data.z, data.tile);
                        gameObject.commitChanges();
                    }
                });
            }
        });
    }

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: " ",
            x: 0,
            y: 0,
            z: 0,
            prefab: "worldEditor",
            data: {}
        };
    }

    setEditModeFor(client: ClientHandler, bool: boolean, tile: string) {
        this.emitTo(client, "setEditMode", {
           isEditing: bool, //TODO: INTERFACE
           tile: tile
        });
    }
}
