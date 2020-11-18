import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, selectAll, mouse, event } from 'd3-selection';
import { scaleLinear, scaleSqrt } from 'd3-scale';
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
  selector: 'app-vis-atividade-twitter',
  templateUrl: './vis-atividade-twitter.component.html',
  styleUrls: ['./vis-atividade-twitter.component.scss']
})
export class VisAtividadeTwitterComponent implements OnInit {


  private unsubscribe = new Subject();

  private tema: string;
  private idParlamentarDestaque: number;
  private interesse: string;

  private width;
  private height;
  private margin;

  private x: any;
  private y: any;
  private r: any;
  private svg: any;
  private g: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private entidadeService: EntidadeService,
    private twitterService: TwitterService) { }

  ngOnInit(): void {
    const largura = (window.innerWidth > 1000) ? 1000 : window.innerWidth;
    this.margin = {
      left: 70,
      right: 250,
      top: 25,
      bottom: 40
    };
    this.width = largura - this.margin.right - this.margin.left;
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.x = d3.scaleLinear().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.r = d3.scaleSqrt().range([5, 25]);

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
    forkJoin([
      this.entidadeService.getParlamentaresExercicio(''),
      this.twitterService.getMediaTweets(),
      this.twitterService.getAtividadeTwitter(this.interesse, this.tema),
      this.twitterService.getEngajamento()
    ]).subscribe(data => {
      const parlamentaresExercicio: any = data[0];
      const mediaTweets: any = data[1];
      const atividade: any = data[2];
      const engajamento: any = data[3];

      const parlamentares = parlamentaresExercicio.map(a => ({
        ...mediaTweets.find(p => a.id_autor_parlametria === +p.id_parlamentar_parlametria),
        ...atividade.find(p => a.id_autor_parlametria === +p.id_parlamentar_parlametria),
        ...engajamento.find(p => a.id_autor_parlametria === +p.id_parlamentar_parlametria),
        ...a
      })).filter(parlamentar => {
        if (
          !isNaN(parlamentar.media_tweets) && parlamentar.media_tweets !== undefined &&
          !isNaN(parlamentar.atividade_twitter) && parlamentar.atividade_twitter !== undefined &&
          !isNaN(parlamentar.engajamento) && parlamentar.engajamento !== undefined
        ) {
          return parlamentar;
        }
      });

      if (this.g) {
        this.g.selectAll('*').remove();
      }
      this.g.call(g => this.atualizarVis(g, parlamentares));
    });
  }

  private atualizarVis(g, parlamentares) {
    this.x.domain([d3.min(parlamentares, (d: any) => d.media_tweets), d3.max(parlamentares, (d: any) => d.media_tweets)]);
    this.y.domain([0, d3.max(parlamentares, (d: any) => +d.atividade_twitter)]);
    this.r.domain([d3.min(parlamentares, (d: any) => d.engajamento), d3.max(parlamentares, (d: any) => d.engajamento)]);

    const parlamentarDestaque = parlamentares.filter(p => p.id_autor_parlametria === this.idParlamentarDestaque)[0];
    const indexDestaque = parlamentares.indexOf(parlamentarDestaque);
    if (indexDestaque > -1) {
      parlamentares.splice(parlamentares.indexOf(parlamentarDestaque), 1);
    }

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
      .text('tweet/semana');

    // Eixo Y
    this.g.append('g')
      .call(d3.axisLeft(this.y)
        .ticks(4)
        .tickSize(15));
    this.g.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'end')
      .attr('transform', 'translate(' + (-this.margin.left * 0.8) + ', ' + (-5) + ') rotate(-90)')
      .attr('font-size', '0.8rem')
      .text('Quantidade de tweets');

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
      .attr('tittle', (d: any) => d.id_autor_parlametria)
      .attr('r', (d: any) => this.r(d.engajamento))
      .attr('cx', (d: any) => this.x(d.media_tweets))
      .attr('cy', (d: any) => this.y(d.atividade_twitter))
      .attr('fill', '#59BAFF')
      .attr('stroke', '#59BAFF')
      .attr('stroke-width', 0)
      .attr('opacity', 0.4)
      .on('mouseover', d => {
        tooltip.style('visibility', 'visible')
          .html(this.tooltipText(d));
      })
      .on('mousemove', d => {
        tooltip.style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', () => tooltip.style('visibility', 'hidden'));

    nodes.append('circle')
      .attr('class', 'circle')
      .attr('tittle', parlamentarDestaque.id_autor_parlametria)
      .attr('r', this.r(parlamentarDestaque.engajamento))
      .attr('cx', this.x(parlamentarDestaque.media_tweets))
      .attr('cy', this.y(parlamentarDestaque.atividade_twitter))
      .attr('fill', '#6f42c1')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('opacity', 1)
      .on('mouseover', () => tooltip.style('visibility', 'visible').html(this.tooltipText(parlamentarDestaque)))
      .on('mousemove', () => tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px'))
      .on('mouseout', () => tooltip.style('visibility', 'hidden'));

    const legendaCirculo = this.svg.append('g');

    const legenda = this.legendCircle(
        legendaCirculo,
        d3.scaleSqrt().domain([0, 10000]).range([5, 30]),
        [20, 2000, 10000],
        (d, i, e) => i === 0 ? d : d.toString().slice(0, -3) + ' mil',
        7
      );

    legendaCirculo.call(legenda);
  }

  private tooltipText(d): any {
    return `<p class="vis-tooltip-titulo"><strong>${d.nome_autor}</strong> ${d.partido}/${d.uf}</p>
    <p><strong>${(d.atividade_twitter)}</strong> tweets nesse tema e agenda</p>
    <p><strong>${format('.1f')(d.media_tweets)}</strong> tweets por semana</p>
    <p><strong>${format('.1f')(d.engajamento)}</strong> curtidas, respostas e retweets em média</p>`;
  }

  private legendCircle(g, scale, tickValues, tickFormat, tickSize){

    g.attr('transform', `translate(${[770, 30]})`);

    const ticks = tickValues || scale.ticks();

    const maxT = ticks[ticks.length - 1];

    g.selectAll('circle')
      .data(ticks.slice().reverse())
    .enter().append('circle')
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('cx', scale(maxT))
      .attr('cy', scale)
      .attr('r', scale);

    g.selectAll('line')
      .data(ticks)
    .enter().append('line')
      .attr('stroke', 'currentColor')
      .attr('stroke-dasharray', '4, 2')
      .attr('x1', scale(maxT))
      .attr('x2', tickSize + scale(maxT) * 2)
      .attr('y1', d => scale(d) * 2)
      .attr('y2', d => scale(d) * 2);

    g.selectAll('text')
      .data(ticks)
    .enter().append('text')
      .attr('font-size', 11)
      .attr('dx', 3)
      .attr('dy', 4)
      .attr('x', tickSize + scale(maxT) * 2)
      .attr('y', d => scale(d) * 2)
      .text(tickFormat);

    g.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('font-size', '0.8rem')
      .text('Engajamento médio');
  }

}
