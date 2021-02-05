import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Evento } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private eventosUrl = `${environment.baseUrl}/eventos_tramitacao`;

  constructor(private http: HttpClient) { }

  getEventosTramitação(idLeggo: string, interesse: string, dataInicial: string, dataFinal: string): Observable<Evento[]> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('data_inicial', dataInicial)
      .set('data_final', dataFinal);
    return this.http.get<any>(`${this.eventosUrl}/eventos_tramitacao/${idLeggo}`, { params });
  }
}
