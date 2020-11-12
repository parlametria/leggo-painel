import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedComponentsModule } from '../shared/components/shared-components.module';
import { ProposicoesRoutingModule } from './proposicoes-routing.module';
import { ProposicoesComponent } from './proposicoes.component';
import { CardProposicaoComponent } from './card-proposicao/card-proposicao.component';
import { FiltroProposicoesComponent } from './filtro-proposicoes/filtro-proposicoes.component';
import { DetalhesProposicaoComponent } from './detalhes-proposicao/detalhes-proposicao.component';

@NgModule({
  declarations: [ProposicoesComponent, CardProposicaoComponent, FiltroProposicoesComponent, DetalhesProposicaoComponent],
  imports: [
    CommonModule,
    ProposicoesRoutingModule,
    SharedComponentsModule,
    NgbModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class ProposicoesModule { }
