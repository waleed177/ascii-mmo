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

import { ClientGameObject } from './ClientGameObject.js';
import { keyboard, renderer } from './Client.js';
import { Vector2 } from './shared/Vector2.js';
import { PlaceTileData } from './shared/PlaceTileData.js';
import { Inventory } from './Inventory.js';

export class WorldEditor extends ClientGameObject {
    public static instance: WorldEditor;

    private _isEditing: boolean = false;
    public get isEditing(): boolean {
        return this._isEditing;
    }
    private set isEditing(value: boolean) {
        this._isEditing = value;
        keyboard.setOwnership(this, value);
    }

    private cursorLocation: Vector2 = new Vector2(13, 13);
    private currentTile: string = 't';
    private changeCurrentTileMode: boolean = false;
    private alwaysPlace: boolean = false;

    constructor() {
        super();
        WorldEditor.instance = this;
    }

    ready() {
        keyboard.addKeyDownListener(this, (ev) => {
            if(this.changeCurrentTileMode) {
                this.currentTile = ev.key;
                this.changeCurrentTileMode = false;
            } else {
                switch(ev.key.toLowerCase()) {
                    case "x": {
                        this.isEditing = true;
                        break;
                    }
                    case "f": {
                        this.isEditing = false;
                        break;
                    }
                    case "e": {
                        if(this.isEditing) {
                            this.alwaysPlace = !this.alwaysPlace;
                            if(this.alwaysPlace) {
                                this.emit("place", {
                                    x: this.cursorLocation.x,
                                    y: this.cursorLocation.y,
                                    z: renderer.cameraPosition.z,
                                    tile: this.currentTile
                                } as PlaceTileData);
                            }
                        }
                        break;
                    }
                    case "h": {
                        if(this.isEditing) {
                            this.cursorLocation = this.world.player.position.clone();
                        }
                    }
                    case " ": {
                        if(this.isEditing)
                            this.changeCurrentTileMode = true;
                        break;
                    }
    
                }
            }
            
        });

        this.messageHandler.on("setEditMode", (sender, data) => {
            this.cursorLocation = this.world.player.position.clone();
            this.alwaysPlace = false;
            Inventory.instance.stop();
            this.isEditing = data.isEditing; //TODO: INTERFACE
            this.currentTile = data.tile;
        });
    }

    update() {
        if(this.isEditing) {
            keyboard.startScope(this);
            var moved = false;

            if (keyboard.isKeyDown("d") || keyboard.isKeyDown("D")) {
                this.cursorLocation.x += 1;
                moved = true;
            }
    
            if (keyboard.isKeyDown("a") || keyboard.isKeyDown("A")) {
                this.cursorLocation.x -= 1;
                moved = true;
            }
    
            if (keyboard.isKeyDown("s") || keyboard.isKeyDown("S")) {
                this.cursorLocation.y += 1;
                moved = true;
            }
    
            if (keyboard.isKeyDown("w") || keyboard.isKeyDown("W")) {
                this.cursorLocation.y -= 1;
                moved = true;
            }

            if(this.alwaysPlace && moved && this.isEditing)
                this.emit("place", {
                    x: this.cursorLocation.x,
                    y: this.cursorLocation.y,
                    z: renderer.cameraPosition.z,
                    tile: this.currentTile
                } as PlaceTileData);

            keyboard.endScope();
        }
        
    }


    guiDraw() {
        if (this.isEditing){
            renderer.setTile(this.cursorLocation.x, this.cursorLocation.y, 0, 
                this.changeCurrentTileMode ? "C" : (this.alwaysPlace ? "P" : "X"));

        }
    }
}