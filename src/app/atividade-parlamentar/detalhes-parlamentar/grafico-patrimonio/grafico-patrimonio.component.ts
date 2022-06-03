import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';

import * as d3 from 'd3';

import { Patrimonio } from 'src/app/shared/models/candidato-serenata';

const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const width = 460 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

type GraphData = {
  date: Date;
  value: number;
};

@Component({
  selector: 'app-grafico-patrimonio',
  template: `<div id='patrimonio-chart' class='grafico-patrimonio'></div>`,
  styleUrls: ['./grafico-patrimonio.component.scss']
})
export class GraficoPatrimonioComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  @Input() patrimonio: Patrimonio[] = [];

  public isLoading = new BehaviorSubject<boolean>(true);

  public svg: d3.Selection<SVGGElement, any, HTMLElement, any> = null;
  public g: d3.Selection<SVGGElement, any, HTMLElement, any> = null;
  public xScale: d3.ScaleTime<number, number> = null;
  public yScale: d3.ScaleLinear<number, number> = null;

  public dataset: GraphData[] = [

  ];

  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.dataset = this.patrimonio
      .map(p =>
      ({
        date: new Date(`${p.year}-01-01`),
        value: p.value
      }));

    this.isLoading.next(false);

    this.buildGraph();
  }

  private buildGraph() {
    // Prepare SVG
    this.svg = d3.select('#patrimonio-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');

    // Prepare x & y scales

    this.xScale = d3.scaleTime()
      .domain(d3.extent(this.dataset, (d) => d.date))
      .range([0, width]);

    this.yScale = d3.scaleLinear()
      .domain(d3.extent(this.dataset, (d) => d.value))
      .range([height / 2, 0]);

    // Prepare g
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

    this.addAxis();
    this.scatterDots();
    this.plotLines();
  }

  private addAxis() {
    const x = d3.scaleTime()
      .domain(d3.extent(this.dataset, (d) => d.date))
      .range([0, width]);

    this.svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.dataset, (d) => +d.value)])
      .range([height, 0]);

    this.svg.append('g')
      .call(d3.axisLeft(y));
  }

  private scatterDots() {
    this.svg.append('g')
      .selectAll('dot')
      .data(this.dataset)
      .enter()
      .append('circle')
      .attr('cx', (d) => this.xScale(d.date))
      .attr('cy', (d) => this.yScale(d.value))
      .attr('r', 8)
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
      .style('fill', '#5a44a0');

  }

  private plotLines() {
    const line = d3.line<GraphData>()
      .x((d) => this.xScale(d.date))
      .y((d) => this.yScale(d.value))
      .curve(d3.curveMonotoneX);

    this.svg.append('path')
      .datum(this.dataset)
      .attr('class', 'line')
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', '#5a44a0')
      .style('stroke-width', 4);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
