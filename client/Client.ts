import { Keyboard } from "./Keyboard.js";
import {Renderer} from "./Renderer.js";
import { Socket } from "./Socket.js";
import { NetworkWorld } from "./NetworkWorld.js";
import { ChatBox } from "./ChatBox.js";

let canvas = document.getElementById("game") as HTMLCanvasElement;
let context = canvas.getContext('2d');

export let renderer = new Renderer(context, 42, 42, 1);
canvas.width = renderer.width * renderer.tileWidth;
canvas.height = renderer.height * renderer.tileHeight;

export var keyboard = new Keyboard();
keyboard.hookToWindow();

var socket: Socket = new Socket();
var world = new NetworkWorld(socket);
socket.connect("ws://127.0.0.1:3000/server");

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
    renderer.render();
}, 100);
