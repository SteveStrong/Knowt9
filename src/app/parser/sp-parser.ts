import { spBuffer } from "./sp-buffer";
import { spToken } from "./sp-token";
import { spSentence, spParagraph, spSection, spDocument } from "./sp-sentence";
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';

export class spParser {
  private _buffer: spBuffer;

  constructor(text?:string){
    text && this.setBuffer(text);
  }

  setBuffer(text: string) {
    this._buffer = new spBuffer(text);
  }

  getChar() {
    return this._buffer.getChar();
  }

  peekChar(lookAhead: number = 0) {
    return this._buffer.peekChar(lookAhead);
  }

  advanceChar(lookAhead: number = 0) {
    return this._buffer.advanceChar(lookAhead);
  }

  readUntil(until: string) {
    let result = "";
    let char = this.getChar();
    while (char !== until) {
      result += char;
      char = this.getChar();
    }
    result += until;
    return result;
  }

  private isNull(str): boolean {
    if (!str || str.length === 0) {
      return true;
    }
    return false;
  }

  private isWhiteSpace(str): boolean {
    return /^\s*$/.test(str);
  }

  private isDigit(str): boolean {
    return /^\d+$/.test(str);
  }

  private isCapital(str): boolean {
    return /[A-Z]/.test(str);
  }

  private isNullOrWhiteSpace(str): boolean {
    return this.isNull(str) || this.isWhiteSpace(str);
  }

  private isUS(): boolean {
    let word = this.peekChar();
    word += this.peekChar(1);
    word += this.peekChar(2);
    word += this.peekChar(3);
    if ( word === "U.S." ) {
        this.advanceChar(4)
        return true;
    }
    return false;
  }

  readToken(): spToken {
    let result = new spToken();
    let char = this.peekChar();
    let peek = this.peekChar(1);
    while (char) {
      if (char === "." && this.isWhiteSpace(peek)) {
        return result.append(this.getChar());
      } else if (char === "U" && peek == "." && this.isUS()) {
        result.append("U.S.");
      } else if (char === "." && this.isCapital(peek)) {
        return result.append(this.getChar());
      } else if (char === "[") {
        result.append(this.readUntil("]"));
      } else if (this.isWhiteSpace(char)) {
        return result;
      } else if ( char === "§" ) {  
        result.append(this.getChar());
      } else if ( char === "�") {
        this.advanceChar()
        result.append("§");
      } else {
        result.append(this.getChar());
      }
      char = this.peekChar();
      peek = this.peekChar(1);
    }
    return result;
  }

  readWhitespace(): spToken {
    let result = new spToken();
    let char = this.peekChar();
    while (char && this.isWhiteSpace(char)) {
      result.append(this.getChar());
      char = this.peekChar();
    }
    return result;
  }

  readSentence(): spSentence {
    let result = new spSentence();
    this.readWhitespace();
    let token = this.readToken();
    while (!token.isEmpty()) {
      result.append(token);
      if (token.endsWithChar(".")  && token.text != "U.S.") {
        return result;
      }
      this.readWhitespace();
      token = this.readToken();
    }
    return result;
  }

  tokensFromParagraph(paragraph:spParagraph,gap){

    let exceptions = [
      'Vet. App.',
      'Vet.App.',
      '(Jan.',
      '(Feb.',
      '(Mar.',
      '(Apr.',
      '(May.',
      '(Jun.',
      '(Jul.',
      '(Aug.',
      '(Sept.',
      '(Oct.',
      '(Nov.',
      '(Dec.',
      'Fed. Cir.',
      'Fed. Reg.',
      'U.S.C.A.',
      'U. S. A.',
      'C.F.R.',
      'U. S.',
      'J.P.S.',
      'U.S.',
      'Id.',
      'Ft.',
      'Dr.',
      'Mr.',
      ' v. '
    ]

    //create key value
    let dic = {};
    let rev = {}
    exceptions.forEach( key =>
      {
        let val = key.replace(".", "@!").replace(".", "@!").replace(".", "@!").replace(".", "@!")
        dic[key] = val ;
        rev[val] =  key;
      })


    let text = paragraph.asString()

    Object.keys(dic).forEach(key => {
      text = text.replace('Â§','§')
      text = text.replace(key, dic[key]).replace(key, dic[key]).replace(key, dic[key]).replace(key, dic[key])
    })

    let list = text.split(gap)
    let tokens = list.map( item => {
      Object.keys(rev).forEach(key => {
        item = item.replace(key, rev[key]).replace(key, rev[key]).replace(key, rev[key]).replace(key, rev[key])
      })
      return new spToken(item.trim());
    })

    tokens.forEach( tok => {
      if ( tok.endsWithChar('.') )
      {
        tok.removeLastChar();
      }
    })

    return tokens;
  }

  deconstructParagraph(paragraph:spParagraph, gap) {

    //this paragraph has one large sentence,
  
    let splitOn = gap || '. ';
    let tokens = this.tokensFromParagraph(paragraph,splitOn)

    paragraph.clearAll()

    //treat the first 2 special

    let token = tokens.shift();
    if ( token.isNumber()) {
      token.append(splitOn)
      let rest = tokens.shift().append(splitOn);
      paragraph.create(token.append(rest.text))

    } else {
      paragraph.create(token.append(splitOn))
    }

    tokens.forEach(tok => {
      if ( tok.isNullOrWhiteSpace()) {
        return;
      }

      paragraph.create(tok.append(splitOn))
    })



  }

  readDocument(text:string): spDocument {
    let result = new spDocument();
    let section: spSection = undefined;

    let data = text.split('\r\n\r\n');
    if ( data.length == 1 ) {
      data = text.split('\n\n');
    }
    data.forEach( text => {
      let token = new spToken(text)

      if ( token.isStandardSection()) {
        section = new spSection(token.replace('\r','').replace('\n',''));
        result.append(section)
      }
      else if ( token.isKeyAttribute()) {
        section = new spSection(token.replace('\r','').replace('\n',''), true);
        result.append(section)

        let dict = token.attributeDictionary()
        Object.keys(dict).forEach(key => {
          result.assert(key, dict[key]);
        })

      }
      else if ( section && !token.isEmpty()) {
        let sentence = new spSentence(token);
        let paragraph = new spParagraph(sentence)
        section.append(paragraph)

        //split on a '.  '  to create more sentences in this section
        this.deconstructParagraph(paragraph,'. ');
      }
      else if ( text !== "" ) {
        //console.log(`no section to place string ${text}`)
        let sec = new spSection(new spToken());
        let sent = new spSentence(token);
        let para = new spParagraph(sent)
        this.deconstructParagraph(para, '. ');
        sec.append(para)
        result.append(sec)
      }


    })

    result.caseNumber = result.getValue('Citation Nr:');
    return result;
  }

}
