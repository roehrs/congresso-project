# Simulador Monte o Site — Senac RS

Jogo de estande: o participante recebe uma **persona sorteada**, monta a página dela
escolhendo blocos prontos, e recebe uma avaliação explicada de estrutura, briefing e
acessibilidade. Batendo 75 pontos, sai com certificado.

Feito para rodar em **tablet de 7"**, tablet de 10" e desktop.

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (estático, pode subir em qualquer lugar)
npm run preview  # confere o build
```

## Como está organizado

```
src/
  data/personas.ts    6 personas com briefing, exigências e vetos
  data/blocos.tsx     catálogo de 26 blocos (React), agrupados por parte da página
  lib/avaliacao.ts    motor de nota: rubrica somada de 100 pontos
  lib/certificado.ts  certificado em PNG desenhado no canvas
  screens/            início → persona → editor → resultado → certificado
  styles/tokens.css   cores e medidas da marca Senac RS
  styles/blocks.css   visual dos blocos do site montado
design-guide/         de onde os tokens vieram (extraído de senacrs.com.br)
```

## Como a nota é calculada

Soma de rubricas, teto 100. Nunca desconta abaixo de zero por categoria.

| Categoria | Pontos | O que pesa |
|---|---|---|
| Estrutura | 30 | menu no topo (10), rodapé no fim (10), miolo com conteúdo (10) |
| Briefing da persona | 35 | blocos obrigatórios (15), blocos preferidos (10), nenhum bloco vetado (10) |
| Acessibilidade | 35 | nível dos blocos escolhidos (20), tema de contraste (15) |

Corte do certificado de conclusão: **75**. Abaixo disso sai certificado de participação.

Cada critério devolve `{titulo, status, pontos, max, mensagem, porque}` — o `porque`
é a parte didática, e é o que aparece quando o participante toca no critério.

## Tentativas

Fácil 3 · Médio 2 · Difícil 1. A tentativa é consumida ao tocar em "Avaliar minha página".

## Blocos

Cada bloco tem um nível de acessibilidade intrínseco (`alta`, `media`, `baixa`) que
define tipografia e densidade. A cor e o contraste vêm do **tema global** escolhido no
editor (alto / padrão / suave), via variáveis CSS em `.tela-site`. Bloco novo entra em
`src/data/blocos.tsx` — é só acrescentar ao array com `grupo`, `tipo` e `a11y`.

## Versão anterior

A v1 (HTML + Bootstrap + JS vanilla, avaliação por desconto, certificado por EmailJS)
está no branch `main`.
