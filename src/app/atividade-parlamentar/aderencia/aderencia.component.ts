import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';



import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AderenciaService } from 'src/app/shared/services/aderencia.service';
import { ParlamentarAderencia } from '../../shared/models/parlamentarAderencia.model';
import { VotacaoService } from 'src/app/shared/services/votacao.service';
import { CasaService } from 'src/app/shared/services/casa.service';

@Component({
  selector: 'app-aderencia',
  templateUrl: './aderencia.component.html',
  styleUrls: ['./aderencia.component.scss'],
})
export class AderenciaComponent implements OnInit, OnDestroy {
  readonly VIEW_ARC = 'arc';
  readonly VIEW_BEE = 'bee';
  readonly VIEW_SM = 'sm';
  readonly VIEW_MD = 'md';
  readonly VIEW_LG = 'lg';
  readonly FILTRO_PADRAO_TEMA = -1;
  readonly ID_TEMA_GERAL = 99;

  parlamentares: ParlamentarAderencia[];
  parlamentaresCompleto: ParlamentarAderencia[];
  parlamentaresCasa: ParlamentarAderencia[];

  filtro: any;
  orientador: 'Governo' | 'Partido';
  casa: 'senado' | 'camara';
  view: 'arc' | 'bee';
  orderBy: string;
  isLoading: boolean;
  countVotacoes: number;
  tema: string;
  displayGraph: boolean;
  graphTitle: 'Governismo' | 'Disciplina Partidária';

  private unsubscribe = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private aderenciaService: AderenciaService,
    private votacaoService: VotacaoService,
    private casaService: CasaService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) {
    this.filtro = { tema: this.FILTRO_PADRAO_TEMA, orientador: 'Governo' };
  }

  get totalParlamentaresCasa() {
    if (!this.parlamentaresCasa) {
      return 0;
    }

    return this.parlamentaresCasa.length;
  }

  ngOnInit() {
    this.isLoading = true;
    this.displayGraph = true;
    this.updateParamsViaUrl();

    this.orientador = 'Governo';
    this.graphTitle = 'Governismo';
    this.casa = 'senado';
    this.view = 'arc';
    this.tema = String(this.FILTRO_PADRAO_TEMA);

    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        const view = params.get('view');
        this.view = view === this.VIEW_ARC || view === this.VIEW_BEE ? view : this.VIEW_ARC;
      });

    this.casaService.set(this.casa);
    // this.getParlamentaresPorCasa();
    this.getCountVotacoes(this.tema);
    this.getParlamentares();
    this.getAderencia();
  }

  casaChanged(newCasa: string) {
    this.casa = (newCasa.toLocaleLowerCase()) as 'senado' | 'camara';
    this.casaService.set(this.casa);
    this.getParlamentaresPorCasa();
    this.getCountVotacoes(this.tema);
    this.setView(this.view);
  }

  orientadorChanged(newOrientador: string) {
    this.orientador = newOrientador as 'Governo' | 'Partido';
    this.graphTitle = newOrientador === 'Governo' ? 'Governismo' : 'Disciplina Partidária';
    this.casaService.set(this.casa);
    this.aderenciaService.setOrientador(this.orientador);
    this.filtro = {...this.filtro, orientador: this.orientador};

    this.getParlamentares();
    this.getAderencia();
    this.getCountVotacoes(this.tema);
  }

  toggleViewMore() {
    this.displayGraph = !this.displayGraph;
  }

  getParlamentares() {
    this.aderenciaService
      .getAderencia()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentares => {
          this.parlamentares = parlamentares;
        },
        error => console.log(error)
      );
  }

  getAderencia() {
    this.aderenciaService
      .getAderenciaAsObservable()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentares => {
          let idTema = this.filtro.tema;

          if (this.filtro.tema === this.FILTRO_PADRAO_TEMA) {
            idTema = this.ID_TEMA_GERAL;
          }

          this.parlamentaresCompleto = parlamentares.sort((a, b) => {
            return this.aderenciaService.sort(a, b, idTema);
          });

          this.getParlamentaresPorCasa();
        }
      );
  }

  getCountVotacoes(tema: string) {
    const idTema = +tema;
    this.votacaoService
      .getCountVotacoesPorTema(this.casa)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(countVotacaoTemas => {
        if (idTema === this.FILTRO_PADRAO_TEMA) {
          this.countVotacoes = countVotacaoTemas[this.ID_TEMA_GERAL];
        } else {
          this.countVotacoes = countVotacaoTemas[idTema];
        }
      });
  }

  getParlamentaresPorCasa(): void {
    if (this.parlamentaresCompleto !== undefined && this.parlamentaresCompleto) {
      this.parlamentaresCasa = this.parlamentaresCompleto.filter(p => {
        return (p.casa === this.casa);
      });
    }
  }

  search(filter: any) {
    this.filtro = JSON.parse(JSON.stringify(filter));
    this.filtro.orientador = this.orientador;
    this.filtro.orderBy = this.orderBy;
    this.getCountVotacoes(this.filtro.tema);

    this.aderenciaService.search(this.filtro, this.orderBy);
  }

  getVisaoPlenario() {
    return (this.view === 'arc' || this.view === 'bee');
  }

  setView(view: string) {
    this.view = view === this.VIEW_ARC || view === this.VIEW_BEE ? view : this.VIEW_ARC;
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.view = view;

    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams });

    this.cdr.detectChanges();
  }

  setChartVisibility(isFinished: boolean) {
    this.isLoading = !isFinished;
  }

  setOrderBy(orderBy: string) {
    this.orderBy = orderBy;
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.orderBy = orderBy;

    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams });

    this.cdr.detectChanges();

    this.search(this.filtro);
  }

  toggleOrderBy() {
    if (this.orderBy === 'DESC') {
      this.setOrderBy('ASC');
    } else {
      this.setOrderBy('DESC');
    }
  }

  getNomeCasa(casa: string, preposicao: boolean): string {
    return this.casaService.getNomeCasa(casa, preposicao);
  }

  updateParamsViaUrl() {
    this.activatedRoute.queryParams.subscribe(
      param => {
        if (param.view !== undefined) {
          this.view = param.view;
        } else {
          this.view = this.VIEW_ARC;
        }

        if (param.orderBy !== undefined) {
          this.setOrderBy(param.orderBy);
        } else {
          this.orderBy = 'DESC';
        }
      }
    );
  }

  isActive(casa: string) {
    return this.router.url.split(/\/|\?/)[2] === casa;
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'Sobre' });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
