import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { Subject } from 'rxjs';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';

import { Patrimonio } from 'src/app/shared/models/candidato-serenata';

type GraphData = {
  date: Date;
  value: number;
};

@Component({
  selector: 'app-grafico-patrimonio',
  template: `
  <div class='patrimonio-chart'>
    <div id='patrimonio-chart-wrapper'></div>
  </div>`,
  styleUrls: []
})
export class GraficoPatrimonioComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  // Because of Y label "R$ ...", have to move to add 80px distance on the left in the dots and lines
  private readonly leftDistanceAdjust = 80;
  @Input() patrimonio: Patrimonio[] = [];

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
    this.dataset = this.patrimonio
      .map(p =>
      ({
        date: new Date(`${p.year}-01-01`),
        value: p.value
      }));

    this.buildGraph();
  }

  private buildGraph() {
    const container: any = d3.select('#patrimonio-chart-wrapper').node();

    this.width = (container.offsetWidth < 580) ? 300 : 600;
    this.height = this.width - (this.width * 0.3);
    this.margin = {
      left: this.leftDistanceAdjust,
      right: 20,
      top: 0,
      bottom: 30
    };
    this.totalWidth = this.width + this.margin.left + this.margin.right + this.leftDistanceAdjust; // +80 for Y label "R$ ..."
    this.totalHeight = this.height + this.margin.top + this.margin.top + 10; // + 10 for X values

    // Prepare SVG
    this.svg = d3.select('#patrimonio-chart-wrapper')
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
      .tickFormat(d3.timeFormat('%Y'))
      .tickSize(this.height)
      .ticks(d3.timeYear);
    this.yAxis = d3
      .axisRight(this.y)
      .tickSize(this.width);
    this.numberFormat = d3.format('.2f');

    this.drawXAxis();
    this.drawYAxis();
    this.scatterDots();
    this.plotLines();
    this.addTooltip();
  }

  private drawXAxis() {
    const minDate = new Date(+d3.min(this.patrimonio, (d: any) => d.year) - 1, 0, 1);
    const maxDate = new Date(+d3.max(this.patrimonio, (d: any) => d.year), 11, 30);
    this.x.domain([minDate, maxDate]);

    this.g.append('g')
      .attr('class', 'axis-patrimonio axis--x')
      .call(this.xAxis)
      .call(g => g.select('.domain').style('stroke', 'transparent'))
      .call(g => g.selectAll('.tick text')
        .attr('dy', 15)
        .attr('opacity', 0.9)
        .style('font-size', '0.95em'))
      .call(g => g.selectAll('.tick')
        .attr('class', (d: Date) => {
          const isOddYear = d.getFullYear() % 2;

          if (isOddYear) {
            return 'tick opaque';
          };

          return 'tick normal';
        }));

    // right arrow
    this.svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('refX', 1)
      .attr('refY', 4.5)
      .attr('markerWidth', 15)
      .attr('markerHeight', 10)
      .attr('orient', '0')
      .append('path')
      .attr('d', 'M 0 0 L 5 5 L 0 10')
      .attr('fill', '#595959');
    this.g
      .select('.axis--x path.domain')
      .attr('marker-end', 'url(#arrowhead)');
  }

  private drawYAxis() {
    const maxPatrimonio = d3.max(this.patrimonio, (d: any) => +d.value);
    const maxValue = maxPatrimonio;
    const checkValues = {
      minMax: 900000,
      middleMax: 1000000,
      maximum: 10000000
    };
    let max = maxValue;
    if (max < checkValues.minMax) {
      max = checkValues.minMax;
    } else if (max < checkValues.middleMax) {
      max = checkValues.middleMax;
    } else {
      max = Math.ceil(max / checkValues.maximum) * checkValues.maximum;
    }

    this.y.domain([0, maxValue]).nice();
    this.yAxis.tickFormat((d: number) => {
      let s = max <= checkValues.minMax ? d / 1000 : d / checkValues.middleMax;

      if (s.toString().length > 4) {
        s = this.numberFormat(s);
      }
      return '\xa0' + s;
    });

    this.g.append('g')
      .attr('class', 'axis-patrimonio axis--y')
      .call(this.yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text')
        .attr('text-anchor', 'end')
        .attr('dx', -this.width - 15)
        .attr('opacity', 0.9)
        .style('font-size', '0.95em'));

    this.g.append('text')
      .style('font-size', '0.60em')
      .style('font-weight', 'normal')
      .attr('text-anchor', 'end')
      .attr('dx', -10)
      .attr('dy', -15)
      .text(() => {
        if (max <= 900000) {
          return 'R$ mil';
        }
        return 'R$ milhões';
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
    // .curve(d3.curveMonotoneX);

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
    const locale = d3.formatLocale({
      decimal: ',',
      thousands: '.',
      grouping: [3],
      currency: ['R$ ', ' ']
    });
    const currencyFormat = locale.format('$,.2f');

    this.tipPatrimonio = d3Tip()
      .attr('class', 'tip-patrimonio')
      .attr('id', 'tooltip-patrimonio')
      .style('padding', '0.5rem')
      .style('border', 'solid 2px #000')
      .style('border-radius', '5px')
      .style('background-color', '#fff')
      .offset([-10, 0])
      .html((evt: MouseEvent, data: GraphData) => currencyFormat(data.value));

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
