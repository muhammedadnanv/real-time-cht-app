const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user', (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('chat-message', {
            username: 'System',
            message: `${username} has joined the chat`,
        });
    });

    socket.on('send-chat-message', (message) => {
        io.emit('chat-message', {
            username: users[socket.id],
            message: message,
        });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('chat-message', {
            username: 'System',
            message: `${users[socket.id]} has left the chat`,
        });
        delete users[socket.id];
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
