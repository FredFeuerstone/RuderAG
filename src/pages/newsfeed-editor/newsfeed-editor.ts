import { RestProvider, FetchState } from './../../providers/rest/rest';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-newsfeed-editor',
  templateUrl: 'newsfeed-editor.html',
})

export class NewsfeedEditorPage {
  FetchState = FetchState;
  Mode = Mode;

  mode: Mode;
  fetchState: FetchState;

  newsfeed_id: number;
  newsfeed: any;
  event_at_enabled: boolean

  constructor(public navCtrl: NavController, private viewCtrl: ViewController, public navParams: NavParams, private alertCtrl: AlertController, private restProvider: RestProvider) {
    this.newsfeed_id = navParams.get('newsfeed_id');

    if (this.newsfeed_id) {
      this.mode = Mode.change;
      this.fetchState = FetchState.fetching;
      this.fetchNewsfeed();
    }
    else {
      this.mode = Mode.create;
      this.fetchState = FetchState.success;
      this.event_at_enabled = false,
      this.newsfeed = {
        title: '',
        content: '',
        event_at_date: null,
        event_at_time: null
      };
    }
  }

  fetchNewsfeed() {
    this.restProvider.getNewsfeed(this.newsfeed_id)
      .then(nf => {
        let event_at = (nf as any).event_at;
        let event_at_date, event_at_time;
        if (event_at) {
          event_at_date = event_at.substr(0, 10);
          event_at_time = event_at.substr(11, 5);
          this.event_at_enabled = true;
        } else {
          event_at_date = '';
          event_at_time = '';
          this.event_at_enabled = false;
        }

        this.newsfeed = {
          title: (nf as any).title,
          content: (nf as any).content,
          event_at_date: event_at_date,
          event_at_time: event_at_time
        };
        this.fetchState = FetchState.success;
      })
      .catch((err) => {
        console.error(err)
        this.fetchState = FetchState.error;
        this.restProvider.errorAlert(err);
      });
  }

  storeNewsfeed() {
    let event_at = null;
    if (this.event_at_enabled && Date.parse(this.newsfeed.event_at_date)) {
      event_at = `${this.newsfeed.event_at_date} ${this.newsfeed.event_at_time}`;
    }
    
    let nf = {
      title: this.newsfeed.title,
      content: this.newsfeed.content,
      event_at: event_at
    };

    // Create a new newsfeed item
    if (this.mode === Mode.create) {
      this.restProvider.createNewsfeed(nf)
        .then(() => this.dismiss())
        .catch((err) => this.restProvider.errorAlert(err))
    }

    // Change an existing newsfeed item
    if (this.mode === Mode.change) {
      this.restProvider.changeNewsfeed(this.newsfeed_id, nf)
        .then(() => this.dismiss())
        .catch((err) => this.restProvider.errorAlert(err))
    }
  }

  removeNewsfeed() {
    // Remove an existing newsfeed item
    if (this.mode === Mode.change) {
      this.restProvider.removeNewsfeed(this.newsfeed_id)
        .then(() => this.dismiss())
        .catch((err) => this.restProvider.errorAlert(err))
    }
  }

  confirmRemoveNewsfeed() {
    let alert = this.alertCtrl.create({
      title: `"${this.newsfeed.title}" löschen`,
      message: 'Soll dieses Event wirklich gelöscht werden?',
      buttons: [
        {
          text: 'Nein'
        }, {
          text: 'Ja',
          handler: () => this.removeNewsfeed()
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
  change
}