import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, selectAll, mouse, event } from 'd3-selection';
import { scaleLinear, scaleSqrt, scaleSequential, scaleTime } from 'd3-scale';
import { group, max, min, extent } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { hsl } from 'd3-color';
import { path } from 'd3-path';
import { interpolateHcl } from 'd3-interpolate';
import { timeParse } from 'd3-time-format';
import { line, curveMonotoneX } from 'd3-shape';
import { nest } from 'd3-collection';

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
  scaleTime,
  nest
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
  private heightG;
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
      left: 25,
      right: 60,
      top: 25,
      bottom: 25
    };
    this.width = largura - this.margin.right - this.margin.left;
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.heightG = (this.height * 0.5) - this.margin.bottom;

    this.x = d3.scaleTime().range([0, this.width]);
    this.yTemperatura = d3.scaleLinear().range([this.heightG, 0]);
    this.yPressao = d3.scaleLinear().range([this.heightG, 0]);

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
      console.log(data);
      const pressao: any = data[0];
      const temperatura: any = data[1];
      const temperaturaMax: any = data[2];
      let temperaturaPressao;
      if (pressao.length > temperatura.length) {
        temperaturaPressao = pressao.map(a => ({
          data: moment(this.getProperty(temperatura.find(p => a.date === p.periodo),
          'periodo') ?? a.date),
          valorTemperatura: this.getProperty(temperatura.find(p => a.date === p.periodo),
          'temperatura_recente') ?? 0,
          valorPressao: a.trends_max_pressao_principal
        }));
      } else {
        temperaturaPressao = temperatura.map(a => ({
          data: moment(this.getProperty(pressao.find(p => a.periodo === p.date),
          'date') ?? a.periodo),
          valorTemperatura: a.temperatura_recente,
          valorPressao: this.getProperty(pressao.find(p => a.periodo === p.date),
          'trends_max_pressao_principal') ?? 0
        }));
      }
      console.log(temperaturaPressao);
      if (this.g) {
        this.g.selectAll('*').remove();
      }
      this.g.call(g => this.atualizarVis(g, temperaturaPressao, temperaturaMax.max_temperatura_periodo));
    });
  }

  private atualizarVis(g, dados, temperaturaMax) {
    this.x.domain(d3.extent(dados, (d: any) => d.data));
    this.yTemperatura.domain([0, temperaturaMax]);
    this.yPressao.domain([0, d3.max(dados, (d: any) => d.valorPressao)]);

    this.g.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.heightG})`)
      .call(d3.axisBottom(this.x));
    this.g.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(this.x));
    this.g.append('g')
      .attr('transform', `translate(${this.margin.left}, 0)`)
      .call(d3.axisLeft(this.yTemperatura).ticks(4));
    this.g.append('g')
      .attr('transform', `translate(${this.margin.left}, ${(this.heightG + this.margin.bottom)})`)
      .call(d3.axisLeft(this.yPressao).ticks(4));

    const color = d3.scaleSequential(this.yTemperatura.domain());

    const lineTemperatura = d3.line()
      .curve(d3.curveMonotoneX)
      .x((d: any) => this.x(d.data))
      .y((d: any) => this.yTemperatura(d.valorTemperatura));
    const linePressao = d3.line()
      .curve(d3.curveMonotoneX)
      .x((d: any) => this.x(d.data))
      .y((d: any) => this.yPressao(d.valorPressao));

    this.g.append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', this.heightG)
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
      .attr('stroke', 'url(\'#line-gradient\'')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', lineTemperatura);

    this.g.append('path')
      .datum(dados)
      .attr('fill', 'none')
      .attr('stroke', 'url(\'#line-gradient\'')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', linePressao);

  }

  private getProperty(objeto: any, property: string) {
    if (objeto === undefined) {
      return undefined;
    } else {
      return objeto[property];
    }
  }
}
