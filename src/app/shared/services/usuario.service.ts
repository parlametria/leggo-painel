import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { UsuarioModel } from 'src/app/shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly usuariosUrl = `${environment.baseUrl}/usuarios/`;

  constructor(
    private http: HttpClient) { }

  criarNovoUsuario(dados: UsuarioModel) {
    return this.http.post<UsuarioModel>(this.usuariosUrl, dados);
  }
}
