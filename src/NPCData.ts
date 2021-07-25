import { DialogueBuilder, DialogueType} from './DialogueBuilder';
import { Quest } from './Quest';

let d = new DialogueBuilder();
export let dialogues = new Map<string, DialogueType>();


//Welcome dialogue
d.clear();
d.label("start");
d.prompt("Welcome!")
d.choice("Hi.", d.goto("quest"))

d.label("quest");
d.prompt("Go get me a tomato.");
d.choice("Ok.", d.addQuest(new Quest("tomato", "get tomato!")), d.end());

dialogues.set("welcome_dialogue", d.build());
//


