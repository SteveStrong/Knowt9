import { spToken } from "./sp-token";

export class spSentence {
    id: number = 0;
    tokens: Array<spToken> = new Array<spToken>();

    constructor(token?: spToken) {
        token && this.append(token)
    }

    isEmpty(): boolean {
        return this.tokens.length === 0;
    }

    append(token: spToken) {
        this.tokens.push(token);
        return this;
    }

    lastToken() {
        let token = this.tokens[this.tokens.length - 1]
        return token;
    }

    endsWith(str: string) {
        let token = this.lastToken();
        return token.endsWith(str)
    }

    asString() {
        const reducer = (accumulator: string, currentValue: spToken) => {
            if (accumulator.length === 0)
                return currentValue.text;
            else
                return `${accumulator} ${currentValue.text}`;
        }
        return this.tokens.reduce(reducer, '');
    }

    isLikelyCitation() {
        let found = this.tokens.find(tok => tok.isLikelyCitation())
        return found != null;
    }

    mergeTextFrom(sentence: spSentence) {
        sentence.tokens.forEach(tok => {
            this.append(tok);
        })
        return this;
    }

}

export class spParagraph {
    id: number = 0;
    sentences: Array<spSentence> = new Array<spSentence>();

    constructor(sentence?: spSentence) {
        sentence && this.append(sentence)
    }

    isEmpty(): boolean {
        return this.sentences.length === 0;
    }

    clearAll(): spParagraph {
        this.sentences = new Array<spSentence>();
        return this
    }

    create(token: spToken) {
        let sentence = new spSentence(token)
        this.append(sentence);
        return sentence;
    }

    append(sentence: spSentence) {
        this.sentences.push(sentence);
        sentence.id = this.sentences.length;
        return this;
    }

    firstSentence() {
        return this.sentences[0]
    }

    lastSentence() {
        return this.sentences[this.sentences.length - 1]
    }

    asString() {
        const reducer = (accumulator: string, currentValue: spSentence) => `${accumulator} ${currentValue.asString()}`;
        return this.sentences.reduce(reducer, '');
    }

}

export class spSection {
    id: number = 0;
    public title: spToken;
    public paragraphs: Array<spParagraph> = new Array<spParagraph>();
    public isAttribute: boolean = false

    constructor(title?: spToken, isAttribute: boolean = false) {
        this.title = title;
        this.isAttribute = isAttribute;
    }

    append(paragraph: spParagraph) {
        this.paragraphs.push(paragraph);
        paragraph.id = this.paragraphs.length;
        return this;
    }

    lastParagraph() {
        return this.paragraphs[this.paragraphs.length - 1]
    }

}

export class spDocument {
    attributes: any = {};

    caseNumber = ''
    sections: Array<spSection> = new Array<spSection>();

    isEmpty(): boolean {
        return this.sections.length === 0;
    }

    assert(key: string, value: any) {
        this.attributes[key] = value;
        return this;
    }

    getValue(key: string) {
        return this.attributes[key]
    }

    append(section: spSection) {
        this.sections.push(section);
        section.id = this.sections.length;
        return this;
    }


}
