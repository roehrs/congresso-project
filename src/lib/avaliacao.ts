import type { Bloco, Criterio, Persona, Resultado, Tema, TipoBloco } from '../types';

const NOTA_CORTE = 75;

const rotuloTipo: Record<TipoBloco, string> = {
  Navbar: 'Menu de navegação',
  Hero: 'Destaque de abertura',
  Section: 'Seção de conteúdo',
  Card: 'Cards',
  Gallery: 'Galeria',
  Contact: 'Contato',
  Carousel: 'Carrossel',
  Footer: 'Rodapé',
};

export const nomeTipo = (t: TipoBloco) => rotuloTipo[t];
const lista = (t: TipoBloco[]) => t.map(nomeTipo).join(', ');

const pesoA11y: Record<Bloco['a11y'], number> = { alta: 10, media: 6.5, baixa: 2.5 };

export function avaliar(itens: Bloco[], persona: Persona, tema: Tema): Resultado {
  const criterios: Criterio[] = [];

  if (itens.length === 0) {
    return {
      total: 0,
      aprovado: false,
      tier: 'Insuficiente',
      estrutura: 0,
      persona: 0,
      acessibilidade: 0,
      resumo: 'A página está vazia. Adicione blocos para montar o site da persona.',
      criterios: [{
        id: 'vazio',
        titulo: 'Página vazia',
        status: 'error',
        pontos: 0,
        max: 100,
        mensagem: 'Nenhum bloco foi adicionado.',
        porque: 'Um site precisa, no mínimo, de um topo, um miolo de conteúdo e um rodapé.',
        categoria: 'estrutura',
      }],
    };
  }

  const tipos = itens.map((b) => b.tipo);
  const primeiro = tipos[0];
  const ultimo = tipos[tipos.length - 1];

  /* ---------- ESTRUTURA (30) ---------- */
  let estrutura = 0;

  const navbars = tipos.filter((t) => t === 'Navbar').length;
  if (primeiro === 'Navbar' && navbars === 1) {
    estrutura += 10;
    criterios.push({
      id: 'nav-topo', titulo: 'Menu no topo da página', status: 'success', pontos: 10, max: 10,
      mensagem: 'O menu de navegação abre a página, como deve ser.',
      porque: 'A navegação no topo é a primeira coisa que a pessoa procura. Ela diz onde você está e para onde dá para ir.',
      categoria: 'estrutura',
    });
  } else if (navbars === 0) {
    criterios.push({
      id: 'nav-falta', titulo: 'Falta o menu de navegação', status: 'error', pontos: 0, max: 10,
      mensagem: 'A página não tem barra de navegação.',
      porque: 'Sem menu, a pessoa entra no site e não tem para onde ir. É o item mais básico de orientação.',
      categoria: 'estrutura',
    });
  } else if (navbars > 1) {
    estrutura += 3;
    criterios.push({
      id: 'nav-duplo', titulo: 'Mais de um menu na página', status: 'warning', pontos: 3, max: 10,
      mensagem: `Você colocou ${navbars} menus de navegação.`,
      porque: 'Dois menus competem entre si e a pessoa não sabe qual é o principal. Um só, no topo, resolve.',
      categoria: 'estrutura',
    });
  } else {
    estrutura += 2;
    criterios.push({
      id: 'nav-fora', titulo: 'Menu fora do topo', status: 'error', pontos: 2, max: 10,
      mensagem: 'O menu existe, mas não é o primeiro bloco da página.',
      porque: 'Quem usa leitor de tela percorre a página na ordem em que ela foi montada. Menu no meio significa conteúdo antes da orientação.',
      categoria: 'estrutura',
    });
  }

  const footers = tipos.filter((t) => t === 'Footer').length;
  if (ultimo === 'Footer' && footers === 1) {
    estrutura += 10;
    criterios.push({
      id: 'foot-fim', titulo: 'Rodapé fechando a página', status: 'success', pontos: 10, max: 10,
      mensagem: 'O rodapé está na última posição.',
      porque: 'O rodapé encerra a leitura com contato, links institucionais e direitos autorais. Nada vem depois dele.',
      categoria: 'estrutura',
    });
  } else if (footers === 0) {
    criterios.push({
      id: 'foot-falta', titulo: 'Falta o rodapé', status: 'warning', pontos: 2, max: 10,
      mensagem: 'A página termina sem rodapé.',
      porque: 'É no rodapé que a pessoa procura telefone, endereço e política de privacidade quando não achou em outro lugar.',
      categoria: 'estrutura',
    });
  } else {
    estrutura += 2;
    criterios.push({
      id: 'foot-fora', titulo: 'Rodapé no lugar errado', status: 'error', pontos: 2, max: 10,
      mensagem: 'Há blocos depois do rodapé, ou mais de um rodapé na página.',
      porque: 'O rodapé é o fim da página. Conteúdo depois dele passa despercebido.',
      categoria: 'estrutura',
    });
  }

  const miolo = tipos.filter((t) => t !== 'Navbar' && t !== 'Footer');
  if (miolo.length >= 2) {
    estrutura += 10;
    criterios.push({
      id: 'miolo-ok', titulo: 'Miolo com conteúdo', status: 'success', pontos: 10, max: 10,
      mensagem: `Você montou ${miolo.length} blocos de conteúdo entre o menu e o rodapé.`,
      porque: 'É o miolo que entrega o valor da página. Menu e rodapé só dão o contorno.',
      categoria: 'estrutura',
    });
  } else if (miolo.length === 1) {
    estrutura += 5;
    criterios.push({
      id: 'miolo-raso', titulo: 'Pouco conteúdo no miolo', status: 'warning', pontos: 5, max: 10,
      mensagem: 'Só um bloco de conteúdo entre o menu e o rodapé.',
      porque: 'Uma página com um bloco só não conta uma história. Acrescente destaque, seção, cards ou galeria.',
      categoria: 'estrutura',
    });
  } else {
    criterios.push({
      id: 'miolo-vazio', titulo: 'Página sem conteúdo', status: 'error', pontos: 0, max: 10,
      mensagem: 'Só há menu e rodapé, sem nada no meio.',
      porque: 'A pessoa chegou no site para ler alguma coisa. Sem miolo, ela sai na hora.',
      categoria: 'estrutura',
    });
  }

  /* ---------- PERSONA (35) ---------- */
  let pontosPersona = 0;
  const nome = persona.primeiroNome;

  const obrig = persona.secoesObrigatorias;
  if (obrig.length > 0) {
    const faltam = obrig.filter((t) => !tipos.includes(t));
    if (faltam.length === 0) {
      pontosPersona += 15;
      criterios.push({
        id: 'obrig-ok', titulo: `O que ${nome} pediu está lá`, status: 'success', pontos: 15, max: 15,
        mensagem: `Todos os blocos obrigatórios foram incluídos: ${lista(obrig)}.`,
        porque: `O briefing de ${nome} exigia esses blocos. Entregar o que foi pedido é o mínimo de um projeto.`,
        categoria: 'persona',
      });
    } else {
      const pts = Math.round(15 * ((obrig.length - faltam.length) / obrig.length));
      pontosPersona += pts;
      criterios.push({
        id: 'obrig-falta', titulo: `Faltou o que ${nome} pediu`, status: 'error', pontos: pts, max: 15,
        mensagem: `Não entrou na página: ${lista(faltam)}.`,
        porque: `${nome} escreveu no briefing que precisava desses blocos para resolver o problema dela. Sem eles a página não serve.`,
        categoria: 'persona',
      });
    }
  } else {
    pontosPersona += 15;
    criterios.push({
      id: 'obrig-livre', titulo: 'Estrutura livre', status: 'success', pontos: 15, max: 15,
      mensagem: `${nome} não exige nenhum bloco específico.`,
      porque: 'Quando não há exigência de estrutura, o que pesa é a clareza e o contraste do que você escolheu.',
      categoria: 'persona',
    });
  }

  const pref = persona.tiposPreferidos;
  const usados = pref.filter((t) => tipos.includes(t));
  if (pref.length > 0 && usados.length === pref.length) {
    pontosPersona += 10;
    criterios.push({
      id: 'pref-todos', titulo: 'Blocos favoritos da persona', status: 'success', pontos: 10, max: 10,
      mensagem: `Você usou tudo que ${nome} gosta: ${lista(pref)}.`,
      porque: `Esses formatos combinam com o jeito que ${nome} lê e navega. Ela se sente em casa na página.`,
      categoria: 'persona',
    });
  } else if (usados.length > 0) {
    const pts = Math.round(10 * (usados.length / pref.length));
    pontosPersona += pts;
    criterios.push({
      id: 'pref-parte', titulo: 'Só parte dos blocos favoritos', status: 'warning', pontos: pts, max: 10,
      mensagem: `Você usou ${lista(usados)}, de ${lista(pref)}.`,
      porque: `Incluir o resto deixaria a página mais próxima do que ${nome} espera encontrar.`,
      categoria: 'persona',
    });
  } else if (pref.length > 0) {
    criterios.push({
      id: 'pref-nenhum', titulo: 'Nenhum bloco favorito', status: 'warning', pontos: 0, max: 10,
      mensagem: `Nada do que ${nome} prefere (${lista(pref)}) entrou na página.`,
      porque: 'Abra a ficha da persona antes de montar. Os gostos dela estão escritos lá.',
      categoria: 'persona',
    });
  }

  const proibidosUsados = persona.tiposProibidos.filter((t) => tipos.includes(t));
  if (proibidosUsados.length === 0) {
    pontosPersona += 10;
    criterios.push({
      id: 'veto-ok', titulo: 'Nenhum bloco vetado', status: 'success', pontos: 10, max: 10,
      mensagem: 'A página não tem nada que atrapalhe esta persona.',
      porque: persona.tiposProibidos.length > 0
        ? `Você evitou ${lista(persona.tiposProibidos)}, que prejudica a leitura de ${nome}.`
        : 'O layout respeita as boas práticas sem sobrecarregar a experiência.',
      categoria: 'persona',
    });
  } else {
    criterios.push({
      id: 'veto-quebrado', titulo: `Bloco vetado por ${nome}`, status: 'error', pontos: 0, max: 10,
      mensagem: `Você incluiu ${lista(proibidosUsados)}, que é contraindicado para esta persona.`,
      porque: 'Elemento que se move sozinho rouba o foco, atrapalha quem lê devagar e pode causar mal-estar em quem tem sensibilidade visual.',
      categoria: 'persona',
    });
  }

  /* ---------- ACESSIBILIDADE (35) ---------- */
  let acessibilidade = 0;

  const media = itens.reduce((s, b) => s + pesoA11y[b.a11y], 0) / itens.length;
  const baixos = itens.filter((b) => b.a11y === 'baixa').length;
  const mult = persona.preferenciaA11y === 'alta' ? 1.35 : persona.preferenciaA11y === 'media' ? 1 : 0.85;

  let ptsComp = Math.min(20, Math.round((media / 10) * 20 * mult));
  if (baixos > 0 && persona.preferenciaA11y === 'alta') ptsComp = Math.max(0, ptsComp - baixos * 5);
  acessibilidade += ptsComp;

  if (baixos === 0 && media >= 8.5) {
    criterios.push({
      id: 'a11y-alta', titulo: 'Blocos legíveis do começo ao fim', status: 'success', pontos: ptsComp, max: 20,
      mensagem: 'Todos os blocos escolhidos têm bom contraste e texto confortável.',
      porque: 'Texto grande, rótulo claro e área de toque folgada é o que as diretrizes WCAG 2.1 pedem na prática.',
      categoria: 'acessibilidade',
    });
  } else if (baixos > 0) {
    criterios.push({
      id: 'a11y-baixa',
      titulo: `${baixos} bloco${baixos > 1 ? 's' : ''} de leitura difícil`,
      status: persona.preferenciaA11y === 'alta' ? 'error' : 'warning',
      pontos: ptsComp, max: 20,
      mensagem: `Você usou ${baixos} bloco${baixos > 1 ? 's' : ''} com contraste baixo ou letra miúda.`,
      porque: persona.preferenciaA11y === 'alta'
        ? `Para ${nome}, que enxerga pouco, esses blocos deixam a navegação frustrante e às vezes impossível.`
        : 'Mesmo em página de visual leve, prefira a versão do bloco com contraste melhor. O visual não precisa disso para ficar bonito.',
      categoria: 'acessibilidade',
    });
  } else {
    criterios.push({
      id: 'a11y-media', titulo: 'Acessibilidade equilibrada', status: 'success', pontos: ptsComp, max: 20,
      mensagem: 'Os blocos atendem ao mínimo esperado de legibilidade.',
      porque: 'Dá para subir a nota trocando blocos de nível médio pelos de acessibilidade alta.',
      categoria: 'acessibilidade',
    });
  }

  const idealTema: Record<Bloco['a11y'], Tema> = { alta: 'alto', media: 'padrao', baixa: 'baixo' };
  const ideal = idealTema[persona.preferenciaA11y];

  if (tema === ideal) {
    acessibilidade += 15;
    criterios.push({
      id: 'tema-ok', titulo: 'Tema certo para a persona', status: 'success', pontos: 15, max: 15,
      mensagem: tema === 'alto'
        ? `O tema de alto contraste é exatamente o que ${nome} precisa.`
        : tema === 'padrao'
          ? 'O tema padrão dá boa leitura institucional sem pesar no visual.'
          : `O tema suave combina com a proposta visual de ${nome}.`,
      porque: 'Contraste não é gosto pessoal. É o que decide se a pessoa consegue ou não ler a página.',
      categoria: 'acessibilidade',
    });
  } else if (persona.preferenciaA11y === 'alta' && tema === 'baixo') {
    criterios.push({
      id: 'tema-ruim', titulo: 'Tema de baixo contraste', status: 'error', pontos: 0, max: 15,
      mensagem: `O tema suave apaga o texto para ${nome}.`,
      porque: 'Cinza sobre branco reprova em qualquer teste de contraste. Para quem tem baixa visão, a página simplesmente some.',
      categoria: 'acessibilidade',
    });
  } else if (persona.preferenciaA11y === 'baixa' && tema === 'alto') {
    acessibilidade += 10;
    criterios.push({
      id: 'tema-pesado', titulo: 'Tema mais pesado que o necessário', status: 'warning', pontos: 10, max: 15,
      mensagem: `O alto contraste funciona, mas endurece o visual que ${nome} procura.`,
      porque: 'Acessível nunca é errado. Só que aqui o tema padrão daria o mesmo conforto sem brigar com a proposta.',
      categoria: 'acessibilidade',
    });
  } else {
    acessibilidade += 8;
    criterios.push({
      id: 'tema-medio', titulo: 'Tema aceitável, mas não o ideal', status: 'warning', pontos: 8, max: 15,
      mensagem: `Para ${nome}, o tema ${ideal === 'alto' ? 'de alto contraste' : ideal === 'padrao' ? 'padrão' : 'suave'} seria a melhor escolha.`,
      porque: 'O tema atua sobre a página inteira. Acertar ele levanta a leitura de todos os blocos de uma vez.',
      categoria: 'acessibilidade',
    });
  }

  /* ---------- FECHAMENTO ---------- */
  const total = Math.min(100, Math.max(0, estrutura + pontosPersona + acessibilidade));

  let tier: Resultado['tier'] = 'Insuficiente';
  let resumo = `A página tem problemas de base na estrutura ou na leitura para ${nome}. Veja os pontos vermelhos e tente de novo.`;
  if (total >= 85) {
    tier = 'Excelente';
    resumo = `Layout de alto nível: atende ${nome} com folga, respeita a hierarquia e a acessibilidade.`;
  } else if (total >= 70) {
    tier = 'Bom';
    resumo = `O layout entrega o essencial para ${nome}. Faltam ajustes finos de hierarquia e escolha de bloco.`;
  } else if (total >= 50) {
    tier = 'Regular';
    resumo = `Tem coisa boa aqui, mas algumas escolhas de estrutura ou contraste atrapalham a experiência de ${nome}.`;
  }

  return {
    total,
    aprovado: total >= NOTA_CORTE,
    tier,
    estrutura,
    persona: pontosPersona,
    acessibilidade,
    criterios,
    resumo,
  };
}

export const MAX = { estrutura: 30, persona: 35, acessibilidade: 35 } as const;
export { NOTA_CORTE };

export interface Checagem { rotulo: string; ok: boolean }

export function checarRapido(itens: Bloco[], persona: Persona): Checagem[] {
  const tipos = itens.map((b) => b.tipo);
  const obrig = persona.secoesObrigatorias;
  const feitas = obrig.filter((t) => tipos.includes(t)).length;
  return [
    { rotulo: 'Menu no topo', ok: tipos[0] === 'Navbar' },
    { rotulo: 'Conteúdo no meio', ok: tipos.filter((t) => t !== 'Navbar' && t !== 'Footer').length >= 2 },
    { rotulo: 'Rodapé no fim', ok: tipos[tipos.length - 1] === 'Footer' },
    {
      rotulo: obrig.length ? `Pedidos ${feitas}/${obrig.length}` : 'Sem exigência',
      ok: feitas === obrig.length,
    },
  ];
}
