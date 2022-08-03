import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { Subject } from 'rxjs';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';

import { Engajamento } from 'src/app/shared/models/tweet.model';
import { format, time } from 'src/app/shared/functions/locale';
import { map } from 'd3';

type GraphData = {
  date: Date;
  value: number;
};

@Component({
  selector: 'app-grafico-engajamento',
  template: `
  <div class='engajametno-chart'>
    <div id='engajamento-chart-wrapper'></div>
  </div>`,
  styleUrls: []
})
export class GraficoEngajamentoComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  private readonly leftDistanceAdjust = 80;
  @Input() engajamento: Array<Engajamento>;


  width: number;
  height: number;
  totalWidth: number;
  totalHeight: number;
  margin: { top: number, right: number, bottom: number, left: number };

  svg: d3.Selection<SVGGElement, any, HTMLElement, any> = null;
  g: d3.Selection<SVGGElement, any, HTMLElement, any> = null;
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  xAxis: d3.Axis<number | Date | { valueOf(): number }>;
  yAxis: d3.Axis<number | Date | { valueOf(): number }>;

  lines: d3.Line<GraphData>;
  points: d3.Selection<SVGCircleElement, GraphData, SVGGElement, any>;
  tipPatrimonio: any;
  numberFormat: any;

  dataset: GraphData[] = [];


  ngOnInit(): void {

    this.dataset = this.engajamento
      .map(p =>
      ({
        date: new Date(`${p.data_consulta}`),
        value: p.total_engajamento
      }));

    this.buildGraph();
  }

  private buildGraph() {
    const container: any = d3.select('#engajamento-chart-wrapper').node();

    this.width = (container.offsetWidth < 580) ? 320 : 700;
    this.height = this.width - (this.width * 0.35);
    this.margin = {
      left: this.leftDistanceAdjust,
      right: 20,
      top: 0,
      bottom: 30
    };
    this.totalWidth = this.width + this.margin.left + this.margin.right + this.leftDistanceAdjust;
    this.totalHeight = this.height + this.margin.top + this.margin.top + 10;

    // Prepare SVG
    this.svg = d3.select('#engajamento-chart-wrapper')
      .append('svg')
      .data(this.dataset)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('viewBox', '0 0 ' + this.totalWidth + ' ' + this.totalHeight);
    this.g = this.svg.append('g')
      .attr('transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // Prepare x & y scales
    this.x = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);


    this.xAxis = d3.axisBottom(this.x)
      .tickFormat(
        /* tslint:disable-next-line  */
        function (date: Date) {
          const d3format = time.format('%b');
          if (d3.timeYear(date) < date) {
            return d3format(date);
          } else {
            return d3.timeFormat('%Y')(date);
          }
        }
      )
      .tickSize(this.height)
      .ticks(d3.timeMonth);


    this.yAxis = d3
      .axisRight(this.y)
      .tickFormat(
        /* tslint:disable-next-line  */
        function (d: number) {
          const formata = format.format(',d');
          return formata(d);
        }
      )
      .tickSize(this.width);

    this.drawXAxis();
    this.drawYAxis();
    this.scatterDots();
    this.plotLines();
    this.addTooltip();
  }


  private drawXAxis() {
    const minDate = this.engajamento[0].data_consulta;
    const maxDate = this.engajamento[this.engajamento.length - 1].data_consulta;

    this.x.domain([new Date(minDate), new Date(maxDate)]);

    this.g.append('g')
      .call(this.xAxis)
      .call(g => g.selectAll('.tick text')
        .attr('dy', 30)
        .style('color', '#76797b')
        .style('font-size', '1.6em'));

    // hide all years lines
    this.g.selectAll('line')
      .style('display', 'none');


  }

  private drawYAxis() {
    const maxPatrimonio = d3.max(this.engajamento, (d: any) => +d.total_engajamento);
    const maxValue = maxPatrimonio;

    this.y.domain([0, maxValue]).nice();

    this.g.append('g')
      .call(this.yAxis)
      .call(g => g.selectAll('.tick text')
        .attr('text-anchor', 'end')
        .attr('dx', -this.width - 20)
        .style('color', '#76797b')
        .style('font-size', '2em'));

    this.g.append('text')
      .style('font-size', '1.2em')
      .style('font-weight', 'normal')
      .attr('text-anchor', 'end')
      .attr('dx', 30)
      .attr('dy', -20)
      .text(() => {
        return 'Interação';
      });
  }

  private scatterDots() {
    this.points = this.svg.append('g')
      .selectAll('dot')
      .data(this.dataset)
      .enter()
      .append('circle')
      .attr('cx', (d) => this.x(d.date) + this.leftDistanceAdjust)
      .attr('cy', (d) => this.y(d.value))
      .attr('r', 10)
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
      .attr('stroke', '#e2e2e2')
      .attr('stroke-width', '4')
      .attr('fill', '#5a44a0');
  }

  private plotLines() {
    this.lines = d3.line<GraphData>()
      .x((d) => this.x(d.date) + this.leftDistanceAdjust)
      .y((d) => this.y(d.value));

    this.svg.append('path')
      .datum(this.dataset)
      .attr('class', 'line')
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
      .attr('d', this.lines)
      .style('fill', 'none')
      .style('stroke', '#5a44a0')
      .style('stroke-width', 4);
  }

  private addTooltip() {
    const formataNumero = format.format(',d');

    this.tipPatrimonio = d3Tip()
      .attr('class', 'tip-engajamento')
      .attr('id', 'tooltip-engajamento')
      .style('padding', '0.5rem')
      .style('border', 'solid 2px #000')
      .style('border-radius', '5px')
      .style('background-color', '#fff')
      .offset([-10, 0])
      .html((evt: MouseEvent, data: GraphData) => formataNumero(data.value));

    this.svg.call(this.tipPatrimonio);

    this.svg.selectAll('circle')
      .on('mouseover', this.tipPatrimonio.show)
      .on('mouseout', this.tipPatrimonio.hide);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
