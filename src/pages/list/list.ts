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
    this.attendant = false;
    this.attendances = null;
    this.fetchState === FetchState.fetching;
  }

  ionViewWillEnter() {
    this.fetchAttendances();
  }

  doRefresh(event) {
    // Don't refresh if we are already fetching
    if (this.fetchState === FetchState.fetching) {
      event.complete();
      return;
    }

    // Fetch the attendances and pass the event
    this.fetchAttendances(event);
  }

  fetchAttendances(event?) {
    if (!this.attendances) this.fetchState = FetchState.fetching;

    // Return if we are no member
    if (this.restProvider.group_id < UserGroup.member) {
      this.fetchState = FetchState.error;
      this.attendant = false;
      this.attendances = null;
      if (event) event.complete();
      return;
    }

    // Get the current user's attendance
    this.restProvider.getProfileAttendance()
      .then((attendance: any) => {
        // Update the current attendance and set the fetch state
        this.attendant = attendance.attendant;
        this.fetchState = FetchState.success;
        if (event) event.complete();
      })
      .catch((err) => {
        // Something went wrong. Set the fetch state to error
        console.error(err)
        this.fetchState = FetchState.error;
        if (event) event.complete();
      });

    // Return if we are no admin
    if (this.restProvider.group_id < UserGroup.admin) {
      this.attendances = null;
      return;
    }

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
        this.restProvider.errorAlert('Die Anwesenheit konnte nicht aktualisiert werden. Stelle sicher, dass du mit dem Internet verbunden bist.');
      });
  }
}
