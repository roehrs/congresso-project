import { useEffect, useRef, useState } from 'react';
import type { ItemCanvas } from '../App';
import { blocoPorId, blocos as catalogo, grupos } from '../data/blocos';
import { checarRapido } from '../lib/avaliacao';
import type { Bloco, Grupo, Persona, Tema } from '../types';

const rotuloA11y: Record<Bloco['a11y'], string> = { alta: 'A11y alta', media: 'A11y média', baixa: 'A11y baixa' };

const TEMAS: { id: Tema; rotulo: string }[] = [
  { id: 'alto', rotulo: 'Alto contraste' },
  { id: 'padrao', rotulo: 'Padrão' },
  { id: 'baixo', rotulo: 'Suave' },
];

interface Props {
  persona: Persona;
  itens: ItemCanvas[];
  blocos: Bloco[];
  tema: Tema;
  aoTrocarTema: (t: Tema) => void;
  aoAdicionar: (blocoId: string) => void;
  aoRemover: (uid: string) => void;
  aoMover: (uid: string, dir: -1 | 1) => void;
  aoLimpar: () => void;
  aoAvaliar: () => void;
}

export function EditorTela({
  persona, itens, blocos, tema, aoTrocarTema,
  aoAdicionar, aoRemover, aoMover, aoLimpar, aoAvaliar,
}: Props) {
  const [grupo, setGrupo] = useState<Grupo>('topo');
  const [gaveta, setGaveta] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const qtd = itens.length;

  useEffect(() => {
    const el = areaRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [qtd]);
  const daVez = grupos.find((g) => g.id === grupo)!;
  const doGrupo = catalogo.filter((b) => b.grupo === grupo);
  const checagens = checarRapido(blocos, persona);

  return (
    <div className="editor nao-imprime">
      <aside className={`biblio${gaveta ? ' biblio--aberta' : ''}`} aria-label="Biblioteca de blocos">
        <div className="biblio__puxador">
          <strong>Blocos</strong>
          <button className="fechar" onClick={() => setGaveta(false)} aria-label="Fechar biblioteca">✕</button>
        </div>

        <div className="biblio__abas" role="tablist" aria-label="Partes da página">
          {grupos.map((g) => (
            <button
              key={g.id}
              className="aba"
              role="tab"
              aria-selected={grupo === g.id}
              onClick={() => setGrupo(g.id)}
            >
              {g.rotulo}
            </button>
          ))}
        </div>

        <div className="biblio__lista pane">
          <p style={{ fontSize: '.78rem', color: 'var(--texto-suave)', padding: '0 2px 2px' }}>{daVez.dica}</p>
          {doGrupo.map((b) => (
            <button key={b.id} className="item" onClick={() => aoAdicionar(b.id)}>
              <span className="item__corpo">
                <span className="item__nome">{b.nome}</span>
                <span className="item__desc">{b.descricao}</span>
                <span className={`selo selo--${b.a11y}`} style={{ display: 'inline-block', marginTop: 6 }}>
                  {rotuloA11y[b.a11y]}
                </span>
              </span>
              <span className="item__mais" aria-hidden="true">+</span>
              <span className="so-leitor">Adicionar {b.nome}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className={`palco${gaveta ? ' palco--recuado' : ''}`}>
        <div className="palco__topo">
          <span className="palco__titulo">Página de {persona.primeiroNome}</span>
          <span className="crescer" />
          <div className="temas" role="group" aria-label="Tema de contraste">
            {TEMAS.map((t) => (
              <button key={t.id} className="tema" aria-pressed={tema === t.id} onClick={() => aoTrocarTema(t.id)}>
                {t.rotulo}
              </button>
            ))}
          </div>
          {itens.length > 0 && (
            <button className="mini mini--perigo" onClick={aoLimpar} title="Limpar a página" aria-label="Limpar a página">
              ⌫
            </button>
          )}
        </div>

        <div className="palco__area pane" ref={areaRef}>
          <div className="moldura">
            {itens.length === 0 ? (
              <div className="vazio">
                <span className="vazio__icone" aria-hidden="true">▭</span>
                <span className="vazio__titulo">A página está vazia</span>
                <span className="vazio__dica">
                  Comece pelo topo: escolha um menu de navegação na lista e toque para adicionar.
                </span>
                <button className="btn btn--linha gaveta-btn" onClick={() => setGaveta(true)}>Abrir os blocos</button>
              </div>
            ) : (
              <div className={`tela-site tema-${tema}`}>
                {itens.map((item, i) => {
                  const b = blocoPorId.get(item.blocoId);
                  if (!b) return null;
                  return (
                    <div className="bloco" key={item.uid}>
                      <span className="bloco__rotulo">{b.nome}</span>
                      <span className="bloco__ferramentas">
                        <button className="mini" disabled={i === 0} onClick={() => aoMover(item.uid, -1)} aria-label="Mover para cima">↑</button>
                        <button className="mini" disabled={i === itens.length - 1} onClick={() => aoMover(item.uid, 1)} aria-label="Mover para baixo">↓</button>
                        <button className="mini mini--perigo" onClick={() => aoRemover(item.uid)} aria-label="Remover bloco">✕</button>
                      </span>
                      {b.render}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="rodape-acao">
          <button className="btn btn--linha gaveta-btn" style={{ minHeight: 42 }} onClick={() => setGaveta(true)}>
            + Blocos
          </button>

          <div className="checagem">
            {checagens.map((c) => (
              <span key={c.rotulo} className={`checagem__item${c.ok ? ' checagem__item--ok' : ''}`}>
                {c.ok ? '✓' : '○'} {c.rotulo}
              </span>
            ))}
          </div>

          <button className="btn btn--primario" style={{ minHeight: 46 }} onClick={aoAvaliar} disabled={itens.length === 0}>
            Avaliar minha página
          </button>
        </div>
      </section>
    </div>
  );
}
