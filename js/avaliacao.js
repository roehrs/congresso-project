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
  const SECTION_TYPES = new Set(['Section', 'section', 'Hero', 'Gallery', 'Contact', 'Card', 'Cards', 'card', 'Cards informativos']);
  
  // Função auxiliar para normalizar tipos para comparação
  function normalizarTipo(tipo) {
    if (!tipo) return tipo;
    const t = tipo.toLowerCase().trim();
    if (t.includes('card')) return 'Card';
    if (t.includes('section')) return 'Section';
    if (t.includes('navbar')) return 'Navbar';
    if (t.includes('footer')) return 'Footer';
    if (t.includes('hero')) return 'Hero';
    if (t.includes('gallery')) return 'Gallery';
    if (t.includes('contact')) return 'Contact';
    return tipo;
  }

  function normalizarCategoria(categoria) {
    if (!categoria) return categoria;
    const t = categoria.toLowerCase().trim();
    if (t.includes('card')) return 'Card';
    if (t.includes('section')) return 'Section';
    if (t.includes('navbar')) return 'Navbar';
    if (t.includes('footer')) return 'Footer';
    if (t.includes('hero')) return 'Hero';
    if (t.includes('gallery')) return 'Gallery';
    if (t.includes('contact')) return 'Contact';
    return categoria;
  }

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
      .filter(({ c }) => SECTION_TYPES.has(c.tipo) || SECTION_TYPES.has(c.categoria))
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
  function categoriasZeradas() {
    return {
      acessibilidade: { label: 'Acessibilidade', score: 0 },
      preferencias: { label: 'Preferências da persona', score: 0 },
      hierarquia: { label: 'Hierarquia', score: 0 }
    };
  }

  function avaliar(persona, idsComponentes) {
    const feedback = [];
    if (!persona) return { score: 0, feedback: ['Nenhuma persona para avaliar.'], categorias: categoriasZeradas() };

    const selecionados = (Array.isArray(idsComponentes) ? idsComponentes : [])
      .map((id) => window.componentes.find((c) => c.id === id))
      .filter(Boolean);

    if (selecionados.length === 0) {
      return {
        score: 0,
        feedback: ['Nenhum componente selecionado. Tente montar um layout.'],
        ordemEvaluation: avaliarOrdem(idsComponentes),
        categorias: categoriasZeradas()
      };
    }

    // === INÍCIO COM 100 PONTOS ===
    let score = 100;

    // === 1. DESCONTO POR ACESSIBILIDADE DOS COMPONENTES ===
    const w = persona.weightings || { access: 0.35, required: 0.40, preferred: 0.25 };
    let accessPenalty = 0;
    
    selecionados.forEach((comp) => {
      if (persona.preferencia === 'alta') {
        if (comp.acessibilidade === 'alta') {
          feedback.push(`✔ ${comp.tipo} (${comp.id}): Excelente para alta acessibilidade.`);
        } else if (comp.acessibilidade === 'media') {
          accessPenalty += (w.access * 100 * 0.15); // 15% de desconto
          feedback.push(`⚠ ${comp.tipo} (${comp.id}): Aceitável mas não ideal para alta acessibilidade.`);
        } else if (comp.acessibilidade === 'baixa') {
          accessPenalty += (w.access * 100 * 0.40); // 40% de desconto
          feedback.push(`✖ ${comp.tipo} (${comp.id}): Inadequado para alta acessibilidade.`);
        }
      } else if (persona.preferencia === 'media') {
        if (comp.acessibilidade === 'media') {
          feedback.push(`✔ ${comp.tipo} (${comp.id}): Ideal para acessibilidade média.`);
        } else if (comp.acessibilidade === 'alta') {
          feedback.push(`✔ ${comp.tipo} (${comp.id}): Boa para acessibilidade média.`);
        } else if (comp.acessibilidade === 'baixa') {
          accessPenalty += (w.access * 100 * 0.20); // 20% de desconto
          feedback.push(`⚠ ${comp.tipo} (${comp.id}): Apenas adequado para acessibilidade média.`);
        }
      } else if (persona.preferencia === 'baixa') {
        if (comp.acessibilidade === 'baixa') {
          feedback.push(`✔ ${comp.tipo} (${comp.id}): Perfeito para design minimalista.`);
        } else if (comp.acessibilidade === 'media') {
          feedback.push(`✔ ${comp.tipo} (${comp.id}): Adequado para design visual.`);
        } else if (comp.acessibilidade === 'alta') {
          accessPenalty += (w.access * 100 * 0.30); // 30% de desconto
          feedback.push(`⚠ ${comp.tipo} (${comp.id}): Muito pesado para design minimalista.`);
        }
      }
    });

    // Teto: a penalidade de acessibilidade não pode superar o peso total
    // reservado a essa categoria (mesmo critério usado nas seções requeridas),
    // mesmo que vários componentes individualmente estejam desalinhados.
    accessPenalty = Math.min(accessPenalty, w.access * 100);

    // === 2. DESCONTO POR SEÇÕES REQUERIDAS AUSENTES ===
    const requiredSections = persona.requiredSections || [];
    let requiredPenalty = 0;
    
    if (requiredSections.length > 0) {
      const tiposSelecionados = selecionados.map((c) => c.tipo);
      // Normaliza tipos para comparação
      const tiposSelecionadosNorm = tiposSelecionados.map(t => normalizarTipo(t));
      let foundCount = 0;
      
      requiredSections.forEach((req) => {
        const reqNorm = normalizarTipo(req);
        const reqCategoriaNorm = normalizarCategoria(req);
        if (tiposSelecionadosNorm.includes(reqNorm) || tiposSelecionadosNorm.includes(reqCategoriaNorm)) {
          foundCount++;
          feedback.push(`✔ Seção requerida presente: ${req}.`);
        } else {
          feedback.push(`✖ Seção requerida ausente: ${req}.`);
        }
      });
      
      const missingSections = requiredSections.length - foundCount;
      if (missingSections > 0) {
        requiredPenalty = (missingSections / requiredSections.length) * (w.required * 100);
        
        if (foundCount === 0) {
          feedback.push(`⚠ Nenhuma seção requerida foi encontrada no layout.`);
        } else {
          feedback.push(`⚠ Apenas ${foundCount}/${requiredSections.length} seções requeridas encontradas.`);
        }
      }
    }

    // === 3. DESCONTO POR TIPOS DE COMPONENTES PREFERIDOS AUSENTES ===
    const preferredTypes = persona.preferredTypes || [];
    let preferredPenalty = 0;

    if (preferredTypes.length > 0) {
      const tiposSelecionadosNorm = selecionados.map((c) => normalizarTipo(c.tipo));
      const categoriasSelecionadasNorm = selecionados.map((c) => normalizarCategoria(c.categoria));
      let foundPreferredCount = 0;

      preferredTypes.forEach((pref) => {
        const prefNorm = normalizarTipo(pref);
        if (tiposSelecionadosNorm.includes(prefNorm) || categoriasSelecionadasNorm.includes(prefNorm)) {
          foundPreferredCount++;
          feedback.push(`✔ Tipo de componente preferido presente: ${pref}.`);
        } else {
          feedback.push(`○ Tipo de componente preferido ausente: ${pref}.`);
        }
      });

      const missingPreferred = preferredTypes.length - foundPreferredCount;
      if (missingPreferred > 0) {
        preferredPenalty = (missingPreferred / preferredTypes.length) * (w.preferred * 100);
      }
    }

    // === 4. DESCONTO POR TEMAS INADEQUADOS ===
    const temasComponentes = lerTemasComponentes();
    let temaPenalty = 0;
    
    // Mapeamento: preferência da persona -> tema ideal
    const temaIdealPorPreferencia = {
      'alta': 'alto',
      'media': 'medio',
      'baixa': 'baixo'
    };
    
    const temaIdeal = temaIdealPorPreferencia[persona.preferencia] || 'medio';
    let componentesComTemaIdeal = 0;
    let componentesComTemaOposto = 0;
    let componentesComTemaPadraoIdeal = 0; // Componentes com tema padrão mas acessibilidade adequada
    
    idsComponentes.forEach((id) => {
      const temaAplicado = temasComponentes[String(id)];
      const componente = selecionados.find(c => c.id === id);
      
      if (temaAplicado && temaAplicado !== 'padrao') {
        if (temaAplicado === temaIdeal) {
          componentesComTemaIdeal++;
        }
        
        // Verifica se é tema oposto
        const temaOposto = temaIdeal === 'alto' ? 'baixo' : (temaIdeal === 'baixo' ? 'alto' : 'medio');
        if (temaAplicado === temaOposto) {
          componentesComTemaOposto++;
        }
      } else if (temaAplicado === 'padrao' || !temaAplicado) {
        // Se tema padrão, verifica se a acessibilidade do componente é adequada
        if (componente && componente.acessibilidade === persona.preferencia) {
          componentesComTemaPadraoIdeal++;
        }
      }
    });
    
    // Ajusta contagem: tema padrão adequado conta como ideal
    componentesComTemaIdeal += componentesComTemaPadraoIdeal;
    
    const componentesSemTema = idsComponentes.length - componentesComTemaIdeal - componentesComTemaOposto;
    
    if (idsComponentes.length > 0) {
      const totalComponentes = idsComponentes.length;
      const percentualIdeal = (componentesComTemaIdeal / totalComponentes) * 100;
      
      if (componentesComTemaIdeal === totalComponentes && componentesComTemaIdeal > 0) {
        feedback.push(`✔ Todos os componentes usam o tema ideal (${temaIdeal} contraste) para ${persona.preferencia} acessibilidade!`);
      } else if (percentualIdeal >= 75) {
        temaPenalty = 5;
        feedback.push(`✔ A maioria esmagadora dos componentes (${Math.round(percentualIdeal)}%) usa o tema ideal!`);
      } else if (percentualIdeal >= 50) {
        temaPenalty = 15;
        feedback.push(`✔ A maioria dos componentes (${Math.round(percentualIdeal)}%) usa o tema ideal.`);
      } else if (componentesComTemaIdeal > 0) {
        temaPenalty = 30;
        feedback.push(`⚠ Apenas ${componentesComTemaIdeal}/${totalComponentes} componente(s) usa(m) o tema ideal.`);
      } else if (componentesComTemaOposto > 0) {
        temaPenalty = 50;
        feedback.push(`✖ ${componentesComTemaOposto} componente(s) usa(m) tema oposto (${temaIdeal === 'alto' ? 'baixo' : 'alto'} contraste)!`);
      } else {
        temaPenalty = 40;
        feedback.push(`⚠ Nenhum tema aplicado. Use tema "${temaIdeal}" para melhor ${persona.preferencia} acessibilidade.`);
      }
    }

    // === 5. DESCONTO POR ORDEM ERRADA ===
    const ordemResult = avaliarOrdem(Array.isArray(idsComponentes) ? idsComponentes : []);
    const ordemPenalty = 100 - ordemResult.score;
    
    // Adiciona feedback de ordem
    ordemResult.feedback.forEach((f) => {
      if (f.includes('✔')) feedback.push(f);
      else if (f.includes('✖')) feedback.push(f);
      else feedback.push(`✔ ${f}`);
    });

    // === 6. CALCULA SCORE FINAL (DESCONTA TUDO) ===
    score -= Math.round(accessPenalty);
    score -= Math.round(requiredPenalty);
    score -= Math.round(temaPenalty);
    score -= Math.round(ordemPenalty);
    score -= Math.round(preferredPenalty);
    
    // Ajusta se necessário
    score = Math.max(0, Math.min(100, score));

    // === CATEGORIAS: detalhamento da nota por critério (0-100 cada, independentes entre si) ===
    const TEMA_PENALTY_MAX = 50; // pior caso possível da penalidade de tema (ver tiers acima)
    const clamp100 = (v) => Math.max(0, Math.min(100, Math.round(v)));

    const acessibilidadeMax = (w.access * 100) + TEMA_PENALTY_MAX;
    const acessibilidadeScore = clamp100(
      100 * (1 - (accessPenalty + temaPenalty) / (acessibilidadeMax || 1))
    );

    const preferenciasMax = (w.required + w.preferred) * 100;
    const preferenciasScore = clamp100(
      100 * (1 - (requiredPenalty + preferredPenalty) / (preferenciasMax || 1))
    );

    const hierarquiaScore = clamp100(ordemResult.score);

    const categorias = {
      acessibilidade: { label: 'Acessibilidade', score: acessibilidadeScore },
      preferencias: { label: 'Preferências da persona', score: preferenciasScore },
      hierarquia: { label: 'Hierarquia', score: hierarquiaScore }
    };

    // === 7. MENSAGEM FINAL ===
    let mensagemFinal = '';
    if (score >= 90) {
      mensagemFinal = '🎉 Excelente! Seu layout atende perfeitamente às necessidades da persona!';
    } else if (score >= 70) {
      mensagemFinal = '👍 Bom trabalho! O layout atende bem às necessidades da persona.';
    } else if (score >= 50) {
      mensagemFinal = '⚠️ Layout razoável, mas pode ser melhorado considerando as necessidades da persona.';
    } else if (score >= 30) {
      mensagemFinal = '⚠️ Layout precisa de melhorias significativas para atender às necessidades da persona.';
    } else {
      mensagemFinal = '❌ O layout não atende adequadamente às necessidades da persona.';
    }
    
    feedback.unshift(mensagemFinal);
    feedback.unshift(`Pontuação: ${score}/100`);

    return { score, feedback, ordemEvaluation: ordemResult, categorias };
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

  function lerTemaGlobal() {
    const raw = localStorage.getItem('simulador_tema_global');
    return raw || 'padrao';
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
    // Temas definidos em js/temas.js (window.TEMAS), compartilhado com main.js
    const TEMAS = window.TEMAS || {};

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
  function corPorScore(score) {
    if (score >= 70) return 'bg-success';
    if (score >= 40) return 'bg-warning';
    return 'bg-danger';
  }

  function renderCategorias(categorias) {
    const container = document.getElementById('categorias-avaliacao');
    if (!container || !categorias) return;

    container.innerHTML = '';
    Object.values(categorias).forEach((cat) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'mb-2';
      wrapper.innerHTML = `
        <div class="d-flex justify-content-between small mb-1">
          <span>${cat.label}</span>
          <span class="fw-semibold">${cat.score}/100</span>
        </div>
        <div class="progress" role="progressbar" aria-label="${cat.label}" aria-valuenow="${cat.score}" aria-valuemin="0" aria-valuemax="100" style="height: 10px;">
          <div class="progress-bar ${corPorScore(cat.score)}" style="width: ${cat.score}%;"></div>
        </div>
      `;
      container.appendChild(wrapper);
    });
  }

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

    const { score, feedback, ordemEvaluation, categorias } = avaliar(persona, ids);
    spanPont.textContent = String(score);
    renderCategorias(categorias);
    listaFb.innerHTML = '';
    feedback.forEach((f) => {
      const li = document.createElement('li');
      li.textContent = f;
      listaFb.appendChild(li);
    });

    // renderiza o site montado no canvas da página de resultado
    renderAssembledSite(ids, 'resultado-canvas');
    
    // Abre modal de certificado se pontuação for 100
    if (score === 100) {
      setTimeout(() => {
        const modal = new bootstrap.Modal(document.getElementById('modal-certificado'));
        modal.show();
      }, 1000);
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
