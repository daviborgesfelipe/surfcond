import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForecastRoutingModule } from './forecast-routing.module';
import { ForecastComponent } from './forecast.component';
import { DirectionPipe } from 'src/app/shared/pipes/direction.pipe';
import { FormsModule } from '@angular/forms';
import { KmhPipe } from 'src/app/shared/pipes/kmPorHora.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    ForecastComponent,
    DirectionPipe,
    KmhPipe
  ],
  imports: [
    CommonModule,
    ForecastRoutingModule,
    FormsModule,
    MatSlideToggleModule
  ],
  exports: [
    ForecastComponent // ← necessário para ser usado fora do módulo
  ]
})
export class ForecastModule { }
