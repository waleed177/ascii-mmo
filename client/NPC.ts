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

import { keyboard, renderer } from "./Client.js";
import { Entity } from "./Entity.js";
import { NPCDialogueData } from "./shared/NPCDialogueData.js";
import { UseChoiceData } from "./shared/UseChoiceData.js";

export class NPC extends Entity {
    private _isTalking: boolean = false;
    public get isTalking(): boolean {
        return this._isTalking;
    }
    public set isTalking(value: boolean) {
        this._isTalking = value;
        if(this.isTalking) {
            keyboard.claimOwnership("dialogue");
        } else {
            this.talkingDebounce = 2;
            keyboard.releaseOwnership("dialogue");
        }
    }

    private currentQuestion: string = "";
    private currentOptions = new Array<string>();
    private currentOptionIndex: number = 0;
    private talkingDebounce: number = 0;

    ready() {
        this.messageHandler.on("newDialogue", (sender, data: NPCDialogueData) => {
            if(data == null){
                this.isTalking = false;
            } else {
                this.currentQuestion = data.currentQuestion;
                this.currentOptions = data.currentOptions;
                this.currentOptionIndex = 0;
            }
        });

        this.messageHandler.on("talk", (sender, data) => {
            this.isTalking = true;
        });

        keyboard.addKeyDownListener("dialogue", (ev) => {
            if(this.isTalking) {
                if(ev.key == 'f') {
                    this.isTalking = false;
                } else if( ev.key == 'w') {
                    this.currentOptionIndex -= 1;
                } else if( ev.key == 's') {
                    this.currentOptionIndex += 1;
                } else if( ev.key == 'e') {
                    this.emit("use", { id: this.currentOptionIndex  } as UseChoiceData);
                }
                if(this.currentOptionIndex <= 0) {
                    this.currentOptionIndex = 0;
                } else if(this.currentOptionIndex >= this.currentOptions.length) {
                    this.currentOptionIndex = this.currentOptions.length;
                }
            }
        });
    }

    update() {
        if (this.talkingDebounce > 0)
            this.talkingDebounce -= 1;
    }
    
    guiDraw() {
        if(this.isTalking) {
            renderer.fillTilesScreenCoord(
                Math.floor(renderer.width/2) - 7,
                renderer.height-7,
                0,
                Math.floor(renderer.width/2) + 7,
                renderer.height-1,
                0,
                '.'
            );

            renderer.writeTextScreenCoord(
                Math.floor(renderer.width/2 - 6), renderer.height-6, 0, 
                this.currentQuestion, false
            );
            
            for(let i = 0; i < this.currentOptions.length; i++) {
                renderer.writeTextScreenCoord(
                    Math.floor(renderer.width/2 - 6),
                    renderer.height-4+i,
                    0,
                    ((this.currentOptionIndex == i) ? ">" : "") + this.currentOptions[i]
                );
            }
        }
    }

    talk() {
        if(this.talkingDebounce <= 0)
            this.emit("talk", {});
    }
}
