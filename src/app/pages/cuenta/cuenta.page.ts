import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../interfaces/interfaces';
import { UserService } from '../../service/user.service';
import { LoadingController, NavController } from '@ionic/angular';
import { UiServiceService } from 'src/app/service/ui-service.service';
import { CuentaService } from '../../service/cuenta.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {

  URL = environment.url;
  public usuario: Usuario = {};


  constructor(
    private userService: UserService,
    private loadCtrl: LoadingController,
    private navCtrl: NavController,
    private cuentaService: CuentaService,
    private uiService: UiServiceService

  ) { }

  dataPassword = {
    password: '',
    password_confirmation: '',
  };

  ngOnInit() {
    this.usuario = this.userService.getUsuario();
    console.log('Este es el usuario cuenta', this.usuario);
  }

  logout() {
    this.userService.logout();
  }

  async updatePassword(fPassword: NgForm) {

    this.usuario = await this.userService.getUsuario();
    // console.log(this.usuario.id);

    // CREACION DEL LOADING
    const loading = await this.loadCtrl.create({
      spinner: 'crescent'
    });
    loading.present();

    if (fPassword.invalid) {
      loading.dismiss();
      this.uiService.errorToast('Todos los campos son obligatorios');
      return;
    }

    const validated = await this.cuentaService.updatePassword(
      this.dataPassword.password, this.dataPassword.password_confirmation, this.usuario.id
    );


    if (validated) {
      loading.dismiss();
      // this.uiService.successToast('Constraseña Actualizada');
    } else {
      loading.dismiss();
      // this.uiService.errorToast('Error');
    }
  }

  async updateProfile(fProfile: NgForm) {
    const loading = await this.loadCtrl.create({
      spinner: 'crescent'
    });
    loading.present();
    if (fProfile.invalid) {
      loading.dismiss();
      this.uiService.errorToast('Todos los campos son obligatorios');
      return;
    }
    const validated = await this.cuentaService.updateProfile2(this.usuario);
    if (validated) {
      loading.dismiss();
      // this.uiService.successToast('Perfil Actualizado Actualizado');
    } else {
      loading.dismiss();
      // this.uiService.errorToast('Error');
    }
  }

}
