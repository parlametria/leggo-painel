import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { AutenticacaoModel, AuthTokenModel } from 'src/app/shared/models/autenticacao.model';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  private readonly tokenUrl = `${environment.baseUrl}/autenticacao/token/`;
  private readonly refreshTokenUrl = `${this.tokenUrl}/refresh/`;
  private readonly verifyTokenUrl = `${this.tokenUrl}/verify/`;

  constructor(
    private http: HttpClient) { }

  obterToken(email: string, password: string): Observable<AutenticacaoModel> {
    return this.http.post<AuthTokenModel>(`${this.tokenUrl}`, { email, password })
      .pipe(
        map(token => ({
          email,
          token
        }))
      );
  }
}
