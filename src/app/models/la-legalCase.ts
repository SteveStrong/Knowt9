import { LaAtom } from "./la-atom";
import { LaParagraph } from "./la-paragraph";
import { LaSentence } from "./la-sentence";
import { LaUser } from "./la-user";

import { LaDecisionNode, LaDecisionRoot } from "./la-decisionNode";
import { LaUploadedCase, LaCaseCoreInfo } from "./la-caseDirectoryItem";
import { getLocaleDateTimeFormat } from '@angular/common';

import { Tools } from '../shared';

export class LaLegalCase extends LaAtom {
  caseInfo: LaCaseCoreInfo;
  caseNumber: string;
  text: string = "";

  private paragraphLookup = {};
  paragraphs: Array<LaParagraph> = new Array<LaParagraph>();

  private sentenceLookup = {};
  sentences: Array<LaSentence> = new Array<LaSentence>();

  private decisionLookup = {};
  decisionRoot: LaDecisionRoot;

  constructor(properties?: any) {
    super(properties);
  }

  findOrCreateParagraph(name: string) {
    let result = this.paragraphLookup[name];
    if (!result) {
      result = new LaParagraph({
        caseNumber: this.caseNumber,
        paragraphNumber: name
      });
      this.paragraphs.push(result);
      this.paragraphLookup[name] = result;
    }
    return result;
  }

  createParagraphs(list: Array<LaSentence>) {
    this.sentences = list;

    list.forEach(item => {
      let paraNum = item.paragraphNumber;
      let paragraph = this.findOrCreateParagraph(paraNum);
      paragraph.addSentence(item);

      this.sentenceLookup[item.sentID] = item;
    });
    this.paragraphs = this.paragraphs.sort((a, b) => {
      return a.id - b.id;
    });

    this.paragraphs.forEach(para => {
      para.sortSentences();
    });
    return this.paragraphs;
  }

  findParagraph(previous: LaSentence): LaParagraph {
    let paraNum = previous.paragraphNumber;
    let next = this.findOrCreateParagraph(paraNum);
    return next;
  }

  getNextSentence(previous: LaSentence): LaSentence {
    let key = previous.sentID;
    let id = previous.id + 1;
    let target = `${previous.caseNumber}P${previous.paragraphNumber}S${id}`;
    let next = this.sentences.find(item => item.sentID == target);
    return next;
  }

  //maybe do a soft delete
  deleteSentence(obj: LaSentence) {
    const index = this.sentences.indexOf(obj);
    if (index > -1) {
      this.sentences.splice(index, 1);
    }

    let paraNum = obj.paragraphNumber;
    let paragraph = this.findOrCreateParagraph(paraNum);
    paragraph.deleteSentence(obj);
  }


  splitText(text: string, subText: string) {
    let length = subText.length;
    let start = text.indexOf(subText);

    // try to make adjustment for poor selection
    if (start < 3) {
      length += start;
      start = 0;
    }

    let end = start + length;

    let first = text.substring(0, start);
    let last = text.substring(end);

    return { first, last };
  }

  splitSentence(sentence, subText: string, rhetClass: string): LaParagraph {
    let name = sentence.paragraphNumber;
    let paragraph = this.paragraphLookup[name] as LaParagraph;
    let caseNumber = sentence.caseNumber;

    sentence.clearPrediction();

    if (sentence.text === subText || subText === "") {
      sentence.rhetClass = rhetClass;
      return paragraph;
    }

    let ogText = sentence.text;
    let ogRhetClass = sentence.rhetClass;

    //we have the split
    let { first, last } = this.splitText(ogText, subText);

    let id = sentence.id;
    if (first) {
      sentence.text = first;

      let insert = new LaSentence({
        text: subText,
        caseNumber: caseNumber,
        paragraphNumber: name,
        rhetClass: rhetClass,
        id: id + 0.1
      });
      paragraph.addSentence(insert);
    } else {
      sentence.text = subText;
      sentence.rhetClass = rhetClass;
    }

    if (last) {
      let tail = new LaSentence({
        text: last,
        caseNumber: caseNumber,
        paragraphNumber: name,
        rhetClass: ogRhetClass,
        id: id + 0.2
      });
      paragraph.addSentence(tail);
    }

    paragraph.renumSentences();
    this.refreshSentences();
    return paragraph;
  }

  refreshSentences() {
    let refresh = new Array<LaSentence>();
    this.paragraphs.forEach(para => {
      para.sentences.forEach(sent => {
        refresh.push(sent);
      });
    });

    this.paragraphs.forEach(para => {
      para.clearSentences();
    });
    this.createParagraphs(refresh);
  }

  resolveSentenceKeys(list): Array<LaSentence> {
    let result = new Array<LaSentence>();
    list &&
      list.forEach(item => {
        let found = this.sentenceLookup[item];
        if (found) {
          result.push(found);
        }
      });
    return result;
  }

  resolveDecisionKeys(list): Array<LaDecisionNode> {
    let result = new Array<LaDecisionNode>();
    list &&
      list.forEach(item => {
        let found = this.decisionLookup[item];
        if (found) {
          result.push(found);
        }
      });
    return result;
  }

  attachDecisionRoot(root: LaDecisionRoot) {
    this.decisionLookup = {};
    this.attachDecision(root);
    this.decisionRoot = root;
  }

  private attachDecision(decision: LaDecisionNode) {
    this.decisionLookup[decision.ruleID] = decision;
    decision.subNodes &&
      decision.subNodes.forEach(item => {
        this.attachDecision(item);
      });
  }

  private getDateTime(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    dateTime = today.toISOString(); //.split('T')[0]
    return dateTime;
  }

  setCaseInfo(props){
    this.caseInfo = new LaCaseCoreInfo(props);
  }

  createCaseCoreInfo(props:any, pattern?:string){
    let info = new LaCaseCoreInfo({
      guidKey: Tools.generateUUID(),
      name: this.caseNumber,
      extension: '.json',
      version: '0000',
      owner: 'vern.r.walker@hofstra.edu',
      keywords: '',
      lastChange: this.getDateTime()
    });
    info = Object.assign(info, props);
    info.fileName = info.computeFileName(pattern);
    return info;
  }

  getCaseInfo(props:any, pattern:string=""){
    if ( !this.caseInfo ) {
      this.caseInfo = this.createCaseCoreInfo(props,pattern);
    }
    return this.caseInfo;
  }

  asJson() {
    
    //remove predictions from sentences
    let hash = [];
    this.sentences.forEach(item => {
      hash.push({ s: item, p: item.predictions });
      delete item.predictions;
    });


    let result = {
      caseNumber: this.caseNumber,
      caseInfo: this.getCaseInfo({}),
      ruleTree: this.decisionRoot.asJson(),
      sentences: this.sentences,
      text: this.text
    };

    //recover reference
    hash.forEach(item => {
      item.s.predictions = item.p;
    });

    return result;
  }

  asUploadedCase(user:LaUser, workspace:string, pattern:string): LaUploadedCase {
    
    //push the author into the case body
    this.caseInfo = Object.assign(this.caseInfo, {
      owner: user ? user.username : 'unknown',
      workspace: workspace ? workspace : 'development',
      lastChange: this.getDateTime()
    });
    
    let model = this.asJson();
    let uploadedCase = new LaUploadedCase(model.caseInfo);
    uploadedCase.fileName = model.caseInfo.computeFileName(pattern);
    uploadedCase.data = JSON.stringify(model);

    return uploadedCase;
  }
}
