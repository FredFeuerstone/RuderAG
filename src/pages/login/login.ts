import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  username: string;
  password: string;

  constructor(public navCtrl: NavController, public restProvider: RestProvider, public alertCtrl: AlertController) {
    // FOR DEBUGGING ONLY
    this.username = "admin";
    this.password = "p455w0rd";
  }

  login() {
    this.restProvider.login({
      username: this.username,
      password: this.password
    }).then(() => {
      // Store the login credentials. This way we will be logged in automatically the next time
      // the app ist opened (see app/app.component.ts constructor)
      localStorage.setItem('loginCredentials.username', this.username);
      localStorage.setItem('loginCredentials.password', this.password);

      // Switch back to the home page
      this.navCtrl.setRoot(HomePage);
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
    this.restProvider.logout();
  }
}