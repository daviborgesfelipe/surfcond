import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeachComponent } from './beach.component';

const routes: Routes = [{ path: '', component: BeachComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeachRoutingModule { }
