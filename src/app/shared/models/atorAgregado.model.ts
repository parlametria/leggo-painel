export interface AtorAgregado {
  id_autor: number;
  id_autor_parlametria: number;
  nome_autor: string;
  partido: string;
  uf: string;
  peso_documentos: number;
  atividade_parlamentar: number;
  atividade_twitter: number;
  quantidade_autorias: number;
  quantidade_comissao_presidente: number;
  quantidade_relatorias: number;
  quant_autorias_projetos: number;
  peso_autorias_projetos: number;
  peso_politico: number;
  nome_processado: string;
  indice: number;
  casa_autor: string;
  quantidade_tweets: number;
  governismo: number;
  interesse: string;
  parlamentarComissoes: any[];
}
