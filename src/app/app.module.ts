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
    RelatoriaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
