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

import { DialogueBuilder, DialogueType} from './DialogueBuilder';
import { Quest } from './Quest';

let d = new DialogueBuilder();
export let dialogues = new Map<string, DialogueType>();


//Welcome dialogue
d.clear();
d.label("start");
d.prompt("Welcome!")
d.choice("Hi.", d.iff(
    (exec) => exec.client.player.inventory.takeItem("tomato", 1),
    d.goto("yay"),
    d.iff( 
        (exec) => exec.client.player.quests.completedQuest("tomato"),
        d.goto("alreadydone"),
        d.goto("quest")
    )
));

d.label("quest");
d.prompt("Go get me a tomato.");
d.choice("Ok.", d.addQuest(new Quest("tomato", "get tomato!")), d.end());

d.label("yay");
d.prompt("Thanks!");
d.choice("No problem.", d.completeQuest("tomato"), d.end());

d.label("alreadydone");
d.prompt("You are a tomato!");
d.choice(":", d.end());

dialogues.set("welcome_dialogue", d.build());
//

d.clear();
d.label("start");
d.prompt("Hello!")
d.choice("Hi.", d.goto("next"))

d.label("next");
d.prompt("What do you want?");
d.choice("Tomato.", d.goto("givetomato"));
d.choice("Tomatoe.", d.goto("dontgive"));

d.label("givetomato");
d.prompt("Ok here it is.");
d.choice("Thanks!", (exec)=> {
    exec.client.player.inventory.addItem(
        "tomato", 1
    );
    return true;
}, d.end());

d.label("dontgive");
d.prompt("No.");
d.choice(":(", d.end());

dialogues.set("tomato", d.build());

