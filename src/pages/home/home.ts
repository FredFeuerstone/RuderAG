import { NewsfeedEditorPage } from '../newsfeed-editor/newsfeed-editor';
import { RestProvider, FetchState } from './../../providers/rest/rest';
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  FetchState = FetchState;
  fetchState: FetchState;

  newsfeed: Array<any>;

  constructor(private restProvider: RestProvider, public navCtrl: NavController, private modalCtrl: ModalController) {
    this.newsfeed = null;
    this.fetchState === FetchState.fetching;
  }

  ionViewWillEnter() {
    this.fetchNewsfeed();
  }

  doRefresh(event) {
    // Don't refresh if we are already fetching
    if (this.fetchState === FetchState.fetching) {
      event.complete();
      return;
    }

    // Fetch the newsfeed and pass the event
    this.fetchNewsfeed(event);
  }

  fetchNewsfeed(event?) {
    if (!this.newsfeed) this.fetchState = FetchState.fetching;

    this.restProvider.listNewsfeed()
      .then(newsfeed => {
        this.newsfeed = newsfeed as Array<any>;
        this.fetchState = FetchState.success;
        if (event) event.complete();
      })
      .catch((err) => {
        console.error(err)
        this.fetchState = FetchState.error;
        if (event) event.complete();
      });
  }

  createNewsfeed() {
    this.openNewsfeedEditorPage(null);
  }

  changeNewsfeed(newsfeed_id: number) {
    this.openNewsfeedEditorPage(newsfeed_id);
  }

  openNewsfeedEditorPage(newsfeed_id: number) {
    let newsfeedModal = this.modalCtrl.create(NewsfeedEditorPage, {
      newsfeed_id: newsfeed_id
    });
    newsfeedModal.onDidDismiss(() => this.fetchNewsfeed())
    newsfeedModal.present();
  }
}