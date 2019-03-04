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
    // Try to login using the stored token
    if (localStorage.getItem('token'))
      this.fetchProfile()
        .then(() => console.log(`Autologin as ${this.profile.username}.`))
        .catch((err) => {
          // Print the error and make sure we are logged out
          console.error('Autologin failed.');
          this.logout();
        });
  }

  errorAlert(err) {
    let alert = this.alertCtrl.create({
      title: 'Fehler',
      subTitle: err,
      buttons: ['Ok']
    });
    alert.present();
  }

  login(userCredentials: { username: string, password: string }) {
    return new Promise((resolve, reject) => {
      // Send a login request
      this.http.post(`${Config.apiBaseUrl}/login`, {
        username: userCredentials.username,
        password: userCredentials.password
      })
        .subscribe(
          (json: any) => {
            // For some reason the server didn't sent a user token
            let token = json.token;
            if (!token) reject('Es wurde kein Benutzertoken übermittelt');

            // Store the token
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
      // Send a request to get the current profile
      this.http.get(`${Config.apiBaseUrl}/users/me`)
        .subscribe(
          (json: any) => {
            // Set the profile and resolve
            this.group_id = json.group_id;
            this.profile = json;
            resolve();
          },
          (err: any) => reject(this.getErrorMessage(err))
        );
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