var joinForm = document.querySelector('#join-form');
joinForm.addEventListener('submit', function (e) {  
  var name      = joinForm.name;
  name.value = name.value.trim();
  var room      = joinForm.room;
  room.value = room.value.trim();

  if (!name.value.length > 0 || !room.value.length > 0) {
    e.preventDefault();
    alert("Name and room are required");
    name.focus();
  }
});