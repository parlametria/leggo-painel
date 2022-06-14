export interface UsuarioModel {
  id?: number;
  email: string;
  password?: string;
  primeiro_nome: string;
  ultimo_nome: string;
  empresa?: string;
}

export interface UsuarioBase {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
}

export interface UsuarioApiModel {
  empresa: string;
  usuario: UsuarioBase;
}

export interface VerificacaoEmailModel {
  token: string;
  usuario: number;
  verificado: boolean;
}
