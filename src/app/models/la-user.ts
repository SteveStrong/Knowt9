import { LaAtom } from "./la-atom";

export class Login extends LaAtom {
    username: string;
    password: string;

    constructor(properties?: any) {
        super(properties);
    }
}

export class LaUser extends LaAtom {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email:string;
    token: string;
    
    constructor(properties?: any) {
        super(properties);
    }

    asJson(){
        const result =  {
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            email: this.email
        }
        return result;
    }
    
    fullName(){
        return `${this.firstName} ${this.lastName}`;
    }

    displayName(){
        const extra = this._admin ? '*': ''
        return `${extra}${this.username}`;
    }
    
    private _admin:boolean = false;
    markAsAdmin() {
        this._admin = true;
    }

    isAdmin() {
        return this._admin;
    }
}

