import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalhesProposicaoComponent } from './detalhes-proposicao.component';

const appRoutes: Routes = [
    {
        path: '',
        component: DetalhesProposicaoComponent,
        pathMatch: 'full'
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
