//#region PREAMBLE
/*
    This is an ASCII MMO game.
    Copyright (C) 2021 waleed177 <potatoxel@gmail.com>
    Copyright (C) 2021 metamuffin <muffin@metamuffin.org>

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

import { Keyboard } from "./Keyboard.js";
import {Renderer} from "./Renderer.js";
import { Socket } from "./Socket.js";
import { NetworkWorld } from "./NetworkWorld.js";
import { ChatBox } from "./ChatBox.js";

let canvas = document.getElementById("game") as HTMLCanvasElement;
let context = canvas.getContext('2d');

export let renderer = new Renderer(context, 1);
canvas.width = renderer.width * renderer.tileWidth;
canvas.height = renderer.height * renderer.tileHeight;

export var keyboard = new Keyboard();
keyboard.hookToWindow();

var socket: Socket = new Socket();
var world = new NetworkWorld(socket);
socket.connect((window.location.protocol.endsWith("s") ? "wss" : "ws") + "://" + window.location.host + "/server");

socket.emit("test", {
    test1: 100,
    test2: 200
});

setInterval(() => {
    renderer.clear();

    keyboard.startScope("game");
    world.update();
    keyboard.endScope();

    world.draw();
    world.guiDraw();

    context.clearRect(0,0, canvas.width, canvas.height);
    for(let i =0; i < 8; i++) {
        context.fillText(
            ".", Math.floor(Math.random()*42)*10, Math.floor(Math.random()*42)*10
        );
    }

    context.save();
    renderer.render();
    context.restore();

    keyboard.update();

}, 100);
