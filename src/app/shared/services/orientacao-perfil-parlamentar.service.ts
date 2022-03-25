import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export type OrientacaoPerfilParlamentar = {
  idPartido: number;
  sigla: string;
  orientacoes: any;
};

@Injectable({
  providedIn: 'root'
})
export class OrientacaoPerfilParlamentarService {
  private url = environment.perfilUrl + '/orientacoes';

  constructor(private http: HttpClient) { }

  getOrientacoesGoverno(): Observable<OrientacaoPerfilParlamentar> {
    return this.http
      .get<OrientacaoPerfilParlamentar>(this.url + '/governo');
  }
}
