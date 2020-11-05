import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { DetalhesParlamentarComponent } from './detalhes-parlamentar.component';
import { VisAtividadeDetalhadaComponent } from './vis-atividade-detalhada/vis-atividade-detalhada.component';
import { PesoPoliticoComponent, PapeisImportantesComponent, AtividadeNoCongressoComponent } from './';
import { VisAtividadeParlamentarComponent } from './vis-atividade-parlamentar/vis-atividade-parlamentar.component';
import { RedesSociaisComponent } from './redes-sociais/redes-sociais.component';
import { VisAtividadeTwitterComponent } from './vis-atividade-twitter/vis-atividade-twitter.component';
import { DetalhesParlamentarRoutingModule } from './detalhes-parlamentar-routing.module';
import { TweetComponent } from './redes-sociais/tweet/tweet.component';

@NgModule({
  declarations: [
    DetalhesParlamentarComponent,
    VisAtividadeDetalhadaComponent,
    PesoPoliticoComponent,
    PapeisImportantesComponent,
    AtividadeNoCongressoComponent,
    VisAtividadeParlamentarComponent,
    RedesSociaisComponent,
    VisAtividadeTwitterComponent,
    TweetComponent
  ],
  imports: [
    CommonModule,
    DetalhesParlamentarRoutingModule,
    SharedComponentsModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class DetalhesParlamentarModule { }
