import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Insight } from '../shared/models/insight.model';
import { InsightsService } from '../shared/services/insights.service';
import { indicate } from '../shared/functions/indicate.function';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  public isLoading = new BehaviorSubject<boolean>(true);

  interesse: string;
  insights: Insight[];

  constructor(
    private insightsService: InsightsService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.interesse = params.interesse;
        this.getInsights(this.interesse);
      });
  }

  getInsights(interesse: string) {
    this.insightsService.getInsights(interesse)
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe)
      ).subscribe(insights => {
        this.insights = insights;
        this.isLoading.next(false);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
