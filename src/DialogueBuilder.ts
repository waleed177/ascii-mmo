import { DialogueExecutor } from "./DialogueExecutor";
import { Quest } from "./Quest";

export type ActionFunction = (dialogueExecutor: DialogueExecutor) => boolean;

export type DialogueType = Array<{
    prompt: string,
    options: Array<{
        display: string,
        actions: ActionFunction[]
    }>;
}>;
export class DialogueBuilder {
    private dialogue: DialogueType;
    private labels = new Map<string, number>();
    private freeLabelId = 0;
    
    constructor() {
        this.dialogue = [];
    }

    clear() {
        this.dialogue = [];
        this.labels = new Map<string, number>();
        this.freeLabelId = 0;
    }

    label(label: string) {
        this.labels.set(label, this.freeLabelId++);
    }

    prompt(prompt: string) {
        this.dialogue.push({
            prompt: prompt,
            options: []
        });
    }

    choice(display: string, ...actions: ActionFunction[]) {
        this.dialogue[this.dialogue.length-1].options.push(
            {
                display: display,
                actions: actions
            }
        );
    }

    build() {
        return this.dialogue;
    }

    goto(label: string): ActionFunction {
        let labels = this.labels;
        return (dialogueExecutor) => {
            let id = labels.get(label);
            dialogueExecutor.goto(id);
            return true;
        }
    }

    end(): ActionFunction {
        return (dialogueExecutor) => {
            dialogueExecutor.goto(-1);
            return false;
        };
    }

    addQuest(quest: Quest): ActionFunction {
        return (dialogueExecutor) => {
            dialogueExecutor.client.player.quests.addQuest(quest);
            return true;
        };
    }

    completeQuest(questName: string, successfullyCompleted: ActionFunction = _ => true, noQuest: ActionFunction = _ => true): ActionFunction {
        return (dialogueExecutor) => {
            if(dialogueExecutor.client.player.quests.completeQuest(questName)) {
                return successfullyCompleted(dialogueExecutor);
            } else {
                return noQuest(dialogueExecutor);
            }
            return true;
        };
    }

    iff(condition: ActionFunction, true_body: ActionFunction, false_body: ActionFunction = _ => true): ActionFunction {
        return (dialogueExecutor) => {
            if(condition(dialogueExecutor)) {
                return true_body(dialogueExecutor);
            } else {
                return false_body(dialogueExecutor);
            }
        }
    }
}

/**
 let dialogue = new DialogueBuilder();
dialogue.label("test");
dialogue.prompt("Hi");
{
    dialogue.choice("Hi", "abc");
    dialogue.choice("Hi", "$end");
    dialogue.choice("Hi", "$end");
}

dialogue.label("abc");
dialogue.prompt("Fish");
{
    dialogue.choice("Hi", "$end");
    dialogue.choice("be", "$end");
    dialogue.choice("Hi", "$end");
}

console.log(dialogue.build()[0].options[0].action);
 */
