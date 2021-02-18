import { Component, OnInit, OnDestroy } from '@angular/core';
import { InteresseService } from '../shared/services/interesse.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { Interesse } from '../shared/models/interesse.model';
import { indicate } from '../shared/functions/indicate.function';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  public isLoading = new BehaviorSubject<boolean>(true);

  interesse: Interesse;
  interesseArg: string;

  constructor(
    private interesseService: InteresseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
 ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(params => {
      this.interesseArg = params.get('interesse');
      if (this.interesseArg !== undefined) {
        this.getInteresse(this.interesseArg);
      }
    });
  }

  getInteresse(interesseArg: string) {
    this.interesseService
      .getInteresse(interesseArg)
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.interesse = data[0];
        this.isLoading.next(false);

        if (this.interesse === undefined) {
          this.router.navigate(['notFound'], { skipLocationChange: true });
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


}
