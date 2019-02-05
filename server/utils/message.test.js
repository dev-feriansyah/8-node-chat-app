const expect = require('expect');

const { generateMessage, generateLocationMessage } =  require('./message');

describe('Generate message', () => {
  it('should return object message', () => {
    const from = 'feri';
    const text = 'text here';
    const message = generateMessage(from, text);
    
    expect(message).toMatchObject({
      from,
      text
    });
    expect(typeof message.createdAt).toBe('number');
  });
});

describe('Generate location message', () => {
  it('should return object message with url location', () => {
    const from      = 'feri';
    const latitude  = 1;
    const longitude = 2;
    const message   = generateLocationMessage(from, latitude, longitude);
    expect(message).toMatchObject({
      from,
      url: `https://www.google.com/maps?q=${latitude},${longitude}`
    });
    expect(typeof message.createdAt).toBe('number');
  });
});