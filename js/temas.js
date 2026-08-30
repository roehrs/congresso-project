// Temas de contraste inteligentes por tipo de componente.
// Fonte única usada pelo editor (main.js) e pela tela de resultado (avaliacao.js),
// para que o preview do editor e a avaliação final sempre usem as mesmas cores.
window.TEMAS = {
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
