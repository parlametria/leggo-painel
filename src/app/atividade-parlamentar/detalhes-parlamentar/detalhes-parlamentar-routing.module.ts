import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PesoPoliticoComponent, PapeisImportantesComponent, AtividadeNoCongressoComponent } from './';
import { DetalhesParlamentarComponent } from './detalhes-parlamentar.component';

const routes: Routes = [
    {
      path: '',
      component: DetalhesParlamentarComponent,
      children: [
        {
        path: '',
        redirectTo: 'peso',
        pathMatch: 'full',
        },
        {
          path: 'peso',
          component: PesoPoliticoComponent,
        },
        {
          path: 'papeisImportantes',
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
export class DetalhesParlamentarRoutingModule { }
