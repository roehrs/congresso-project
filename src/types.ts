import type { ReactNode } from 'react';

export type Nivel = 'alta' | 'media' | 'baixa';
export type Tema = 'alto' | 'padrao' | 'baixo';
export type Dificuldade = 'facil' | 'medio' | 'dificil';

export type TipoBloco =
  | 'Navbar' | 'Hero' | 'Section' | 'Card'
  | 'Gallery' | 'Contact' | 'Carousel' | 'Footer';

export type Grupo = 'topo' | 'destaque' | 'conteudo' | 'contato' | 'rodape';

export interface Bloco {
  id: string;
  tipo: TipoBloco;
  grupo: Grupo;
  nome: string;
  descricao: string;
  a11y: Nivel;
  antipadrao?: boolean;
  render: ReactNode;
}

export interface Persona {
  id: string;
  nome: string;
  primeiroNome: string;
  idade: number;
  profissao: string;
  briefing: string;
  precisa: string;
  preferenciaA11y: Nivel;
  gostos: string[];
  demografia: string;
  cor: string;
  inicial: string;
  secoesObrigatorias: TipoBloco[];
  tiposPreferidos: TipoBloco[];
  tiposProibidos: TipoBloco[];
}

export type StatusCriterio = 'success' | 'warning' | 'error';
export type CategoriaCriterio = 'estrutura' | 'persona' | 'acessibilidade';

export interface Criterio {
  id: string;
  titulo: string;
  status: StatusCriterio;
  pontos: number;
  max: number;
  mensagem: string;
  porque: string;
  categoria: CategoriaCriterio;
}

export interface Resultado {
  total: number;
  aprovado: boolean;
  tier: 'Excelente' | 'Bom' | 'Regular' | 'Insuficiente';
  estrutura: number;
  persona: number;
  acessibilidade: number;
  criterios: Criterio[];
  resumo: string;
}

export type Etapa = 'inicio' | 'persona' | 'editor' | 'resultado' | 'certificado';
