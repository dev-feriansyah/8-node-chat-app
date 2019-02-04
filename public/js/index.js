const socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('New message', message);
  const messages = document.querySelector('#messages');
  const li = document.createElement('li');
  const liValue = document.createTextNode(`${message.from}: ${message.text}`);
  li.appendChild(liValue);
  messages.appendChild(li);
});

const messageForm = document.querySelector('#message-form');
messageForm.addEventListener('submit', function (e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: messageForm.message.value
  }, function (data) {
    messageForm.message.value = '';
    console.log(data);
  });
});