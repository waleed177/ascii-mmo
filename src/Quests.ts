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
