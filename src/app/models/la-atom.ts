export class LaAtom {
  constructor(properties?: any) {
    properties && this.override(properties);
  }

  override(data: any) {
    Object.keys(data).forEach(key => {
      this[key] = data[key];
    });
  }

  get myType(): string {
    const comp: any = this.constructor;
    return comp.name;
  }
  set myType(ignore: string) {}

  asJson(){
    
  }
}
