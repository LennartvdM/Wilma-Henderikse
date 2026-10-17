// Per-page <title>/description, used by the prerender and on client-side navigation.
const SITE = 'Wilma Henderikse';

export const routeMeta = {
  '/': {
    title: `${SITE} — onderzoeker, maatschappelijk ondernemer, auteur`,
    description:
      'Wilma Henderikse onderzoekt sociale gelijkheid op de werkvloer: vrouwen naar de top, culturele diversiteit, leeftijd en de combinatie van werk en zorg.',
  },
  '/publicaties': {
    title: `Publicaties — ${SITE}`,
    description:
      'Monitors, rapporten, artikelen en handreikingen van Wilma Henderikse over gender, diversiteit, leeftijd en werk en zorg. Alle publicaties als PDF.',
  },
  '/404': {
    title: `Pagina niet gevonden — ${SITE}`,
    description: 'Deze pagina bestaat niet (meer).',
  },
};

export const metaFor = (path) => routeMeta[path.replace(/\/+$/, '') || '/'] || routeMeta['/404'];
