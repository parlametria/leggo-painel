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
    component: DetalhesParlamentarComponent
  },
  {
    path: ':id/peso',
    component: PesoPoliticoComponent,
  },
  {
    path: ':id/papeisImportantes',
    component: PapeisImportantesComponent,
  },
  {
    path: ':id/atividades',
    component: AtividadeNoCongressoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtividadeParlamentarRoutingModule { }
