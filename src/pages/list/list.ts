import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  constructor(public navCtrl: NavController, private storage: Storage) {
    //hier muss noch irgendwas mit dem Storage gemacht werden
  }
  // bis jetzt nur unnötiger code um status der Checkbox auszugeben
  Checkbox: boolean;
  

  updateCheckbox() {
    console.log ('Checkbox status:' + this.Checkbox);
    this.storage.set('Checkbox status', this.Checkbox )   
  }

  getData() {
    this.storage.get('Checkbox status').then((data) => {
    console.log(data);
    });
  }
}
