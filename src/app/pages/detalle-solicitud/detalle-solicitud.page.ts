import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.page.html',
  styleUrls: ['./detalle-solicitud.page.scss'],
})
export class DetalleSolicitudPage implements OnInit {

  mapRef = null;

  constructor(private loadCtrl: LoadingController, private geolocation: Geolocation, private navCtrl: NavController) { }

  ngOnInit() {
    setTimeout(() => {
      this.loadMap();
    }, 500);
  }
  //#region Logica de mapas
  async loadMap() {
    const loading = await this.loadCtrl.create({
      spinner: 'crescent'
    });
    loading.present();
    this.geolocation.getCurrentPosition().then((resp) => {
      const myLatLng = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      console.log(myLatLng);
      const mapEle: HTMLElement = document.getElementById('map');
      this.mapRef = new google.maps.Map(mapEle, {
        center: myLatLng,
        zoom: 18,
        disableDefaultUI: true
      });
      google.maps.event.addListenerOnce(this.mapRef, 'idle', () => {
        loading.dismiss();
        this.addMarker(resp.coords.latitude, resp.coords.longitude);
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    const rta = this.geolocation.getCurrentPosition();
  }

  ubicacionActual() {
    this.geolocation.getCurrentPosition().then((resp) => {
      const myLatLng = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      console.log(myLatLng);
      const mapEle: HTMLElement = document.getElementById('map');
      this.mapRef = new google.maps.Map(mapEle, {
        center: myLatLng,
        zoom: 18,
        disableDefaultUI: true
      });
      google.maps.event.addListenerOnce(this.mapRef, 'idle', () => {
        this.addMarker(resp.coords.latitude, resp.coords.longitude);
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  private addMarker(lat: number, lng: number) {
    const image = '/assets/iconos/ubicacion.png';
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.mapRef,
      icon: image,
      animation: google.maps.Animation.BOUNCE,
      title: 'Ubicación Actual'
    });
  }
  pushConfirmarServicio() {
    this.navCtrl.navigateForward('/menu/confirmar-servicio');
  }
}
