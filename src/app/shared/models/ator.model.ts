
export interface Ator {
  id_autor: number;
  id_ext: number;
  nome_autor: string;
  partido: string;
  uf: string;
  casa: string;
  peso_total_documentos: number;
  num_documentos: number;
  tipo_generico: string;
  sigla_local_formatada: string;
  is_important: boolean;
  nome_partido_uf: string;
  quantidade_relatorias: number;
  ids_relatorias: object;
}
