import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ParlamentaresService } from '../../../shared/services/parlamentares.service';
import { InteresseService } from 'src/app/shared/services/interesse.service';
import { Interesse } from 'src/app/shared/models/interesse.model';

@Component({
  selector: 'app-busca-nome',
  templateUrl: './busca-nome.component.html',
  styleUrls: ['./busca-nome.component.scss']
})
export class BuscaNomeComponent implements OnInit {
  searchText: string;
  interesse: Interesse|undefined;

  constructor(
    private parlamentaresService: ParlamentaresService,
    private interesseService: InteresseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.interesse !== undefined) {
          this.getCurrentInteresse(params.interesse);
        } else {
          this.interesse = undefined;
        }
      });
  }

  private getCurrentInteresse(paramInteresse: string) {
    this.interesseService.getInteresse(paramInteresse)
      .subscribe(interesses => {
        if (interesses.length > 0) {
          this.interesse = interesses[0];
        }
      });
  }

  nomeChanged(searchText: string) {
    this.parlamentaresService.search({ nome: searchText });
  }

  removeInteresse() {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    const { scrollX, scrollY } = window;

    queryParams.interesse = undefined;
    this.router.navigate([], { queryParams })
      .then(() => {
        window.scrollTo(scrollX, scrollY);
      });
  }
}
