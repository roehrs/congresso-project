import logoSenac from '../assets/logo_senac.png';
import type { Persona, Resultado } from '../types';

const AZUL = '#004A8D';
const AZUL_ESCURO = '#003A7B';
const LARANJA = '#F29100';
const LARANJA_SUAVE = '#FFF3E4';
const TEXTO = '#242424';
const CINZA = '#767676';

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function gerarCodigo(): string {
  const bloco = (n: number) =>
    Array.from({ length: n }, () => ALFABETO[Math.floor(Math.random() * ALFABETO.length)]).join('');
  return `SENAC-UX-${bloco(4)}-${bloco(4)}`;
}

export function dataPorExtenso(d = new Date()): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function carregarLogo(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = logoSenac;
  });
}

export interface DadosCertificado {
  nome: string;
  persona: Persona;
  resultado: Resultado;
  codigo: string;
  data: string;
}

const L = 1200;
const A = 850;

export async function baixarCertificadoPNG(d: DadosCertificado): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = L * 2;
  canvas.height = A * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(2, 2);

  const meio = L / 2;
  const aprovado = d.resultado.aprovado;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, L, A);

  ctx.strokeStyle = AZUL;
  ctx.lineWidth = 16;
  ctx.strokeRect(20, 20, L - 40, A - 40);
  ctx.strokeStyle = LARANJA;
  ctx.lineWidth = 3;
  ctx.strokeRect(38, 38, L - 76, A - 76);

  ctx.fillStyle = AZUL;
  for (const [x, y] of [[32, 32], [L - 72, 32], [32, A - 72], [L - 72, A - 72]]) {
    ctx.fillRect(x, y, 40, 40);
  }

  try {
    const logo = await carregarLogo();
    const h = 52;
    const w = (logo.width / logo.height) * h;
    ctx.drawImage(logo, meio - w / 2, 78, w, h);
  } catch {
    ctx.fillStyle = AZUL;
    ctx.font = 'bold 40px "Open Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Senac', meio, 118);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = LARANJA;
  ctx.font = 'bold 15px "Open Sans", sans-serif';
  ctx.fillText('SIMULADOR MONTE O SITE • DESIGN, TECNOLOGIA E ACESSIBILIDADE DIGITAL', meio, 168);

  ctx.fillStyle = TEXTO;
  ctx.font = 'bold 31px "Open Sans", sans-serif';
  ctx.fillText(
    aprovado ? 'CERTIFICADO DE CONCLUSÃO EM UX E ACESSIBILIDADE' : 'CERTIFICADO DE PARTICIPAÇÃO',
    meio, 232,
  );

  ctx.fillStyle = CINZA;
  ctx.font = '19px "Open Sans", sans-serif';
  ctx.fillText('Certificamos que', meio, 292);

  ctx.fillStyle = AZUL;
  ctx.font = 'bold 42px "Open Sans", sans-serif';
  ctx.fillText(d.nome.trim() || 'Participante', meio, 352);

  ctx.strokeStyle = LARANJA;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(340, 374);
  ctx.lineTo(860, 374);
  ctx.stroke();

  ctx.fillStyle = TEXTO;
  ctx.font = '19px "Open Sans", sans-serif';
  const linhas = aprovado
    ? [
        'concluiu o desafio do Simulador Monte o Site, projetando uma página',
        `para a persona ${d.persona.primeiroNome} (${d.persona.profissao}),`,
        'com domínio de hierarquia visual, contraste e diretrizes WCAG 2.1.',
      ]
    : [
        'participou do desafio do Simulador Monte o Site, projetando uma página',
        `para a persona ${d.persona.primeiroNome} (${d.persona.profissao}),`,
        'e exercitou na prática hierarquia visual, contraste e acessibilidade.',
      ];
  linhas.forEach((t, i) => ctx.fillText(t, meio, 424 + i * 34));

  ctx.fillStyle = LARANJA_SUAVE;
  ctx.fillRect(meio - 160, 546, 320, 84);
  ctx.strokeStyle = LARANJA;
  ctx.lineWidth = 2;
  ctx.strokeRect(meio - 160, 546, 320, 84);

  ctx.fillStyle = '#9A4E00';
  ctx.font = 'bold 14px "Open Sans", sans-serif';
  ctx.fillText('PONTUAÇÃO OBTIDA', meio, 576);
  ctx.fillStyle = AZUL;
  ctx.font = 'bold 30px "Open Sans", sans-serif';
  ctx.fillText(aprovado ? `${d.resultado.total} / 100 · ${d.resultado.tier.toUpperCase()}` : `${d.resultado.total} / 100 PONTOS`, meio, 613);

  ctx.strokeStyle = '#D5DBE1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(190, 706); ctx.lineTo(450, 706);
  ctx.moveTo(750, 706); ctx.lineTo(1010, 706);
  ctx.stroke();

  ctx.fillStyle = TEXTO;
  ctx.font = 'bold 14px "Open Sans", sans-serif';
  ctx.fillText('Coordenação de Design e Tecnologia', 320, 730);
  ctx.fillText('Núcleo de Acessibilidade Digital', 880, 730);

  ctx.fillStyle = CINZA;
  ctx.font = '13px "Open Sans", sans-serif';
  ctx.fillText(`Emitido em ${d.data}  •  Código de verificação: ${d.codigo}`, meio, 782);

  ctx.fillStyle = AZUL_ESCURO;
  ctx.font = 'bold 12px "Open Sans", sans-serif';
  ctx.fillText('Competições Senac RS', meio, 806);

  const a = document.createElement('a');
  a.download = `Certificado-Senac-${(d.nome.trim() || 'participante').replace(/\s+/g, '-')}.png`;
  a.href = canvas.toDataURL('image/png');
  a.click();
}
