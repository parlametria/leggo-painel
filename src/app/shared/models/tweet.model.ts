export interface Tweet {
  created_at: Date;
  id_parlamentar_parlametria: string;
  id_tweet: string;
  interactions: number;
  text: string;
  url: string;
}

export interface ParlamentarPerfil {
  entidade: number;
  is_personalidade: boolean;
  name: string;
  twitter_id: string;
}

export interface PerfilNaoEncontrado {
  mensagem: string;
  pk: string;
  twitter_id: string;
}
