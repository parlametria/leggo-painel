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
  ativo: string;
  opcoesOrdenacao: any = [
    'Mais ativos no congresso',
    // 'Mais ativos no Twitter',
    // 'Mais papéis importantes',
    // 'Maior peso político'
  ];

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
        this.ativo = params.ativo;
        this.tema === undefined ? this.tema = '' : this.tema = this.tema;
        this.casa === undefined ? this.casa = '' : this.casa = this.casa;
        this.ativo === undefined ? this.ativo = '' : this.ativo = this.ativo;
        this.getDadosAtividadeParlamentar();
      });
    this.updatePageViaURL();
  }

  ngAfterContentInit() {
    this.cdRef.detectChanges();
  }

  getDadosAtividadeParlamentar() {
    this.parlamentaresService.getParlamentares(this.interesse, this.tema, this.casa)
      .pipe(
        skip(1),
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(parlamentares => {
        this.parlamentares = parlamentares;
        if (this.ativo === 'twitter') {
          this.parlamentares.sort((a, b) => {
            if (isNaN(b.atividade_twitter)) {
              return -1;
            }

            if (isNaN(a.atividade_twitter)) {
              return 1;
            }

            return b.atividade_twitter - a.atividade_twitter;
          });
        } else {
          this.parlamentares.sort((a, b) => {
            if (isNaN(b.atividade_parlamentar)) {
              return -1;
            }

            if (isNaN(a.atividade_parlamentar)) {
              return 1;
            }

            return b.atividade_parlamentar - a.atividade_parlamentar;
          });
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
