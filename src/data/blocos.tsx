import type { Bloco, Grupo } from '../types';

const links = ['Início', 'Sobre', 'Serviços', 'Contato'];

export const grupos: { id: Grupo; rotulo: string; dica: string }[] = [
  { id: 'topo', rotulo: '1. Topo', dica: 'A barra de navegação abre a página.' },
  { id: 'destaque', rotulo: '2. Destaque', dica: 'A primeira coisa que a pessoa lê.' },
  { id: 'conteudo', rotulo: '3. Conteúdo', dica: 'O miolo da página: seções, cards e imagens.' },
  { id: 'contato', rotulo: '4. Contato', dica: 'Onde a pessoa fala com você.' },
  { id: 'rodape', rotulo: '5. Rodapé', dica: 'Fecha a página com links e informações.' },
];

export const blocos: Bloco[] = [
  /* ---------------- TOPO ---------------- */
  {
    id: 'nav-alta',
    tipo: 'Navbar',
    grupo: 'topo',
    nome: 'Menu com alto contraste',
    descricao: 'Letras grandes, links bem separados e botão de acessibilidade.',
    a11y: 'alta',
    render: (
      <div className="blk blk--alta blk-bar">
        <div className="blk-bar__row">
          <span className="blk-bar__marca">Marca</span>
          <ul className="blk-bar__links">
            {links.map((l, i) => <li key={l} data-ativo={i === 0 ? '1' : '0'}>{l}</li>)}
          </ul>
          <span className="blk-a11y-btn">Aa Acessibilidade</span>
        </div>
      </div>
    ),
  },
  {
    id: 'nav-alta-aviso',
    tipo: 'Navbar',
    grupo: 'topo',
    nome: 'Menu com barra de avisos',
    descricao: 'Uma faixa de aviso acima e o menu principal em contraste forte.',
    a11y: 'alta',
    render: (
      <div className="blk blk--alta" style={{ padding: 0 }}>
        <div className="blk-bar blk-bar--topo">Atendimento 0800 000 0000 • Seg a Sex, 8h às 18h</div>
        <div className="blk-bar">
          <div className="blk-bar__row">
            <span className="blk-bar__marca">Marca</span>
            <ul className="blk-bar__links">
              {links.map((l, i) => <li key={l} data-ativo={i === 0 ? '1' : '0'}>{l}</li>)}
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'nav-media',
    tipo: 'Navbar',
    grupo: 'topo',
    nome: 'Menu institucional',
    descricao: 'Menu padrão de site de empresa, com busca ao lado.',
    a11y: 'media',
    render: (
      <div className="blk blk--media blk-bar">
        <div className="blk-bar__row">
          <span className="blk-bar__marca">Marca</span>
          <ul className="blk-bar__links">
            {links.map((l, i) => <li key={l} data-ativo={i === 0 ? '1' : '0'}>{l}</li>)}
          </ul>
          <span className="blk-a11y-btn">Buscar</span>
        </div>
      </div>
    ),
  },
  {
    id: 'nav-baixa-transp',
    tipo: 'Navbar',
    grupo: 'topo',
    nome: 'Menu transparente sobre foto',
    descricao: 'Bonito, mas o texto some no fundo claro da imagem.',
    a11y: 'baixa',
    antipadrao: true,
    render: (
      <div className="blk blk--baixa blk-bar blk-bar--transp">
        <div className="blk-bar__row">
          <span className="blk-bar__marca">marca</span>
          <ul className="blk-bar__links">
            {links.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'nav-baixa-mini',
    tipo: 'Navbar',
    grupo: 'topo',
    nome: 'Menu minimalista',
    descricao: 'Links pequenos e discretos, difíceis de achar e de tocar.',
    a11y: 'baixa',
    antipadrao: true,
    render: (
      <div className="blk blk--baixa blk-bar" style={{ background: 'var(--blk-bg)' }}>
        <div className="blk-bar__row">
          <span className="blk-bar__marca" style={{ color: 'var(--blk-muted)' }}>marca</span>
          <ul className="blk-bar__links">
            {links.map((l) => <li key={l} style={{ color: 'var(--blk-muted)', fontWeight: 400 }}>{l.toLowerCase()}</li>)}
          </ul>
        </div>
      </div>
    ),
  },

  /* ---------------- DESTAQUE ---------------- */
  {
    id: 'hero-alta',
    tipo: 'Hero',
    grupo: 'destaque',
    nome: 'Destaque com texto grande',
    descricao: 'Título largo, respiro generoso e um botão que não tem como errar.',
    a11y: 'alta',
    render: (
      <div className="blk blk--alta blk-hero">
        <h2>Tudo o que você precisa, em um lugar só</h2>
        <p>Atendimento claro, informação direta e caminhos curtos para resolver o que você veio fazer aqui.</p>
        <span className="blk-cta">Começar agora</span>
      </div>
    ),
  },
  {
    id: 'hero-media',
    tipo: 'Hero',
    grupo: 'destaque',
    nome: 'Destaque com imagem ao lado',
    descricao: 'Texto de um lado, imagem do outro, com botão principal e secundário.',
    a11y: 'media',
    render: (
      <div className="blk blk--media blk-hero blk-hero--dividido">
        <div>
          <h2>Soluções sob medida para o seu negócio</h2>
          <p>Conheça os serviços, compare os planos e fale com um especialista sem sair da página.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span className="blk-cta">Ver planos</span>
            <span className="blk-cta blk-cta--vazado">Falar com a equipe</span>
          </div>
        </div>
        <div className="blk-figura">Imagem com descrição</div>
      </div>
    ),
  },
  {
    id: 'hero-baixa',
    tipo: 'Hero',
    grupo: 'destaque',
    nome: 'Destaque minimalista',
    descricao: 'Só uma frase fina e centralizada. Elegante, mas quase invisível.',
    a11y: 'baixa',
    render: (
      <div className="blk blk--baixa blk-hero blk-hero--centro">
        <h2 style={{ fontWeight: 300, letterSpacing: '.06em' }}>portfolio</h2>
        <p>trabalhos selecionados · 2024—2026</p>
      </div>
    ),
  },

  /* ---------------- CONTEÚDO ---------------- */
  {
    id: 'sec-alta',
    tipo: 'Section',
    grupo: 'conteudo',
    nome: 'Seção de leitura fácil',
    descricao: 'Duas colunas de texto com tamanho confortável e bastante espaço.',
    a11y: 'alta',
    render: (
      <div className="blk blk--alta">
        <h2>Como funciona</h2>
        <div className="blk-duas" style={{ marginTop: 18 }}>
          <div>
            <h3>Passo 1 — Escolha</h3>
            <p>Você seleciona o serviço que precisa em uma lista curta e explicada.</p>
          </div>
          <div>
            <h3>Passo 2 — Confirme</h3>
            <p>Revisa os dados em uma tela só e confirma. Sem formulário longo.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'sec-media',
    tipo: 'Section',
    grupo: 'conteudo',
    nome: 'Seção com números',
    descricao: 'Texto institucional acompanhado de métricas em destaque.',
    a11y: 'media',
    render: (
      <div className="blk blk--media">
        <h2>Quem somos</h2>
        <p>Há mais de 30 anos formando pessoas e apoiando empresas com educação profissional de qualidade.</p>
        <div className="blk-metricas">
          <div className="blk-metrica"><strong>+30</strong><span>anos de atuação</span></div>
          <div className="blk-metrica"><strong>120</strong><span>cursos ativos</span></div>
          <div className="blk-metrica"><strong>98%</strong><span>de satisfação</span></div>
        </div>
      </div>
    ),
  },
  {
    id: 'sec-baixa',
    tipo: 'Section',
    grupo: 'conteudo',
    nome: 'Seção de texto denso',
    descricao: 'Muito texto, letra miúda e quase nenhum espaço entre as linhas.',
    a11y: 'baixa',
    antipadrao: true,
    render: (
      <div className="blk blk--baixa">
        <h3>Informações gerais</h3>
        <p style={{ lineHeight: 1.25 }}>
          A presente seção reúne, de forma consolidada, as informações institucionais, os termos de uso,
          as condições gerais de contratação, a política de privacidade, os canais de atendimento e demais
          esclarecimentos pertinentes ao relacionamento entre as partes, ficando desde já estabelecido que o
          acesso ao conteúdo implica ciência integral do disposto neste documento e nos anexos correlatos.
        </p>
      </div>
    ),
  },
  {
    id: 'card-alta',
    tipo: 'Card',
    grupo: 'conteudo',
    nome: 'Cards grandes com botão',
    descricao: 'Três cards espaçosos, com ícone, texto legível e ação clara.',
    a11y: 'alta',
    render: (
      <div className="blk blk--alta">
        <h2>Nossos serviços</h2>
        <div className="blk-grade blk-grade--3">
          {[
            ['Consultoria', 'Diagnóstico completo de acessibilidade e hierarquia.'],
            ['Capacitação', 'Formação prática para equipes de design e TI.'],
            ['Auditoria', 'Revisão do site à luz das diretrizes WCAG 2.1.'],
          ].map(([t, d]) => (
            <div className="blk-card" key={t}>
              <div className="blk-card__icone">◆</div>
              <h3>{t}</h3>
              <p>{d}</p>
              <span className="blk-cta blk-cta--vazado">Saiba mais</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'card-media-noticias',
    tipo: 'Card',
    grupo: 'conteudo',
    nome: 'Cards de notícias',
    descricao: 'Categoria, data, título e resumo. Padrão de portal institucional.',
    a11y: 'media',
    render: (
      <div className="blk blk--media">
        <h2>Últimas notícias</h2>
        <div className="blk-grade blk-grade--3">
          {[
            ['Acessibilidade', 'Nova diretriz de acessibilidade digital é publicada'],
            ['Sustentabilidade', 'Relatório de inclusão social sai nesta semana'],
            ['Inovação', 'Laboratórios de UX são inaugurados na unidade central'],
          ].map(([tag, t]) => (
            <div className="blk-card" key={t}>
              <span className="blk-card__tag">{tag}</span>
              <h3 style={{ marginTop: 6 }}>{t}</h3>
              <p>Resumo curto da notícia em duas linhas, com link para o comunicado completo.</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'card-media-lista',
    tipo: 'Card',
    grupo: 'conteudo',
    nome: 'Lista de cards horizontais',
    descricao: 'Ícone à esquerda, texto à direita. Bom para listas de benefícios.',
    a11y: 'media',
    render: (
      <div className="blk blk--media">
        <h2>Por que escolher a gente</h2>
        <div className="blk-grade blk-grade--2">
          {[
            ['✓', 'Atendimento humano', 'Uma pessoa de verdade responde em até 1 dia útil.'],
            ['◷', 'Prazo combinado', 'Data de entrega definida antes de começar.'],
            ['◈', 'Sem letra miúda', 'Escopo e valor escritos em linguagem simples.'],
            ['♺', 'Suporte contínuo', 'Acompanhamento por 90 dias após a entrega.'],
          ].map(([ic, t, d]) => (
            <div className="blk-card blk-card--linha" key={t}>
              <div className="blk-card__icone">{ic}</div>
              <div><h3>{t}</h3><p>{d}</p></div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'card-baixa-mosaico',
    tipo: 'Card',
    grupo: 'conteudo',
    nome: 'Mosaico denso de cards',
    descricao: 'Oito cards colados, sem respiro. Bonito de longe, cansativo de perto.',
    a11y: 'baixa',
    antipadrao: true,
    render: (
      <div className="blk blk--baixa">
        <h3>Categorias</h3>
        <div className="blk-grade blk-grade--4" style={{ gap: 6 }}>
          {['Design', 'Código', 'Dados', 'Marca', 'Vídeo', 'Áudio', 'Print', 'Web'].map((t) => (
            <div className="blk-card" key={t} style={{ padding: 8 }}>
              <h3 style={{ fontSize: '.72rem' }}>{t}</h3>
              <p style={{ fontSize: '.62rem' }}>12 projetos</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'gal-alta',
    tipo: 'Gallery',
    grupo: 'conteudo',
    nome: 'Galeria com legendas',
    descricao: 'Cada imagem tem legenda descrevendo o que aparece nela.',
    a11y: 'alta',
    render: (
      <div className="blk blk--alta">
        <h2>Galeria de projetos</h2>
        <div className="blk-galeria blk-galeria--3" style={{ marginTop: 16 }}>
          {['Oficina de UX com alunos', 'Apresentação para a banca', 'Montagem do estande'].map((t, i) => (
            <div className="blk-foto" key={t} style={{ background: `var(--blk-soft)`, borderColor: 'var(--blk-line)', opacity: 1 - i * 0.06 }}>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'gal-baixa',
    tipo: 'Gallery',
    grupo: 'conteudo',
    nome: 'Galeria sem identificação',
    descricao: 'Grade de fotos desbotadas, sem legenda e sem descrição alternativa.',
    a11y: 'baixa',
    antipadrao: true,
    render: (
      <div className="blk blk--baixa">
        <div className="blk-galeria blk-galeria--4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div className="blk-foto blk-foto--sem-legenda" key={i} style={{ background: 'var(--blk-soft)', opacity: 0.75 }}>
              <span>-</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'carrossel-baixa',
    tipo: 'Carousel',
    grupo: 'conteudo',
    nome: 'Carrossel que gira sozinho',
    descricao: 'Banners trocando sem parar e sem botão de pausa. Distrai e tira o foco.',
    a11y: 'baixa',
    antipadrao: true,
    render: (
      <div className="blk blk--media">
        <div className="blk-carrossel">
          <div className="blk-carrossel__slide">Promoção relâmpago — só hoje!</div>
          <div className="blk-carrossel__pontos"><i /><i /><i /><i /></div>
        </div>
      </div>
    ),
  },

  /* ---------------- CONTATO ---------------- */
  {
    id: 'contato-alta',
    tipo: 'Contact',
    grupo: 'contato',
    nome: 'Formulário acessível',
    descricao: 'Rótulo acima de cada campo, obrigatório marcado e botão grande.',
    a11y: 'alta',
    render: (
      <div className="blk blk--alta">
        <h2>Fale com a gente</h2>
        <p>Responda em até um dia útil. Os campos com <em style={{ color: 'var(--blk-accent)', fontStyle: 'normal' }}>*</em> são obrigatórios.</p>
        <div className="blk-form">
          <div className="blk-campo"><label>Nome completo <em>*</em></label><div className="blk-input blk-input--alto">Seu nome</div></div>
          <div className="blk-campo"><label>E-mail <em>*</em></label><div className="blk-input blk-input--alto">voce@email.com</div></div>
          <div className="blk-campo"><label>Mensagem</label><div className="blk-input blk-input--alto">Como podemos ajudar?</div></div>
          <span className="blk-cta">Enviar mensagem</span>
        </div>
      </div>
    ),
  },
  {
    id: 'contato-media',
    tipo: 'Contact',
    grupo: 'contato',
    nome: 'Contato com horário e canais',
    descricao: 'Formulário curto ao lado de telefone, e-mail e horário de atendimento.',
    a11y: 'media',
    render: (
      <div className="blk blk--media">
        <h2>Contato</h2>
        <div className="blk-duas" style={{ marginTop: 14 }}>
          <div className="blk-form" style={{ marginTop: 0 }}>
            <div className="blk-campo"><label>Nome</label><div className="blk-input">Seu nome</div></div>
            <div className="blk-campo"><label>E-mail</label><div className="blk-input">voce@email.com</div></div>
            <span className="blk-cta">Enviar</span>
          </div>
          <div>
            <h3>Outros canais</h3>
            <p>(51) 3000-0000<br />contato@exemplo.com.br<br />Seg a Sex, 8h às 18h</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'contato-baixa',
    tipo: 'Contact',
    grupo: 'contato',
    nome: 'Formulário sem rótulos',
    descricao: 'O texto some assim que a pessoa digita e as bordas quase não aparecem.',
    a11y: 'baixa',
    antipadrao: true,
    render: (
      <div className="blk blk--baixa">
        <h3>contato</h3>
        <div className="blk-form">
          <div className="blk-input blk-input--fantasma">nome</div>
          <div className="blk-input blk-input--fantasma">email</div>
          <div className="blk-input blk-input--fantasma">mensagem</div>
          <span className="blk-cta" style={{ background: 'transparent', color: 'var(--blk-muted)', border: '1px solid var(--blk-line)' }}>enviar</span>
        </div>
      </div>
    ),
  },

  /* ---------------- RODAPÉ ---------------- */
  {
    id: 'foot-alta',
    tipo: 'Footer',
    grupo: 'rodape',
    nome: 'Rodapé com declaração de acessibilidade',
    descricao: 'Contraste forte, links grandes e um mapa rápido do site.',
    a11y: 'alta',
    render: (
      <div className="blk blk--alta blk-bar">
        <div className="blk-foot__cols" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div><h3>Navegação</h3><ul><li>Início</li><li>Serviços</li><li>Contato</li></ul></div>
          <div><h3>Acessibilidade</h3><ul><li>Declaração de acessibilidade</li><li>Navegação por teclado</li><li>Alto contraste</li></ul></div>
          <div><h3>Atendimento</h3><ul><li>0800 000 0000</li><li>contato@exemplo.com.br</li></ul></div>
        </div>
        <div className="blk-foot__base"><span>© 2026 Marca. Todos os direitos reservados.</span><span>Política de privacidade</span></div>
      </div>
    ),
  },
  {
    id: 'foot-alta-news',
    tipo: 'Footer',
    grupo: 'rodape',
    nome: 'Rodapé com newsletter',
    descricao: 'Rodapé escuro com campo de assinatura e contraste alto.',
    a11y: 'alta',
    render: (
      <div className="blk blk--alta blk-bar">
        <div className="blk-bar__row" style={{ alignItems: 'flex-end' }}>
          <div>
            <h3 style={{ color: 'var(--blk-bar-fg)' }}>Receba as novidades</h3>
            <p style={{ color: 'var(--blk-bar-muted)' }}>Um e-mail por mês, sem propaganda.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="blk-input blk-input--alto" style={{ minWidth: 200, background: '#ffffff1a', borderColor: 'var(--blk-bar-fg)', color: 'var(--blk-bar-fg)' }}>seu@email.com</div>
            <span className="blk-cta" style={{ marginTop: 0 }}>Assinar</span>
          </div>
        </div>
        <div className="blk-foot__base"><span>© 2026 Marca</span><span>Acessibilidade • Privacidade</span></div>
      </div>
    ),
  },
  {
    id: 'foot-media',
    tipo: 'Footer',
    grupo: 'rodape',
    nome: 'Rodapé em quatro colunas',
    descricao: 'Links organizados por assunto e ícones de redes sociais.',
    a11y: 'media',
    render: (
      <div className="blk blk--media blk-bar">
        <div className="blk-foot__cols">
          <div><h3>Institucional</h3><ul><li>Sobre</li><li>Trabalhe conosco</li></ul></div>
          <div><h3>Serviços</h3><ul><li>Consultoria</li><li>Capacitação</li></ul></div>
          <div><h3>Ajuda</h3><ul><li>Dúvidas frequentes</li><li>Suporte</li></ul></div>
          <div><h3>Redes</h3><div className="blk-foot__redes"><i>in</i><i>ig</i><i>yt</i></div></div>
        </div>
        <div className="blk-foot__base"><span>© 2026 Marca</span><span>Política de privacidade</span></div>
      </div>
    ),
  },
  {
    id: 'foot-baixa-mini',
    tipo: 'Footer',
    grupo: 'rodape',
    nome: 'Rodapé minimalista',
    descricao: 'Uma linha só, com letra miúda e nenhuma informação útil.',
    a11y: 'baixa',
    antipadrao: true,
    render: (
      <div className="blk blk--baixa" style={{ textAlign: 'center', borderTop: '1px solid var(--blk-line)' }}>
        <p style={{ fontSize: '.62rem' }}>© 2026 marca · todos os direitos reservados</p>
      </div>
    ),
  },
  {
    id: 'foot-baixa-cinza',
    tipo: 'Footer',
    grupo: 'rodape',
    nome: 'Rodapé cinza sobre cinza',
    descricao: 'Texto cinza claro em fundo cinza. Os links não parecem links.',
    a11y: 'baixa',
    antipadrao: true,
    render: (
      <div className="blk blk--baixa" style={{ background: 'var(--blk-soft)' }}>
        <div className="blk-foot__cols" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div><h3 style={{ color: 'var(--blk-muted)' }}>institucional</h3><ul><li style={{ color: 'var(--blk-muted)' }}>sobre</li><li style={{ color: 'var(--blk-muted)' }}>termos</li></ul></div>
          <div><h3 style={{ color: 'var(--blk-muted)' }}>ajuda</h3><ul><li style={{ color: 'var(--blk-muted)' }}>faq</li><li style={{ color: 'var(--blk-muted)' }}>contato</li></ul></div>
          <div><h3 style={{ color: 'var(--blk-muted)' }}>legal</h3><ul><li style={{ color: 'var(--blk-muted)' }}>privacidade</li></ul></div>
        </div>
      </div>
    ),
  },
];

export const blocoPorId = new Map(blocos.map((b) => [b.id, b]));
