import { ClientHandler } from "./ClientHandler";
import { Quest } from "./Quest";
import { QuestsDisplay } from "./QuestsDisplay";

export class Quests {
    private displayQuests = new Array<string>();
    private quests = new Array<Quest>();
    private clientHandler: ClientHandler;
    private questsDisplay: QuestsDisplay;
    
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

    addQuest(quest: Quest) {
        this.quests.push(quest);
        this.updateDisplay();
    }

    completeQuest(questName: string) {
        for(let i = 0; i < this.quests.length; i++) {
            if(this.quests[i].name == questName) {
                this.quests.splice(i, 1);
                this.updateDisplay();
                return true;
            }
        }
        return false;
    }
}
