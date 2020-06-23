import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AtividadeParlamentarRoutingModule } from './atividade-parlamentar-routing.module';
import { AtividadeParlamentarComponent } from './atividade-parlamentar.component';
import { CardAtividadeComponent } from './card-atividade/card-atividade.component';
import { SharedComponentsModule } from '../shared/components/shared-components.module';
import { DetalhesParlamentarComponent } from './detalhes-parlamentar/detalhes-parlamentar.component';

@NgModule({
  declarations: [
    AtividadeParlamentarComponent,
    CardAtividadeComponent,
    DetalhesParlamentarComponent
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
