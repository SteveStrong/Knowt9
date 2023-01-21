

export interface iPayloadWrapper {
  dateTime: Date;
  length: number;
  payloadType:string;
  payload: Array<any>;
  hasError:boolean;
  message:string;
}
