import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Toast, EmitterService } from "../shared/emitter.service";

import { BehaviorSubject, Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { LaUser, Login } from "../models";
import { iPayloadWrapper } from '../shared';

const CURRENTUSER = "currentUser";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  get API_URL(): string {
    return environment.loginURL;
  }

  private currentUserSubject: BehaviorSubject<LaUser>;


  constructor(private http: HttpClient) {
    const storedUser = JSON.parse(localStorage.getItem(CURRENTUSER));
    const user = storedUser ? new LaUser(storedUser) : null;
    this.currentUserSubject = new BehaviorSubject<LaUser>(user);
  }

  public get currentUserValue(): LaUser {
    return this.currentUserSubject.value;
  }


  public get isCurrentUserAdmin(): boolean {
    return this.currentUserValue ? this.currentUserValue.isAdmin() : false;
  }

  public processUsers(payload:Array<any>):Array<LaUser> {
    const list = new Array<LaUser>();

    payload.forEach( item => {
      const obj = new LaUser(item);
      list.push(obj)
    })

    //presort by leader and then name
    // memberList.sort((a,b) => b.memberCompare(a))
    return list;
  }


  login(login: Login, done:()=>void): Observable<LaUser> {
    const url = `${this.API_URL}/Users/Authenticate`;
    return this.http.post<iPayloadWrapper>(url, login).pipe(
        map(result => {
          done && done();

          if ( result.hasError ) {
            Toast.error(result.message);
            return of<any>();
          } 

          // login successful if there's a jwt token in the response
          const user = this.processUsers(result.payload)[0];
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem(CURRENTUSER, JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
          }
          return of<any>();
        }),
        catchError(error => {
          done && done();
          if ( error && error.hasError ) {
            Toast.error(error.message);
          } else {
            Toast.error(error);
          }
          return of<any>();
        })
      );
  }

  register(user: LaUser, done:()=>void): Observable<LaUser>{
    const url = `${this.API_URL}/Users/Register`;
    return this.http.post<iPayloadWrapper>(url, user).pipe(
        map(result => {
          done && done();

          if ( result.hasError ) {
            Toast.error(result.message);
            return of<any>();
          } 

          //Toast.success("Registration successful");
          const user = this.processUsers(result.payload)[0];
          return user;
        }),
        catchError(error => {
          done && done();
          if ( error && error.hasError ) {
            Toast.error(error.message);
          } else {
            Toast.error(error);
          }
          return of<any>();
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(CURRENTUSER);
    this.currentUserSubject.next(null);
  }

  public getAllUsers$(): Observable<Array<LaUser>> {
    const rest = "/Users/AllUsers";
    const url = `${this.API_URL}${rest}`;

    return this.http.get<iPayloadWrapper>(url).pipe(
      map(res => {
        var memberList = this.processUsers(res.payload)

        //Toast.success(`${res.length} items loaded!`, rest);
        return memberList;
      }),
      catchError(error => {
        const msg = JSON.stringify(error, undefined, 3);
        Toast.error(msg, url);
        return of<any>();
      })
    );
  }

  public getIsUserAdmin$(user:LaUser): Observable<boolean> {
    const rest = "/Users/IsAdmin";
    const url = `${this.API_URL}${rest}`;

    const data = user.asJson();
    return this.http.post<iPayloadWrapper>(url, data).pipe(
      map(res => {
        let answer = res.payload[0];
        if ( answer.status) {
          user.markAsAdmin()
        }
        return answer.status;
      }),
      catchError(error => {
        const msg = JSON.stringify(error, undefined, 3);
        Toast.error(msg, url);
        return of<any>();
      })
    );
  }

  public getDeleteUser$(user:LaUser): Observable<LaUser> {
    const rest = "/Users/Delete/";
    const name = encodeURIComponent(user.email);
    const url = `${this.API_URL}${rest}${name}`;

    return this.http.delete<iPayloadWrapper>(url).pipe(
      map(res => {
        var memberList = this.processUsers(res.payload)

        Toast.success(`${res.length} items deleted!`, rest);
        return memberList;
      }),
      catchError(error => {
        const msg = JSON.stringify(error, undefined, 3);
        Toast.error(msg, url);
        return of<any>();
      })
    );
  }

}
