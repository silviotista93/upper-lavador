import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
})
export class SolicitudesPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
  pushDetalleSolicitud() {
    this.navCtrl.navigateForward('/menu/detalle-solicitud');
  }
}
