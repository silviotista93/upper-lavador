import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController, MenuController, LoadingController } from '@ionic/angular';

import { Usuario } from '../../interfaces/interfaces';
import { CuentaService } from '../../service/cuenta.service';
import { UiServiceService } from '../../service/ui-service.service';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal') slides: IonSlides;
  usuario: Usuario;
  loginUser = {
    email: '',
    password: ''
  };
  registerUser: Usuario = {
    email: '',
    name: '',
    last_name: '',
    phone_1: '',
  };

  constructor(
    private uiService: UiServiceService,
    private userService: UserService,
    private navCtrl: NavController,
    private menu: MenuController,
    private loadCtrl: LoadingController) { }
  ngOnInit() {
    this.slides.lockSwipes(true);
    this.menu.enable(false);
  }
  //#endregion

  //#region LOGICA DE FORMULARIO LOGIN
  async login(fLogin: NgForm) {
    console.log(fLogin.valid);

    // CREACION DEL LOADING
    const loading = await this.loadCtrl.create({
      spinner: 'crescent'
    });
    loading.present();

    if (fLogin.invalid) {
      loading.dismiss();
      this.uiService.errorToast('Todos los campos son obligatorios');
      return;
    }

    const validated = await this.userService.login(this.loginUser.email, this.loginUser.password);

    if (validated) {
      //  NAVEGA A LA PAGINA PRINCIPAL
      loading.dismiss();
      this.navCtrl.navigateRoot('/menu/solicitudes', { animated: true });
    } else {
      //  MUESTRA ALERTA DE ERROR EN INICIO DE SESION
      loading.dismiss();
      console.log('no hay acceso');

      // this.uiService.alertInfo('Usuario y contraseña incorrectas.');
      this.uiService.errorToast('Usuario y contraseña incorrectas');
    }
  }
  //#endregion

  //#region LOGICA DEL FORMULARIO DE REGISTRO
  async registro(fRegistro: NgForm) {
    const loading = await this.loadCtrl.create({
      spinner: 'crescent'
    });
    loading.present();

    if (fRegistro.invalid) {
      loading.dismiss();
      this.uiService.errorToast('Todos los campos son obligatorios');
      return;
    }
    const validated = await this.userService.registro(this.registerUser);
    console.log(this.registerUser);
    if (validated) {
      loading.dismiss();
      this.loginUser.email = this.registerUser.email;
      this.uiService.successToast('Hemos enviado a tu correo constraseña de acceso');
      this.mostrarLogin();
    } else {
      loading.dismiss();
      this.uiService.errorToast('Correo ya esta en uso');
    }
  }
  //#endregion


  // EVENTO DE BOTON REGISTRAR
  mostrarRegistro() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }
  // EVENTO DE BOTON LOGIN
  mostrarLogin() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

}
