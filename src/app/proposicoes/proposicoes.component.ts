import { AfterContentInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { BehaviorSubject, Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { ProposicoesListaService } from '../shared/services/proposicoes-lista.service';
import { ProposicaoLista } from '../shared/models/proposicao.model';
import { MaximaTemperaturaProposicao } from '../shared/models/proposicoes/maximaTemperaturaProposicao.model';
import { indicate } from '../shared/functions/indicate.function';

@Component({
  selector: 'app-proposicoes',
  templateUrl: './proposicoes.component.html',
  styleUrls: ['./proposicoes.component.scss']
})
export class ProposicoesComponent implements OnInit, OnDestroy, AfterContentInit {

  private unsubscribe = new Subject();
  public isLoading = new BehaviorSubject<boolean>(true);

  interesse: string;
  proposicoes: ProposicaoLista[];
  tema: string;
  proposicoesDestaque: ProposicaoLista[];
  orderByProp: string;
  p = 1;

  constructor(
    private proposicoesListaService: ProposicoesListaService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.interesse = params.get('interesse');
        this.getProposicoes(this.interesse);
      });
    this.activatedRoute.queryParams
      .subscribe(params => {
        const pOrderBy = this.replaceUndefined(params.orderByProp);

        let mudouOrdenacao = true;
        if (this.orderByProp === pOrderBy && this.proposicoes) {
          mudouOrdenacao = false;
        }

        this.orderByProp = pOrderBy;

        if (mudouOrdenacao) {
          this.proposicoesListaService.setOrderBy(this.orderByProp);
        }
      });
    this.updatePageViaURL();
  }

  ngAfterContentInit() {
    this.cdRef.detectChanges();
  }

  getProposicoes(interesse: string) {
    this.proposicoesListaService.getProposicoes(interesse)
      .pipe(
        skip(1),
        indicate(this.isLoading),
        takeUntil(this.unsubscribe)
      ).subscribe(proposicoes => {
        this.proposicoes = proposicoes.filter(p => (typeof p.destaques !== 'undefined' && p.destaques.length === 0));
        this.proposicoesDestaque = proposicoes.filter(p => (typeof p.destaques !== 'undefined' && p.destaques.length !== 0));
        this.isLoading.next(false);
      });
  }

  search(filtro) {
    this.proposicoesListaService.search(filtro);
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

  private replaceUndefined(termo) {
    return termo === undefined ? '' : termo;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
