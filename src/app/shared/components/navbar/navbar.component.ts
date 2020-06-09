import { Component, OnInit } from '@angular/core';
import { Router, ChildActivationStart } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  private unsubscribe = new Subject();

  public interesse: string;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.router.events
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(event => {
      if (event instanceof ChildActivationStart) {
        switch (event.snapshot.params.interesse) {
          case 'primeira-infancia':
            this.interesse = 'Primeira Infância';
            break;
          case 'congresso-remoto':
            this.interesse = 'Congresso Remoto';
            break;
          default:
            this.interesse = 'RAC';
            break;
        }
      }
    });
  }

}
