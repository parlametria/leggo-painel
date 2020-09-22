import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { Autoria, ArvoreAutorias } from 'src/app/shared/models/autoria.model';
import { AutoriasService } from 'src/app/shared/services/autorias.service';


// Importa componentes do d3
import { select, selectAll, event } from 'd3-selection';
import { transition } from 'd3-transition';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
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
  scaleOrdinal,
  group,
  hierarchy,
  quantize,
  interpolateRgb,
  treemap,
  nest,
  event
});

@Component({
  selector: 'app-vis-atividade-detalhada',
  template: '<div id="vis-atividade-detalhada"></div>',
  styleUrls: ['./vis-atividade-detalhada.component.scss']
})
export class VisAtividadeDetalhadaComponent implements OnInit {

  @Input() larguraJanela: number;
  @Input() idAtor: number;
  @Input() interesse: string;

  private unsubscribe = new Subject();

  private largura: number;
  private altura: number;
  private x: any;
  private y: any;
  private svg: any;
  private gPrincipal: any;
  private tema: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private autoriasService: AutoriasService
  ) { }

  ngOnInit(): void {
    this.largura = (window.innerWidth > 1100) ? 1100 : window.innerWidth;
    this.altura = this.largura > 700 ? 450 : 550;
    this.x = d3.scaleLinear().rangeRound([0, this.largura]);
    this.y = d3.scaleLinear().rangeRound([0, this.altura]);
    this.svg = d3.select('#vis-atividade-detalhada').append('svg')
      .attr('viewBox', `0.5 0 ${this.largura} ${this.altura}`);
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.tema = params.tema;
        this.tema === undefined ? this.tema = '' : this.tema = this.tema;
        this.carregaVisAtividade();
      });
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
    const arvoreAutorias: ArvoreAutorias = { titulo: 'Total', id: 0, children: [], categoria: 'Total' };
    const autoriasPorId = d3.group(autorias, d => d.id_leggo);
    autoriasPorId.forEach((autoria, idLeggo) => {
      const tipos = [];
      const documentosPorTipo = d3.group(autoria, d => d.tipo_acao);
      documentosPorTipo.forEach((documento, tipo) => {
        tipos.push({
          titulo: tipo,
          id: idLeggo,
          value: parseFloat(this.somaPesos(documento).toFixed(2)),
          quantidade: documento.length,
          categoria: tipo
        });
      });
      arvoreAutorias.children.push({
        titulo: `Proposta ${idLeggo.toString()}`,
        id: idLeggo,
        children: tipos,
        categoria: 'Proposta',
        sigla: autoria[0].sigla
      });
    });
    return arvoreAutorias;
  }

  private somaPesos(documento): number {
    let pesoTotal = 0;
    documento.forEach(doc => {
      pesoTotal += doc.peso_autor_documento;
    });
    return pesoTotal;
  }

  private carregaVisAtividade() {
    this.autoriasService.getAutorias(this.idAtor, this.interesse, this.tema)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(autorias => {
        const autoriasApresentadas = [];
        autorias.forEach(dado => {
          if (dado.tipo_acao === 'Proposição') {
            autoriasApresentadas.push(dado);
          }
        });
        // Transforma dados tabulares em árvore
        const arvoreAutorias = this.getArvoreAutorias(autoriasApresentadas);
        // Inicializa visualização
        if (this.gPrincipal) {
          this.gPrincipal.selectAll('*').remove();
        }
        this.gPrincipal = this.svg.append('g')
          .call(g => this.atualizaVisAtividade(g, arvoreAutorias));
      });
  }

  private atualizaVisAtividade(g, data) {
    const root = this.treemap(data);

    const myColor = d3.scaleOrdinal().domain(['Total', 'Proposta'])
      .range(['white', '#86BFB4', '#86BFB4']);

    const node = g.selectAll('g')
      .data(d3.nest().key((d: any) => d.data.titulo).entries(root.descendants()))
      .join('g')
      .selectAll('g')
      .data(d => d.values)
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('font-size', '12px')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .attr('data-html', 'true')
      .style('visibility', 'hidden');

    node.append('rect')
      .attr('id', d => (d.data.titulo))
      .style('fill', d => myColor(d.data.categoria)) // color
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => {
        if (d.data.categoria === 'Proposta') {
          return d.y1 - d.y0;
        } else {
          if ((d.y1 - 3) - (d.y0 + 3) >= 0) {
            return (d.y1 - 3) - (d.y0 + 3);
          } else {
            return 0;
          }
        }
      })
      .attr('transform', d => d.data.categoria === 'Proposta' ? '' : 'translate(0, 6)')
      .on('mouseover', d => {
        if (d.data.categoria !== 'Total' && d.data.categoria !== 'Proposta') {
          tooltip.style('visibility', 'visible')
            .style('width', '140px')
            .style('height', '100px')
            .html(this.tooltipText(d));
        }
      })
      .on('mousemove', d => {
        if (d.data.categoria !== 'Total' && d.data.categoria !== 'Proposta') {
          tooltip.style('top', (event.pageY - 10) + 'px')
            .style('left', (event.pageX + 10) + 'px')
            .html(this.tooltipText(d));
        }
      })
      .on('mouseout', () => tooltip.style('visibility', 'hidden'));

    node.append('text')
      .selectAll('tspan')
      .data(d => {
        if (d.data.titulo !== 'Total') {
          if (d.data.categoria === 'Proposta') {
            return d.data.sigla.split(/(?=[a-z][^a-z])/g).concat(` (${d.value} ${d.value > 1 ? 'ações' : 'ação'})`);
          }
          return d.data.titulo.split(/(?=[a-z][^a-z])/g).concat(`(${d.value})`);
        } else {
          return '';
        }
      })
      .join('tspan')
      .text(d => d)
      .attr('transform', `translate(0, 15)`);

    node.selectAll('text')
      .style('visibility', d => d.data.categoria === 'Proposta' ? 'visible' : 'hidden')
      .attr('transform', 'translate(5, 2)');

    node.filter(d => d.children).selectAll('tspan')
      .style('fill', 'white');

    node.filter(d => d.children).select('tspan')
      .attr('dx', 3)
      .attr('y', 15)
      .style('font-weight', d => d.data.categoria === 'Proposta' ? 'bold' : '');

    node.filter(d => d.children).select('tspan:nth-child(2)')
      .style('opacity', 0.8);

    node.filter(d => !d.children).select('tspan')
      .attr('dx', 3)
      .attr('y', 15)
      .style('fill', '#333333');

    node.filter(d => !d.children).selectAll('text')
      .attr('transform', 'translate(5, 10)');

    node.filter(d => !d.children).select('tspan:nth-child(2)')
      .style('opacity', 0.8);

    return g.node();
  }

  private tooltipText(doc): any {
    let texto = '';
    doc.parent.children.forEach(prop => {
      if (prop.data.value !== 0) {
        if (prop.data.value <= 1) {
          texto += '<br>' + `${prop.data.value} ` + `${prop.data.categoria}`;
        } else {
          texto += '<br>' + `${prop.data.value} ` + `Proposições`;
        }
      }
    });
    return ('<p style="margin-top: 10px; margin-left: 5px;">' +
      '<b>' + `${doc.parent.data.sigla}` + '</b>' + texto + '</p>');
  }
}
