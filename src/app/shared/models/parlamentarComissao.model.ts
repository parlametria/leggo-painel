export interface ParlamentarComissao {
  cargo: string;
  id_parlamentar: string;
  partido: string;
  uf: string;
  situacao: string;
  nome: string;
  foto: string;
  sigla: string;
  casa: 'senado' | 'camara';
}
