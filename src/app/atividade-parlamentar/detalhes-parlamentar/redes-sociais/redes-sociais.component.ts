import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

import { TwitterService } from 'src/app/shared/services/twitter.service';
import { AtorTwitter } from 'src/app/shared/models/atorTwitter.model';
import { Tweet } from 'src/app/shared/models/tweet.model';

@Component({
  selector: 'app-redes-sociais',
  templateUrl: './redes-sociais.component.html',
  styleUrls: ['./redes-sociais.component.scss']
})
export class RedesSociaisComponent implements OnInit {

  readonly NUMERO_TWEETS = 5;

  private unsubscribe = new Subject();
  public idAtor: string;
  public interesse: string;
  public tema: string;
  public parlamentar: AtorTwitter;
  public tweets: Tweet[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private twitterService: TwitterService,
  ) { }

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
      this.tema === undefined ? this.tema = '' : this.tema = this.tema;
      this.resgataTwitter(this.interesse, this.tema, this.idAtor);
    });
  }

  private resgataTwitter(interesse, tema, idAtor) {
    forkJoin([
      this.twitterService.getUsernameTwitter(idAtor),
      this.twitterService.getAtividadeDetalhadaTwitter(idAtor, interesse , tema),
      this.twitterService.getTweetsParlamentar(idAtor, interesse, tema, this.NUMERO_TWEETS)
    ])
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(data => {
      this.parlamentar = data[0];
      this.parlamentar.id_autor_parlametria = data[1].id_parlamentar_parlametria;
      this.parlamentar.quantidadeTweets = data[1].atividade_twitter;

      this.tweets = data[2];
    });
  }

}
