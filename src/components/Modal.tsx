import { useEffect, type ReactNode } from 'react';

interface Props {
  titulo: string;
  aberto: boolean;
  aoFechar: () => void;
  children: ReactNode;
  rodape?: ReactNode;
}

export function Modal({ titulo, aberto, aoFechar, children, rodape }: Props) {
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') aoFechar(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  return (
    <div className="modal-veu nao-imprime" onClick={aoFechar} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()}>
        <div className="modal__topo">
          <h2>{titulo}</h2>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>
        <div className="modal__corpo pane">{children}</div>
        {rodape && <div className="modal__pe">{rodape}</div>}
      </div>
    </div>
  );
}
