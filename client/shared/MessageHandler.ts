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

import {ReceivedData} from './ReceivedData.js'

type MessageHandlerFunction<T> = (sender: T, data: any) => void;

export class MessageHandler<T> {
    private functionBindings: Map<string, MessageHandlerFunction<T>>;

    constructor() {
        this.functionBindings = new Map<string, MessageHandlerFunction<T>>();
    }

    public on(type: string, callback: MessageHandlerFunction<T>) {
        this.functionBindings.set(type, callback);
    }

    public handle(sender: T, data: ReceivedData) {
        if(this.functionBindings.has(data.type))
            this.functionBindings.get(data.type)(sender, data.json);
        else
            console.error("Function binding " + data.type + " does not exist!");
    }
}
