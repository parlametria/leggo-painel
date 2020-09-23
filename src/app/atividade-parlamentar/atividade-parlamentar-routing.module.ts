import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtividadeParlamentarComponent } from './atividade-parlamentar.component';
import { DetalhesParlamentarComponent } from './detalhes-parlamentar/detalhes-parlamentar.component';
import { PesoPoliticoComponent, PapeisImportantesComponent, AtividadeNoCongressoComponent } from './detalhes-parlamentar';
import { RedesSociaisComponent } from './detalhes-parlamentar/redes-sociais/redes-sociais.component';

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
        path: '',
        redirectTo: 'atividades',
        pathMatch: 'full'
      },
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
      },
      {
        path: 'redes-sociais',
        component: RedesSociaisComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtividadeParlamentarRoutingModule { }
