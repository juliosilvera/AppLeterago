import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatosWebProvider } from "../../providers/datos-web/datos-web";
import { TabsPage } from "../tabs/tabs";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user:string = '';
  password:string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _dw: DatosWebProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  Entrar()
  {
      this._dw.login(this.user, this.password).then(resp => {
        if(resp)
        {
          this.navCtrl.setRoot(TabsPage);
        }
      });
  }

}
