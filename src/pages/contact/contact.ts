import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { DatosWebProvider } from "../../providers/datos-web/datos-web";
import { StorageProvider } from "../../providers/storage/storage";
import { ImageProvider } from "../../providers/image/image";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  locales: any[] = [];
  user:any = {};
  datos:any[] = [0,0];
  encuestas:any[] = [];
  loading: Loading;

  constructor(
    public navCtrl: NavController,
    private _dw: DatosWebProvider,
    private store: StorageProvider,
    private loadingCtrl: LoadingController,
    private _ip: ImageProvider
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
    this.user = this.store.user;

    this.store.cargar_encuestas().then(()=>{
      this.encuestas = this.store.encuestas;
    });

  }

  enviar(sc)
  {

    let count = this.encuestas.length - 1;
    let startCount = sc;
    this.showLoading(startCount, count);
    this._dw.postData(JSON.stringify(this.encuestas[startCount].local), 'local', this.encuestas[startCount].local.id).then(()=>{
      this._dw.postData(JSON.stringify(this.encuestas[startCount].datosAsesor), 'datosAsesor', this.encuestas[startCount].local.id).then(()=>{
        this._dw.postData(JSON.stringify(this.encuestas[startCount].datosFarmacias), 'datosFarmacias', this.encuestas[startCount].local.id).then(()=>{
          this._dw.postData(JSON.stringify(this.encuestas[startCount].datosZonaDescuento), 'datosZonaDescuento', this.encuestas[startCount].local.id).then(()=>{
            startCount++;
            if(startCount <= count)
            {
              this.enviar(startCount);
            }else{
              this.showLoading(startCount, count);
              this.enviarFotos();
            }
          });
        });
      });
    });
  }

  enviarFotos()
  {
    this._ip.encuestas = this.encuestas;
    this._ip.startSendingImages('zona', 0, 0);
  }

  showLoading(a, b)
  {
    if(a == 0)
    {
      this.loading = this.loadingCtrl.create({
        content: 'Enviando datos...'
      });
      this.loading.present();
    }
    if(a >= b)
    {
      this.loading.dismiss();
    }
  }

}
