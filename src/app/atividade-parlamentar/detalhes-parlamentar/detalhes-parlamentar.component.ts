import { Component, OnInit, ɵSWITCH_COMPILE_DIRECTIVE__POST_R3__ } from '@angular/core';

import { AtorService } from '../../shared/services/ator.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { Ator } from 'src/app/shared/models/ator.model';
import { Autoria, ArvoreAutorias } from 'src/app/shared/models/autoria.model';

// Importa componentes do d3
import { select, selectAll } from 'd3-selection';
import { group } from 'd3-array';
import { hierarchy, treemap, treemapBinary, HierarchyRectangularNode } from 'd3-hierarchy';
const d3 = Object.assign({}, {
  select,
  selectAll,
  group,
  hierarchy,
  treemap,
  treemapBinary
});

@Component({
  selector: 'app-detalhes-parlamentar',
  templateUrl: './detalhes-parlamentar.component.html',
  styleUrls: ['./detalhes-parlamentar.component.scss']
})
export class DetalhesParlamentarComponent implements OnInit {

  private unsubscribe = new Subject();

  public parlamentar: Ator;
  public idAtor: string;
  public interesse: string;
  public urlFoto: string;
  public autorias: Map<number, Autoria[]>;

  constructor(
    private atorService: AtorService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
        this.interesse = params.get('interesse');
      });
    this.getDadosParlamentar();
    this.renderVisAtividade();
  }

  getDadosParlamentar(): void {
    forkJoin(
      [
        this.atorService.getAtor(this.idAtor),
        this.atorService.getRelatoriasDetalhadaById(this.interesse, this.idAtor)
      ]
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(parlamentar => {
        const ator: any = parlamentar[0];
        const ids: any = parlamentar[1][0].ids_relatorias;
        const quant: any = parlamentar[1][0].quantidade_relatorias;
        this.parlamentar = ator.map(a => ({
          ...a,
          ids_relatorias: ids,
          quantidade_relatorias: quant
        }));
        // this.parlamentar = {...ator, ids_relatorias: ids, quantidade_relatorias: quant};
        this.getUrlFoto();
    });
  }

  getUrlFoto(): void {
    const urlSenado = `https://www.senado.leg.br/senadores/img/fotos-oficiais/senador${this.parlamentar[0].id_ext}.jpg`;
    const urlCamara = `https://www.camara.leg.br/internet/deputado/bandep/${this.parlamentar[0].id_autor}.jpg`;
    this.urlFoto = this.parlamentar[0].casa === 'camara' ? urlCamara : urlSenado;
  }

  renderVisAtividade(): void {
    const W = window.innerWidth;
    const H = W > 700 ? 350 : 500;

    const svg = d3.select('#vis-atividade-parlamentar')
      .append('svg')
      .attr('viewBox', `0 0 ${W} ${H}`);

    this.atorService.getAutorias(this.idAtor)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(autorias => {
        this.autorias = d3.group(autorias, documento => documento.id_leggo);

        // Cria dados compatíveis com o treemap
        const arvoreAutorias: ArvoreAutorias = {parent: 'root', children: []};
        this.autorias.forEach((filhos, doc) => {
          arvoreAutorias.children.push({
            parent: doc.toString(),
            value: filhos.length
          });
        });

        // Cria função de treemap
        const tm = data => d3.treemap()
          .tile(d3.treemapBinary)
          .size([W, H])
          .padding(1)
          .round(true)
          (d3.hierarchy(arvoreAutorias)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value));

        // Desenha treemap
        const root: HierarchyRectangularNode<ArvoreAutorias> = tm(arvoreAutorias);
        console.log(root.leaves());
        svg
          .selectAll('g')
          .data(root.leaves())
          .join('g')
          .attr('transform', d => `translate(${d.x0},${d.y0})`)
          .attr('cursor', 'pointer')
          .call(g => {
            g.append('rect')
            .attr('id', d => `leaf-${d.data.parent}`)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .style('stroke', 'white')
            .style('fill', '#43a467');
          })
          .call(g => {
            g.append('clipPath')
            .attr('id', d => `clip-${d.data.parent}`)
            .append('use')
            .attr('xlink:href', d => `leaf-${d.data.parent}`);
          })
          .call(g => {
            g.append('text')
            .attr('clip-path', d => `clip-${d.data.parent}`)
            .selectAll('tspan')
            .data(d => `Proposição ${d.data.parent} (${d.data.value})`.split(/(?=[A-Z][a-z])|\s+/g))
            .join('tspan')
              .attr('x', 3)
              .attr('y', (d, i, nodes) => `${(i === nodes.length - 1 ? 0.3 : 0) + 1.1 + i}em`)
              .attr('fill-opacity', (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
              .attr('fill', 'white')
              .attr('text-decoration', (d, i, nodes) => i !== nodes.length - 1 ? 'underline' : null)
              .text(d => d);
          });
    });

  }
}
