# Simulador Monte o Site — Senac RS

Projeto arquivado em setembro de 2026 junto com a frente das Competições Senac.
Não sugerir tarefas, prazos ou próximos passos. Consultar ou alterar somente
quando o Diogo pedir explicitamente algo deste histórico.

Jogo de estande das Competições Senac RS. O visitante recebe uma persona sorteada,
monta a página dela com blocos prontos e recebe nota explicada + certificado.

## Stack e invariantes

- **React 19 + Vite + TypeScript**, sem framework de UI e sem Tailwind. CSS escrito à
  mão em `src/styles/`, tokens da marca em `tokens.css`.
- **Zero backend.** Tudo roda no navegador; o certificado é desenhado num `<canvas>` e
  baixado como PNG. Não introduzir servidor, banco ou envio de e-mail.
- **Nenhuma dependência de runtime além de react/react-dom.** Antes de instalar
  qualquer coisa, checar se dá pra resolver com o que já tem.
- Build estático em `dist/`, sobe em qualquer hospedagem.

## Alvo de tela

Tem que funcionar **perfeitamente em tablet de 7"** (1024×600 paisagem e 800×1280
retrato), em tablet de 10" e em desktop. Regras:

- O shell (`.app`) tem altura fixa de `100dvh` e **nunca** rola. Só os painéis com
  `.pane` rolam por dentro.
- Abaixo de 860px de largura a biblioteca de blocos vira bottom sheet.
- Alvo de toque mínimo de 46px (`--toque`).
- Escala tipográfica muda por altura de viewport, não por largura (tablet de 7" é
  largo e baixo).

## Princípio de conteúdo

O público é leigo. **Pouca coisa na tela de cada vez.** A explicação existe, mas
aparece sob demanda: ficha da persona em modal, "por quê" do critério só ao tocar.
Antes de acrescentar informação numa tela, ver se ela não cabe melhor atrás de um
toque.

## Onde mexer

| Quero mudar | Arquivo |
|---|---|
| persona (briefing, exigências, vetos) | `src/data/personas.ts` |
| bloco de site novo ou existente | `src/data/blocos.tsx` + `src/styles/blocks.css` |
| regra de pontuação, texto de feedback | `src/lib/avaliacao.ts` |
| layout do certificado (tela e PNG) | `src/screens/CertificadoTela.tsx` + `src/lib/certificado.ts` |
| cor, medida, sombra | `src/styles/tokens.css` |

O certificado existe em dois lugares (HTML na tela e canvas no PNG). Mudou um,
**mudar o outro** — senão o que a pessoa vê e o que ela baixa divergem.

## Cores

Só as da marca Senac RS, documentadas em `design-guide/DESIGN-GUIDE.md`. Atenção aos
dois pares: azul `#004A8D` (navegação, estrutura) vs `#003A7B` (rodapé), e laranja
`#F29100` (logo) vs `#F77D0C` (botão de ação). Não misturar os papéis.

Um CTA laranja por tela. Paleta secundária só para categorizar, nunca para decorar.
