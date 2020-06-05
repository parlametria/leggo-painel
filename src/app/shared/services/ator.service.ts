import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import 'rxjs/add/observable/from';

import { Ator } from '../models/ator.model';
import { Proposicao } from '../models/proposicao.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtorService {

  private atorUrl = `${environment.baseUrl}/atores`;

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
}
