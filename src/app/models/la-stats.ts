import { LaAtom } from "./la-atom";
import { LaSentence } from ".";

export class LaStats extends LaAtom {
  name: string = "";
  members: Array<LaSentence> = new Array<LaSentence>();

  constructor(properties?: any) {
    super(properties);
  }

  getMembers():Array<LaSentence> {
    return this.members;
  }

  addMember(obj:LaSentence){
    this.members.push(obj);
  }

  complete() {
    let list = this.members.filter( item => {
      return item.hasAttributionRelation();
    });
    return list.length;
  }

  total() {
    return this.members.length;
  }

  extractText(){
    let filter = "Sentence";
    let label = this.name.replace(filter,"");
    label = label == "" ? filter : label;

    if ( label === filter) {
      label = "Other";
    }
    return label;
  }

  readerLabel() {
    let label = this.extractText();
    return `${label} (${this.total()})`
  }

  markerLabel() {
    let label = this.extractText();

    if ( this.complete() > 0 ) {
      return `${label} (${this.complete()} of ${this.total()})`
    }
    return `${label} (${this.total()})`
  }
}
