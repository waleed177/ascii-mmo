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

import express = require('express');
import path = require('path');
import expressWs from 'express-ws';
import { Server } from './Server';

export let app = expressWs(express()).app;

app.use(express.static((path.join(__dirname, '../../public'))))

app.get('/', function(req: express.Request, res: express.Response) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

var server = new Server();

server.start();

app.listen(process.env.PORT || 3000);

console.log("Server running");
