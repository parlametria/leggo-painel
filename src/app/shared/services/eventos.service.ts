import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import * as moment from 'moment';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Evento } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private eventosUrl = `${environment.baseUrl}/acoes_legislativas`;
  private eventos = new BehaviorSubject<Array<Evento>>([]);
  private eventosFiltered = new BehaviorSubject<Array<Evento>>([]);
  private filtro = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) {
    this.eventos
      .pipe(
        switchMap(eventos =>
          this.filtro.pipe(
            map(filtro => this.filtrar(eventos, filtro))
          )
        )
      ).subscribe(res => {
        this.eventosFiltered.next(res);
      });
  }

  getEventosTramitacao(idLeggo: string, interesse: string): Observable<Evento[]> {
    const dataFinal = moment().format('YYYY-MM-DD');
    const dataInicial = moment().subtract(3, 'month').format('YYYY-MM-DD');
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('data_inicial', dataInicial)
      .set('data_final', dataFinal);
    this.http.get<Evento[]>(`${this.eventosUrl}/${idLeggo}`, { params }).subscribe(eventos => {
      this.eventos.next(eventos);
    });
    return this.eventosFiltered.asObservable();
  }

  filtrar(eventos, filtro) {
    if (typeof filtro !== 'undefined' && filtro.data) {
      const dataComparativaInicial = filtro.data.clone();
      const dataComparativaFinal = dataComparativaInicial.clone();
      dataComparativaFinal.add(7, 'days');

      const filtrados = eventos.filter(evento => {
        return (moment(evento.data).isSameOrAfter(dataComparativaInicial) && moment(evento.data).isBefore(dataComparativaFinal));
      });
      return filtrados;
    } else {
      return eventos;
    }
  }

  pesquisar(filtro) {
    this.filtro.next(filtro);
  }
}
