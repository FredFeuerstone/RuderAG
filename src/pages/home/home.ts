import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';

import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  newsfeed: any;

  constructor(public navCtrl: NavController, public restProvider: RestProvider, private alertCtrl: AlertController, private modalCtrl: ModalController) {
    this.loadNewsfeed();
  }

  loadNewsfeed() {
    this.restProvider.getNewsfeed()
      .then(data => {
        this.newsfeed = data;
      })
  }

  addNewsfeed() {
    
  }

  deleteNewsfeed(index) {
    let alert = this.alertCtrl.create({
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
    alert.present();
  }
}