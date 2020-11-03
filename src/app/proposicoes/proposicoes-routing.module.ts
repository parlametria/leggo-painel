import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProposicoesComponent } from './proposicoes.component';

const routes: Routes = [
  {
    path: '',
    component: ProposicoesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposicoesRoutingModule { }
