import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

import { group } from 'd3-array';

import { AutoriasService } from 'src/app/shared/services/autorias.service';

const d3 = Object.assign({}, { group });

@Component({
  selector: 'app-atividade-no-congresso',
  templateUrl: './atividade-no-congresso.component.html',
  styleUrls: ['./atividade-no-congresso.component.scss']
})
export class AtividadeNoCongressoComponent implements OnInit {

  private unsubscribe = new Subject();
  public idAtor: string;
  public interesse: string;
  public tema: string;
  public parlamentar: any;
  public infoTexto: string;
  public isLoading = new BehaviorSubject<boolean>(true);

  constructor(
    private activatedRoute: ActivatedRoute,
    private autoriaService: AutoriasService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
        this.interesse = params.get('interesse');
      });
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.tema = params.tema;
        this.tema === undefined ? this.tema = '' : this.tema = this.tema;
        this.resgataRanking(this.interesse, this.tema, this.idAtor);
        this.resgataDocumentos(this.interesse, this.tema, parseInt(this.idAtor, 10));
      });
    }

  private resgataRanking(interesse, tema, idAtor) {
    this.autoriaService.getAcoes(interesse, tema)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(acoes => {
      acoes.forEach(dado => {
        if (dado.tipo_acao === 'Proposição') {
          if (dado.id_autor_parlametria.toString() === idAtor.toString()) {
            this.parlamentar = dado;
            this.parlamentar.peso_total = this.parlamentar.peso_total.toFixed(0);
            return;
          }
        }
      });
      this.isLoading.next(false);
    });
  }

  private resgataDocumentos(interesse, tema, idAtor) {
    this.autoriaService.getAutorias(idAtor, interesse, tema)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(autorias => {
        const autoriasApresentadas = [];
        autorias.forEach(dado => {
          if (dado.tipo_acao === 'Proposição') {
            autoriasApresentadas.push(dado);
          }
        });
        this.infoTexto = '';
        const autoriasPorTipo = d3.group(autoriasApresentadas, d => d.tipo_documento);
        autoriasPorTipo.forEach((documento, tipo) => {
          this.infoTexto += `, ${this.formataPesos(this.somaPesos(documento))} ${this.formataTipo(tipo, documento)}`;
        });
      });
  }

  private somaPesos(documento): number {
    let pesoTotal = 0;
    documento.forEach(doc => {
      pesoTotal += doc.peso_autor_documento;
    });
    return pesoTotal;
  }

  private formataPesos(peso): number {
    return peso < 1 && peso >= 0.01 ? peso.toFixed(2) : peso.toFixed(0);
  }

  private formataTipo(tipo, documento): string {
    const peso = this.somaPesos(documento);
    let tipoFormatado = tipo.toLowerCase();
    const isPlural = peso.toFixed(0) !== '1';

    if (tipoFormatado === 'prop. original / apensada') {
      if (!isPlural) {
        tipoFormatado = 'foi proposição original ou apensada';
      } else {
        tipoFormatado = 'foram proposições originais ou apensadas';
      }
    } else {
      if (isPlural) {
        tipoFormatado = 'foram ' + tipoFormatado + 's';
      } else {
        tipoFormatado = 'foi ' + tipoFormatado;
      }
    }
    return tipoFormatado;
  }
}
