import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmbedTweetService {

  private readonly TWITTER_OBJECT = 'twttr';
  private readonly TWITTER_SCRIPT_ID = 'twitter-wjs';
  private readonly TWITTER_WIDGET_URL = 'https://platform.twitter.com/widgets.js';

  constructor(@Inject(DOCUMENT) private readonly document: any) {
  }

  public loadScript(): Observable<any> {
      return new Observable((observer: Observer<any>) => {
          this._startScriptLoad();
          this.document.defaultView[ this.TWITTER_OBJECT ].ready(this._onTwitterScriptLoadedFactory(observer));
      });
  }

  private _startScriptLoad(): void {
      const twitterData = this.document.defaultView[ this.TWITTER_OBJECT ] || {};

      if (this._twitterScriptAlreadyExists()) {
          this.document.defaultView[ this.TWITTER_OBJECT ] = twitterData;
          return;
      }

      this._appendTwitterScriptToDOM();

      twitterData._e = [];

      twitterData.ready = (callback) => {
          twitterData._e.push(callback);
      };

      this.document.defaultView[ this.TWITTER_OBJECT ] = twitterData;
  }

  private _twitterScriptAlreadyExists(): boolean {
      const twitterScript = this.document.getElementById(this.TWITTER_SCRIPT_ID);
      return (twitterScript !== null || typeof twitterScript !== 'object');
  }

  private _appendTwitterScriptToDOM(): void {
      const firstJSScript = this.document.getElementsByTagName('script')[ 0 ];
      const js = this.document.createElement('script');
      js.id = this.TWITTER_SCRIPT_ID;
      js.src = this.TWITTER_WIDGET_URL;
      firstJSScript.parentNode.insertBefore(js, firstJSScript);
  }

  private _onTwitterScriptLoadedFactory(observer: Observer<any>) {
      return (twitterData: any) => {
          observer.next(twitterData);
          observer.complete();
      };
  }
}
