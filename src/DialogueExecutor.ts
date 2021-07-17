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
        if (option.action.startsWith("$")) {
            var sp = option.action.split(' ');
            var action = sp[0];
            var remainder = option.action.substr(action.length+1);

            switch (action) {
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
        } else if (option.action.startsWith("L")) {
            var newPromptId = Number.parseInt(option.action.substr(1));
            this.currentPromptId = newPromptId;
        }
        return this.getCurrentPromptData();
    }
}