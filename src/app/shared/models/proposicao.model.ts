import { ProgressoProposicao } from './proposicoes/progressoProposicao.model';

interface InteresseProposicao {
  interesse: string;
  nome_interesse: string;
  temas: string[];
  slug_temas: string[];
  apelido: string;
  advocacy_link: string;
  tipo_agenda: string;
}

interface EtapasProposicao {
  id: number;
  id_ext: number;
  casa: string;
  sigla: string;
  data_apresentacao: string;
  ano: number;
  sigla_tipo: string;
  regime_tramitacao: string;
  forma_apreciacao: string;
  ementa: string;
  url: string;
  casa_origem: string;
  em_pauta: string;
  pauta_historico: any;
  relatoria: any;
}

export interface Proposicao {
  id: number;
  interesse: InteresseProposicao[];
  id_leggo: string;
  etapas: EtapasProposicao[];
  sigla_camara: string;
  sigla_senado: string;
}

export interface ProposicaoLista {
  id: number;
  interesse: InteresseProposicao[];
  id_leggo: string;
  etapas: EtapasProposicao[];
  sigla_camara: string;
  sigla_senado: string;
  ultima_temperatura: number;
  ultima_pressao: number;
  anotacao_data_ultima_modificacao: Date;
  resumo_progresso: ProgressoProposicao[];
}
