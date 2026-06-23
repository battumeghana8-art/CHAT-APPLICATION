const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let onlineUsers = 0;

io.on("connection", (socket) => {

    onlineUsers++;

    io.emit("onlineUsers", onlineUsers);

    socket.on("join", (username) => {

        socket.username = username;

        io.emit("systemMessage", {
            text: `🟢 ${username} joined the chat`
        });

    });

    socket.on("chatMessage", (data) => {

        io.emit("chatMessage", {
            username: data.username,
            message: data.message,
            time: new Date().toLocaleTimeString()
        });

    });

    socket.on("disconnect", () => {

        onlineUsers--;

        io.emit("onlineUsers", onlineUsers);

        if(socket.username){

            io.emit("systemMessage", {
                text: `🔴 ${socket.username} left the chat`
            });

        }

    });

});

server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});