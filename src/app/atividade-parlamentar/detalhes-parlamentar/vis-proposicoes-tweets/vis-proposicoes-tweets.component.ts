import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, selectAll, mouse } from 'd3-selection';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { group, max, min } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { hsl } from 'd3-color';
import { path } from 'd3-path';

import { TwitterService } from 'src/app/shared/services/twitter.service';

const d3 = Object.assign({}, {
  select,
  selectAll,
  scaleLinear,
  scaleSqrt,
  group,
  max,
  min,
  axisLeft,
  axisBottom,
  mouse,
  hsl,
  path
});

@Component({
  selector: 'app-vis-proposicoes-tweets',
  template: '<div id="vis-proposicoes-tweets" class="vis"></div>',
  styleUrls: ['./vis-proposicoes-tweets.component.scss']
})
export class VisProposicoesTweetsComponent implements OnInit {


  private unsubscribe = new Subject();

  private tema: string;
  private idParlamentarDestaque: number;
  private interesse: string;

  private width;
  private height;
  private margin;

  private x: any;
  private y: any;
  private svg: any;
  private g: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private twitterService: TwitterService) { }

  ngOnInit(): void {
    const largura = (window.innerWidth > 1000) ? 1000 : window.innerWidth;
    this.margin = {
      left: 70,
      right: 200,
      top: 25,
      bottom: 40
    };
    this.width = largura - this.margin.right - this.margin.left;
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.x = d3.scaleLinear().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);

    this.svg = d3
      .select('#vis-atividade-twitter')
      .append('svg')
      .attr('version', '1.1')
      .attr('xmlns:svg', 'http://www.w3.org/2000/svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('viewBox', '0 0 ' +
        (this.width + this.margin.left + this.margin.right) + ' ' + (this.height + this.margin.top + this.margin.bottom));

    this.g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idParlamentarDestaque = +params.get('id');
        this.interesse = params.get('interesse');

        this.activatedRoute.queryParams
          .subscribe(query => {
            this.tema = query.tema;
            this.tema === undefined ? this.tema = '' : this.tema = this.tema;
            this.carregarVis();
          });
      });
  }

  private carregarVis() {

  }
}
