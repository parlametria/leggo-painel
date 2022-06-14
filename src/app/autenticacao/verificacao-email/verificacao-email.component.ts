import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-verificacao-email',
  templateUrl: './verificacao-email.component.html',
  styleUrls: ['verificacao-email.component.scss']
})
export class VerificacaoEmailComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  stage: 'loading' | 'success' | 'fail' = 'loading';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.verificarEmail(params.get('token') || '');
      });
  }

  private verificarEmail(token: string) {
    this.usuarioService.verificaEmail(token)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        verificacao => {
          this.stage = 'success';
        }, err => {
          console.log(err);
          this.stage = 'fail';
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
