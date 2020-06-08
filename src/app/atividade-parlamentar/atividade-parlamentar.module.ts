import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { AtividadeParlamentarRoutingModule } from './atividade-parlamentar-routing.module';
import { AtividadeParlamentarComponent } from './atividade-parlamentar.component';


@NgModule({
  declarations: [AtividadeParlamentarComponent],
  imports: [
    CommonModule,
    AtividadeParlamentarRoutingModule,
    FormsModule
  ]
})
export class AtividadeParlamentarModule { }
