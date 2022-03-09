import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';
import * as moment from 'moment';

import { ModalComponent } from '../shared/components/modal/modal.component';
import { AtorAgregado } from '../shared/models/atorAgregado.model';
import { ParlamentaresService } from '../shared/services/parlamentares.service';
import { InteresseService } from '../shared/services/interesse.service';
import { indicate } from '../shared/functions/indicate.function';

@Component({
  selector: 'app-atividade-parlamentar',
  templateUrl: './atividade-parlamentar.component.html',
  styleUrls: ['./atividade-parlamentar.component.scss']
})
export class AtividadeParlamentarComponent implements OnInit, OnDestroy, AfterContentInit {

  private unsubscribe = new Subject();
  p = 1;
  public readonly PARLAMENTARES_POR_PAGINA = 21;
  public isLoading = new BehaviorSubject<boolean>(true);

  closeResult: string;
  modalOptions: NgbModalOptions;
  interesses: any;
  parlamentares: AtorAgregado[] = [];
  interesse: string;
  tema: string;
  destaque: boolean;
  casa: string;

  constructor(
    private parlamentaresService: ParlamentaresService,
    private interesseService: InteresseService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private router: Router) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    };
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        const pTema = this.replaceUndefined(params.tema);
        const pCasa = ['senado', 'camara'].includes(params.casa) ? params.casa : 'senado';
        const pInteresse = this.replaceUndefined(params.interesse);

        let mudouConsulta = true;

        const checks = [
          this.tema === pTema,
          this.casa === pCasa,
          this.interesse === pInteresse,
          !this.destaque,
          this.parlamentares.length > 0
        ];

        if (checks.every(v => v)) {
          mudouConsulta = false;
        }

        this.tema = pTema === 'destaque' ? '' : pTema;
        this.destaque = pTema === 'destaque';
        this.casa = pCasa;
        this.interesse = pInteresse;

        if (mudouConsulta) {
          this.getDadosAtividadeParlamentar();
        }
      });
    this.interesseService.getInteresses().subscribe(interesses => { this.interesses = interesses; });
    this.updatePageViaURL();
  }

  ngAfterContentInit() {
    this.cdRef.detectChanges();
  }

  getDadosAtividadeParlamentar() {
    const dataInicial = '2019-01-01';
    const dataFinal = moment().format('YYYY-MM-DD');
    // this.parlamentaresService.setOrderBy(this.orderBy);
    this.parlamentaresService.getParlamentares(this.interesse, this.tema, this.casa, dataInicial, dataFinal, this.destaque)
      .pipe(
        skip(1),
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(parlamentares => {
        this.parlamentares = parlamentares;
        //ator agregado
        
        console.log("%c Ator agregado", "font-size: 14px, font: orange;")
        console.log(parlamentares[0])
        console.trace()
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

  open(event) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.carregaVisAtividade(event.parlamentar, this.interesses);
  }

  private replaceUndefined(termo) {
    return termo === undefined ? '' : termo;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
