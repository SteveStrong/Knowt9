import { spBuffer } from '../sp-buffer';

describe('spBuffer', () => {
  it('should create an instance', () => {
    expect(new spBuffer()).toBeTruthy();
  });

  it('should get first character', () => {
    let buf = new spBuffer();
    buf.setBuffer("hello");
    let char = buf.getChar();
    expect(char).toEqual('h');
  });

  it('should peek character', () => {
    let buf = new spBuffer();
    buf.setBuffer("hello");
    let char = buf.peekChar();
    expect(char).toEqual('h');
    buf.getChar();
    char = buf.peekChar();
    expect(char).toEqual('e');
  });

  it('should get second character', () => {
    let buf = new spBuffer();
    buf.setBuffer("hello");
    let char = buf.getChar();
    char = buf.getChar();
    expect(char).toEqual('e');
  });

  it('should get peek character', () => {
    let buf = new spBuffer();
    buf.setBuffer("hello");
    let char = buf.getChar();
    expect(char).toEqual('h');
    char = buf.peekChar(0);
    expect(char).toEqual('e');
    char = buf.peekChar(3);
    expect(char).toEqual('o');
    char = buf.getChar();
    expect(char).toEqual('e');
  });

});
