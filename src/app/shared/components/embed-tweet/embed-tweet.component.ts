import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EmbedTweetService } from '../../services/embed-tweet.service';

@Component({
  selector: 'app-embed-tweet',
  templateUrl: './embed-tweet.component.html',
  styleUrls: ['./embed-tweet.component.scss']
})
export class EmbedTweetComponent implements OnInit, OnDestroy {

  @Input() public tweetId: string;

  private unsubscribe = new Subject();
  public isTwitterScriptLoading = true;

  constructor(
    private elementRef: ElementRef,
    private embedTweetService: EmbedTweetService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loadTwitterScript();
  }

  private loadTwitterScript(): void {
    this.embedTweetService
      .loadScript()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((twitterData: any) => {
        this.updateTwitterScriptLoadingState();
        twitterData.widgets.createTweet(this.tweetId, this.elementRef.nativeElement,
          { lang: 'pt-BR', align: 'center', cards: 'hidden' });
      });
  }

  private updateTwitterScriptLoadingState(): void {
    this.isTwitterScriptLoading = false;
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
