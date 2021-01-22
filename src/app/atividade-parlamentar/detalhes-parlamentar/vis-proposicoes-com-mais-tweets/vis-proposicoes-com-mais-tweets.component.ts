import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  @Input() tema = '';
  @Input() interesse: string;
  @Input() destaque: boolean;

  public proposicoesComMaisTweets: ProposicaoComMaisTweets[];
  private dataInicial = '2019-01-01';
  private dataFinal = moment().format('YYYY-MM-DD');
  private qtd = '3';
  public maxComentariosPeriodo;
  public minComentariosPeriodo;

  constructor(
    private activatedRoute: ActivatedRoute,
    private twitterService: TwitterService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
    .subscribe(params => {
      this.tema = params.tema;
      this.destaque = this.tema === 'destaque';
      this.tema === undefined || this.destaque ? this.tema = '' : this.tema = this.tema;
      this.getProposicoes();
    });
  }

  getProposicoes() {
    this.twitterService.getProposicoesComMaisTweets(
      this.interesse, this.tema, this.dataInicial, this.dataFinal, this.id, this.qtd, this.destaque)
      .subscribe(proposicoes => {
        this.proposicoesComMaisTweets = proposicoes;
        this.minComentariosPeriodo = 0;
        this.maxComentariosPeriodo = this.proposicoesComMaisTweets.reduce((min, p) => {
          return p.num_tweets < min ? p.num_tweets : min;
        }, this.proposicoesComMaisTweets[0].num_tweets);
      });
  }

}
