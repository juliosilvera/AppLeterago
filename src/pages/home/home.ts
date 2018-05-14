import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DatosWebProvider } from "../../providers/datos-web/datos-web";
import { StorageProvider } from "../../providers/storage/storage";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  locales: any[] = [];
  user:any = {};
  datos:any[] = [0,0];

  constructor(
    public navCtrl: NavController,
    private _dw: DatosWebProvider,
    private store: StorageProvider
  ) {

  }

  ionViewWillEnter()
  {
    this.store.cargar_locales().then(()=>{
      this.locales = this.store.locales;
      this.datos = [0,0];
      for(let i = 0; i < this.locales.length; i++)
      {
        if(this.locales[i].estado == 1)
        {
          this.datos[0] += 1;
        }else{
          this.datos[1] += 1;
        }
      }
    });
    this.store.cargar_usuario().then(() => {
      this.user = this.store.user;
    });


  }

  descargarLocales()
  {
    this._dw.getLocales().then(()=>{
      this.locales = this.store.locales;
      this.datos = [0,0];
      for(let i = 0; i < this.locales.length; i++)
      {
        if(this.locales[i].estado == 1)
        {
          this.datos[0] += 1;
        }else{
          this.datos[1] += 1;
        }
      }
    });
  }



}
