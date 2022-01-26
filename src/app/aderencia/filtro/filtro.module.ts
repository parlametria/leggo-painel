import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FiltroComponent } from './filtro.component';

@NgModule({
  declarations: [
    FiltroComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FiltroComponent
  ]
})
export class FiltroModule { }
