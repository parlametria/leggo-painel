import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { LocalStorageService } from './local-storage.service';

import { AutenticacaoModel, AuthTokenModel } from 'src/app/shared/models/autenticacao.model';

const STORE_TOKEN_KEY = 'autenticacao';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  private readonly tokenUrl = `${environment.baseUrl}/autenticacao/token/`;
  private readonly refreshTokenUrl = `${this.tokenUrl}/refresh/`;
  private readonly verifyTokenUrl = `${this.tokenUrl}/verify/`;

  private autenticacao = new BehaviorSubject<AutenticacaoModel | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly localStorage: LocalStorageService,
  ) { }

  obterToken(email: string, password: string): Observable<AutenticacaoModel> {
    return this.http.post<AuthTokenModel>(this.tokenUrl, { username: email, password })
      .pipe(
        map(token => {
          const model: AutenticacaoModel = {
            email,
            token
          };

          this.setAutenticacao(model);
          return model;
        })
      );
  }

  verificarToken(model: AutenticacaoModel) {
    return this.http.post(this.verifyTokenUrl, { token: model.token.access })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError({ code: error.status, detail: 'token not valid' });
        })
      );
  }

  atualizarToken(anterior: AutenticacaoModel) {
    type AccessRefresh = {
      access: string;
    };

    return this.http.post<AccessRefresh>(this.refreshTokenUrl, { refresh: anterior.token.refresh })
      .pipe(
        map(refresh => {
          const model: AutenticacaoModel = {
            email: anterior.email,
            token: {
              access: refresh.access,
              refresh: anterior.token.refresh
            }
          };

          this.setAutenticacao(model);
          return model;
        })
      );
  }

  public getAutenticacao() {
    const model = this.localStorage.getItem<AutenticacaoModel>(STORE_TOKEN_KEY);
    const current = this.autenticacao.value;

    if (model === null) {
      this.autenticacao.next(null);
    }

    if (model.token.access !== current?.token.access) {
      this.autenticacao.next(model);
    }

    return this.autenticacao.asObservable();
  }

  public setAutenticacao(model: AutenticacaoModel) {
    this.autenticacao.next(model);
    this.localStorage.setItem(STORE_TOKEN_KEY, model);
  }
}
