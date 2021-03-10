export interface Evento {
    data: Date;
    sigla_local: string;
    evento: string;
    titulo_evento: string;
    texto_tramitacao: string;
    status: string;
    proposicao_id: string;
    nivel: number;
    temperatura_evento: number;
    temperatura_local: number;
}
