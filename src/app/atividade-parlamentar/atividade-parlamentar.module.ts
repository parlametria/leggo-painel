import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { AtividadeParlamentarRoutingModule } from './atividade-parlamentar-routing.module';
import { AtividadeParlamentarComponent } from './atividade-parlamentar.component';
import { PainelComponent } from './painel/painel.component';
import { ListaComponent } from './lista/lista.component';


@NgModule({
  declarations: [AtividadeParlamentarComponent, PainelComponent, ListaComponent],
  imports: [
    CommonModule,
    AtividadeParlamentarRoutingModule,
    FormsModule
  ]
})
export class AtividadeParlamentarModule { }
