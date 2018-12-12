import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  username: String;
  password: String;

  constructor(public navCtrl: NavController, public restProvider: RestProvider) {
  }

  login() {
    this.restProvider.getNewsfeed()
      .then(data => {
        this.newsfeed = data;
        console.log(this.newsfeed);
      })
  }
}