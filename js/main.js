// Lógica principal de navegação e interações entre páginas
// Usa localStorage para manter persona sorteada e componentes escolhidos

(function () {
  const STORAGE_KEYS = {
    persona: 'simulador_persona',
    componentesEscolhidos: 'simulador_componentes',
  };

  const state = {
    filtroTipo: 'Todos',
  };

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

  function initIndex() {
    const btn = document.getElementById('btn-comecar');
    if (!btn) return;
    btn.addEventListener('click', () => {
      // Sorteio simples de persona
      const indice = Math.floor(Math.random() * window.personas.length);
      const sorteada = window.personas[indice];
      salvarPersona(sorteada);
      limparComponentesEscolhidos();
      window.location.href = 'persona.html';
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

  function renderListaComponentes() {
    const lista = document.getElementById('lista-componentes');
    if (!lista) return;
    lista.innerHTML = '';
    const itens = state.filtroTipo === 'Todos'
      ? window.componentes
      : window.componentes.filter((c) => c.tipo === state.filtroTipo);

    itens.forEach((comp) => {
      const item = document.createElement('div');
      item.className = 'card componente-item';
      item.draggable = true;
      item.ondragstart = (ev) => onDragStart(ev, comp.id);
      item.innerHTML = `
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-semibold">${comp.tipo}</div>
              <small class="text-muted">Acessibilidade: ${comp.acessibilidade}</small>
            </div>
            <span class="badge text-bg-secondary">#${comp.id}</span>
          </div>
          <div class="mt-2 small">${comp.descricao}</div>
        </div>
      `;
      lista.appendChild(item);
    });
  }

  function lerComponentesEscolhidos() {
    const raw = localStorage.getItem(STORAGE_KEYS.componentesEscolhidos);
    return raw ? JSON.parse(raw) : [];
  }

  function salvarComponentesEscolhidos(listaIds) {
    localStorage.setItem(STORAGE_KEYS.componentesEscolhidos, JSON.stringify(listaIds));
  }

  function atualizarOrdemUI() {
    const ordem = document.getElementById('lista-ordem');
    if (!ordem) return;
    const ids = lerComponentesEscolhidos();
    ordem.innerHTML = '';
    ids.forEach((id) => {
      const comp = window.componentes.find((c) => c.id === id);
      const li = document.createElement('li');
      li.textContent = `${comp.tipo} (${comp.acessibilidade})`;
      ordem.appendChild(li);
    });
  }

  function renderCanvasPreview() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const ids = lerComponentesEscolhidos();
    if (ids.length === 0) {
      canvas.textContent = 'Arraste e solte componentes aqui';
      canvas.classList.add('text-muted');
      return;
    }
    canvas.classList.remove('text-muted');
    // Monta um "protótipo" visual com HTML real dos componentes
    const page = document.createElement('div');
    page.className = 'prototype-page';
    ids.forEach((id) => {
      const comp = window.componentes.find((c) => c.id === id);
      const wrapper = document.createElement('div');
      wrapper.className = 'prototype-block';
      wrapper.innerHTML = comp.html || '';
      page.appendChild(wrapper);
    });
    canvas.innerHTML = '';
    canvas.appendChild(page);
  }

  function initEditor() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    renderListaComponentes();
    atualizarOrdemUI();
    renderCanvasPreview();

    const btnLimpar = document.getElementById('btn-limpar');
    btnLimpar?.addEventListener('click', () => {
      salvarComponentesEscolhidos([]);
      atualizarOrdemUI();
      renderCanvasPreview();
    });

    // Filtros por tipo
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

  // Handlers globais simples (para uso inline em atributos HTML)
  window.onDragStart = function (event, componenteId) {
    event.dataTransfer.setData('text/plain', String(componenteId));
  };

  window.onDrop = function (event) {
    event.preventDefault();
    const rawId = event.dataTransfer.getData('text/plain');
    const id = Number(rawId);
    if (!id) return;
    const atuais = lerComponentesEscolhidos();
    atuais.push(id);
    salvarComponentesEscolhidos(atuais);
    atualizarOrdemUI();
    renderCanvasPreview();
  };

  // Bootstrap das páginas
  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path.endsWith('/projeto-layout/') || path.endsWith('/projeto-layout')) {
      initIndex();
    } else if (path.endsWith('persona.html')) {
      initPersona();
    } else if (path.endsWith('editor.html')) {
      initEditor();
    }
  });
})();

