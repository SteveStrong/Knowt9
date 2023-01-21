const keyAttributes = [
  "Citation Nr:",
  "Decision Date:",
  "Archive Date:",
  "DOCKET NO."
]

const standardSections = [
  "THE ISSUE",
  "THE ISSUES",
  "INTRODUCTION",
  "REPRESENTATION",
  "ATTORNEY FOR THE BOARD",
  "WITNESS AT HEARING ON APPEAL",
  "FINDING OF FACT",
  "FINDINGS OF FACT",
  "CONCLUSION OF LAW",
  "CONCLUSIONS OF LAW",
  "REASONS AND BASES FOR FINDING AND CONCLUSION",
  "REASONS AND BASES FOR FINDING AND CONCLUSIONS",
  "REASONS AND BASES FOR FINDINGS AND CONCLUSION",
  "REASONS AND BASES FOR FINDINGS AND CONCLUSIONS",
  "ORDER",
  "REMAND",
];

import { spBuffer } from "./sp-buffer";

export class spToken {
  private _text: string;

  constructor(text: string = "") {
    this._text = text;
  }

  asString():string {
    return this._text || "";
  }

  get text() {
    return this._text;
  }

  private isDigits(str): boolean {
    return /^\d+$/.test(str);
  }

  isEmpty(): boolean {
    return this._text === "";
  }



  isNumber(): boolean {
    return !this.isEmpty() && this.isDigits(this._text)
  }

  isNull(): boolean {
    if (!this._text || this._text.length === 0) {
      return true;
    }
    return false;
  }

  isWhiteSpace(): boolean {
    return /^\s*$/.test(this._text);
  }

  isNullOrWhiteSpace(): boolean {
    return this.isNull() || this.isWhiteSpace();
  }

  isKeyAttribute() {
    const text = this._text;
    for (var i = 0; i < keyAttributes.length; i++) {
      if (text.includes(keyAttributes[i])) {
        return true;
      }
    }
    return false;
  }

  isStandardSection() {
    const text = this._text;
    for (var i = 0; i < standardSections.length; i++) {
      if (text.includes(standardSections[i])) {
        return true;
      }
    }
    return false;
  }
  
  isLikelyCitation(){
    return false;
  }

  attributeDictionary():any {
    let result = {}
    keyAttributes.forEach( key => {
      let buffer = new spBuffer(this.text)
      if ( buffer.jumpToKey(key) ) {
        buffer.skipWhitespace()
        let value = buffer.readUntilWhitespace();
        result[key] = value;
      }
    })
    return result;
  }

  startsWithChar(char: string) {
    return !this.isEmpty() && this._text[0] === char;
  }

  endsWithChar(char: string) {
    let len = this._text.length - 1;
    return !this.isEmpty() && this._text[len] === char;
  }

  removeLastChar() {
    let len = this._text.length - 1;
    this._text = this._text.substring(0,len);
  }

  endsWith(str: string) {
    return !this.isEmpty() && this._text.endsWith(str);
  }

  append(char: string): spToken {
    this._text = `${this._text}${char}`;
    return this;
  }

  replace(oldString:string, newString:string): spToken {
    this._text = this._text.replace(oldString,newString)
    return this;
  }
}
