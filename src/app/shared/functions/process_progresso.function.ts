export function ordenaProgressoProposicao(resumoProgresso) {
  let ORDER = [
    'Comissão Mista',
    'Câmara dos Deputados',
    'Senado Federal',
    'Câmara dos Deputados - Revisão',
    'Sanção Presidencial/Promulgação'
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
      'Avaliação dos Vetos-Congresso'
    ];

    resumoProgresso = resumoProgresso.map(r => {
      r.fase_global_local = r.fase_global + '-' + r.local;
      return r;
    });

    resumoProgresso.sort((a, b) => {
      return ORDER.indexOf(a.fase_global_local) - ORDER.indexOf(b.fase_global_local);
    });
  } else {
    resumoProgresso.sort((a, b) => {
      return ORDER.indexOf(a.fase_global) - ORDER.indexOf(b.fase_global);
    });
  }

  return resumoProgresso;
}

export function  resumirFasesProgresso(fases) {
  // Caso alguma fase da Revisão II tenha sido iniciada
  const showRevisao2 = fases.some(fase => fase.fase_global.indexOf('II') !== -1 && fase.data_inicio);
  if (showRevisao2) {
    // Mostra todas as fases
    return fases;
  } else {
    // Não mostra Revisão II
    return fases.filter(fase => fase.fase_global.indexOf('II') === -1);
  }
}
