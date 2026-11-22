# francosantillan.com

Mi web personal. Hecha con [Astro](https://astro.build) y publicada en GitHub Pages.

## Ver la web en local

```sh
npm install      # solo la primera vez
npm run dev      # abre http://localhost:4321 (muestra también los borradores)
```

## Publicar

Todo lo que se sube a `main` se publica solo en unos minutos:

```sh
git add -A
git commit -m "Nueva nota"
git push
```

## Agregar un proyecto

Crear `src/content/proyectos/nombre-del-proyecto.md` (el nombre del archivo es la URL: `/proyectos/nombre-del-proyecto/`):

```md
---
title: Nombre del proyecto
description: Una línea, qué es y para qué sirve.
status: en curso        # en curso | pausado | terminado
started: 2026-11-21
stack: [Python, FastAPI]
repo: https://github.com/FrancoAgustinSantillan/...   # opcional
demo: https://...                                     # opcional
featured: true          # opcional: aparece en la portada
draft: false            # opcional: true = no se publica todavía
---

Qué problema resuelve, cómo lo encaraste, qué aprendiste, capturas...
```

## Agregar una nota

Crear `src/content/notas/AAAA-MM-DD-titulo-corto.md`:

```md
---
title: Título de la nota
date: 2026-11-21
tipo: diario            # diario | nota | link
project: nombre-del-proyecto   # solo si es un avance de un proyecto
url: https://...        # solo si es tipo link
tags: [python]          # opcional
draft: false            # opcional
---

Texto en Markdown.
```

- **diario**: un avance de un proyecto. Aparece en las notas y en el diario de ese proyecto.
- **nota**: un texto corto suelto.
- **link**: algo que leíste o viste, con un par de líneas de por qué vale la pena.

Las imágenes van en `public/img/` y se usan así: `![descripción](/img/archivo.png)`.

## Cambiar textos generales

El nombre, la frase de presentación y los enlaces del pie están en `src/lib.ts`.
