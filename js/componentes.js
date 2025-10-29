// Componentes pré-definidos com diferentes níveis de acessibilidade
// Cada componente inclui um snippet HTML real para renderização no canvas
// Todos os estilos estão inline

const componentes = [
  {
    id: 1,
    tipo: "Navbar",
    acessibilidade: "alta",
    descricao: "Navbar com letras grandes e alto contraste",
    html: `
<nav style="background-color: #212529; color: #fff; padding: 0.75rem 0;">
  <div style="width: 100%; max-width: 1320px; margin: 0 auto; padding: 0 15px;">
    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;">
      <a href="#" style="font-size: 1.5rem; color: #fff; text-decoration: none; font-weight: 500; padding: 0.5rem 0;">Marca</a>
      <button type="button" style="display: none; padding: 0.25rem 0.75rem; font-size: 1.25rem; background-color: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 0.25rem; color: rgba(255,255,255,0.95); cursor: pointer;" aria-label="Alternar navegação">
        <span style="display: inline-block; width: 1.5em; height: 1.5em; vertical-align: middle; background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.95%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\"); background-repeat: no-repeat; background-position: center; background-size: 100%;"></span>
      </button>
      <div style="display: flex; flex-grow: 1; justify-content: flex-end;">
        <ul style="display: flex; flex-direction: row; padding: 0; margin: 0; list-style: none; gap: 0;">
          <li style="margin: 0;"><a href="#" style="display: block; padding: 0.5rem 1rem; color: #fff; text-decoration: none; font-size: 1rem; font-weight: 500; border-bottom: 2px solid transparent;">Início</a></li>
          <li style="margin: 0;"><a href="#" style="display: block; padding: 0.5rem 1rem; color: #fff; text-decoration: none; font-size: 1rem; font-weight: 500; border-bottom: 2px solid transparent;">Sobre</a></li>
          <li style="margin: 0;"><a href="#" style="display: block; padding: 0.5rem 1rem; color: #fff; text-decoration: none; font-size: 1rem; font-weight: 500; border-bottom: 2px solid transparent;">Contato</a></li>
        </ul>
      </div>
    </div>
  </div>
</nav>`
  },
  {
    id: 2,
    tipo: "Navbar",
    acessibilidade: "baixa",
    descricao: "Navbar com letras pequenas e pouco contraste",
    html: `
<nav style="background-color: #f8f9fa; color: #212529; padding: 0.25rem 0; border-bottom: 1px solid #dee2e6;">
  <div style="width: 100%; max-width: 1320px; margin: 0 auto; padding: 0 15px;">
    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;">
      <a href="#" style="font-size: 0.875rem; color: #6c757d; text-decoration: none; font-weight: 400; padding: 0.5rem 0;">Marca</a>
      <button type="button" style="display: none; padding: 0.25rem 0.75rem; font-size: 1.25rem; background-color: transparent; border: 1px solid rgba(0,0,0,0.1); border-radius: 0.25rem; color: rgba(0,0,0,0.5); cursor: pointer;" aria-label="Alternar navegação">
        <span style="display: inline-block; width: 1.5em; height: 1.5em; vertical-align: middle; background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%280, 0, 0, 0.5%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\"); background-repeat: no-repeat; background-position: center; background-size: 100%;"></span>
      </button>
      <div style="display: flex; flex-grow: 1; justify-content: flex-end;">
        <ul style="display: flex; flex-direction: row; padding: 0; margin: 0; list-style: none; gap: 0;">
          <li style="margin: 0;"><a href="#" style="display: block; padding: 0.5rem 1rem; color: #6c757d; text-decoration: none; font-size: 0.875rem; font-weight: 400;">Home</a></li>
          <li style="margin: 0;"><a href="#" style="display: block; padding: 0.5rem 1rem; color: #6c757d; text-decoration: none; font-size: 0.875rem; font-weight: 400;">Serviços</a></li>
          <li style="margin: 0;"><a href="#" style="display: block; padding: 0.5rem 1rem; color: #6c757d; text-decoration: none; font-size: 0.875rem; font-weight: 400;">Contato</a></li>
        </ul>
      </div>
    </div>
  </div>
</nav>`
  },
  {
    id: 7,
    tipo: "Navbar",
    acessibilidade: "media",
    descricao: "Navbar transparente sobre imagem (visual moderno)",
    html: `
<nav style="background: rgba(0,0,0,0.5); color: #fff; padding: 0.5rem 0;">
  <div style="width: 100%; max-width: 1320px; margin: 0 auto; padding: 0 15px;">
    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;">
      <a href="#" style="font-size: 1.25rem; color: #fff; text-decoration: none; font-weight: 500; padding: 0.5rem 0;">Studio</a>
      <button type="button" style="display: none; padding: 0.25rem 0.75rem; font-size: 1.25rem; background-color: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 0.25rem; color: rgba(255,255,255,0.9); cursor: pointer;" aria-label="Alternar navegação">
        <span style="display: inline-block; width: 1.5em; height: 1.5em; vertical-align: middle; background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.9%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\"); background-repeat: no-repeat; background-position: center; background-size: 100%;"></span>
      </button>
      <div style="display: flex; flex-grow: 1; justify-content: flex-end;">
        <ul style="display: flex; flex-direction: row; padding: 0; margin: 0; list-style: none; gap: 0;">
          <li style="margin: 0;"><a href="#" style="display: block; padding: 0.5rem 1rem; color: rgba(255,255,255,0.9); text-decoration: none; font-size: 0.95rem; font-weight: 400;">Portfolio</a></li>
          <li style="margin: 0;"><a href="#" style="display: block; padding: 0.5rem 1rem; color: rgba(255,255,255,0.9); text-decoration: none; font-size: 0.95rem; font-weight: 400;">Equipe</a></li>
          <li style="margin: 0;"><a href="#" style="display: block; padding: 0.5rem 1rem; color: rgba(255,255,255,0.9); text-decoration: none; font-size: 0.95rem; font-weight: 400;">Contato</a></li>
        </ul>
      </div>
    </div>
  </div>
</nav>`
  },
  {
    id: 8,
    tipo: "Navbar",
    acessibilidade: "alta",
    descricao: "Navbar com barra superior informativa e contraste forte",
    html: `
<div style="background-color: #0d6efd; color: #fff; padding: 0.25rem 0;">
  <div style="width: 100%; max-width: 1320px; margin: 0 auto; padding: 0 15px; display: flex; justify-content: space-between; align-items: center;">
    <small style="font-size: 0.875rem; line-height: 1.5;">Telefone: (11) 0000-0000</small>
    <small style="font-size: 0.875rem; line-height: 1.5;">Acessibilidade: alto contraste</small>
  </div>
</div>
<nav style="background-color: #212529; color: #fff; padding: 0.5rem 0;">
  <div style="width: 100%; max-width: 1320px; margin: 0 auto; padding: 0 15px;">
    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;">
      <a href="#" style="font-size: 1.25rem; color: #fff; text-decoration: none; font-weight: 500; padding: 0.5rem 0;">Empresa</a>
      <button type="button" style="display: none; padding: 0.25rem 0.75rem; font-size: 1.25rem; background-color: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 0.25rem; color: rgba(255,255,255,0.95); cursor: pointer;" aria-label="Alternar navegação">
        <span style="display: inline-block; width: 1.5em; height: 1.5em; vertical-align: middle; background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.95%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\"); background-repeat: no-repeat; background-position: center; background-size: 100%;"></span>
      </button>
      <div style="display: flex; flex-grow: 1; justify-content: flex-end;">
        <ul style="display: flex; flex-direction: row; padding: 0; margin: 0; list-style: none; gap: 0;">
          <li style="margin: 0;"><a href="#" style="display: block; padding: 0.5rem 1rem; color: #fff; text-decoration: none; font-size: 1rem; font-weight: 500;">Início</a></li>
          <li style="margin: 0;"><a href="#" style="display: block; padding: 0.5rem 1rem; color: #fff; text-decoration: none; font-size: 1rem; font-weight: 500;">Serviços</a></li>
          <li style="margin: 0;"><a href="#" style="display: block; padding: 0.5rem 1rem; color: #fff; text-decoration: none; font-size: 1rem; font-weight: 500;">Contato</a></li>
        </ul>
      </div>
    </div>
  </div>
</nav>`
  },
  {
    id: 9,
    tipo: "Navbar",
    acessibilidade: "baixa",
    descricao: "Navbar minimalista com links discretos",
    html: `
<nav style="background-color: #fff; color: #212529; padding: 0.5rem 0; border-bottom: 1px solid #dee2e6;">
  <div style="width: 100%; max-width: 1320px; margin: 0 auto; padding: 0 15px;">
    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;">
      <a href="#" style="font-size: 1.25rem; color: #6c757d; text-decoration: none; font-weight: 400; padding: 0.5rem 0;">Minimal</a>
      <div style="display: flex; flex-grow: 1; justify-content: flex-end; align-items: center; gap: 0;">
        <a href="#" style="color: #6c757d; font-size: 0.875rem; padding: 0.5rem 1rem; text-decoration: none; font-weight: 300;">Home</a>
        <a href="#" style="color: #6c757d; font-size: 0.875rem; padding: 0.5rem 1rem; text-decoration: none; font-weight: 300;">Work</a>
        <a href="#" style="color: #6c757d; font-size: 0.875rem; padding: 0.5rem 1rem; text-decoration: none; font-weight: 300;">Contact</a>
      </div>
    </div>
  </div>
</nav>`
  },
  {
    id: 3,
    tipo: "Hero",
    categoria: "Section",
    acessibilidade: "alta",
    descricao: "Hero com texto grande e espaçamento generoso",
    html: `
<section style="padding: 3rem 0; background-color: #f8f9fa; border-bottom: 1px solid #dee2e6;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px;">
    <h1 style="font-size: 3rem; font-weight: 700; margin-bottom: 1rem; line-height: 1.2;">Título grande acessível</h1>
    <p style="font-size: 1.25rem; font-weight: 300; margin-bottom: 1rem; line-height: 1.5;">Texto com bom espaçamento e contraste para leitura confortável.</p>
    <a href="#" style="display: inline-block; padding: 0.5rem 1rem; font-size: 1.125rem; font-weight: 400; line-height: 1.5; color: #fff; background-color: #0d6efd; border: 1px solid #0d6efd; border-radius: 0.375rem; text-decoration: none;">Chamada para ação</a>
  </div>
</section>`
  },
  {
    id: 4,
    tipo: "Hero",
    categoria: "Section",
    acessibilidade: "media",
    descricao: "Hero moderno com boa hierarquia visual",
    html: `
<section style="padding: 3rem 0;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px;">
    <h2 style="font-size: 2rem; font-weight: 500; margin-bottom: 1rem; line-height: 1.2;">Hero moderno</h2>
    <p style="margin-bottom: 1rem; color: #6c757d; line-height: 1.5;">Descrição com hierarquia clara e visual atual.</p>
    <a href="#" style="display: inline-block; padding: 0.375rem 0.75rem; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #0d6efd; background-color: transparent; border: 1px solid #0d6efd; border-radius: 0.375rem; text-decoration: none;">Saiba mais</a>
  </div>
</section>`
  },
  {
    id: 10,
    tipo: "Section",
    acessibilidade: "alta",
    descricao: "Seção com duas colunas e textos grandes",
    html: `
<section style="padding: 3rem 0; background-color: #fff;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px;">
    <div style="display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; align-items: center;">
      <div style="flex: 0 0 auto; width: 50%; padding-right: 15px; padding-left: 15px;">
        <h2 style="font-size: 2.5rem; font-weight: 500; margin-bottom: 0.5rem; line-height: 1.2;">Clareza e Legibilidade</h2>
        <p style="font-size: 1.25rem; font-weight: 300; margin-bottom: 1rem; line-height: 1.5;">Textos maiores, contraste adequado e hierarquia simples.</p>
        <a href="#" style="display: inline-block; padding: 0.5rem 1rem; font-size: 1.125rem; font-weight: 400; line-height: 1.5; color: #fff; background-color: #0d6efd; border: 1px solid #0d6efd; border-radius: 0.375rem; text-decoration: none;">Ação</a>
      </div>
      <div style="flex: 0 0 auto; width: 50%; padding-right: 15px; padding-left: 15px;">
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 0.375rem;"></div>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 11,
    tipo: "Cards informativos",
    categoria: "Section",
    acessibilidade: "media",
    descricao: "Seção com cards informativos e hierarquia visual",
    html: `
<section style="padding: 3rem 0; background-color: #f8f9fa;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px;">
    <div style="display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px;">
      <div style="flex: 0 0 auto; width: 33.33333333%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,0.125); border-radius: 0.375rem; height: 100%;">
          <div style="flex: 1 1 auto; padding: 1rem;">
            <h5 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Benefício 1</h5>
            <p style="margin-bottom: 0; color: #6c757d; line-height: 1.5;">Descrição clara e objetiva do benefício.</p>
          </div>
        </div>
      </div>
      <div style="flex: 0 0 auto; width: 33.33333333%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,0.125); border-radius: 0.375rem; height: 100%;">
          <div style="flex: 1 1 auto; padding: 1rem;">
            <h5 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Benefício 2</h5>
            <p style="margin-bottom: 0; color: #6c757d; line-height: 1.5;">Equilíbrio entre estética e funcionalidade.</p>
          </div>
        </div>
      </div>
      <div style="flex: 0 0 auto; width: 33.33333333%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,0.125); border-radius: 0.375rem; height: 100%;">
          <div style="flex: 1 1 auto; padding: 1rem;">
            <h5 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Benefício 3</h5>
            <p style="margin-bottom: 0; color: #6c757d; line-height: 1.5;">Boa hierarquia e espaçamento confortável.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 12,
    tipo: "Section",
    acessibilidade: "baixa",
    descricao: "Seção com fundo colorido e tipografia pequena (impacto visual)",
    html: `
<section style="padding: 3rem 0; background: linear-gradient(90deg,#6610f2,#6f42c1);">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px; color: #fff;">
    <h3 style="font-size: 1.75rem; margin-bottom: 1rem; font-weight: 500; line-height: 1.2;">Promoções</h3>
    <p style="font-size: 0.875rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; line-height: 1.5;">Conteúdo rápido com foco em visual.</p>
    <a href="#" style="display: inline-block; padding: 0.25rem 0.5rem; font-size: 0.875rem; font-weight: 400; line-height: 1.5; color: #000; background-color: #f8f9fa; border: 1px solid #f8f9fa; border-radius: 0.375rem; text-decoration: none;">Ver mais</a>
  </div>
</section>`
  },
  {
    id: 5,
    tipo: "Card",
    acessibilidade: "baixa",
    descricao: "Card pequeno e com texto pequeno",
    html: `
<section style="padding: 1.5rem 0;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px;">
    <div style="display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px;">
      <div style="flex: 0 0 auto; width: 50%; padding-right: 7.5px; padding-left: 7.5px; margin-bottom: 0.5rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,0.125); border-radius: 0.375rem;">
          <div style="flex: 1 1 auto; padding: 0.5rem;">
            <h5 style="font-size: 0.875rem; margin-bottom: 0.25rem; font-weight: 500; line-height: 1.2; color: #6c757d;">Card</h5>
            <p style="font-size: 0.875rem; margin-bottom: 0; color: #6c757d; line-height: 1.5;">Texto pequeno e baixo contraste.</p>
            <a href="#" style="display: inline-block; padding: 0.25rem 0.5rem; font-size: 0.875rem; font-weight: 400; line-height: 1.5; color: #212529; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 0.375rem; text-decoration: none;">Abrir</a>
          </div>
        </div>
      </div>
      <div style="flex: 0 0 auto; width: 50%; padding-right: 7.5px; padding-left: 7.5px; margin-bottom: 0.5rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,0.125); border-radius: 0.375rem;">
          <div style="flex: 1 1 auto; padding: 0.5rem;">
            <h5 style="font-size: 0.875rem; margin-bottom: 0.25rem; font-weight: 500; line-height: 1.2; color: #6c757d;">Card</h5>
            <p style="font-size: 0.875rem; margin-bottom: 0; color: #6c757d; line-height: 1.5;">Conteúdo enxuto e compacto.</p>
            <a href="#" style="display: inline-block; padding: 0.25rem 0.5rem; font-size: 0.875rem; font-weight: 400; line-height: 1.5; color: #212529; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 0.375rem; text-decoration: none;">Abrir</a>
          </div>
        </div>
      </div>
      <div style="flex: 0 0 auto; width: 50%; padding-right: 7.5px; padding-left: 7.5px; margin-bottom: 0.5rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,0.125); border-radius: 0.375rem;">
          <div style="flex: 1 1 auto; padding: 0.5rem;">
            <h5 style="font-size: 0.875rem; margin-bottom: 0.25rem; font-weight: 500; line-height: 1.2; color: #6c757d;">Card</h5>
            <p style="font-size: 0.875rem; margin-bottom: 0; color: #6c757d; line-height: 1.5;">Pouco espaçamento e tipografia menor.</p>
            <a href="#" style="display: inline-block; padding: 0.25rem 0.5rem; font-size: 0.875rem; font-weight: 400; line-height: 1.5; color: #212529; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 0.375rem; text-decoration: none;">Abrir</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 13,
    tipo: "Card",
    acessibilidade: "alta",
    descricao: "Cards grandes com contraste e CTA evidente",
    html: `
<section style="padding: 3rem 0;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px;">
    <div style="display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px;">
      <div style="flex: 0 0 auto; width: 33.33333333%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 2px solid rgba(0,0,0,0.125); border-radius: 0.375rem; height: 100%;">
          <div style="flex: 1 1 auto; padding: 1rem;">
            <h4 style="font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Plano Básico</h4>
            <p style="margin-bottom: 1rem; line-height: 1.5;">Ideal para começar. Fácil leitura.</p>
            <a href="#" style="display: inline-block; padding: 0.375rem 0.75rem; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #fff; background-color: #0d6efd; border: 1px solid #0d6efd; border-radius: 0.375rem; text-decoration: none;">Escolher</a>
          </div>
        </div>
      </div>
      <div style="flex: 0 0 auto; width: 33.33333333%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 2px solid rgba(0,0,0,0.125); border-radius: 0.375rem; height: 100%;">
          <div style="flex: 1 1 auto; padding: 1rem;">
            <h4 style="font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Plano Pro</h4>
            <p style="margin-bottom: 1rem; line-height: 1.5;">Melhor custo-benefício.</p>
            <a href="#" style="display: inline-block; padding: 0.375rem 0.75rem; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #fff; background-color: #0d6efd; border: 1px solid #0d6efd; border-radius: 0.375rem; text-decoration: none;">Escolher</a>
          </div>
        </div>
      </div>
      <div style="flex: 0 0 auto; width: 33.33333333%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 2px solid rgba(0,0,0,0.125); border-radius: 0.375rem; height: 100%;">
          <div style="flex: 1 1 auto; padding: 1rem;">
            <h4 style="font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Plano Premium</h4>
            <p style="margin-bottom: 1rem; line-height: 1.5;">Recursos avançados.</p>
            <a href="#" style="display: inline-block; padding: 0.375rem 0.75rem; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #fff; background-color: #0d6efd; border: 1px solid #0d6efd; border-radius: 0.375rem; text-decoration: none;">Escolher</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 14,
    tipo: "Card",
    acessibilidade: "media",
    descricao: "Cards com imagens e hierarquia equilibrada",
    html: `
<section style="padding: 3rem 0; background-color: #f8f9fa;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px;">
    <div style="display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px;">
      <div style="flex: 0 0 auto; width: 33.33333333%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,0.125); border-radius: 0.375rem; height: 100%;">
          <img src="https://picsum.photos/seed/a/600/300" alt="Imagem" style="width: 100%; border-top-left-radius: calc(0.375rem - 1px); border-top-right-radius: calc(0.375rem - 1px);">
          <div style="flex: 1 1 auto; padding: 1rem;">
            <h5 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Título</h5>
            <p style="margin-bottom: 0; color: #6c757d; line-height: 1.5;">Descrição moderada e legível.</p>
          </div>
        </div>
      </div>
      <div style="flex: 0 0 auto; width: 33.33333333%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,0.125); border-radius: 0.375rem; height: 100%;">
          <img src="https://picsum.photos/seed/b/600/300" alt="Imagem" style="width: 100%; border-top-left-radius: calc(0.375rem - 1px); border-top-right-radius: calc(0.375rem - 1px);">
          <div style="flex: 1 1 auto; padding: 1rem;">
            <h5 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Título</h5>
            <p style="margin-bottom: 0; color: #6c757d; line-height: 1.5;">Equilíbrio visual.</p>
          </div>
        </div>
      </div>
      <div style="flex: 0 0 auto; width: 33.33333333%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,0.125); border-radius: 0.375rem; height: 100%;">
          <img src="https://picsum.photos/seed/c/600/300" alt="Imagem" style="width: 100%; border-top-left-radius: calc(0.375rem - 1px); border-top-right-radius: calc(0.375rem - 1px);">
          <div style="flex: 1 1 auto; padding: 1rem;">
            <h5 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Título</h5>
            <p style="margin-bottom: 0; color: #6c757d; line-height: 1.5;">Boa hierarquia.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 15,
    tipo: "Card",
    acessibilidade: "baixa",
    descricao: "Mosaico denso de cards (mais visual, menos legível)",
    html: `
<section style="padding: 1rem 0;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px;">
    <div style="display: flex; flex-wrap: wrap; margin-right: -7.5px; margin-left: -7.5px;">
      ${Array.from({ length: 8 }).map((_, i) => `
      <div style="flex: 0 0 auto; width: 50%; padding-right: 7.5px; padding-left: 7.5px; margin-bottom: 0.5rem;">
        <div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,0.125); border-radius: 0.375rem; height: 100%;">
          <div style="flex: 1 1 auto; padding: 0.5rem;">
            <div style="font-size: 0.875rem; color: #6c757d; margin-bottom: 0.25rem;">Item ${i + 1}</div>
            <a href="#" style="display: inline-block; padding: 0.25rem 0.5rem; font-size: 0.875rem; font-weight: 400; line-height: 1.5; color: #212529; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 0.375rem; text-decoration: none;">Ver</a>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>`
  },
  {
    id: 20,
    tipo: "Card",
    acessibilidade: "media",
    descricao: "Lista de cards horizontais com ícone e texto",
    html: `
<section style="padding: 1.5rem 0;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px;">
    <div style="display: flex; flex-direction: column; padding-left: 0; margin-bottom: 0; list-style: none;">
      <a href="#" style="position: relative; display: block; padding: 1rem 0; color: #212529; text-decoration: none; background-color: #fff; border: 1px solid rgba(0,0,0,0.125); border-top-width: 0;">
        <div style="display: flex; width: 100%; align-items: center;">
          <span style="display: inline-block; padding: 0.35em 0.65em; font-size: 0.75em; font-weight: 700; line-height: 1; color: #fff; text-align: center; white-space: nowrap; vertical-align: baseline; background-color: #0d6efd; border-radius: 50rem; margin-right: 1rem;">1</span>
          <div>
            <h5 style="margin-bottom: 0.25rem; font-size: 1.25rem; font-weight: 500; line-height: 1.2;">Atualização de Produto</h5>
            <small style="color: #6c757d; font-size: 0.875em;">Melhorias moderadas e legíveis</small>
          </div>
        </div>
      </a>
      <a href="#" style="position: relative; display: block; padding: 1rem 0; color: #212529; text-decoration: none; background-color: #fff; border: 1px solid rgba(0,0,0,0.125); border-top-width: 0;">
        <div style="display: flex; width: 100%; align-items: center;">
          <span style="display: inline-block; padding: 0.35em 0.65em; font-size: 0.75em; font-weight: 700; line-height: 1; color: #fff; text-align: center; white-space: nowrap; vertical-align: baseline; background-color: #198754; border-radius: 50rem; margin-right: 1rem;">2</span>
          <div>
            <h5 style="margin-bottom: 0.25rem; font-size: 1.25rem; font-weight: 500; line-height: 1.2;">Novidades</h5>
            <small style="color: #6c757d; font-size: 0.875em;">Conteúdo equilibrado</small>
          </div>
        </div>
      </a>
      <a href="#" style="position: relative; display: block; padding: 1rem 0; color: #212529; text-decoration: none; background-color: #fff; border: 1px solid rgba(0,0,0,0.125); border-top-width: 0;">
        <div style="display: flex; width: 100%; align-items: center;">
          <span style="display: inline-block; padding: 0.35em 0.65em; font-size: 0.75em; font-weight: 700; line-height: 1; color: #fff; text-align: center; white-space: nowrap; vertical-align: baseline; background-color: #6c757d; border-radius: 50rem; margin-right: 1rem;">3</span>
          <div>
            <h5 style="margin-bottom: 0.25rem; font-size: 1.25rem; font-weight: 500; line-height: 1.2;">Eventos</h5>
            <small style="color: #6c757d; font-size: 0.875em;">Informações organizadas</small>
          </div>
        </div>
      </a>
    </div>
  </div>
</section>`
  },
  {
    id: 6,
    tipo: "Footer",
    acessibilidade: "alta",
    descricao: "Footer simples, alto contraste e leitura clara",
    html: `
<footer style="background-color: #212529; color: #fff; padding: 1.5rem 0;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px; display: flex; justify-content: space-between; align-items: center;">
    <div style="font-weight: 600;">Rodapé Acessível</div>
    <div>
      <a href="#" style="color: #fff; margin-right: 1rem; text-decoration: none;">Privacidade</a>
      <a href="#" style="color: #fff; text-decoration: none;">Termos</a>
    </div>
  </div>
</footer>`
  },
  {
    id: 16,
    tipo: "Footer",
    acessibilidade: "media",
    descricao: "Footer claro com links e coluna de contato",
    html: `
<footer style="background-color: #f8f9fa; color: #212529; padding: 3rem 0; border-top: 1px solid #dee2e6;"></footer>
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px;">
    <div style="display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px;">
      <div style="flex: 0 0 auto; width: 33.33333333%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <h5 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Empresa</h5>
        <ul style="padding-left: 0; list-style: none; color: #6c757d; margin-bottom: 0;">
          <li style="margin-bottom: 0.25rem;"><a href="#" style="color: #6c757d; text-decoration: none;">Sobre</a></li>
          <li style="margin-bottom: 0.25rem;"><a href="#" style="color: #6c757d; text-decoration: none;">Carreiras</a></li>
        </ul>
      </div>
      <div style="flex: 0 0 auto; width: 33.33333333%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <h5 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Produtos</h5>
        <ul style="padding-left: 0; list-style: none; color: #6c757d; margin-bottom: 0;">
          <li style="margin-bottom: 0.25rem;"><a href="#" style="color: #6c757d; text-decoration: none;">App</a></li>
          <li style="margin-bottom: 0.25rem;"><a href="#" style="color: #6c757d; text-decoration: none;">APIs</a></li>
        </ul>
      </div>
      <div style="flex: 0 0 auto; width: 33.33333333%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <h5 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Contato</h5>
        <p style="color: #6c757d; margin-bottom: 0.25rem; line-height: 1.5;">email@empresa.com</p>
        <p style="color: #6c757d; margin-bottom: 0; line-height: 1.5;">(11) 0000-0000</p>
      </div>
    </div>
  </div>
</footer>`
  },
  {
    id: 17,
    tipo: "Footer",
    acessibilidade: "baixa",
    descricao: "Footer minimalista com tipografia pequena",
    html: `
<footer style="background-color: #fff; color: #212529; border-top: 1px solid #dee2e6; padding: 1rem 0;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px; display: flex; justify-content: space-between;">
    <small style="font-size: 0.875em; color: #6c757d;">© 2025 Minimal Co.</small>
    <div>
      <a href="#" style="color: #6c757d; font-size: 0.875rem; margin-right: 1rem; text-decoration: none;">Privacidade</a>
      <a href="#" style="color: #6c757d; font-size: 0.875rem; text-decoration: none;">Termos</a>
    </div>
  </div>
</footer>`
  },
  {
    id: 18,
    tipo: "Footer",
    acessibilidade: "alta",
    descricao: "Footer escuro com newsletter e forte contraste",
    html: `
<footer style="background-color: #212529; color: #fff; padding: 3rem 0;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px;">
    <div style="display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; align-items: center;">
      <div style="flex: 0 0 auto; width: 50%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem;">
        <h4 style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 500; line-height: 1.2;">Assine nossa newsletter</h4>
        <form style="display: flex; gap: 0.5rem;">
          <input type="email" placeholder="Seu e-mail" style="display: block; width: 100%; padding: 0.5rem 1rem; font-size: 1.125rem; font-weight: 400; line-height: 1.5; color: #212529; background-color: #fff; border: 1px solid #ced4da; border-radius: 0.375rem;">
          <button type="button" style="display: inline-block; padding: 0.5rem 1rem; font-size: 1.125rem; font-weight: 400; line-height: 1.5; color: #fff; background-color: #0d6efd; border: 1px solid #0d6efd; border-radius: 0.375rem;">Assinar</button>
        </form>
      </div>
      <div style="flex: 0 0 auto; width: 50%; padding-right: 15px; padding-left: 15px; margin-bottom: 1rem; text-align: right;">
        <a href="#" style="color: #fff; margin-right: 1rem; text-decoration: none;">Política</a>
        <a href="#" style="color: #fff; text-decoration: none;">Contato</a>
      </div>
    </div>
  </div>
</footer>`
  },
  {
    id: 19,
    tipo: "Footer",
    acessibilidade: "media",
    descricao: "Footer com colunas e ícones sociais",
    html: `
<footer style="background-color: #f8f9fa; color: #212529; padding: 1.5rem 0; border-top: 1px solid #dee2e6;">
  <div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-left: auto; margin-right: auto; max-width: 1320px;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="color: #6c757d;">© Marca</div>
      <div style="display: flex; gap: 1rem;">
        <a href="#" style="color: #6c757d; text-decoration: none;">Twitter</a>
        <a href="#" style="color: #6c757d; text-decoration: none;">LinkedIn</a>
        <a href="#" style="color: #6c757d; text-decoration: none;">GitHub</a>
      </div>
    </div>
  </div>
</footer>`
  }
];

window.componentes = componentes;