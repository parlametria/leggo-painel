import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { filter, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';
import { AutenticacaoModel } from 'src/app/shared/models/autenticacao.model';

const IGNORE_NAVBAR_ROUTES = [
  /^\/cadastro$/gm,
  /^\/login$/gm,
  /^\/verificacao-email\/.*/gm,
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'leggo-painel';
  showNavbar = true;

  private unsubscribe = new Subject();

  constructor(
    private readonly router: Router,
    private readonly autenticacaoService: AutenticacaoService,
  ) { }

  ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.unsubscribe),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) => {
        this.checkShowNavBar(event.url);
      });

    this.autenticacaoService
      .getAutenticacao()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((model: AutenticacaoModel | null) => {
        if (model === null) {
          return;
        }

        this.verificarValidadeAuthToken(model);
      });
  }

  private checkShowNavBar(fullUrl: string) {
    const url = fullUrl.split('?')[0];

    let found = false;
    for (const reg of IGNORE_NAVBAR_ROUTES) {
      found = reg.test(url);

      if (found) {
        break;
      }
    }

    this.showNavbar = !found;
  }

  private verificarValidadeAuthToken(model: AutenticacaoModel) {
    this.autenticacaoService
      .verificarToken(model)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ob => {
          // token valido, fazer nada
        },
        err => {
          // token expirou, tentar atualiar, se nao ser deslogar usuario
          console.log('access token expirou, tentando atualizar');
          if (err?.detail === 'token not valid') {
            this.atualizarToken(model);
          }
        }
      );
  }

  private atualizarToken(model: AutenticacaoModel) {
    this.autenticacaoService
      .atualizarToken(model)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        novoModel => {
          console.log('atualizando token');
          this.autenticacaoService.setAutenticacao(novoModel);
        },
        err => {
          // erro na atualização, então o refresh token esta expirado
          console.log('refresh token esta expirado, deslogando usuario');
          this.autenticacaoService.setAutenticacao(null);
        }
      );
  }
}
