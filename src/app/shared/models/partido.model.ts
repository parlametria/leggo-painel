export interface Partido {
  idPartido: number;
  sigla: string;
}

export interface ComissaoInfo {
  sigla: string;
  nome?: string;
}

export interface ComposicaoComissao {
  idComissaoVoz: string;
  cargo: string;
  infoComissao: ComissaoInfo;
}
