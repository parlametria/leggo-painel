import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Ator } from '../models/ator.model';
import { AutoriaAgregada } from '../models/autoriaAgregada.model';
import { AtorAgregado } from '../models/atorAgregado.model';
import { AtorRelator } from '../models/atorRelator.model';
import { Proposicao } from '../models/proposicao.model';
import { ComissaoPresidencia } from '../models/comissaoPresidencia.model';
import { ParlamentarPesoPolitico } from '../models/parlamentarPesoPolitico.model';

import { environment } from '../../../environments/environment';
import { Autoria } from '../models/autoria.model';

@Injectable({
  providedIn: 'root'
})
export class AtorService {

  private atorUrl = `${environment.baseUrl}/ator`;
  private atoresUrl = `${environment.baseUrl}/atores`;
  private autoriaUrl = `${environment.baseUrl}/autorias`;
  private comissaoUrl = `${environment.baseUrl}/comissao/presidencia/`;
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

  getAtoresRelatores(interesse: string): Observable<AtorRelator[]> {
    return this.http.get<AtorRelator[]>(`${this.atoresUrl}/relatorias?interesse=${interesse}`);
  }

  getAutoriasAgregadas(interesse: string): Observable<AutoriaAgregada[]> {
    return this.http.get<AutoriaAgregada[]>(`${this.autoriaUrl}/agregadas?interesse=${interesse}`);
  }

  getComissaoPresidencia(): Observable<ComissaoPresidencia[]> {
    return this.http.get<ComissaoPresidencia[]>(`${this.comissaoUrl}`);
  }

  getAutoriasAgregadasById(interesse: string, idAutor: number): Observable<AutoriaAgregada[]> {
    return this.http.get<AutoriaAgregada[]>(`${this.autoriaUrl}/agregadas/${idAutor}/?interesse=${interesse}`);
  }

  getPesoPolitico(interesse: string): Observable<ParlamentarPesoPolitico[]> {
    return this.http.get<ParlamentarPesoPolitico[]>(`${this.atoresUrl}/peso_politico/?interesse=${interesse}`);
  }

}
