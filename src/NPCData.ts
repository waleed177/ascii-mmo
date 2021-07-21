import { DialogueBuilder, DialogueType} from './DialogueBuilder';

let d = new DialogueBuilder();
export let dialogues = new Map<string, DialogueType>();


//Welcome dialogue
d.clear();
d.label("start");
d.prompt("Welcome to game!");
d.choice("Thanks", "$quest_add yeah yeah?", "$end");
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

d.clear();
d.label("start");
d.prompt("Do you like tomato?");
d.choice("Yes", "yes", "$quest_add tomato Get tomatoes!");
d.choice("No", "no");

d.label("yes");
d.prompt("Good")

d.label("no");
d.prompt("no u");

dialogues.set("test2", d.build());

//

d.clear();
d.label("start");
d.prompt("Did you do it?");
d.choice("Yes", "$quest_complete tomato then", "yay");

d.label("yay");
d.prompt("You did it!");

dialogues.set("tomato", d.build());

