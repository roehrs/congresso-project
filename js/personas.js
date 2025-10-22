// Dados das personas do simulador
// Estes dados são carregados nas telas para sorteio e exibição

// const personas = [
//   {
//     id: 1,
//     nome: "Dona Maria (Idosa)",
//     briefing: "70 anos, visão reduzida, prefere letras grandes, alto contraste e navegação simples.",
//     preferencia: "alta"
//   },
//   {
//     id: 2,
//     nome: "Lucas (Adolescente Gamer)",
//     briefing: "Jovem, gosta de cores vibrantes, animações e navegação dinâmica.",
//     preferencia: "baixa"
//   },
//   {
//     id: 3,
//     nome: "Carla (Profissional de Marketing)",
//     briefing: "Busca clareza, estética moderna e boa hierarquia visual.",
//     preferencia: "media"
//   }
// ];

// // Export informal para uso em outras tags script (sem módulos)
// window.personas = personas;

// novo arquivo com personas estendidas
window.personas = [
  {
    id: 1,
    nome: 'Mariana - Conteúdo Corporativo',
    briefing: 'Foco em comunicação institucional, leitura clara e seções de destaque com call-to-action.',
    preferencia: 'media', // usado historicamente para acessibilidade
    requiredSections: ['Hero', 'Contact'], // precisa destas seções presentes no layout
    preferredTypes: ['Navbar', 'Section', 'Card'],
    forbiddenTypes: ['Carousel'], // evita certos componentes
    weightings: { access: 0.35, required: 0.40, preferred: 0.25 }
  },
  {
    id: 2,
    nome: 'Lucas - Portfólio Visual',
    briefing: 'Alta ênfase em elementos visuais (sections grandes, galleries) e designs limpos.',
    preferencia: 'baixa',
    requiredSections: ['Gallery'],
    preferredTypes: ['Section', 'Card'],
    forbiddenTypes: ['Footer'], // por exemplo, prefere CTA no final sem footer pesado
    weightings: { access: 0.30, required: 0.50, preferred: 0.20 }
  },
  {
    id: 3,
    nome: 'Ana - Acessibilidade',
    briefing: 'Usuária com alta necessidade de acessibilidade; prioriza componentes com alto contraste e leitores assistivos.',
    preferencia: 'alta',
    requiredSections: [],
    preferredTypes: ['Navbar', 'Section'],
    forbiddenTypes: [],
    weightings: { access: 0.70, required: 0.10, preferred: 0.20 }
  }
];