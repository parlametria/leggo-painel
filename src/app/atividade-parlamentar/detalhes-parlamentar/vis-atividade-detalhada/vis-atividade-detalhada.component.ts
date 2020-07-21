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
      const tipos = [{
        titulo: 'Outros',
        id: 0,
        value: 0,
        quantidade: 0,
        categoria: 'Outros'
      }];
      const documentosPorTipo = d3.group(autoria, d => d.tipo_documento);
      documentosPorTipo.forEach((documento, tipo) => {
        if (tipo === 'Emenda' || tipo === 'Requerimento') {
          tipos.push({
            titulo: tipo,
            id: idLeggo,
            value: parseFloat(this.somaPesos(documento).toFixed(2)),
            quantidade: documento.length,
            categoria: tipo
          });
        } else {
          tipos[0] = ({
            titulo: 'Outros',
            id: 0,
            value: parseFloat((this.somaPesos(documento) + tipos[0].value).toFixed(2)),
            quantidade: documento.length + tipos[0].quantidade,
            categoria: 'Outros'
          });
        }
      });
      arvoreAutorias.children.push({
        titulo: `Proposição ${idLeggo.toString()}`,
        id: idLeggo,
        children: tipos,
        categoria: 'Proposição'
      });
    });
    console.log(arvoreAutorias);
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

    const myColor = d3.scaleOrdinal().domain(['Total', 'Proposição', 'Outros', 'Prop. Original / Apensada', 'Voto em Separado', 'Parecer', 'Requerimento', 'Emenda'])
            .range(['white', 'white', '#959D97', '#959D97', '#959D97', '#959D97', '#6CA17F', '#4A8D7F']);

    const node = g.selectAll('g')
        .data(d3.nest().key((d: any) => d.data.titulo).entries(root.descendants()))
        .join('g')
        .selectAll('g')
        .data(d => d.values)
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    node.append('title')
        .text(d => `${d.ancestors().reverse().map(t => t.data.titulo).join('/')}\n${d.value}`);

    node.append('rect')
        .attr('id', d => (d.data.titulo))
        .style('stroke', d => d.data.categoria === 'Proposição' ? 'black' : 0)
        .style('fill', d => myColor(d.data.categoria)) // color
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0);

    node.append('text')
        .selectAll('tspan')
        .data(d => {
          if (d.data.titulo !== 'Total') {
            if (d.data.categoria === 'Proposição') {
              const quant = this.quantTotal(d.data.children);
              return d.data.titulo.split(/(?=[A-Z][^A-Z])/g).concat(`(${quant} ${quant > 1 ? 'ações' : 'ação'})`);
            }
            return d.data.titulo.split(/(?=[A-Z][^A-Z])/g).concat(`(${d.value})`);
          } else {
            return '';
          }
        })
        .join('tspan')
        .attr('transform', `translate(0, 15)`)
        .text(d => d);

    node.selectAll('text')
        .style('opacity', d => {
          if (d.data.categoria === 'Proposição') {
            return 0.9;
          }
          if (d.x1 - d.x0  >= 150) {
            if (d.y1 - d.y0 >= 40) {
              return 0.9;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        });

    node.filter(d => d.children).selectAll('tspan')
        .attr('dx', 3)
        .attr('y', 13);

    node.filter(d => !d.children).selectAll('tspan')
        .attr('x', 3)
        .attr('y', (d, i, nodes) => `${(nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`);

    return g.node();
  }

  private quantTotal(children): number {
    let quantTotal = 0;
    children.forEach(doc => {
      quantTotal += doc.quantidade;
    });
    return quantTotal;
  }
}
