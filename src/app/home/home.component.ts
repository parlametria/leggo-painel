import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';

import { Interesse } from '../shared/models/interesse.model';

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
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isLoading.next(false);
  }

  routeTo(url: string) {
    this.router.navigate([url]);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
