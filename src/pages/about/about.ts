import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { StorageProvider } from "../../providers/storage/storage";
import { Geolocation } from '@ionic-native/geolocation';
import { ImageProvider } from "../../providers/image/image";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  farmacias:boolean = false;
  zonaDescuento:boolean = false;
  asesor:boolean = false;
  pop:boolean = false;
  locales:any[] = [];
  loc:any = {};
  getCoords:boolean = false;
  mostrarBoton:boolean = false;
  datosFarmacias:any = {};
  datosZonaDescuento:any = {};
  datosAsesor:any = {};
  datosPOP:any[] = [];
  fotosZona:any[] = [];
  local:any = '';



  constructor(
    public navCtrl: NavController,
    private store: StorageProvider,
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private imgP: ImageProvider,
    private toastCtrl: ToastController
  ) {

  }

  ionViewWillEnter()
  {
    this.locales = this.store.locales.slice();
    this.locales = this.locales.filter(item => {
      if(item.estado == 0)
      {
        return item;
      }
    });
    this.datosPOP = this.imgP.datosPOP;
    this.fotosZona = this.imgP.fotosZona;
  }

  changeViewFarmacia()
  {
    this.farmacias = !this.farmacias;
  }

  changeViewZonaDescuento()
  {
    this.zonaDescuento = !this.zonaDescuento;
  }

  changeViewAsesor()
  {
    this.asesor = !this.asesor;
  }

  changeViewPOP()
  {
    this.pop = !this.pop;
  }

  obtenerCoordenadas()
  {
    this.mostrarBoton = true;
    this.getCoords = false;
    let loading = this.loadingCtrl.create({
      content: 'Obteniendo Coordenadas...'
    });
    loading.present();
    this.geolocation.getCurrentPosition().then((resp) => {
     // resp.coords.latitude
     // resp.coords.longitude
     this.loc.lat = resp.coords.latitude;
     this.loc.lng = resp.coords.longitude;
     console.log(this.loc);
     loading.dismiss();
    }).catch((error) => {
      console.log('Error getting location', error);
      loading.dismiss();
    });
  }

  mostrarDatosLocal(local)
  {
    for(let i = 0; i < this.locales.length; i++)
    {
      if(this.locales[i].id == local)
      {
        this.loc = this.locales[i];
        if(this.locales[i].lat == '' && this.locales[i].lng == '')
        {
          this.getCoords = true;
        }else{
          this.mostrarBoton = true;
        }
      }
    }

  }

  guardarDatos()
  {
    this.validarDatos().then((resp:any) => {
      if(resp.status)
      {
        let loading = this.loadingCtrl.create({
          content: 'Guardando Información...'
        });
        loading.present();
        let datos = {
          'local': this.loc,
          'datosAsesor': this.datosAsesor,
          'datosFarmacias': this.datosFarmacias,
          'datosZonaDescuento': this.datosZonaDescuento,
          'fotosZona': this.fotosZona,
          'fotosPOP': this.datosPOP
        };
        this.loc.estado = 1;
        this.store.guardar_encuestas(datos).then(()=>{
          this.store.guardar_locales(this.locales).then(()=>{
            this.farmacias = false;
            this.zonaDescuento = false;
            this.asesor = false;
            this.pop = false;
            this.loc = {};
            this.getCoords = false;
            this.mostrarBoton = false;
            this.datosFarmacias = {};
            this.datosZonaDescuento = {};
            this.datosAsesor = {};
            this.imgP.datosPOP = [];
            this.imgP.fotosZona = [];
            this.local = '';
            loading.dismiss();
            this.navCtrl.parent.select(0);
          });
        });
      }else{
        this.mensaje(resp.mensaje);
      }
    });
  }

  presentActionSheet(imagen, tipo)
  {
    this.imgP.presentActionSheet(imagen, tipo);
  }

  pathForImage(img)
  {
    return this.imgP.pathForImage(img);
  }

  borrarImagenPOP(i)
  {
    this.imgP.datosPOP.splice(i, 1);
  }

  borrarImagenZona(i)
  {
    this.imgP.fotosZona.splice(i, 1);
  }

  validarDatos()
  {
    let promesa = new Promise((resolve, reject) => {
      if(!this.datosFarmacias.conocimento_promociones)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de FARMACIA - Conocimiento de Promociones'
        };
        resolve(datos);
      }
      if(!this.datosFarmacias.conceptos_ptl)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de FARMACIA - Conceptos PTL'
        };
        resolve(datos);
      }
      if(!this.datosFarmacias.conocimiento_laboratorios_participantes)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de FARMACIA - Conocimiento de Laboratorios Participantes'
        };
        resolve(datos);
      }
      if(!this.datosFarmacias.conocimiento_programas_capacitacion)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de FARMACIA - Conocimiento de Programas de Capacitación'
        };
        resolve(datos);
      }
      if(!this.datosFarmacias.conocimiento_beneficios)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de FARMACIA - Conoce los beneficios'
        };
        resolve(datos);
      }

      if(!this.datosZonaDescuento.zona_descuento)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de ZONA DE DESCUENTOS - ZONA DE DESCUENTO'
        };
        resolve(datos);
      }
      if(this.datosZonaDescuento.zona_descuento != 0 && !this.datosZonaDescuento.zona_clave)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de ZONA DE DESCUENTOS - Zona Caliente'
        };
        resolve(datos);
      }
      if(this.datosZonaDescuento.zona_descuento != 0 && !this.datosZonaDescuento.visualizacion)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de ZONA DE DESCUENTOS - Visualización'
        };
        resolve(datos);
      }
      if(this.datosZonaDescuento.zona_descuento != 0 && !this.datosZonaDescuento.organizacion_productos)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de ZONA DE DESCUENTOS - Organización de productos'
        };
        resolve(datos);
      }
      if(this.datosZonaDescuento.zona_descuento != 0 && !this.datosZonaDescuento.espacio_uso)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de ZONA DE DESCUENTOS - Espacio de Uso'
        };
        resolve(datos);
      }
      if(!this.datosAsesor.programa_ptl)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de CALIFICACION ASESOR COMERCIAL - Programa PTL'
        };
        resolve(datos);
      }
      if(!this.datosAsesor.zona_descuento)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de CALIFICACION ASESOR COMERCIAL - Zona de Descuento'
        };
        resolve(datos);
      }
      if(!this.datosAsesor.capacitaciones)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de CALIFICACION ASESOR COMERCIAL - Capacitación'
        };
        resolve(datos);
      }
      if(!this.datosAsesor.penetracion_marcas)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de CALIFICACION ASESOR COMERCIAL - Penetracion de Marcas'
        };
        resolve(datos);
      }
      if(!this.datosAsesor.visitas_asesor)
      {
        let datos = {
          'status': false,
          'mensaje': 'Falta contenido de CALIFICACION ASESOR COMERCIAL - Visitas del Asesor'
        };
        resolve(datos);
      }
      let datos = {
        'status': true,
        'mensaje': 'Falta contenido de CALIFICACION ASESOR COMERCIAL - Visitas del Asesor'
      };
      resolve(datos);

    });

    return promesa;
  }

  mensaje(m)
  {
    let toast = this.toastCtrl.create({
      message: m,
      duration: 3000,
      position: 'middle'
    }).present();
  }





}
