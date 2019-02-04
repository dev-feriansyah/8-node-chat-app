const expect = require('expect');

const { generateMessage } =  require('./message');

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