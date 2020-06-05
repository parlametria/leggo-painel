import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtividadeParlamentarModule } from './atividade-parlamentar/atividade-parlamentar.module';


const routes: Routes = [
  {
    path: 'atividade-parlamentar',
    loadChildren: AtividadeParlamentarModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
