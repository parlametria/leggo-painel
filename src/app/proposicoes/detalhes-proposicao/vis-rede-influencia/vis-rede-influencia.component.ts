import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, selectAll } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { interpolatePurples, interpolateGreens } from 'd3-scale-chromatic';
import { max, min } from 'd3-array';
import { forceSimulation, forceLink, forceManyBody, forceCollide, forceX, forceCenter } from 'd3-force';
import { drag } from 'd3-drag';

import { AutoriasService } from 'src/app/shared/services/autorias.service';

const d3 = Object.assign({}, {
  select, selectAll,
  scaleLinear,
  interpolatePurples, interpolateGreens,
  max, min,
  forceSimulation, forceLink, forceManyBody, forceCollide, forceX, forceCenter,
  drag
});

@Component({
  selector: 'app-vis-rede-influencia',
  template: '<div id="vis-rede-influencia" class="vis"></div>',
  styleUrls: ['./vis-rede-influencia.component.scss']
})
export class VisRedeInfluenciaComponent implements OnInit {

  private unsubscribe = new Subject();

  private idLeggo;

  private width;
  private height;
  private margin;
  private r;
  private color;
  private svg: any;
  private g: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private autoriasService: AutoriasService) { }

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
    this.r = 8;

    this.svg = d3
      .select('#vis-rede-influencia')
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
        this.idLeggo = params.get('id_leggo');
        this.carregarVis();
      });
  }

  private carregarVis() {

    function arrastar(simulation) {
      function dragstarted(event) {
        console.log('a');

        if (!event.active) {
          simulation.alphaTarget(0.3).restart();
        }
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) {
          simulation.alphaTarget(0);
        }
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    forkJoin([
      this.autoriasService.getCoautorias(this.idLeggo),
      this.autoriasService.getCoautoriasLigacoes(this.idLeggo)
    ]).pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        // const nodes = data[0];
        // const links = data[1];
        const nodes = data[0].map((n: any) => ({
          ...n,
          node_size: parseInt(n.node_size, 10),
          x: 0,
          y: 0,
          id: parseInt(n.id_autor, 10)
        }));
        const links = data[1].map(edge => ({
          ...edge,
          source: parseInt(edge.source, 10),
          target: parseInt(edge.target, 10)
        }));

        const scaleAux = d3.scaleLinear()
          .domain([
            d3.min(nodes, d => d.node_size),
            d3.max(nodes, d => d.node_size)
          ])
          .range([0.25, 1]);
        this.color = (n: any) => {
          if (n.bancada === 'governo') {
            return d3.interpolatePurples(scaleAux(n.node_size));
          }
          return d3.interpolateGreens(scaleAux(n.node_size));
        };

        const simulation = d3.forceSimulation(nodes)
          .force('link', d3.forceLink()
            .id((d: any) => d.id)
            .links(links)
            .distance(d => this.r))
          .force('charge', d3.forceManyBody())
          .force('collision', d3.forceCollide(this.r + 10))
          .force('x', d3.forceX((d: any) => (d.bancada === 'governo' ? this.width * 0.25 : this.width * 0.75))
            .strength(0.9));

        const link = this.g.append('g')
          .attr('stroke', '#999')
          .attr('stroke-opacity', 0.6)
          .selectAll('line')
          .data(links)
          .join('line')
          .attr('stroke-width', d => Math.sqrt(d.value));

        const node = this.g.append('g')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5)
          .selectAll('circle')
          .data(nodes)
          .join('circle')
          .attr('r', this.r)
          .attr('fill', d => this.color(d))
          .call(arrastar(simulation));

        simulation.on('tick', () => {
          link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

          node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        });

      });
  }

}
