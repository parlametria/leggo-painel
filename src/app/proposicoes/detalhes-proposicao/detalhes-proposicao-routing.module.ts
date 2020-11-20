import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalhesProposicaoComponent } from './detalhes-proposicao.component';
import { ProgressoComponent } from './progresso/progresso.component';

const appRoutes: Routes = [
    {
        path: '',
        component: DetalhesProposicaoComponent,
        children: [
          {
            path: 'progresso',
            component: ProgressoComponent
          },

        ],
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
