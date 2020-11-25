import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  getPressaoList(interesse: string, id: string): Observable<Pressao[]> {
    return this.http.get<Pressao[]>(`${this.pressaoUrl}/${id}/?interesse=${interesse}`);
  }

  getUltimaPressaoProposicoes(interesse: string): Observable<UltimaPressaoProposicao[]> {
    return this.http.get<UltimaPressaoProposicao[]>(`${this.pressaoUrl}/ultima?interesse=${interesse}`);
  }
}
