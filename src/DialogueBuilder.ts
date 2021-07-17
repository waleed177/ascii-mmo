export type DialogueType = Array<{
    prompt: string,
    options: Array<{
        display: string,
        actions: string[]
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

    choice(display: string, ...actions: string[]) {
        this.dialogue[this.dialogue.length-1].options.push(
            {
                display: display,
                actions: actions
            }
        );
    }

    build() {
        for(let i = 0; i < this.dialogue.length; i++) {
            let dialoguePiece = this.dialogue[i];
            for(let j = 0; j < dialoguePiece.options.length; j++) {
                let option = dialoguePiece.options[j];
                for(let k = 0; k < option.actions.length; k++) {
                    var action = option.actions[k];
                    if(!action.startsWith("$")) {
                        option.actions[k] = "L" + this.labels.get(action);
                    }
                }
                
            }
        }

        return this.dialogue;
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
