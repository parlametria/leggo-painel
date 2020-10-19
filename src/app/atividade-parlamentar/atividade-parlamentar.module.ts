import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AtividadeParlamentarRoutingModule } from './atividade-parlamentar-routing.module';
import { AtividadeParlamentarComponent } from './atividade-parlamentar.component';
import { CardAtividadeComponent } from './card-atividade/card-atividade.component';
import { SharedComponentsModule } from '../shared/components/shared-components.module';
import { DetalhesParlamentarComponent } from './detalhes-parlamentar/detalhes-parlamentar.component';
import { VisAtividadeDetalhadaComponent } from './detalhes-parlamentar/vis-atividade-detalhada/vis-atividade-detalhada.component';
import { PesoPoliticoComponent, PapeisImportantesComponent, AtividadeNoCongressoComponent } from './detalhes-parlamentar';
import { VisAtividadeParlamentarComponent } from './detalhes-parlamentar/vis-atividade-parlamentar/vis-atividade-parlamentar.component';
import { FiltroComponent } from './filtro/filtro.component';
import { RedesSociaisComponent } from './detalhes-parlamentar/redes-sociais/redes-sociais.component';

@NgModule({
  declarations: [
    AtividadeParlamentarComponent,
    CardAtividadeComponent,
    DetalhesParlamentarComponent,
    VisAtividadeDetalhadaComponent,
    PesoPoliticoComponent,
    PapeisImportantesComponent,
    AtividadeNoCongressoComponent,
    VisAtividadeParlamentarComponent,
    FiltroComponent,
    RedesSociaisComponent
  ],
  imports: [
    CommonModule,
    AtividadeParlamentarRoutingModule,
    SharedComponentsModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class AtividadeParlamentarModule { }
