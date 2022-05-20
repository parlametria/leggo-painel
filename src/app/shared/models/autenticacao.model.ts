export interface AuthTokenModel {
  refresh: string;
  access: string;
}

export interface AutenticacaoModel {
  email: string;
  token: AuthTokenModel;
}
