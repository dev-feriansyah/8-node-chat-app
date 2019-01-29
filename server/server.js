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

  socket.on('disconnect', () => {
    console.log('User has disconnect from server');
  });
});

server.listen(port, () => console.log(`Server run in port ${port}`));