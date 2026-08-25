import { useState } from 'react';
import { MAX, NOTA_CORTE } from '../lib/avaliacao';
import type { CategoriaCriterio, Criterio, Persona, Resultado } from '../types';

const CATEGORIAS: { id: CategoriaCriterio; rotulo: string; max: number; cor: string }[] = [
  { id: 'estrutura', rotulo: 'Estrutura da página', max: MAX.estrutura, cor: '#004A8D' },
  { id: 'persona', rotulo: 'Briefing da persona', max: MAX.persona, cor: '#F77D0C' },
  { id: 'acessibilidade', rotulo: 'Acessibilidade', max: MAX.acessibilidade, cor: '#0A7A32' },
];

const ICONE = { success: '✓', warning: '!', error: '✕' } as const;

const COR_TIER: Record<Resultado['tier'], string> = {
  Excelente: '#8FE3AE',
  Bom: '#FDC180',
  Regular: '#FFD98A',
  Insuficiente: '#FFAFAF',
};

function CartaoCriterio({ c }: { c: Criterio }) {
  const [aberto, setAberto] = useState(c.status !== 'success');
  return (
    <button className={`crit crit--${c.status}`} onClick={() => setAberto((v) => !v)} aria-expanded={aberto}>
      <span className="crit__topo">
        <span className="crit__icone" aria-hidden="true">{ICONE[c.status]}</span>
        <span className="crit__titulo">{c.titulo}</span>
        <span className="crit__pts">{c.pontos}/{c.max}</span>
      </span>
      <span className="crit__msg" style={{ display: 'block' }}>{c.mensagem}</span>
      {aberto && <span className="crit__pq" style={{ display: 'block' }}><b>Por quê:</b> {c.porque}</span>}
    </button>
  );
}

interface Props {
  persona: Persona;
  resultado: Resultado;
  tentativas: number;
  aoAjustar: () => void;
  aoCertificado: () => void;
}

export function ResultadoTela({ persona, resultado, tentativas, aoAjustar, aoCertificado }: Props) {
  const valores: Record<CategoriaCriterio, number> = {
    estrutura: resultado.estrutura,
    persona: resultado.persona,
    acessibilidade: resultado.acessibilidade,
  };

  return (
    <main className="tela">
      <div className="tela__wrap pilha" style={{ maxWidth: 780 }}>
        <div className="nota">
          <div>
            <div className="nota__num">{resultado.total}<span className="nota__de"> / 100</span></div>
            <div className="nota__tier" style={{ color: COR_TIER[resultado.tier] }}>{resultado.tier}</div>
          </div>
          <div className="crescer">
            <p className="nota__resumo">{resultado.resumo}</p>
          </div>
        </div>

        <div className="card barras">
          {CATEGORIAS.map((cat) => (
            <div key={cat.id}>
              <div className="barra__topo">
                <span>{cat.rotulo}</span>
                <span>{valores[cat.id]} / {cat.max}</span>
              </div>
              <div className="barra__trilho">
                <div
                  className="barra__fill"
                  style={{ width: `${(valores[cat.id] / cat.max) * 100}%`, background: cat.cor }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="card caixa-cta">
          {resultado.aprovado ? (
            <>
              <span className="caixa-cta__aviso" style={{ color: 'var(--sucesso)' }}>
                ✓ Certificado liberado
              </span>
              <button className="btn btn--primario btn--grande" onClick={aoCertificado}>
                Emitir meu certificado
              </button>
              {tentativas > 0 && (
                <button className="btn btn--fantasma" onClick={aoAjustar}>
                  Tentar uma nota melhor ({tentativas} {tentativas === 1 ? 'tentativa' : 'tentativas'})
                </button>
              )}
            </>
          ) : (
            <>
              <span className="caixa-cta__aviso">
                ! Faltam {NOTA_CORTE - resultado.total} pontos para o certificado de conclusão
              </span>
              {tentativas > 0 ? (
                <button className="btn btn--primario btn--grande" onClick={aoAjustar}>
                  Ajustar a página ({tentativas} {tentativas === 1 ? 'tentativa restante' : 'tentativas restantes'})
                </button>
              ) : (
                <p style={{ fontSize: '.85rem', color: 'var(--texto-suave)' }}>
                  As tentativas acabaram, mas o certificado de participação é seu.
                </p>
              )}
              <button className="btn btn--linha" onClick={aoCertificado}>
                Pegar certificado de participação
              </button>
            </>
          )}
        </div>

        <div>
          <div className="grupo-titulo">
            <span className="rotulo">O que foi avaliado</span>
          </div>
          {CATEGORIAS.map((cat) => {
            const itens = resultado.criterios.filter((c) => c.categoria === cat.id);
            if (itens.length === 0) return null;
            return (
              <div key={cat.id} style={{ marginBottom: 14 }}>
                <div className="grupo-titulo">
                  <strong style={{ fontSize: '.82rem', color: cat.cor }}>{cat.rotulo}</strong>
                </div>
                <div className="criterios">
                  {itens.map((c) => <CartaoCriterio key={c.id} c={c} />)}
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: '.8rem', color: 'var(--texto-suave)' }}>
          Avaliação feita para a persona {persona.nome}.
        </p>
      </div>
    </main>
  );
}
