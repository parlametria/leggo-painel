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
import { interpolatePurples, interpolateOranges } from 'd3-scale-chromatic';
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
  interpolatePurples,
  interpolateOranges,
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
  private heightGrafico;
  private margin;

  private x: any;
  private yTemperatura: any;
  private yPressao: any;
  private svg: any;
  private gTemperatura: any;
  private gPressao: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pressaoService: PressaoService,
    private temperaturaService: TemperaturaService) { }

  ngOnInit(): void {
    const largura = (window.innerWidth > 800) ? 800 : window.innerWidth;
    this.margin = {
      left: 25,
      right: 60,
      top: 25,
      bottom: 25
    };
    this.width = largura - this.margin.right - this.margin.left;
    this.height = 300 - this.margin.top - this.margin.bottom;

    this.heightGrafico = (this.height * 0.5) - this.margin.bottom;

    this.x = d3.scaleTime().range([0, this.width]);
    this.yTemperatura = d3.scaleLinear().range([this.heightGrafico, 0]);
    this.yPressao = d3.scaleLinear().range([this.heightGrafico, 0]);

    this.svg = d3
      .select('#vis-temperatura-pressao')
      .append('svg')
      .attr('version', '1.1')
      .attr('xmlns:svg', 'http://www.w3.org/2000/svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('viewBox', '0 0 ' +
        (this.width + this.margin.left + this.margin.right) + ' ' + (this.height + this.margin.top + this.margin.bottom));

    this.gTemperatura = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.gPressao = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + (this.heightGrafico + this.margin.top * 2) + ')'
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

      let temperaturaPressao;
      if (pressao.length > temperatura.length) {
        temperaturaPressao = pressao.map(a => ({
          ...temperatura.find(p => a.date === p.periodo),
          ...a
        }));
        temperaturaPressao.map(t => {
          t.data = new Date(t.date),
            t.valorTemperatura = t.temperatura_recente ?? 0,
            t.valorPressao = t.trends_max_popularity ?? 0;
          return t;
        });
      } else {
        temperaturaPressao = temperatura.map(a => ({
          ...pressao.find(p => a.periodo === p.date),
          ...a
        }));
        temperaturaPressao.map(t => {
          t.data = new Date(t.periodo),
            t.valorTemperatura = t.temperatura_recente ?? 0,
            t.valorPressao = t.trends_max_popularity ?? 0;
          return t;
        });
      }
      if (this.gTemperatura) {
        this.gTemperatura.selectAll('*').remove();
      }
      this.gTemperatura.call(g => this.atualizarVis(g, temperaturaPressao, temperaturaMax.max_temperatura_periodo));
    });
  }

  private atualizarVis(g, dados, temperaturaMax) {
    this.x.domain(d3.extent(dados, (d: any) => d.data));
    this.yTemperatura.domain([0, temperaturaMax]);
    this.yPressao.domain([0, d3.max(dados, (d: any) => d.valorPressao)]);

    const lineTemperatura = d3.line()
      .curve(d3.curveMonotoneX)
      .x((d: any) => this.x(d.data))
      .y((d: any) => this.yTemperatura(d.valorTemperatura));
    const linePressao = d3.line()
      .curve(d3.curveMonotoneX)
      .x((d: any) => this.x(d.data))
      .y((d: any) => this.yPressao(d.valorPressao));

    const colorTemperatura = d3.scaleSequential(d3.interpolatePurples);
    this.gTemperatura.append('linearGradient')
      .attr('id', 'gradient-temperatura')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', this.heightGrafico)
      .attr('x2', 0)
      .attr('y2', this.margin.top)
      .selectAll('stop')
      .data([0, 0.5, 1])
      .enter().append('stop')
      .attr('offset', d => d)
      .attr('stop-color', colorTemperatura.interpolator());
    this.gTemperatura.append('path')
      .datum(dados)
      .attr('fill', 'none')
      .attr('stroke', 'url(\'#gradient-temperatura\'')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', lineTemperatura);

    const colorPressao = d3.scaleSequential(d3.interpolateOranges);
    this.gPressao.append('linearGradient')
      .attr('id', 'gradient-pressao')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', this.heightGrafico)
      .attr('x2', 0)
      .attr('y2', this.margin.top)
      .selectAll('stop')
      .data([0, 0.5, 1])
      .enter().append('stop')
      .attr('offset', d => d)
      .attr('stop-color', colorPressao.interpolator());
    this.gPressao.append('path')
      .datum(dados)
      .attr('fill', 'none')
      .attr('stroke', 'url(\'#gradient-pressao\'')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', linePressao);

    this.gTemperatura.append('g')
      .attr('transform', `translate(0, ${this.heightGrafico})`)
      .call(d3.axisBottom(this.x));
    this.gTemperatura.append('g')
      .attr('transform', `translate(0, 0)`)
      .call(d3.axisLeft(this.yTemperatura).ticks(3));
    this.gPressao.append('g')
      .attr('transform', `translate(0, ${this.heightGrafico})`)
      .call(d3.axisBottom(this.x));
    this.gPressao.append('g')
      .attr('transform', `translate(0, 0)`)
      .call(d3.axisLeft(this.yPressao).ticks(3));
  }
}
