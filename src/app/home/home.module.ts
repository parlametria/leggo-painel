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
// import { FiltroLateralComponent } from '../atividade-parlamentar/filtro-lateral/filtro-lateral.component';
import { ProposicoesComponent } from '../proposicoes/proposicoes.component';
import { CardProposicaoComponent } from '../proposicoes/card-proposicao/card-proposicao.component';
import { CardGridProposicaoComponent } from '../proposicoes/card-grid-proposicao/card-grid-proposicao.component';
import { FiltroProposicoesComponent } from '../proposicoes/filtro-proposicoes/filtro-proposicoes.component';
import { FiltroTextoProposicoesComponent } from '../proposicoes/filtro-texto-proposicoes/filtro-texto-proposicoes.component';
import { SobreComponent } from './sobre/sobre.component';
import { SelecaoPainelComponent } from './selecao-painel/selecao-painel.component';
import { InsightsComponent } from '../insights/insights.component';
import { CardInsightComponent } from '../insights/card-insight/card-insight.component';
import { ProjetosComponent } from 'src/app/projetos/projetos.component';
import { NaMidiaComponent } from 'src/app/na-midia/na-midia.component';
import { RelatoriosComponent } from 'src/app/relatorios/relatorios.component';

import { AderenciaComponent } from '../atividade-parlamentar/aderencia/aderencia.component';
import { CongressoChartComponent } from '../atividade-parlamentar/aderencia/congresso-chart/congresso-chart.component';
import { CongressoChartLegendaComponent } from '../atividade-parlamentar/aderencia/congresso-chart-legenda/congresso-chart-legenda.component';
import {
  AderenciaSwitchBlockComponent,
  CamaraIconBlockComponent,
  GovernoIconBlockComponent,
  PartidoIconBlockComponent,
  SenadoIconBlockComponent,
} from '../atividade-parlamentar/aderencia/aderencia-switch-block/components';

import { FiltroBuscaModule } from '../atividade-parlamentar/filtro-busca/filtro-busca.module';
import { FiltroLateralModule } from '../atividade-parlamentar/filtro-lateral/filtro-lateral.module';

@NgModule({
  declarations: [
    HomeComponent,
    AtividadeParlamentarComponent,
    CardAtividadeComponent,
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
    CongressoChartLegendaComponent,
    GovernoIconBlockComponent,
    PartidoIconBlockComponent,
    SenadoIconBlockComponent,
    CamaraIconBlockComponent,
    ProjetosComponent,
    NaMidiaComponent,
    RelatoriosComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedComponentsModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule,
    FiltroBuscaModule,
    FiltroLateralModule
  ]
})
export class HomeModule { }
