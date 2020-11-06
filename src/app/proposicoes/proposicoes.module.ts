import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedComponentsModule } from '../shared/components/shared-components.module';
import { ProposicoesRoutingModule } from './proposicoes-routing.module';
import { ProposicoesComponent } from './proposicoes.component';
import { CardProposicaoComponent } from './card-proposicao/card-proposicao.component';

@NgModule({
  declarations: [ProposicoesComponent, CardProposicaoComponent],
  imports: [
    CommonModule,
    ProposicoesRoutingModule,
    SharedComponentsModule,
    NgbModule,
    NgxPaginationModule
  ]
})
export class ProposicoesModule { }
