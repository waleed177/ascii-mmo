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
import { Vector2 } from './shared/Vector2.js';
import { UsableListDisplay } from './UsableListDisplay.js';


export class QuestDisplay extends UsableListDisplay {

    constructor() {
        super();
        console.log("quest display!");
    }

    ready() {
        keyboard.addKeyDownListener(this, (ev) => {
            if(ev.key == 'q') {
                this.useList();
            }
        });
    }

    guiDraw() {
        renderer.fillTilesScreenCoord(0, 13, 0, 7, 23, 0, '.');
        renderer.writeTextScreenCoord(1, 14, 0, 'Quests');
        this.drawList(new Vector2(0, 16));
    }

}
