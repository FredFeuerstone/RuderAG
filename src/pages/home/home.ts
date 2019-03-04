import { RestProvider, FetchState } from './../../providers/rest/rest';
import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  FetchState = FetchState;
  fetchState: FetchState;

  newsfeed: Array<any>;

  constructor(private restProvider: RestProvider, public navCtrl: NavController, private alertCtrl: AlertController, private modalCtrl: ModalController) {}

  ionViewWillEnter() {
    this.fetchState = FetchState.fetching;
    this.newsfeed = [];
    this.fetchNewsfeed();
  }

  fetchNewsfeed() {
    this.restProvider.listNewsfeed()
      .then(newsfeed => {
        this.newsfeed = newsfeed as Array<any>;
        this.fetchState = FetchState.success;
      })
      .catch((err) => {
        console.error(err)
        this.fetchState = FetchState.error;
      });
  }

  deleteNewsfeed(index) {
    /* let alert = this.alertCtrl.create({
      title: 'Newsfeed Eintrag Löschen',
      subTitle: 'Möchtest du diesen Eintrag löschen?',
      buttons: [
        {
          text: 'Abbrechen'
        },
        {
          text: 'Löschen',
          handler: () => {
          }
        }
      ]
    });
    alert.present(); */
  }
}