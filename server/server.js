const path     = require('path');
const http     = require('http');
const express  = require('express');
const socketIO = require('socket.io');

const app     = express();
const server  = http.createServer(app);
const io      = socketIO(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, './../public')));

io.on('connection', (socket) => {
  console.log('New user connect to server');

  socket.emit('newMessage', {
    from: 'message@example.com',
    text: 'Some message here!',
    createdAt: 123
  });

  socket.on('createMessage', (message) => {
    console.log('Create new message', message);
  });

  socket.on('disconnect', () => {
    console.log('User has disconnect from server');
  });
});

server.listen(port, () => console.log(`Server run in port ${port}`));