import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, selectAll, mouse, event } from 'd3-selection';
import { scaleLinear, scaleSqrt, scaleSequential, scaleTime } from 'd3-scale';
import { group, max, min, extent, bisect } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { hsl } from 'd3-color';
import { path } from 'd3-path';
import { interpolatePurples, interpolateOranges } from 'd3-scale-chromatic';
import { timeParse } from 'd3-time-format';
import { line, curveMonotoneX } from 'd3-shape';
import { nest } from 'd3-collection';
import { timeFormat, timeFormatLocale } from 'd3-time-format';
import { timeMonday } from 'd3-time';

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
  extent,
  bisect,
  axisLeft,
  axisBottom,
  mouse,
  event,
  hsl,
  path,
  scaleSequential,
  interpolatePurples,
  interpolateOranges,
  line,
  curveMonotoneX,
  timeParse,
  scaleTime,
  nest,
  timeFormat,
  timeFormatLocale,
  timeMonday
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
  private leftOffset;
  private r;

  private x: any;
  private yTemperatura: any;
  private maxTemperatura: any;
  private yPressao: any;
  private maxPressao: any;
  private svg: any;
  private gTemperatura: any;
  private gPressao: any;
  private localizacao: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pressaoService: PressaoService,
    private temperaturaService: TemperaturaService) { }

  ngOnInit(): void {
    const largura = (window.innerWidth > 900) ? 900 : window.innerWidth;
    this.r = 7;
    this.leftOffset = 150;
    this.margin = {
      left: 50,
      right: 60,
      top: 35,
      bottom: 35
    };
    this.localizacao = d3.timeFormatLocale({
      dateTime: '%A, %e %B %Y г. %X',
      date: '%d.%m.%Y',
      time: '%H:%M:%S',
      periods: ['AM', 'PM'],
      days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    });
    moment.updateLocale('en', {
      monthsShort: [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ]
    });
    this.width = largura - this.margin.right - this.margin.left;
    this.height = 370 - this.margin.top - this.margin.bottom;

    this.heightGrafico = (this.height * 0.5) - this.margin.bottom - 10;

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
        'translate(' + (this.margin.left + this.leftOffset) + ',' + this.margin.top + ')'
      );

    this.gPressao = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + (this.margin.left + this.leftOffset) + ',' + (this.heightGrafico + (this.margin.top * 2) + 10) + ')'
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
    const dataInicio = moment().subtract(3, 'months').format('YYYY-MM-DD'); // 3 meses atrás
    const dataFim = moment().format('YYYY-MM-DD');                          // hoje
    forkJoin([
      this.pressaoService.getPressaoList(this.interesse, this.idProposicaoDestaque, dataInicio, dataFim),
      this.temperaturaService.getTemperaturasById(this.interesse, this.idProposicaoDestaque, dataInicio, dataFim),
      this.temperaturaService.getMaximaTemperatura(this.interesse)

    ]).subscribe(data => {
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
      temperaturaPressao.sort((a, b) => {
        return moment(a.data).diff(b.data);
      });
      if (this.gTemperatura) {
        this.gTemperatura.selectAll('*').remove();
      }
      this.gTemperatura.call(g => this.atualizarVis(g, temperaturaPressao, temperaturaMax.max_temperatura_periodo));
    });
  }

  private atualizarVis(g, dados, temperaturaMax) {
    this.x.domain(d3.extent(dados, (d: any) => d.data));
    this.yTemperatura.domain([0, temperaturaMax]);
    const maxTemperatura = +d3.max(dados, (d: any) => d.valorTemperatura);
    let pressaoScale = 1;
    const maxPressao = +d3.max(dados, (d: any) => d.valorPressao);
    if (maxPressao > 0) {
      this.yPressao.domain([0, maxPressao]);
      pressaoScale = maxPressao;
    } else {
      this.yPressao.domain([0, 1]);
    }

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
      .data([0.35, 1])
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

    this.gTemperatura.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'start')
      .attr('transform', 'translate(' + (this.margin.left * 0.15) + ', ' + (7.5) + ')')
      .attr('font-size', '0.8rem')
      .text(`Maior temperatura: ${maxTemperatura}`);

    const colorPressao = d3.scaleSequential(d3.interpolateOranges);
    this.gPressao.append('linearGradient')
      .attr('id', 'gradient-pressao')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', this.heightGrafico)
      .attr('x2', 0)
      .attr('y2', this.margin.top)
      .selectAll('stop')
      .data([0.35, 1])
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

    this.gPressao.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'start')
      .attr('transform', 'translate(' + (this.margin.left * 0.15) + ', ' + (7.5) + ')')
      .attr('font-size', '0.8rem')
      .text(`Maior pressao: ${maxPressao}`);

    this.gTemperatura.append('g')
      .attr('transform', `translate(0, ${this.heightGrafico + 5})`)
      .call(d3.axisBottom(this.x).ticks(d3.timeMonday).tickFormat(this.localizacao.format('%d %b')))
      .call((d: any) => d.select('.domain').remove());
    this.gTemperatura.append('g')
      .attr('transform', `translate(-10, 0)`)
      .call(d3.axisLeft(this.yTemperatura).ticks(3));
    this.gPressao.append('g')
      .attr('transform', `translate(0, ${this.heightGrafico + 5})`)
      .call(d3.axisBottom(this.x).ticks(d3.timeMonday).tickFormat(this.localizacao.format('%d %b')))
      .call((d: any) => d.select('.domain').remove());
    this.gPressao.append('g')
      .attr('transform', `translate(-10, 0)`)
      .call(d3.axisLeft(this.yPressao).ticks(3));

    const bar = this.gTemperatura
      .append('line')
      .attr('style', 'stroke:#adb5bd; stroke-width:1; stroke-dasharray: 5 3;')
      .attr('y2', this.height)
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('transform', `translate(-100, 0)`);
    const markerTemperatura = this.gTemperatura
      .append('circle')
      .attr('r', this.r)
      .attr('cx', -100)
      .attr('fill', '#fff')
      .attr('stroke', '#3f007d')
      .attr('stroke-width', 3);
    const markerPressao = this.gPressao
      .append('circle')
      .attr('r', this.r)
      .attr('cx', -100)
      .attr('fill', '#fff')
      .attr('stroke', '#7f2704')
      .attr('stroke-width', 3);

    const tooltipTemperatura = this.svg.append('foreignObject')
      .attr('x', 15)
      .attr('y', 40)
      .attr('width', 250)
      .attr('height', 100)
      .style('display', 'none');
    const tooltipTemperaturaContent = tooltipTemperatura.append('xhtml:div')
      .attr('class', 'vis-tooltip');
    const tooltipTemperaturaTitle = tooltipTemperaturaContent.append('p');
    const tooltipTemperaturaBody = tooltipTemperaturaContent.append('p');
    const tooltipPressao = this.svg.append('foreignObject')
      .attr('x', 15)
      .attr('y', 40)
      .attr('width', 250)
      .attr('height', 100)
      .style('display', 'none');
    const tooltipPressaoContent = tooltipPressao.append('xhtml:div')
      .attr('class', 'vis-tooltip');
    const tooltipPressaoTitle = tooltipPressaoContent.append('p');
    const tooltipPressaoBody = tooltipPressaoContent.append('p');

    const mouseArea = this.svg.append('g')
      .append('rect')
      .attr('transform', `translate(${this.margin.left + this.leftOffset}, ${this.margin.top})`)
      .attr('class', 'chart-overlay')
      .attr('width', this.width)
      .attr('height', this.height);

    const datas = dados.map(d => d.data);
    mouseArea.on('mousemove', () => {
      const xMouse = d3.mouse(this.svg.node())[0] - this.leftOffset;
      const i = d3.bisect(datas, this.x.invert(xMouse));
      markerTemperatura
        .style('display', null)
        .attr('cx', this.x(dados[i - 1].data))
        .attr('cy', this.yTemperatura(dados[i - 1].valorTemperatura));
      markerPressao
        .style('display', null)
        .attr('cx', this.x(dados[i - 1].data))
        .attr('cy', this.yPressao(dados[i - 1].valorPressao));
      bar
        .style('display', null)
        .attr('transform', `translate(${this.x(dados[i - 1].data)}, 0)`);
      tooltipTemperaturaTitle
        .text('Semana de ' +
          moment(dados[i - 1].data).format('D MMM') + ' a ' +
          moment(dados[i - 1].data).add(7, 'days').format('D MMM'));
      tooltipTemperaturaBody.html(`<strong>${dados[i - 1].valorTemperatura}</strong> de temperatura</strong>`);
      tooltipPressaoTitle
        .text('Semana de ' +
          moment(dados[i - 1].data).format('D MMM') + ' a ' +
          moment(dados[i - 1].data).add(7, 'days').format('D MMM'));
      tooltipPressaoBody.html(`<strong>${dados[i - 1].valorPressao}</strong> de pressão</strong>`);
      let xTooltip = this.x(dados[i - 1].data);
      if (xTooltip > 500) {
        xTooltip = xTooltip - 280;
      }
      tooltipTemperatura
        .style('display', null)
        .attr('transform', `translate(${xTooltip + this.margin.left + this.leftOffset}, 0)`);
      tooltipPressao
        .style('display', null)
        .attr('transform', `translate(${xTooltip + this.margin.left + this.leftOffset}, ${this.heightGrafico + this.margin.top})`);

      return null;
    })
      .on('mouseout', () => {
        bar.style('display', 'none');
        markerPressao.style('display', 'none');
        markerTemperatura.style('display', 'none');
        tooltipTemperatura.style('display', 'none');
        tooltipPressao.style('display', 'none');
      });
  }

  private getProperty(objeto: any, property: string) {
    if (objeto === undefined) {
      return undefined;
    } else {
      return objeto[property];
    }
  }
}
