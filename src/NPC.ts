import { NetworkEntity } from './NetworkEntity';
import { UseChoiceData } from '../client/shared/UseChoiceData';
import { NPCDialogueData } from '../client/shared/NPCDialogueData';
import { DialogueType } from './DialogueBuilder';
import { DialogueExecutor } from './DialogueExecutor';

export class NPC extends NetworkEntity {
    private dialogue: DialogueType;

    constructor(sprite: string, dialogue: DialogueType) {
        super();

        this.prefab = "npc";
        this.sprite = sprite;

        this.dialogue = dialogue;
    }

    ready() {
        this.messageHandler.on("talk", (sender, data) => {
            sender.dialogueExecutor = new DialogueExecutor(this.dialogue);
            this.emitTo(sender, "newDialogue", sender.dialogueExecutor.getCurrentPromptData());
            this.emitTo(sender, "talk", {});
        });

        this.messageHandler.on("use", (sender, data: UseChoiceData) => {
            this.emitTo(sender, "newDialogue", sender.dialogueExecutor.useOption(data.id));
        });
    }
}