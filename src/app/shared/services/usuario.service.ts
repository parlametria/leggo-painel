import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { UsuarioModel, UsuarioApiModel } from 'src/app/shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly usuariosUrl = `${environment.baseUrl}/usuarios/`;

  constructor(
    private http: HttpClient) { }

  criarNovoUsuario(dados: UsuarioModel) {
    const criacaoPostData = {
      empresa: dados.empresa,
      usuario: {
        email: dados.email,
        first_name: dados.primeiro_nome,
        last_name: dados.ultimo_nome,
        password: dados.password,
      }
    };

    return this.http.post<UsuarioApiModel>(this.usuariosUrl, criacaoPostData);
  }
}
