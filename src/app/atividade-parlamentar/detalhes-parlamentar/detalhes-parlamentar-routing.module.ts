import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalhesParlamentarComponent } from './detalhes-parlamentar.component';
import { PesoPoliticoComponent, PapeisImportantesComponent, AtividadeNoCongressoComponent } from './';
import { RedesSociaisComponent } from './redes-sociais/redes-sociais.component';
import { VotacoesComponent } from './votacoes/votacoes.component';

const routes: Routes = [
  {
    path: '',
    component: DetalhesParlamentarComponent,
    children: [
      {
        path: '',
        redirectTo: 'atividades',
        pathMatch: 'full'
      },
      {
        path: 'atividades',
        component: AtividadeNoCongressoComponent,
      },
      {
        path: 'papeis',
        component: PapeisImportantesComponent,
      },
      {
        path: 'votacoes',
        component: VotacoesComponent,
      },
      {
        path: 'peso',
        component: PesoPoliticoComponent,
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
export class DetalhesParlamentarRoutingModule { }
