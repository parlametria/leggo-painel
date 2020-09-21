import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';

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
  public isLoading = new BehaviorSubject<boolean>(true);

  parlamentares: AtorAgregado[];
  interesse: string;
  tema: string;
  casa: string;
  orderBy: string;

  constructor(
    private parlamentaresService: ParlamentaresService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.interesse = params.get('interesse');
      });
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.tema = params.tema;
        this.casa = params.casa;
        this.orderBy = params.orderBy;
        this.tema === undefined ? this.tema = '' : this.tema = this.tema;
        this.casa === undefined ? this.casa = '' : this.casa = this.casa;
        this.orderBy === undefined ? this.orderBy = '' : this.orderBy = this.orderBy;
        this.getDadosAtividadeParlamentar();
      });
    this.updatePageViaURL();
  }

  ngAfterContentInit() {
    this.cdRef.detectChanges();
  }

  getDadosAtividadeParlamentar() {
    this.parlamentaresService.setOrderBy(this.orderBy);
    this.parlamentaresService.getParlamentares(this.interesse, this.tema, this.casa)
      .pipe(
        skip(1),
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(parlamentares => {
        this.parlamentares = parlamentares;
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
