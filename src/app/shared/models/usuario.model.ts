export interface UsuarioModel {
  id?: number;
  email: string;
  password?: string;
  primeiro_nome: string;
  ultimo_nome: string;
  empresa?: string;
}

export interface UsuarioApiModel {
  empresa: string;
  usuario: {
    id?: number;
    email: string;
    first_name: string;
    last_name: string;
    is_active: true,
    is_staff: true
  };
}
