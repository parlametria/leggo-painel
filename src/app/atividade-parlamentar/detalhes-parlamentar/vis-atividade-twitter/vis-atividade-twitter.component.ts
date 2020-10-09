import { Component, AfterContentInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, selectAll, mouse } from 'd3-selection';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { group, max, min } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { hsl } from 'd3-color';
import { path } from 'd3-path';

import { TwitterService } from 'src/app/shared/services/twitter.service';

const d3 = Object.assign({}, {
  select,
  selectAll,
  scaleLinear,
  scaleBand,
  scaleOrdinal,
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
  selector: 'app-vis-atividade-twitter',
  template: '<div id="vis-atividade-twitter" class="vis"></div>',
  styleUrls: ['./vis-atividade-twitter.component.scss']
})
export class VisAtividadeTwitterComponent implements AfterContentInit {

  @Input() interesse: string;

  private unsubscribe = new Subject();

  private tema: string;

  private width;
  private height;
  private margin;
  private r;

  private x: any;
  private y: any;
  private svg: any;
  private g: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private twitterService: TwitterService) { }

  ngAfterContentInit(): void {
    this.margin = {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20
    };
    this.width = 800 - this.margin.right - this.margin.left;
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.r = 5;

    this.x = d3.scaleLinear().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);

    this.svg = d3
      .select('#vis-atividade-twitter')
      .append('svg')
      .attr('version', '1.1')
      .attr('xmlns:svg', 'http://www.w3.org/2000/svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.tema = params.tema;
        this.tema === undefined ? this.tema = '' : this.tema = this.tema;
        this.carregarVis();
      });
  }

  private carregarVis() {
    this.twitterService.getMediaTweets(this.interesse, this.tema)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(mediaTweetsPorDia => {
        if (this.g) {
          this.g.selectAll('*').remove();
        }
        this.g.call(g => this.atualizarVis(g, mediaTweetsPorDia));
      });
  }

  private atualizarVis(g, mediaTweetsPorDia) {
    const maximo = d3.max(mediaTweetsPorDia, (d: any) => d.media_tweets);
    this.x.domain([0, maximo]);

    this.g.append('g')
      .attr('transform', 'translate(0, ' + (this.height - this.margin.top - this.margin.bottom) + ')')
      .call(d3.axisBottom(this.x));

    this.g.selectAll('circle')
      .data(mediaTweetsPorDia)
      .enter()
      .append('circle')
        .attr('class', 'circle')
        .attr('r', this.r)
        .attr('cx', (d: any) => this.x(d.media_tweets))
        .attr('cy', this.height * 0.5)
        .attr('fill', '#59BAFF');
  }

}
