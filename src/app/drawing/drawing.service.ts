import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { String, StringBuilder } from 'typescript-string-operations';
import { Toast } from '../shared/emitter.service';

import { Observable, of } from 'rxjs';
import {
  map,
  catchError,
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap
} from 'rxjs/operators';

import {
  foCollection,
  foNode,
  foModel
} from '../foundry/public_api';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {

  constructor(private http: HttpClient) {}


  public getElasticGraphData(): Observable<any> {
   // const url = '../../assets/data/graph.json';
    //const url = '../../assets/data/elastic_graph.json';
    //const url = '../../assets/data/phrase_response.json';
    const url = '../../assets/data/foreign_disaster_resp_2v2.json';
    return this.http.get(url).pipe(
      map(res => {
        return res;
      }),
      catchError(error => {
        const msg = JSON.stringify(error, undefined, 3);
        Toast.error(error.message, url);
        return of<any>();
      })
    );
  }

  public getElasticFilterData(): Observable<any> {
     const url = '../../assets/data/foreign_disaster_resp_1v2.json';
     return this.http.get(url).pipe(
       map(res => {
         return res;
       }),
      catchError(error => {
        const msg = JSON.stringify(error, undefined, 3);
        Toast.error(error.message, url);
        return of<any>();
      })
     );
   }

  public getSampleGraphData(): Observable<any> {
     const url = '../../assets/data/miserables.json';
     return this.http.get(url).pipe(
       map(res => {
         return res;
        }),
        catchError(error => {
          const msg = JSON.stringify(error, undefined, 3);
          Toast.error(error.message, url);
          return of<any>();
        })
     );
   }

   //  https://39d398514eb541c7814bf2fd3f3ed673.us-east-1.aws.found.io:9243/demo_april_1.1/_search
     public getApril(): Observable<any> {
      const sourceURL = 'https://elastic:l0txCHcwzlmbL5tosJ6uDN1z@39d398514eb541c7814bf2fd3f3ed673.us-east-1.aws.found.io:9243';

      const index = 'demo_april_1.1';

     const url = `${sourceURL}/${index}/_search`;
     return this.http.get(url).pipe(
       map(res => {
         return res;
        }),
        catchError(error => {
          const msg = JSON.stringify(error, undefined, 3);
          Toast.error(error.message, url);
          return of<any>();
        })
     );
   }
}
