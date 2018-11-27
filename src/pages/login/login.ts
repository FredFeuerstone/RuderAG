import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder,FormGroup } from '@angular/forms';

import { ListPage } from '../list/list';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  storedPassword: String;
  credentialsForm: FormGroup;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder) {
    this.storedPassword = "test";

    this.credentialsForm = this.formBuilder.group({
      name: [''],
      password: ['']
    });
  }

  onValidatePassword() {
    
    if(this.credentialsForm.controls.name.value == '') {
      alert ("Gib bitte deinen Namen als Benutzernamen ein!")
    }
    else {
      console.log(this.credentialsForm.controls.name.value);
      if(this.storedPassword == this.credentialsForm.controls.password.value) {
        this.navCtrl.push(ListPage);
      } else {
        alert ("Du hast ein falsches Passwort eingegeben!");
      }
    }
      
  }

} 
