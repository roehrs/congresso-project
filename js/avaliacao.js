// Lógica de avaliação da combinação persona x componentes (integrado com avaliação de ordem + render do site montado)
(function () {
  const STORAGE_KEYS = {
    persona: 'simulador_persona',
    componentesEscolhidos: 'simulador_componentes',
    colorSettings: 'simulador_colors',
    customColors: 'simulador_custom_colors'
  };

  function lerPersona() {
    const raw = localStorage.getItem(STORAGE_KEYS.persona);
    return raw ? JSON.parse(raw) : null;
  }

  function lerComponentesEscolhidos() {
    const raw = localStorage.getItem(STORAGE_KEYS.componentesEscolhidos);
    return raw ? JSON.parse(raw) : [];
  }

  function lerColorSettings() {
    const raw = localStorage.getItem(STORAGE_KEYS.colorSettings);
    return raw ? JSON.parse(raw) : { accent: '#0d6efd', background: '#ffffff', text: '#212529' };
  }

  function lerCustomColors() {
    const raw = localStorage.getItem(STORAGE_KEYS.customColors);
    return raw ? JSON.parse(raw) : {};
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

  // ----------------------------
  // Render do site montado (resultado)
  // ----------------------------
  function sanitizeHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    tmp.querySelectorAll('script').forEach((s) => s.remove());
    return tmp.innerHTML;
  }

  function lerTemasComponentes() {
    const raw = localStorage.getItem('simulador_temas_componentes');
    return raw ? JSON.parse(raw) : {};
  }

  function renderAssembledSite(ids, targetElId = 'resultado-canvas') {
    const container = document.getElementById(targetElId);
    if (!container) return;
    container.innerHTML = '';

    const comps = window.componentes || [];
    const colorsGlobal = lerColorSettings();
    const customMap = lerCustomColors();
    const temasComponentes = lerTemasComponentes();

    const page = document.createElement('div');
    page.className = 'prototype-page';
    page.style.setProperty('--accent-color', colorsGlobal.accent);
    page.style.setProperty('--component-bg', colorsGlobal.background);
    page.style.setProperty('--component-text', colorsGlobal.text);

    // montar blocos na ordem
    ids.forEach((id) => {
      const comp = comps.find((c) => c.id === id);
      if (!comp) return;

      // Prepara uma cópia do HTML do componente para aplicar tema se necessário
      let htmlToUse = comp.html || `<div style="padding:8px;background:#f1f3f5;border-radius:6px">Componente #${id}</div>`;
      
      // Verifica se há tema aplicado para este componente
      const temaAplicado = temasComponentes[String(id)];
      if (temaAplicado && temaAplicado !== 'padrao') {
        // Se o componente tem _originalHtml, usa ele como base (melhor prática)
        // Caso contrário, usa o HTML atual (que pode já ter tema aplicado)
        const htmlBase = comp._originalHtml || comp.html;
        if (htmlBase && temaAplicado) {
          // Aplica o tema temporariamente para renderização
          htmlToUse = aplicarTemaParaRenderizacao(htmlBase, temaAplicado, comp.tipo || comp.categoria);
        }
      } else if (comp._originalHtml) {
        // Se não tem tema ou é padrão, usa o HTML original
        htmlToUse = comp._originalHtml;
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'prototype-block';
      wrapper.setAttribute('data-comp-id', String(id));

      // cores personalizadas por componente (se existirem)
      const custom = customMap[String(id)];
      if (custom) {
        wrapper.style.setProperty('--accent-color', custom.accent || colorsGlobal.accent);
        wrapper.style.setProperty('--component-bg', custom.background || colorsGlobal.background);
        wrapper.style.setProperty('--component-text', custom.text || colorsGlobal.text);
      } else {
        wrapper.style.setProperty('--accent-color', colorsGlobal.accent);
        wrapper.style.setProperty('--component-bg', colorsGlobal.background);
        wrapper.style.setProperty('--component-text', colorsGlobal.text);
      }

      wrapper.innerHTML = sanitizeHtml(htmlToUse);
      page.appendChild(wrapper);
    });

    container.appendChild(page);
  }

  // Função auxiliar para aplicar tema ao HTML sem modificar o componente original
  function aplicarTemaParaRenderizacao(htmlOriginal, temaNome, tipoComponente) {
    // Define os temas (mesma estrutura do main.js)
    const TEMAS = {
      alto: {
        porTipo: {
          Navbar: { 'background-color': '#000000', 'background': '#000000', 'color': '#ffffff', 'border-color': '#ffffff' },
          Footer: { 'background-color': '#000000', 'background': '#000000', 'color': '#ffffff', 'border-color': '#ffffff', 'border-top-color': '#ffffff' },
          Section: { 'background-color': '#ffffff', 'background': '#ffffff', 'color': '#000000', 'border-color': '#000000' },
          Hero: { 'background-color': '#ffffff', 'background': '#ffffff', 'color': '#000000', 'border-color': '#000000' },
          Card: { 'background-color': '#ffffff', 'background': '#ffffff', 'color': '#000000', 'border-color': '#000000' },
          default: { 'background-color': '#ffffff', 'background': '#ffffff', 'color': '#000000', 'border-color': '#000000' }
        }
      },
      medio: {
        porTipo: {
          Navbar: { 'background-color': '#212529', 'background': '#212529', 'color': '#ffffff', 'border-color': '#495057' },
          Footer: { 'background-color': '#212529', 'background': '#212529', 'color': '#ffffff', 'border-color': '#495057', 'border-top-color': '#495057' },
          Section: { 'background-color': '#f8f9fa', 'background': '#f8f9fa', 'color': '#212529', 'border-color': '#dee2e6' },
          Hero: { 'background-color': '#f8f9fa', 'background': '#f8f9fa', 'color': '#212529', 'border-color': '#dee2e6' },
          Card: { 'background-color': '#ffffff', 'background': '#ffffff', 'color': '#212529', 'border-color': '#dee2e6' },
          default: { 'background-color': '#f8f9fa', 'background': '#f8f9fa', 'color': '#212529', 'border-color': '#dee2e6' }
        }
      },
      baixo: {
        porTipo: {
          Navbar: { 'background-color': '#ffffff', 'background': '#ffffff', 'color': '#6c757d', 'border-color': '#e9ecef' },
          Footer: { 'background-color': '#ffffff', 'background': '#ffffff', 'color': '#6c757d', 'border-color': '#e9ecef', 'border-top-color': '#e9ecef' },
          Section: { 'background-color': '#ffffff', 'background': '#ffffff', 'color': '#6c757d', 'border-color': '#f1f3f5' },
          Hero: { 'background-color': '#ffffff', 'background': '#ffffff', 'color': '#6c757d', 'border-color': '#f1f3f5' },
          Card: { 'background-color': '#ffffff', 'background': '#ffffff', 'color': '#6c757d', 'border-color': '#e9ecef' },
          default: { 'background-color': '#ffffff', 'background': '#ffffff', 'color': '#6c757d', 'border-color': '#e9ecef' }
        }
      }
    };

    if (!temaNome || !TEMAS[temaNome]) return htmlOriginal;

    const tema = TEMAS[temaNome];
    let tipo = tipoComponente || 'default';
    if (tipo === 'Hero' || tipo === 'Gallery' || tipo === 'Contact') {
      tipo = 'Section';
    }

    const coresPorTipo = tema.porTipo[tipo] || tema.porTipo.default || {};
    if (!coresPorTipo || Object.keys(coresPorTipo).length === 0) return htmlOriginal;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlOriginal;

    const isNavOrFooter = tipo === 'Navbar' || tipo === 'Footer';
    const allElements = tempDiv.querySelectorAll('[style]');
    
    allElements.forEach((el) => {
      if (!el.hasAttribute('style')) return;
      
      let elementStyle = el.getAttribute('style');
      const tagName = el.tagName.toLowerCase();
      const propertiesToApply = [];
      
      const hasBgColor = /(?:^|;)\s*background-color\s*:/i.test(elementStyle);
      if (hasBgColor) {
        propertiesToApply.push('background-color');
      } else {
        const bgMatch = elementStyle.match(/(?:^|;)\s*background\s*:\s*([^;]+)/i);
        if (bgMatch) {
          const bgValue = bgMatch[1].trim();
          if (!bgValue.includes('url(') && !bgValue.includes('image')) {
            if (isNavOrFooter || (!bgValue.includes('gradient') && !bgValue.includes('rgba'))) {
              propertiesToApply.push('background');
            }
          }
        }
      }
      
      const hasColor = /(?:^|;)\s*color\s*:/i.test(elementStyle);
      if (hasColor) {
        propertiesToApply.push('color');
      }
      
      const hasBorderColor = /(?:^|;)\s*border(?:-[a-z-]+)?-color\s*:/i.test(elementStyle);
      if (hasBorderColor) {
        if (/border-top-color/i.test(elementStyle)) propertiesToApply.push('border-top-color');
        else if (/border-bottom-color/i.test(elementStyle)) propertiesToApply.push('border-bottom-color');
        else if (/border-left-color/i.test(elementStyle)) propertiesToApply.push('border-left-color');
        else if (/border-right-color/i.test(elementStyle)) propertiesToApply.push('border-right-color');
        else propertiesToApply.push('border-color');
      }
      
      propertiesToApply.forEach(property => {
        if (coresPorTipo[property]) {
          const newColor = coresPorTipo[property];
          const escapedProp = property.replace(/-/g, '\\-');
          const regex = new RegExp(`(?:^|;)\\s*${escapedProp}\\s*:\\s*[^;]+`, 'gi');
          
          const hasProperty = regex.test(elementStyle);
          regex.lastIndex = 0;
          
          if (hasProperty) {
            elementStyle = elementStyle.replace(regex, (match) => {
              if (isNavOrFooter && property === 'background' && match.includes('rgba')) {
                return match.replace(/rgba?\([^)]+\)/, newColor);
              }
              return match.replace(/:\s*[^;]+/, ': ' + newColor);
            });
          } else if (property === 'background-color' || property === 'color') {
            if (isNavOrFooter || tagName === 'nav' || tagName === 'footer' || tagName === 'a') {
              elementStyle = (elementStyle.trim().endsWith(';') ? elementStyle : elementStyle + ';') + ` ${property}: ${newColor};`;
            }
          }
        }
      });
      
      el.setAttribute('style', elementStyle.trim());
    });

    return tempDiv.innerHTML;
  }

  // -------------------------
  // Render UI de resultado (pontuação + canvas)
  // -------------------------
  function renderResultado() {
    const spanPersona = document.getElementById('resultado-persona');
    const spanPrefer = document.getElementById('resultado-prefer');
    const spanPont = document.getElementById('pontuacao');
    const listaFb = document.getElementById('lista-feedback');
    const canvasTarget = document.getElementById('resultado-canvas');
    if (!spanPersona || !spanPrefer || !spanPont || !listaFb || !canvasTarget) return;

    const persona = lerPersona();
    const ids = lerComponentesEscolhidos();

    if (!persona) {
      spanPersona.textContent = '—';
      spanPrefer.textContent = '—';
      listaFb.innerHTML = '<li>Nenhuma persona encontrada. Volte ao início.</li>';
      canvasTarget.innerHTML = '';
      return;
    }

    spanPersona.textContent = persona.nome;
    spanPrefer.textContent = persona.preferencia;

    const { score, feedback, ordemEvaluation } = avaliar(persona, ids);
    spanPont.textContent = String(score);
    listaFb.innerHTML = '';
    feedback.forEach((f) => {
      const li = document.createElement('li');
      li.textContent = f;
      listaFb.appendChild(li);
    });

    // renderiza o site montado no canvas da página de resultado
    renderAssembledSite(ids, 'resultado-canvas');

    // opcional: mostrar detalhes da avaliação de ordem (colapsível)
    const ordemDetails = document.getElementById('ordem-details');
    if (ordemDetails) {
      ordemDetails.innerHTML = `<pre style="white-space:pre-wrap">${JSON.stringify(ordemEvaluation, null, 2)}</pre>`;
    }
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
  window.avaliacao.renderAssembledSite = renderAssembledSite;
})();