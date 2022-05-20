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

  private currentStep: 'email' | 'password' = 'email';
  private animate = false;
  email: string;
  password: string;

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

  get formStage(): string[] {
    return ['step-wrapper', 'show-' + this.currentStep, this.animate ? 'animate' : ''];
  }

  get step1() {
    const kclass = ['step-1'];

    if (this.animate && this.currentStep === 'email') {
      kclass.push('step-visible');
    }

    return kclass;
  }

  get step2() {
    const kclass = ['step-2'];

    if (this.animate && this.currentStep === 'password') {
      kclass.push('step-visible');
    }

    return kclass;
  }

  showInput(input: 'email' | 'password') {
    this.currentStep = input;
    this.animate = true;
  }

  executarLogin() {
    const email = this.email.trim();
    const password = this.password.trim();

    this.autenticacaoService.obterToken(email, password)
      .subscribe(authData => {
        console.log(authData);
      });
  }
}
