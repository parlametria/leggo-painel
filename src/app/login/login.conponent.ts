import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';

import { AutenticacaoService } from 'src/app/shared/services/autenticacao.service';

@Component({
  selector: 'app-projetos',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  isLoading = new BehaviorSubject<boolean>(true);

  currentStage: 1 | 2 = 1;
  showDropDown = false;
  email = '';
  password = '';
  showPassword = false;
  disableButton = false;

  errors = {
    email: { texto: '', error: false },
    password: { texto: '', error: false },
  };

  constructor(
    private readonly router: Router,
    private readonly autenticacaoService: AutenticacaoService
  ) { }

  ngOnInit(): void {
    this.isLoading.next(false);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  verificaEmail() {
    if (this.email.trim().length === 0) {
      this.errors.email.error = true;
      this.errors.email.texto = 'Campo não pode estar vazio';
      return;
    }

    this.mudarStage(2);
  }

  verificaPassword() {
    if (this.password.trim().length === 0) {
      this.errors.password.error = true;
      this.errors.password.texto = 'Campo não pode estar vazio';
      return;
    }

    this.executarLogin();
  }

  mudarStage(stage: 1 | 2) {
    this.limpaErros();
    this.currentStage = stage;
    this.showDropDown = false;
  }

  executarLogin() {
    this.limpaErros();
    this.disableButton = true;

    const email = this.email.trim();
    const password = this.password.trim();

    this.autenticacaoService.obterToken(email, password)
      .subscribe(authData => {
        console.log(authData);
        this.router.navigate([''], {});
      }, err => {
        if (err.status === 401 && err.error.detail.includes('credentials')) {
          this.errors.password.error = true;
          this.errors.password.texto = 'Email ou senha incorretos';
        }
      }).add(() => {
        this.disableButton = false;
      });
  }

  limpaErros() {
    this.errors = {
      email: { texto: '', error: false },
      password: { texto: '', error: false },
    };
  }
}
