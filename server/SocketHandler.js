const RoomManager = require('./RoomManager');

const SocketHandler = (io, socket, { id, username }) => {
  const userId = id;

  // Check if the user is logged
  socket.use((packet, next) => {
    if (userId) return next();
    next(new Error('not authorized'));
  });

  socket.on('joinRoom', (room, cb) => {
    RoomManager.subscribeUser(userId, room.id);
    socket.join(room.id, () => {
      cb(null, room);
    });
  });

  socket.on('leaveRoom', (roomId, cb) => {
    socket.leave(roomId, () => {
      cb(null, 'left the room');
    });
  });

  socket.on('addRoom', (room, cb) => {
    console.log(room);
    RoomManager.addRoom(room);
    cb(null, 'added room');
  });

  socket.on('getRooms', (location, cb) => {
    cb(null, RoomManager.getRoomsByLocation(location));
  });

  socket.on('addMessage', message => {
    RoomManager.addMessage(message, userId);
    io.emit(message.roomId).emit('message', message);
  });

  // Retrive the last messages by room
  socket.on('getMessagesByRoom', (roomId, cb) => {
    const _messages = RoomManager.getLastMessages(roomId, userId);
    cb(null, _messages);
  });

  socket.on('socket:onlineUsers', callback => {
    callback(null, clientManager.onlineUsers());
  });

  socket.on('error', function(err) {
    console.error('received error from client:', socket.id);
  });
};

module.exports = SocketHandler;
