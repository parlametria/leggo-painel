import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: ':interesse',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'leggo',
    pathMatch: 'full'

  },
  {
    path: ':interesse/atores-chave',
    loadChildren: () => import('../atividade-parlamentar/atividade-parlamentar.module').then(m => m.AtividadeParlamentarModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
