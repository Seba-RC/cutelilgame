
const express = require('express');
const colyseus = require("colyseus");
const http = require("http");
const path = require('path');
const { WebSocketTransport } = require("@colyseus/ws-transport");
const GooberRoom = require('./GooberRoom');

const port = process.env.PORT || 8080;

const server = colyseus.defineServer({
    rooms: {
        my_room: colyseus.defineRoom(GooberRoom)
    },

    transport: new WebSocketTransport(),

    express: (app) => {
        // This helps the Matchmaker read the "join" request
        app.use(express.json());

        // app.use("/", colyseus.playground());

        app.use(express.static(path.join(__dirname, '/')));

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });
    }
});

server.listen(port).then(() =>
    console.log(`Server is listening on port ${port}`));