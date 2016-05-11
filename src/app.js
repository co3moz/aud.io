const gluon = require('gluon');
const app = gluon({
  ready: (app) => {
    const http = require('http').Server(app);
    const io = require('socket.io')(http);

    io.on('connection', (socket) => {
      socket.on('data', (data) => {
        socket.broadcast.emit('data', data);
      });
    });

    http.listen('80');
  }
});
