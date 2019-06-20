import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController} from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-confirmar-servicio',
  templateUrl: './confirmar-servicio.page.html',
  styleUrls: ['./confirmar-servicio.page.scss'],
})
export class ConfirmarServicioPage implements OnInit {

  mapRef = null;
  constructor(
    private geolocation: Geolocation,
    public alertController: AlertController,
    private loadCtrl: LoadingController) { }

  ngOnInit() {
    setTimeout(() => {
      this.loadMap();
    }, 500);
  }

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
      const mapEle: HTMLElement = document.getElementById('map2');
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

  ubicacionActual() {
    this.geolocation.getCurrentPosition().then((resp) => {
      const myLatLng = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      console.log(myLatLng);
      const mapEle: HTMLElement = document.getElementById('map2');
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

}
