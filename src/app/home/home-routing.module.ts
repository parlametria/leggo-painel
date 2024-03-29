import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { AtividadeParlamentarComponent } from '../atividade-parlamentar/atividade-parlamentar.component';
import { ProposicoesComponent } from '../proposicoes/proposicoes.component';
import { SobreComponent } from './sobre/sobre.component';
import { SelecaoPainelComponent } from './selecao-painel/selecao-painel.component';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { InsightsComponent } from '../insights/insights.component';
import { ProjetosComponent } from 'src/app/projetos/projetos.component';
import { NaMidiaComponent } from 'src/app/na-midia/na-midia.component';
import { RelatoriosComponent } from 'src/app/relatorios/relatorios.component';
import { CadastroComponent } from 'src/app/cadastro/cadastro.component';
import { LoginComponent } from 'src/app/login/login.conponent';
import { PoliticasDePrivacidadeComponent } from 'src/app/politicas-de-privacidade/politicas-de-privacidade.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'paineis',
    component: SelecaoPainelComponent
  },
  {
    path: 'sobre',
    component: SobreComponent
  },
  {
    path: 'notFound',
    component: PageNotFoundComponent
  },
  {
    path: 'parlamentares',
    component: AtividadeParlamentarComponent
  },
  {
    path: 'proposicoes',
    component: ProposicoesComponent
  },
  {
    path: 'insights',
    component: InsightsComponent
  },
  {
    path: 'projetos',
    component: ProjetosComponent
  },
  {
    path: 'na-midia',
    component: NaMidiaComponent
  },
  {
    path: 'relatorios',
    component: RelatoriosComponent
  },
  {
    path: 'cadastro',
    component: CadastroComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'politicas-e-termos-de-privacidade',
    component: PoliticasDePrivacidadeComponent
  },
  {
    path: 'parlamentares/:id',
    loadChildren: () =>
      import(
        '../atividade-parlamentar/detalhes-parlamentar/detalhes-parlamentar.module'
      ).then((m) => m.DetalhesParlamentarModule),
  },
  {
    path: 'proposicoes/:id_leggo',
    loadChildren: () =>
      import(
        '../proposicoes/detalhes-proposicao/detalhes-proposicao.module'
      ).then((m) => m.DetalhesProposicaoModule),
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
