import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { EventosService } from 'src/app/shared/services/eventos.service';
import { TwitterService } from 'src/app/shared/services/twitter.service';
import { indicate } from 'src/app/shared/functions/indicate.function';

@Component({
  selector: 'app-temperatura-pressao',
  templateUrl: './temperatura-pressao.component.html',
  styleUrls: ['./temperatura-pressao.component.scss']
})
export class TemperaturaPressaoComponent implements OnInit {

  private unsubscribe = new Subject();
  public idLeggo: string;
  public isLoading = new BehaviorSubject<boolean>(true);

  public eventosPrincipais;
  public eventosSecundarios;
  public filtro;
  public showMais = false;
  public infoTwitter;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private eventosService: EventosService,
    private twitterService: TwitterService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idLeggo = params.get('id_leggo');
        if (this.idLeggo !== undefined) {
          this.getEventos(this.idLeggo);
          this.getTweetRawInfo();
        }
      });
  }

  getEventos(idLeggo) {
    this.eventosService.getEventosTramitacao(idLeggo, 'reforma-tributaria')
      .pipe(indicate(this.isLoading))
      .subscribe(eventos => {
        this.eventosPrincipais = eventos;
      });
  }

  dataOnChange(event) {
    this.showMais = false;
    this.filtro = event;
    this.eventosService.pesquisar(event);
  }

  getSemanaString(data) {
    const dataInicial = data.clone();
    const dataFinal = data.clone().add(7, 'days');
    return `${dataInicial.format('D')} de ${dataInicial.format('MMM')} a
      ${dataFinal.format('D')} de ${dataFinal.format('MMM')}`;
  }

  getTextoEvento(evento) {
    if (typeof evento.titulo_evento !== 'undefined' && evento.titulo_evento !== 'nan') {
      return evento.titulo_evento;
    } else if (typeof evento.texto_tramitacao !== 'undefined') {
      return evento.texto_tramitacao.split('.')[0] + '...';
    }
    return '';
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  toggleShowMais() {
    this.showMais = !this.showMais;
  }

  getTweetRawInfo() {
    this.twitterService.getTweetRawInfo()
    .pipe(indicate(this.isLoading))
    .subscribe(data => {
      this.infoTwitter = data;
    });
  }

}
