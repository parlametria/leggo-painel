import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { AtividadeParlamentarRoutingModule } from './atividade-parlamentar-routing.module';
import { AtividadeParlamentarComponent } from './atividade-parlamentar.component';
import { CardAtividadeComponent } from './card-atividade/card-atividade.component';
import { SharedComponentsModule } from '../shared/components/shared-components.module';
import { PesquisarParlamentarComponent } from './pesquisar-parlamentar/pesquisar-parlamentar.component';


@NgModule({
  declarations: [
    AtividadeParlamentarComponent,
    CardAtividadeComponent,
    PesquisarParlamentarComponent
  ],
  imports: [
    CommonModule,
    AtividadeParlamentarRoutingModule,
    SharedComponentsModule,
    FormsModule
  ]
})
export class AtividadeParlamentarModule { }
