// Lógica de avaliação da combinação persona x componentes (integrado com avaliação de ordem)
(function () {
  const STORAGE_KEYS = {
    persona: 'simulador_persona',
    componentesEscolhidos: 'simulador_componentes',
  };

  function lerPersona() {
    const raw = localStorage.getItem(STORAGE_KEYS.persona);
    return raw ? JSON.parse(raw) : null;
  }

  function lerComponentesEscolhidos() {
    const raw = localStorage.getItem(STORAGE_KEYS.componentesEscolhidos);
    return raw ? JSON.parse(raw) : [];
  }

  // -----------------------------
  // Avaliação da ordem dos blocos
  // -----------------------------
  const NAVBAR_TYPES = new Set(['Navbar', 'navbar']);
  const FOOTER_TYPES = new Set(['Footer', 'footer']);
  const SECTION_TYPES = new Set(['Section', 'section', 'Hero', 'Gallery', 'Contact', 'Card', 'Cards', 'card']);

  const PENALTY_NAVBAR_NOT_FIRST = 20;
  const PENALTY_FOOTER_NOT_LAST = 20;
  const PENALTY_SECTION_BEFORE_NAVBAR = 10;
  const PENALTY_SECTION_AFTER_FOOTER = 10;
  const PENALTY_NO_SECTION = 30;

  function mapIdsToComponents(ids) {
    const comps = window.componentes || [];
    return ids.map((id) => comps.find((c) => c.id === id) || { id, tipo: String(id), categoria: null });
  }

  // retorna objeto com score-origem, penalties, feedback, details
  function avaliarOrdem(ids) {
    const result = {
      score: 100,
      max: 100,
      penalties: [],
      feedback: [],
      details: {
        ids: Array.isArray(ids) ? Array.from(ids) : [],
        mapped: []
      }
    };

    if (!Array.isArray(ids)) {
      result.score = 0;
      result.penalties.push({ code: 'invalid_input', value: 100, reason: 'Entrada inválida; esperado array de ids.' });
      result.feedback.push('Erro: dados inválidos para avaliação de ordem.');
      return result;
    }

    const mapped = mapIdsToComponents(ids);
    result.details.mapped = mapped.map((m) => ({ id: m.id, tipo: m.tipo, categoria: m.categoria || null }));

    const navbarIndex = mapped.findIndex((c) => NAVBAR_TYPES.has(c.tipo));
    const footerIndex = mapped.findIndex((c) => FOOTER_TYPES.has(c.tipo));
    const sectionIndexes = mapped
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => SECTION_TYPES.has(c.tipo))
      .map(({ i }) => i);

    if (sectionIndexes.length === 0) {
      result.score -= PENALTY_NO_SECTION;
      result.penalties.push({ code: 'no_section', value: PENALTY_NO_SECTION, reason: 'Nenhuma seção/card encontrada no layout.' });
      result.feedback.push('Inclua pelo menos uma Section ou Card entre a Navbar e o Footer.');
    }

    if (navbarIndex >= 0 && navbarIndex !== 0) {
      result.score -= PENALTY_NAVBAR_NOT_FIRST;
      result.penalties.push({ code: 'navbar_not_first', value: PENALTY_NAVBAR_NOT_FIRST, reason: 'Navbar não está na primeira posição.' });
      result.feedback.push('A Navbar foi adicionada, mas não está na primeira posição.');
    }

    if (footerIndex >= 0 && footerIndex !== (mapped.length - 1)) {
      result.score -= PENALTY_FOOTER_NOT_LAST;
      result.penalties.push({ code: 'footer_not_last', value: PENALTY_FOOTER_NOT_LAST, reason: 'Footer não está na última posição.' });
      result.feedback.push('O Footer foi adicionado, mas não está na última posição.');
    }

    if (navbarIndex >= 0) {
      const badBefore = sectionIndexes.filter((idx) => idx < navbarIndex);
      if (badBefore.length > 0) {
        const value = PENALTY_SECTION_BEFORE_NAVBAR * badBefore.length;
        result.score -= value;
        result.penalties.push({ code: 'section_before_navbar', value, reason: `Existem ${badBefore.length} section(s)/card(s) antes da Navbar.` });
        result.feedback.push(`Existem ${badBefore.length} section(s)/card(s) posicionados antes da Navbar.`);
      }
    }

    if (footerIndex >= 0) {
      const badAfter = sectionIndexes.filter((idx) => idx > footerIndex);
      if (badAfter.length > 0) {
        const value = PENALTY_SECTION_AFTER_FOOTER * badAfter.length;
        result.score -= value;
        result.penalties.push({ code: 'section_after_footer', value, reason: `Existem ${badAfter.length} section(s)/card(s) após o Footer.` });
        result.feedback.push(`Existem ${badAfter.length} section(s)/card(s) posicionados após o Footer.`);
      }
    }

    if (result.score < 0) result.score = 0;
    if (result.penalties.length === 0) result.feedback.push('Ordem dos componentes parece correta.');

    return result;
  }

  function avaliarLayoutOrdem() {
    const raw = localStorage.getItem(STORAGE_KEYS.componentesEscolhidos);
    const ids = raw ? JSON.parse(raw) : [];
    return avaliarOrdem(ids);
  }

  // expõe avaliador de ordem globalmente (compatibilidade)
  window.evaluator = window.evaluator || {};
  window.evaluator.avaliarOrdem = avaliarOrdem;
  window.evaluator.avaliarLayout = avaliarLayoutOrdem;

  // -----------------------------------------
  // Avaliação principal (persona x componentes)
  // -----------------------------------------
  function avaliar(persona, idsComponentes) {
    const feedback = [];
    if (!persona) return { score: 0, feedback: ['Nenhuma persona para avaliar.'] };

    const selecionados = (Array.isArray(idsComponentes) ? idsComponentes : [])
      .map((id) => window.componentes.find((c) => c.id === id))
      .filter(Boolean);

    // --- 1) Score de compatibilidade por acessibilidade (0..100)
    let accessPoints = 0;
    selecionados.forEach((comp) => {
      if (persona.preferencia === 'alta' && comp.acessibilidade === 'alta') {
        accessPoints += 2;
        feedback.push(`✔ ${comp.tipo}: boa escolha para alta acessibilidade.`);
      } else if (persona.preferencia === 'media' && (comp.acessibilidade === 'media' || comp.acessibilidade === 'alta')) {
        accessPoints += 1.5;
        feedback.push(`✔ ${comp.tipo}: atende a preferência média/alta.`);
      } else if (persona.preferencia === 'baixa' && (comp.acessibilidade === 'baixa' || comp.acessibilidade === 'media')) {
        accessPoints += 1;
        feedback.push(`✔ ${comp.tipo}: combina com preferência visual/dinâmica.`);
      } else {
        accessPoints -= 1.5;
        feedback.push(`✖ ${comp.tipo}: não combina com preferência ${persona.preferencia}.`);
      }
    });

    const n = Math.max(1, selecionados.length);
    const maxAP = 2 * n;
    const minAP = -1.5 * n;
    const accessScore = Math.round(((accessPoints - minAP) / (maxAP - minAP)) * 100);

    // --- 2) Requisitos de seções obrigatórias
    let requiredScore = 100;
    if (Array.isArray(persona.requiredSections) && persona.requiredSections.length > 0) {
      const tiposSelecionados = selecionados.map((c) => c.tipo);
      const totalReq = persona.requiredSections.length;
      let found = 0;
      persona.requiredSections.forEach((req) => {
        if (tiposSelecionados.includes(req)) {
          found += 1;
        } else {
          feedback.push(`✖ Faltando seção requerida: ${req}.`);
        }
      });
      if (found > 0) feedback.push(`✔ ${found}/${totalReq} seções requeridas presentes.`);
      requiredScore = Math.round((found / totalReq) * 100);
    } else {
      requiredScore = 100;
    }

    // --- 3) Preferências de tipo (bônus)
    let preferredScore = 50;
    if (Array.isArray(persona.preferredTypes) && persona.preferredTypes.length > 0 && selecionados.length > 0) {
      const tiposSelecionados = selecionados.map((c) => c.tipo);
      const matches = tiposSelecionados.filter((t) => persona.preferredTypes.includes(t)).length;
      preferredScore = Math.round((matches / selecionados.length) * 100);
      if (matches > 0) feedback.push(`✔ ${matches} componente(s) entre os preferidos.`);
    }

    // --- 4) Penalidade por componentes proibidos
    let forbiddenPenalty = 0;
    if (Array.isArray(persona.forbiddenTypes) && persona.forbiddenTypes.length > 0) {
      const tiposSelecionados = selecionados.map((c) => c.tipo);
      const forbiddenFound = tiposSelecionados.filter((t) => persona.forbiddenTypes.includes(t));
      if (forbiddenFound.length > 0) {
        feedback.push(`✖ Componentes não recomendados detectados: ${forbiddenFound.join(', ')}.`);
        forbiddenPenalty = Math.min(30, forbiddenFound.length * 10);
      }
    }

    // --- 5) Combina os sub-scores usando pesos da persona (fallbacks)
    const w = persona.weightings || { access: 0.4, required: 0.4, preferred: 0.2 };
    const rawScore = (accessScore * (w.access ?? 0.4))
                   + (requiredScore * (w.required ?? 0.4))
                   + (preferredScore * (w.preferred ?? 0.2));

    let score = Math.round(rawScore - forbiddenPenalty);

    // --- 6) Avaliação de ordem (integração)
    // aplicamos penalidades de ordem diretamente ao score final
    const ordemResult = avaliarOrdem(Array.isArray(idsComponentes) ? idsComponentes : []);
    let ordemPenaltyTotal = 0;
    if (Array.isArray(ordemResult.penalties) && ordemResult.penalties.length > 0) {
      ordemPenaltyTotal = ordemResult.penalties.reduce((s, p) => s + (p.value || 0), 0);
      // anexa feedback de ordem ao retorno principal
      ordemResult.feedback.forEach((f) => feedback.push(`✖ ${f}`));
    }

    // ajusta score com penalidade de ordem
    score = score - ordemPenaltyTotal;

    // mensagens finais e normalização
    if (selecionados.length === 0) {
      feedback.unshift('Nenhum componente selecionado. Tente montar um layout.');
      score = 0;
    }

    score = Math.max(0, Math.min(100, Math.round(score)));
    feedback.unshift(`Pontuação final: ${score}/100`);

    // incluir detalhes de ordem no retorno para possível uso na UI
    return { score, feedback, ordemEvaluation: ordemResult };
  }

  function renderResultado() {
    const spanPersona = document.getElementById('resultado-persona');
    const spanPrefer = document.getElementById('resultado-prefer');
    const spanPont = document.getElementById('pontuacao');
    const listaFb = document.getElementById('lista-feedback');
    if (!spanPersona || !spanPrefer || !spanPont || !listaFb) return;

    const persona = lerPersona();
    const ids = lerComponentesEscolhidos();

    if (!persona) {
      spanPersona.textContent = '—';
      spanPrefer.textContent = '—';
      listaFb.innerHTML = '<li>Nenhuma persona encontrada. Volte ao início.</li>';
      return;
    }

    spanPersona.textContent = persona.nome;
    spanPrefer.textContent = persona.preferencia;

    const { score, feedback } = avaliar(persona, ids);
    spanPont.textContent = String(score);
    listaFb.innerHTML = '';
    feedback.forEach((f) => {
      const li = document.createElement('li');
      li.textContent = f;
      listaFb.appendChild(li);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.endsWith('resultado.html')) {
      renderResultado();
    }
  });

  // expõe avaliar globalmente para uso por outras partes
  window.avaliacao = window.avaliacao || {};
  window.avaliacao.avaliar = avaliar;
  window.avaliacao.avaliarOrdem = avaliarOrdem;
  window.avaliacao.avaliarLayoutOrdem = avaliarLayoutOrdem;
})();