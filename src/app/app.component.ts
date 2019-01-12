import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';
import { RestProvider } from '../providers/rest/rest';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;

  //pages: Array<{title: string, icon: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage, public restProvider: RestProvider) {
    this.initializeApp();

    // Set the pages
    /*this.pages = [
      { title: 'Startseite', icon: 'home', component: HomePage },
      { title: 'Informationen', icon: 'information', component: InformationPage },
      { title: 'Liste', icon: 'list', component: ListPage },
      { title: 'Login', icon: 'key', component: LoginPage }
    ];*/
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // If we have stored credentials, try to log in. If the login fails, just ignore it.
      this.storage.get('loginCredentials').then(loginCredentials => {
        if (loginCredentials) {
          this.restProvider.login(loginCredentials);
        }
      })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
