import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SobreComponent } from './views/sobre/sobre.component';
import { AjudaComponent } from './views/ajuda/ajuda.component';
import { RelatoriosComponent } from './views/relatorios/relatorios.component';
import { SemanariosComponent } from './views/semanarios/semanarios.component';
import { CasesComponent } from './views/cases/cases.component';
import { ProposicoesComponent } from './views/proposicoes/proposicoes.component';
import { ComissaoComponent } from './views/comissao/comissao.component';
import { ProposicaoDetailedComponent } from './views/proposicao-detailed/proposicao-detailed.component';
import { AtoresDetailedComponent } from './views/atores-detailed/atores-detailed.component';
import { ProposicaoPageHeaderComponent } from './views/proposicao-page-header/proposicao-page-header.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  {
    path: '',
    component: ProposicoesComponent
  },
  {
    path: 'sobre',
    component: SobreComponent
  },
  {
    path: 'ajuda',
    component: AjudaComponent
  },
  {
    path: 'relatorios',
    component: RelatoriosComponent
  },
  {
    path: 'semanarios',
    component: SemanariosComponent
  },
  {
    path: 'proposicoes',
    component: ProposicoesComponent
  },
  {
    path: 'cases',
    component: CasesComponent
  },
  {
    path: 'comissao/:casaComissao/:siglaComissao',
    component: ComissaoComponent
  },
  {
    path: 'proposicao/:id_leggo/:slug_interesse?',
    component: ProposicaoDetailedComponent
  },
  {
    path: 'atores/:id_leggo',
    component: AtoresDetailedComponent
  },
  {
    path: ':slug_interesse',
    component: ProposicoesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
