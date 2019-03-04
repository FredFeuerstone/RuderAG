import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestProvider, UserGroup, FetchState } from '../../providers/rest/rest';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  UserGroup = UserGroup;
  FetchState = FetchState;

  attendant: boolean;
  attendances: Array<any>;

  fetchState: FetchState;

  constructor(private restProvider: RestProvider, public navCtrl: NavController) {
    this.attendant = null;
    this.attendances = null;

    this.fetchState = FetchState.fetching;
  }

  ionViewWillEnter() {
    this.fetchState = FetchState.fetching;
    this.fetchAttendances();
  }

  fetchAttendances() {
    // Return if we are no member
    if (this.restProvider.group_id < UserGroup.member) {
      this.fetchState = FetchState.error;
      return;
    }

    // Get the current user's attendance
    this.restProvider.getProfileAttendance()
      .then((attendance: any) => {
        // Update the current attendance and set the fetch state
        this.attendant = attendance.attendant;
        this.fetchState = FetchState.success;
      })
      .catch((err) => {
        // Something went wrong. Set the fetch state to error
        console.error(err)
        this.fetchState = FetchState.error;
      });

    // Return if we are no admin
    if (this.restProvider.group_id < UserGroup.admin) return;

    // Get the attendances of all (other) users
    this.restProvider.listAttendances()
      .then((attendances) => {
        this.attendances = (attendances as Array<any>)
          .filter((att) => att.user_id != this.restProvider.profile.user_id);
      })
      .catch((err) => console.error(err));
  }

  attendantStateChanged() {
    // Return if we are no member
    if (this.restProvider.group_id < UserGroup.member) return;

    // Change the current user's attendance
    this.restProvider.changeProfileAttendance(this.attendant)
      .then(() => {
        // Success -> refetch all attendances
        this.fetchAttendances();
      })
      .catch((err) => {
        console.error(`Couldn't load attendances: ${err}`);
      });
  }
}
