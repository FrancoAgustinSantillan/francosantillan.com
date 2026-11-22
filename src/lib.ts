import { getCollection } from 'astro:content';

export const SITE = {
  name: 'Franco Santillán',
  tagline: 'Desarrollador de software. Acá muestro lo que construyo y cuento cómo lo hago.',
  links: [
    { label: 'GitHub', href: 'https://github.com/FrancoAgustinSantillan' },
    // { label: 'LinkedIn', href: 'https://www.linkedin.com/in/TU-USUARIO' },
    { label: 'RSS', href: '/rss.xml' },
  ],
};

const fmt = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (d: Date) => fmt.format(d).replace('.', '');

// En `npm run dev` se ven también los borradores; en la web publicada, no.
const visible = (e: { data: { draft: boolean } }) => import.meta.env.DEV || !e.data.draft;

export async function getNotas() {
  const notas = await getCollection('notas', visible);
  return notas.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

const statusOrder = { 'en curso': 0, pausado: 1, terminado: 2 } as const;
export async function getProyectos() {
  const proyectos = await getCollection('proyectos', visible);
  return proyectos.sort(
    (a, b) =>
      statusOrder[a.data.status] - statusOrder[b.data.status] ||
      b.data.started.valueOf() - a.data.started.valueOf(),
  );
}
