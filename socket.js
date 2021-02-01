const socketio  = require('socket.io');

let io;

module.exports = {
  init: (httpServer, obj) => {
    io = socketio(httpServer, obj);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized');      
    }
    return io;
  }
}