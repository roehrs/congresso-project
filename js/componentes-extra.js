// ...existing code...
// Complemento de componentes necessários pelas personas (Hero, Contact, Gallery)
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
        <header class="hero-block" role="banner" aria-label="Hero">
          <div style="padding:24px;text-align:center;">
            <h1 style="margin:0;font-size:1.25rem">Título principal do Hero</h1>
            <p style="margin:.5rem 0;color:#555">Subtítulo descritivo.</p>
            <p><a href="#cta" class="btn btn-primary" role="button">Chamada para ação</a></p>
          </div>
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
        <section class="contact-block" aria-label="Contato">
          <div style="padding:16px;">
            <h2 style="font-size:1rem;margin-bottom:.5rem">Fale conosco</h2>
            <form aria-label="Formulário de contato">
              <div style="display:flex;flex-direction:column;gap:.5rem;max-width:320px">
                <label>
                  <span class="visually-hidden">Nome</span>
                  <input type="text" name="nome" placeholder="Nome" aria-label="Nome" style="width:100%;padding:.5rem;border:1px solid #ccc;border-radius:4px">
                </label>
                <label>
                  <span class="visually-hidden">Email</span>
                  <input type="email" name="email" placeholder="Email" aria-label="Email" style="width:100%;padding:.5rem;border:1px solid #ccc;border-radius:4px">
                </label>
                <button class="btn btn-sm btn-primary" type="submit">Enviar</button>
              </div>
            </form>
            <div style="margin-top:.75rem;font-size:.9rem;color:#444">Telefone: (00) 0000-0000 • Email: contato@exemplo.com</div>
          </div>
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
        <section class="gallery-block" aria-label="Galeria">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            <figure style="margin:0">
              <img
                alt="Imagem 1"
                src="https://picsum.photos/seed/gallery1/600/360"
                srcset="https://picsum.photos/seed/gallery1/300/180 300w, https://picsum.photos/seed/gallery1/600/360 600w"
                sizes="(max-width:600px) 100vw, 33vw"
                style="width:100%;height:auto;border-radius:6px"
                loading="lazy">
            </figure>
            <figure style="margin:0">
              <img
                alt="Imagem 2"
                src="https://picsum.photos/seed/gallery2/600/360"
                srcset="https://picsum.photos/seed/gallery2/300/180 300w, https://picsum.photos/seed/gallery2/600/360 600w"
                sizes="(max-width:600px) 100vw, 33vw"
                style="width:100%;height:auto;border-radius:6px"
                loading="lazy">
            </figure>
            <figure style="margin:0">
              <img
                alt="Imagem 3"
                src="https://picsum.photos/seed/gallery3/600/360"
                srcset="https://picsum.photos/seed/gallery3/300/180 300w, https://picsum.photos/seed/gallery3/600/360 600w"
                sizes="(max-width:600px) 100vw, 33vw"
                style="width:100%;height:auto;border-radius:6px"
                loading="lazy">
            </figure>
            <figure style="margin:0">
              <img
                alt="Imagem 4"
                src="https://picsum.photos/seed/gallery4/600/360"
                srcset="https://picsum.photos/seed/gallery4/300/180 300w, https://picsum.photos/seed/gallery4/600/360 600w"
                sizes="(max-width:600px) 100vw, 33vw"
                style="width:100%;height:auto;border-radius:6px"
                loading="lazy">
            </figure>
            <figure style="margin:0">
              <img
                alt="Imagem 5"
                src="https://picsum.photos/seed/gallery5/600/360"
                srcset="https://picsum.photos/seed/gallery5/300/180 300w, https://picsum.photos/seed/gallery5/600/360 600w"
                sizes="(max-width:600px) 100vw, 33vw"
                style="width:100%;height:auto;border-radius:6px"
                loading="lazy">
            </figure>
            <figure style="margin:0">
              <img
                alt="Imagem 6"
                src="https://picsum.photos/seed/gallery6/600/360"
                srcset="https://picsum.photos/seed/gallery6/300/180 300w, https://picsum.photos/seed/gallery6/600/360 600w"
                sizes="(max-width:600px) 100vw, 33vw"
                style="width:100%;height:auto;border-radius:6px"
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