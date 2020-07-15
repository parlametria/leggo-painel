import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtividadeParlamentarComponent } from './atividade-parlamentar.component';
import { DetalhesParlamentarComponent } from './detalhes-parlamentar/detalhes-parlamentar.component';
import { PesoPoliticoComponent, PapeisImportantesComponent, AtividadeNoCongressoComponent } from './detalhes-parlamentar';


const routes: Routes = [
  {
    path: '',
    component: AtividadeParlamentarComponent
  },
  {
    path: ':id',
    component: DetalhesParlamentarComponent,
    children: [
      {
        path: 'peso',
        component: PesoPoliticoComponent,
      },
      {
        path: 'papeis',
        component: PapeisImportantesComponent,
      },
      {
        path: 'atividades',
        component: AtividadeNoCongressoComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtividadeParlamentarRoutingModule { }
