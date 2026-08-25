import { useState } from 'react';
import { Modal } from '../components/Modal';
import { personas } from '../data/personas';
import type { Dificuldade } from '../types';

const OPCOES: { id: Dificuldade; nome: string; tentativas: string; desc: string }[] = [
  { id: 'facil', nome: 'Fácil', tentativas: '3 tentativas', desc: 'Para explorar com calma e entender os critérios.' },
  { id: 'medio', nome: 'Médio', tentativas: '2 tentativas', desc: 'O equilíbrio recomendado para quem visita o estande.' },
  { id: 'dificil', nome: 'Difícil', tentativas: '1 tentativa', desc: 'Desafio profissional: precisa acertar de primeira.' },
];

export function InicioTela({ aoComecar }: { aoComecar: (d: Dificuldade) => void }) {
  const [escolha, setEscolha] = useState<Dificuldade>('facil');
  const [verPersonas, setVerPersonas] = useState(false);

  return (
    <main className="tela">
      <div className="tela__wrap pilha">
        <div className="tela__topo">
          <span className="tela__kicker">Competições Senac RS</span>
          <h1>Monte o site da persona sorteada</h1>
          <p className="tela__sub">
            Você recebe uma pessoa com necessidades reais. Escolha os blocos certos, coloque na ordem
            certa e garanta que ela consiga usar a página.
          </p>
        </div>

        <div className="pilha pilha--sm">
          <span className="rotulo">Escolha o nível</span>
          <div className="dificuldades">
            {OPCOES.map((o) => (
              <button
                key={o.id}
                className="dif"
                aria-pressed={escolha === o.id}
                onClick={() => setEscolha(o.id)}
              >
                <span className="dif__linha">
                  <span className="dif__nome">{o.nome}</span>
                  <span className="dif__tag">{o.tentativas}</span>
                </span>
                <span className="dif__desc">{o.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="linha" style={{ justifyContent: 'center', marginTop: 4 }}>
          <button className="btn btn--primario btn--grande" onClick={() => aoComecar(escolha)}>
            Sortear minha persona
          </button>
          <button className="btn btn--fantasma" onClick={() => setVerPersonas(true)}>
            Ver as {personas.length} personas
          </button>
        </div>
      </div>

      <Modal
        titulo="Personas do simulador"
        aberto={verPersonas}
        aoFechar={() => setVerPersonas(false)}
        rodape={<button className="btn btn--azul" onClick={() => setVerPersonas(false)}>Fechar</button>}
      >
        <p style={{ fontSize: '.88rem', marginBottom: 14, color: 'var(--texto-suave)' }}>
          Uma delas vai ser sorteada para você.
        </p>
        <div className="pilha pilha--sm">
          {personas.map((p) => (
            <div key={p.id} className="linha" style={{ gap: 12, padding: '9px 0', borderBottom: '1px solid var(--linha)' }}>
              <span
                className="persona-chip__av"
                style={{ background: p.cor, width: 38, height: 38, borderRadius: 10, fontSize: '1rem' }}
                aria-hidden="true"
              >
                {p.inicial}
              </span>
              <span className="crescer">
                <strong style={{ fontSize: '.9rem', color: 'var(--texto)' }}>{p.primeiroNome}</strong>
                <span style={{ display: 'block', fontSize: '.78rem', color: 'var(--texto-suave)' }}>{p.profissao}</span>
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </main>
  );
}
