import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) }, { path: 'forecast', loadChildren: () => import('./features/forecast/forecast.module').then(m => m.ForecastModule) }, { path: 'beach', loadChildren: () => import('./features/beach/beach.module').then(m => m.BeachModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
