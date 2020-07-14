import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':interesse',
    redirectTo: ':interesse/atividade-parlamentar',
    pathMatch: 'full'
  },
  {
    path: ':interesse/atividade-parlamentar',
    loadChildren: () => import('./atividade-parlamentar/atividade-parlamentar.module').then(m => m.AtividadeParlamentarModule)
  },
  {
    path: '',
    redirectTo: 'leggo/atividade-parlamentar',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
