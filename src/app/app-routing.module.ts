import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':interesse',
    redirectTo: ':interesse/atores-chave',
    pathMatch: 'full'
  },
  {
    path: ':interesse/atores-chave',
    loadChildren: () => import('./atividade-parlamentar/atividade-parlamentar.module').then(m => m.AtividadeParlamentarModule)
  },
  {
    path: ':interesse/proposicoes',
    loadChildren: () => import('./proposicoes/proposicoes.module').then(m => m.ProposicoesModule)
  },
  {
    path: '',
    redirectTo: 'leggo/atores-chave',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
