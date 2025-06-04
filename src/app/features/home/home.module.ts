import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CitySelectorComponent } from 'src/app/shared/components/city-selector/city-selector.component';
import { RegionSelectorComponent } from 'src/app/shared/components/region-selector/region-selector.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ForecastModule } from '../forecast/forecast.module';
import { AbreviarCidadePipe } from 'src/app/shared/pipes/abreviarCidade.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    RegionSelectorComponent,
    CitySelectorComponent,
    AbreviarCidadePipe
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    NgSelectModule,
    ForecastModule
  ],
    exports: [
    HomeComponent,
    AbreviarCidadePipe
  ]
})
export class HomeModule { }
