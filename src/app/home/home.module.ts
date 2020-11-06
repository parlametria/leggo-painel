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
import { SobreComponent } from '../sobre/sobre.component';

@NgModule({
  declarations: [
    HomeComponent,
    AtividadeParlamentarComponent,
    CardAtividadeComponent,
    FiltroComponent,
    ProposicoesComponent,
    CardProposicaoComponent,
    SobreComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedComponentsModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule,
  ]
})
export class HomeModule { }
