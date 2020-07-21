export interface Autoria {
  id_autor: number;
  id_documento: number;
  id_leggo: number;
  data: string;
  descricao_tipo_documento: string;
  url_inteiro_teor: string;
  tipo_documento: string;
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
}
