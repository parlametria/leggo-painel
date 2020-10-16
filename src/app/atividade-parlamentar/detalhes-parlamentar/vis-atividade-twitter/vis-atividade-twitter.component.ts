import { Component, AfterContentInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, selectAll, mouse } from 'd3-selection';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { group, max, min } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { hsl } from 'd3-color';
import { path } from 'd3-path';

import { EntidadeService } from 'src/app/shared/services/entidade.service';
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
    private entidadeService: EntidadeService,
    private twitterService: TwitterService) { }

  ngAfterContentInit(): void {
    const largura = (window.innerWidth > 800) ? 800 : window.innerWidth;
    this.margin = {
      left: 40,
      right: 20,
      top: 20,
      bottom: 20
    };
    this.width = largura - this.margin.right - this.margin.left;
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.r = 6;

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

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.tema = params.tema;
        this.tema === undefined ? this.tema = '' : this.tema = this.tema;
        this.carregarVis();
      });
  }

  private carregarVis() {
    forkJoin([
      this.entidadeService.getParlamentaresExercicio(''),
      this.twitterService.getMediaTweets(this.interesse, this.tema),
      this.twitterService.getPercentualTweets(this.interesse, this.tema)
    ]).subscribe(data => {
      const parlamentaresExercicio: any = data[0];
      const mediaTweets: any = data[1];
      const percentualTweets: any = data[2];

      const parlamentares = parlamentaresExercicio.map(a => ({
        ...mediaTweets.find(p => a.id_autor_parlametria === +p.id_parlamentar_parlametria),
        ...percentualTweets.find(p => a.id_autor_parlametria === +p.id_parlamentar_parlametria),
        ...a
      }));
      console.log(parlamentares);

      if (this.g) {
        this.g.selectAll('*').remove();
      }
      this.g.call(g => this.atualizarVis(g, parlamentares));
    });
  }

  private atualizarVis(g, parlamentares) {
    const minimo = d3.min(parlamentares, (d: any) => d.media_tweets);
    const maximo = d3.max(parlamentares, (d: any) => d.media_tweets);

    this.x.domain([minimo, maximo]);
    this.y.domain([0, 1]);

    console.log('min', minimo, this.x(minimo));
    console.log('max', maximo, this.x(maximo));


    console.log('min', minimo, this.y(minimo));
    console.log('max', maximo, this.y(maximo));

    this.g.append('g')
      .attr('transform', 'translate(0, ' + (this.height) + ')')
      .call(d3.axisBottom(this.x));

    this.g.append('g')
      .call(d3.axisLeft(this.y).ticks(3, '%'));

    this.g.selectAll('circle')
      .data(parlamentares)
      .enter()
      .append('circle')
        .attr('class', 'circle')
        .attr('tittle', (d: any) => 'media: ' + +d.media_tweets + ' perc: ' + d.percentual_atividade_twitter)
        .attr('r', this.r)
        .attr('cx', (d: any) => this.x(d.media_tweets))
        .attr('cy', (d: any) => this.y(d.percentual_atividade_twitter) )
        .attr('fill', '#59BAFF')
        .attr('opacity', 0.6);
  }

}
