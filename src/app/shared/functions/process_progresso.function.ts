import { ProgressoProposicao } from 'src/app/shared/models/proposicoes/progressoProposicao.model';

export function ordenaProgressoProposicao(
  resumoProgresso: ProgressoProposicao[]
) {
  if (!resumoProgresso) {
    return resumoProgresso;
  }

  let ORDER = [
    'Comissão Mista',
    'Câmara dos Deputados',
    'Senado Federal',
    'Câmara dos Deputados - Revisão',
    'Sanção Presidencial/Promulgação',
  ];

  if (resumoProgresso.length && resumoProgresso[0].is_mpv === false) {
    ORDER = [
      'Construção-Comissões',
      'Construção-Plenário',
      'Revisão I-Comissões',
      'Revisão I-Plenário',
      'Revisão II-Comissões',
      'Revisão II-Plenário',
      'Promulgação/Veto-Presidência da República',
      'Sanção/Veto-Presidência da República',
      'Avaliação dos Vetos-Congresso',
    ];

    resumoProgresso = resumoProgresso.map((r) => {
      r.fase_global_local = r.fase_global + '-' + r.local;
      return r;
    });

    resumoProgresso.sort(
      (a, b) =>
        ORDER.indexOf(a.fase_global_local) - ORDER.indexOf(b.fase_global_local)
    );
  } else {
    resumoProgresso.sort(
      (a, b) => ORDER.indexOf(a.fase_global) - ORDER.indexOf(b.fase_global)
    );
  }

  /*
  resumoProgresso = resumoProgresso.map((r, i, l) => {
    if (i % 2 && i < 6) {
      r.local_casa = l[i - 1].local_casa;
    }
    return r;
  });
  */
  // senado 1, 2, 5, 6
  // camara 3, 4
  const LOCAL_CASA_SENADO_ORDER = [0, 1, 4, 6];
  resumoProgresso = resumoProgresso.map((r, i, l) => {
    if (i < 6) {
      r.local_casa = LOCAL_CASA_SENADO_ORDER.includes(i) ? 'senado' : 'camara';
    }

    return r;
  });

  return resumoProgresso;
}

export function resumirFasesProgresso(fases) {
  if (fases) {
    // Caso alguma fase da Revisão II tenha sido iniciada
    const showRevisao2 = fases.some(
      (fase) => fase.fase_global.indexOf('II') !== -1 && fase.data_inicio
    );
    if (showRevisao2) {
      // Mostra todas as fases
      return fases;
    } else {
      // Não mostra Revisão II
      return fases.filter((fase) => fase.fase_global.indexOf('II') === -1);
    }
  }
  return fases;
}
