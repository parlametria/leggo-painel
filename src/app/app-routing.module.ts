import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'atividade-parlamentar',
    loadChildren: () => import('./atividade-parlamentar/atividade-parlamentar.module').then(m => m.AtividadeParlamentarModule)
  },
  {
    path: '',
    redirectTo: 'atividade-parlamentar',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
