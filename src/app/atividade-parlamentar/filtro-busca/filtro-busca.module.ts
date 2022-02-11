import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SeletorInteresseComponent } from './seletor-interesse/seletor-interesse.component';
import { SeletorCasaComponent } from './seletor-casa/seletor-casa.component';
import { BuscaNomeComponent } from './busca-nome/busca-nome.component';
import { FiltroBuscaComponent } from './filtro-busca.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    SeletorInteresseComponent,
    SeletorCasaComponent,
    BuscaNomeComponent,
    FiltroBuscaComponent
  ],
  exports: [
    FiltroBuscaComponent
  ]
})
export class FiltroBuscaModule { }
