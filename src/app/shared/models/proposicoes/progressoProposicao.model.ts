export interface ProgressoProposicao {
  id_leggo: string;
  fase_global: string;
  fase_global_local?: string;
  local: string;
  data_inicio: Date;
  data_fim: Date;
  local_casa: string;
  pulou: string;
  is_mpv: boolean;
}
