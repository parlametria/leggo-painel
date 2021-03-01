import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { TwitterService } from 'src/app/shared/services/twitter.service';
import { indicate } from 'src/app/shared/functions/indicate.function';

import { AtorTwitter } from 'src/app/shared/models/atorTwitter.model';
import { Tweet } from 'src/app/shared/models/tweet.model';
import { InfoTwitter } from 'src/app/shared/models/infoTwitter.model';

@Component({
  selector: 'app-redes-sociais',
  templateUrl: './redes-sociais.component.html',
  styleUrls: ['./redes-sociais.component.scss']
})
export class RedesSociaisComponent implements OnInit, OnDestroy {

  readonly NUMERO_TWEETS = 5;

  private unsubscribe = new Subject();
  public isLoading = new BehaviorSubject<boolean>(true);

  public idAtor: string;
  public interesse: string;
  public tema: string;
  public parlamentar: AtorTwitter;
  public tweets: Tweet[];
  public infoTwitter: InfoTwitter;
  public destaque: boolean;

  readonly TOTAL_PARLAMENTARES = 594;

  constructor(
    private activatedRoute: ActivatedRoute,
    private twitterService: TwitterService,
    config: NgbCarouselConfig
  ) {
    config.interval = 6000;
    config.keyboard = true;
    config.wrap = true;
    config.pauseOnHover = true;
    config.showNavigationArrows = true;
  }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
        this.interesse = params.get('interesse');
      });
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.tema = params.tema;
        this.destaque = this.tema === 'destaque';
        this.tema === undefined || this.destaque ? this.tema = '' : this.tema = this.tema;
        this.resgataTwitter(this.interesse, this.tema, this.idAtor, this.destaque);
      });
  }

  private resgataTwitter(interesse, tema, idAtor, destaque) {
    const dataInicial = '2019-01-01';
    const dataFinal = moment().format('YYYY-MM-DD');
    forkJoin([
      this.twitterService.getUsernameTwitter(idAtor),
      this.twitterService.getAtividadeDetalhadaTwitter(idAtor, interesse, tema, dataInicial, dataFinal, destaque),
      this.twitterService.getTweetsParlamentar(idAtor, interesse, tema, dataInicial, dataFinal, this.NUMERO_TWEETS, destaque),
      this.twitterService.getInfoTwitter()
    ])
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.parlamentar = data[0];
        this.parlamentar.id_autor_parlametria = data[1].id_parlamentar_parlametria;
        this.parlamentar.quantidadeTweets = data[1].atividade_twitter;

        this.tweets = data[2];
        this.infoTwitter = data[3];
        this.isLoading.next(false);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
