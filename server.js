const express = require('express');
const colyseus = require("colyseus");
const http = require("http");
const path = require('path');
const { WebSocketTransport } = require("@colyseus/ws-transport");
const GooberRoom = require('./GooberRoom');

const app = express();
const port = process.env.PORT || 8080;

// This helps the Matchmaker read the "join" request
app.use(express.json());

const httpServer = http.createServer(app);

const transport = new WebSocketTransport({
    server: httpServer,
});

const gameServer = new colyseus.Server({
    transport: transport 
});


gameServer.define('my_room', GooberRoom);

app.use(express.static(path.join(__dirname, '/')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});