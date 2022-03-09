import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ComissaoPresidencia, ComissoesCargo } from '../models/comissaoPresidencia.model';
import { ParlamentarComissao } from '../../shared/models/parlamentarComissao.model';
import { Comissao } from '../models/comissao.model';
import { Lideranca } from '../models/lideranca.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ComissaoService {
  private comissaoUrl = `${environment.baseUrl}/comissao/presidencia`;
  private comissaoUrlPerfil = `${environment.perfilUrl}/comissoes`;

  constructor(private http: HttpClient) { }

  getComissaoPresidenciaLeggo(interesse: string, tema: string, destaque: boolean): Observable<ComissaoPresidencia[]> {
    return this.http.get<ComissaoPresidencia[]>(`${this.comissaoUrl}?interesse=${interesse}&tema=${tema}&destaque=${destaque}`);
  }

  getComissaoDetalhadaByIdLeggo(interesse: string, idAutor: string, tema: string, destaque: boolean): Observable<ComissaoPresidencia[]> {
    return this.http.get<ComissaoPresidencia[]>(`${this.comissaoUrl}/${idAutor}?interesse=${interesse}&tema=${tema}&destaque=${destaque}`);
  }

  getComissaoPresidencia(): Observable<ComissoesCargo[]> {
    return this.http.get<ComissoesCargo[]>(`${this.comissaoUrlPerfil}/presidentes`);
  }

  getComissaoDetalhadaById(idParlamentar: string): Observable<ComissoesCargo[]> {
    return this.http.get<ComissoesCargo[]>(`${this.comissaoUrlPerfil}/presidentes/${idParlamentar}`);
  }

  getComissoes(casa: string): Observable<Comissao[]> {
    const params = new HttpParams()
      .set('casa', casa);
    return this.http.get<Comissao[]>(this.comissaoUrlPerfil, { params });
  }

  getCargos(casa: string): Observable<Lideranca[]> {
    const params = new HttpParams()
      .set('casa', casa);
    return this.http.get<Lideranca[]>(this.comissaoUrlPerfil + '/cargos', { params });
  }

  /**
   * A partir da casa (camara ou senado) e da sigla da Comissão, lista os parlamentares
   * que fazem parte da Comissão com informações como cargo e situação.
   */
  getParlamentaresComissao(casa: 'senado' | 'camara', sigla: string) {
    // http://localhost:8000/comissao/senado/CAE
    const URL = environment.baseUrl + '/comissao/' + casa + '/' + sigla;

    return this.http.get<ParlamentarComissao[]>(URL);
  }
}
