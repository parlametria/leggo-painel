import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Ator } from '../models/ator.model';
import { AutoriaAgregada } from '../models/autoriaAgregada.model';
import { AtorAgregado } from '../models/atorAgregado.model';
import { Proposicao } from '../models/proposicao.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtorService {

  private atorUrl = `${environment.baseUrl}/atores`;
  private autoriaUrl = `${environment.baseUrl}/autorias`;

  constructor(private http: HttpClient) { }

  private getProposicoes(): Observable<Proposicao[]> {
    return this.http.get<Proposicao[]>(`${environment.baseUrl}/proposicoes`);
  }

  getAtores(): any[] {
    const proposicoes: any = this.getProposicoes();
    const atores = [];
    proposicoes.forEach(proposicao => {
        atores.push(this.http.get<Ator>(`${this.atorUrl}/${proposicao.id_leggo}`));
    });
    return atores;
  }

  getAtoresAgregados(): Observable<AtorAgregado[]> {
    return this.http.get<AtorAgregado[]>(this.atorUrl + '/agregados');
  }

  getAutoriasAgregadas(): Observable<AutoriaAgregada[]> {
    return this.http.get<AutoriaAgregada[]>(this.autoriaUrl + '/agregadas');
  }

}
