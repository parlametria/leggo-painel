import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
        this.eventosPrincipais = eventos.filter(e => (typeof e.titulo_evento !== 'undefined' && e.titulo_evento !== 'nan'));
        this.eventosSecundarios = eventos.filter(e => (typeof e.titulo_evento === 'undefined' || e.titulo_evento === 'nan'));
      });
  }

  dataOnChange(event) {
    this.showMais = false;
    this.filtro = event;
    this.eventosService.pesquisar(event);
  }

  getSemanaString(data) {
    const dataInicial = data.clone().subtract(7, 'days');
    const dataFinal = data.clone();
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
