import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
