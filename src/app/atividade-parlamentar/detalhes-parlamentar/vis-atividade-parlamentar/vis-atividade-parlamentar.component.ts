import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

// Importa componentes do d3
import { select, selectAll, mouse } from 'd3-selection';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { group } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { hsl } from 'd3-color';
import { path } from 'd3-path';

import { AutoriasService } from 'src/app/shared/services/autorias.service';

const d3 = Object.assign({}, {
    select,
    selectAll,
    scaleLinear,
    scaleBand,
    scaleOrdinal,
    group,
    axisLeft,
    axisBottom,
    mouse,
    hsl,
    path
});

@Component({
    selector: 'app-vis-atividade-parlamentar',
    templateUrl: './vis-atividade-parlamentar.component.html',
    styleUrls: ['./vis-atividade-parlamentar.component.scss']
})

export class VisAtividadeParlamentarComponent implements OnInit {

    @Input() idAtor: number;
    @Input() interesse: string;

    private unsubscribe = new Subject();

    private largura: number;
    private altura: number;
    private gPrincipal: any;
    private margin: any;
    private x: any;
    private y: any;
    private svg: any;
    private tema: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private autoriaService: AutoriasService
    ) { }

    ngOnInit(): void {
        this.largura = window.innerWidth / 2;
        this.altura = 220;
        this.margin = ({
            top: 0,
            right: 30,
            bottom: 90,
            left: 70
        });
        this.x = d3.scaleLinear()
            .range([0, this.largura - this.margin.right - this.margin.left]);
        this.y = d3.scaleBand()
            .rangeRound([this.altura - this.margin.top - this.margin.bottom, 0]);
        this.svg  = d3.select('#vis-atividade-parlamentar').append('svg')
          .attr('viewBox', `0 0 ${this.largura} ${this.altura / 1.3}`);
        this.activatedRoute.queryParams
          .subscribe(params => {
            this.tema = params.tema;
            this.tema === undefined ? this.tema = '' : this.tema = this.tema;
            this.carregaVisAtividade();
          });
    }

    private carregaVisAtividade() {
        this.autoriaService.getAcoes(this.interesse, this.tema)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(acoes => {
            const quantDomain = [];
            acoes.forEach(dado => {
                quantDomain.push(dado.peso_total);
            });
            const maxQuant = Math.max(...quantDomain);

            if (this.gPrincipal) {
              this.gPrincipal.selectAll('*').remove();
            }
            this.gPrincipal = this.svg.append('g')
                .call(g => this.atualizaVisAtividade(g, acoes, maxQuant));
        });

    }

    private atualizaVisAtividade(g, dados, maxQuant) {
        const id = Number(this.idAtor);
        const domainDoc = ['Outros', 'Requerimento', 'Emenda'];
        const chart = g
            .attr('id', 'chart')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top * 3})`);

        const x = this.x
            .domain([0, maxQuant]);

        const y = this.y.padding(1)
            .domain(domainDoc);

        // Eixo x
        chart.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0, ${this.altura - (this.margin.bottom * 1.1)})`)
            .call(d3.axisBottom(x).ticks(6));

        chart.append('text')
        .attr('transform',
                'translate(' + (this.largura / 2.5) + ' ,' +
                                ((this.altura / 1.4) - this.margin.top) + ')')
        .style('text-anchor', 'middle')
        .style('font-size', '11px')
        .text('Ações');

        // Eixo y
        chart.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y).tickSize(0))
            .select('.domain').remove();

        const myColor = d3.scaleOrdinal().domain(domainDoc)
            .range(['#C9ECB4', '#9DD8AC', '#8DBFB5']);

        // Barras - outros atores
        chart.append('g').attr('transform', `translate(0, -5)`)
            .selectAll('rect').data(dados).join('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.peso_total))
            .attr('y', d => y(d.tipo_acao))
            .attr('width', 2)
            .attr('height', 12)
            .style('fill-opacity', 0.4)
            .style('fill', d => myColor(d.tipo_acao))
            .on('mouseover mousemove', d => this.onHover(d))
            .on('mouseout', d => d3.selectAll('.tooltip').style('opacity', 0));

        const atorAtual = dados.filter(d => d.id_autor_parlametria === id);
        const tiposExistentes = atorAtual.map(d => d.tipo_acao);
        const difference = domainDoc.filter(d => !tiposExistentes.includes(d));
        difference.forEach(falta => atorAtual.push({ tipo_acao: falta, peso_total: 0}));

        // Barra - ator atual
        chart.append('g').attr('transform', `translate(0, -5)`)
            .selectAll('rect').data(atorAtual).join('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.peso_total))
            .attr('y', d => y(d.tipo_acao) - 1.5)
            .attr('width', 4)
            .attr('height', 15)
            .style('fill', 'black')
            .on('mouseover mousemove', d => this.onHover(d))
            .on('mouseout', d => d3.selectAll('.tooltip').style('opacity', 0));

        // Tooltip
        chart.append('g').attr('transform', `translate(0, -5)`)
            .selectAll('text')
            .data(atorAtual)
            .join('text')
            .attr('class', 'tooltip')
            .attr('id', d => `${d.tipo_acao}-tooltip`)
            .attr('x', d => x(d.peso_total) - 50)
            .attr('y', d => y(d.tipo_acao) - 13)
            .style('opacity', d => d.tipo_acao === 'Emenda' ? 1 : 0)
            .style('pointer-events', 'none')
            .style('font-size', '7px')
            .text(d => this.tooltip(d))
            .call(this.wrap);
    }

    private onHover(d) {
        d3.select(`#${d.tipo_acao}-tooltip`)
        .style('opacity', 1);
    }

    private tooltip(d) {
        if (d.ranking_documentos === undefined) {
            return 'O parlamentar não possui este tipo de ação';
        } else {
            return `${d.ranking_documentos}º lugar em apresentação de
            ${d.tipo_acao === 'Outros' ? d.tipo_acao.toLowerCase() : d.tipo_acao.toLowerCase() + `s`} nesta agenda`;
        }
    }

    // Wraps tooltip description text
    private wrap(text) {
        text.each(function() {
            const texto = d3.select(this);
            const words = texto.text().split(/\s+/).reverse();
            let word;
            let line = [];
            let lineNumber = 0;
            const lineHeight = 0; // ems
            const x = texto.attr('x');
            const y = texto.attr('y');
            const dy = 1.1;
            let tspan = texto.text(null).append('tspan').attr('x', x).attr('y', y);

            while (words.length !== 0) {
                word = words.pop();
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.text().length >= 33) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = texto.append('tspan')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                        .text(word);
                }
            }
        });
    }

}
