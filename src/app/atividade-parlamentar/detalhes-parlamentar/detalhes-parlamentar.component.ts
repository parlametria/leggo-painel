import { Component, OnInit, ɵSWITCH_COMPILE_DIRECTIVE__POST_R3__ } from '@angular/core';

import { AtorService } from '../../shared/services/ator.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { Ator } from 'src/app/shared/models/ator.model';

@Component({
  selector: 'app-detalhes-parlamentar',
  templateUrl: './detalhes-parlamentar.component.html',
  styleUrls: ['./detalhes-parlamentar.component.scss']
})
export class DetalhesParlamentarComponent implements OnInit {

  private unsubscribe = new Subject();

  public parlamentar: Ator;
  public nomesRelatorias: string[];
  public idAtor: string;
  public interesse: string;
  public urlFoto: string;

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
    this.getDadosParlamentar(this.idAtor);
  }

  getDadosParlamentar(idParlamentar) {
    forkJoin(
      [
        this.atorService.getAtor(idParlamentar),
        this.atorService.getPesoPolitico(),
        this.atorService.getRelatoriasDetalhadaById(this.interesse, this.idAtor)
      ]
    ).pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        const ator: any = data[0][0];
        const pesoPolitico: any = data[1];
        const ids: any = data[2][0].ids_relatorias;
        const quant: any = data[2][0].quantidade_relatorias;

        const parlamentar = [ator].map(a => ({
          ...pesoPolitico.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ids_relatorias: ids,
          quantidade_relatorias: quant,
          ...a
        }));

        const pesosPoliticos = pesoPolitico.map(p => {
          if (p.peso_politico) {
            return +p.peso_politico;
          }
          return 0;
        });

        this.nomesRelatorias = [];
        ids.forEach(id => {
          this.atorService.getProposicoesById(this.interesse, id.id_leggo)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(idProp => {
              this.nomesRelatorias.push(idProp[0].etapas[0].sigla);
            });
        });

        parlamentar.forEach(p => {
          p.peso_politico = this.normalizarPesoPolitico(p.peso_politico, Math.max(...pesosPoliticos));
        });

        this.parlamentar = parlamentar[0];
        this.getUrlFoto();
      },
        error => {
          console.log(error);
        }
      );
  }

  normalizarPesoPolitico(metrica: number, max: number): number {
    if (max !== 0) {
      return (metrica / max);
    }
    return 0;
  }

  getUrlFoto(): void {
    const urlSenado = `https://www.senado.leg.br/senadores/img/fotos-oficiais/senador${this.parlamentar.id_autor}.jpg`;
    const urlCamara = `https://www.camara.leg.br/internet/deputado/bandep/${this.parlamentar.id_autor}.jpg`;
    this.urlFoto = this.parlamentar.casa === 'camara' ? urlCamara : urlSenado;
  }
}
