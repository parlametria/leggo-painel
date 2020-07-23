import { ComissaoPresidencia } from './comissaoPresidencia.model';
import { Autoria } from './autoria.model';

export interface AtorDetalhado {
    id_autor: number;
    id_autor_parlametria: number;
    nome_autor: string;
    partido: string;
    uf: string;
    casa_autor: string;
    bancada: string;
    peso_politico: number;
    urlFoto: string;
    relatorias: Array<any>;
    comissoes: ComissaoPresidencia;
    autorias: Autoria[];
}
