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
import { CardGridProposicaoComponent } from '../proposicoes/card-grid-proposicao/card-grid-proposicao.component';
import { FiltroProposicoesComponent } from '../proposicoes/filtro-proposicoes/filtro-proposicoes.component';
import { FiltroTextoProposicoesComponent } from '../proposicoes/filtro-texto-proposicoes/filtro-texto-proposicoes.component';
import { SobreComponent } from './sobre/sobre.component';
import { SelecaoPainelComponent } from './selecao-painel/selecao-painel.component';
import { InsightsComponent } from '../insights/insights.component';
import { CardInsightComponent } from '../insights/card-insight/card-insight.component';

import { AderenciaComponent } from '../atividade-parlamentar/aderencia/aderencia.component';
import { AderenciaSwitchBlockComponent } from '../atividade-parlamentar/aderencia/aderencia-switch-block/aderencia-switch-block.component';
import { CongressoChartComponent } from '../atividade-parlamentar/aderencia/congresso-chart/congresso-chart.component';


@NgModule({
  declarations: [
    HomeComponent,
    AtividadeParlamentarComponent,
    CardAtividadeComponent,
    FiltroComponent,
    ProposicoesComponent,
    CardProposicaoComponent,
    CardGridProposicaoComponent,
    FiltroProposicoesComponent,
    FiltroTextoProposicoesComponent,
    SobreComponent,
    SelecaoPainelComponent,
    InsightsComponent,
    CardInsightComponent,

    AderenciaComponent,
    AderenciaSwitchBlockComponent,
    CongressoChartComponent,
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
