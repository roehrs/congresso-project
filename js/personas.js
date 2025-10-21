// Dados das personas do simulador
// Estes dados são carregados nas telas para sorteio e exibição

const personas = [
  {
    id: 1,
    nome: "Dona Maria (Idosa)",
    briefing: "70 anos, visão reduzida, prefere letras grandes, alto contraste e navegação simples.",
    preferencia: "alta"
  },
  {
    id: 2,
    nome: "Lucas (Adolescente Gamer)",
    briefing: "Jovem, gosta de cores vibrantes, animações e navegação dinâmica.",
    preferencia: "baixa"
  },
  {
    id: 3,
    nome: "Carla (Profissional de Marketing)",
    briefing: "Busca clareza, estética moderna e boa hierarquia visual.",
    preferencia: "media"
  }
];

// Export informal para uso em outras tags script (sem módulos)
window.personas = personas;

