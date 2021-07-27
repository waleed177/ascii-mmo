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

import { keyboard, renderer } from './Client.js';
import { ClientGameObject } from './ClientGameObject.js';
import { Entity } from './Entity.js';
import { RecieveItemListData } from './shared/RecieveItemListData.js';
import { SpawnGameObjectData } from './shared/SpawnGameObjectData.js';
import { UseItemData } from './shared/UseItemData.js';
import { Vector2 } from './shared/Vector2.js';

export class UsableListDisplay extends ClientGameObject {
    protected displayItems = new Array<string>();
    private _usingKeyboard: boolean;
    private get usingKeyboard(): boolean {
        return this._usingKeyboard;
    }
    private set usingKeyboard(value: boolean) {
        this._usingKeyboard = value;
        if(this.usingKeyboard) {
            keyboard.claimOwnership(this);
        } else {
            keyboard.releaseOwnership(this);
        }
    }
    private cursorLocation: number = 0;

    constructor() {
        super();

        keyboard.addKeyDownListener(this, (ev) => {    
            if (this.usingKeyboard) {
                if(ev.key == "w") {
                    this.cursorLocation -= 1;
                } else if(ev.key == "s") {
                    this.cursorLocation += 1;
                } else if(ev.key == "e") {
                    this.onUse(this.cursorLocation);
                } else if(ev.key == "f") {
                    this.usingKeyboard = false;
                }
                this.cursorLocation = Math.max(0, Math.min(this.displayItems.length-1, this.cursorLocation));
            }
        });

        this.messageHandler.on("recieveItems", (sender, data: RecieveItemListData) => {
            this.displayItems = data.displayItems;
        });
    }

    onUse(id: number) {
        this.emit("useItem", {
            id: id
        } as UseItemData);
    }

    useList() {
        this.usingKeyboard = true;
    }

    init(spawnData: SpawnGameObjectData) {
        super.init(spawnData);
        let data = spawnData.data as RecieveItemListData;
        this.displayItems = data.displayItems;
    }

    drawList(position: Vector2) {
        for(let i = 0; i < this.displayItems.length; i++) {
            renderer.writeTextScreenCoord(
                position.x, position.y + i, 0,
                (this.cursorLocation == i ? ">" : "") + this.displayItems[i]
            );
        }
    }
}