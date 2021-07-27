//#region PREAMBLE
/*
    This is an ASCII MMO game.
    Copyright (C) 2021 waleed177 <potatoxel@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, version 3 of the
    License only.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
//#endregion

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
