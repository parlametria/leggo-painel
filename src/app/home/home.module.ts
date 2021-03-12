import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from '../shared/components/shared-components.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AtividadeParlamentarComponent } from '../atividade-parlamentar/atividade-parlamentar.component';
import { CardAtividadeComponent } from '../atividade-parlamentar/card-atividade/card-atividade.component';
import { FiltroComponent } from '../atividade-parlamentar/filtro/filtro.component';
import { ProposicoesComponent } from '../proposicoes/proposicoes.component';
import { CardProposicaoComponent } from '../proposicoes/card-proposicao/card-proposicao.component';
import { FiltroProposicoesComponent } from '../proposicoes/filtro-proposicoes/filtro-proposicoes.component';
import { SobreComponent } from './sobre/sobre.component';
import { SelecaoPainelComponent } from './selecao-painel/selecao-painel.component';
import { InsightsComponent } from '../insights/insights.component';
import { CardInsightComponent } from '../insights/card-insight/card-insight.component';

@NgModule({
  declarations: [
    HomeComponent,
    AtividadeParlamentarComponent,
    CardAtividadeComponent,
    FiltroComponent,
    ProposicoesComponent,
    CardProposicaoComponent,
    FiltroProposicoesComponent,
    SobreComponent,
    SelecaoPainelComponent,
    InsightsComponent,
    CardInsightComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedComponentsModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class HomeModule { }
