import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Ator } from '../models/ator.model';
import { AtorAgregado } from '../models/atorAgregado.model';

import { environment } from '../../../environments/environment';
import { AtorBancada } from '../models/atorBancada.model';

@Injectable({
  providedIn: 'root'
})
export class AtorService {

  private atorUrl = `${environment.baseUrl}/ator`;
  private atoresUrl = `${environment.baseUrl}/atores`;

  constructor(
    private http: HttpClient) { }

  getAtor(interesse: string, idAtor: string): Observable<Ator> {
    return this.http.get<Ator>(`${this.atorUrl}/${idAtor}?interesse=${interesse}`);
  }

  getAtoresAgregados(interesse: string, tema: string): Observable<AtorAgregado[]> {
    return this.http.get<AtorAgregado[]>(`${this.atoresUrl}/agregados?interesse=${interesse}&tema=${tema}`);
  }

  getAtoresAgregadosByID(idAutor: number, interesse: string, tema: string): Observable<any[]> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema);
    return this.http.get<any[]>(`${this.atoresUrl}/agregados/${idAutor}`, { params });
  }

  getAtoresBancadas(): Observable<AtorBancada[]> {
    return this.http.get<AtorBancada[]>(`${this.atoresUrl}/bancadas`);
  }

}
