import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, selectAll, mouse, event } from 'd3-selection';
import { scaleLinear, scaleSqrt, scaleSequential, scaleUtc } from 'd3-scale';
import { group, max, min, extent } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { hsl } from 'd3-color';
import { path } from 'd3-path';
import { interpolateHcl } from 'd3-interpolate';
import { timeParse } from 'd3-time-format';
import { line, curveMonotoneX } from 'd3-shape';

import { PressaoService } from 'src/app/shared/services/pressao.service';
import { TemperaturaService } from 'src/app/shared/services/temperatura.service';

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
  path,
  scaleSequential,
  interpolateHcl,
  line,
  curveMonotoneX,
  extent,
  timeParse,
  scaleUtc
});

@Component({
  selector: 'app-vis-temperatura-pressao',
  template: '<div id="vis-temperatura-pressao" class="vis"></div>',
  styleUrls: ['./vis-temperatura-pressao.component.scss']
})
export class VisTemperaturaPressaoComponent implements OnInit {


  private unsubscribe = new Subject();

  private idProposicaoDestaque: string;
  private interesse: string;

  private width;
  private height;
  private margin;

  private x: any;
  private yTemperatura: any;
  private yPressao: any;
  private svg: any;
  private g: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pressaoService: PressaoService,
    private temperaturaService: TemperaturaService) { }

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

    this.x = d3.scaleUtc().range([0, this.width]);
    this.yTemperatura = d3.scaleLinear().range([this.height, 0]);
    this.yPressao = d3.scaleLinear().range([this.height, 0]);

    this.svg = d3
      .select('#vis-temperatura-pressao')
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
        this.idProposicaoDestaque = params.get('id_leggo');
        this.interesse = params.get('interesse');
        this.carregarVis();
      });
  }

  private carregarVis() {
    forkJoin([
      this.pressaoService.getPressaoList(this.interesse, this.idProposicaoDestaque),
      this.temperaturaService.getTemperaturasById(this.interesse, this.idProposicaoDestaque),
      this.temperaturaService.getMaximaTemperatura(this.interesse)

    ]).subscribe(data => {
      const pressao: any = data[0];
      const temperatura: any = data[1];
      const temperaturaMax: any = data[2];

      const temperaturaPressao = temperatura.map(a => ({
        ...pressao.find(p => a.periodo === p.date),
        ...a
      }));
      temperaturaPressao.map(t => {
        t.data = new Date(t.periodo),
        t.valorTemperatura = t.temperatura_recente,
        t.valorPressao = t.trends_max_popularity;
        return t;
      });
      console.log(temperaturaPressao);
      if (this.g) {
        this.g.selectAll('*').remove();
      }
      this.g.call(g => this.atualizarVis(g, temperaturaPressao, temperaturaMax));
    });
  }

  private atualizarVis(g, dados, temperaturaMax) {
    dados.map(d => d.data);
    this.x.domain(dados, d3.extent(dados, (d: any) => d.data));
    this.yTemperatura.domain([0, temperaturaMax]);
    this.yPressao.domain([0, d3.max(dados, (d: any) => d.valorPressao)]);

    const xAxis = this.g.attr('transform', `translate(0,${this.height - this.margin.bottom})`)
    .call(d3.axisBottom(this.x).ticks(this.width / 80).tickSizeOuter(0))
    .call(d => d.select('.domain').remove());

    const yAxisTemperatura = this.g
    .attr('transform', `translate(${this.margin.left},0)`)
    .call(d3.axisLeft(this.yTemperatura))
    .call(d => d.select('.domain').remove())
    .call(d => d.select('.tick:last-of-type text'));

    const yAxisPressao = this.g
    .attr('transform', `translate(${this.margin.left},0)`)
    .call(d3.axisLeft(this.yPressao))
    .call(d => d.select('.domain').remove())
    .call(d => d.select('.tick:last-of-type text'));

    const color = d3.scaleSequential(this.yTemperatura.domain());

    const lineG = d3.line()
    .curve(d3.curveMonotoneX)
    .defined(d => !isNaN(d.valorTemperatura))
    .x(d => this.x(d.data))
    .y(d => this.yTemperatura(d.valorTemperatura));

    this.g.append('linearGradient')
    .attr('id', 'line-gradient')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0)
    .attr('y1', this.height - this.margin.bottom)
    .attr('x2', 0)
    .attr('y2', this.margin.top)
    .selectAll('stop')
      .data([
        {offset: '0%', color: 'blue'},
        {offset: '100%', color: 'red'}
      ])
    .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);

    this.g.append('path')
    .datum(dados)
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('stroke-width', 3)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('d', lineG);

  }
}
