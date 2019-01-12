import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  ownAttendance: Boolean;
  users: any;

  constructor(public navCtrl: NavController, public restProvider: RestProvider) {
    this.loadAttendances();
  }

  loadAttendances() {
    // Read the attendances of all users, if we are admin
    if (this.restProvider.groupId >= 2) {
      this.restProvider.indexUsers().then((data) => {
        this.users = data;

        this.users.forEach((user) => {
          if (user.username == this.restProvider.user.username) {
            this.ownAttendance = user.attendant == '1';
          }
        })
      }).catch((reason) => {
        // Oh no, something failed. Just set the users to null.
        this.users = null;
        console.log(reason.error);
      });
    } else {
      // We don't have admin permissions, set the users to null, so they won't be displayed.
      this.users = null;
    }
  }

  updateOwnAttendant() {
    this.restProvider.putAttendance(this.restProvider.user.username, this.ownAttendance)
      .then(() => {
        this.loadAttendances();
      });
  }
}
