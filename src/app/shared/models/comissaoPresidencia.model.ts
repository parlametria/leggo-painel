
export interface ComissaoPresidencia {
  id_comissao: number;
  id_autor: number;
  id_autor_voz: number;
  info_comissao: string;
  quantidade_comissao_presidente: number;
  tramitou_agenda: boolean;
}

export interface ComissoesCargo {
  id_parlamentar_voz: string;
  casa: string;
  parlamentarComissoes: any[];
}
