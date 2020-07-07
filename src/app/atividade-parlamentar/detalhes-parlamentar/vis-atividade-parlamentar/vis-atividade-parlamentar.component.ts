import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AtorService } from 'src/app/shared/services/ator.service';
import { Autoria } from 'src/app/shared/models/autoria.model';

// Importa componentes do d3
import { select, selectAll } from 'd3-selection';
import { scaleLinear, scaleBand, scaleLog } from 'd3-scale';
import { group } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';

const d3 = Object.assign({}, {
    select,
    selectAll,
    scaleLinear,
    scaleBand,
    group,
    axisLeft,
    axisBottom
});

@Component({
    selector: 'app-vis-atividade-parlamentar',
    templateUrl: './vis-atividade-parlamentar.component.html',
    styleUrls: ['./vis-atividade-parlamentar.component.scss']
})

export class VisAtividadeParlamentarComponent implements OnInit {

    @Input() idAtor: string;

    private unsubscribe = new Subject();

    private largura: number;
    private altura: number;
    private gPrincipal: any;
    private margin: any;
    private x: any;
    private y: any;
    private svg: any;

    constructor(
        private atorService: AtorService
    ) { }

    ngOnInit(): void {
        this.largura = window.innerWidth / 2;
        this.altura = 190;
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

    private getAutorias(autorias: Autoria[]): any[] {
        const quantAutorias = [];
        const autoriasPorTipo = d3.group(autorias, d => d.tipo_documento);
        autoriasPorTipo.forEach(autoria => {
            quantAutorias.push({
                tipo: autoria[0].tipo_documento,
                quantAutorias: autoria.length
            });
        });
        return quantAutorias;
    }

    private carregaVisAtividade() {
        this.atorService.getAutorias(this.idAtor)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(autorias => {
            const dados = this.getAutorias(autorias);
            const quantDomain = [];
            const tipoDomain = [];
            dados.sort((a, b) => a.quantAutorias - b.quantAutorias);
            dados.forEach(dado => {
                tipoDomain.push(dado.tipo);
                quantDomain.push(dado.quantAutorias);
            });
            const maxQuant = Math.max(...quantDomain);
            this.gPrincipal = this.svg.append('g')
                .call(g => this.atualizaVisAtividade(g, tipoDomain, dados, maxQuant, quantDomain));
        });

    }

    private atualizaVisAtividade(g, tipoDomain, dados, maxQuant, quantDomain) {
        const chart = g
            .attr('id', 'chart')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        this.x.domain([0, maxQuant]);

        this.y.padding(1).domain(tipoDomain);

        const xAxis = chart.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0, ${this.altura - this.margin.top - this.margin.bottom})`)
            .call(d3.axisBottom(this.x).tickValues(quantDomain));

        const yAxis = chart.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(this.y).tickSize(0))
            .select('.domain').remove();

/*         const title = chart.append('text')
            .attr('transform', `translate(${(this.largura + this.margin.left + this.margin.right) / 2},20)`)
            .style('text-anchor', 'middle')
            .style('font-weight', 700)
            .text('Atividade por Tipo de Documento'); */

        const bars = chart.append('g').attr('transform', `translate(1, -5)`)
            .selectAll('rect').data(dados).join('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', (d) => this.y(d.tipo))
            .attr('width', (d) => this.x(d.quantAutorias))
            .attr('height', 12)
            .attr('fill', '#60b27b');
    }

}
