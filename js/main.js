(function () {
  'use strict';

  const STORAGE_KEYS = {
    persona: 'simulador_persona',
    componentesEscolhidos: 'simulador_componentes',
    colorSettings: 'simulador_colors',
    customColors: 'simulador_custom_colors',
    temasComponentes: 'simulador_temas_componentes',
    temaGlobal: 'simulador_tema_global',
    retries: 'simulador_retries',
    difficulty: 'simulador_difficulty'
  };

  const DEFAULT_COLORS = {
    accent: '#0d6efd',
    background: '#ffffff',
    text: '#212529'
  };

  // -------------------
  // Temas de contraste inteligentes por tipo de componente
  // -------------------
  const TEMAS = {
    padrao: {
      nome: 'Tema Padrão',
      descricao: 'Cores originais do componente',
      porTipo: {
        // Tema padrão não aplica nenhuma cor, apenas restaura o HTML original
        default: {}
      }
    },
    alto: {
      nome: 'Alto Contraste',
      descricao: 'Cores com máximo contraste para alta acessibilidade',
      // Regras específicas por tipo de componente
      porTipo: {
        Navbar: {
          'background-color': '#000000',
          'background': '#000000',
          'color': '#ffffff',
          'border-color': '#ffffff'
        },
        Footer: {
          'background-color': '#000000',
          'background': '#000000',
          'color': '#ffffff',
          'border-color': '#ffffff',
          'border-top-color': '#ffffff'
        },
        Section: {
          'background-color': '#ffffff',
          'background': '#ffffff',
          'color': '#000000',
          'border-color': '#000000'
        },
        Hero: {
          'background-color': '#ffffff',
          'background': '#ffffff',
          'color': '#000000',
          'border-color': '#000000'
        },
        Card: {
          'background-color': '#ffffff',
          'background': '#ffffff',
          'color': '#000000',
          'border-color': '#000000',
          'border-top-color': '#000000',
          'border-bottom-color': '#000000',
          'border-left-color': '#000000',
          'border-right-color': '#000000'
        },
        // Padrão para outros componentes
        default: {
          'background-color': '#ffffff',
          'background': '#ffffff',
          'color': '#000000',
          'border-color': '#000000'
        }
      }
    },
    medio: {
      nome: 'Médio Contraste',
      descricao: 'Cores balanceadas com bom contraste',
      porTipo: {
        Navbar: {
          'background-color': '#212529',
          'background': '#212529',
          'color': '#ffffff',
          'border-color': '#495057'
        },
        Footer: {
          'background-color': '#212529',
          'background': '#212529',
          'color': '#ffffff',
          'border-color': '#495057',
          'border-top-color': '#495057'
        },
        Section: {
          'background-color': '#f8f9fa',
          'background': '#f8f9fa',
          'color': '#212529',
          'border-color': '#dee2e6'
        },
        Hero: {
          'background-color': '#f8f9fa',
          'background': '#f8f9fa',
          'color': '#212529',
          'border-color': '#dee2e6'
        },
        Card: {
          'background-color': '#ffffff',
          'background': '#ffffff',
          'color': '#212529',
          'border-color': '#dee2e6',
          'border-top-color': '#dee2e6',
          'border-bottom-color': '#dee2e6',
          'border-left-color': '#dee2e6',
          'border-right-color': '#dee2e6'
        },
        default: {
          'background-color': '#f8f9fa',
          'background': '#f8f9fa',
          'color': '#212529',
          'border-color': '#dee2e6'
        }
      }
    },
    baixo: {
      nome: 'Baixo Contraste',
      descricao: 'Cores suaves com pouco contraste (visual moderno)',
      porTipo: {
        Navbar: {
          'background-color': '#ffffff',
          'background': '#ffffff',
          'color': '#6c757d',
          'border-color': '#e9ecef'
        },
        Footer: {
          'background-color': '#ffffff',
          'background': '#ffffff',
          'color': '#6c757d',
          'border-color': '#e9ecef',
          'border-top-color': '#e9ecef'
        },
        Section: {
          'background-color': '#ffffff',
          'background': '#ffffff',
          'color': '#6c757d',
          'border-color': '#f1f3f5'
        },
        Hero: {
          'background-color': '#ffffff',
          'background': '#ffffff',
          'color': '#6c757d',
          'border-color': '#f1f3f5'
        },
        Card: {
          'background-color': '#ffffff',
          'background': '#ffffff',
          'color': '#6c757d',
          'border-color': '#e9ecef',
          'border-top-color': '#e9ecef',
          'border-bottom-color': '#e9ecef',
          'border-left-color': '#e9ecef',
          'border-right-color': '#e9ecef'
        },
        default: {
          'background-color': '#ffffff',
          'background': '#ffffff',
          'color': '#6c757d',
          'border-color': '#e9ecef'
        }
      }
    }
  };

  const state = {
    filtroTipo: 'Todos'
  };

  const selectionState = {
    selectedIds: []
  };

  // -------------------
  // Sistema de Temas
  // -------------------
  function salvarTemaGlobal(tema) {
    localStorage.setItem(STORAGE_KEYS.temaGlobal, tema || 'padrao');
  }

  function lerTemaGlobal() {
    const raw = localStorage.getItem(STORAGE_KEYS.temaGlobal);
    return raw || 'padrao';
  }

  function salvarTemasComponentes(map) {
    localStorage.setItem(STORAGE_KEYS.temasComponentes, JSON.stringify(map || {}));
  }

  function lerTemasComponentes() {
    const raw = localStorage.getItem(STORAGE_KEYS.temasComponentes);
    return raw ? JSON.parse(raw) : {};
  }

  function getTemaComponente(id) {
    const temas = lerTemasComponentes();
    return temas[String(id)] || null;
  }

  function aplicarTemaAComponente(componentId, temaNome) {
    if (!temaNome || !TEMAS[temaNome]) return;
    
    const comp = (window.componentes || []).find(c => c.id === componentId);
    if (!comp || !comp.html) return;

    // Salva HTML original se necessário
    if (!comp._originalHtml) {
      comp._originalHtml = comp.html;
    }

    // Se for tema padrão, apenas restaura o HTML original
    if (temaNome === 'padrao') {
      if (comp._originalHtml) {
        comp.html = comp._originalHtml;
        // Remove o tema dos salvos para que não seja reaplicado
        const temas = lerTemasComponentes();
        delete temas[String(componentId)];
        salvarTemasComponentes(temas);
        return;
      }
      return;
    }

    const tema = TEMAS[temaNome];
    
    // Identifica o tipo de componente
    // Hero, Gallery, Contact são tratados como Section
    let tipoComponente = comp.tipo || comp.categoria || 'default';
    if (tipoComponente === 'Hero' || tipoComponente === 'Gallery' || tipoComponente === 'Contact') {
      tipoComponente = 'Section';
    }
    
    const coresPorTipo = tema.porTipo[tipoComponente] || tema.porTipo.default || {};
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = comp._originalHtml;

    // Aplica cores do tema de forma contextual por tipo de componente
    const allElements = tempDiv.querySelectorAll('[style]');
    allElements.forEach((el) => {
      if (!el.hasAttribute('style')) return;
      
      let elementStyle = el.getAttribute('style');
      const tagName = el.tagName.toLowerCase();
      
      // Determina quais propriedades aplicar baseado no elemento e tipo de componente
      const propertiesToApply = [];
      
      // Para Navbars e Footers, aplica cores mais agressivamente
      const isNavOrFooter = tipoComponente === 'Navbar' || tipoComponente === 'Footer' || 
                           tagName === 'nav' || tagName === 'footer';
      
      // Verifica background-color (prioridade sobre background simples)
      const hasBgColor = /(?:^|;)\s*background-color\s*:/i.test(elementStyle);
      if (hasBgColor) {
        propertiesToApply.push('background-color');
      } else {
        // Só aplica background se for um valor de cor simples
        const bgMatch = elementStyle.match(/(?:^|;)\s*background\s*:\s*([^;]+)/i);
        if (bgMatch) {
          const bgValue = bgMatch[1].trim();
          // Para nav/footer, pode aplicar mesmo com rgba (remove transparência)
          if (!bgValue.includes('url(') && !bgValue.includes('image')) {
            if (isNavOrFooter || (!bgValue.includes('gradient') && !bgValue.includes('rgba'))) {
              propertiesToApply.push('background');
            }
          }
        }
      }
      
      // Sempre aplica color se existir (principalmente para texto e links)
      const hasColor = /(?:^|;)\s*color\s*:/i.test(elementStyle);
      if (hasColor) {
        propertiesToApply.push('color');
      }
      
      // Aplica border-color se existir (importante para cards e seções)
      const hasBorderColor = /(?:^|;)\s*border(?:-[a-z-]+)?-color\s*:/i.test(elementStyle);
      if (hasBorderColor) {
        // Detecta qual tipo de border-color
        if (/border-top-color/i.test(elementStyle)) propertiesToApply.push('border-top-color');
        else if (/border-bottom-color/i.test(elementStyle)) propertiesToApply.push('border-bottom-color');
        else if (/border-left-color/i.test(elementStyle)) propertiesToApply.push('border-left-color');
        else if (/border-right-color/i.test(elementStyle)) propertiesToApply.push('border-right-color');
        else propertiesToApply.push('border-color');
      }
      
      // Aplica as propriedades do tema
      propertiesToApply.forEach(property => {
        if (coresPorTipo[property]) {
          const newColor = coresPorTipo[property];
          const escapedProp = property.replace(/-/g, '\\-');
          const regex = new RegExp(`(?:^|;)\\s*${escapedProp}\\s*:\\s*[^;]+`, 'gi');
          
          const hasProperty = regex.test(elementStyle);
          regex.lastIndex = 0;
          
          if (hasProperty) {
            // Substitui o valor existente
            elementStyle = elementStyle.replace(regex, (match) => {
              // Mantém rgba se for nav/footer com background transparente original
              if (isNavOrFooter && property === 'background' && match.includes('rgba')) {
                // Remove transparência mantendo a cor
                return match.replace(/rgba?\([^)]+\)/, newColor);
              }
              return match.replace(/:\s*[^;]+/, ': ' + newColor);
            });
          } else if (property === 'background-color' || property === 'color') {
            // Adiciona propriedades essenciais se não existirem (para nav/footer especialmente)
            if (isNavOrFooter || tagName === 'nav' || tagName === 'footer' || tagName === 'a') {
              elementStyle = (elementStyle.trim().endsWith(';') ? elementStyle : elementStyle + ';') + ` ${property}: ${newColor};`;
            }
          }
        }
      });
      
      el.setAttribute('style', elementStyle.trim());
    });

    // Atualiza o componente
    comp.html = tempDiv.innerHTML;
    
    // Salva o tema aplicado
    const temas = lerTemasComponentes();
    temas[String(componentId)] = temaNome;
    salvarTemasComponentes(temas);
  }

  function removerTemaComponente(componentId) {
    const comp = (window.componentes || []).find(c => c.id === componentId);
    if (comp && comp._originalHtml) {
      comp.html = comp._originalHtml;
    }
    
    const temas = lerTemasComponentes();
    delete temas[String(componentId)];
    salvarTemasComponentes(temas);
  }

  function resetarTodosTemasAoPadrao() {
    // Restaura HTMLs originais de todos os componentes
    (window.componentes || []).forEach(comp => {
      if (comp._originalHtml) {
        comp.html = comp._originalHtml;
        delete comp._originalHtml;
      }
    });
    
    // Remove todos os temas salvos do localStorage
    salvarTemasComponentes({});
    salvarTemaGlobal('padrao');
  }

  function aplicarTemaGlobal(temaNome) {
    if (!temaNome || !TEMAS[temaNome]) return;
    
    const ids = lerComponentesEscolhidos();
    ids.forEach(id => {
      aplicarTemaAComponente(id, temaNome);
    });
    
    salvarTemaGlobal(temaNome);
  }

  function initThemeSelector() {
    const selectGlobal = document.getElementById('select-tema-global');
    const selectComponente = document.getElementById('select-tema-componente');
    const btnAplicarGlobal = document.getElementById('btn-aplicar-tema-global');
    const btnResetGlobal = document.getElementById('btn-reset-tema');
    const btnAplicarComponente = document.getElementById('btn-aplicar-tema-componente');
    const btnResetComponente = document.getElementById('btn-reset-tema-componente');

    // Carrega tema global salvo
    const temaGlobalSalvo = lerTemaGlobal();
    if (selectGlobal) {
      selectGlobal.value = temaGlobalSalvo || 'padrao';
    }

    btnAplicarGlobal?.addEventListener('click', () => {
      const tema = selectGlobal?.value || 'padrao';
      if (tema === 'padrao') {
        // Remove todos os temas aplicados
        const ids = lerComponentesEscolhidos();
        ids.forEach(id => {
          removerTemaComponente(id);
        });
        salvarTemaGlobal('padrao');
      } else {
        aplicarTemaGlobal(tema);
      }
      renderCanvasPreview();
      renderListaComponentes();
      updateWrapperSelectionUI();
    });

    btnResetGlobal?.addEventListener('click', () => {
      const ids = lerComponentesEscolhidos();
      ids.forEach(id => {
        removerTemaComponente(id);
      });
      salvarTemaGlobal('padrao');
      if (selectGlobal) selectGlobal.value = 'padrao';
      renderCanvasPreview();
      renderListaComponentes();
    });

    btnAplicarComponente?.addEventListener('click', () => {
      const tema = selectComponente?.value || 'padrao';
      if (!selectionState.selectedIds.length) return;
      
      selectionState.selectedIds.forEach(id => {
        aplicarTemaAComponente(id, tema);
      });
      
      renderCanvasPreview();
      renderListaComponentes();
      updateWrapperSelectionUI();
    });

    btnResetComponente?.addEventListener('click', () => {
      if (!selectionState.selectedIds.length) return;
      
      selectionState.selectedIds.forEach(id => {
        removerTemaComponente(id);
      });
      
      renderCanvasPreview();
      renderListaComponentes();
      updateWrapperSelectionUI();
    });
  }

  // -----------------------
  // Persistência cores por componente
  // -----------------------
  function salvarCustomColors(map) {
    localStorage.setItem(STORAGE_KEYS.customColors, JSON.stringify(map || {}));
  }

  function lerCustomColors() {
    const raw = localStorage.getItem(STORAGE_KEYS.customColors);
    return raw ? JSON.parse(raw) : {};
  }

  // Nova estrutura: salva um mapa de propriedade CSS -> cor para cada componente
  function getColorsForComponent(id) {
    const custom = lerCustomColors();
    const c = custom[String(id)];
    // Mantém compatibilidade com o formato antigo (accent, background, text)
    if (c && (c.accent || c.background || c.text)) {
      return c;
    }
    return c || {};
  }

  // -----------------------
  // Extração de cores dos componentes
  // -----------------------
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  function parseColor(colorStr) {
    if (!colorStr || colorStr.trim() === '') return null;
    
    colorStr = colorStr.trim();
    
    // Hex (#ffffff)
    if (/^#[0-9A-Fa-f]{6}$/.test(colorStr)) {
      return colorStr.toLowerCase();
    }
    
    // Hex shorthand (#fff)
    if (/^#[0-9A-Fa-f]{3}$/.test(colorStr)) {
      return '#' + colorStr[1] + colorStr[1] + colorStr[2] + colorStr[2] + colorStr[3] + colorStr[3];
    }
    
    // rgb/rgba
    const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      return rgbToHex(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3]));
    }
    
    // Nomes de cores comuns
    const colorNames = {
      'white': '#ffffff', 'black': '#000000', 'red': '#ff0000', 'green': '#008000',
      'blue': '#0000ff', 'yellow': '#ffff00', 'orange': '#ffa500', 'purple': '#800080',
      'pink': '#ffc0cb', 'gray': '#808080', 'grey': '#808080', 'transparent': null
    };
    if (colorNames[colorStr.toLowerCase()]) {
      return colorNames[colorStr.toLowerCase()];
    }
    
    return null;
  }

  function extractColorsFromComponent(componentId) {
    const comp = (window.componentes || []).find(c => c.id === componentId);
    if (!comp || !comp.html) return [];

    // Salva HTML original para referência
    if (!comp._originalHtml) {
      comp._originalHtml = comp.html;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = comp._originalHtml;
    
    // Map para agrupar elementos similares: "tag_property" -> {elements: [], colors: []}
    const groupedElements = new Map();
    
    // Propriedades CSS que contêm cores
    const colorProperties = [
      'background-color', 'background', 'color', 'border-color', 'border-top-color',
      'border-bottom-color', 'border-left-color', 'border-right-color',
      'outline-color'
    ];
    
    // Processa todos os elementos com atributo style
    const allElements = tempDiv.querySelectorAll('[style]');
    allElements.forEach((el) => {
      const styleAttr = el.getAttribute('style');
      if (!styleAttr) return;
      
      const tagName = el.tagName.toLowerCase();
      
      // Extrai propriedades de cor deste elemento
      colorProperties.forEach(prop => {
        const regex = new RegExp(`(?:^|;)\\s*${prop.replace(/-/g, '\\-')}\\s*:\\s*([^;]+)`, 'gi');
        const match = regex.exec(styleAttr);
        if (match) {
          const colorValue = match[1].trim();
          const cleanValue = colorValue.replace(/\s+/g, ' ').trim();
          const hex = parseColor(cleanValue);
          if (hex) {
            // Cria chave de agrupamento baseada em tag + propriedade + cor similar
            // Elementos com mesma tag e mesma propriedade são agrupados
            const groupKey = `${tagName}_${prop}`;
            
            if (!groupedElements.has(groupKey)) {
              groupedElements.set(groupKey, {
                tag: tagName,
                property: prop,
                hex: hex,
                originalValue: cleanValue,
                elements: [],
                selector: tagName, // Seletor simples para buscar todos os elementos similares
                isGroup: true
              });
            }
            
            // Adiciona este elemento ao grupo
            const group = groupedElements.get(groupKey);
            if (!group.elements.includes(el)) {
              group.elements.push(el);
            }
            
            // Mantém a primeira cor encontrada como padrão (o usuário pode alterar depois)
            // Todos os elementos do grupo receberão a mesma cor quando aplicada
          }
        }
      });
    });
    
    // Converte grupos em formato de saída
    const elementColors = [];
    groupedElements.forEach((group, key) => {
      if (group.elements.length > 0) {
        elementColors.push({
          tag: group.tag,
          property: group.property,
          hex: group.hex, // Usa a primeira cor encontrada como padrão
          originalValue: group.originalValue,
          selector: group.selector,
          isGroup: true,
          count: group.elements.length,
          elements: group.elements.map(el => generateElementSelector(el, tempDiv))
        });
      }
    });
    
    // Ordena por tag e propriedade para melhor organização
    elementColors.sort((a, b) => {
      if (a.tag !== b.tag) return a.tag.localeCompare(b.tag);
      return a.property.localeCompare(b.property);
    });
    
    return elementColors;
  }
  
  function generateElementSelector(el, container) {
    // Gera um seletor simples para identificar o elemento
    let selector = el.tagName.toLowerCase();
    if (el.id) {
      selector += '#' + el.id;
    }
    if (el.className && typeof el.className === 'string') {
      selector += '.' + el.className.split(' ').join('.');
    }
    
    // Se ainda não é único, adiciona índice
    const similar = container.querySelectorAll(selector);
    if (similar.length > 1) {
      const index = Array.from(similar).indexOf(el);
      selector += `:nth-of-type(${index + 1})`;
    }
    
    return selector;
  }

  // -------------------
  // Persona / armazenamento componentes
  // -------------------
  function salvarPersona(persona) {
    localStorage.setItem(STORAGE_KEYS.persona, JSON.stringify(persona));
  }

  function lerPersona() {
    const raw = localStorage.getItem(STORAGE_KEYS.persona);
    return raw ? JSON.parse(raw) : null;
  }

  function limparComponentesEscolhidos() {
    localStorage.removeItem(STORAGE_KEYS.componentesEscolhidos);
  }

  function lerComponentesEscolhidos() {
    const raw = localStorage.getItem(STORAGE_KEYS.componentesEscolhidos);
    return raw ? JSON.parse(raw) : [];
  }

  function salvarComponentesEscolhidos(listaIds) {
    localStorage.setItem(STORAGE_KEYS.componentesEscolhidos, JSON.stringify(listaIds));
  }

  // -------------------
  // Index / Persona pages
  // -------------------
  function initIndex() {
    const btn = document.getElementById('btn-comecar');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const select = document.getElementById('select-dificuldade');
      const radio = document.querySelector('input[name="dificuldade"]:checked');
      const dif = select?.value || radio?.value || 'facil';

      let retries = 0;
      if (dif === 'facil') retries = 3;
      else if (dif === 'medio') retries = 2;
      else retries = 1;

      localStorage.setItem(STORAGE_KEYS.difficulty, dif);
      localStorage.setItem(STORAGE_KEYS.retries, String(retries));

      const indice = Math.floor(Math.random() * (window.personas?.length || 1));
      const sorteada = (window.personas && window.personas[indice]) || null;
      if (sorteada) {
        salvarPersona(sorteada);
        salvarComponentesEscolhidos([]);
        // Reseta todos os temas ao padrão ao iniciar nova partida
        resetarTodosTemasAoPadrao();
        window.location.href = 'persona.html';
      } else {
        alert('Nenhuma persona disponível.');
      }
    });
  }

  function initPersona() {
  const alvo = document.getElementById('persona-conteudo');
  if (!alvo) return;
  const persona = lerPersona();
  if (!persona) {
    alvo.innerHTML = '<div class="alert alert-warning">Nenhuma persona encontrada. Volte e comece novamente.</div>';
    return;
  }

  const nomeCompleto = persona.nomeCompleto
    || ((persona.nome || '') + (persona.sobrenome ? (' ' + persona.sobrenome) : ''))
    || persona.nome
    || '—';

  // foto/ avatar (aceita persona.photo, persona.foto, persona.avatar)
  let foto = persona.photo || persona.foto || persona.avatar || '';
  const isValidUrl = (u) => typeof u === 'string' && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/'));
  if (!isValidUrl(foto)) {
    const label = encodeURIComponent(nomeCompleto);
    foto = `https://via.placeholder.com/240x240.png?text=${label}`;
  }

  // idade e trabalho (fallbacks)
  const idade = (persona.idade || persona.age) ? `${persona.idade || persona.age} anos` : null;
  const trabalho = persona.profissao || persona.trabalho || persona.role || persona.ocupacao || null;

  // gostos/hobbies (array) e briefing
  const gostos = Array.isArray(persona.gostos) ? persona.gostos : (persona.likes ? (Array.isArray(persona.likes) ? persona.likes : [persona.likes]) : []);
  const briefing = persona.briefing || persona.description || persona.summary || '';

  // preferência (por acessibilidade)
  const preferencia = persona.preferencia || persona.preference || '—';

  // inline style para aumentar imagem (240x240) e garantir object-fit
  const imgStyle = 'width:240px;height:240px;object-fit:cover;border-radius:12px;border:2px solid rgba(0,0,0,0.06);';

  const html = `
    <div class="persona-card">
      <div>
        <img src="${foto}"
             alt="Foto de ${nomeCompleto}"
             loading="lazy"
             style="${imgStyle}"
             class="persona-avatar shadow-sm"
             onerror="this.onerror=null;this.src='https://via.placeholder.com/240x240.png?text=${encodeURIComponent(nomeCompleto)}'">
      </div>
      <div>
        <div class="persona-name">${nomeCompleto}</div>
        ${trabalho ? `<div class="persona-role">${trabalho}${idade ? ` • ${idade}` : ''}</div>` : (idade ? `<div class="persona-role">${idade}</div>` : '')}
        <div class="persona-meta mb-2">${briefing}</div>

        <div class="persona-section-title">Preferências</div>
        <div class="mb-2">
          <small class="text-muted">Acessibilidade / preferência:</small>
          <div class="fw-semibold">${preferencia}</div>
        </div>

        ${gostos.length ? `
          <div class="persona-section-title">Gostos / Hobbies</div>
          <div class="persona-badges mb-2">
            ${gostos.map((g) => `<span class="badge bg-light text-dark">${String(g)}</span>`).join(' ')}
          </div>` : ''}

        ${persona.demografia || persona.location ? `
          <div class="persona-section-title">Demografia</div>
          <div class="persona-meta">${persona.demografia || persona.location}</div>` : ''}

        ${persona.contact ? `
          <div class="persona-section-title">Contato (exemplo)</div>
          <div class="persona-meta">${persona.contact}</div>` : ''}
      </div>
    </div>
  `;

  alvo.innerHTML = html;
}

  // -------------------
  // Resumos explicativos por tipo de componente
  // -------------------
  const RESUMOS_COMPONENTES = {
    Todos: 'Componentes são blocos reutilizáveis que compõem uma página web. Cada componente tem diferentes níveis de acessibilidade (alta, média ou baixa) e pode ser personalizado com temas de contraste.',
    Navbar: 'A Navbar (barra de navegação) é o elemento superior da página que contém links para as principais seções do site, geralmente incluindo a logo e o menu de navegação. É o primeiro elemento que os usuários veem e interagem.',
    Section: 'Sections (seções) são áreas de conteúdo que agrupam informações relacionadas. Podem incluir Hero (seção inicial com destaque), Gallery (galeria de imagens), Contact (formulário de contato) e outras seções de conteúdo.',
    Card: 'Cards são componentes que exibem informações de forma compacta e organizada, geralmente em formato de cartão com bordas. São ideais para destacar conteúdo, produtos ou serviços de forma visualmente atraente.',
    Footer: 'O Footer (rodapé) é a seção inferior da página que geralmente contém informações de contato, links importantes, copyright e outras informações complementares. É o último elemento visual da página.'
  };

  function atualizarResumoComponentes() {
    const resumoEl = document.getElementById('resumo-componentes');
    if (!resumoEl) return;
    
    const filtro = state.filtroTipo || 'Todos';
    const texto = RESUMOS_COMPONENTES[filtro] || RESUMOS_COMPONENTES['Todos'];
    resumoEl.textContent = texto;
  }

  // -------------------
  // Lista de componentes / seleção
  // -------------------
  function renderListaComponentes() {
    const lista = document.getElementById('lista-componentes');
    if (!lista) return;
    lista.innerHTML = '';

    // Atualiza o resumo explicativo
    atualizarResumoComponentes();

    const itens = state.filtroTipo === 'Todos'
      ? (window.componentes || [])
      : (window.componentes || []).filter((c) => {
        if (state.filtroTipo === 'Section') {
          return c.categoria === 'Section' || c.tipo === 'Section' || c.tipo === 'Hero' || c.tipo === 'Gallery' || c.tipo === 'Contact';
        }
        return c.tipo === state.filtroTipo || c.categoria === state.filtroTipo;
      });

    itens.forEach((comp) => {
      const item = document.createElement('div');
      item.className = 'card componente-item';
      item.innerHTML = `
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-semibold">${comp.tipo}${comp.categoria ? ` · ${comp.categoria}` : ''}</div>
              <small class="text-muted">Acessibilidade: ${comp.acessibilidade || '—'}</small>
            </div>
            <span class="badge text-bg-secondary">#${comp.id}</span>
          </div>

          <div class="mt-2 small">${comp.descricao || ''}</div>

          <div class="mt-3 componente-preview" data-preview-id="${comp.id}">
            <div class="preview-inner">
              ${comp.html || '<div class="text-muted small">Sem preview disponível</div>'}
            </div>
          </div>

          <div class="mt-3 d-flex justify-content-end">
            <button class="btn btn-sm btn-primary select-btn" data-id="${comp.id}">Selecionar</button>
          </div>
        </div>
      `;
      lista.appendChild(item);

      const previewEl = item.querySelector('.componente-preview');
      previewEl.querySelectorAll('script').forEach((s) => s.remove());

      const previewInner = item.querySelector('.preview-inner');
      if (previewInner) {
        // Usa cores padrão para preview (temas são aplicados diretamente no HTML)
        previewInner.style.setProperty('--accent-color', DEFAULT_COLORS.accent);
        previewInner.style.setProperty('--component-bg', DEFAULT_COLORS.background);
        previewInner.style.setProperty('--component-text', DEFAULT_COLORS.text);
      }

      const btn = item.querySelector('.select-btn');
      btn?.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        window.selectComponent(id);
      });
    });

    requestAnimationFrame(adjustAllPreviews);
  }

  // -------------------
  // Ajuste de escala das previews
  // -------------------
  function adjustPreview(previewEl) {
    const inner = previewEl.querySelector('.preview-inner');
    if (!inner) return;

    inner.style.transform = '';
    inner.style.width = '';
    inner.style.display = '';

    const containerH = previewEl.clientHeight || 120;
    const contentH = inner.scrollHeight || inner.offsetHeight || 1;
    const scale = Math.min(1, containerH / contentH);

    inner.style.transformOrigin = 'top left';
    inner.style.transform = `scale(${scale})`;
    inner.style.width = `${100 / (scale || 1)}%`;
  }

  function adjustAllPreviews() {
    document.querySelectorAll('.componente-preview').forEach((el) => {
      try { adjustPreview(el); } catch (e) { /* silent */ }
    });
  }

  let __previewResizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(__previewResizeTimer);
    __previewResizeTimer = setTimeout(adjustAllPreviews, 120);
  });

  // -------------------
  // Ordem / Canvas render
  // -------------------
  function atualizarOrdemUI() {
    const ordem = document.getElementById('lista-ordem');
    if (!ordem) return;
    const ids = lerComponentesEscolhidos();
    ordem.innerHTML = '';
    ids.forEach((id) => {
      const comp = (window.componentes || []).find((c) => c.id === id) || { tipo: `#${id}` };
      const li = document.createElement('li');
      li.textContent = `${comp.tipo} ${comp.acessibilidade ? `(${comp.acessibilidade})` : ''}`;
      ordem.appendChild(li);
    });
  }

  function atualizarEstadoBotaoFinalizar() {
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (!btnFinalizar) return;
    
    const ids = lerComponentesEscolhidos();
    const temMinimo = ids && ids.length >= 3;
    
    if (temMinimo) {
      btnFinalizar.disabled = false;
      btnFinalizar.textContent = 'Finalizar';
      btnFinalizar.classList.remove('btn-secondary');
      btnFinalizar.classList.add('btn-success');
    } else {
      btnFinalizar.disabled = true;
      const faltam = 3 - (ids?.length || 0);
      btnFinalizar.classList.remove('btn-success');
      btnFinalizar.classList.add('btn-secondary');
    }
  }

  function renderCanvasPreview() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const ids = lerComponentesEscolhidos();
    if (!ids || ids.length === 0) {
      canvas.textContent = 'Clique em "Selecionar" nos componentes para adicioná-los ao canvas';
      canvas.classList.add('text-muted');
      selectionState.selectedIds = [];
      updatePerComponentCustomizerUI();
      atualizarEstadoBotaoFinalizar();
      return;
    }
    canvas.classList.remove('text-muted');

    const page = document.createElement('div');
    page.className = 'prototype-page';
    // Cores padrão (não usamos mais colorSettings, mas mantemos para compatibilidade visual)
    page.style.setProperty('--accent-color', DEFAULT_COLORS.accent);
    page.style.setProperty('--component-bg', DEFAULT_COLORS.background);
    page.style.setProperty('--component-text', DEFAULT_COLORS.text);

    ids.forEach((id) => {
      const comp = (window.componentes || []).find((c) => c.id === id);
      const wrapper = document.createElement('div');
      wrapper.className = 'prototype-block';
      wrapper.setAttribute('data-comp-id', String(id));
      
      // Usa HTML do componente (pode estar com tema aplicado)
      let htmlToUse = comp?.html || `<div style="padding:8px;background:#f8f9fa;border-radius:6px">Componente #${id}</div>`;
      
      // Verifica se há tema aplicado (o tema já foi aplicado no HTML do componente)
      const temas = lerTemasComponentes();
      const temaAplicado = temas[String(id)];
      // Não precisa fazer nada aqui, pois o tema já foi aplicado diretamente no comp.html
      
      wrapper.innerHTML = htmlToUse;

      wrapper.addEventListener('click', (ev) => {
        ev.stopPropagation();
        toggleSelectedComponent(id);
      });

      if (selectionState.selectedIds.includes(id)) wrapper.classList.add('selected');

      page.appendChild(wrapper);
    });

    canvas.innerHTML = '';
    canvas.appendChild(page);
    
    // Atualiza estado do botão finalizar
    atualizarEstadoBotaoFinalizar();
  }

  // -------------------
  // Seleção por componente e UI do customizer por componente
  // -------------------
  function toggleSelectedComponent(id) {
    const idx = selectionState.selectedIds.indexOf(id);
    if (idx >= 0) selectionState.selectedIds.splice(idx, 1);
    else selectionState.selectedIds.push(id);
    updateWrapperSelectionUI();
    updatePerComponentCustomizerUI();
  }

  function clearSelectedComponents() {
    selectionState.selectedIds = [];
    updateWrapperSelectionUI();
    updatePerComponentCustomizerUI();
  }

  function updateWrapperSelectionUI() {
    document.querySelectorAll('.prototype-block').forEach((el) => {
      const id = Number(el.getAttribute('data-comp-id'));
      if (selectionState.selectedIds.includes(id)) el.classList.add('selected');
      else el.classList.remove('selected');
    });
  }

  function updatePerComponentCustomizerUI() {
    const perCompContainer = document.getElementById('per-comp-theme-selector');
    const globalContainer = document.getElementById('global-theme-selector');
    const selectComponente = document.getElementById('select-tema-componente');
    
    if (!perCompContainer || !globalContainer) return;
    
    if (selectionState.selectedIds.length === 0) {
      perCompContainer.classList.add('d-none');
      globalContainer.classList.remove('d-none');
      return;
    }
    
    perCompContainer.classList.remove('d-none');
    globalContainer.classList.add('d-none');
    
    // Verifica se todos os componentes selecionados têm o mesmo tema
    const temasComponentes = lerTemasComponentes();
    const temasSelecionados = selectionState.selectedIds.map(id => temasComponentes[String(id)]).filter(Boolean);
    
    // Se todos têm o mesmo tema, mostra no select, senão deixa em "padrao" como padrão
    if (temasSelecionados.length > 0 && new Set(temasSelecionados).size === 1) {
      if (selectComponente) {
        selectComponente.value = temasSelecionados[0];
      }
    } else {
      if (selectComponente) {
        selectComponente.value = 'padrao';
      }
    }
  }

  // Funções antigas de cores removidas - agora usamos temas
  function applyColorsToSelected() {
    // Mantida para compatibilidade, mas não faz nada - agora usa temas
  }
  
  function applyColorsToComponentHtml() {
    // Mantida para compatibilidade
  }

  function resetColorsForSelected() {
    // Agora remove tema ao invés de cores
    selectionState.selectedIds.forEach((id) => {
      removerTemaComponente(id);
    });
    renderCanvasPreview();
    renderListaComponentes();
    updateWrapperSelectionUI();
    updatePerComponentCustomizerUI();
  }

  // -------------------
  // Excluir componente(s) selecionado(s) do canvas
  // -------------------
  function excluirSelectedFromCanvas() {
    if (!selectionState.selectedIds.length) {
      alert('Nenhum componente selecionado para excluir.');
      return;
    }
    const confirmMsg = selectionState.selectedIds.length === 1
      ? 'Excluir o componente selecionado do canvas?'
      : `Excluir ${selectionState.selectedIds.length} componentes selecionados do canvas?`;
    if (!confirm(confirmMsg)) return;

    const ids = lerComponentesEscolhidos();
    const filtered = ids.filter((id) => !selectionState.selectedIds.includes(id));
    salvarComponentesEscolhidos(filtered);

    atualizarOrdemUI();
    renderCanvasPreview();
    renderListaComponentes();
    clearSelectedComponents();
    atualizarEstadoBotaoFinalizar();
  }

  // clique fora limpa seleção
  document.addEventListener('click', (ev) => {
    const inCanvas = ev.target.closest('#canvas, #per-comp-theme-selector, #global-theme-selector, .prototype-block');
    if (!inCanvas) clearSelectedComponents();
  });

  // -------------------
  // Seleção pública (adicionar componente ao canvas)
  // -------------------
  window.selectComponent = function (id) {
    const ids = lerComponentesEscolhidos();
    if (ids.includes(id)) {
      alert('Componente já selecionado.');
      return;
    }
    ids.push(id);
    salvarComponentesEscolhidos(ids);
    atualizarOrdemUI();
    renderCanvasPreview();
    atualizarEstadoBotaoFinalizar();
  };

  // -------------------
  // Editor init
  // -------------------
  function initEditor() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    // Aplica temas salvos nos componentes ao carregar
    const temasComponentes = lerTemasComponentes();
    Object.keys(temasComponentes).forEach(id => {
      const temaNome = temasComponentes[id];
      aplicarTemaAComponente(Number(id), temaNome);
    });

    renderListaComponentes();
    atualizarOrdemUI();
    renderCanvasPreview();
    initThemeSelector();
    atualizarEstadoBotaoFinalizar();
    
    // Configura evento do botão finalizar
    const btnFinalizar = document.getElementById('btn-finalizar');
    btnFinalizar?.addEventListener('click', (e) => {
      const ids = lerComponentesEscolhidos();
      if (!ids || ids.length < 3) {
        e.preventDefault();
        alert('É necessário adicionar pelo menos 3 componentes para finalizar.');
        return false;
      }
      window.location.href = 'resultado.html';
    });

    const btnLimpar = document.getElementById('btn-limpar');
    btnLimpar?.addEventListener('click', () => {
      salvarComponentesEscolhidos([]);
      atualizarOrdemUI();
      
      // Restaura HTMLs originais dos componentes
      (window.componentes || []).forEach(comp => {
        if (comp._originalHtml) {
          comp.html = comp._originalHtml;
          delete comp._originalHtml;
          delete comp._modifiedHtml;
        }
      });

      // Remove todos os temas aplicados
      const temas = lerTemasComponentes();
      Object.keys(temas).forEach(id => {
        removerTemaComponente(Number(id));
      });
      salvarTemasComponentes({});
      salvarTemaGlobal('padrao');
      
      const selectGlobal = document.getElementById('select-tema-global');
      if (selectGlobal) selectGlobal.value = 'padrao';

      clearSelectedComponents();
      renderCanvasPreview();
      atualizarEstadoBotaoFinalizar();
    });

    const filtroGroup = document.querySelector('[aria-label="Filtro por tipo"]');
    if (filtroGroup) {
      filtroGroup.addEventListener('click', (ev) => {
        const btn = ev.target.closest('[data-filter]');
        if (!btn) return;
        filtroGroup.querySelectorAll('[data-filter]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.filtroTipo = btn.getAttribute('data-filter') || 'Todos';
        renderListaComponentes();
      });
    } else {
      const filtroBotoes = document.querySelectorAll('[data-filter]');
      filtroBotoes.forEach((btn) => {
        btn.addEventListener('click', () => {
          filtroBotoes.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          state.filtroTipo = btn.getAttribute('data-filter') || 'Todos';
          renderListaComponentes();
        });
      });
    }

    // Botões de tema já estão configurados em initThemeSelector
    const btnCompDelete = document.getElementById('btn-comp-excluir');
    (btnCompDelete)?.addEventListener('click', (e) => {
      e.preventDefault();
      excluirSelectedFromCanvas();
    });
  }

  // -------------------
  // Boot
  // -------------------
  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path.endsWith('/') || path.endsWith('\\')) {
      initIndex();
    } else if (path.endsWith('persona.html')) {
      initPersona();
    } else if (path.endsWith('editor.html')) {
      initEditor();
    }
  });

  // helpers export
  window._simulador_keys = STORAGE_KEYS;
})();