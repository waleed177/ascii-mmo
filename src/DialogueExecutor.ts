import { NPCDialogueData } from "../client/shared/NPCDialogueData";
import { ClientHandler } from "./ClientHandler";
import { DialogueType } from "./DialogueBuilder";
import { Quest } from "./Quest";

export class DialogueExecutor {
    private dialogue: DialogueType;
    private currentPromptId: number = 0;
    private client: ClientHandler;

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
            let action = option.actions[i];
            if (action.startsWith("$")) {
                let sp = action.split(' ');
                let first_part_action = sp[0];
                let remainder = action.substr(first_part_action.length+1);
    
                switch (first_part_action) {
                    case "$end": {
                        this.currentPromptId = -1;
                        break;
                    }
                    case "$quest_add": {
                        this.client.player.quests.addQuest(
                            new Quest(remainder)
                        );
                        break;
                    }
                    default: {
                        break;
                    }
                }
            } else if (action.startsWith("L")) {
                var newPromptId = Number.parseInt(action.substr(1));
                this.currentPromptId = newPromptId;
            }
        }
        return this.getCurrentPromptData();
    }
}