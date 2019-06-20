import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../interfaces/interfaces';
import { UserService } from '../../service/user.service';
import { LoadingController, NavController, ActionSheetController } from '@ionic/angular';
import { UiServiceService } from 'src/app/service/ui-service.service';
import { CuentaService } from '../../service/cuenta.service';
import { NgForm } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


declare var window: any;


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
    private actSheetCtrl: ActionSheetController,
    private camera: Camera,
    private uiService: UiServiceService) { }

  dataPassword = {
    password: '',
    password_confirmation: '',
  };

  image: string = this.usuario.avatar;

  ngOnInit() {
    // this.usuario = this.userService.getUsuario();
    // console.log('Este es el usuario cuenta', this.usuario);
  }

  async ionViewWillEnter() {
    this.usuario = await this.userService.getUsuario();
    this.image = this.usuario.avatar;
    console.log('Este es el usuario cuenta', this.usuario);
  }

  logout() {
    this.userService.logout();
  }

  // #region Actualizar password
  async updatePassword(fPassword: NgForm) {
    this.usuario = await this.userService.getUsuario();
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
  // #endregion

  // #region Actualizar perfil
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
  // #endregion


  // #region Abrir Camera
  async openCamera() {
    const optionsCamera: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 400,
      targetHeight: 400,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
    }
    await this.getPicture(optionsCamera);
  }
  // #endregion

  // #region Abrir Galeria
  async openGallery() {
    const optionsGallery: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 400,
      targetHeight: 400,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    await this.getPicture(optionsGallery);
  }
  // #endregion

  // #region Obtener imagen
  getPicture(options: CameraOptions) {
    this.camera.getPicture(options).then(async (imageData) => {

      const img = window.Ionic.WebView.convertFileSrc(imageData);
      console.log('img', img);
      const loading = await this.loadCtrl.create({
        spinner: 'circles',
        translucent: true,
      });
      await loading.present();

      this.image = img;
      console.log('imagedata', imageData);
      const val = await this.cuentaService.updateAvatar(imageData);
      if (val) {
        loading.dismiss();
        this.ionViewWillEnter();
      }
      loading.dismiss();

    }, (err) => {
      // Handle error
    });
  }
  // #endregion

  // #region action sheet
  async presentActionSheet() {
    const actionSheet = await this.actSheetCtrl.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Camara',
          icon: 'camera',
          handler: () => {
            this.openCamera();
            // this.ionViewWillEnter();
            console.log('Camara clicked');
          }
        }, {
          text: 'Galeria',
          icon: 'images',
          handler: () => {
            this.openGallery();
            // this.ionViewWillEnter();
            console.log('Galeria clicked');
          }
        }]
    });
    await actionSheet.present();
  }
  // #endregion
}
