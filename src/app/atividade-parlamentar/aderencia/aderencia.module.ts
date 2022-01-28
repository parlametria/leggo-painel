import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AderenciaComponent } from './aderencia.component';
import { CongressoChartComponent } from './congresso-chart/congresso-chart.component';
import { AderenciaSwitchBlockComponent } from './aderencia-switch-block/aderencia-switch-block.component';

@NgModule({
  declarations: [
    AderenciaComponent,
    CongressoChartComponent,
    AderenciaSwitchBlockComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
  ]
})
export class AderenciaModule { }
