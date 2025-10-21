// Componentes pré-definidos com diferentes níveis de acessibilidade
// Cada componente inclui um snippet HTML real para renderização no canvas

const componentes = [
  {
    id: 1,
    tipo: "Navbar",
    acessibilidade: "alta",
    descricao: "Navbar com letras grandes e alto contraste",
    html: `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark py-3">
  <div class="container">
    <a class="navbar-brand fs-4" href="#">Marca</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navAlta" aria-controls="navAlta" aria-expanded="false" aria-label="Alternar navegação">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navAlta">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link fs-6" href="#">Início</a></li>
        <li class="nav-item"><a class="nav-link fs-6" href="#">Sobre</a></li>
        <li class="nav-item"><a class="nav-link fs-6" href="#">Contato</a></li>
      </ul>
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
<nav class="navbar navbar-expand-lg navbar-light bg-light py-1 border-bottom">
  <div class="container">
    <a class="navbar-brand text-secondary small" href="#">Marca</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navBaixa" aria-controls="navBaixa" aria-expanded="false" aria-label="Alternar navegação">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navBaixa">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link small text-secondary" href="#">Home</a></li>
        <li class="nav-item"><a class="nav-link small text-secondary" href="#">Serviços</a></li>
        <li class="nav-item"><a class="nav-link small text-secondary" href="#">Contato</a></li>
      </ul>
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
<nav class="navbar navbar-expand-lg navbar-dark" style="background: rgba(0,0,0,0.5)">
  <div class="container">
    <a class="navbar-brand" href="#">Studio</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navTransp" aria-controls="navTransp" aria-expanded="false" aria-label="Alternar navegação">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navTransp">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#">Portfolio</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Equipe</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Contato</a></li>
      </ul>
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
<div class="bg-primary text-white py-1">
  <div class="container d-flex justify-content-between">
    <small>Telefone: (11) 0000-0000</small>
    <small>Acessibilidade: alto contraste</small>
  </div>
</div>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark py-2">
  <div class="container">
    <a class="navbar-brand" href="#">Empresa</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navInfo" aria-controls="navInfo" aria-expanded="false" aria-label="Alternar navegação">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navInfo">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#">Início</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Serviços</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Contato</a></li>
      </ul>
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
<nav class="navbar navbar-light bg-white border-bottom py-2">
  <div class="container">
    <a class="navbar-brand text-muted" href="#">Minimal</a>
    <div>
      <a class="text-muted small me-3 text-decoration-none" href="#">Home</a>
      <a class="text-muted small me-3 text-decoration-none" href="#">Work</a>
      <a class="text-muted small text-decoration-none" href="#">Contact</a>
    </div>
  </div>
</nav>`
  },
  {
    id: 3,
    tipo: "Section",
    acessibilidade: "alta",
    descricao: "Hero com texto grande e espaçamento generoso",
    html: `
<section class="py-5 bg-light border-bottom">
  <div class="container">
    <h1 class="display-5 fw-bold">Título grande acessível</h1>
    <p class="lead">Texto com bom espaçamento e contraste para leitura confortável.</p>
    <a class="btn btn-primary btn-lg" href="#">Chamada para ação</a>
  </div>
</section>`
  },
  {
    id: 4,
    tipo: "Section",
    acessibilidade: "media",
    descricao: "Hero moderno com boa hierarquia visual",
    html: `
<section class="py-5">
  <div class="container">
    <h2 class="h2">Hero moderno</h2>
    <p class="mb-3 text-muted">Descrição com hierarquia clara e visual atual.</p>
    <a class="btn btn-outline-primary" href="#">Saiba mais</a>
  </div>
</section>`
  },
  {
    id: 10,
    tipo: "Section",
    acessibilidade: "alta",
    descricao: "Seção com duas colunas e textos grandes",
    html: `
<section class="py-5 bg-white">
  <div class="container">
    <div class="row align-items-center g-4">
      <div class="col-md-6">
        <h2 class="h1">Clareza e Legibilidade</h2>
        <p class="lead">Textos maiores, contraste adequado e hierarquia simples.</p>
        <a class="btn btn-primary btn-lg" href="#">Ação</a>
      </div>
      <div class="col-md-6">
        <div class="ratio ratio-16x9 bg-light border rounded"></div>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 11,
    tipo: "Section",
    acessibilidade: "media",
    descricao: "Seção com cards informativos e hierarquia visual",
    html: `
<section class="py-5 bg-light">
  <div class="container">
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5>Benefício 1</h5>
            <p class="text-muted">Descrição clara e objetiva do benefício.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5>Benefício 2</h5>
            <p class="text-muted">Equilíbrio entre estética e funcionalidade.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5>Benefício 3</h5>
            <p class="text-muted">Boa hierarquia e espaçamento confortável.</p>
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
<section class="py-5" style="background: linear-gradient(90deg,#6610f2,#6f42c1)">
  <div class="container text-white">
    <h3 class="mb-3">Promoções</h3>
    <p class="small- text-white-50">Conteúdo rápido com foco em visual.</p>
    <a class="btn btn-light btn-sm" href="#">Ver mais</a>
  </div>
</section>`
  },
  {
    id: 5,
    tipo: "Card",
    acessibilidade: "baixa",
    descricao: "Card pequeno e com texto pequeno",
    html: `
<section class="py-4">
  <div class="container">
    <div class="row g-2">
      <div class="col-6 col-md-4">
        <div class="card">
          <div class="card-body p-2">
            <h5 class="card-title small text-muted mb-1">Card</h5>
            <p class="card-text small text-muted">Texto pequeno e baixo contraste.</p>
            <a href="#" class="btn btn-sm btn-light border">Abrir</a>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-4">
        <div class="card">
          <div class="card-body p-2">
            <h5 class="card-title small text-muted mb-1">Card</h5>
            <p class="card-text small text-muted">Conteúdo enxuto e compacto.</p>
            <a href="#" class="btn btn-sm btn-light border">Abrir</a>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-4">
        <div class="card">
          <div class="card-body p-2">
            <h5 class="card-title small text-muted mb-1">Card</h5>
            <p class="card-text small text-muted">Pouco espaçamento e tipografia menor.</p>
            <a href="#" class="btn btn-sm btn-light border">Abrir</a>
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
<section class="py-5">
  <div class="container">
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card h-100 border-2">
          <div class="card-body">
            <h4 class="card-title">Plano Básico</h4>
            <p class="card-text">Ideal para começar. Fácil leitura.</p>
            <a href="#" class="btn btn-primary">Escolher</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-2">
          <div class="card-body">
            <h4 class="card-title">Plano Pro</h4>
            <p class="card-text">Melhor custo-benefício.</p>
            <a href="#" class="btn btn-primary">Escolher</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-2">
          <div class="card-body">
            <h4 class="card-title">Plano Premium</h4>
            <p class="card-text">Recursos avançados.</p>
            <a href="#" class="btn btn-primary">Escolher</a>
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
<section class="py-5 bg-light">
  <div class="container">
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card h-100">
          <img class="card-img-top" src="https://picsum.photos/seed/a/600/300" alt="Imagem">
          <div class="card-body">
            <h5 class="card-title">Título</h5>
            <p class="card-text text-muted">Descrição moderada e legível.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <img class="card-img-top" src="https://picsum.photos/seed/b/600/300" alt="Imagem">
          <div class="card-body">
            <h5 class="card-title">Título</h5>
            <p class="card-text text-muted">Equilíbrio visual.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <img class="card-img-top" src="https://picsum.photos/seed/c/600/300" alt="Imagem">
          <div class="card-body">
            <h5 class="card-title">Título</h5>
            <p class="card-text text-muted">Boa hierarquia.</p>
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
<section class="py-3">
  <div class="container">
    <div class="row g-2 row-cols-2 row-cols-md-4">
      ${Array.from({length:8}).map((_,i)=>`
      <div class='col'>
        <div class='card h-100'>
          <div class='card-body p-2'>
            <div class='small text-muted mb-1'>Item ${i+1}</div>
            <a class='btn btn-sm btn-light border' href='#'>Ver</a>
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
<section class="py-4">
  <div class="container">
    <div class="list-group">
      <a href="#" class="list-group-item list-group-item-action py-3">
        <div class="d-flex w-100 align-items-center">
          <span class="badge rounded-pill text-bg-primary me-3">1</span>
          <div>
            <h5 class="mb-1">Atualização de Produto</h5>
            <small class="text-muted">Melhorias moderadas e legíveis</small>
          </div>
        </div>
      </a>
      <a href="#" class="list-group-item list-group-item-action py-3">
        <div class="d-flex w-100 align-items-center">
          <span class="badge rounded-pill text-bg-success me-3">2</span>
          <div>
            <h5 class="mb-1">Novidades</h5>
            <small class="text-muted">Conteúdo equilibrado</small>
          </div>
        </div>
      </a>
      <a href="#" class="list-group-item list-group-item-action py-3">
        <div class="d-flex w-100 align-items-center">
          <span class="badge rounded-pill text-bg-secondary me-3">3</span>
          <div>
            <h5 class="mb-1">Eventos</h5>
            <small class="text-muted">Informações organizadas</small>
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
<footer class="bg-dark text-white py-4 mt-4">
  <div class="container d-flex justify-content-between align-items-center">
    <div class="fw-semibold">Rodapé Acessível</div>
    <div>
      <a class="text-white me-3" href="#">Privacidade</a>
      <a class="text-white" href="#">Termos</a>
    </div>
  </div>
</footer>`
  }
  ,{
    id: 16,
    tipo: "Footer",
    acessibilidade: "media",
    descricao: "Footer claro com links e coluna de contato",
    html: `
<footer class="bg-light py-5 mt-4 border-top">
  <div class="container">
    <div class="row g-4">
      <div class="col-md-4">
        <h5>Empresa</h5>
        <ul class="list-unstyled text-muted">
          <li><a class="text-muted text-decoration-none" href="#">Sobre</a></li>
          <li><a class="text-muted text-decoration-none" href="#">Carreiras</a></li>
        </ul>
      </div>
      <div class="col-md-4">
        <h5>Produtos</h5>
        <ul class="list-unstyled text-muted">
          <li><a class="text-muted text-decoration-none" href="#">App</a></li>
          <li><a class="text-muted text-decoration-none" href="#">APIs</a></li>
        </ul>
      </div>
      <div class="col-md-4">
        <h5>Contato</h5>
        <p class="text-muted mb-1">email@empresa.com</p>
        <p class="text-muted">(11) 0000-0000</p>
      </div>
    </div>
  </div>
</footer>`
  }
  ,{
    id: 17,
    tipo: "Footer",
    acessibilidade: "baixa",
    descricao: "Footer minimalista com tipografia pequena",
    html: `
<footer class="bg-white border-top py-3">
  <div class="container d-flex justify-content-between">
    <small class="text-muted">© 2025 Minimal Co.</small>
    <div>
      <a class="text-muted small me-3 text-decoration-none" href="#">Privacidade</a>
      <a class="text-muted small text-decoration-none" href="#">Termos</a>
    </div>
  </div>
</footer>`
  }
  ,{
    id: 18,
    tipo: "Footer",
    acessibilidade: "alta",
    descricao: "Footer escuro com newsletter e forte contraste",
    html: `
<footer class="bg-dark text-white py-5 mt-4">
  <div class="container">
    <div class="row g-4 align-items-center">
      <div class="col-md-6">
        <h4>Assine nossa newsletter</h4>
        <form class="d-flex gap-2">
          <input class="form-control form-control-lg" type="email" placeholder="Seu e-mail">
          <button class="btn btn-primary btn-lg" type="button">Assinar</button>
        </form>
      </div>
      <div class="col-md-6 text-md-end">
        <a class="text-white me-3" href="#">Política</a>
        <a class="text-white" href="#">Contato</a>
      </div>
    </div>
  </div>
</footer>`
  }
  ,{
    id: 19,
    tipo: "Footer",
    acessibilidade: "media",
    descricao: "Footer com colunas e ícones sociais",
    html: `
<footer class="bg-light py-4 border-top">
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <div class="text-muted">© Marca</div>
      <div class="d-flex gap-3">
        <a href="#" class="text-muted text-decoration-none">Twitter</a>
        <a href="#" class="text-muted text-decoration-none">LinkedIn</a>
        <a href="#" class="text-muted text-decoration-none">GitHub</a>
      </div>
    </div>
  </div>
</footer>`
  }
];

window.componentes = componentes;

