import { ClientGameObject } from './ClientGameObject.js';
import { keyboard, renderer } from './Client.js';
import { Vector2 } from './shared/Vector2.js';
import { PlaceTileData } from './shared/PlaceTileData.js';

export class WorldEditor extends ClientGameObject {
    private _isEditing: boolean = false;
    private get isEditing(): boolean {
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