import { AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Config } from './../config/config';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

  group_id = 0;
  profile = null;

  constructor(private http: HttpClient, private storage: Storage, private jwtHelper: JwtHelperService, private alertCtrl: AlertController) {
    // Try to login using the stored user credentials
    if (localStorage.getItem('username') && localStorage.getItem('password')) {
      let userCredentials = {
        username: localStorage.getItem('username'),
        password: localStorage.getItem('password')
      };

      this.login(userCredentials)
        .then(() => console.log(`Autologin as ${this.profile.username}.`))
        .catch((err) => {
          // Print the error and make sure we are logged out
          console.error('Autologin failed.');
          this.logout();
        });
    }
  }

  errorAlert(err) {
    let alert = this.alertCtrl.create({
      title: 'Fehler',
      message: err,
      buttons: ['Ok']
    });
    alert.present();
  }

  login(userCredentials: { username: string, password: string }) {
    return new Promise((resolve, reject) => {
      // Send a login request
      this.http.post(`${Config.apiBaseUrl}/login`, userCredentials)
        .subscribe(
          (json: any) => {
            // For some reason the server didn't sent a user token
            let token = json.token;
            if (!token) reject('Es wurde kein Benutzertoken übermittelt');

            // Store the user credentials and token
            localStorage.setItem('username', userCredentials.username);
            localStorage.setItem('password', userCredentials.password);
            localStorage.setItem('token', token);

            // Fetch the user profile. Resolve on success, otherwise reject
            this.fetchProfile()
              .then(() => resolve())
              .catch((err) => reject(err));
          },
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      // Remove token from local storage
      localStorage.removeItem('token');
      this.group_id = 0;
      this.profile = null;
      resolve();
    });
  }

  fetchProfile() {
    return new Promise((resolve, reject) => {
      this.getProfileUser()
        .then((user: any) => {
          // Set the profile and resolve
          this.group_id = user.group_id;
          this.profile = user;
          resolve();
        })
        .catch((err) => reject(err));
    });
  }

  listUsers() {
    return new Promise((resolve, reject) => {
      // Send a request to get all users
      this.http.get(`${Config.apiBaseUrl}/users`)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  getUser(user_id: number) {
    return new Promise((resolve, reject) => {
      // Send a request to get a single user
      this.http.get(`${Config.apiBaseUrl}/users/${user_id}`)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        )
    })
  }

  getProfileUser() {
    return new Promise((resolve, reject) => {
      // Send a request to get the current profile
      this.http.get(`${Config.apiBaseUrl}/users/me`)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  createUser(user: any) {
    return new Promise((resolve, reject) => {
      // Send a request to get a single user
      this.http.post(`${Config.apiBaseUrl}/users`, user)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        )
    })
  }

  changeUser(user_id: number, user: any) {
    return new Promise((resolve, reject) => {
      // Send a request to change a user
      this.http.put(`${Config.apiBaseUrl}/users/${user_id}`, user)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        )
    })
  }

  changeProfileUser(user: any) {
    return new Promise((resolve, reject) => {
      // Send a request to change the current profile user
      this.http.put(`${Config.apiBaseUrl}/users/me`, user)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        )
    })
  }

  removeUser(user_id: number) {
    return new Promise((resolve, reject) => {
      // Send a request to remove a single user
      this.http.delete(`${Config.apiBaseUrl}/users/${user_id}`)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        )
    })
  }

  listAttendances() {
    return new Promise((resolve, reject) => {
      // Send a request to get all attendances
      this.http.get(`${Config.apiBaseUrl}/attendances`)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  getAttendance(user_id: number) {
    return new Promise((resolve, reject) => {
      // Send a request to get a single attendance
      this.http.get(`${Config.apiBaseUrl}/attendances/${user_id}`)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  getProfileAttendance() {
    return new Promise((resolve, reject) => {
      // Send a request to get the own profile's attendance
      this.http.get(`${Config.apiBaseUrl}/attendances/me`)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  changeAttendance(user_id: number, attendant: boolean) {
    return new Promise((resolve, reject) => {
      // Send a request to change a single attendance
      this.http.put(`${Config.apiBaseUrl}/attendances/${user_id}`, {
        attendant: attendant
      })
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  changeProfileAttendance(attendant: boolean) {
    return new Promise((resolve, reject) => {
      // Send a request to change the own profile's attendance
      this.http.put(`${Config.apiBaseUrl}/attendances/me`, {
        attendant: attendant
      })
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  listNewsfeed() {
    return new Promise((resolve, reject) => {
      // Send a request to get all newsfeed items
      this.http.get(`${Config.apiBaseUrl}/newsfeed`)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  getNewsfeed(newsfeed_id) {
    return new Promise((resolve, reject) => {
      // Send a request to get all newsfeed items
      this.http.get(`${Config.apiBaseUrl}/newsfeed/${newsfeed_id}`)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  createNewsfeed(newsfeed) {
    return new Promise((resolve, reject) => {
      // Send a request to create a new newsfeed items
      this.http.post(`${Config.apiBaseUrl}/newsfeed`, newsfeed)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  changeNewsfeed(newsfeed_id, newsfeed) {
    return new Promise((resolve, reject) => {
      // Send a request to change an existing newsfeed item
      this.http.put(`${Config.apiBaseUrl}/newsfeed/${newsfeed_id}`, newsfeed)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  removeNewsfeed(newsfeed_id) {
    return new Promise((resolve, reject) => {
      // Send a request to remove an existing newsfeed item
      this.http.delete(`${Config.apiBaseUrl}/newsfeed/${newsfeed_id}`)
        .subscribe(
          (json: any) => resolve(json),
          (err: any) => reject(this.getErrorMessage(err))
        );
    });
  }

  private getErrorMessage(err) {
    // Print an error message to the console
    console.error(err);

    // Return the error message (use the server's custom message if available)
    if (err.error.error) return err.error.error;
    return err.message;
  }
}

export enum FetchState {
  fetching,
  success,
  error
}

export enum UserGroup {
  guest = 0,
  member = 1,
  admin = 2
}