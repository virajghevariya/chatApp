// const nameVal = document.getElementById("name");
// const submitButton = document.getElementById("button");

// submitButton.addEventListener("click", () => {
// });

const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4400;

const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

const socketConnected = new Set();

io.on('connection', onConnected);

function onConnected(socket) {
    console.log(socket.id);
    socketConnected.add(socket.id);

    io.emit('clients-total', socketConnected.size);

    socket.on('disconnect', () => {
        console.log('Socket disconnected: ', socket.id);
        socketConnected.delete(socket.id);
        io.emit('clients-total', socketConnected.size);
    });

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-message', data);
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);        
    });
}
