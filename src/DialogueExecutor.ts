import { NPCDialogueData } from "../client/shared/NPCDialogueData";
import { ClientHandler } from "./ClientHandler";
import { DialogueType } from "./DialogueBuilder";
import { Quest } from "./Quest";

export class DialogueExecutor {
    private dialogue: DialogueType;
    private currentPromptId: number = 0;
    public client: ClientHandler;

    constructor(client: ClientHandler, dialogue: DialogueType) {
        this.dialogue = dialogue;
        this.client = client;
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

        for(let i = 0; i < option.actions.length; i++) {
            let leaveLoop = false;
            let action = option.actions[i];
            if(!action(this))
                break;
        }
        return this.getCurrentPromptData();
    }

    goto(id: number) {
        this.currentPromptId = id;
    }
}