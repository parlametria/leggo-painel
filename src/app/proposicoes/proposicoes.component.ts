import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { ProposicoesListaService } from '../shared/services/proposicoes-lista.service';
import { ProposicoesService } from '../shared/services/proposicoes.service';
import { ProposicaoLista } from '../shared/models/proposicao.model';
import { MaximaTemperaturaProposicao } from '../shared/models/proposicoes/maximaTemperaturaProposicao.model';
import { indicate } from '../shared/functions/indicate.function';

@Component({
  selector: 'app-proposicoes',
  templateUrl: './proposicoes.component.html',
  styleUrls: ['./proposicoes.component.scss']
})
export class ProposicoesComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  public isLoading = new BehaviorSubject<boolean>(true);

  interesse: string;
  proposicoes: ProposicaoLista[];
  maxTemperatura: MaximaTemperaturaProposicao;
  p = 1;

  constructor(
    private proposicoesListaService: ProposicoesListaService,
    private proposicoesService: ProposicoesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.interesse = params.get('interesse');
        this.getMaxTemperatura(this.interesse);
        this.getProposicoes(this.interesse);
      });
    this.updatePageViaURL();
  }

  getProposicoes(interesse: string) {
    this.proposicoesListaService.setOrderBy('temperatura');

    this.proposicoesListaService.getProposicoes(interesse)
      .pipe(
        skip(1),
        indicate(this.isLoading),
        takeUntil(this.unsubscribe)
      ).subscribe(proposicoes => {
        console.log(proposicoes);
        this.proposicoes = proposicoes;
        this.isLoading.next(false);
      });
  }

  getMaxTemperatura(interesse: string) {
    this.proposicoesService.getMaximaTemperaturaProposicoes(interesse)
    .pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(maxTemperatura => {
      this.maxTemperatura = maxTemperatura;
    });
  }

  pageChange(p: number) {
    this.p = p;

    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.page = p;
    this.router.navigate([], { queryParams });
  }

  updatePageViaURL() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        const page = params.page;

        if (page !== undefined && page !== null) {
          this.p = Number(page);
        } else {
          this.p = 1;
        }
      });
  }

  getProposicaoPosition(
    index: number,
    itensPerPage: number,
    currentPage: number
  ) {
    return (itensPerPage * (currentPage - 1)) + index;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
