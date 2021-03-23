import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';
import { select, selectAll, mouse, event } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { group, max, min } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { hsl } from 'd3-color';
import { path } from 'd3-path';
import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';

import { Entidade } from 'src/app/shared/models/entidade.model';
import { EntidadeService } from 'src/app/shared/services/entidade.service';

const d3 = Object.assign({}, {
  select,
  selectAll,
  scaleLinear,
  scaleOrdinal,
  group,
  max,
  min,
  axisLeft,
  axisBottom,
  mouse,
  hsl,
  path,
  forceSimulation,
  forceX,
  forceY,
  forceCollide
});

@Component({
  selector: 'app-vis-governismo',
  template: '<div id="vis-atividade-twitter" class="vis"></div>',
  styleUrls: ['./vis-governismo.component.scss']
})
export class VisGovernismoComponent implements OnInit {

  private unsubscribe = new Subject();

  private idParlamentarDestaque: number;
  private width;
  private height;
  private margin;

  private x: any;
  private cores: any;
  private r: any;
  private svg: any;
  private g: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private entidadeService: EntidadeService) { }

  ngOnInit(): void {
    const largura = (window.innerWidth > 1000) ? 1000 : window.innerWidth;
    this.margin = {
      left: 70,
      right: 70,
      top: 25,
      bottom: 60
    };
    this.width = largura - this.margin.right - this.margin.left;
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.x = d3.scaleLinear().range([0, this.width]);
    this.cores = d3.scaleOrdinal().range(['#6f42c1', '#91DABF']).domain(['0', '1']);
    this.r = 6;

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

        this.carregarVis();
      });
  }

  private carregarVis() {
    this.entidadeService.getParlamentaresExercicio('').subscribe(parlamentares => {
      if (this.g) {
        this.g.selectAll('*').remove();
      }
      this.g.call(g => this.atualizarVis(g, parlamentares));
    });
  }

  private atualizarVis(g, parlamentares) {
    const minGovernismo = d3.min(parlamentares, (d: any) => +d.governismo);
    const maxGovernismo = d3.max(parlamentares, (d: any) => +d.governismo);
    parlamentares.map(p => {
      p.governismo = this.normalizarGovernismo(p.governismo, minGovernismo, maxGovernismo);
    });
    const simulation = d3
      .forceSimulation(parlamentares)
      .force('x', d3.forceX((d: any) => this.x(d.governismo)).strength(1))
      .force('y', d3.forceY(this.height * 0.5))
      .force('collide', d3.forceCollide(this.r))
      .stop();

    for (let i = 0; i < 594; ++i) {
      simulation.tick();
    }

    const parlamentarDestaque = parlamentares.filter(p => p.id_autor_parlametria === this.idParlamentarDestaque)[0];
    const indexDestaque = parlamentares.indexOf(parlamentarDestaque);
    if (indexDestaque > -1) {
      parlamentares.splice(parlamentares.indexOf(parlamentarDestaque), 1);
    }

    // eixo X
    const eixoX = this.g.append('g');
    eixoX.call(d3.axisBottom(this.x)
      .ticks(3)
      .tickSize(this.height + (this.margin.top * 0.5)))
      .selectAll('.tick line')
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '10,2');
    eixoX.select('.domain').remove();
    this.g.append('text')
      .attr('x', this.width + 8)
      .attr('y', this.height + (this.margin.bottom * 0.75))
      .attr('text-anchor', 'end')
      .attr('font-size', '0.8rem')
      .text('Mais governista');
    this.g.append('text')
      .attr('x', -8)
      .attr('y', this.height + (this.margin.bottom * 0.75))
      .attr('text-anchor', 'start')
      .attr('font-size', '0.8rem')
      .text('Menos governista');

    // tooltip
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
      .attr('r', this.r)
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('fill', (d: any) => this.cores(this.categorizador(d, parlamentarDestaque)))
      .attr('stroke', (d: any) => this.cores(this.categorizador(d, parlamentarDestaque)))
      .attr('stroke-width', 0)
      .attr('opacity', 0.75)
      .on('mouseover', d => {
        tooltip.style('visibility', 'visible')
          .html(this.tooltipText(d));
      })
      .on('mousemove', d => {
        tooltip.style('top', (event.pageY - 20) + 'px')
          .style('left', (event.pageX + 20) + 'px');
      })
      .on('mouseout', () => tooltip.style('visibility', 'hidden'));

    nodes.append('circle')
      .attr('class', 'circle')
      .attr('tittle', parlamentarDestaque.id_autor_parlametria)
      .attr('r', this.r)
      .attr('cx', parlamentarDestaque.x)
      .attr('cy', parlamentarDestaque.y)
      .attr('fill', this.cores('0'))
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('opacity', 1)
      .on('mouseover', () => tooltip.style('visibility', 'visible').html(this.tooltipText(parlamentarDestaque)))
      .on('mousemove', () => tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px'))
      .on('mouseout', () => tooltip.style('visibility', 'hidden'));
  }

  private tooltipText(d): any {
    return `<p class="vis-tooltip-titulo"><strong>${d.nome_autor}</strong> ${d.partido}/${d.uf}</p>
    <p>Governismo: <strong>${d.governismo}</strong></p>`;
  }

  private normalizarGovernismo(valor: number, minimo: number, maximo: number): number {
    return (valor - minimo) / (maximo - minimo);
  }

  /* Verifica a categoria do parlamentar para a escala de cores
   * 0: do mesmo partido
   * 1: todo o resto
   */
  private categorizador(parlamentar: Entidade, destaque: Entidade): string {
    if (parlamentar.partido === destaque.partido) {
      return '0';
    }
    return '1';
  }

}
