var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('New message', message);
  var messages = document.querySelector('#messages');
  var li       = document.createElement('li');
  var liValue  = document.createTextNode(`${message.from}: ${message.text}`);
  li.appendChild(liValue);
  messages.appendChild(li);
});

socket.on('newLocationMessage', function (message) {
  var messages = document.querySelector('#messages');
  var li       = document.createElement('li');
  var liValue  = document.createTextNode(`${message.from}: `);
  var a        = document.createElement('a');
  var aValue   = document.createTextNode('My current location');
  a.setAttribute('target', '_blank');
  a.setAttribute('href', message.url);
  a.appendChild(aValue);
  li.appendChild(liValue);
  li.appendChild(a);
  messages.appendChild(li);
});

var messageForm = document.querySelector('#message-form');
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

var locationButton = document.querySelector('#send-location');
locationButton.addEventListener('click', function () {
  if(!navigator.geolocation) {
    return alert('Your browser not support geolocation');
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position);
    socket.emit('createLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location');
  });
});