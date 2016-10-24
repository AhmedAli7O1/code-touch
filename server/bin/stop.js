var io = require('socket.io-client');

var port = process.env.PORT || '3000';

var socketClient = io.connect('http://localhost:' + port);

socketClient.on('connect', () => {
    socketClient.emit('npmStop');
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});