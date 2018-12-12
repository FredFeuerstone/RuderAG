import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CodegenComponentFactoryResolver } from '@angular/core/src/linker/component_factory_resolver';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  username: String;
  password: String;

  constructor(public navCtrl: NavController, public restProvider: RestProvider) {

  }

  login() {
    this.restProvider.login({
      username: this.username,
      password: this.password
    }).then(data => {
      console.log(data);
    }).catch(reason => {
      console.log(reason);
    });
  }
} 
