import { useCallback, useMemo, useState } from 'react';
import './styles/app.css';

import { Cabecalho } from './components/Cabecalho';
import { FichaPersona } from './components/FichaPersona';
import { Modal } from './components/Modal';
import { blocoPorId } from './data/blocos';
import { sortearPersona } from './data/personas';
import { avaliar } from './lib/avaliacao';
import { InicioTela } from './screens/InicioTela';
import { PersonaTela } from './screens/PersonaTela';
import { EditorTela } from './screens/EditorTela';
import { ResultadoTela } from './screens/ResultadoTela';
import { CertificadoTela } from './screens/CertificadoTela';
import type { Dificuldade, Etapa, Persona, Resultado, Tema } from './types';

export interface ItemCanvas { uid: string; blocoId: string }

const TENTATIVAS: Record<Dificuldade, number> = { facil: 3, medio: 2, dificil: 1 };

let seq = 0;
const novoUid = () => `i${++seq}`;

export default function App() {
  const [etapa, setEtapa] = useState<Etapa>('inicio');
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil');
  const [persona, setPersona] = useState<Persona | null>(null);
  const [itens, setItens] = useState<ItemCanvas[]>([]);
  const [tema, setTema] = useState<Tema>('padrao');
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [tentativas, setTentativas] = useState(3);
  const [fichaAberta, setFichaAberta] = useState(false);
  const [confirmarReinicio, setConfirmarReinicio] = useState(false);

  const blocos = useMemo(
    () => itens.map((i) => blocoPorId.get(i.blocoId)!).filter(Boolean),
    [itens],
  );

  const comecar = useCallback((d: Dificuldade) => {
    setDificuldade(d);
    setTentativas(TENTATIVAS[d]);
    setPersona(sortearPersona());
    setItens([]);
    setTema('padrao');
    setResultado(null);
    setEtapa('persona');
  }, []);

  const reiniciar = useCallback(() => {
    setConfirmarReinicio(false);
    setEtapa('inicio');
    setPersona(null);
    setItens([]);
    setTema('padrao');
    setResultado(null);
  }, []);

  const avaliarAgora = useCallback(() => {
    if (!persona) return;
    const r = avaliar(blocos, persona, tema);
    setResultado(r);
    setTentativas((t) => Math.max(0, t - 1));
    setEtapa('resultado');
  }, [blocos, persona, tema]);

  return (
    <div className="app">
      <Cabecalho
        persona={etapa === 'editor' || etapa === 'resultado' ? persona : null}
        tentativas={etapa === 'editor' || etapa === 'resultado' ? tentativas : undefined}
        totalTentativas={etapa === 'editor' || etapa === 'resultado' ? TENTATIVAS[dificuldade] : undefined}
        aoAbrirPersona={() => setFichaAberta(true)}
        aoReiniciar={etapa === 'inicio' ? undefined : () => setConfirmarReinicio(true)}
      />

      {etapa === 'inicio' && <InicioTela aoComecar={comecar} />}

      {etapa === 'persona' && persona && (
        <PersonaTela
          persona={persona}
          dificuldade={dificuldade}
          aoSortearOutra={() => setPersona(sortearPersona(persona.id))}
          aoAvancar={() => setEtapa('editor')}
        />
      )}

      {etapa === 'editor' && persona && (
        <EditorTela
          persona={persona}
          itens={itens}
          blocos={blocos}
          tema={tema}
          aoTrocarTema={setTema}
          aoAdicionar={(id) => setItens((l) => [...l, { uid: novoUid(), blocoId: id }])}
          aoRemover={(uid) => setItens((l) => l.filter((i) => i.uid !== uid))}
          aoMover={(uid, dir) =>
            setItens((l) => {
              const i = l.findIndex((x) => x.uid === uid);
              const j = i + dir;
              if (i < 0 || j < 0 || j >= l.length) return l;
              const copia = [...l];
              [copia[i], copia[j]] = [copia[j], copia[i]];
              return copia;
            })}
          aoLimpar={() => setItens([])}
          aoAvaliar={avaliarAgora}
        />
      )}

      {etapa === 'resultado' && persona && resultado && (
        <ResultadoTela
          persona={persona}
          resultado={resultado}
          tentativas={tentativas}
          aoAjustar={() => setEtapa('editor')}
          aoCertificado={() => setEtapa('certificado')}
        />
      )}

      {etapa === 'certificado' && persona && resultado && (
        <CertificadoTela
          persona={persona}
          resultado={resultado}
          aoVoltar={() => setEtapa('resultado')}
          aoNovoParticipante={() => setConfirmarReinicio(true)}
        />
      )}

      {persona && (
        <Modal
          titulo={`Ficha de ${persona.primeiroNome}`}
          aberto={fichaAberta}
          aoFechar={() => setFichaAberta(false)}
          rodape={<button className="btn btn--azul" onClick={() => setFichaAberta(false)}>Entendi</button>}
        >
          <FichaPersona persona={persona} compacta />
        </Modal>
      )}

      <Modal
        titulo="Recomeçar do zero?"
        aberto={confirmarReinicio}
        aoFechar={() => setConfirmarReinicio(false)}
        rodape={
          <>
            <button className="btn btn--fantasma" onClick={() => setConfirmarReinicio(false)}>Continuar montando</button>
            <button className="btn btn--primario" onClick={reiniciar}>Sim, recomeçar</button>
          </>
        }
      >
        <p style={{ fontSize: '.92rem' }}>
          Isso apaga a página montada e sorteia uma nova persona para o próximo participante.
        </p>
      </Modal>
    </div>
  );
}
