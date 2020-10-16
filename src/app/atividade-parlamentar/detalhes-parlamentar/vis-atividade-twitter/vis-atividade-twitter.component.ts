import { Component, AfterContentInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, selectAll, mouse, event } from 'd3-selection';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { group, max, min } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { hsl } from 'd3-color';
import { path } from 'd3-path';
import { format } from 'd3-format';

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
  private idParlamentarDestaque: number;

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
      left: 70,
      right: 20,
      top: 20,
      bottom: 40
    };
    this.width = largura - this.margin.right - this.margin.left;
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.r = 10;

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

        this.activatedRoute.queryParams
          .subscribe(query => {
            this.tema = query.tema;
            this.tema === undefined ? this.tema = '' : this.tema = this.tema;
            this.carregarVis();
          });
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

    // Eixo X
    const eixoX = this.g.append('g');
    eixoX.call(d3.axisBottom(this.x)
        .ticks(4)
        .tickSize(this.height + (this.margin.top * 0.5)))
      .selectAll('.tick line')
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '10,2');
    eixoX.select('.domain').remove();
    this.g.append('text')
      .attr('x', this.width)
      .attr('y', (this.height + this.margin.bottom))
      .attr('text-anchor', 'end')
      .attr('font-size', '0.8rem')
      .text('tweet/dia');

    // Eixo Y
    this.g.append('g')
      .call(d3.axisLeft(this.y)
        .ticks(3, '%')
        .tickSize(15));
    this.g.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'end')
      .attr('transform', 'translate(' + (-this.margin.left * 0.8) + ', ' + (-5) + ') rotate(-90)')
      .attr('font-size', '0.8rem')
      .text('Proporção de tweets sobre o tema');

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'vis-tooltip')
      .style('position', 'absolute')
      .attr('data-html', 'true')
      .style('visibility', 'hidden');

    const nodes = this.g.append('g')
      .attr('class', 'nodes');
    nodes.selectAll('circle')
      .data(parlamentares)
      .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('tittle', (d: any) => 'media: ' + +d.media_tweets + ' perc: ' + d.percentual_atividade_twitter)
      .attr('r', this.r)
      .attr('cx', (d: any) => this.x(d.media_tweets))
      .attr('cy', (d: any) => this.y(d.percentual_atividade_twitter))
      .attr('fill', (d: any) => (d.id_autor_parlametria === this.idParlamentarDestaque) ? '#476bfc' : '#59BAFF')
      // .attr('stroke', (d: any) => (d.id_autor_parlametria === this.idParlamentarDestaque) ? 'black' : '#59BAFF')
      // .attr('stroke-width', (d: any) => (d.id_autor_parlametria === this.idParlamentarDestaque) ? 2 : 0)
      .attr('opacity', (d: any) => (d.id_autor_parlametria === this.idParlamentarDestaque) ? 1 : 0.4)
      .on('mouseover', d => {
        tooltip.style('visibility', 'visible')
          .html(this.tooltipText(d));
      })
      .on('mousemove', d => {
        tooltip.style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', () => tooltip.style('visibility', 'hidden'));

  }

  private tooltipText(d): any {
    return `<p class="vis-tooltip-titulo"><strong>${d.nome_autor}</strong> ${d.partido}/${d.uf}</p>
    <p><strong>${(d.atividade_twitter)}</strong> tweets no período</p>
    <p><strong>${format('.2%')(d.percentual_atividade_twitter)}</strong> de seus tweets são sobre o tema</p>
    <p><strong>${format('.1')(d.media_tweets)}</strong> tweets por mês</p>`;
  }

}
