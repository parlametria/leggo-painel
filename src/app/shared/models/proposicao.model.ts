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

interface AutoresProposicao {
  id_leggo: string;
  id_autor_parlametria: number;
  id_autor: number;
  autor: AutorProposicao;
}

interface AutorProposicao {
  nome: string;
  uf: string;
  partido: string;
  is_parlamentar: boolean;
  casa: 'camara' | 'senado';
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
  comissoes_passadas: string[];
  resumo_tramitacao: TramitacaoProposicao[];
  status: string;
}

export interface Proposicao {
  id: number;
  interesse: InteresseProposicao[];
  id_leggo: string;
  autoresProposicao: AutoresProposicao[];
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

export interface TramitacaoProposicao {
  data: string;
  casa: string;
  sigla_local: string;
  local: string;
  evento: string;
  texto_tramitacao: string;
  link_inteiro_teor: string;
}
