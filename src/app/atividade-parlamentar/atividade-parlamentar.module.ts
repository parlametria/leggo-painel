import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtividadeParlamentarRoutingModule } from './atividade-parlamentar-routing.module';
import { AtividadeParlamentarComponent } from './atividade-parlamentar.component';


@NgModule({
  declarations: [AtividadeParlamentarComponent],
  imports: [
    CommonModule,
    AtividadeParlamentarRoutingModule
  ]
})
export class AtividadeParlamentarModule { }
