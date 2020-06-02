import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProposicaoPageHeaderComponent } from './views/proposicao-page-header/proposicao-page-header.component';
import { SobreComponent } from './views/sobre/sobre.component';
import { AjudaComponent } from './views/ajuda/ajuda.component';
import { RelatoriosComponent } from './views/relatorios/relatorios.component';
import { SemanariosComponent } from './views/semanarios/semanarios.component';
import { ProposicoesComponent } from './views/proposicoes/proposicoes.component';
import { CasesComponent } from './views/cases/cases.component';
import { ComissaoComponent } from './views/comissao/comissao.component';
import { ProposicaoDetailedComponent } from './views/proposicao-detailed/proposicao-detailed.component';
import { AtoresDetailedComponent } from './views/atores-detailed/atores-detailed.component';
import { PaginationBarComponent } from './components/utils/pagination-bar/pagination-bar.component';
import { LoginComponent } from './components/menu/login/login.component';
import { TemperatureSortComponent } from './components/menu/temperature-sort/temperature-sort.component';
import { FilterMenuComponent } from './components/menu/filter-menu/filter-menu.component';
import { NavMenuComponent } from './components/menu/nav-menu/nav-menu.component';
import { FilterButtonComponent } from './components/menu/filter-button/filter-button.component';
import { LeggoTableComponent } from './components/leggo-table/leggo-table.component';
import { ProposicaoExpandedComponent } from './components/card/proposicao-expanded/proposicao-expanded.component';
import { ProposicaoHeaderComponent } from './components/card/proposicao-header/proposicao-header.component';
import { FasesComponent } from './components/card/collapsed/fases/fases.component';
import { TemasComponent } from './components/card/collapsed/temas/temas.component';
import { RegimeTramitacaoComponent } from './components/card/collapsed/regime-tramitacao/regime-tramitacao.component';
import { TipoAgendaComponent } from './components/card/collapsed/tipo-agenda/tipo-agenda.component';
import { TextTagComponent } from './components/card/collapsed/text-tag/text-tag.component';
import { FormaApreciacaoComponent } from './components/card/collapsed/forma-apreciacao/forma-apreciacao.component';
import { BarComponent } from './components/card/collapsed/bar/bar.component';
import { PautaTagComponent } from './components/card/collapsed/pauta-tag/pauta-tag.component';
import { EtapaProposicaoComponent } from './components/card/etapa-proposicao/etapa-proposicao.component';
import { AuthorNameComponent } from './components/card/expanded/author-name/author-name.component';
import { ComposicaoLinkComponent } from './components/card/expanded/composicao-link/composicao-link.component';
import { AutoriasComponent } from './components/card/expanded/rede/autorias/autorias.component';
import { PesoPoliticoGraphComponent } from './components/card/expanded/rede/peso-politico-graph/peso-politico-graph.component';
import { SelectFilterComponent } from './components/card/expanded/rede/select-filter/select-filter.component';
import { TooltipComponent } from './components/card/expanded/rede/tooltip/tooltip.component';
import { GraphicsComponent } from './components/card/expanded/graphics/graphics.component';
import { AtoresInfoComponent } from './components/card/expanded/atores/atores-info/atores-info.component';
import { AtoresGraphicComponent } from './components/card/expanded/atores/atores-graphic/atores-graphic.component';
import { TabAtoresGraphicsComponent } from './components/card/expanded/atores/tab-atores-graphics/tab-atores-graphics.component';
import { EmendasInfoComponent } from './components/card/expanded/emendas-info/emendas-info.component';
import { FasesProgressComponent } from './components/card/expanded/fases-progress/fases-progress.component';
import { EmendasTabContentComponent } from './components/card/expanded/emendas-tab-content/emendas-tab-content.component';
import { TemperatureGraphicComponent } from './components/card/expanded/temperature/temperature-graphic/temperature-graphic.component';
import { TemperatureInfoComponent } from './components/card/expanded/temperature/temperature-info/temperature-info.component';
import { PressureGraphicComponent } from './components/card/expanded/pressao/pressure-graphic/pressure-graphic.component';
import { PautasInfoComponent } from './components/card/expanded/pautas-info/pautas-info.component';
import { EventosInfoComponent } from './components/card/expanded/eventos-info/eventos-info.component';
import { ProposicaoItemComponent } from './components/card/proposicao-item/proposicao-item.component';
import { NavigationButtonsComponent } from './components/header/navigation-buttons/navigation-buttons.component';
import { ParlamentarCardComponent } from './components/comissao/parlamentar-card/parlamentar-card.component';
import { ComposicaoComponent } from './components/comissao/composicao/composicao.component';
import { UltimosEventosComponent } from './components/ultimos-eventos/ultimos-eventos.component';

@NgModule({
  declarations: [
    AppComponent,
    ProposicaoPageHeaderComponent,
    SobreComponent,
    AjudaComponent,
    RelatoriosComponent,
    SemanariosComponent,
    ProposicoesComponent,
    CasesComponent,
    ComissaoComponent,
    ProposicaoDetailedComponent,
    AtoresDetailedComponent,
    PaginationBarComponent,
    LoginComponent,
    TemperatureSortComponent,
    FilterMenuComponent,
    NavMenuComponent,
    FilterButtonComponent,
    LeggoTableComponent,
    ProposicaoExpandedComponent,
    ProposicaoHeaderComponent,
    FasesComponent,
    TemasComponent,
    RegimeTramitacaoComponent,
    TipoAgendaComponent,
    TextTagComponent,
    FormaApreciacaoComponent,
    BarComponent,
    PautaTagComponent,
    EtapaProposicaoComponent,
    AuthorNameComponent,
    ComposicaoLinkComponent,
    AutoriasComponent,
    PesoPoliticoGraphComponent,
    SelectFilterComponent,
    TooltipComponent,
    GraphicsComponent,
    AtoresInfoComponent,
    AtoresGraphicComponent,
    TabAtoresGraphicsComponent,
    EmendasInfoComponent,
    FasesProgressComponent,
    EmendasTabContentComponent,
    TemperatureGraphicComponent,
    TemperatureInfoComponent,
    PressureGraphicComponent,
    PautasInfoComponent,
    EventosInfoComponent,
    ProposicaoItemComponent,
    NavigationButtonsComponent,
    ParlamentarCardComponent,
    ComposicaoComponent,
    UltimosEventosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
