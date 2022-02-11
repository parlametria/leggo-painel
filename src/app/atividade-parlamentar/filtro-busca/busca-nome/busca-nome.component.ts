import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';

// import { Parlamentar } from '../../../shared/models/parlamentar.model';
// import { ParlamentaresService } from '../../../shared/services/parlamentares.service';

@Component({
  selector: 'app-busca-nome',
  templateUrl: './busca-nome.component.html',
  styleUrls: ['./busca-nome.component.scss']
})
export class BuscaNomeComponent  {
  searchText: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  navSearch(searchText: string) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.text = searchText;
    this.router.navigate([`/parlamentares`], { queryParams });
  }
}
