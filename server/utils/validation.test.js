const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject non-string value', () => {
    const res = isRealString(24);
    expect(res).toBe(false);
  });
  it('should reject string if only have space', () => {
    const res = isRealString('                     ');
    expect(res).toBe(false);
  });
  it('should allow string with non-space or space in start', () => {
    const res = isRealString('          test');
    const res2 = isRealString('testing');
    expect(res).toBe(true);
    expect(res2).toBe(true);
  });
});