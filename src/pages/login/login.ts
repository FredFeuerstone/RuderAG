import { RestProvider, UserGroup } from './../../providers/rest/rest';
import { Component } from '@angular/core';
import { NavController, ViewController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  UserGroup = UserGroup;

  credentials: {
    username: string,
    password: string
  };

  users: Array<any>;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private restProvider: RestProvider, public alertCtrl: AlertController) {
    // FOR DEBUGGING ONLY
    this.credentials = {
      username: 'admin',
      password: 'p455w0rd'
    };
  }

  ionViewWillEnter() {
    // Fetch all users if we are an admin
    if (this.restProvider.group_id === UserGroup.admin) this.fetchUsers();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  login() {
    this.restProvider.login(this.credentials)
      .then(() => {
        // Set the current profile and copy to the profile to be edited
        console.log(`Logged in as ${this.restProvider.profile.username}.`);

        // Switch back to the previous page
        this.viewCtrl.dismiss();
      }).catch(err => this.restProvider.errorAlert(err));
  }

  logout() {
    // Logout and switch to the previous
    this.restProvider.logout()
      .then(() => {
        this.viewCtrl.dismiss();
      })
      .catch((err) => this.restProvider.errorAlert(err));
  }

  fetchUsers() {
    // Store all users into the users array
    this.restProvider.listUsers()
      .then((users) => {
        this.users = users as Array<any>;
      })
      .catch((err) => {
        console.error(err);
      })
  }
}