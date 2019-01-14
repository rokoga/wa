const RoomManager = require('./RoomManager');
const ClientManager = require('./ClientManager');

const SocketHandler = (io, socket, { id, username }) => {
  const userId = id;

  // Check if the user is logged
  socket.use((packet, next) => {
    if (userId) return next();
    next(new Error('not authorized'));
  });

  socket.on('addRoom', (room, callback) => {
    callback(null, RoomManager.addRoom(room));
  });

  socket.on('addMessage', message => {
    io.to(message.roomId).emit(
      'waMessage',
      RoomManager.addMessage(message, userId, username)
    );
  });

  socket.on('getRoomsByLocation', (location, callback) => {
    callback(null, RoomManager.getRoomsByLocation(location));
  });

  socket.on('getSubscribedRooms', callback => {
    callback(null, ClientManager.getSubscribedRooms(userId));
  });

  socket.on('leaveRoom', (roomId, callback) => {
    socket.leave(roomId, () => {
      callback(null, 'left the room');
    });
  });

  socket.on('subscribeRoom', (roomId, callback) => {
    if (RoomManager.subscribeUser(userId, roomId)) socket.join(roomId);
    callback(null, ClientManager.subscribeRoom(userId, roomId));
  });

  // todo: work on this
  socket.on('socket:onlineUsers', callback => {
    callback(null, ClientManager.onlineUsers());
  });

  // Socket error handler
  socket.on('error', function(err) {
    console.error('received error from client:', socket.id);
  });
};

module.exports = SocketHandler;
