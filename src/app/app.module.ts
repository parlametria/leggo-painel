import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedComponentsModule } from './shared/components/shared-components.module';
import { AtorService } from './shared/services/ator.service';
import { ProposicoesService } from './shared/services/proposicoes.service';
import { AutoriasService } from './shared/services/autorias.service';
import { ComissaoService } from './shared/services/comissao.service';
import { PesoPoliticoService } from './shared/services/peso-politico.service';
import { RelatoriaService } from './shared/services/relatoria.service';
import { ParlamentaresService } from './shared/services/parlamentares.service';
import { ParlamentarDetalhadoService } from './shared/services/parlamentar-detalhado.service';
import { EntidadeService } from './shared/services/entidade.service';
import { ProposicoesListaService } from './shared/services/proposicoes-lista.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedComponentsModule
  ],
  providers: [
    AtorService,
    ProposicoesService,
    AutoriasService,
    ComissaoService,
    PesoPoliticoService,
    RelatoriaService,
    ParlamentaresService,
    ParlamentarDetalhadoService,
    EntidadeService,
    ProposicoesListaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
