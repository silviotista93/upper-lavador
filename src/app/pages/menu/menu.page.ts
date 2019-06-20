import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from '../../service/user.service';
import { Usuario } from '../../interfaces/interfaces';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  usuario: Usuario = {};
  URL = environment.url;

  pages = [];
  constructor(private navCtrl: NavController, private userService: UserService) { }

  ngOnInit() {
    setTimeout(() => {
      this.usuario = this.userService.getUsuario();
    }, 500);
    this.pages = [
      { title: 'Solicitudes', url: '/menu/solicitudes', icon: 'subscripcion'},
      { title: 'Historial', url: '/menu/historial', icon: 'historial'},
    ];
  }

  pushPerfil() {
    this.navCtrl.navigateForward('/menu/cuenta');
  }

}
