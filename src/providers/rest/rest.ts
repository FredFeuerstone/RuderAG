import { Storage } from '@ionic/storage';
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
  groupId = 0;
  
  constructor(public http: HttpClient, public storage: Storage) {
    
  }

  login(loginCredentials) {
    return new Promise((resolve, reject) => {
      this.http.post(Config.apiUrl + '/login', loginCredentials).subscribe(data => {
        // Set the token
        localStorage.setItem('access_token', data['token']);

        // Set the user
        this.user = data;

        // Set the group id
        this.groupId = data['groupId'];
        resolve();
      }, err => {
        console.log(err);
        reject(err.error);
      });
    });
  }

  logout() {
    // Clear the token
    localStorage.removeItem('access_token');

    // Forget the current user.
    this.user = null;

    // Set the group id to guest
    this.groupId = 0;
  }

  indexUsers() {
    return new Promise((resolve, reject) => {
      this.http.get(Config.apiUrl + '/users').subscribe(data => {
        resolve(data);
      }, err => {
        reject(err.error);
      });
    });
  }

  getNewsfeed() {
    return new Promise(resolve => {
      this.http.get(Config.apiUrl + '/newsfeed').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        resolve([]); // We couldn't fetch the array, return an empty one
      });
    });
  }
}
