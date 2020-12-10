import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { ProposicaoComMaisTweets } from 'src/app/shared/models/proposicaoComMaisTweets.model';
import { TwitterService } from 'src/app/shared/services/twitter.service';

@Component({
  selector: 'app-vis-proposicoes-com-mais-tweets',
  templateUrl: './vis-proposicoes-com-mais-tweets.component.html',
  styleUrls: ['./vis-proposicoes-com-mais-tweets.component.scss']
})
export class VisProposicoesComMaisTweetsComponent implements OnInit {

  @Input() id: string;
  @Input() tema = '';
  @Input() interesse: string;

  public proposicoesComMaisTweets: ProposicaoComMaisTweets[];
  private proposicoesComMaitTweetsPeriodo: ProposicaoComMaisTweets[];
  private dataInicial = moment().subtract(1, 'years').format('YYYY-MM-DD');
  private dataFinal = moment().format('YYYY-MM-DD');
  private qtd = '3';
  public maxComentariosPeriodo;
  public minComentariosPeriodo;
  constructor(
    private twitterService: TwitterService,
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.twitterService.getProposicoesComMaisTweets(this.interesse, this.tema, this.dataInicial, this.dataFinal, this.id, this.qtd),
      this.twitterService.getProposicoesComMaisTweetsPeriodo(this.interesse, this.dataInicial, this.dataFinal),
    ]).subscribe(data => {
      this.proposicoesComMaisTweets = data[0];
      this.proposicoesComMaitTweetsPeriodo = data[1];

      this.maxComentariosPeriodo = this.proposicoesComMaitTweetsPeriodo[0].num_tweets;
      this.minComentariosPeriodo = this.proposicoesComMaitTweetsPeriodo.slice(-1)[0].num_tweets;
    });
  }
}
