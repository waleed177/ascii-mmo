import { ChatMessageData } from "./shared/ChatMessageData.js";
import { keyboard, renderer } from "./Client.js";
import { ClientGameObject } from "./ClientGameObject.js";
import { Vector2 } from "./shared/Vector2.js";

export class ChatBox extends ClientGameObject {
    private _typingMode: boolean = false;
    private get typingMode(): boolean {
        return this._typingMode;
    }
    private set typingMode(value: boolean) {
        this._typingMode = value;
        if(this.typingMode) {
            keyboard.claimOwnership("chatbox");
        } else {
            keyboard.releaseOwnership("chatbox");
        }
    }
    private currentSendText: string = "";
    private size: Vector2 = new Vector2(30, 10);
    private messages: Array<string> = new Array<string>();

    constructor() {
        super();
        keyboard.addKeyDownListener("chatbox", (ev) => {    
            if(ev.key == ">") {
                this.typingMode = !this.typingMode;
            } else if(ev.key == "/" && !this.typingMode) {
                this.typingMode = true;
                this.currentSendText = "/";
            } else if (this.typingMode) {
                if(ev.key == "Backspace") {
                    this.currentSendText = this.currentSendText.substring(0, this.currentSendText.length-1);
                } else if(ev.key == "Enter") {
                    this.emit('message', {
                        message: this.currentSendText
                    } as ChatMessageData);
                    this.currentSendText = "";
                    this.typingMode = false;
                } else if (ev.key.length == 1 && this.currentSendText.length <= this.size.x -6 ) {
                    this.currentSendText += ev.key;
                }
            }
           if(this.typingMode){
               ev.preventDefault();
           }
        });

        this.messageHandler.on("message", (sender, data: ChatMessageData) => {
            this.messages.push(data.message);
        });
    }

    update() {
        
    }

    guiDraw() {
        renderer.fillTilesScreenCoord(0, 0, 0, this.size.x, this.size.y, 0, '-');

        let messageOffset = Math.max(this.messages.length-10, 0);

        for (let i = 0; i < 10; i++) {
            if(this.messages[messageOffset+i] != null)
                renderer.writeTextScreenCoord(0, i, 0, this.messages[messageOffset+i]);
        }

        renderer.writeTextScreenCoord(0, this.size.y, 0,  "Chat" + (this.typingMode ? "> " : "--") + this.currentSendText);
    }
}
