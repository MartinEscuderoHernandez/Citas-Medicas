import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipoCitaPageRoutingModule } from './tipo-cita-routing.module';

import { TipoCitaPage } from './tipo-cita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TipoCitaPageRoutingModule
  ],
  declarations: [TipoCitaPage]
})
export class TipoCitaPageModule {}
