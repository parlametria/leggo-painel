import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Ator } from '../models/ator.model';
import { AtorAgregado } from '../models/atorAgregado.model';
import { Autoria } from '../models/autoria.model';

import { environment } from '../../../environments/environment';
import { ProposicoesService } from './proposicoes.service';

@Injectable({
  providedIn: 'root'
})
export class AtorService {

  private atorUrl = `${environment.baseUrl}/ator`;
  private atoresUrl = `${environment.baseUrl}/atores`;

  constructor(
    private http: HttpClient,
    private proposicoesService: ProposicoesService) { }

  getAtor(idAtor: string): Observable<Ator> {
    return this.http.get<Ator>(`${this.atorUrl}/${idAtor}`);
  }

  getAtores(): any[] {
    const proposicoes: any = this.proposicoesService.getProposicoes();
    const atores = [];
    proposicoes.forEach(proposicao => {
      atores.push(this.http.get<Ator>(`${this.atoresUrl}/${proposicao.id_leggo}`));
    });
    return atores;
  }

  getAtoresAgregados(interesse: string): Observable<AtorAgregado[]> {
    return this.http.get<AtorAgregado[]>(`${this.atoresUrl}/agregados?interesse=${interesse}`);
  }

}
