import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Entidade } from '../models/entidade.model';

@Injectable({
  providedIn: 'root'
})
export class EntidadeService {

  private entidadeUrl = `${environment.baseUrl}/entidades`;

  constructor(private http: HttpClient) { }

  getParlamentaresExercicio(): Observable<Entidade[]> {
    return this.http.get<Entidade[]>(`${this.entidadeUrl}/parlamentares/exercicio`);
  }

}
