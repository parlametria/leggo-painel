import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

import { InteresseService } from 'src/app/shared/services/interesse.service';
import { Interesse } from 'src/app/shared/models/interesse.model';

@Component({
  selector: 'app-selecao-painel',
  templateUrl: './selecao-painel.component.html',
  styleUrls: ['./selecao-painel.component.scss']
})
export class SelecaoPainelComponent implements OnInit {

  interesses: Interesse[];

  constructor(
    private interesseService: InteresseService,
  ) {}

  ngOnInit(): void {
    this.getInteresses();
  }

  getInteresses() {
    this.interesseService
      .getInteresses()
      .subscribe((data) => {
        this.interesses = data.filter((i) => i.interesse !== 'leggo');
      });
  }

}
