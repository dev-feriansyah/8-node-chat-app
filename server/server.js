const path     = require('path');
const http     = require('http');
const express  = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

const app     = express();
const server  = http.createServer(app);
const io      = socketIO(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, './../public')));

io.on('connection', (socket) => {
  console.log('New user connect to server');

  // Sending event in 1 connection
  // socket.emit('newMessage', {
  //   from: 'message@example.com',
  //   text: 'Some message here!',
  //   createdAt: 123
  // });

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app!'));

  // sending event to all except who send it
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user has joined chat app!'));

  socket.on('createMessage', (message, callback) => {
    // Sending event to all connection
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from server');
  });

  socket.on('disconnect', () => {
    console.log('User has disconnect from server');
  });
});

server.listen(port, () => console.log(`Server run in port ${port}`));