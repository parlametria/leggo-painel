import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, selectAll, mouse, event } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { interpolatePurples, interpolateGreens } from 'd3-scale-chromatic';
import { max, min } from 'd3-array';
import { forceSimulation, forceLink, forceManyBody, forceCollide, forceX, forceY, forceCenter } from 'd3-force';
import { drag } from 'd3-drag';
import { format } from 'd3-format';

import { AutoriasService } from 'src/app/shared/services/autorias.service';
import { PesoPoliticoService } from 'src/app/shared/services/peso-politico.service';

const d3 = Object.assign({}, {
  select, selectAll, mouse, event,
  scaleLinear,
  interpolatePurples, interpolateGreens,
  max, min,
  forceSimulation, forceLink, forceManyBody, forceCollide, forceX, forceY, forceCenter,
  drag,
  format
});

@Component({
  selector: 'app-vis-rede-influencia',
  template: '<div id="vis-rede-influencia" class="vis"></div>',
  styleUrls: ['./vis-rede-influencia.component.scss']
})
export class VisRedeInfluenciaComponent implements OnInit {

  private unsubscribe = new Subject();

  private idLeggo;
  private interesse;

  private width;
  private height;
  private margin;
  private r;
  private color;
  private svg: any;
  private g: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private autoriasService: AutoriasService,
    private pesoPoliticoService: PesoPoliticoService) { }

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
        this.interesse = params.get('interesse');
        this.carregarVis();
      });
  }

  private carregarVis() {
    forkJoin([
      this.autoriasService.getCoautorias(this.idLeggo),
      this.autoriasService.getCoautoriasLigacoes(this.idLeggo),
      this.pesoPoliticoService.getPesoPolitico()
    ]).pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        console.log(data);
        const pesoPolitico = data[2];
        const nodes = data[0].map((n: any) => {
          const peso = pesoPolitico.find(p => parseInt(p.idParlamentarVoz, 10) === parseInt(n.id_autor_parlametria, 10));
          return {
            ...n,
            node_size: parseInt(n.node_size, 10),
            x: 0,
            y: 0,
            id: parseInt(n.id_autor, 10),
            pesoPolitico: (typeof peso === 'undefined' ? 0 : peso.pesoPolitico)
          };
        });
        const links = data[1].map(edge => ({
          ...edge,
          source: parseInt(edge.source, 10),
          target: parseInt(edge.target, 10)
        }));
        const connectedNodes = nodes.filter(n => {
          return (links.filter(l => l.source === n.id || l.target === n.id).length > 0);
        }).map(n => n.id);

        const scaleAux = d3.scaleLinear()
          .domain([
            d3.min(nodes, d => d.pesoPolitico),
            d3.max(nodes, d => d.pesoPolitico)
          ])
          .range([0.25, 0.75]);
        this.color = (n: any) => {
          if (n.bancada === 'governo') {
            return '/assets/icons/influencia-gov.svg';
          }
          return '/assets/icons/influencia-op.svg';
        };

        const scaleLinkSize = d3.scaleLinear()
          .domain([
            d3.min(links, (d: any) => +d.value),
            d3.max(links, (d: any) => +d.value)
          ])
          .range([0.5, 5]);
        const scaleNodeSize = d3.scaleLinear()
          .domain([0, 1])
          .range([5, 15]);

        const simulation = d3.forceSimulation(nodes)
          .force('link', d3.forceLink()
            .id((d: any) => d.id)
            .links(links)
            .distance(this.r))
          // .force('charge', d3.forceManyBody().strength(-25))
          .force('collision', d3
            .forceCollide((d: any) => connectedNodes.includes(d.id) ? this.r + 20 : this.r + 2))
          .force('x', d3
            .forceX((d: any) => (d.bancada === 'governo' ? this.width * 0.75 : this.width * 0.25))
            .strength(0.9))
          .force('y', d3
            .forceY((d: any) => connectedNodes.includes(d.id) ? this.height * 0.25 : this.height * 0.75)
            .strength((d: any) => connectedNodes.includes(d.id) ? 2 : 1));

        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'vis-tooltip')
          .style('position', 'absolute')
          .attr('data-html', 'true')
          .style('visibility', 'hidden');

        const link = this.g.append('g')
          .attr('stroke', '#ccc')
          .attr('stroke-opacity', 1)
          .selectAll('line')
          .data(links)
          .join('line')
          .attr('stroke-width', (d: any) => scaleLinkSize(+d.value));

        const node = this.g.append('g')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1)
          .selectAll('circle')
          .data(nodes)
          .enter().append('image')
          .attr('xlink:href', (d: any) => this.color(d))
          .attr('width', '20px')
          .attr('height', '20px')
          .style('cursor', 'pointer')
          .style('pointer-events', 'all')
          .style('transform', 'translate(-10px, -15px)')
          .on('mouseover', (d: any) => {
            tooltip.style('visibility', 'visible')
              .html(this.tooltipText(d));
          })
          .on('mousemove', (d: any) => {
            tooltip.style('top', (event.pageY - 20) + 'px')
              .style('left', (event.pageX + 20) + 'px');
          })
          .on('mouseout', () => tooltip.style('visibility', 'hidden'))
          .on('click', (d: any) => {
            tooltip.style('visibility', 'hidden');
            this.router.navigate([this.interesse, 'parlamentares', d.id_autor_parlametria]);
          });

        // node.append('title')
        //   .text((d: any) => d.nome_eleitoral);

        this.g.append('text')
          .attr('x', this.width * 0.25)
          .attr('y', this.height * 1.15)
          .attr('text-anchor', 'middle')
          .attr('fill', '#aaa')
          .text('Oposição');

        this.g.append('text')
          .attr('x', this.width * 0.75)
          .attr('y', this.height * 1.15)
          .attr('text-anchor', 'middle')
          .attr('fill', '#aaa')
          .text('Centro/Governo');

        simulation.on('tick', () => {
          link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
          node
            .attr('x', d => d.x)
            .attr('y', d => d.y);
        });

      });
  }

  private tooltipText(d): any {
    return `<p class="vis-tooltip-titulo"><strong>${d.nome}</strong> ${d.partido}/${d.uf}</p>`;
  }

}
