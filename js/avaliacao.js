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

  function avaliar(persona, idsComponentes) {
    let score = 0;
    const feedback = [];

    idsComponentes.forEach((id) => {
      const comp = window.componentes.find((c) => c.id === id);
      if (!comp) return;

      if (persona.preferencia === 'alta' && comp.acessibilidade === 'alta') {
        score += 20;
        feedback.push(`✔ ${comp.tipo}: boa escolha para alta acessibilidade.`);
      } else if (persona.preferencia === 'media' && (comp.acessibilidade === 'media' || comp.acessibilidade === 'alta')) {
        score += 15;
        feedback.push(`✔ ${comp.tipo}: atende bem a preferência média/alta.`);
      } else if (persona.preferencia === 'baixa' && (comp.acessibilidade === 'baixa' || comp.acessibilidade === 'media')) {
        score += 10;
        feedback.push(`✔ ${comp.tipo}: combina com preferências mais visuais/dinâmicas.`);
      } else {
        score -= 10;
        feedback.push(`✖ ${comp.tipo}: não combina com a preferência ${persona.preferencia}.`);
      }
    });

    // Normaliza score para 0-100
    score = Math.max(0, Math.min(100, score));
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
    if (feedback.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Nenhum componente selecionado. Tente montar um layout.';
      listaFb.appendChild(li);
    } else {
      feedback.forEach((f) => {
        const li = document.createElement('li');
        li.textContent = f;
        listaFb.appendChild(li);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.endsWith('resultado.html')) {
      renderResultado();
    }
  });
})();

