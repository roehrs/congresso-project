import { FichaPersona } from '../components/FichaPersona';
import type { Dificuldade, Persona } from '../types';

interface Props {
  persona: Persona;
  dificuldade: Dificuldade;
  aoSortearOutra: () => void;
  aoAvancar: () => void;
}

export function PersonaTela({ persona, dificuldade, aoSortearOutra, aoAvancar }: Props) {
  return (
    <main className="tela">
      <div className="tela__wrap pilha">
        <div className="tela__topo">
          <span className="tela__kicker">Sua persona</span>
          <h1>Esta é {persona.primeiroNome}</h1>
          <p className="tela__sub">Leia o que ela precisa antes de começar a montar.</p>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <FichaPersona persona={persona} />
        </div>

        <div className="linha" style={{ justifyContent: 'center' }}>
          <button className="btn btn--primario btn--grande" onClick={aoAvancar}>
            Montar o site de {persona.primeiroNome}
          </button>
          {dificuldade === 'facil' && (
            <button className="btn btn--fantasma" onClick={aoSortearOutra}>
              Sortear outra persona
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
