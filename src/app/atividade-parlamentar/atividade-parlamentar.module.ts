import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AtividadeParlamentarRoutingModule } from './atividade-parlamentar-routing.module';
import { AtividadeParlamentarComponent } from './atividade-parlamentar.component';
import { CardAtividadeComponent } from './card-atividade/card-atividade.component';
import { SharedComponentsModule } from '../shared/components/shared-components.module';
import { DetalhesParlamentarComponent } from './detalhes-parlamentar/detalhes-parlamentar.component';
import { VisAtividadeDetalhadaComponent } from './detalhes-parlamentar/vis-atividade-detalhada/vis-atividade-detalhada.component';
import { PesoPoliticoComponent, PapeisImportantesComponent, AtividadeNoCongressoComponent } from './detalhes-parlamentar';

@NgModule({
  declarations: [
    AtividadeParlamentarComponent,
    CardAtividadeComponent,
    DetalhesParlamentarComponent,
    VisAtividadeDetalhadaComponent,
    PesoPoliticoComponent,
    PapeisImportantesComponent,
    AtividadeNoCongressoComponent
  ],
  imports: [
    CommonModule,
    AtividadeParlamentarRoutingModule,
    SharedComponentsModule,
    NgbModule,
    NgxPaginationModule
  ]
})
export class AtividadeParlamentarModule { }
