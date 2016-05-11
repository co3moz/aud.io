const gluon = require('gluon');
const pem = require('pem');
const app = gluon({
  ready: (app, logger) => {
    pem.createCertificate({days: 1, selfSigned: true}, function (err, keys) {
      if (err) {
        logger.error(err.stack);
        process.exit(1);
      }
      const https = require('https').Server({key: keys.serviceKey, cert: keys.certificate}, app);
      const io = require('socket.io')(https);

      io.on('connection', (socket) => {
        socket.on('data', (data) => {
          socket.broadcast.emit('data', data);
        });
      });

      https.listen(450);
    });
  }
});
