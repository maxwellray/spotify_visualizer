const express                   = require('express')();
const http                      = require('http').createServer(express);
const io                        = require('socket.io')(http, {origins: '*:*'});
const {getSocket, buildMessage} = require('./hueController');

getSocket().then((s) => {
  io.on('connection', (socket) => {
    console.log('received connection');
    socket.on('command', (d) => {
      const message = buildMessage(JSON.parse(d));
      s.send(message);
    })
  });
});

http.listen(3002, () => {
  console.log('Listening on *:3002')
});


