import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';
import * as moment from 'moment';

import { AtorAgregado } from '../shared/models/atorAgregado.model';
import { ParlamentaresService } from '../shared/services/parlamentares.service';
import { indicate } from '../shared/functions/indicate.function';

@Component({
  selector: 'app-atividade-parlamentar',
  templateUrl: './atividade-parlamentar.component.html',
  styleUrls: ['./atividade-parlamentar.component.scss']
})
export class AtividadeParlamentarComponent implements OnInit, OnDestroy, AfterContentInit {

  private unsubscribe = new Subject();
  p = 1;
  public readonly PARLAMENTARES_POR_PAGINA = 20;
  public isLoading = new BehaviorSubject<boolean>(true);

  parlamentares: AtorAgregado[];
  interesse: string;
  tema: string;
  destaque: boolean;
  casa: string;
  orderBy: string;

  constructor(
    private parlamentaresService: ParlamentaresService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.interesse = params.get('interesse');
      });
    this.activatedRoute.queryParams
      .subscribe(params => {
        const pTema = this.replaceUndefined(params.tema);
        const pCasa = this.replaceUndefined(params.casa);
        const pOrderBy = this.replaceUndefined(params.orderBy);

        let mudouConsulta = true;

        if (this.tema === pTema && this.casa === pCasa && !this.destaque && this.parlamentares) {
          mudouConsulta = false;
        }

        let mudouOrdenacao = true;
        if (this.orderBy === pOrderBy && this.parlamentares) {
          mudouOrdenacao = false;
        }

        this.tema = pTema === 'destaque' ? '' : pTema;
        this.destaque = pTema === 'destaque';
        this.casa = pCasa;
        this.orderBy = pOrderBy;

        if (mudouConsulta) {
          this.getDadosAtividadeParlamentar();
        }

        if (mudouOrdenacao) {
          this.parlamentaresService.setOrderBy(this.orderBy);
        }

      });
    this.updatePageViaURL();
  }

  ngAfterContentInit() {
    this.cdRef.detectChanges();
  }

  getDadosAtividadeParlamentar() {
    const dataInicial = '2019-01-01';
    const dataFinal = moment().format('YYYY-MM-DD');
    this.parlamentaresService.setOrderBy(this.orderBy);
    this.parlamentaresService.getParlamentares(this.interesse, this.tema, this.casa, dataInicial, dataFinal, this.destaque)
      .pipe(
        skip(1),
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(parlamentares => {
        this.parlamentares = parlamentares;

        if (parlamentares.length <= (this.PARLAMENTARES_POR_PAGINA * (this.p - 1))) {
          this.pageChange(1); // volta para a primeira página com o novo resultado do filtro
        }

        this.isLoading.next(false);
      },
        error => {
          console.log(error);
        }
      );
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

  getParlamentarPosition(
    index: number,
    itensPerPage: number,
    currentPage: number
  ) {
    return (itensPerPage * (currentPage - 1)) + index;
  }

  search(filtro: any) {
    this.parlamentaresService.search(filtro);
  }

  private replaceUndefined(termo) {
    return termo === undefined ? '' : termo;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
