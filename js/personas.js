// Personas estendidas com imagens placeholder
window.personas = [
  {
    id: 1,
    nome: 'Mariana',
    nomeCompleto: 'Mariana Silva Oliveira',
    foto: '/assets/mariana.jpg',
    idade: 38,
    profissao: 'Comunicação Corporativa',
    briefing: 'Foco em comunicação institucional, leitura clara e seções de destaque com call-to-action.',
    preferencia: 'media',
    gostos: ['Leitura', 'Conteúdo claro', 'CTAs visíveis'],
    demografia: 'Cidade: São Paulo • Escolaridade: Pós-graduação',
    contact: 'mariana@example.com',
    requiredSections: ['Hero', 'Contact'],
    preferredTypes: ['Navbar', 'Section', 'Card'],
    forbiddenTypes: ['Carousel'],
    weightings: { access: 0.35, required: 0.40, preferred: 0.25 }
  },
  {
    id: 2,
    nome: 'Lucas',
    nomeCompleto: 'Lucas Pereira Martins',
    foto: '/assets/lucas.jpg',
    idade: 24,
    profissao: 'Designer / Portfólio',
    briefing: 'Alta ênfase em elementos visuais (sections grandes, galleries) e designs limpos.',
    preferencia: 'baixa',
    gostos: ['Imagens grandes', 'Galerias', 'Minimalismo'],
    demografia: 'Cidade: Belo Horizonte • Freelancer',
    contact: 'lucas@example.com',
    requiredSections: ['Gallery'],
    preferredTypes: ['Section', 'Card'],
    forbiddenTypes: ['Footer'],
    weightings: { access: 0.30, required: 0.50, preferred: 0.20 }
  },
  {
    id: 3,
    nome: 'Ana',
    nomeCompleto: 'Ana Costa Ramos',
    foto: '/assets/ana.jpg',
    idade: 67,
    profissao: 'Aposentada / Usuária com necessidades de acessibilidade',
    briefing: 'Usuária com alta necessidade de acessibilidade; prioriza componentes com alto contraste e leitores assistivos.',
    preferencia: 'alta',
    gostos: ['Textos grandes', 'Alto contraste', 'Navegação simples'],
    demografia: 'Cidade: Salvador • Idade: 67 anos',
    contact: 'ana@example.com',
    requiredSections: [],
    preferredTypes: ['Navbar', 'Section'],
    forbiddenTypes: [],
    weightings: { access: 0.70, required: 0.10, preferred: 0.20 }
  }
];