var socket = io();

// helper function for render message
var loadMessage = function (data) {
  var messages = document.querySelector('#messages');
  var template = document.querySelector('#message-template').innerHTML;
  var html     = Mustache.render(template, data);
  messages.insertAdjacentHTML('beforeend', html);
};

// function for autoscrolling
var scrollToBottom = function () {
  // Selectors
  var messages    = document.querySelector('#messages');
  var newMessage  = messages.children[messages.children.length - 1];
  // Height
  var clientHeight = messages.clientHeight;
  var scrollTop    = messages.scrollTop;
  var scrollHeight = messages.scrollHeight;
  var newMessageHeight  = newMessage.offsetHeight;
  var lastMessageHeight = (newMessage.previousElementSibling) ? newMessage.previousElementSibling.offsetHeight : 0;

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop = scrollHeight;
  }
};

socket.on('connect', function () {
  var searchParams = new URLSearchParams(window.location.search);
  var params = {
    name: searchParams.get('name'),
    room: searchParams.get('room')
  };
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
      return;
    }
    // console.log('no Err');
  });
});

socket.on('updateUsersList', function(users) {
  var userTag = document.querySelector('#users');
  var ol = document.createElement('ol');
  users.forEach(function(user) {
    var li = document.createElement('li');
    var liValue = document.createTextNode(user);
    li.appendChild(liValue);
    ol.appendChild(li);
  });

  userTag.innerHTML = '';
  userTag.appendChild(ol);
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  loadMessage({
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  loadMessage({
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  scrollToBottom();
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

var messageForm = document.querySelector('#message-form');
messageForm.addEventListener('submit', function (e) {
  e.preventDefault();
  socket.emit('createMessage', {
    text: messageForm.message.value
  }, function (data) {
    messageForm.message.value = '';
  });
});

var locationButton = document.querySelector('#send-location');
locationButton.addEventListener('click', function () {
  if(!navigator.geolocation) {
    return alert('Your browser not support geolocation');
  }

  locationButton.setAttribute('disabled', 'disabled');
  locationButton.textContent = 'Sending location ...';

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttribute('disabled');
    locationButton.textContent = 'Send location';
    socket.emit('createLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttribute('disabled');
    locationButton.textContent = 'Send location';
    alert('Unable to fetch location');
  });
});