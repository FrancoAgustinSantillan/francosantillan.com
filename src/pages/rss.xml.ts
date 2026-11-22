import type { APIRoute } from 'astro';
import { SITE, getNotas } from '../lib';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const base = site!.toString().replace(/\/$/, '');
  const notas = (await getNotas()).filter((n) => !n.data.draft);
  const items = notas
    .map((n) => {
      const link = `${base}/notas/${n.id}/`;
      return `<item><title>${esc(n.data.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${n.data.date.toUTCString()}</pubDate></item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(SITE.name)}</title><link>${base}/</link><description>${esc(SITE.tagline)}</description><language>es</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
