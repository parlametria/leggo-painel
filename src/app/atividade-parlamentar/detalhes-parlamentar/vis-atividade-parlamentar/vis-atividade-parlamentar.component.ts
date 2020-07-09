import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { AtorService } from 'src/app/shared/services/ator.service';

// Importa componentes do d3
import { select, selectAll } from 'd3-selection';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { group } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';

const d3 = Object.assign({}, {
    select,
    selectAll,
    scaleLinear,
    scaleBand,
    scaleOrdinal,
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
        this.altura = 140;
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
            .style('fill', d => myColor(d.tipo_documento));

        // Barra - ator atual
        chart.append('g').attr('transform', `translate(0, -5)`)
            .selectAll('rect').data(dados.filter(d => d.id_autor_parlametria === id)).join('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.num_documentos))
            .attr('y', d => y(d.tipo_documento) - 1.5)
            .attr('width', 4)
            .attr('height', 15)
            .style('fill', 'black');
    }

}
