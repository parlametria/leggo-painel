import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AtorService } from 'src/app/shared/services/ator.service';
import { Autoria, ArvoreAutorias } from 'src/app/shared/models/autoria.model';

// Importa componentes do d3
import { select, selectAll } from 'd3-selection';
import { transition } from 'd3-transition';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { quantize, interpolateRgb } from 'd3-interpolate';
import { group } from 'd3-array';
import { partition, hierarchy, treemap } from 'd3-hierarchy';
import { nest } from 'd3-collection';
select.prototype.transition = transition;

const d3 = Object.assign({}, {
  partition,
  select,
  selectAll,
  transition,
  scaleLinear,
  scaleSequential,
  group,
  hierarchy,
  quantize,
  interpolateRgb,
  treemap,
  nest
});

@Component({
  selector: 'app-vis-atividade-detalhada',
  templateUrl: './vis-atividade-detalhada.component.html',
  styleUrls: ['./vis-atividade-detalhada.component.scss']
})
export class VisAtividadeDetalhadaComponent implements OnInit {

  @Input() idAtor: string;
  @Input() larguraJanela: number;

  private unsubscribe = new Subject();

  private largura: number;
  private altura: number;
  private x: any;
  private y: any;
  private svg: any;
  private gPrincipal: any;

  constructor(
    private atorService: AtorService
  ) { }

  ngOnInit(): void {
    this.largura = window.innerWidth;
    this.altura = this.largura > 700 ? 450 : 550;
    this.x = d3.scaleLinear().rangeRound([0, this.largura]);
    this.y = d3.scaleLinear().rangeRound([0, this.altura]);
    this.svg  = d3.select('#vis-atividade-detalhada').append('svg')
      .attr('viewBox', `0.5 0 ${this.largura} ${this.altura}`);
    this.carregaVisAtividade();
  }

  private treemap = data => d3.treemap()
    .size([this.largura, this.altura])
    .paddingOuter(3)
    .paddingTop(19)
    .paddingInner(1)
    .round(true)
    (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value))

  private getArvoreAutorias(autorias: Autoria[]): ArvoreAutorias {
    const arvoreAutorias: ArvoreAutorias = {titulo: 'Total', id: 0, children: []};
    const autoriasPorId = d3.group(autorias, d => d.id_leggo);
    autoriasPorId.forEach((autoria, idLeggo) => {
      const tipos = [];
      const documentosPorTipo = d3.group(autoria, d => d.tipo_documento);
      documentosPorTipo.forEach((documento, tipo) => {
        tipos.push({
          titulo: tipo,
          id: idLeggo,
          value: documento.length
        });
      });
      arvoreAutorias.children.push({
        titulo: `Proposição ${idLeggo.toString()}`,
        id: idLeggo,
        children: tipos
      });
    });
    console.log(arvoreAutorias);
    return arvoreAutorias;
  }

  private carregaVisAtividade() {
    this.atorService.getAutorias(this.idAtor)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(autorias => {
        // Transforma dados tabulares em árvore
        const arvoreAutorias = this.getArvoreAutorias(autorias);
        // Inicializa visualização
        this.gPrincipal = this.svg.append('g')
          .call(g => this.atualizaVisAtividade(g, arvoreAutorias));
    });
  }

  private atualizaVisAtividade(g, data) {
    const root = this.treemap(data);

    const color = d3.scaleSequential(d3.interpolateRgb('green', 'white'));

    const node = g.selectAll('g')
        .data(d3.nest().key(d => d.data.titulo).entries(root.descendants()))
        .join('g')
        .selectAll('g')
        .data(d => d.values)
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    node.append('rect')
        .attr('id', d => (d.data.titulo))
        .attr('fill', d => color(d.height)) // color
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0);

    node.append('text')
        .selectAll('tspan')
        .data(d => d.data.titulo.split(/(?=[A-Z][^A-Z])/g).concat(`- ${d.value}`))
        .join('tspan')
        .attr('fill-opacity', 0.9)
        .attr('transform', `translate(0, 15)`)
        .text(d => d);

    node.filter(d => d.children).selectAll('tspan')
        .attr('dx', 3)
        .attr('y', 13);

    node.filter(d => !d.children).selectAll('tspan')
        .attr('x', 3)
        .attr('y', (d, i, nodes) => `${(nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`);

    return g.node();
  }
}
