import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetalleSolicitudPage } from './detalle-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleSolicitudPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetalleSolicitudPage]
})
export class DetalleSolicitudPageModule {}
