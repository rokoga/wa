const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const chatManager = require('./chatManager.js');
const ClientManager = require('./ClientManager');
const RoomManager = require('./RoomManager');
const app = express();

// server port
const port = 8000;

// server instance
const server = http.createServer(app);

// creates a socket using the server instance
const io = socketIO(server);

// creates a new room
const room = chatManager('testRoom');

const clientManager = ClientManager();

io.on('connection', socket => {
  socket.on('socket:addUser', username => {
    clientManager.registerClient(socket, { username });
  });

  socket.on('socket:joinRoom', (roomId = 'mainroom') => {
    const _roomId = roomId.toString();
    socket.join(_roomId, () => {
      socket.broadcast.to(_roomId).emit('socket:addUser', { username });
    });
  });

  socket.on('addRoom', room => {});

  socket.on('getRooms', (location, cb) => {
    cb(null, RoomManager.getRoomsByLocation(location));
  });

  socket.on('addmessage', message => {
    //room.addMessage(message);

    socket.broadcast.to('mainroom').emit('message', message);
  });

  socket.on('socket:onlineUsers', callback => {
    callback(null, clientManager.onlineUsers());
  });

  socket.on('disconnect', () => {
    clientManager.removeClient(socket);
  });

  socket.on('error', function(err) {
    console.log('received error from client:', socket.id);
  });
});

// starts a unix socket and listen for connections based on the port
server.listen(port, err => {
  if (err) throw err;
  console.log(`server listening to port 8000`);
});
