import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoCitaPage } from './tipo-cita.page';

const routes: Routes = [
  {
    path: '',
    component: TipoCitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoCitaPageRoutingModule {}
