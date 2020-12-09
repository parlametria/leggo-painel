import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';
import { ProposicaoComMaisTweets } from 'src/app/shared/models/proposicaoComMaisTweets.model';
import { TwitterService } from 'src/app/shared/services/twitter.service';

@Component({
  selector: 'app-vis-proposicoes-com-mais-tweets',
  templateUrl: './vis-proposicoes-com-mais-tweets.component.html',
  styleUrls: ['./vis-proposicoes-com-mais-tweets.component.scss']
})
export class VisProposicoesComMaisTweetsComponent implements OnInit {

  @Input() id: string;
  @Input() tema: string;
  @Input() interesse: string;

  public proposicaoComMaisTweets: any[];
  private dataInicial = moment().subtract(1, 'years').format('YYYY-MM-DD');
  private dataFinal = moment().format('YYYY-MM-DD');

  public maxComentariosPeriodo: number;
  public minComentariosPeriodo: number;

  constructor(
    private twitterService: TwitterService,
  ) { }

  ngOnInit(): void {
    this.getProposicoesComMaiTweetsUltimosTresMeses();
    this.getNumTweetsNormalizado();
  }

  getProposicoesComMaiTweetsUltimosTresMeses() {
    const tema = '';
    const qtd = '3';
    this.twitterService.getProposicoesComMaisTweets(
      this.interesse, tema, this.dataInicial, this.dataFinal, this.id, qtd
    ).subscribe(proposicoes => {
      this.proposicaoComMaisTweets = proposicoes;
    });
  }

  getNumTweetsNormalizado() {
    this.twitterService.getProposicoesComMaisTweetsPeriodo(this.interesse, this.dataInicial, this.dataFinal).subscribe(
      tweetsPeriodo => {
        this.maxComentariosPeriodo = tweetsPeriodo[0].num_tweets;
        this.minComentariosPeriodo = tweetsPeriodo.slice(-1)[0].num_tweets;
      }
    );
  }

  public normalizarComentariosNoTwitterPorPeriodo(numTweets: number) {
    return this.normalizar(numTweets, this.minComentariosPeriodo, this.maxComentariosPeriodo);
  }

  public normalizar(metrica: number, min: number, max: number): number {
    return (metrica - min) / (max - min);
  }

}
