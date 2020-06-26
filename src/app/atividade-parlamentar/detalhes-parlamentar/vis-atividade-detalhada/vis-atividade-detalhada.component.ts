import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AtorService } from 'src/app/shared/services/ator.service';
import { Autoria, ArvoreAutorias } from 'src/app/shared/models/autoria.model';

// Importa componentes do d3
import { select, selectAll } from 'd3-selection';
import { transition } from 'd3-transition';
import { scaleLinear } from 'd3-scale';
import { interpolate } from 'd3-interpolate';
import { group } from 'd3-array';
import { timeParse } from 'd3-time-format';
import { hierarchy, treemap, treemapSquarify } from 'd3-hierarchy';
select.prototype.transition = transition;

const d3 = Object.assign({}, {
  select,
  selectAll,
  transition,
  scaleLinear,
  group,
  hierarchy,
  treemap,
  treemapSquarify,
  interpolate,
  timeParse
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

  private getArvoreAutorias(autorias: Autoria[]): ArvoreAutorias {
    const arvoreAutorias: ArvoreAutorias = {titulo: 'Todas', id: 0, children: []};
    const autoriasPorId = d3.group(autorias, d => d.id_leggo);
    autoriasPorId.forEach((autoria, idLeggo) => {
      const tipos = [];
      const documentosPorTipo = d3.group(autoria, d => d.tipo_documento);
      documentosPorTipo.forEach((documento, tipo) => {
        const documentos = [];
        documento.forEach(d => {
          documentos.push({
            titulo: d.descricao_tipo_documento,
            id: idLeggo,
            data: d.data,
            url: d.url_inteiro_teor,
            value: 1
          });
        });
        tipos.push({
          titulo: tipo,
          id: idLeggo,
          children: documentos
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
        // Cria função de treemap
        const tm = data => d3.treemap()
          .tile((node, x0, y0, x1, y1) => this.tile(node, x0, y0, x1, y1))
          (d3.hierarchy(arvoreAutorias)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value));
        // Inicializa visualização
        this.gPrincipal = this.svg.append('g')
          .call(g => this.atualizaVisAtividade(g, tm(arvoreAutorias)));
    });
  }

  private atualizaVisAtividade(g, root) {
    const node = g
      .selectAll('g')
      .data(root.children.concat(root))
      .join('g');

    node.filter(d => d === root ? d.parent : d.children)
      .attr('cursor', 'pointer')
      .on('click', d => d === root ? this.zoomout(d) : this.zoomin(d));

    node.append('title')
      .text(d => `${this.getTitulo(d)}`);

    node.append('rect')
      .attr('id', d => {
        return `leaf-${d.data.id}`;
      })
      .style('stroke', '#fff')
      .style('fill', d => d === root ? '#fff' : '#43a467');

    node.append('clipPath')
      .attr('id', d => `clip-${d.data.id}`)
      .append('use')
      .attr('xlink:href', d => `leaf-${d.data.id}`);

    node.append('text')
    .attr('clip-path', d => `clip-${d.data.id}`)
    .style('font-weight', d => d === root ? 'bold' : null)
    .style('fill', d => d === root ? '#212529' : '#fff')
      .selectAll('tspan')
      .data(d => this.getLabel(d, root))
      .join('tspan')
        .attr('x', 3)
        .attr('y', (d, i, nodes) => `${(i === nodes.length - 1 ? 0.3 : 0) + 1.1 + i}em`)
        .style('fill-opacity', (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .style('text-decoration', (d, i, nodes) => i !== nodes.length - 1 ? 'underline' : null)
        .text(d => d);

    g.call(gg => this.position(gg, root));
  }

  private getTitulo(dados) {
    return dados.ancestors().reverse().map(d => d.data.titulo).join('/');
  }

  private getLabel(dados, root) {
    if (dados === root) {
      return [dados.ancestors().reverse().map(d => d.data.titulo).join('/'), dados.value];
    } else if (dados.children) {
      return `${dados.data.titulo} (${dados.value})`.split(/(?=[A-Z][a-z])|\s+/g);
    } else {
      return [`${dados.data.titulo}`, `${d3.timeParse('%Y-%m-%d')(dados.data.data).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' })}`];
    }
  }

  private position(g, root) {
    g.selectAll('g')
        .attr('transform', d => d === root ? `translate(0,-45)` : `translate(${this.x(d.x0)},${this.y(d.y0)})`)
      .select('rect')
        .attr('width', d => d === root ? this.largura : this.x(d.x1) - this.x(d.x0))
        .attr('height', d => d === root ? 30 : this.y(d.y1) - this.y(d.y0));
  }

  private zoomin(dados) {
    const group0 = this.gPrincipal.attr('pointer-events', 'none');
    const group1 = this.gPrincipal = this.svg.append('g').call(g => this.atualizaVisAtividade(g, dados));

    this.x.domain([dados.x0, dados.x1]);
    this.y.domain([dados.y0, dados.y1]);

    this.svg.transition()
        .duration(750)
        .call(t => group0.transition(t).remove()
          .call(g => this.position(g, dados.parent)))
        .call(t => group1.transition(t)
          .attrTween('opacity', () => d3.interpolate(0, 1))
          .call(g => this.position(g, dados)));
  }

  private zoomout(dados) {
    const group0 = this.gPrincipal.attr('pointer-events', 'none');
    const group1 = this.gPrincipal = this.svg.insert('g', '*').call(g => this.atualizaVisAtividade(g, dados.parent));

    this.x.domain([dados.parent.x0, dados.parent.x1]);
    this.y.domain([dados.parent.y0, dados.parent.y1]);

    this.svg.transition()
        .duration(750)
        .call(t => group0.transition(t).remove()
          .attrTween('opacity', () => d3.interpolate(1, 0))
          .call(g => this.position(g, dados)))
        .call(t => group1.transition(t)
          .call(g => this.position(g, dados.parent)));
  }

  private tile(node, x0, y0, x1, y1) {
    // Adapta o treemapBinary para a proporção de tela correta
    // depois de aumentar/diminuir o zoom
    d3.treemapSquarify(node, 0, 0, this.largura, this.altura);
    for (const child of node.children) {
      child.x0 = x0 + child.x0 / this.largura * (x1 - x0);
      child.x1 = x0 + child.x1 / this.largura * (x1 - x0);
      child.y0 = y0 + child.y0 / this.altura * (y1 - y0);
      child.y1 = y0 + child.y1 / this.altura * (y1 - y0);
    }
  }
}
