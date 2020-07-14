import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AtorService } from 'src/app/shared/services/ator.service';
import { Autoria, ArvoreAutorias } from 'src/app/shared/models/autoria.model';

// Importa componentes do d3
import { select, selectAll } from 'd3-selection';
import { transition } from 'd3-transition';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { quantize, interpolateRgb } from 'd3-interpolate';
import { group } from 'd3-array';
import { partition, hierarchy } from 'd3-hierarchy';
select.prototype.transition = transition;

const d3 = Object.assign({}, {
  partition,
  select,
  selectAll,
  transition,
  scaleLinear,
  group,
  hierarchy,
  scaleOrdinal,
  quantize,
  interpolateRgb
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
    this.altura = this.largura > 700 ? 400 : 500;
    this.x = d3.scaleLinear().rangeRound([0, this.largura]);
    this.y = d3.scaleLinear().rangeRound([0, this.altura]);
    this.svg  = d3.select('#vis-atividade-detalhada').append('svg')
      .attr('viewBox', `0.5 -40.5 ${this.largura} ${this.altura + 40.5}`);
    this.carregaVisAtividade();
  }

  private partition = data => d3.partition()
    .size([this.altura, this.largura])
    .padding(1)
    (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value))

  private getArvoreAutorias(autorias: Autoria[]): ArvoreAutorias {
    const arvoreAutorias: ArvoreAutorias = {titulo: 'Todas', id: 0, children: []};
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
    const root = this.partition(data);
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRgb('#4A8D7F', '#6CA17F'), data.children.length + 1));

    const cell = g
      .selectAll('g')
      .data(root.descendants())
      .join('g')
        .attr('transform', d => `translate(${d.y0},${d.x0})`);

    cell.append('rect')
        .attr('width', d => d.y1 - d.y0)
        .attr('height', d => d.x1 - d.x0)
        .attr('fill-opacity', 0.6)
        .attr('fill', d => {
          if (!d.depth) {
            return '#959D97';
          }
          while (d.depth > 1) {
            d = d.parent;
          }
          return color(d.data.titulo);
        });

    const text = cell.filter(d => (d.x1 - d.x0) > 16).append('text')
        .attr('x', 4)
        .attr('y', 13);

    text.append('tspan')
        .text(d => d.data.titulo);

    text.append('tspan')
        .attr('fill-opacity', 0.7)
        .text(d => ` ${d.value}`);

    cell.append('title')
        .text(d => `${d.ancestors().map(t => t.data.titulo).reverse().join('/')}\n${d.value}`);

    return g.node();
  }
}
