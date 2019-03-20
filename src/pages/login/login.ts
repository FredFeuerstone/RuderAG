import { UserEditorPage } from '../user-editor/user-editor';
import { RestProvider, UserGroup } from './../../providers/rest/rest';
import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, ModalController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private modalCtrl: ModalController, private restProvider: RestProvider, public alertCtrl: AlertController) {
    this.credentials = {
      username: '',
      password: ''
    };
  }

  ionViewWillEnter() {
    // Fetch all users (will only work for admins)
    this.fetchUsers();
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
    // Return if we are no admin
    if (this.restProvider.group_id != UserGroup.admin) return;

    // Store all users into the users array
    this.restProvider.listUsers()
      .then((users) => {
        this.users = users as Array<any>;
      })
      .catch((err) => {
        console.error(err);
      })
  }

  createUser() {
    this.openUserEditorPage(null, false);
  }

  changeUser(user_id: number) {
    this.openUserEditorPage(user_id, false);
  }

  changeProfile() {
    this.openUserEditorPage(null, true);
  }

  openUserEditorPage(user_id: number, change_profile: boolean) {
    let userModal = this.modalCtrl.create(UserEditorPage, {
      user_id: user_id,
      change_profile: change_profile
    });
    userModal.onDidDismiss(() => {
      this.restProvider.fetchProfile()
        .catch((err) => {
          // This failes most likely, if the user deleted himselft, so the api does not find the user id
          // anymore. We just logout this user to prevent any further errors
          console.error(err);
          this.logout();
        })
      this.fetchUsers()
    })
    userModal.present();
  }
}