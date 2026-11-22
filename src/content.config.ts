import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cada archivo .md en src/content/proyectos/ es un proyecto.
const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z.object({
    title: z.string(),
    description: z.string(), // una línea: qué es y para qué sirve
    status: z.enum(['en curso', 'terminado', 'pausado']),
    started: z.coerce.date(),
    stack: z.array(z.string()).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
    featured: z.boolean().default(false), // aparece en la portada
    draft: z.boolean().default(false), // true = no se publica
  }),
});

// Cada archivo .md en src/content/notas/ es una nota.
//   tipo "diario": avance de un proyecto (poné `project:` con el nombre del archivo del proyecto)
//   tipo "nota":   texto corto suelto
//   tipo "link":   algo que leíste/viste (poné `url:`)
const notas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notas' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tipo: z.enum(['diario', 'nota', 'link']).default('nota'),
    project: reference('proyectos').optional(),
    url: z.url().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { proyectos, notas };
