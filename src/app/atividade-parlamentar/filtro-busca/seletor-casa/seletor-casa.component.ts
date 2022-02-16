import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';

type Casa = 'senado' | 'camara';

@Component({
  selector: 'app-seletor-casa',
  templateUrl: './seletor-casa.component.html',
  styleUrls: ['./seletor-casa.component.scss']
})
export class SeletorCasaComponent implements OnInit {
  currentSelected: Casa = 'senado';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.casa !== undefined) {
          if (params.casa === 'senado' || params.casa === 'camara') {
            this.currentSelected = params.casa;
          }
        }
      });
  }

  setCurrentSelected(nextSelected: Casa) {
    if (nextSelected !== this.currentSelected) {
      this.currentSelected = nextSelected;
      this.updateCasaOnQueryParams(nextSelected);
    }
  }

  private updateCasaOnQueryParams(casa: Casa) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (queryParams.casa !== undefined && queryParams.casa === casa) {
      return; // casa already setted, nothing to do
    }

    queryParams.casa = casa;
    this.router.navigate([], { queryParams });
  }
}
