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

  user = null;
  
  constructor(public http: HttpClient) {
    
  }

  login(loginCredentials) {
    return new Promise(resolve => {
      this.http.post(this.apiUrl + '/login', loginCredentials).subscribe(data => {
        this.user = data;
        resolve(data);
      }, err => {
        console.log(err);
      })
    })
  }

  getNewsfeed() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/newsfeed').subscribe(data => {
        this.user = data;
      }, err => {
        console.log(err);
      });
    });
  }

  getUser() {
    return this.user;
  }
}
