import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { PesoPoliticoComponent } from './peso-politico/peso-politico.component';
import { PapeisImportantesComponent } from './papeis-importantes/papeis-importantes.component';
import { AtividadeNoCongressoComponent } from './atividade-no-congresso/atividade-no-congresso.component';
import { DetalhesParlamentarComponent } from './detalhes-parlamentar.component';
import { DetalhesParlamentarRoutingModule } from './detalhes-parlamentar-routing.module';


@NgModule({
  declarations: [
    SharedComponentsModule,
    DetalhesParlamentarComponent,
    PesoPoliticoComponent,
    PapeisImportantesComponent,
    AtividadeNoCongressoComponent,
  ],
  imports: [
    CommonModule,
    DetalhesParlamentarRoutingModule
  ]
})
export class DetalhesParlamentarModule { }
