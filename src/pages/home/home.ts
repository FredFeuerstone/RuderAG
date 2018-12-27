import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  newsfeed: any;

  constructor(public navCtrl: NavController, public restProvider: RestProvider) {
    this.getNewsfeed();
  }

  getNewsfeed() {
    this.restProvider.getNewsfeed()
      .then(data => {
        this.newsfeed = data;
      })
  }
}
