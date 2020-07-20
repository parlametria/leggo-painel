import { Component, OnInit, ɵSWITCH_COMPILE_DIRECTIVE__POST_R3__ } from '@angular/core';

import { AtorService } from '../../shared/services/ator.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { Ator } from 'src/app/shared/models/ator.model';
import { Autoria } from 'src/app/shared/models/autoria.model';

@Component({
  selector: 'app-detalhes-parlamentar',
  templateUrl: './detalhes-parlamentar.component.html',
  styleUrls: ['./detalhes-parlamentar.component.scss']
})
export class DetalhesParlamentarComponent implements OnInit {

  private unsubscribe = new Subject();

  public parlamentar: Ator;
  public nomesRelatorias: string[];
  public autorias: Autoria[];
  public idAtor: string;
  public interesse: string;
  public urlFoto: string;
  public nomesComissoes: string[];
  info: any;

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
        this.atorService.getRelatoriasDetalhadaById(this.interesse, idParlamentar),
        this.atorService.getComissaoDetalhadaById(idParlamentar),
        this.atorService.getAutorias(idParlamentar)
      ]
    ).pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        const ator: any = data[0][0];
        const pesoPolitico: any = data[1];
        let ids = [];
        let quant = 0;
        if (data[2] !== undefined) {
          ids = data[2][0].ids_relatorias;
          quant = data[2][0].quantidade_relatorias;
        }
        let idComissao = 0;
        let info = '';
        let quantComissao = 0;
        if (data[3].length !== 0) {
          idComissao = data[3][0].id_comissao;
          info = data[3][0].info_comissao;
          quantComissao = data[3][0].quantidade_comissao_presidente;
        }
        this.nomesComissoes = [];
        this.autorias = data[4];

        const parlamentar = [ator].map(a => ({
          ...pesoPolitico.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ids_relatorias: ids,
          quantidade_relatorias: quant,
          id_comissao: idComissao,
          quantidade_comissao_presidente: quantComissao,
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
        this.nomesComissoes.push(info);
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
