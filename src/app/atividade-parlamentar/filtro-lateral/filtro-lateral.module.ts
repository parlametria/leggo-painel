import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BlocoOrdenacaoComponent } from './bloco-ordenacao/bloco-ordenacao.component';
import { BlocoBuscaComponent } from './bloco-busca/bloco-busca.component';
import { FiltroLateralComponent } from './filtro-lateral.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    BlocoOrdenacaoComponent,
    BlocoBuscaComponent,
    FiltroLateralComponent,
  ],
  exports: [
    FiltroLateralComponent
  ]
})
export class FiltroLateralModule { }
