import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  users: Array<Object>;

  constructor(public navCtrl: NavController, public restProvider: RestProvider) {
    // Read the attendances of all users, if we are admin
    if (restProvider.groupId >= 2) {
      restProvider.indexUsers().then((data) => {
        console.log(data);
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
  

  updateCheckbox() {

  }
}
