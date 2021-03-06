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
        if (this.typingMode) {
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
            if (ev.key == ">") {
                this.typingMode = !this.typingMode;
            } else if (ev.key == "/" && !this.typingMode) {
                this.typingMode = true;
                this.currentSendText = "/";
            } else if (this.typingMode) {
                if (ev.key == "Backspace") {
                    this.currentSendText = this.currentSendText.substring(0, this.currentSendText.length - 1);
                } else if (ev.key == "Enter") {
                    if (this.currentSendText == "/client_credits") {
                        this.messages.push("client> Copyright (C) 2021 waleed177");
                    } else if (this.currentSendText == "/logout") {
                        window.localStorage.clear()
                        window.location.reload()
                    } else {
                        if (this.currentSendText.startsWith("/login")) {
                            const [_, username, password] = this.currentSendText.split(" ")
                            window.localStorage.setItem("username", username)
                            window.localStorage.setItem("password", password)
                        }
                        this.emit('message', {
                            message: this.currentSendText
                        } as ChatMessageData);
                    }
                    this.currentSendText = "";
                    this.typingMode = false;
                } else if (ev.key.length == 1 && this.currentSendText.length <= this.size.x - 6) {
                    this.currentSendText += ev.key;
                }
            }
            if (this.typingMode) {
                ev.preventDefault();
            }
        });

        this.messageHandler.on("message", (sender, data: ChatMessageData) => {
            this.messages.push(data.message);
        });
    }

    ready() {
        const stored_username = window.localStorage.getItem("username")
        const stored_password = window.localStorage.getItem("password")
        if (stored_password && stored_username) {
            this.emit("message", { message: `/login ${stored_username} ${stored_password}` } as ChatMessageData)
        }
    }

    update() {

    }

    guiDraw() {
        renderer.fillTilesScreenCoord(0, 0, 0, this.size.x, this.size.y, 0, '-');

        let messageOffset = Math.max(this.messages.length - 10, 0);

        for (let i = 0; i < 10; i++) {
            if (this.messages[messageOffset + i] != null)
                renderer.writeTextScreenCoord(0, i, 0, this.messages[messageOffset + i]);
        }

        renderer.writeTextScreenCoord(0, this.size.y, 0, "Chat" + (this.typingMode ? "> " : "--") + this.currentSendText);
    }
}
