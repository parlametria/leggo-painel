import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Subject, BehaviorSubject, forkJoin, pipe } from 'rxjs';

import { InteresseService } from 'src/app/shared/services/interesse.service';
import { Interesse } from 'src/app/shared/models/interesse.model';


const DEFAULT_INTERESSE: Interesse = Object.freeze({
  nome_interesse: 'Todos os painéis',
  descricao_interesse: '',
  interesse: 'todos'
});

@Component({
  selector: 'app-seletor-de-interesses',
  templateUrl: './seletor-de-interesses.component.html',
  styleUrls: ['./seletor-de-interesses.component.scss']
})
export class SeletorDeInteressesComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  @Input() nomeSelecionado?: string;
  @Output() interesseAlterado = new EventEmitter<Interesse>();

  interesseSelecionado?: Interesse = DEFAULT_INTERESSE;
  interesses: Interesse[] = [DEFAULT_INTERESSE];

  constructor(
    private interesseService: InteresseService,
  ) { }

  ngOnInit(): void {
    this.interesseService.getInteresses()
      .subscribe(data => {
        this.interesses = [DEFAULT_INTERESSE, ...data];

        // seta o Input nomeSelecionado como interesseSelecionado
        this.onChangeInteresseSelecionado(this.nomeSelecionado ?? '', false);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onChangeInteresseSelecionado(nome: string, emit = true) {
    for (const interesse of this.interesses) {
      if (interesse.interesse === nome) {
        this.interesseSelecionado = interesse;
        break;
      }
    }

    if (emit) {
      this.interesseAlterado.emit(this.interesseSelecionado);
    }
  }
}
