import { NPCDialogueData } from "../client/shared/NPCDialogueData";
import { DialogueType } from "./DialogueBuilder";

export class DialogueExecutor {
    private dialogue: DialogueType;
    private currentPromptId: number = 0;

    constructor(dialogue: DialogueType) {
        this.dialogue = dialogue;
    }

    getCurrentPromptData() : NPCDialogueData {
        if (this.currentPromptId == -1)
            return null;

        else { 
            var promptData = this.dialogue[this.currentPromptId];
            var options: Array<string> = [];

            for(let i = 0; i < promptData.options.length; i++) {
                options.push(promptData.options[i].display);
            }

            return {
                currentQuestion: promptData.prompt,
                currentOptions: options
            } as NPCDialogueData;
        }
    }

    useOption(id: number) {
        var currentPrompt = this.dialogue[this.currentPromptId];
        var option = currentPrompt.options[id];
        if(currentPrompt == null || currentPrompt.options[id] == null)
            return null;
        if (option.action.startsWith("$")) {
            switch (option.action) {
                case "$end": {
                    this.currentPromptId = -1;
                }
                break;
            }
        } else if (option.action.startsWith("L")) {
            var newPromptId = Number.parseInt(option.action.substr(1));
            this.currentPromptId = newPromptId;
        }
        return this.getCurrentPromptData();
    }
}