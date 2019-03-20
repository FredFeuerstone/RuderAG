import { Component, ViewChild } from '@angular/core';
import { Tabs, NavController, ModalController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { InformationPage } from '../information/information';
import { ListPage } from '../list/list';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('myTabs') tabs: Tabs;

  pages: Array<{tabTitle: string, tabIcon: string, component: any}>;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    // Set all pages, that will be present in the tab bar
    this.pages = [
      { tabTitle: 'Anmeldung', tabIcon: 'clipboard', component: ListPage },
      { tabTitle: 'Start', tabIcon: 'home', component: HomePage },
      { tabTitle: 'Information', tabIcon: 'information-circle', component: InformationPage }
    ];
  }

  ionViewDidEnter() {
    // Select the home page (id 1)
    this.tabs.select(1);
  }

  openLoginPage() {
    let loginModal = this.modalCtrl.create(LoginPage);
    loginModal.present();
  }
}