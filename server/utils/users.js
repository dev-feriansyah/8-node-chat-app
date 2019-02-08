class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if(userIndex === -1) {
      return null;
    }
    const removedUser = this.users[userIndex];
    this.users.splice(userIndex, 1);
    return removedUser;
  }
 
  getUser(id) {
    return this.users.find(user => user.id === id);
  }

  isNameExist(name) {
    return this.users.some(user => user.name === name);
  }

  getUserList(room) {
    return this.users
      .filter(user => user.room === room)
      .map(user => user.name);
  }
}

module.exports = {
  Users
};
