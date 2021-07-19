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

    ready() {
        keyboard.addKeyDownListener(this, (ev) => {
            if(ev.key.toLowerCase() == "x") {
                keyboard.claimOwnership(this);
            }
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
                    this.emit("place", {
                        x: this.cursorLocation.x,
                        y: this.cursorLocation.y,
                        z: renderer.cameraPosition.z,
                        tile: this.currentTile
                    } as PlaceTileData);
                    break;
                }
            }
        });
    }

    update() {
        if(this.isEditing) {
            keyboard.startScope(this);
            if (keyboard.isKeyDown("d") || keyboard.isKeyDown("D")) {
                this.cursorLocation.x += 1;
            }
    
            if (keyboard.isKeyDown("a") || keyboard.isKeyDown("A")) {
                this.cursorLocation.x -= 1;
            }
    
            if (keyboard.isKeyDown("s") || keyboard.isKeyDown("S")) {
                this.cursorLocation.y += 1;
            }
    
            if (keyboard.isKeyDown("w") || keyboard.isKeyDown("W")) {
                this.cursorLocation.y -= 1;
            }
            keyboard.endScope();
        }
        
    }


    draw() {
        if (this.isEditing){
            renderer.setTile(this.cursorLocation.x, this.cursorLocation.y, 0, 'x');

        }
    }
}