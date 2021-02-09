import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { AtividadeParlamentarComponent } from '../atividade-parlamentar/atividade-parlamentar.component';
import { ProposicoesComponent } from '../proposicoes/proposicoes.component';
import { SobreComponent } from './sobre/sobre.component';
import { SelecaoPainelComponent } from './selecao-painel/selecao-painel.component';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'paineis',
    component: SelecaoPainelComponent
  },
  {
    path: 'sobre',
    component: SobreComponent
  },
  {
    path: 'notFound',
    component: PageNotFoundComponent
  },
  {
    path: ':interesse',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'proposicoes',
        pathMatch: 'full'
      },
      {
        path: 'parlamentares',
        component: AtividadeParlamentarComponent
      },
      {
        path: 'proposicoes',
        component: ProposicoesComponent
      }
    ],
  },
  {
    path: '',
    redirectTo: 'paineis',
    pathMatch: 'full',
  },
  {
    path: ':interesse/parlamentares/:id',
    loadChildren: () =>
      import(
        '../atividade-parlamentar/detalhes-parlamentar/detalhes-parlamentar.module'
      ).then((m) => m.DetalhesParlamentarModule),
  },
  {
    path: ':interesse/proposicoes/:id_leggo',
    loadChildren: () =>
      import(
        '../proposicoes/detalhes-proposicao/detalhes-proposicao.module'
      ).then((m) => m.DetalhesProposicaoModule),
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
