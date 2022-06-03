import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { DetalhesParlamentarComponent } from './detalhes-parlamentar.component';
import { VisAtividadeDetalhadaComponent } from './vis-atividade-detalhada/vis-atividade-detalhada.component';
import { PesoPoliticoComponent, PapeisImportantesComponent, AtividadeNoCongressoComponent } from './';
import { VisAtividadeParlamentarComponent } from './vis-atividade-parlamentar/vis-atividade-parlamentar.component';
import { RedesSociaisComponent } from './redes-sociais/redes-sociais.component';
import { VisAtividadeTwitterComponent } from './vis-atividade-twitter/vis-atividade-twitter.component';
import { DetalhesParlamentarRoutingModule } from './detalhes-parlamentar-routing.module';
import { VisProposicoesComMaisTweetsComponent } from './vis-proposicoes-com-mais-tweets/vis-proposicoes-com-mais-tweets.component';
import { VotacoesComponent } from './votacoes/votacoes.component';
import { VisGovernismoComponent } from './vis-governismo/vis-governismo.component';
import { VisDisciplinaComponent } from './vis-disciplina/vis-disciplina.component';
import { VisCabecalhoComponent } from './vis-cabecalho/vis-cabecalho.component';
import { CargosComponent } from './cargos/cargos.component';
import { CargoComponent } from './cargo/cargo.component';
import { PatrimonioEDespesasComponent } from './patrimonio-e-despesas/patrimonio-e-despesas.component';
import { GraficoPatrimonioComponent } from './grafico-patrimonio/grafico-patrimonio.component';


@NgModule({
  declarations: [
    DetalhesParlamentarComponent,
    VisAtividadeDetalhadaComponent,
    PesoPoliticoComponent,
    PapeisImportantesComponent,
    AtividadeNoCongressoComponent,
    VisAtividadeParlamentarComponent,
    RedesSociaisComponent,
    VisAtividadeTwitterComponent,
    VisProposicoesComMaisTweetsComponent,
    VotacoesComponent,
    VisGovernismoComponent,
    VisDisciplinaComponent,
    VisCabecalhoComponent,
    CargosComponent,
    CargoComponent,
    PatrimonioEDespesasComponent,
    GraficoPatrimonioComponent,
  ],
  imports: [
    CommonModule,
    DetalhesParlamentarRoutingModule,
    SharedComponentsModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class DetalhesParlamentarModule { }
