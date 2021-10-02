import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalhesProposicaoComponent } from './detalhes-proposicao.component';
import { ProgressoComponent } from './progresso/progresso.component';
import { TemperaturaPressaoComponent } from './temperatura-pressao/temperatura-pressao.component';
import { AtuacaoParlamentarComponent } from './atuacao-parlamentar/atuacao-parlamentar.component';
import { RedeInfluenciaComponent } from './rede-influencia/rede-influencia.component';

const appRoutes: Routes = [
  {
    path: '',
    component: DetalhesProposicaoComponent,
    children: [
      {
        path: '',
        redirectTo: 'temperatura-pressao',
        pathMatch: 'full'
      },
      {
        path: 'temperatura-pressao',
        component: TemperaturaPressaoComponent,
      },
      {
        path: 'progresso',
        component: ProgressoComponent
      },
      {
        path: 'atuacao',
        component: AtuacaoParlamentarComponent
      },
      {
        path: 'rede-de-influencia',
        component: RedeInfluenciaComponent
      },
    ]
  }
];

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class DetalhesProposicaoRoutingModule { }
