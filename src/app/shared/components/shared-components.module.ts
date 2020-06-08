import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './navbar/navbar.component';
import { ProgressComponent } from './progress/progress.component';
import { AvaliacaoComponent } from './avaliacao/avaliacao.component';

@NgModule({
  declarations: [
    NavbarComponent,
    ProgressComponent,
    AvaliacaoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarComponent,
    ProgressComponent,
    AvaliacaoComponent
  ]
})
export class SharedComponentsModule { }
