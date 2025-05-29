import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeachRoutingModule } from './beach-routing.module';
import { BeachComponent } from './beach.component';


@NgModule({
  declarations: [
    BeachComponent
  ],
  imports: [
    CommonModule,
    BeachRoutingModule
  ]
})
export class BeachModule { }
