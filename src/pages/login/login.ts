import { Component } from '@angular/core';
import { NavController, ViewController, AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  username: string;
  password: string;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public restProvider: RestProvider, public storage: Storage, public alertCtrl: AlertController) {
    // FOR DEBUGGING ONLY
    this.username = "admin";
    this.password = "p455w0rd";
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  login() {
    this.restProvider.login({
      username: this.username,
      password: this.password
    }).then(() => {
      // Store the login credentials. This way we will be logged in automatically the next time
      // the app ist opened (see app/app.component.ts constructor)
      this.storage.set('loginCredentials', {
        username: this.username,
        password: this.password
      });

      // Switch back to the previous page
      this.navCtrl.pop();
    }).catch(reason => {
      // Something didn't work. Show an error alert
      let alert = this.alertCtrl.create({
        title: 'Fehler',
        subTitle: reason.error,
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  logout() {
    // Logout and switch to the previous
    this.restProvider.logout();
    this.navCtrl.pop();
  }
}