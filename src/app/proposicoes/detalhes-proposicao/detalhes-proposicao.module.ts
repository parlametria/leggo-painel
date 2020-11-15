import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { DetalhesProposicaoComponent } from './detalhes-proposicao.component';
import { DetalhesProposicaoRoutingModule } from './detalhes-proposicao-routing.module';


@NgModule({
  declarations: [
    DetalhesProposicaoComponent
  ],
  imports: [
    CommonModule,
    DetalhesProposicaoRoutingModule,
    SharedComponentsModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule,
  ]
})
export class DetalhesProposicaoModule { }