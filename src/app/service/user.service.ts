import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NavController } from '@ionic/angular';
import { Usuario, RolesUsers } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { UiServiceService } from './ui-service.service';



const URL = environment.url;
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
});

@Injectable({
  providedIn: 'root'
})

export class UserService {

  token: string = null;
  public usuario: Usuario = {};
  public roles: RolesUsers = {};

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private toastService: UiServiceService,
    private navCtrl: NavController) { }


  // #region LOGIN
  login(email: string, password: string) {
    const data = { email, password };
    return new Promise(resolve => {
      // tslint:disable-next-line:object-literal-shorthand
      this.http.post(`${URL}/api/auth/login`, data, { headers: headers })
        .subscribe(async resp => {
          console.log(resp);
          // tslint:disable-next-line:no-string-literal
          if (resp['access_token']) {
            // tslint:disable-next-line:no-string-literal
            this.token = resp['token_type'] + ' ' + resp['access_token'];
            await this.saveToken(this.token);
            resolve(true);
          } else {
            this.token = null;
            this.storage.clear();
            resolve(false);
          }
        }, err => {
          this.token = null;
          this.storage.clear();
          resolve(false);
        });
    });

  }

  // #region LOGOUT
  logout() {
    this.token = null;
    this.usuario = null;
    this.storage.clear();
    console.log('limpio el storage');
    this.navCtrl.navigateRoot('login', { animated: true });
  }
  // #endregion

  // #region REGISTRO DE USUARIO
  registro(usuario: Usuario) {

    return new Promise(resolve => {
      // tslint:disable-next-line:object-literal-shorthand
      this.http.post(`${URL}/api/auth/signup`, usuario, { headers: headers })
        .subscribe(async resp => {
          // tslint:disable-next-line:no-string-literal
          if (!resp['ERROR']) {
            resolve(true);
          } else {
            resolve(false);
          }
        }, err => {

          resolve(false);
        });
    });
  }
  // #endregion

  // #region OBTENER USUARIO
   getUsuario() {
    if (!this.usuario) {
       this.validaToken();
    }
    return { ...this.usuario };
  }
  // #endregion

  // #region GUARDAR TOKEN
  async  saveToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);

  }
  // #endregion

  // #region CARGAR TOKEN
  async loadToken() {
    return this.token = await this.storage.get('token') || null;
  }
  // #endregion

  // #region VALIDAR TOKEN
  async validaToken(): Promise<boolean> {
    await this.loadToken();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }
    return new Promise<boolean>(resolve => {

      const headerToken = new HttpHeaders({
        // tslint:disable-next-line:object-literal-key-quotes
        'Authorization': this.token,
      });

      this.http.get(`${URL}/api/auth/user/`, { headers: headerToken })
        .subscribe(resp => {
          // tslint:disable-next-line:no-string-literal
          this.roles = resp['user']['roles'];
          console.log(this.roles);
          if ( this.roles[0].id === 2 ) {
            console.log('respuesta de validar token ', resp);
            // tslint:disable-next-line:no-string-literal
            this.usuario = resp['user'];
            console.log('este es el usuario ', this.usuario);
            resolve(true);
          } else {
            this.logout();
            this.navCtrl.navigateRoot('/login');
            resolve(false);
            this.toastService.errorToast('No tienes permisos para acceder');
          }
        });
    });
  }
  // #endregion
}
