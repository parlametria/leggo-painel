import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Pressao } from '../models/pressao.model';
import { environment } from 'src/environments/environment';
import { UltimaPressaoProposicao } from '../models/proposicoes/ultimaPressaoProposicao.model';

@Injectable({
  providedIn: 'root'
})
export class PressaoService {

  private pressaoUrl = `${environment.baseUrl}/pressao`;

  constructor(private http: HttpClient) { }

  getPressaoList(interesse: string, id: string, dataInicio, dataFim): Observable<Pressao[]> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('data_inicio', dataInicio)
      .set('data_fim', dataFim);
    return this.http.get<Pressao[]>(`${this.pressaoUrl}/${id}/`, { params });
  }

  getUltimaPressaoProposicoes(interesse: string): Observable<UltimaPressaoProposicao[]> {
    return this.http.get<UltimaPressaoProposicao[]>(`${this.pressaoUrl}/ultima?interesse=${interesse}`);
  }
}
