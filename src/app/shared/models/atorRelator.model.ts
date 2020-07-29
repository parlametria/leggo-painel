export interface AtorRelator {
    autor_id: number;
    autor_id_parlametria: number;
    quantidade_relatorias: number;
    relatorias: Relatorias[];
}

export interface Relatorias {
    id_leggo: number;
    sigla: string;
}
