import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

const IGNORE_NAVBAR_ROUTES = [
  '/cadastro',
  '/login',
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'leggo-painel';
  showNavbar = true;

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkShowNavBar(event.url);
    });
  }

  private checkShowNavBar(fullUrl: string) {
    const url = fullUrl.split('?')[0];

    if (IGNORE_NAVBAR_ROUTES.includes(url)) {
      this.showNavbar = false;
    } else {
      this.showNavbar = true;
    }
  }
}
