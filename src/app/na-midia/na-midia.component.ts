import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

type MidiaArticle = {
  title: string,
  date: string,
  authors: string,
  fromSource: string,
  sourceLink: string,
};

const ARTICLES: MidiaArticle[] = [
  {
    title: 'Entrevista: os impactos da pandemia na agenda legislativa',
    date: '05.maio.2020',
    authors: 'Conectas Direitos Humanos',
    fromSource: 'Conectas Direitos Humanos',
    sourceLink: 'https://www.conectas.org/noticias/entrevista-os-impactos-da-pandemia-na-agenda-legislativa',
  },
  {
    title: 'Partidos revelam coesão na Câmara em ano de crise na articulação do governo',
    date: '06.janeiro.2019',
    authors: 'Ricardo Mendonça',
    fromSource: 'Valor Econômico',
    sourceLink: 'https://valor.globo.com/politica/noticia/2020/01/06/partidos-revelam-coesao-na-camara-em-ano-de-crise-na-articulacao-do-governo.ghtml',
  },
  {
    title: 'Em votações no Congresso, bancada da Paraíba vota com Governo Bolsonaro em 2019',
    date: '03.janeiro.2020',
    authors: 'João Paulo Medeiros',
    fromSource: 'Jornal da Paraíba',
    sourceLink: 'http://blogs.jornaldaparaiba.com.br/plenopoder/2020/01/03/em-votacoes-no-congresso-bancada-da-paraiba-vota-com-governo-bolsonaro/',
  },
  {
    title: 'Os partidos que mais apoiam o governo no Câmara',
    date: '26.dezembro.2019',
    authors: 'Marcos de Moura e Souza',
    fromSource: 'Valor Econômico',
    sourceLink: 'https://valor.globo.com/politica/noticia/2019/12/26/elite-do-congresso-toca-reformas-e-teve-apoio-empresarial-para-se-eleger.ghtml',
  },
  {
    title: 'Parlametria: 90% dos deputados federais eleitos em 2018 receberam doações de empresários',
    date: '02.dezembro.2019',
    authors: 'Maiá Menezes',
    fromSource: 'O Globo',
    sourceLink: 'https://oglobo.globo.com/brasil/doacoes-de-empresarios-chegaram-90-dos-deputados-diz-estudo-24112316',
  },
  {
    title: 'Estudo mostra qual o senador do Paraná mais alinhado ao governo Bolsonaro',
    date: '29.novembro.2019',
    authors: 'João Frey',
    fromSource: 'Gazeta do Povo',
    sourceLink: 'https://www.gazetadopovo.com.br/vozes/joao-frey/senadores-parana-alinhamento-governo/',
  },
  {
    title: 'Cidadão encontra pelo menos 19 barreiras para acessar dados sobre Congresso',
    date: '26.novembro.2019',
    authors: 'Mônica Bergamo',
    fromSource: 'Folha de S. Paulo',
    sourceLink: 'https://www1.folha.uol.com.br/colunas/monicabergamo/2019/11/cidadao-encontra-pelo-menos-19-barreiras-para-acessar-dados-sobre-congresso.shtml',
  },
  {
    title: 'Mudou, mas continuou quase igual',
    date: '25.novembro.2019',
    authors: 'Bruno Carazza',
    fromSource: 'Valor Econômico',
    sourceLink: 'https://valor.globo.com/politica/coluna/mudou-mas-continuou-quase-igual.ghtml',
  },
];

@Component({
  selector: 'app-na-midia',
  templateUrl: './na-midia.component.html',
  styleUrls: ['./na-midia.component.scss']
})
export class NaMidiaComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  public isLoading = new BehaviorSubject<boolean>(true);
  public aticles: MidiaArticle[] = ARTICLES;

  ngOnInit(): void {
    this.isLoading.next(false);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
