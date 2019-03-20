import { SlideshowPage } from './../slideshow/slideshow';
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

@Component({
  selector: 'information-home',
  templateUrl: 'information.html'
})

export class InformationPage {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
  }

  openSlideshowPage() {
    let slideshowModal = this.modalCtrl.create(SlideshowPage);
    slideshowModal.present();
  }
}
