export interface Autoria {
  id_autor: number;
  id_documento: number;
  id_leggo: number;
  data: string;
  descricao_tipo_documento: string;
  url_inteiro_teor: string;
  tipo_documento: string;
  peso_autor_documento: number;
  quantidade: number;
  sigla: string;
  tipo_acao: string;
}

export interface ArvoreAutorias {
  titulo?: string;
  id?: number;
  data?: string;
  descricao?: string;
  url?: string;
  value?: number;
  children?: ArvoreAutorias[];
  categoria?: string;
  sigla?: string;
}

export interface Coautoria {
  id_autor: number;
  nome: string;
  partido: string;
  uf: string;
  bancada: string;
  nome_eleitoral: string;
  node_size: number;
}

export interface CoautoriaLigacao {
  source: number;
  target: number;
  value: number;
}

