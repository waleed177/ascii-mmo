import { keyboard, renderer } from "./Client.js";
import { ClientGameObject } from "./ClientGameObject.js";

export class ChatBox extends ClientGameObject {
    private typingMode: boolean = false;
    private currentSendText: string = "";

    constructor() {
        super();
        window.addEventListener("keydown", (ev: KeyboardEvent) => {
            
            if(ev.key == ":") {
                this.typingMode =! this.typingMode;
                if(this.typingMode) {
                    keyboard.claimOwnership("chatbox");
                } else {
                    keyboard.releaseOwnership("chatbox");
                }
            } else if (this.typingMode) {
                if(ev.key == "Backspace") {
                    this.currentSendText = this.currentSendText.substring(0, this.currentSendText.length-1);
                } else if (ev.key.length == 1) {
                    this.currentSendText += ev.key;
                }
            }
           
        });
    }

    update() {
        
    }

    draw() {
        renderer.fillTiles(0, 0, 20, 10, '-');
        renderer.writeText(0, 10, "Chat> " + this.currentSendText);
    }
}
