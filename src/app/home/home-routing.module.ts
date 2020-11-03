import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { AtividadeParlamentarComponent } from '../atividade-parlamentar/atividade-parlamentar.component';
import { ProposicoesComponent } from '../proposicoes/proposicoes.component';

const routes: Routes = [
  {
    path: ':interesse',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'atores-chave',
        pathMatch: 'full'
      },
      {
        path: 'atores-chave',
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
    redirectTo: 'leggo',
    pathMatch: 'full',
  },
  {
    path: ':interesse/atores-chave/:id',
    loadChildren: () =>
      import(
        '../atividade-parlamentar/detalhes-parlamentar/detalhes-parlamentar.module'
      ).then((m) => m.DetalhesParlamentarModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
