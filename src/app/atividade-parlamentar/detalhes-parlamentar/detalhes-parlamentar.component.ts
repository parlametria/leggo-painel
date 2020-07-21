import { Component, OnInit, ɵSWITCH_COMPILE_DIRECTIVE__POST_R3__ } from '@angular/core';

import { AtorService } from '../../shared/services/ator.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { Ator } from 'src/app/shared/models/ator.model';
import { AtorAgregado } from 'src/app/shared/models/atorAgregado.model';
@Component({
  selector: 'app-detalhes-parlamentar',
  templateUrl: './detalhes-parlamentar.component.html',
  styleUrls: ['./detalhes-parlamentar.component.scss']
})
export class DetalhesParlamentarComponent implements OnInit {

  private unsubscribe = new Subject();
  p = 1;

  public parlamentar: AtorAgregado;
  public idAtor: string;
  public interesse: string;
  public urlFoto: string;

  constructor(
    private atorService: AtorService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
        this.interesse = params.get('interesse');
      });
    this.getDadosParlamentar(this.idAtor, this.interesse);
  }

  getDadosParlamentar(idParlamentar, interesse) {
    forkJoin(
      [
        this.atorService.getAtor(idParlamentar),
        this.atorService.getPesoPolitico(),
        this.atorService.getAtoresAgregados(interesse),
        this.atorService.getComissaoPresidencia(),
        this.atorService.getAtoresRelatores(this.interesse),
        this.atorService.getAutoriasAgregadas(this.interesse)
      ]
    ).pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        const ator: any = data[0][0];
        const pesoPolitico: any = data[1];
        const atores: any = data[2];
        const comissaoPresidencia: any = data[3];
        const atoresRelatores: any = data[4];
        const autoriasAgregadas: any = data[5];

        const parlamentares = atores.map(a => ({
          ...autoriasAgregadas.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...comissaoPresidencia.find(p => a.id_autor_parlametria === p.id_autor_voz),
          ...atoresRelatores.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...pesoPolitico.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...a
        }));

        const pesos = atores.map(p => +p.peso_documentos);
        const pesosPoliticos = pesoPolitico.map(p => {
          if (p.peso_politico) {
            return +p.peso_politico;
          }
          return 0;
        });

        parlamentares.forEach(p => {
          p.atividade_parlamentar = this.normalizarAtividade(p.peso_documentos, Math.min(...pesos), Math.max(...pesos));
          p.peso_politico = this.normalizarPesoPolitico(p.peso_politico, Math.max(...pesosPoliticos));
        });

        this.parlamentar = parlamentares.find(p => p.id_autor_parlametria == idParlamentar);
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

  normalizarAtividade(metrica: number, min: number, max: number): number {
    return (metrica - min) / (max - min);
  }


  getUrlFoto(): void {
    const urlSenado = `https://www.senado.leg.br/senadores/img/fotos-oficiais/senador${this.parlamentar.id_autor}.jpg`;
    const urlCamara = `https://www.camara.leg.br/internet/deputado/bandep/${this.parlamentar.id_autor}.jpg`;
    this.urlFoto = this.parlamentar.casa === 'camara' ? urlCamara : urlSenado;
  }
}
