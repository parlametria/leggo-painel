import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { DetalhesProposicaoComponent } from './detalhes-proposicao.component';
import { TemperaturaPressaoComponent } from './temperatura-pressao/temperatura-pressao.component';
import { VisTemperaturaPressaoComponent } from './vis-temperatura-pressao/vis-temperatura-pressao.component';
import { DetalhesProposicaoRoutingModule } from './detalhes-proposicao-routing.module';
import { ListaAutoresComponent } from './lista-autores/lista-autores.component';
import { ListaRelatoresComponent } from './lista-relatores/lista-relatores.component';
import { ProgressoComponent } from './progresso/progresso.component';
import { AtuacaoParlamentarComponent } from './atuacao-parlamentar/atuacao-parlamentar.component';
import { EventoTramitacaoComponent } from './evento-tramitacao/evento-tramitacao.component';
import { EmentasComponent } from './ementas/ementas.component';
import { ListaLocaisAtuaisComponent } from './lista-locais-atuais/lista-locais-atuais.component';
import { RedeInfluenciaComponent } from './rede-influencia/rede-influencia.component';

@NgModule({
  declarations: [
    DetalhesProposicaoComponent,
    ListaAutoresComponent,
    ListaRelatoresComponent,
    TemperaturaPressaoComponent,
    VisTemperaturaPressaoComponent,
    ProgressoComponent,
    AtuacaoParlamentarComponent,
    EventoTramitacaoComponent,
    EmentasComponent,
    ListaLocaisAtuaisComponent,
    RedeInfluenciaComponent
  ],
  imports: [
    CommonModule,
    DetalhesProposicaoRoutingModule,
    SharedComponentsModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class DetalhesProposicaoModule { }
