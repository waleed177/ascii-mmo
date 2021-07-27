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

import { NetworkEntity } from './NetworkEntity';
import { UseChoiceData } from '../client/shared/UseChoiceData';
import { NPCDialogueData } from '../client/shared/NPCDialogueData';
import { DialogueType } from './DialogueBuilder';
import { DialogueExecutor } from './DialogueExecutor';
import { dialogues } from './NPCData';
import { ServerGameObject } from './ServerGameObject';
import { ServerSerializedGameObject } from './ServerSerializedGameObject';

export class NPC extends NetworkEntity {
    private dialogue: DialogueType;
    private _dialogueName: string;
    public get dialogueName(): string {
        return this._dialogueName;
    }
    public set dialogueName(value: string) {
        this._dialogueName = value;
        this.dialogue = dialogues.get(value);
    }

    constructor() {
        super();

        this.prefab = "npc";
        this.sprite = "N";
    }

    deserialize(data: ServerSerializedGameObject) {
        super.deserialize(data);
        let publicData = data.privateData as {dialogueName: string};
        this.dialogueName = publicData.dialogueName;
    }

    ready() {
        this.messageHandler.on("talk", (sender, data) => {
            sender.dialogueExecutor = new DialogueExecutor(sender, this.dialogue);
            this.emitTo(sender, "newDialogue", sender.dialogueExecutor.getCurrentPromptData());
            this.emitTo(sender, "talk", {});
        });

        this.messageHandler.on("use", (sender, data: UseChoiceData) => {
            this.emitTo(sender, "newDialogue", sender.dialogueExecutor.useOption(data.id));
        });
    }

    getPrivateData() {
        return {
            dialogueName: this.dialogueName
        };
    }
}