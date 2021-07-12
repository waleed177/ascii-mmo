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
