# Design Guide — Senac RS

Extraído do site institucional `https://www.senacrs.com.br/home` (Angular + PrimeNG,
tema `lara-light-indigo` customizado). Fonte dos tokens: bloco `:root` do bundle
`styles-ZT3XRCRH.css` e amostragem de pixel do logo oficial.
Data da extração: 24/08/2026.

## 1. Cores

### Núcleo da marca

| Token | Hex | Onde vive |
|---|---|---|
| Azul Senac | `#004A8D` | Cor do logotipo. Texto de navegação, dropdown, sidenav, ícones da topbar, borda superior do rodapé, separadores (`--default-color`) |
| Azul rodapé | `#003A7B` | Fundo do rodapé inteiro e da faixa de copyright (`--default-color-footer`) |
| Laranja Senac | `#F29100` | Cor do arco do logotipo |
| Laranja de ação | `#F77D0C` | Botão primário, links de destaque, foco (`--default-color-primary`) |
| Laranja hover | `#DF7310` | Estado hover do botão primário |

Repare que existem **dois laranjas**: o do logo (`#F29100`, mais amarelado) e o de
interface (`#F77D0C`, mais queimado). Não misturar. Logo usa o dele, botão usa o dele.

### Neutros

| Token | Hex | Uso |
|---|---|---|
| Fundo da página | `#FAFAFA` | `--background-color` |
| Texto principal | `#242424` | `--default-color-primary-text` |
| Texto corrido | `#585858` | Cor real aplicada no `body` |
| Texto secundário / hover | `#484848` | `--default-color-hover` |
| Borda / divisor | `#BFC4CC` |  |
| Cinza claro | `#E5E5E5`, `#ECECEC` | Linhas, fundos de card |
| Branco | `#FFFFFF` | Cards, topbar |

### Paleta secundária (institucional Senac)

Vive no `:root` como reserva para categorias de curso, tags e ilustração. Usar
uma cor por peça, sempre com o azul ou o neutro ancorando.

`#F91567` rosa · `#FC4629` vermelho · `#F29100` laranja · `#F6BE00` amarelo ·
`#A3CB00` verde-limão · `#D8F912` limão claro · `#34EFDB` turquesa ·
`#009BA9` teal · `#06777F` teal escuro · `#4839B3` roxo · `#4F7AFB` azul vivo ·
`#4EB0FA` azul claro · `#0130A4` azul-marinho · `#181C49` marinho profundo ·
`#7784AC` azul acinzentado · `#C89633` dourado

### Semânticas

Sucesso `#008A00` · Erro `#BF0119` / `#E60000` · WhatsApp `#25D366`

## 2. Tipografia

Duas famílias, ambas do Google Fonts:

- **Open Sans** — texto corrido e interface (fonte declarada no `body`)
- **Roboto** — herança do tema PrimeNG, aparece em componentes

```
body { font: 300 18px/28px "Open Sans", sans-serif; color: #585858; }
```

Escala de títulos do site (peso 600, herda a família e a cor do contexto):

| Nível | Tamanho |
|---|---|
| h1 | 4rem (2rem no override do tema) |
| h2 | 2rem |
| h3 | 1.75rem |
| h4 | 1.5rem |
| h5 | 1.25rem |
| h6 | 1rem |

Tamanhos de corpo tokenizados: 14, 16, 18, 23 e 47px.
Altura de linha: 24 / 32 / 48px. Letter-spacing: 0.

Pesos em uso: 300 (corpo), 400 (normal), 600 (títulos e destaque), 700 (bold).

## 3. Forma

**Raio de borda** — o site trabalha em três degraus:

- `8px` — botões, inputs, chips
- `16px` (≈1rem) — cards e blocos de conteúdo
- `50%` — avatares e botões circulares de carrossel

**Sombra** — elevação suave, quase sem cor:

```css
/* card em repouso */
box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
/* card elevado / hover */
box-shadow: 0 4px 10px #00000008, 0 0 2px #0000000f, 0 2px 6px #0000001f;
/* modal */
box-shadow: 0 9px 46px 8px #0000001f, 0 24px 38px 3px #00000024, 0 11px 15px #0003;
```

**Foco** — o padrão mais repetido do site inteiro (53 ocorrências), sempre em
cinza translúcido, nunca no laranja:

```css
box-shadow: 0 0 0 .2rem #48484850;
```

**Divisores estruturais** — o rodapé e as seções são separados por uma linha
grossa azul, não por cinza fino:

```css
border-top: 4px solid #004A8D;
```

## 4. Logotipo

| Arquivo | Uso |
|---|---|
| `assets/logo_senac.png` | Versão colorida (azul + arco laranja), para fundo claro. 482×119 |
| `assets/logo_senac_white.png` | Versão monocromática branca, para fundo azul/escuro. 250×78 |
| `assets/favicon.png` | Marca isolada, 386×261 |

A assinatura completa vem com o lockup institucional à direita: Fecomércio, IFEP,
Sesc, Sindicatos Empresariais. Em peça pequena ou digital, usar só o Senac.

Nunca recolorir o logo, nunca aplicar a versão colorida sobre fundo azul, nunca
esticar sem manter proporção.

## 5. Aplicando no congresso-project

Ordem de decisão pra qualquer tela nova:

1. Fundo `#FAFAFA`, card branco com raio 16px e a sombra de repouso
2. Título em Open Sans 600; texto em Open Sans 300/18px cor `#585858`
3. Estrutura, navegação e cabeçalho em `#004A8D`; rodapé em `#003A7B`
4. Um único CTA laranja `#F77D0C` por tela — o laranja é a ação, não a decoração
5. Estados (acerto, erro, progresso) usam as semânticas, não a paleta secundária
6. Precisou de cor pra categorizar (trilha, dificuldade, persona)? Aí sim a
   paleta secundária, uma cor por categoria

Os tokens estão prontos em `tokens.css` — é só importar e usar as variáveis.
