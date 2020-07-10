import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { AtorService } from 'src/app/shared/services/ator.service';

// Importa componentes do d3
import { select, selectAll, mouse } from 'd3-selection';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { group } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { hsl } from 'd3-color';
import { path } from 'd3-path';

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

    private unsubscribe = new Subject();

    idAtor: number;
    interesse: string;
    private largura: number;
    private altura: number;
    private gPrincipal: any;
    private margin: any;
    private x: any;
    private y: any;
    private svg: any;

    constructor(
        private atorService: AtorService, private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.activatedRoute.paramMap
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(params => {
                this.idAtor = parseInt(params.get('id'), 10);
                this.interesse = params.get('interesse');
        });
        this.largura = window.innerWidth / 2;
        this.altura = 240;
        this.margin = ({
            top: 20,
            right: 70,
            bottom: 40,
            left: 120
        });
        this.x = d3.scaleLinear()
            .range([0, this.largura - this.margin.right - this.margin.left]);
        this.y = d3.scaleBand()
            .rangeRound([this.altura - this.margin.top - this.margin.bottom, 0]);
        this.svg  = d3.select('#vis-atividade-parlamentar').append('svg')
          .attr('viewBox', `0 0 ${this.largura} ${this.altura}`);
        this.carregaVisAtividade();
    }

    private carregaVisAtividade() {
        this.atorService.getAcoes(this.interesse)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(acoes => {
            const quantDomain = [];
            acoes.forEach(dado => {
                quantDomain.push(dado.num_documentos);
            });
            const maxQuant = Math.max(...quantDomain);

            this.gPrincipal = this.svg.append('g')
                .call(g => this.atualizaVisAtividade(g, acoes, maxQuant));
        });

    }

    private atualizaVisAtividade(g, dados, maxQuant) {
        const id = this.idAtor;
        const chart = g
            .attr('id', 'chart')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        const x = this.x.domain([0, maxQuant]);

        const y = this.y.padding(1).domain(['Outros', 'Requerimento', 'Emenda']);

        // Eixo x
        chart.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0, ${this.altura - this.margin.top - this.margin.bottom})`)
            .call(d3.axisBottom(x));

        // Eixo y
        chart.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y).tickSize(0))
            .select('.domain').remove();

        const myColor = d3.scaleOrdinal().domain(['Outros', 'Requerimento', 'Emenda'])
            .range(['#959D97', '#6CA17F', '#4A8D7F']);

        // Barras - outros atores
        chart.append('g').attr('transform', `translate(0, -5)`)
            .selectAll('rect').data(dados).join('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.num_documentos))
            .attr('y', d => y(d.tipo_documento))
            .attr('width', 2)
            .attr('height', 12)
            .style('fill-opacity', 0.4)
            .style('fill', d => myColor(d.tipo_documento))
            .on('mouseover mousemove', d => this.onHover(d))
            .on('mouseout', d => d3.selectAll('.tooltip').style('opacity', 0));

        // Barra - ator atual
        chart.append('g').attr('transform', `translate(0, -5)`)
            .selectAll('rect').data(dados.filter(d => d.id_autor_parlametria === id)).join('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.num_documentos))
            .attr('y', d => y(d.tipo_documento) - 1.5)
            .attr('width', 4)
            .attr('height', 15)
            .style('fill', 'black')
            .on('mouseover mousemove', d => this.onHover(d))
            .on('mouseout', d => d3.selectAll('.tooltip').style('opacity', 0));

        chart.append('g').attr('transform', `translate(0, -5)`)
            .selectAll('text')
            .data(dados.filter(d => d.id_autor_parlametria === id))
            .join('text')
            .attr('class', 'tooltip')
            .attr('id', d => `${d.tipo_documento}-tooltip`)
            .attr('x', d => x(d.num_documentos))
            .attr('y', d => y(d.tipo_documento) - 1.5)
            .style('opacity', 0)
            .style('pointer-events', 'none')
            .style('font-size', '8px')
            .text(d => `${d.ranking_documentos} lugar em número de ${d.tipo_documento.toLowerCase()}s nesta agenda`) // tspan
            ;

    }

    private onHover(d) {
        d3.select(`#${d.tipo_documento}-tooltip`)
        .style('opacity', 1);
    }

    private onOut() {

    }

    private tooltipRanking(g, description, {
        title = null,
        hasPin = true,
        color = 'black',
        bgColor = 'white',
        width = 250,
        height = 100,
        padding = 10} = {}) {

        g.selectAll('*').remove();

        const p = d3.path();
        if (hasPin) {
            const pinSize = width / 12;
            p.moveTo(0, height);
            p.lineTo(0, 0);
            p.lineTo(width, 0);
            p.lineTo(width, height);
            p.lineTo(width / 2 + pinSize, height);
            p.lineTo(width / 2, height + pinSize);
            p.lineTo(width / 2 - pinSize, height);
            p.closePath();
        } else {
            p.moveTo(0, height);
            p.lineTo(0, 0);
            p.lineTo(width, 0);
            p.lineTo(width, height);
            p.closePath();
        }

        g
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('pointer-events', 'none')
        .style('font-family', 'Arial, sans-serif')
        .style('font-size', '16px')
        .style('font-weight', 400)
            .call(
            t => t.append('path')
                .attr('class', 'tooltip-background')
                .attr('d', p)
                .style('fill', bgColor)
                .style('stroke', d3.hsl(bgColor).darker())
                .style('stroke-width', 0.5)
            )
            .call(t =>
            t.append('text')
                .attr('class', 'tooltip-description')
                .attr('x', padding)
                .attr('y', title !== null ? 2 * padding + 16 : padding)
                .style('fill', d3.hsl(color).brighter())
                .style('font-size', '0.7em')
                .text(description)
//                .call(this.wrap, width - 2 * padding)
            );

        if (title !== null) {
            g
            .call(t =>
            t.append('text')
                .attr('class', 'tooltip-title')
                .attr('x', padding)
                .attr('y', 2.7 * padding)
                .style('fill', color)
                .style('font-size', '1em')
                .style('font-weight', 600)
                .text(title)
            );
        }
    }

    private updateTooltip(el,
                          tooltip,
                          isVisible,
                          {width = 250, height = 50, x = null, y = null} = {}) {

        if (x === null || y === null) {
          const xMouse = d3.mouse(el)[0];
          const yMouse = d3.mouse(el)[1];
          tooltip.attr('transform', `translate(${xMouse - width / 2}, ${yMouse - height - width / 10})`);
        } else {
          tooltip.attr('transform', `translate(${x}, ${y})`);
        }
        tooltip.style('opacity', isVisible ? 1 : 0);
    }
/*
    // Wraps tooltip description text
    private wrap(text, width) {
        text.each(function() {
            const texto = d3.select(this);
            const words = texto.text().split(/\s+/).reverse();
            let word;
            let line = [];
            let lineNumber = 0;
            const lineHeight = 1.1; // ems
            const x = texto.attr('x');
            const y = texto.attr('y');
            const dy = 1.1;
            let tspan = texto.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.text().length >= width / 5.5) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = texto.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
                }
            }
        });
    }
 */
}
