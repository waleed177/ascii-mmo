import { Keyboard } from "./Keyboard.js";
import {Renderer} from "./Renderer.js";
import { Socket } from "./Socket.js";
import { NetworkWorld } from "./NetworkWorld.js";

let canvas = document.getElementById("game") as HTMLCanvasElement;
let context = canvas.getContext('2d');

export let renderer = new Renderer(context, 32, 32);

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

    world.update();
    world.draw();

    context.clearRect(0,0, canvas.width, canvas.height);
    renderer.render();
}, 100);
