import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { InformationPage } from '../information/information';
import { ListPage } from '../list/list';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabs: Array<{tabTitle: string, tabIcon: string, component: any}>;

  constructor() {
    this.tabs = [
      { tabTitle: 'Startseite', tabIcon: 'home', component: HomePage },
      { tabTitle: 'Information', tabIcon: 'information-circle', component: InformationPage },
      { tabTitle: 'Liste', tabIcon: 'list', component: ListPage },
      { tabTitle: 'Login', tabIcon: 'key', component: LoginPage }
    ];
  }
}