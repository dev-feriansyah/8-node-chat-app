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
    const user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      // Sending event to private room all connection
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocation', ({latitude, longitude}) => {
    const user = users.getUser(socket.id);
    io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, latitude, longitude));
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