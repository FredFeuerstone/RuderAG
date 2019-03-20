import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { InformationPage } from '../pages/information/information';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { NewsfeedEditorPage } from '../pages/newsfeed-editor/newsfeed-editor';
import { UserEditorPage } from '../pages/user-editor/user-editor';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule, Storage } from '@ionic/storage';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { Config } from './../providers/config/config';
import { RestProvider } from '../providers/rest/rest';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    LoginPage,
    ListPage,
    InformationPage,
    NewsfeedEditorPage,
    UserEditorPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: [ Config.apiDomain ],
        blacklistedRoutes: [
          `${Config.apiBaseUrl}/login`
        ]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    LoginPage,
    ListPage,
    InformationPage,
    NewsfeedEditorPage,
    UserEditorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Config,
    RestProvider
  ]
})
export class AppModule {}
