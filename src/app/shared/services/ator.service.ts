import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Ator } from '../models/ator.model';
import { AutoriaAgregada } from '../models/autoriaAgregada.model';
import { AtorAgregado } from '../models/atorAgregado.model';
import { Proposicao } from '../models/proposicao.model';

import { environment } from '../../../environments/environment';
import { Autoria } from '../models/autoria.model';

@Injectable({
  providedIn: 'root'
})
export class AtorService {

  private atorUrl = `${environment.baseUrl}/ator`;
  private atoresUrl = `${environment.baseUrl}/atores`;
  private autoriaUrl = `${environment.baseUrl}/autorias`;

  constructor(private http: HttpClient) { }

  private getProposicoes(): Observable<Proposicao[]> {
    return this.http.get<Proposicao[]>(`${environment.baseUrl}/proposicoes`);
  }

  getAtor(idAtor: string): Observable<Ator> {
    return this.http.get<Ator>(`${this.atorUrl}/${idAtor}`);
  }

  getAutorias(idAtor: string): Observable<Autoria[]> {
    return this.http.get<Autoria[]>(`${this.atorUrl}/${idAtor}/autorias`);
  }

  getAtores(): any[] {
    const proposicoes: any = this.getProposicoes();
    const atores = [];
    proposicoes.forEach(proposicao => {
        atores.push(this.http.get<Ator>(`${this.atoresUrl}/${proposicao.id_leggo}`));
    });
    return atores;
  }

  getAtoresAgregados(interesse: string): Observable<AtorAgregado[]> {
    return this.http.get<AtorAgregado[]>(`${this.atoresUrl}/agregados?interesse=${interesse}`);
  }

  getAutoriasAgregadas(interesse: string): Observable<AutoriaAgregada[]> {
    return this.http.get<AutoriaAgregada[]>(`${this.autoriaUrl}/agregadas?interesse=${interesse}`);
  }

}
