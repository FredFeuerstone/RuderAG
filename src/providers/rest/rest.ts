import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  apiUrl = 'http://amonnenpc:80/ruderag/api';

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  getNewsfeed() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/newsfeed').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
