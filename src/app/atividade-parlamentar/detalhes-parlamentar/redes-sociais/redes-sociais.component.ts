import { AfterViewInit, Component, OnDestroy, OnInit, PipeTransform, Pipe } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import * as moment from 'moment';

import { TwitterService } from 'src/app/shared/services/twitter.service';
import { indicate } from 'src/app/shared/functions/indicate.function';

import { AtorTwitter } from 'src/app/shared/models/atorTwitter.model';
import { Tweet, ParlamentarPerfil, InfoTweets, Embed } from 'src/app/shared/models/tweet.model';
import { InfoTwitter } from 'src/app/shared/models/infoTwitter.model';
import { ProposicaoPerfilParlamentar } from 'src/app/shared/services/proposiccoes-perfil-parlamentar.service';
import { Interesse } from 'src/app/shared/models/interesse.model';
import { InteresseService } from 'src/app/shared/services/interesse.service';

declare var twttr: any;

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    // console.log(this.sanitized.bypassSecurityTrustHtml(value))
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-redes-sociais',
  templateUrl: './redes-sociais.component.html',
  styleUrls: ['./redes-sociais.component.scss'],
  providers: [NgbCarouselConfig],
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
  public parlamentarPerfil: ParlamentarPerfil ;
  public tweetsList: Array<Embed>;
  public tweetsInfo: InfoTweets;
  public tweet: string;
  public interesseParam: string;
  public todosInteresses: Interesse[];
  public infoTwitter: InfoTwitter;
  public destaque: boolean;
  readonly TOTAL_PARLAMENTARES = 594;
  public formatHtml = (text: string) => {
    return text.replace(/\\/g, '');
  }


  constructor(
    private activatedRoute: ActivatedRoute,
    private twitterService: TwitterService,
    private interesseService: InteresseService,
    private sanitizer: DomSanitizer,
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
        console.log({'interesse: ': this.interesse, 'tema-params: ': params.tema, 'tema: ': this.tema, 'destaque: ': this.destaque});
        // this.resgataTwitter(this.interesse, this.tema, this.idAtor, this.destaque);
        this.processaParlamentar();
        // this.processaTweets(this.parlamentarPerfil);
        this.interesseParam =  params.interesse ?? 'todos';
    });


  }

  private processaParlamentar(){
    forkJoin([
      this.twitterService.getAtividade(this.idAtor),
      this.interesseService.getInteresses(),
      this.twitterService.getTweetsInfo(),

    ]).pipe(
    ).subscribe(data => {
      this.parlamentarPerfil = data[0];
      this.todosInteresses = data[1];
      this.tweetsInfo = data[2];
      this.processaTweets(data[0]);
    });

  }

  private processaTweets(parlamentar: ParlamentarPerfil){

    if (!parlamentar){
      return;
    }
    forkJoin([
      this.twitterService.getTweets(this.parlamentarPerfil, 'tudo')
    ]).pipe(
      indicate(this.isLoading),
      takeUntil(this.unsubscribe)
    ).subscribe(data => {
      this.tweetsList = data[0];
      this.print(data[0]);
      setTimeout(() => {
        this.print(twttr);
        twttr.widgets.load();
      }, 3000);
      this.isLoading.next(false);
    }
    );
  }

  print(data){
    console.log(data);
  }


  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
