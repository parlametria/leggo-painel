import { Autoria } from './autoria.model';

export interface AtorDetalhado {
    id_autor: number;
    id_autor_parlametria: number;
    nome_autor: string;
    partido: string;
    uf: string;
    casa_autor: string;
    bancada: string;
    pesoPolitico: number;
    urlFoto: string;
    relatorias: Array<any>;
    comissoes: any[];
    autorias: Autoria[];
    atividadeParlamentar: any;
    atividadeTwitter: any;
    total_peso_autorias: number;
}
