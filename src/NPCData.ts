import { DialogueBuilder, DialogueType} from './DialogueBuilder';

let d = new DialogueBuilder();
export let dialogues = new Map<string, DialogueType>();


//Welcome dialogue
d.clear();
d.label("start");
d.prompt("Welcome to game!");
d.choice("Thanks", "$quest_add yeah?");
d.choice("Yeah?", "game");

d.label("game");
d.prompt("do you like game?");
d.choice("I did nothing.", "did_nothing");
d.choice("yes", "liked_game");

d.label("did_nothing");
d.prompt("Ok.");

d.label("liked_game");
d.prompt(":3")

dialogues.set("welcome_dialogue", d.build());
//

