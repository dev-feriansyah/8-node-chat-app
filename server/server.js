const path     = require('path');
const http     = require('http');
const express  = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const app     = express();
const server  = http.createServer(app);
const io      = socketIO(server);
const users   = new Users();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, './../public')));

io.on('connection', (socket) => {
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) && isRealString(params.room)) {
      return callback("Name and room are required");
    }
    socket.join(params.room) // Join to private connection socket.join('private room')
    // socket.leave(params.room) // leave private connection socket.leave('private room')
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app!'));
    // sending event to all except who send it 
    // to -> sending to private room
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    // Sending event to all connection
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from server');
  });

  socket.on('createLocation', ({latitude, longitude}) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', latitude, longitude));
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);
    if(user) {
      socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat`));
      io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
    }
  });
});

server.listen(port, () => console.log(`Server run in port ${port}`));