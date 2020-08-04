import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { ProgressComponent } from './progress/progress.component';
import { AvaliacaoComponent } from './avaliacao/avaliacao.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    NavbarComponent,
    ProgressComponent,
    AvaliacaoComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    ProgressComponent,
    AvaliacaoComponent,
    LoadingComponent
  ]
})
export class SharedComponentsModule { }
