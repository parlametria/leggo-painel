import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from '../shared/components/shared-components.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AtividadeParlamentarModule } from '../atividade-parlamentar/atividade-parlamentar.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedComponentsModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule,
    AtividadeParlamentarModule
  ]
})
export class HomeModule { }
