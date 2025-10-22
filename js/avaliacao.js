// Lógica de avaliação da combinação persona x componentes

// Lógica de avaliação da combinação persona x componentes
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

  // avalia combinação usando requisitos extras da persona
  function avaliar(persona, idsComponentes) {
    const feedback = [];
    if (!persona) return { score: 0, feedback: ['Nenhuma persona para avaliar.'] };

    const selecionados = idsComponentes
      .map((id) => window.componentes.find((c) => c.id === id))
      .filter(Boolean);

    // --- 1) Score de compatibilidade por acessibilidade (0..100)
    // mapeia preferencia -> peso de "combinação ideal"
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

    // normaliza accessPoints para 0..100 (base simples)
    // assume que máximo razoável é 2 * nSelecionados, mínimo -1.5 * nSelecionados
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
      found > 0 && feedback.push(`✔ ${found}/${totalReq} seções requeridas presentes.`);
      requiredScore = Math.round((found / totalReq) * 100);
    } else {
      // sem requisitos -> pontuação neutra
      requiredScore = 100;
    }

    // --- 3) Preferências de tipo (bônus)
    let preferredScore = 50; // neutro
    if (Array.isArray(persona.preferredTypes) && persona.preferredTypes.length > 0 && selecionados.length > 0) {
      const tiposSelecionados = selecionados.map((c) => c.tipo);
      const matches = tiposSelecionados.filter((t) => persona.preferredTypes.includes(t)).length;
      preferredScore = Math.round((matches / selecionados.length) * 100);
      if (matches > 0) feedback.push(`✔ ${matches} componente(s) entre os preferidos.`);
    }

    // --- 4) Penalidade por componentes proibidos
    if (Array.isArray(persona.forbiddenTypes) && persona.forbiddenTypes.length > 0) {
      const tiposSelecionados = selecionados.map((c) => c.tipo);
      const forbiddenFound = tiposSelecionados.filter((t) => persona.forbiddenTypes.includes(t));
      if (forbiddenFound.length > 0) {
        feedback.push(`✖ Componentes não recomendados detectados: ${forbiddenFound.join(', ')}.`);
      }
    }

    // --- 5) Combina os sub-scores usando pesos da persona (fallbacks)
    const w = persona.weightings || { access: 0.4, required: 0.4, preferred: 0.2 };
    const rawScore = (accessScore * (w.access ?? 0.4))
                   + (requiredScore * (w.required ?? 0.4))
                   + (preferredScore * (w.preferred ?? 0.2));

    // Ajusta penalidade por forbidden (reduz proporcionalmente)
    let penalty = 0;
    if (Array.isArray(persona.forbiddenTypes) && persona.forbiddenTypes.length > 0) {
      const tiposSelecionados = selecionados.map((c) => c.tipo);
      const forbiddenCount = tiposSelecionados.filter((t) => persona.forbiddenTypes.includes(t)).length;
      if (forbiddenCount > 0) penalty = Math.min(30, forbiddenCount * 10); // até -30 pontos
    }

    let score = Math.round(rawScore - penalty);

    // mensagens finais e normalização
    if (selecionados.length === 0) {
      feedback.unshift('Nenhum componente selecionado. Tente montar um layout.');
      score = 0;
    }

    score = Math.max(0, Math.min(100, score));
    feedback.unshift(`Pontuação final: ${score}/100`);

    return { score, feedback };
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
})();