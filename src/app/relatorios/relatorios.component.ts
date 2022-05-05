import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.scss']
})
export class RelatoriosComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  public isLoading = new BehaviorSubject<boolean>(true);

  ngOnInit(): void {
    this.isLoading.next(false);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
