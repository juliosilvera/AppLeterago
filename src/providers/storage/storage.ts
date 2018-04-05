import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

@Injectable()
export class StorageProvider {

  user:any = {};
  locales:any[] = [];
  encuestas:any[] = [];

  constructor(
    private store: Storage
  ) {
    console.log('Hello StorageProvider Provider');
    this.cargar_locales().then(()=>{});
  }

  guarda_usuario(usuario)
  {
    let promesa = new Promise((resolve, reject) => {
      this.store.ready().then(()=>{
        this.store.set('user', usuario);
        resolve();
      });
    });

    return promesa;
  }

  cargar_usuario()
  {
    let promesa = new Promise((resolve, reject) => {
      this.store.ready().then(()=>{
        this.store.get('user').then((user) => {
          if(user)
          {
            this.user = user;
            console.log(this.user);
            resolve(true);
          }else{
            resolve(false);
          }

        });
      });
    });

    return promesa;
  }

  guardar_locales(locales)
  {
    let promesa = new Promise((resolve, reject) => {
      this.store.ready().then(()=>{
        this.store.set('locales', locales);
        resolve();
      });
    });

    return promesa;
  }

  cargar_locales()
  {
    let promesa = new Promise((resolve, reject) => {
      this.store.ready().then(()=>{
        this.store.get('locales').then((locales) => {
          if(locales)
          {
            this.locales = locales;
            console.log(this.locales);
            resolve(true);
          }else{
            resolve(false);
          }

        });
      });
    });

    return promesa;
  }

  guardar_encuestas(datos)
  {
    let promesa = new Promise((resolve, reject) => {
      this.store.ready().then(()=>{
        this.store.get('encuestas').then((data)=>{
          let old;
          if(data)
          {
            old = data;
            old.push(datos);
          }else{
            old = [datos];
          }
          this.store.set('encuestas', old).then(()=>{
            resolve();
          });
        });
      });
    });

    return promesa;
  }

  cargar_encuestas()
  {
    let promesa = new Promise((resolve, reject) => {
      this.store.ready().then(()=>{
        this.store.get('encuestas').then((encuestas:any) => {
          if(encuestas)
          {
            this.encuestas = encuestas;
            console.log(JSON.stringify(encuestas[0]));
            resolve(true);
          }else{
            resolve(false);
          }

        });
      });
    });

    return promesa;
  }

}
