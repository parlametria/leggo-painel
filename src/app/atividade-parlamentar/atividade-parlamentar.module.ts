import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AtividadeParlamentarRoutingModule } from './atividade-parlamentar-routing.module';
import { AtividadeParlamentarComponent } from './atividade-parlamentar.component';
import { CardAtividadeComponent } from './card-atividade/card-atividade.component';
import { SharedComponentsModule } from '../shared/components/shared-components.module';
import { DetalhesParlamentarModule } from './detalhes-parlamentar/detalhes-parlamentar.module';
import { FiltroComponent } from './filtro/filtro.component';

@NgModule({
  declarations: [
    AtividadeParlamentarComponent,
    CardAtividadeComponent,
    FiltroComponent
  ],
  imports: [
    CommonModule,
    AtividadeParlamentarRoutingModule,
    SharedComponentsModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule,
    DetalhesParlamentarModule
  ]
})
export class AtividadeParlamentarModule { }
