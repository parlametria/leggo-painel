import { BrowserModule, Title } from '@angular/platform-browser';
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
import { InsightsService } from './shared/services/insights.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AderenciaModule } from './aderencia/aderencia.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedComponentsModule,
    AderenciaModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
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
    ProposicoesListaService,
    InsightsService,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
