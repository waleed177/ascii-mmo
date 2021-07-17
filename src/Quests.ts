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
        this.questsDisplay.emitDisplayUpdate(this.clientHandler, this.displayQuests);
    }

    addQuest(quest: Quest) {
        this.displayQuests.push(quest.displayName);
        this.quests.push(quest);
        this.updateDisplay();
    }
}
