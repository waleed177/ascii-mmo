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

import { Schema, model, Document} from 'mongoose';
import bcrypt from 'bcrypt';
import { ItemData } from '../../client/shared/Item';

export type UserDocument = User & Document<any, any, User>;

// 1. Create an interface representing a document in MongoDB.
export interface User extends Document {
    username: string,
    password: string,
    inventory: Array<ItemData>
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<User>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    inventory: { type: [], required: true }
});

userSchema.pre('save', function(next) {
    var user: UserDocument = this;
    if(!user.isModified('password')) return next();

    bcrypt.genSalt().then((salt) => {
        bcrypt.hash(user.password, salt).then((hash) => {
            user.password = hash;
            next();
        }).catch(err => { next(err); });
    }).catch((err) => {
        next(err);
    });
});

export function comparePassword(user:UserDocument, candidatePassword: string) {
    return bcrypt.compareSync(candidatePassword, user.password);
};


// 3. Create a Model.
export const UserModel = model<User>('User', userSchema);