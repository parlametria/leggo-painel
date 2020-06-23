import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtividadeParlamentarComponent } from './atividade-parlamentar.component';
import { DetalhesParlamentarComponent } from './detalhes-parlamentar/detalhes-parlamentar.component';

const routes: Routes = [
  {
    path: '',
    component: AtividadeParlamentarComponent
  },
  {
    path: ':id',
    component: DetalhesParlamentarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtividadeParlamentarRoutingModule { }
