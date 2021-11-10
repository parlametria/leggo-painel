import { AfterContentInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { BehaviorSubject, Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { ProposicoesListaService } from '../shared/services/proposicoes-lista.service';
import { InteresseService } from '../shared/services/interesse.service';
import { ProposicaoLista } from '../shared/models/proposicao.model';
import { Interesse } from '../shared/models/interesse.model';
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
  interesseModel: Interesse;
  proposicoes: ProposicaoLista[];
  tema: string;
  proposicoesDestaque: ProposicaoLista[];
  proposicoesSemDestaque: ProposicaoLista[];
  proposicoesIniciadora: ProposicaoLista[];
  proposicoesRevisora: ProposicaoLista[];
  proposicoesSancao: ProposicaoLista[];
  orderByProp: string;
  public PROPOSICOES_POR_PAGINA = 10;
  p = 1;

  constructor(
    private proposicoesListaService: ProposicoesListaService,
    private interesseService: InteresseService,
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
        this.getInteresse(this.interesse);
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

  getInteresse(interesseArg: string) {
    this.interesseService
      .getInteresse(interesseArg)
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.interesseModel = data[0];
        this.isLoading.next(false);
      });
  }

  getProposicoes(interesse: string) {
    this.proposicoesListaService.getProposicoes(interesse)
      .pipe(
        skip(1),
        indicate(this.isLoading),
        takeUntil(this.unsubscribe)
      ).subscribe(proposicoes => {
        this.proposicoes = proposicoes;
        this.proposicoesDestaque = proposicoes.filter(p => (p.isDestaque && p.apensadas.length < 1));
        this.proposicoesSemDestaque = proposicoes.filter(p => (!p.isDestaque || p.apensadas.length > 0));
        this.proposicoesIniciadora = proposicoes.filter(p => (p.fase === 'Iniciadora' && p.isDestaque)).slice(0, 25);
        this.proposicoesRevisora = proposicoes.filter(p => (p.fase === 'Revisora' && p.isDestaque)).slice(0, 25);
        this.proposicoesSancao = proposicoes.filter(p => (p.fase === 'Sanção/Veto' && p.isDestaque)).slice(0, 25);

        if (proposicoes.length <= (this.PROPOSICOES_POR_PAGINA * (this.p - 1))) {
          this.pageChange(1); // volta para a primeira página com o novo resultado do filtro
        }

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

  getProposicaoCriteriosDestaque(destaques: any) {
    const destaquesCriterios = {
      'criterio_aprovada_em_uma_casa': 'Aprovada em uma Casa',
      'criterio_avancou_comissoes': 'Avançou em comissões',
      'criterio_req_urgencia_apresentado': 'Requerimento de Urgência Apresentado',
      'criterio_req_urgencia_aprovado': 'Requerimento de Urgência Aprovado',
    };
    if (!destaques) {
      return '';
    }
    let criterios = [];
    Object.keys(destaquesCriterios).forEach((key) => {
      if (destaques[key]) {
        criterios.push(destaquesCriterios[key]);
      }
    });
    return criterios.join(' - ');
  }

  onChangePerPage(value: string) {
    this.PROPOSICOES_POR_PAGINA = Number(value);
    this.pageChange(1);
  }

  private replaceUndefined(termo) {
    return termo === undefined ? '' : termo;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
