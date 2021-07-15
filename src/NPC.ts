import { NetworkEntity } from './NetworkEntity';
import { UseChoiceData } from '../client/shared/UseChoiceData';
import { NPCDialogueData } from '../client/shared/NPCDialogueData';

export class NPC extends NetworkEntity {
    constructor() {
        super();

        this.prefab = "npc";
        this.sprite = "N";
        this.data = {
            currentQuestion: "Hey tomato",
            currentOptions: ["fish", "lol", "B"]
        } as NPCDialogueData;
    }

    ready() {
        this.messageHandler.on("use", (sender, data: UseChoiceData) => {
            this.emitTo(sender, "newDialogue", {
                currentQuestion: "Do you",
                currentOptions: ["a", "b"]
            } as NPCDialogueData);
        });
    }
}