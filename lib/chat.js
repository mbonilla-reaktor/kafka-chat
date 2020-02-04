const socketIo = require("socket.io");
const _ = require('underscore')

module.exports = (server) => {

    const chatServer = {}
    chatServer.io = socketIo(server)
    const EventEmitter = require('events').EventEmitter;

    chatServer.io.sockets.on('connection', socket => {
        // socket.emit('chat-message', messages)

        console.log(`socket[${socket.id}] connected`);

        socket.on('message', (message) => {
            chatServer.sendMessage(socket, message);
        });

        socket.on('disconnect', function () {
            chatServer.disconnect(socket);
        });

    });

    chatServer.sendMessage = (socket, message) => {
        console.log("send message event")
        chatServer.emit('send-message', message);
    }
    chatServer.disconnect = (socket) => {
        console.log(`[${socket.id}]: disconnected`)
    }
    chatServer.broadcast = (messages) => {
        chatServer.io.emit('chat-message', messages);
    };

    EventEmitter.call(chatServer);
    _.extend(chatServer, EventEmitter.prototype);

    return chatServer
}
