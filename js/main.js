(function () {
  'use strict';

  const STORAGE_KEYS = {
    persona: 'simulador_persona',
    componentesEscolhidos: 'simulador_componentes',
    colorSettings: 'simulador_colors',
    customColors: 'simulador_custom_colors',
    retries: 'simulador_retries',
    difficulty: 'simulador_difficulty'
  };

  const DEFAULT_COLORS = {
    accent: '#0d6efd',
    background: '#ffffff',
    text: '#212529'
  };

  const state = {
    filtroTipo: 'Todos'
  };

  const selectionState = {
    selectedIds: []
  };

  // -------------------
  // Color customizer (global)
  // -------------------
  function salvarColorSettings(colors) {
    localStorage.setItem(STORAGE_KEYS.colorSettings, JSON.stringify(colors));
  }

  function lerColorSettings() {
    const raw = localStorage.getItem(STORAGE_KEYS.colorSettings);
    return raw ? JSON.parse(raw) : { ...DEFAULT_COLORS };
  }

  function applyColorSettings(colors) {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      canvas.style.setProperty('--accent-color', colors.accent);
      canvas.style.setProperty('--component-bg', colors.background);
      canvas.style.setProperty('--component-text', colors.text);
    }
    document.querySelectorAll('.componente-preview .preview-inner, .prototype-page, .prototype-block').forEach((el) => {
      el.style.setProperty('--accent-color', colors.accent);
      el.style.setProperty('--component-bg', colors.background);
      el.style.setProperty('--component-text', colors.text);
    });
  }

  function initCustomizer() {
    const inpAccent = document.getElementById('color-accent');
    const inpBg = document.getElementById('color-bg');
    const inpText = document.getElementById('color-text');
    const btnAplicar = document.getElementById('btn-aplicar-cores');
    const btnReset = document.getElementById('btn-reset-cores');

    if (!inpAccent || !inpBg || !inpText) return;

    const saved = lerColorSettings();
    inpAccent.value = saved.accent || DEFAULT_COLORS.accent;
    inpBg.value = saved.background || DEFAULT_COLORS.background;
    inpText.value = saved.text || DEFAULT_COLORS.text;
    applyColorSettings(saved);

    btnAplicar?.addEventListener('click', () => {
      const colors = { accent: inpAccent.value, background: inpBg.value, text: inpText.value };
      salvarColorSettings(colors);
      applyColorSettings(colors);
      renderListaComponentes();
      renderCanvasPreview();
    });

    btnReset?.addEventListener('click', () => {
      salvarColorSettings(DEFAULT_COLORS);
      inpAccent.value = DEFAULT_COLORS.accent;
      inpBg.value = DEFAULT_COLORS.background;
      inpText.value = DEFAULT_COLORS.text;
      applyColorSettings(DEFAULT_COLORS);
      renderListaComponentes();
      renderCanvasPreview();
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
  // Lista de componentes / seleção
  // -------------------
  function renderListaComponentes() {
    const lista = document.getElementById('lista-componentes');
    if (!lista) return;
    lista.innerHTML = '';

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
        const compColors = getColorsForComponent(comp.id);
        previewInner.style.setProperty('--accent-color', compColors.accent);
        previewInner.style.setProperty('--component-bg', compColors.background);
        previewInner.style.setProperty('--component-text', compColors.text);
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

  function renderCanvasPreview() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const ids = lerComponentesEscolhidos();
    if (!ids || ids.length === 0) {
      canvas.textContent = 'Clique em "Selecionar" nos componentes para adicioná-los ao canvas';
      canvas.classList.add('text-muted');
      selectionState.selectedIds = [];
      updatePerComponentCustomizerUI();
      return;
    }
    canvas.classList.remove('text-muted');

    const page = document.createElement('div');
    page.className = 'prototype-page';
    const colors = lerColorSettings();
    page.style.setProperty('--accent-color', colors.accent);
    page.style.setProperty('--component-bg', colors.background);
    page.style.setProperty('--component-text', colors.text);

    const customMap = lerCustomColors();

    ids.forEach((id) => {
      const comp = (window.componentes || []).find((c) => c.id === id);
      const wrapper = document.createElement('div');
      wrapper.className = 'prototype-block';
      wrapper.setAttribute('data-comp-id', String(id));
      
      // Usa HTML modificado se existir, senão usa o original
      let htmlToUse = comp?.html || `<div style="padding:8px;background:#f8f9fa;border-radius:6px">Componente #${id}</div>`;
      
      // Aplica cores personalizadas se existirem
      const customColors = customMap[String(id)];
      if (customColors && comp && Object.keys(customColors).length > 0) {
        // Salva original se necessário
        if (!comp._originalHtml) {
          comp._originalHtml = comp.html;
        }
        
        let modifiedHtml = comp._originalHtml;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = comp._originalHtml;
        
        // Para cada elemento/grupo com cores personalizadas
        Object.keys(customColors).forEach(elementKey => {
          const colorValue = customColors[elementKey];
          
          // Verifica se é um grupo (tag_property = valor direto)
          const groupMatch = elementKey.match(/^(\w+)_(.+)$/);
          if (groupMatch && typeof colorValue === 'string') {
            // É um grupo: aplica a cor em todos os elementos dessa tag com essa propriedade
            const tagName = groupMatch[1];
            const property = groupMatch[2];
            const newHex = colorValue;
            
            // Busca todos os elementos desta tag no HTML
            const tagElements = tempDiv.querySelectorAll(tagName);
            tagElements.forEach((el) => {
              if (el.hasAttribute('style')) {
                let elementStyle = el.getAttribute('style');
                const escapedProp = property.replace(/-/g, '\\-');
                const regex = new RegExp(`(?:^|;)\\s*${escapedProp}\\s*:\\s*[^;]+`, 'gi');
                
                const hasProperty = regex.test(elementStyle);
                regex.lastIndex = 0;
                
                if (hasProperty) {
                  elementStyle = elementStyle.replace(regex, (match) => {
                    return match.replace(/:\s*[^;]+/, ': ' + newHex);
                  });
                } else {
                  elementStyle = (elementStyle.trim().endsWith(';') ? elementStyle : elementStyle + ';') + ` ${property}: ${newHex};`;
                }
                el.setAttribute('style', elementStyle.trim());
              }
            });
            
            // Também substitui diretamente no HTML string para garantir
            const escapedProp = property.replace(/-/g, '\\-');
            const regex = new RegExp(`(<${tagName}[^>]*\\sstyle\\s*=\\s*["'])([^"']*${escapedProp}\\s*:\\s*)([^;"]+)([^"']*)(["'])`, 'gi');
            modifiedHtml = modifiedHtml.replace(regex, (match, start, propPart, oldVal, rest, end) => {
              return start + propPart + newHex + rest + end;
            });
          } else {
            // É um elemento individual (estrutura antiga para compatibilidade)
            const elementColors = typeof colorValue === 'object' ? colorValue : {};
            const elementSelector = elementKey;
            
            // Encontra o elemento no DOM temporário
            let targetElement = null;
            try {
              targetElement = tempDiv.querySelector(elementSelector);
            } catch (e) {
              const parts = elementSelector.split('_');
              if (parts.length >= 2) {
                const allOfTag = tempDiv.querySelectorAll(parts[0]);
                const index = parseInt(parts[1]);
                if (allOfTag[index]) {
                  targetElement = allOfTag[index];
                }
              }
            }
            
            if (targetElement && targetElement.hasAttribute('style')) {
              let elementStyle = targetElement.getAttribute('style');
              
              Object.keys(elementColors).forEach(property => {
                const newHex = elementColors[property];
                const escapedProp = property.replace(/-/g, '\\-');
                const regex = new RegExp(`(?:^|;)\\s*${escapedProp}\\s*:\\s*[^;]+`, 'gi');
                
                const hasProperty = regex.test(elementStyle);
                regex.lastIndex = 0;
                
                if (hasProperty) {
                  elementStyle = elementStyle.replace(regex, (match) => {
                    return match.replace(/:\s*[^;]+/, ': ' + newHex);
                  });
                } else {
                  elementStyle = (elementStyle.trim().endsWith(';') ? elementStyle : elementStyle + ';') + ` ${property}: ${newHex};`;
                }
              });
              
              targetElement.setAttribute('style', elementStyle.trim());
            }
          }
        });
        
        if (tempDiv.innerHTML !== comp._originalHtml) {
          htmlToUse = tempDiv.innerHTML;
        } else {
          htmlToUse = modifiedHtml;
        }
      }
      
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
    const container = document.getElementById('per-comp-customizer');
    const noneContainer = document.getElementById('global-customizer');
    const inputsContainer = document.getElementById('comp-color-inputs-container');
    if (!container || !noneContainer || !inputsContainer) return;
    
    if (selectionState.selectedIds.length === 0) {
      container.classList.add('d-none');
      noneContainer.classList.remove('d-none');
      inputsContainer.innerHTML = '';
      return;
    }
    
    container.classList.remove('d-none');
    noneContainer.classList.add('d-none');
    
    // Limpa container
    inputsContainer.innerHTML = '';
    
    // Cria um formulário para cada componente selecionado
    selectionState.selectedIds.forEach((componentId) => {
      const comp = (window.componentes || []).find(c => c.id === componentId);
      if (!comp) return;
      
      const extractedElements = extractColorsFromComponent(componentId);
      const savedColors = getColorsForComponent(componentId);
      
      // Cria card/formulário para este componente
      const componentForm = document.createElement('div');
      componentForm.className = 'mb-4 p-3 border rounded';
      componentForm.setAttribute('data-component-id', componentId);
      
      // Cabeçalho com nome do componente
      const header = document.createElement('div');
      header.className = 'mb-3 pb-2 border-bottom';
      header.innerHTML = `
        <h6 class="mb-0 small fw-semibold">Componente #${componentId} - ${comp.tipo || 'Componente'}</h6>
        <small class="text-muted">${comp.descricao || ''}</small>
      `;
      componentForm.appendChild(header);
      
      if (extractedElements.length === 0) {
        const noColorsMsg = document.createElement('div');
        noColorsMsg.className = 'small text-muted';
        noColorsMsg.textContent = 'Nenhum elemento com cor detectado neste componente.';
        componentForm.appendChild(noColorsMsg);
      } else {
        // Agrupa elementos por tag para melhor organização
        const elementsByTag = {};
        extractedElements.forEach((elementInfo) => {
          if (!elementsByTag[elementInfo.tag]) {
            elementsByTag[elementInfo.tag] = [];
          }
          elementsByTag[elementInfo.tag].push(elementInfo);
        });
        
        // Cria seção para cada tag
        Object.keys(elementsByTag).forEach(tagName => {
          const tagElements = elementsByTag[tagName];
          const tagSection = document.createElement('div');
          tagSection.className = 'mb-3';
          
          // Label da tag
          const tagLabel = document.createElement('div');
          tagLabel.className = 'small fw-semibold mb-2 text-secondary';
          const totalCount = tagElements.reduce((sum, el) => sum + (el.count || 1), 0);
          tagLabel.innerHTML = `&lt;${tagName}&gt; ${totalCount > 1 ? `<span class="text-muted">(${totalCount} elementos)</span>` : ''}`;
          tagSection.appendChild(tagLabel);
          
          // Cria input para cada propriedade de cor desta tag
          tagElements.forEach((elementInfo) => {
            const propertyLabel = elementInfo.property
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            // Busca cor salva: estrutura salvaColors[tag_property] = hex (para grupos)
            const elementKey = elementInfo.selector || `${elementInfo.tag}_${elementInfo.property}`;
            const savedHex = (savedColors && savedColors[elementKey] && (typeof savedColors[elementKey] === 'string' ? savedColors[elementKey] : savedColors[elementKey][elementInfo.property])) || elementInfo.hex || '#000000';
            
            const colorWrapper = document.createElement('div');
            colorWrapper.className = 'mb-2 ms-3';
            colorWrapper.innerHTML = `
              <label class="form-label small" style="display: block; margin-bottom: 0.25rem;">${propertyLabel} ${elementInfo.count > 1 ? `<small class="text-muted">(${elementInfo.count}x)</small>` : ''}</label>
              <input type="color" 
                     data-component-id="${componentId}"
                     data-element-tag="${elementInfo.tag}"
                     data-element-selector="${elementKey}"
                     data-property="${elementInfo.property}" 
                     data-original-hex="${elementInfo.hex || '#000000'}"
                     data-is-group="${elementInfo.isGroup || false}"
                     class="form-control form-control-color comp-color-input" 
                     value="${savedHex}"
                     style="width: 100%; height: 38px;">
            `;
            tagSection.appendChild(colorWrapper);
          });
          
          componentForm.appendChild(tagSection);
        });
      }
      
      inputsContainer.appendChild(componentForm);
    });
  }

  function applyColorsToSelected() {
    if (!selectionState.selectedIds.length) return;
    
    const map = lerCustomColors();
    
    // Agrupa inputs por component-id
    selectionState.selectedIds.forEach((componentId) => {
      const inputs = document.querySelectorAll(`#comp-color-inputs-container input[data-component-id="${componentId}"]`);
      const componentColorMap = {};
      
      inputs.forEach(input => {
        const elementTag = input.getAttribute('data-element-tag');
        const elementSelector = input.getAttribute('data-element-selector');
        const property = input.getAttribute('data-property');
        const value = input.value;
        const isGroup = input.getAttribute('data-is-group') === 'true';
        
        if (elementSelector && property && value) {
          // Para grupos, usa tag_property como chave
          if (isGroup) {
            const groupKey = `${elementTag}_${property}`;
            componentColorMap[groupKey] = value; // Valor direto para grupos
          } else {
            if (!componentColorMap[elementSelector]) {
              componentColorMap[elementSelector] = {};
            }
            componentColorMap[elementSelector][property] = value;
          }
        }
      });
      
      map[String(componentId)] = componentColorMap;
    });
    
    salvarCustomColors(map);
    
    renderCanvasPreview();
    renderListaComponentes();
    updateWrapperSelectionUI();
  }
  
  function applyColorsToComponentHtml() {
    // Esta função apenas marca que as cores devem ser aplicadas
    // A aplicação real acontece no renderCanvasPreview
  }

  function resetColorsForSelected() {
    const map = lerCustomColors();
    selectionState.selectedIds.forEach((id) => {
      delete map[String(id)];
      // Não precisa restaurar o HTML aqui, pois sempre usa _originalHtml como base
    });
    salvarCustomColors(map);
    renderCanvasPreview();
    renderListaComponentes();
    updateWrapperSelectionUI();
    updatePerComponentCustomizerUI(); // Atualiza inputs para mostrar cores originais
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
  }

  // clique fora limpa seleção
  document.addEventListener('click', (ev) => {
    const inCanvas = ev.target.closest('#canvas, #per-comp-customizer, #global-customizer, .prototype-block');
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
  };

  // -------------------
  // Editor init
  // -------------------
  function initEditor() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    renderListaComponentes();
    atualizarOrdemUI();
    renderCanvasPreview();
    initCustomizer();

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

      salvarColorSettings(DEFAULT_COLORS);
      applyColorSettings(DEFAULT_COLORS);
      salvarCustomColors({});

      const inpAccent = document.getElementById('color-accent');
      const inpBg = document.getElementById('color-bg');
      const inpText = document.getElementById('color-text');
      if (inpAccent) inpAccent.value = DEFAULT_COLORS.accent;
      if (inpBg) inpBg.value = DEFAULT_COLORS.background;
      if (inpText) inpText.value = DEFAULT_COLORS.text;

      clearSelectedComponents();
      renderCanvasPreview();
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

    const btnCompApply = document.getElementById('btn-comp-aplicar');
    const btnCompReset = document.getElementById('btn-comp-resetar');
    const btnCompDelete = document.getElementById('btn-comp-excluir');
    (btnCompApply)?.addEventListener('click', (e) => {
      e.preventDefault();
      applyColorsToSelected();
    });
    (btnCompReset)?.addEventListener('click', (e) => {
      e.preventDefault();
      resetColorsForSelected();
    });
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