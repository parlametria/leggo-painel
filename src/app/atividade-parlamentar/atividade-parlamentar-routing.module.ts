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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtividadeParlamentarRoutingModule { }
