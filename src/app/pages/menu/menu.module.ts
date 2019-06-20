import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
        {
          path: 'solicitudes',
          loadChildren: '../solicitudes/solicitudes.module#SolicitudesPageModule' },
        {
          path: 'historial',
          loadChildren: '../historial/historial.module#HistorialPageModule'
        },
        {
          path: 'detalle-solicitud', loadChildren: '../detalle-solicitud/detalle-solicitud.module#DetalleSolicitudPageModule',
        },
        {
          path: 'confirmar-servicio', loadChildren: '../confirmar-servicio/confirmar-servicio.module#ConfirmarServicioPageModule',
        },
        {
          path: 'cuenta', loadChildren: '../cuenta/cuenta.module#CuentaPageModule'
        },


    ]
  },
  {
    path: '',
    redirectTo: '/menu/solicitudes',
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
