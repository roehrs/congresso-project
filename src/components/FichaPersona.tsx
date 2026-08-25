import { nomeTipo } from '../lib/avaliacao';
import type { Persona } from '../types';

export function FichaPersona({ persona, compacta = false }: { persona: Persona; compacta?: boolean }) {
  return (
    <div className="pilha">
      <div className="persona-hero" style={compacta ? { padding: 0 } : undefined}>
        <div className="persona-hero__av" style={{ background: persona.cor }} aria-hidden="true">
          {persona.inicial}
        </div>
        <div className="crescer">
          <h2 className="persona-hero__nome">{persona.nome}</h2>
          <p className="persona-hero__meta">{persona.idade} anos • {persona.profissao}</p>
          <p className="persona-hero__meta">{persona.demografia}</p>
          <p className="persona-hero__brief">{persona.briefing}</p>
        </div>
      </div>

      <div className="pilha pilha--sm">
        <span className="rotulo">O que ela precisa</span>
        <p style={{ fontSize: '.9rem', color: 'var(--texto-corrido)' }}>{persona.precisa}</p>
      </div>

      <div className="pilha pilha--sm">
        <span className="rotulo">Blocos obrigatórios</span>
        <div className="chips" style={{ marginTop: 0 }}>
          {persona.secoesObrigatorias.length === 0
            ? <span className="chip">Nenhum fixo — foque em clareza e contraste</span>
            : persona.secoesObrigatorias.map((t) => <span className="chip chip--req" key={t}>{nomeTipo(t)}</span>)}
        </div>
      </div>

      <div className="pilha pilha--sm">
        <span className="rotulo">Gosta de</span>
        <div className="chips" style={{ marginTop: 0 }}>
          {persona.gostos.map((g) => <span className="chip" key={g}>{g}</span>)}
        </div>
      </div>

      {persona.tiposProibidos.length > 0 && (
        <div className="pilha pilha--sm">
          <span className="rotulo">Não pode ter</span>
          <div className="chips" style={{ marginTop: 0 }}>
            {persona.tiposProibidos.map((t) => <span className="chip chip--veto" key={t}>{nomeTipo(t)}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}
