import { useMemo, useState } from 'react';
import logo from '../assets/logo_senac.png';
import { baixarCertificadoPNG, dataPorExtenso, gerarCodigo } from '../lib/certificado';
import type { Persona, Resultado } from '../types';

interface Props {
  persona: Persona;
  resultado: Resultado;
  aoVoltar: () => void;
  aoNovoParticipante: () => void;
}

export function CertificadoTela({ persona, resultado, aoVoltar, aoNovoParticipante }: Props) {
  const [nome, setNome] = useState('');
  const [baixando, setBaixando] = useState(false);
  const codigo = useMemo(gerarCodigo, []);
  const data = useMemo(() => dataPorExtenso(), []);
  const aprovado = resultado.aprovado;
  const exibido = nome.trim() || 'Participante';

  const baixar = async () => {
    setBaixando(true);
    try {
      await baixarCertificadoPNG({ nome: exibido, persona, resultado, codigo, data });
    } finally {
      setBaixando(false);
    }
  };

  return (
    <main className="tela">
      <div className="tela__wrap pilha" style={{ maxWidth: 820 }}>
        <div className="card nao-imprime" style={{ padding: 16 }}>
          <div className="cert-nome">
            <label className="rotulo" htmlFor="nome-cert">Nome que vai no certificado</label>
            <input
              id="nome-cert"
              className="entrada"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Maria da Silva"
              autoComplete="name"
              maxLength={60}
            />
          </div>
        </div>

        <div className="cert" id="area-certificado">
          <div className="cert__inner">
            <img className="cert__logo" src={logo} alt="Senac" />
            <div className="cert__nucleo">Simulador Monte o Site • Acessibilidade Digital</div>

            <h1 className="cert__h1">
              {aprovado ? 'Certificado de conclusão em UX e acessibilidade' : 'Certificado de participação'}
            </h1>

            <p className="cert__linha">Certificamos que</p>
            <p className="cert__nome">{exibido}</p>
            <div className="cert__risco" />

            <p className="cert__linha">
              {aprovado ? 'concluiu o desafio' : 'participou do desafio'} do Simulador Monte o Site,
              projetando uma página para a persona <strong>{persona.primeiroNome}</strong> ({persona.profissao}),
              {aprovado
                ? ' com domínio de hierarquia visual, contraste e diretrizes WCAG 2.1.'
                : ' e exercitou na prática hierarquia visual, contraste e acessibilidade.'}
            </p>

            <div className="cert__nota">
              <span className="rotulo">Pontuação obtida</span>
              <strong>{resultado.total} / 100{aprovado ? ` · ${resultado.tier}` : ' pontos'}</strong>
            </div>

            <div className="cert__assinaturas">
              <div className="cert__ass">Coordenação de Design e Tecnologia</div>
              <div className="cert__ass">Núcleo de Acessibilidade Digital</div>
            </div>

            <p className="cert__rodape">
              Emitido em {data} • Código de verificação: <strong>{codigo}</strong>
            </p>
          </div>
        </div>

        <div className="linha nao-imprime" style={{ justifyContent: 'center' }}>
          <button className="btn btn--primario" onClick={baixar} disabled={baixando}>
            {baixando ? 'Gerando…' : 'Baixar imagem (PNG)'}
          </button>
          <button className="btn btn--azul" onClick={() => window.print()}>
            Imprimir / salvar PDF
          </button>
          <button className="btn btn--fantasma" onClick={aoVoltar}>Voltar ao resultado</button>
          <button className="btn btn--linha" onClick={aoNovoParticipante}>Novo participante</button>
        </div>
      </div>
    </main>
  );
}
