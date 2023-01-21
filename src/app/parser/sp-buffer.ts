export class spBuffer {
  private _cur = 0;
  private _buffer: string = "";

  constructor(buf:string = ""){
    this.setBuffer(buf)
  }

  setBuffer(buf: string) {
    this._cur = 0;
    this._buffer = buf;
    return this;
  }

  getChar() {
    if (this._cur < this._buffer.length) {
      let value = this._buffer[this._cur++];
      return value;
    }
    return undefined;
  }
  putChar() {
    if (this._cur > 0) {
      this._cur--;
    }
    return this.peekChar();
  }

  peekChar(lookAhead: number = 0) {
    let id = this._cur + lookAhead;
    if (id < this._buffer.length) {
      return this._buffer[id];
    }
    return undefined;
  }

  advanceChar(lookAhead: number = 0) {
    this._cur = this._cur + lookAhead;
  }

  jumpToKey(key:string){
    if ( this._buffer.includes(key)) {
      this._cur = this._buffer.indexOf(key) + key.length;
      return true;
    }
    return false;
  }

  private isWhiteSpace(str): boolean {
    return /^\s*$/.test(str);
  }

  skipWhitespace(){
    let char = ''
    while( (char = this.peekChar()) && this.isWhiteSpace(char)) {
      this.getChar()
    }
  }

  readUntilWhitespace(){
    let char = ''
    let result = '';

    while( (char = this.getChar()) && !this.isWhiteSpace(char)) {
      result += char
    }
    return result;
  }
}
