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

  // Cores padrão
  const DEFAULT_COLORS = {
    accent: '#0d6efd',
    background: '#ffffff',
    text: '#212529'
  };

  // Estado de UI
  const state = {
    filtroTipo: 'Todos'
  };

  // seleção de componentes no canvas (IDs)
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
      const colors = {
        accent: inpAccent.value,
        background: inpBg.value,
        text: inpText.value
      };
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

  function getColorsForComponent(id) {
    const custom = lerCustomColors();
    const c = custom[String(id)];
    const global = lerColorSettings();
    return {
      accent: (c && c.accent) || global.accent || DEFAULT_COLORS.accent,
      background: (c && c.background) || global.background || DEFAULT_COLORS.background,
      text: (c && c.text) || global.text || DEFAULT_COLORS.text
    };
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
      const dif = document.querySelector('input[name="dificuldade"]:checked')?.value || 'facil';
      let retries = 0;
      if (dif === 'facil') retries = 2;
      else if (dif === 'medio') retries = 1;
      else retries = 0;

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
    alvo.innerHTML = `
      <div class="mb-2"><strong>Nome:</strong> ${persona.nome}</div>
      <div class="mb-2"><strong>Briefing:</strong> ${persona.briefing}</div>
      <div class="mb-0"><strong>Preferência de acessibilidade:</strong> ${persona.preferencia}</div>
    `;
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

    ids.forEach((id) => {
      const comp = (window.componentes || []).find((c) => c.id === id);
      const wrapper = document.createElement('div');
      wrapper.className = 'prototype-block';
      wrapper.setAttribute('data-comp-id', String(id));
      const compColors = getColorsForComponent(id);
      wrapper.style.setProperty('--accent-color', compColors.accent);
      wrapper.style.setProperty('--component-bg', compColors.background);
      wrapper.style.setProperty('--component-text', compColors.text);
      wrapper.innerHTML = comp?.html || `<div style="padding:8px;background:#f8f9fa;border-radius:6px">Componente #${id}</div>`;

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
    if (idx >= 0) {
      selectionState.selectedIds.splice(idx, 1);
    } else {
      selectionState.selectedIds.push(id);
    }
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
    if (!container || !noneContainer) return;
    if (selectionState.selectedIds.length === 0) {
      container.classList.add('d-none');
      noneContainer.classList.remove('d-none');
      return;
    }
    container.classList.remove('d-none');
    noneContainer.classList.add('d-none');

    const firstId = selectionState.selectedIds[0];
    const colors = getColorsForComponent(firstId);
    const a = document.getElementById('comp-color-accent');
    const b = document.getElementById('comp-color-bg');
    const t = document.getElementById('comp-color-text');
    if (a) a.value = colors.accent;
    if (b) b.value = colors.background;
    if (t) t.value = colors.text;
  }

  function applyColorsToSelected() {
    const a = document.getElementById('comp-color-accent')?.value;
    const b = document.getElementById('comp-color-bg')?.value;
    const t = document.getElementById('comp-color-text')?.value;
    if (!selectionState.selectedIds.length) return;
    const map = lerCustomColors();
    selectionState.selectedIds.forEach((id) => {
      map[String(id)] = { accent: a, background: b, text: t };
    });
    salvarCustomColors(map);
    renderCanvasPreview();
    renderListaComponentes();
    updateWrapperSelectionUI();
  }

  function resetColorsForSelected() {
    const map = lerCustomColors();
    selectionState.selectedIds.forEach((id) => {
      delete map[String(id)];
    });
    salvarCustomColors(map);
    renderCanvasPreview();
    renderListaComponentes();
    updateWrapperSelectionUI();
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
      renderCanvasPreview();

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

  // expose some helpers if needed
  window._simulador_keys = STORAGE_KEYS;
})();