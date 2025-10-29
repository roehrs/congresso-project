// Complemento de componentes necessários pelas personas (Hero, Contact, Gallery)
// Todos os estilos estão inline
window.componentes = window.componentes || [];

;(function () {
  const extras = [
    {
      id: 101,
      tipo: 'Hero',
      categoria: 'Section',
      descricao: 'Seção inicial com título, subtítulo e CTA — foco em destaque visual.',
      acessibilidade: 'media',
      html: `
        <header role="banner" aria-label="Hero" style="padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 1.25rem; font-weight: 500; line-height: 1.2;">Título principal do Hero</h1>
          <p style="margin: 0.5rem 0; color: #555; line-height: 1.5;">Subtítulo descritivo.</p>
          <p style="margin: 0.5rem 0 0 0;">
            <a href="#cta" role="button" style="display: inline-block; padding: 0.375rem 0.75rem; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #fff; background-color: #0d6efd; border: 1px solid #0d6efd; border-radius: 0.375rem; text-decoration: none;">Chamada para ação</a>
          </p>
        </header>
      `
    },
    {
      id: 102,
      tipo: 'Contact',
      categoria: 'Section',
      descricao: 'Seção de contato com formulário simples e informações de contato.',
      acessibilidade: 'alta',
      html: `
        <section aria-label="Contato" style="padding: 16px;">
          <h2 style="font-size: 1rem; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2;">Fale conosco</h2>
          <form aria-label="Formulário de contato">
            <div style="display: flex; flex-direction: column; gap: 0.5rem; max-width: 320px;">
              <label>
                <span style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;">Nome</span>
                <input type="text" name="nome" placeholder="Nome" aria-label="Nome" style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; line-height: 1.5;">
              </label>
              <label>
                <span style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;">Email</span>
                <input type="email" name="email" placeholder="Email" aria-label="Email" style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; line-height: 1.5;">
              </label>
              <button type="submit" style="display: inline-block; padding: 0.25rem 0.5rem; font-size: 0.875rem; font-weight: 400; line-height: 1.5; color: #fff; background-color: #0d6efd; border: 1px solid #0d6efd; border-radius: 0.375rem;">Enviar</button>
            </div>
          </form>
          <div style="margin-top: 0.75rem; font-size: 0.9rem; color: #444; line-height: 1.5;">Telefone: (00) 0000-0000 • Email: contato@exemplo.com</div>
        </section>
      `
    },
    {
      id: 103,
      tipo: 'Gallery',
      categoria: 'Section',
      descricao: 'Galeria de imagens em grid — ideal para portfólios e exibição visual.',
      acessibilidade: 'media',
      html: `
        <section aria-label="Galeria" style="padding: 16px;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
            <figure style="margin: 0;">
              <img
                alt="Imagem 1"
                src="https://picsum.photos/seed/gallery1/600/360"
                srcset="https://picsum.photos/seed/gallery1/300/180 300w, https://picsum.photos/seed/gallery1/600/360 600w"
                sizes="(max-width:600px) 100vw, 33vw"
                style="width: 100%; height: auto; border-radius: 6px; display: block;"
                loading="lazy">
            </figure>
            <figure style="margin: 0;">
              <img
                alt="Imagem 2"
                src="https://picsum.photos/seed/gallery2/600/360"
                srcset="https://picsum.photos/seed/gallery2/300/180 300w, https://picsum.photos/seed/gallery2/600/360 600w"
                sizes="(max-width:600px) 100vw, 33vw"
                style="width: 100%; height: auto; border-radius: 6px; display: block;"
                loading="lazy">
            </figure>
            <figure style="margin: 0;">
              <img
                alt="Imagem 3"
                src="https://picsum.photos/seed/gallery3/600/360"
                srcset="https://picsum.photos/seed/gallery3/300/180 300w, https://picsum.photos/seed/gallery3/600/360 600w"
                sizes="(max-width:600px) 100vw, 33vw"
                style="width: 100%; height: auto; border-radius: 6px; display: block;"
                loading="lazy">
            </figure>
            <figure style="margin: 0;">
              <img
                alt="Imagem 4"
                src="https://picsum.photos/seed/gallery4/600/360"
                srcset="https://picsum.photos/seed/gallery4/300/180 300w, https://picsum.photos/seed/gallery4/600/360 600w"
                sizes="(max-width:600px) 100vw, 33vw"
                style="width: 100%; height: auto; border-radius: 6px; display: block;"
                loading="lazy">
            </figure>
            <figure style="margin: 0;">
              <img
                alt="Imagem 5"
                src="https://picsum.photos/seed/gallery5/600/360"
                srcset="https://picsum.photos/seed/gallery5/300/180 300w, https://picsum.photos/seed/gallery5/600/360 600w"
                sizes="(max-width:600px) 100vw, 33vw"
                style="width: 100%; height: auto; border-radius: 6px; display: block;"
                loading="lazy">
            </figure>
            <figure style="margin: 0;">
              <img
                alt="Imagem 6"
                src="https://picsum.photos/seed/gallery6/600/360"
                srcset="https://picsum.photos/seed/gallery6/300/180 300w, https://picsum.photos/seed/gallery6/600/360 600w"
                sizes="(max-width:600px) 100vw, 33vw"
                style="width: 100%; height: auto; border-radius: 6px; display: block;"
                loading="lazy">
            </figure>
          </div>
        </section>
      `
    }
  ];

  // Insere sem duplicar (verifica pelo id)
  extras.forEach((c) => {
    if (!window.componentes.find((x) => x.id === c.id)) {
      window.componentes.push(c);
    }
  });
})();