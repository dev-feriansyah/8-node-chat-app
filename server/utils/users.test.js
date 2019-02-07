const expect = require('expect');
const { Users } = require('./users');

describe('Users model', () => {
  const users = new Users();

  beforeEach(() => {
    users.users = [
      {id: '1', name: 'feri', room: 'Node Course'},
      {id: '2', name: 'react', room: 'React Course'},
      {id: '3', name: 'node', room: 'Node Course'}
    ];
  });

  it('should add new user to users and return user object', () => {
    const users = new Users();
    const user = {
      id: 'abc',
      name: 'udin',
      room: 'React Course'
    };
    const resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
    expect(resUser).toEqual(user);
  });

  it('should remove user from users array and return removedUser', () => {
    const userOne = {
      id: '1',
      name: 'feri',
      room: 'Node Course'
    };
    const removedUser = users.removeUser('1');
    expect(users.users.length).toBe(2);
    expect(removedUser).toEqual(userOne);
  });

  it('should NOT remove user from users array and return removedUser', () => {
    const removedUser = users.removeUser('99');
    expect(users.users.length).toBe(3);
    expect(removedUser).toBeFalsy();
  });

  it('should return user info', () => {
    const userOne = {
      id: '1',
      name: 'feri',
      room: 'Node Course'
    };
    const foundUser = users.getUser('1');
    expect(foundUser).toEqual(userOne);
  });

  it('should NOT return user info', () => {
    const foundUser = users.getUser('99');
    expect(foundUser).toBeFalsy();
  });

  it('should return array of names with room node', () => {
    const namesArray = users.getUserList('Node Course');

    expect(namesArray).toEqual(['feri', 'node']);
  });

  it('should return array of names with room react', () => {
    const namesArray = users.getUserList('React Course');

    expect(namesArray).toEqual(['react']);
  });
});