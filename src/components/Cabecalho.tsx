import logo from '../assets/logo_senac_white.png';
import type { Persona } from '../types';

interface Props {
  persona?: Persona | null;
  tentativas?: number;
  totalTentativas?: number;
  aoAbrirPersona?: () => void;
  aoReiniciar?: () => void;
}

export function Cabecalho({ persona, tentativas, totalTentativas, aoAbrirPersona, aoReiniciar }: Props) {
  return (
    <header className="hdr nao-imprime">
      <img className="hdr__logo" src={logo} alt="Senac" />
      <span className="hdr__sep" aria-hidden="true" />
      <span className="hdr__title">Monte o Site</span>
      <span className="hdr__spacer" />

      {typeof tentativas === 'number' && typeof totalTentativas === 'number' && (
        <span className="tentativas" title={`${tentativas} de ${totalTentativas} tentativas restantes`}>
          {Array.from({ length: totalTentativas }, (_, i) => (
            <span key={i} className={`tentativas__dot${i < tentativas ? '' : ' tentativas__dot--off'}`} />
          ))}
          <span className="so-leitor">{tentativas} de {totalTentativas} tentativas restantes</span>
        </span>
      )}

      {persona && aoAbrirPersona && (
        <button className="persona-chip" onClick={aoAbrirPersona}>
          <span className="persona-chip__av" style={{ background: persona.cor }}>{persona.inicial}</span>
          <span style={{ textAlign: 'left' }}>
            <span className="persona-chip__nome">{persona.primeiroNome}</span><br />
            <span className="persona-chip__hint">ver a ficha</span>
          </span>
        </button>
      )}

      {aoReiniciar && (
        <button className="btn btn--claro" style={{ minHeight: 38, padding: '0 14px', fontSize: '.82rem' }} onClick={aoReiniciar}>
          Recomeçar
        </button>
      )}
    </header>
  );
}
