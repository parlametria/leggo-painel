import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import * as moment from 'moment';

import { environment } from '../../../environments/environment';
import { MaximaTemperaturaProposicao } from '../models/proposicoes/maximaTemperaturaProposicao.model';
import { UltimaTemperaturaProposicao } from '../models/proposicoes/ultimaTemperaturaProposicao.model';
import { TemperaturaProposicao } from '../models/proposicoes/temperaturaProposicao.model';

@Injectable({
  providedIn: 'root'
})
export class TemperaturaService {

  private temperaturaUrl = `${environment.baseUrl}/temperatura`;

  constructor(private http: HttpClient) { }

  getMaximaTemperatura(interesse: string): Observable<MaximaTemperaturaProposicao> {
    const hoje = moment().format('YYYY-MM-DD');
    const dataInicio = moment().subtract(3, 'months').format('YYYY-MM-DD');
    const params = new HttpParams()
    .set('interesse', interesse)
    .set('data_inicio', dataInicio)
    .set('data_fim', hoje);
    return this.http.get<MaximaTemperaturaProposicao>(`${this.temperaturaUrl}/max`, { params });
  }

  getUltimasTemperaturas(interesse: string): Observable<UltimaTemperaturaProposicao[]> {
    return this.http.get<UltimaTemperaturaProposicao[]>(`${this.temperaturaUrl}/ultima?interesse=${interesse}`);
  }

  getTemperaturasById(interesse: string, id: string, dataInicio, dataFim): Observable<TemperaturaProposicao[]> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('data_inicio', dataInicio)
      .set('data_fim', dataFim);
    return this.http.get<TemperaturaProposicao[]>(`${this.temperaturaUrl}/${id}/`, { params });
  }
}
