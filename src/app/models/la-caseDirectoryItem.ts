import { LaAtom } from "./la-atom";
import { Tools } from "../shared/foTools";

export class LaCaseCoreInfo extends LaAtom {
  fileName: string;
  guidKey: string;
  version: string;
  lastChange: string;
  name: string;
  extension: string;
  prevFileName:string;
  nextFileName:string;
  title: string;
  description: string;
  keywords: string;
  notes: string;
  owner: string;
  workspace: string;

  constructor(properties?: any) {
    super(properties);
  }

  public computeFileName(pattern?:string) {
    const format = pattern ? pattern : "case-{name}-{version}"
    const result = Tools.applyTemplate(format,this)
    return `${result}${this.extension}`;
  }

}

export class LaCaseDirectoryItem extends LaCaseCoreInfo {
  uri: string;

  constructor(properties?: any) {
    super(properties);
  }



caseCompare(other: LaCaseDirectoryItem):number {
    if ( this.workspace == other.workspace ) {
      if ( this.fileName == other.fileName) {
        return 0;
      }
      return this.fileName < other.fileName ? 1 : -1;
    }
    return this.workspace < other.workspace ? 1 : -1;
  }
}

export class LaUploadedCase extends LaCaseDirectoryItem {
  data: string;

  constructor(properties?: any) {
    super(properties);
  }
}

export class LaDownloadedCase extends LaCaseDirectoryItem {
  uri: string;
  data: string;

  constructor(properties?: any) {
    super(properties);
  }
}

