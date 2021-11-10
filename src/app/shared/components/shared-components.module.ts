import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NavbarComponent } from './navbar/navbar.component';
import { ProgressComponent } from './progress/progress.component';
import { AvaliacaoComponent } from './avaliacao/avaliacao.component';
import { LoadingComponent } from './loading/loading.component';
import { FiltraTemaComponent } from './filtra-tema/filtra-tema.component';
import { TooltipAjudaComponent } from './tooltip-ajuda/tooltip-ajuda.component';
import { EmbedTweetComponent } from './embed-tweet/embed-tweet.component';
import { DestaquesProposicaoComponent } from './destaques-proposicao/destaques-proposicao.component';
import { ProgressStackedComponent } from './progress-stacked/progress-stacked.component';
import { LegendComponent } from './legend/legend.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    NavbarComponent,
    ProgressComponent,
    AvaliacaoComponent,
    LoadingComponent,
    FiltraTemaComponent,
    TooltipAjudaComponent,
    DestaquesProposicaoComponent,
    EmbedTweetComponent,
    ProgressStackedComponent,
    LegendComponent,
    PageNotFoundComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    NavbarComponent,
    ProgressComponent,
    AvaliacaoComponent,
    LoadingComponent,
    FiltraTemaComponent,
    TooltipAjudaComponent,
    DestaquesProposicaoComponent,
    EmbedTweetComponent,
    ProgressStackedComponent,
    LegendComponent,
    FooterComponent
  ]
})
export class SharedComponentsModule { }
