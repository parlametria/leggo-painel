import { Component, OnInit, HostListener } from '@angular/core';
import { Params, ActivatedRoute, Router, ChildActivationStart, ActivationStart } from '@angular/router';

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
  public interesses: Interesse[];
  public searchText: string;

  public interesseParam: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private interesseService: InteresseService,
    public router: Router,
  ) {}

  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    this.changeNavbar(window.scrollY);
  }

  ngOnInit(): void {
    this.getInteresses();
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
    this.activatedRoute.queryParams.subscribe((params) => {
      this.searchText = params.text || '';
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

  getInteresses() {
    this.interesseService
      .getInteresses()
      .subscribe((data) => {
        this.interesses = data.filter((i) => i.interesse !== 'leggo');
      });
  }

  navSearch(searchText: string, interesse: Interesse) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.text = searchText;
    this.router.navigate([`/${interesse.interesse}/proposicoes`], { queryParams });
    if (this.router.url.includes(`/${interesse.interesse}/proposicoes`)) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }

  onNavigate(painel: any) {
    this.router.navigate([painel]);
  }

  changeNavbar(position: number) {
    if (this.router.url === '/paineis') {
      return;
    }
    const navbar = document.getElementById('fixed-navbar');
    if (position > 100) {
      navbar.style.top = '0';
    } else {
      navbar.style.top = '-90px';
    }
  }
}
