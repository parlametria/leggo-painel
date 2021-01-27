import { Component, OnInit } from '@angular/core';
import { Router, ChildActivationStart, ActivationStart } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { InteresseService } from '../../services/interesse.service';
import { Interesse } from '../../models/interesse.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private unsubscribe = new Subject();

  public interesse: Interesse;

  public interesseParam: string;

  constructor(
    private interesseService: InteresseService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.router.events
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((event) => {
      if (event instanceof ActivationStart) {
        this.interesseParam = event.snapshot.params.interesse;
        if (this.interesseParam !== undefined) {
          this.getInteresse(this.interesseParam);
        }
      }
    });
  }

  getInteresse(interesseArg: string) {
    this.interesseService
      .getInteresse(interesseArg)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.interesse = data[0];
      });
  }
}
