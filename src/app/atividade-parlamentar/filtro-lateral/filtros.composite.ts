import { AtorAgregado } from 'src/app/shared/models/atorAgregado.model';
import { ParlamentarComissao } from 'src/app/shared/models/parlamentarComissao.model';
import { Lideranca } from 'src/app/shared/models/lideranca.model';

export type FilterFunction = (p: AtorAgregado) => boolean;

export interface FiltroDeParlamentares {
  filtrar: FilterFunction;
}

export class FiltroComposite implements FiltroDeParlamentares {
  private filtros: { [nome: string]: FiltroDeParlamentares } = {};

  filtrar(parlamentar: AtorAgregado) {
    let mostrar = true;

    const filtros = Object.values(this.filtros);
    for (const filtro of filtros) {
      mostrar = filtro.filtrar(parlamentar);

      if (mostrar === false) {
        break;
      }
    }

    return mostrar;
  }

  addFiltro(nome: string, filtro: FiltroDeParlamentares) {
    this.filtros[nome] = filtro;
  }

  removeFiltro(nome: string) {
    delete this.filtros[nome];
  }
}

export class FiltroParlamentaresEstado implements FiltroDeParlamentares {
  private estado: string;

  constructor(estado: string) {
    if (estado === undefined) {
      estado = '';
    }

    this.estado = estado;
  }

  filtrar(parlamentar: AtorAgregado) {
    if (this.estado === '') {
      return true;
    }

    return this.estado === parlamentar.uf;
  }
}

export class FiltroParlamentaresPartido implements FiltroDeParlamentares {
  private partido: string;

  constructor(partido: string) {
    if (partido === undefined) {
      partido = '';
    }

    this.partido = partido;
  }

  filtrar(parlamentar: AtorAgregado) {
    if (this.partido === '') {
      return true;
    }

    return this.partido === parlamentar.partido;
  }
}

export class FiltroParlamentaresComissao implements FiltroDeParlamentares {
  private idsParlamentares = new Set<number>();

  constructor(parlamentaresComissao: ParlamentarComissao[]) {
    for (const par of parlamentaresComissao) {
      this.idsParlamentares.add(+par.id_parlamentar);
    }
  }

  filtrar(parlamentar: AtorAgregado) {
    return this.idsParlamentares.has(parlamentar.id_autor);
  }
}

export class FiltroParlamentaresCargoComissao implements FiltroDeParlamentares {
  private idsParlamentares = new Set<number>();

  constructor(lideranca: Lideranca, parlamentaresComissao: ParlamentarComissao[]) {
    for (const parla of parlamentaresComissao) {
      const parlaCargo = parla.cargo.toLocaleLowerCase();
      const parlaSituacao = parla.situacao.toLocaleLowerCase();
      const liderancaCargo = lideranca.cargo.toLocaleLowerCase();

      // parlaCargo pode ser presidente.
      // parlaSituacao pode ser os demais cargos
      // parlaCargo quando nao presidente é 'nan' ai é a situacao que é o cargo...
      if (parlaCargo === liderancaCargo || parlaSituacao === liderancaCargo) {
        this.idsParlamentares.add(+parla.id_parlamentar);
      }
    }
  }

  filtrar(parlamentar: AtorAgregado) {
    return this.idsParlamentares.has(parlamentar.id_autor);
  }
}
