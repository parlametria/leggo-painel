import {  SafeHtml } from '@angular/platform-browser';

export interface Tweet {
  created_at: Date;
  id_parlamentar_parlametria: string;
  id_tweet: string;
  interactions: number;
  text: string;
  text_html: string;
  url: string;
}

export interface ParlamentarPerfil{
  entidade: number;
  is_personalidade: boolean;
  name: string;
  twitter_id: string;
}
export interface InfoTweets {
  tweet_mais_novo: Date;
  tweet_mais_antigo: Date;
  numero_total_tweets: number;
  numero_parlamentares_sem_perfil: number;
}

export interface PerfilNaoEncontrado {
  mensagem: string;
  pk: string;
  twitter_id: string;
}

export interface Embed{
  id_author: string;
  id_tweet: string;
  text_html: SafeHtml;
  data_criado: Date;
  likes: number;
  retweets: number;
  resposta: number;
}
