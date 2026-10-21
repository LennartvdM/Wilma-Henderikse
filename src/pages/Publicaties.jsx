import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PubCard from '../components/PubCard';
import { catalog, THEMES, TYPES } from '../data/catalog';

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const haystack = new Map(
  catalog.map((p) => [p.id, norm([p.title, p.subtitle, p.authors, p.type, p.year].filter(Boolean).join(' '))]),
);

function Chip({ active, onClick, children }) {
  return (
    <button type="button" className={`chip${active ? ' is-active' : ''}`} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}

export default function Publicaties() {
  const [params, setParams] = useSearchParams();
  // The page is prerendered unfiltered; read the URL filters only after hydration so
  // the first client render matches the server HTML.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const theme = hydrated && THEMES[params.get('thema')] ? params.get('thema') : '';
  const type = hydrated && TYPES.includes(params.get('type')) ? params.get('type') : '';
  const [query, setQuery] = useState('');
  // take ?q= from the URL once; afterwards the input is the source and writes to the URL
  useEffect(() => {
    if (hydrated) setQuery(params.get('q') || '');
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps
  const deferredQuery = useDeferredValue(query);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const results = useMemo(() => {
    const terms = norm(deferredQuery).split(/\s+/).filter(Boolean);
    return catalog.filter(
      (p) =>
        (!theme || p.themes.includes(theme)) &&
        (!type || p.type === type) &&
        terms.every((t) => haystack.get(p.id).includes(t)),
    );
  }, [theme, type, deferredQuery]);

  const filtered = theme || type || deferredQuery;

  return (
    <div className="pubs-page">
      <header className="page-head">
        <div className="wrap page-head__grid">
          <h1 className="page-title">Publicaties</h1>
          <p className="page-lede">
            Monitors, rapporten, artikelen en handreikingen over gender, diversiteit, leeftijd en de
            combinatie van werk en zorg. Alle documenten zijn als PDF te openen en te downloaden.
          </p>
        </div>
      </header>

      <div className="filters">
        <div className="wrap filters__inner">
          <label className="search">
            <span className="visually-hidden">Zoek in publicaties</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Zoek op titel, auteur of jaar"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                update('q', e.target.value.trim());
              }}
            />
          </label>
          <div className="chips" role="group" aria-label="Thema">
            <Chip active={!theme} onClick={() => update('thema', '')}>Alle thema’s</Chip>
            {Object.entries(THEMES).map(([key, t]) => (
              <Chip key={key} active={theme === key} onClick={() => update('thema', theme === key ? '' : key)}>
                {t.label}
              </Chip>
            ))}
          </div>
          <div className="chips chips--types" role="group" aria-label="Soort publicatie">
            {TYPES.map((t) => (
              <Chip key={t} active={type === t} onClick={() => update('type', type === t ? '' : t)}>
                {t}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <section className="wrap results" aria-live="polite">
        <p className="results__count">
          {filtered
            ? `${results.length} ${results.length === 1 ? 'publicatie' : 'publicaties'} gevonden`
            : 'Nieuwste eerst'}
          {filtered && (
            <button type="button" className="results__reset" onClick={() => { setQuery(''); setParams({}, { replace: true, preventScrollReset: true }); }}>
              Wis filters
            </button>
          )}
        </p>
        {results.length ? (
          <div className="grid">
            {results.map((p, i) => (
              <PubCard key={p.id} pub={p} eager={i < 4} />
            ))}
          </div>
        ) : (
          <p className="results__empty">Geen publicaties gevonden. Probeer een andere zoekterm of thema.</p>
        )}
      </section>
    </div>
  );
}
