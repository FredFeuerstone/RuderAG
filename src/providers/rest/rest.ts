import { Config } from '../../app/app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  user = null;
  
  constructor(public http: HttpClient) {
    
  }

  login(loginCredentials) {
    return new Promise((resolve, reject) => {
      this.http.post(Config.apiUrl + '/login', loginCredentials).subscribe(data => {
        // Set the token
        localStorage.setItem('user.token', data['token']);

        // Set the user
        this.user = data;
        resolve();
      }, err => {
        reject(err.error);
      })
    })
  }

  logout() {
    // Clear the token
    localStorage.removeItem('user.token');

    // Forget the current user.
    this.user = null;
  }

  getNewsfeed() {
    return new Promise(resolve => {
      this.http.get(Config.apiUrl + '/newsfeed').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        resolve([]); // We couldn't fetch the array, return an empty one
      })
    });
  }
}
