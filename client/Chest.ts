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

import { ClientGameObject } from "./ClientGameObject.js";
import { Entity } from "./Entity.js";
import { ListDisplayHelper } from "./ListDisplayHelper.js";
import { RecieveItemListData } from "./shared/RecieveItemListData.js";
import { SpawnGameObjectData } from "./shared/SpawnGameObjectData.js";
import { UseItemData } from "./shared/UseItemData.js";
import { Vector3 } from "./shared/Vector3.js";


export class Chest extends Entity {
    private listDisplayHelper: ListDisplayHelper;
    private showGUI: boolean = false;
    
    constructor() {
        super();
        this.listDisplayHelper = new ListDisplayHelper();
        this.listDisplayHelper.initKeyboard();
        this.listDisplayHelper.onUse = (cursorLocation) => { this.onUse(cursorLocation) };
        this.listDisplayHelper.onEndUseKeyboard = () => this.showGUI = false;
        this.messageHandler.on("recieveItems", (sender, data: RecieveItemListData) => {
            this.listDisplayHelper.displayItems = data.displayItems;
        });
        this.messageHandler.on("open", (sender, data) => {
            this.listDisplayHelper.useListKeyboard();
            this.showGUI = true;
        });
    }

    onUse(id: number) {
        this.emit("useItem", {
            id: id
        } as UseItemData);
    }

    init(spawnData: SpawnGameObjectData) {
        super.init(spawnData);
        let data = spawnData.data as RecieveItemListData;
        this.listDisplayHelper.displayItems = data.displayItems;
    }

    guiDraw(){
        if(this.showGUI) {
            this.listDisplayHelper.drawList(new Vector3(15, 15, 0));
        }
    }

    useList() {
        this.listDisplayHelper.useListKeyboard();
    }

    
}
