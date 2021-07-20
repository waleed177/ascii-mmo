import { NetworkEntity } from './NetworkEntity';
import { UseChoiceData } from '../client/shared/UseChoiceData';
import { NPCDialogueData } from '../client/shared/NPCDialogueData';
import { DialogueType } from './DialogueBuilder';
import { DialogueExecutor } from './DialogueExecutor';
import { dialogues } from './NPCData';

export class NPC extends NetworkEntity {
    private dialogue: DialogueType;
    dialogueName: string;

    constructor(sprite: string, dialogueName: string) {
        super();

        this.prefab = "npc";
        this.sprite = sprite;

        this.dialogue = dialogues.get(dialogueName);
        this.dialogueName = dialogueName;
    }

    ready() {
        this.messageHandler.on("talk", (sender, data) => {
            sender.dialogueExecutor = new DialogueExecutor(sender, this.dialogue);
            this.emitTo(sender, "newDialogue", sender.dialogueExecutor.getCurrentPromptData());
            this.emitTo(sender, "talk", {});
        });

        this.messageHandler.on("use", (sender, data: UseChoiceData) => {
            this.emitTo(sender, "newDialogue", sender.dialogueExecutor.useOption(data.id));
        });
    }

    getPrivateData() {
        return {
            dialogueName: this.dialogueName
        };
    }
}