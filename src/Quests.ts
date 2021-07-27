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

import { ClientHandler } from "./ClientHandler";
import { Quest } from "./Quest";
import { QuestsDisplay } from "./QuestsDisplay";

export class Quests {
    private displayQuests = new Array<string>();
    private quests = new Array<Quest>();
    private clientHandler: ClientHandler;
    private questsDisplay: QuestsDisplay;
    private completedQuestsNames = new Array<string>();

    constructor(clientHandler: ClientHandler) {
        this.clientHandler = clientHandler;
        this.questsDisplay = this.clientHandler.player.world.server.questsDisplay;
        
        this.displayQuests = []

        this.updateDisplay();
    }


    updateDisplay() {
        this.displayQuests = [];
        this.quests.forEach((quest, index, array) => {
            this.displayQuests.push(quest.displayName);
        });
        this.questsDisplay.emitDisplayUpdate(this.clientHandler, this.displayQuests);
    }

    completedQuest(questName: string) {
        return this.completedQuestsNames.indexOf(questName) >= 0;
    }

    hasQuest(questName: string) {
        for(let i = 0; i < this.quests.length; i++) {
            if(this.quests[i].name == questName) {
                return true;
            }
        }
        return false;
    }

    addQuest(quest: Quest) {
        if(!(this.completeQuest(quest.name) || this.hasQuest(quest.name))){
            this.quests.push(quest);
            this.updateDisplay();
        }
    }

    completeQuest(questName: string) {
        for(let i = 0; i < this.quests.length; i++) {
            if(this.quests[i].name == questName) {
                this.quests.splice(i, 1);
                this.completedQuestsNames.push(questName);
                this.updateDisplay();
                return true;
            }
        }
        return false;
    }
}
