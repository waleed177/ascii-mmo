import { DialogueBuilder, DialogueType} from './DialogueBuilder';

let d = new DialogueBuilder();
export let dialogues = new Map<string, DialogueType>();


//Welcome dialogue
d.clear();
d.label("start");
d.prompt("Welcome!")
d.choice("Hi.", "$end")

dialogues.set("welcome_dialogue", d.build());
//


