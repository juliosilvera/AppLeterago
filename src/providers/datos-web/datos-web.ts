import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { URL } from "../../data/datos";
import { LoadingController, ToastController } from "ionic-angular";
import { StorageProvider } from "../storage/storage";
import { TabsPage } from "../../pages/tabs/tabs";


@Injectable()
export class DatosWebProvider {

  url: string = URL;

  constructor(
    public http: Http,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private store: StorageProvider,
  ) {

  }

  login(user, password)
  {
    let loading = this.loadingCtrl.create({
      content: 'Verificando usuario...'
    });
    loading.present();
    let promesa = new Promise((resolve, reject) => {
      let url = this.url + "login";
        let data = new URLSearchParams();
        data.append('user', user);
        data.append('password', password);
        this.http.post(url, data).map(res => res.json()).subscribe( (data:any) => {
          if(data.status)
          {
            this.store.guarda_usuario(data.datos).then(()=>{
              loading.dismiss();
              resolve(true);
            });
          }else{
            loading.dismiss();
            this.mensaje(data.datos);
            resolve(false);
          }
        });
    });

    return promesa;
  }

  getLocales()
  {
    let user = this.store.user;

    let loading = this.loadingCtrl.create({
      content: 'Descargando Locales...'
    });
    loading.present();
    let promesa = new Promise((resolve, reject) => {
      let url = this.url + "getLocales";
        let data = new URLSearchParams();
        data.append('user_id', user.id);
        this.http.post(url, data).map(res => res.json()).subscribe( (data:any) => {
          console.log(data);
          if(data)
          {
            this.store.guardar_locales(data).then(()=>{
              loading.dismiss();
              resolve(true);
            });
          }else{
            loading.dismiss();
            this.mensaje(data.datos);
            resolve(false);
          }
        });
    });

    return promesa;

  }

  postData(datos, type, local_id)
  {
    let promesa = new Promise((resolve, reject) => {
      let url = this.url + "uploadDatos";
        let data = new URLSearchParams();
        data.append('datos', datos);
        data.append('type', type);
        data.append('local_id', local_id);
        this.http.post(url, data).map(res => res.json()).subscribe( (data:any) => {
          console.log(data);
          if(data)
          {
            resolve(true);
          }else{
            this.mensaje(data.datos);
            resolve(false);
          }
        }, (error) => { console.log(error) });
    });

    return promesa;

  }

  

  mensaje(m)
  {
    let mensaje = this.toastCtrl.create({
      message: m,
      duration: 2500,
      position: 'middle'
    });
  }



}
