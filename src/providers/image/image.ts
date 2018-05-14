import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading, AlertController } from 'ionic-angular';
import { URL } from "../../data/datos";
import { DatosWebProvider } from '../datos-web/datos-web';
import { StorageProvider } from '../storage/storage';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';



declare var cordova: any;

@Injectable()
export class ImageProvider {

  datosPOP:any[] = [];
  fotosZona:any[] = [];
  loading: Loading;
  lastImage: string = null;
  url:string = URL;
  encuestas:any[] = [];
  message:string = '';

  constructor(
    private camera: Camera,
    private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private _dw: DatosWebProvider,
    private store: StorageProvider
  ) {
    console.log('Hello ImageProvider Provider');

  }

  public presentActionSheet(imagen, tipo) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Cargar desde Libreria',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, imagen, tipo);
          }
        },
        {
          text: 'Usar Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, imagen, tipo);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

public takePicture(sourceType, imagen, tipo) {
  // Create options for the Camera Dialog
  var options = {
  quality: 30,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetWidth: 700,
      targetHeight: 394
  };


  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName(imagen), tipo);
        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName(imagen), tipo);
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
}

// Create a new name for the image
private createFileName(imagen) {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  imagen + n + ".jpg";
  return newFileName;
}

// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName, tipo) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
    if(tipo == "pop")
    {
      this.datosPOP.push(newFileName);
    }else{
      this.fotosZona.push(newFileName);
    }

    console.log(JSON.stringify(this.datosPOP));
  }, error => {
    this.presentToast('Error while storing file.');
  });
}

private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}

// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}

startSendingImages(tipo, sc, sc2)
{
  if(tipo == 'zona')
  {
    this.message = 'Enviando imagenes de Zonas...';
    this.sendImages(tipo, sc, sc2);
  }else{
    this.message = 'Enviando imagenes de Material POP...';
    this.sendImages(tipo, sc, sc2);
  }
}

public sendImages(tipo, sc, sc2)
{

  let startCount = sc;
  let startCount2 = sc2;
  if(tipo == 'zona')
  {
      let count = this.encuestas.length - 1;
      let count2 = this.encuestas[startCount].fotosZona.length - 1;
      let count3 = this.encuestas[startCount].fotosZona.length;
      this.showLoading(startCount, count);
     if(count3 > 0)
     {
       this.uploadImage(this.encuestas[startCount].fotosZona[sc2], tipo, this.encuestas[startCount].local.id).then(() => {
         startCount2++;
         if (startCount2 <= count2) {
           this.sendImages('zona', startCount, startCount2);
         }else{
           startCount++;
           if (startCount <= count) {
             this.sendImages('zona', startCount, 0);
           }else{
             this.showLoading(startCount, count).then(() => {
               this.showMessage('Imagenes de Zonas Enviadas!');
               this.startSendingImages('pop', 0, 0);
             });

           }
         }
       });
     }else{
       this.startSendingImages('pop', 0, 0);
     }
  }else{
    let count = this.encuestas.length - 1;
    let count2 = this.encuestas[startCount].fotosPOP.length - 1;
    let count3 = this.encuestas[startCount].fotosPOP.length;
    this.showLoading(startCount, count);
    if(count3 > 0)
    {
      this.uploadImage(this.encuestas[startCount].fotosPOP[sc2], tipo, this.encuestas[startCount].local.id).then(() => {
        startCount2++;
        if (startCount2 <= count2) {
          this.sendImages('pop', startCount, startCount2);
        }else{
          startCount++;
          if (startCount <= count) {
            this.sendImages('pop', startCount, 0);
          }else{
            this.showLoading(startCount, count).then(() => {
              this.showMessage('Imagenes de POP Enviadas!');
              this._dw.getLocales().then(() => {
                this.store.borrarEncuestas().then(() => {});
              });
            });

          }
        }
      });
    }else{
      this._dw.getLocales().then(() => {
        this.store.borrarEncuestas().then(() => {});
      });
    }
  }
}

public uploadImage(filename, tipo, local) {
  let promesa = new Promise((resolve, reject) => {
    // Destination URL
    var url = this.url + "uploadPhotos";

    // File for Upload
    var targetPath = this.pathForImage(filename);


    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {
        'fileName': filename,
        'tipo': tipo,
        'local': local
      }
    };

    const fileTransfer: TransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then((data:any) => {
      resolve(true);
    }, err => {
      console.log(JSON.stringify(err));
      resolve(false);
    });
  });

  return promesa;

}

showLoading(a, b)
{
  let promesa = new Promise((resolve, reject)=>{
    if(a == 0)
    {
      this.loading = this.loadingCtrl.create({
        content: this.message
      });
      this.loading.present();
    }
    if(a >= b)
    {
      this.loading.dismissAll();
    }
    resolve();
  });

  return promesa;


}

postImages(archivos:any)
{
  let promesa = new Promise((resolve, reject) => {
    let url = this.url + "uploadImages";
    let data = new FormData();
    for(let i = 0; i < archivos.length; i++)
    {
      
    }

  });

  return promesa;
}

showMessage(m)
{
  this.toastCtrl.create({
    message: m,
    duration: 1000
  }).present();
}

}
