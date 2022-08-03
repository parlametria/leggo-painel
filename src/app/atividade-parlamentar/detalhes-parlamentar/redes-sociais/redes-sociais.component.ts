import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';


import { TwitterService } from 'src/app/shared/services/twitter.service';
import { indicate } from 'src/app/shared/functions/indicate.function';

import { ParlamentarPerfil, InfoTweets, Embed, Engajamento, InteresseTweet } from 'src/app/shared/models/tweet.model';
import { Interesse } from 'src/app/shared/models/interesse.model';
import { InteresseService } from 'src/app/shared/services/interesse.service';

@Component({
  selector: 'app-redes-sociais',
  templateUrl: './redes-sociais.component.html',
  styleUrls: ['./redes-sociais.component.scss'],
  providers: [NgbCarouselConfig],
})
export class RedesSociaisComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  public isLoading = new BehaviorSubject<boolean>(true);

  public idAtor: string;
  public interesse: string;
  public tema: string;
  public parlamentarPerfil: ParlamentarPerfil;
  public tweetsList: Array<Embed>;
  public tweetsListInteresse: Array<InteresseTweet>;
  public engajamentoList: Array<Engajamento>;
  public tweetsInfo: InfoTweets;
  public interesseMaiorQtdTweets: number;
  public interesseParam: string;
  public todosInteresses: Interesse[];
  public destaque: boolean;
  public temTweets: boolean;


  constructor(
    private activatedRoute: ActivatedRoute,
    private twitterService: TwitterService,
    private interesseService: InteresseService,
    config: NgbCarouselConfig
  ) {
    config.interval = 6000;
    config.keyboard = true;
    config.wrap = false;
    config.pauseOnHover = true;
    config.showNavigationArrows = true;
    config.showNavigationIndicators = false;
  }
  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
      });

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.interesse = params.interesse;
        this.tema = params.tema;
        this.destaque = this.tema === 'destaque';
        this.tema === undefined || this.destaque ? this.tema = '' : this.tema = this.tema;
        this.processaParlamentar();
        this.interesseParam = params.interesse ?? 'todos';
      });


  }

  private processaParlamentar() {
    forkJoin([
      this.twitterService.getAtividade(this.idAtor),
      this.interesseService.getInteresses(),
      this.twitterService.getTweetsInfo(),

    ]).pipe(
      indicate(this.isLoading),
      takeUntil(this.unsubscribe)
    ).subscribe(data => {
      this.parlamentarPerfil = data[0];
      this.todosInteresses = data[1];
      this.tweetsInfo = data[2];
      this.processaTweets(data[0]);
    });

  }


  private processaTweets(parlamentar: ParlamentarPerfil) {
    if (!parlamentar) {
      this.temTweets = false;
      this.isLoading.next(false);
      return;
    }
    forkJoin([
      this.twitterService.getEngajamentoParlamentar(this.parlamentarPerfil),
      this.twitterService.getTweetsInteresse(this.parlamentarPerfil),

    ]).pipe(
      indicate(this.isLoading),
      takeUntil(this.unsubscribe)
    ).subscribe(data => {
      this.engajamentoList = data[0];
      this.tweetsListInteresse = data[1];
      this.processaInteresseQtdTweets(data[1]);
      this.temTweets = data[1].length === 0 ? false : true;
      this.isLoading.next(false);
    }
    );
  }

  private processaInteresseQtdTweets(tweets: Array<InteresseTweet>) {
    this.interesseMaiorQtdTweets = 0;
    tweets.map(tweet => {
      if (tweet.tweets.length > this.interesseMaiorQtdTweets) {
        this.interesseMaiorQtdTweets = tweet.tweets.length;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
