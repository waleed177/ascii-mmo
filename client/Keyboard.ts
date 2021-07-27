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

type KeyboardEventFunction = (ev: KeyboardEvent) => void;
type KeyboardEventFunctionAndData = {
    scope: OwnerType,
    callback: KeyboardEventFunction
}
type OwnerType = object | string;

export class Keyboard {
    private keys: Map<string, boolean>;
    private currentScope: OwnerType;
    private scopeStack: Array<OwnerType> = new Array<OwnerType>();
    private keyboardOwner: OwnerType;
    private keyDownListeners = new Array<KeyboardEventFunctionAndData>();
    private keyUpListeners = new Array<KeyboardEventFunctionAndData>();

    constructor() {
        this.keys = new Map<string, boolean>();
    }

    public hookToWindow() {
        window.addEventListener("keydown", (ev: KeyboardEvent) => {
            this.keys.set(ev.key, true);
            for(let i = 0; i < this.keyDownListeners.length; i++) {
                var keyDownListener = this.keyDownListeners[i];
                if(keyDownListener.scope == this.keyboardOwner || this.keyboardOwner == null) 
                    keyDownListener.callback(ev);
            }
        });
        window.addEventListener("keyup", (ev: KeyboardEvent) => {
            this.keys.set(ev.key, false);
            for(let i = 0; i < this.keyUpListeners.length; i++) {
                var keyUpListener = this.keyUpListeners[i];
                if(keyUpListener.scope == this.keyboardOwner || this.keyboardOwner == null) 
                    keyUpListener.callback(ev);
            }
        });
    }

    public addKeyDownListener(scope: OwnerType, callback: KeyboardEventFunction) {
        this.keyDownListeners.push({
            scope: scope,
            callback: callback
        });
    }

    public isKeyDown(key: string) {
        return (this.currentScope == this.keyboardOwner || this.keyboardOwner == null) && this.keys.get(key);
    }

    public startScope(name: OwnerType) {
        if (this.currentScope != null)
            this.scopeStack.push(this.currentScope);
        this.currentScope = name;
    }

    public endScope() {
        this.currentScope = this.scopeStack.pop();
    }

    public claimOwnership(name: OwnerType) {
        if (this.keyboardOwner == null)
            this.keyboardOwner = name;
    }

    public setOwnership(name: OwnerType, own: boolean) {
        if(own) {
            this.claimOwnership(name);
        } else {
            this.releaseOwnership(name);
        }
    }

    public releaseOwnership(name: OwnerType) {
        if (this.keyboardOwner == name) 
            this.keyboardOwner = null;
    }
}
