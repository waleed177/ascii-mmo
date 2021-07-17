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
