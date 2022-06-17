import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';

import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { UsuarioModel } from 'src/app/shared/models/usuario.model';

const DEFAULT_ERRORS = Object.freeze({
  primeiroNome: {
    error: false,
    texto: ''
  },
  ultimoNome: {
    error: false,
    texto: ''
  },
  email: {
    error: false,
    texto: ''
  },
  password: {
    error: false,
    texto: ''
  },
  sitePoliciesCheck: {
    error: false,
    texto: ''
  },
});

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  isLoading = new BehaviorSubject<boolean>(true);
  showPassword = false;
  disableButton = false;
  stage: 'creation' | 'loading' | 'created' = 'creation';
  primeiroNome = '';
  ultimoNome = '';
  email = '';
  empresa = '';
  password = '';
  confirmPassword = '';
  sitePoliciesCheck = false;

  errors = { ...DEFAULT_ERRORS };

  constructor(
    private router: Router,
    private readonly usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.isLoading.next(false);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  createUser() {
    this.resetErrors();

    if (!this.formIsValid()) {
      return;
    }

    this.disableButton = true;

    const data: UsuarioModel = {
      email: this.email.trim(),
      primeiro_nome: this.primeiroNome.trim(),
      ultimo_nome: this.ultimoNome.trim(),
      empresa: this.empresa.trim(),
      password: this.password.trim(),
    };

    this.stage = 'loading';
    this.usuarioService.criarNovoUsuario(data)
      .subscribe(
        usuario => {
          console.log(usuario);
          this.disableButton = false;
          this.stage = 'created';
        }, err => {
          const keys = Object.keys(err.error);
          this.applyErrorOnCheck('email', keys.includes('email'), err.error.email);
          this.stage = 'creation';
        }
      ).add(() => {
        this.disableButton = false;
      });
  }

  private formIsValid(): boolean {
    const EMPTY_ERR_TXT = 'Campo não pode estar vazio';

    this.applyErrorOnCheck('primeiroNome', this.primeiroNome.trim().length === 0, EMPTY_ERR_TXT);
    this.applyErrorOnCheck('ultimoNome', this.ultimoNome.trim().length === 0, EMPTY_ERR_TXT);
    this.applyErrorOnCheck('email', this.email.trim().length === 0, EMPTY_ERR_TXT);
    this.applyErrorOnCheck('password', this.password.trim().length === 0, EMPTY_ERR_TXT);
    this.applyErrorOnCheck('sitePoliciesCheck', !this.sitePoliciesCheck, 'É necessário concordar com as Políticas e Termos de privacidade');
    this.applyErrorOnCheck('password', this.password.trim() !== this.confirmPassword.trim(), 'As senhas não conferem');

    // Se todos os erros estivem como false então o form está ok
    return Object.keys(this.errors).map(k => this.errors[k].error).every(err => err === false);
  }

  private applyErrorOnCheck(key: string, check: boolean, errMsg: string) {
    if (check) {
      this.errors[key].error = true;
      this.errors[key].texto = errMsg;
    }
  }

  private resetErrors() {
    for (const key of Object.keys(this.errors)) {
      this.errors[key].error = false;
      this.errors[key].texto = '';
    }
  }
}
