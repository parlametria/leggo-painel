import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AtorAgregado } from '../shared/models/atorAgregado.model';
import { ParlamentaresService } from '../shared/services/parlamentares.service';

@Component({
  selector: 'app-atividade-parlamentar',
  templateUrl: './atividade-parlamentar.component.html',
  styleUrls: ['./atividade-parlamentar.component.scss']
})
export class AtividadeParlamentarComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  p = 1;

  parlamentares: AtorAgregado[];
  interesse: string;
  opcoesOrdenacao: any = [
    'Mais ativos no congresso',
    // 'Mais ativos no Twitter',
    // 'Mais papéis importantes',
    // 'Maior peso político'
  ];

  constructor(
    private parlamentaresService: ParlamentaresService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.interesse = params.get('interesse');
      });
    this.getDadosAtividadeParlamentar();
  }

  getDadosAtividadeParlamentar() {
    this.parlamentaresService.getParlamentares(this.interesse)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(parlamentares => {
        this.parlamentares = parlamentares;
      });
  }

  pageChange(p: number) {
    this.p = p;
  }

  getParlamentarPosition(
    index: number,
    itensPerPage: number,
    currentPage: number
  ) {
    return (itensPerPage * (currentPage - 1)) + index;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
