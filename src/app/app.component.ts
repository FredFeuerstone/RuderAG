import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';
import { RestProvider } from '../providers/rest/rest';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ListPage } from '../pages/list/list';
import { InformationPage } from '../pages/information/information';

export const API_URL = 'http://ruderagapi.goethe-oberschule-berlin.de/api';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage, public restProvider: RestProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Startseite', component: HomePage },
      { title: 'Informationen', component: InformationPage },
      { title: 'Liste', component: ListPage },
      { title: 'Login', component: LoginPage }
    ];

    // If we have stored credentials, try to log in. If the login fails, just ignore it.
    storage.get('loginCredentials').then(loginCredentials => {
      restProvider.login(loginCredentials);
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
