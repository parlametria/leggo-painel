export interface UsuarioModel {
  id?: number;
  email: string;
  password?: string;
  primeiro_nome: string;
  ultimo_nome: string;
  empresa?: string;
}
