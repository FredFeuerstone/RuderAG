import { RestProvider, UserGroup, FetchState } from './../../providers/rest/rest';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-user-editor',
  templateUrl: 'user-editor.html',
})

export class UserEditorPage {
  FetchState = FetchState;
  Mode = Mode;

  mode: Mode;
  fetchState: FetchState;

  user_id: number;
  user: any;

  constructor(public navCtrl: NavController, private viewCtrl: ViewController, public navParams: NavParams, private alertCtrl: AlertController, private restProvider: RestProvider) {
    this.user_id = navParams.get('user_id');

    if (this.user_id) {
      // Change any user
      this.mode = Mode.changeAny;
    } else if (!navParams.get('change_profile')) {
      // Create a new user
      this.mode = Mode.create;
    } else if (this.restProvider.group_id == UserGroup.admin) {
      // Change the own profile as an admin (Allows for extra functionality like changing group id)
      this.mode = Mode.changeAny;
      this.user_id = this.restProvider.profile.user_id;
    } else {
      // Change the own profile as a member
      this.mode = Mode.changeProfile;
    }

    if (this.mode === Mode.create) {
      this.fetchState = FetchState.success;
      this.user = {
        group_id: 1,
        first_name: '',
        last_name: '',
        username: '',
        password: ''
      };
    } else if (this.mode === Mode.changeAny) {
      this.fetchState = FetchState.fetching;
      this.fetchUser();
    } else {
      this.fetchState = FetchState.fetching;
      this.fetchProfileUser();
    }
  }

  fetchUser() {
    this.restProvider.getUser(this.user_id)
      .then((user) => {
        this.fetchState = FetchState.success;
        this.user = user;
      })
      .catch((err) => {
        console.error(err)
        this.fetchState = FetchState.error;
        this.restProvider.errorAlert(err);
      });
  }

  fetchProfileUser() {
    this.restProvider.getProfileUser()
      .then((user) => {
        this.fetchState = FetchState.success;
        this.user = user;
      })
      .catch((err) => {
        console.error(err)
        this.fetchState = FetchState.error;
        this.restProvider.errorAlert(err);
      });
  }

  storeUser() {
    // Create a new user
    if (this.mode === Mode.create) {
      this.restProvider.createUser(this.user)
        .then(() => this.dismiss())
        .catch((err) => this.restProvider.errorAlert(err))
      return;
    }

    // Remove the password field if empty. Dismiss if the user is also the default admin,
    // because he cannot change anything else than his password
    if (!this.user.password) {
      if (this.user_id === 1) this.dismiss();
      delete this.user.password;
    }

    // Remove any other field than the password from the default admin
    if (this.user_id === 1) {
      this.user = {
        password: this.user.password
      };
    }

    // Change an existing user
    if (this.mode === Mode.changeAny) {
      this.restProvider.changeUser(this.user_id, this.user)
        .then(() => this.dismiss())
        .catch((err) => this.restProvider.errorAlert(err))
    }

    // Change the current profile user
    if (this.mode === Mode.changeProfile) {
      // Remove the group_id field as it cannot be changed by a member.
      delete this.user.group_id;

      this.restProvider.changeProfileUser(this.user)
        .then(() => this.dismiss())
        .catch((err) => this.restProvider.errorAlert(err))
    }
  }

  removeUser() {
    // Remove an existing user
    if (this.mode !== Mode.create) {
      this.restProvider.removeUser(this.user_id)
        .then(() => this.dismiss())
        .catch((err) => this.restProvider.errorAlert(err))
    }
  }

  confirmRemoveUser() {
    let alert = this.alertCtrl.create({
      title: `"${this.user.first_name} ${this.user.last_name}" löschen`,
      message: 'Soll dieser Benutzeraccount wirklich gelöscht werden?',
      buttons: [
        {
          text: 'Nein'
        }, {
          text: 'Ja',
          handler: () => this.removeUser()
        }
      ],
    });
    alert.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

enum Mode {
  create,
  changeAny,
  changeProfile
}