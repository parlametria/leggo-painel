import { ProgressoProposicao } from './proposicoes/progressoProposicao.model';

interface InteresseProposicao {
  interesse: string;
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
  casa: string;
  sigla: string;
  data_apresentacao: string;
  regime_tramitacao: string;
  forma_apreciacao: string;
  ementa: string;
  url: string;
  relatoria: any;
  comissoes_passadas: string[];
  resumo_tramitacao: TramitacaoProposicao[];
  status: string;
}

interface Apensada {
  id_leggo_principal: string;
  interesse_principal: string;
  id_ext_principal: number;
  casa_principal: string;
  proposicao_principal: any;
}

export interface LocalProposicao {
  casa_ultimo_local: string;
  data_ultima_situacao: Date;
  nome_ultimo_local: string;
  sigla_ultimo_local: string;
  tipo_local: string;
}

export interface Proposicao {
  id: number;
  interesse: InteresseProposicao[];
  id_leggo: string;
  autoresProposicao: AutoresProposicao[];
  etapas: EtapasProposicao[];
  sigla_camara: string;
  sigla_senado: string;
  destaques: any;
  locaisProposicao: LocalProposicao[];
}

export interface ProposicaoLista {
  interesse: InteresseProposicao[];
  id_leggo: string;
  etapas: EtapasProposicao[];
  sigla_camara: string;
  sigla_senado: string;
  ultima_temperatura: number;
  temp_quinze_dias: number;
  ultima_pressao: number;
  pressao_oito_dias: number;
  anotacao_data_ultima_modificacao: Date;
  resumo_progresso: ProgressoProposicao[];
  destaques: any;
  max_temperatura_interesse: number;
  isDestaque: boolean;
  locaisProposicao: LocalProposicao[];
  apensadas: Apensada[];
  fase: string;
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
