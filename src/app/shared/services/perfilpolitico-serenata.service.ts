import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CandidatoSerenata } from 'src/app/shared/models/candidato-serenata';

@Injectable({
  providedIn: 'root'
})
export class PerfilpoliticoSerenataService {
  private readonly baseUrl = 'https://api-perfilpolitico.serenata.ai/api';

  constructor(private http: HttpClient) { }

  getCandidato(idPerfilPolitico: string) {
    return this.http.get<CandidatoSerenata>(`${this.baseUrl}/candidate/${idPerfilPolitico}/`);
  }
}
