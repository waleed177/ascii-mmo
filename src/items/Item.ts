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

import { ItemData } from "../../client/shared/Item";
import { Vector3 } from "../../client/shared/Vector3";
import { ClientHandler } from "../ClientHandler";
import { NetworkEntity } from "../NetworkEntity";
import { NetworkWorld } from "../NetworkWorld";
import { Tile } from "../tiles/Tile";


export class Item {
    public id: string;
    public displayName: string;
    
    public getTile(world: NetworkWorld, position: Vector3): Tile {
        return null;
    }

    public constructEntity(world: NetworkWorld, position: Vector3): NetworkEntity {
        return null;
    }

    public canBePlaced(world: NetworkWorld, position: Vector3) : boolean {
        return this.getTile(world, position) != null 
            || this.constructEntity(world, position) != null;
    }

    public isPlacable(world: NetworkWorld): boolean {
        return false;
    }

    public instanceData(quantity: number): ItemData {
        return {
            id: this.id,
            displayName: this.displayName,
            quantity: quantity
        }
    }

    public useItem(clientHandler: ClientHandler): boolean {
        return false;
    }
}