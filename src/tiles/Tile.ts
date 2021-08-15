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


import { Vector3 } from "../../client/shared/Vector3";
import { ClientHandler } from "../ClientHandler";
import { ServerGameObject } from "../ServerGameObject";
import { TileMapObject } from "../TileMapObject";

export interface ITileBehaviour {
    use(client: ClientHandler): void;

    collide(tileMap: TileMapObject, localPosition: Vector3, collider: ServerGameObject, tileSymbol: string): void;
}

export class Tile implements ITileBehaviour {
    public id: string;
    public displayName: string;
    public chars: Array<string>;
    public canCollide: boolean = true;

    public use(client: ClientHandler) {
        this.onUse(client);
    }

    public collide(tileMap: TileMapObject, localPosition: Vector3, collider: ServerGameObject, tileSymbol: string) {
        this.onCollide(tileMap, localPosition, collider, tileSymbol);
    }

    protected onUse(client: ClientHandler) {

    }

    protected onCollide(tileMap: TileMapObject, localPosition: Vector3, collider: ServerGameObject, tileSymbol: string) {

    }
}


