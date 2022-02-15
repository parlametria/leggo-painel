import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';

import { InteresseService } from 'src/app/shared/services/interesse.service';
import { Interesse } from 'src/app/shared/models/interesse.model';

@Component({
  selector: 'app-seletor-interesse',
  templateUrl: './seletor-interesse.component.html',
  styleUrls: ['./seletor-interesse.component.scss']
})
export class SeletorInteresseComponent implements OnInit {

  selectedInteresse: Interesse|undefined = undefined;
  interesses: Interesse[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private interesseService: InteresseService,
  ) { }

  ngOnInit(): void {
    this.interesseService
      .getInteresses()
      .subscribe((data) => {
        this.interesses = data.filter((i) => i.interesse !== 'leggo');
        this.checkSelectedInteresse();
      });
  }


  setSelectedInteresse(interesse: Interesse) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (queryParams.interesse !== undefined && queryParams.interesse === interesse.interesse) {
      return; // interesse already setted, nothing to do
    }

    const { scrollX, scrollY } = window;

    this.selectedInteresse = interesse;
    queryParams.interesse = interesse.interesse;
    this.router.navigate(['/parlamentares'], { queryParams })
      .then(() => {
        // workaround to prevent scrolling to top
        window.scrollTo(scrollX, scrollY);
      });
  }

  isInterestSelected(interesse: Interesse) {
    return !!this.selectedInteresse && this.selectedInteresse.interesse === interesse.interesse;
  }

  private checkSelectedInteresse() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.interesse !== undefined) {
          const found = this.interesses.find(interesse => interesse.interesse === params.interesse);

          if (found) {
            this.selectedInteresse = found;
          }
        } else {
          this.selectedInteresse = undefined;
        }
      });
  }
}
