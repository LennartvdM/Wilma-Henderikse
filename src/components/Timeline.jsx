import React from 'react';
import { Link } from 'react-router-dom';
import { catalog, stats } from '../data/catalog';

const counts = catalog.reduce((acc, p) => ({ ...acc, [p.year]: (acc[p.year] || 0) + 1 }), {});
const years = Array.from({ length: stats.last - stats.first + 1 }, (_, i) => stats.first + i);
const max = Math.max(...Object.values(counts));

// Her publication record as a bar per year — each bar links to that year's publications.
export default function Timeline() {
  return (
    <figure className="timeline">
      <figcaption className="timeline__caption">
        <span>Publicaties per jaar</span>
        <span className="timeline__total">{stats.count}</span>
      </figcaption>
      <ol className="timeline__bars">
        {years.map((y) => {
          const n = counts[y] || 0;
          const label = `${y}: ${n} ${n === 1 ? 'publicatie' : 'publicaties'}`;
          return (
            <li key={y} style={{ '--h': n / max }} className={n ? '' : 'is-empty'}>
              {n ? (
                <Link to={`/publicaties?jaar=${y}`} aria-label={label} title={label}>
                  <span className="timeline__n" aria-hidden="true">{n}</span>
                </Link>
              ) : (
                <span title={label} />
              )}
              <span className="timeline__year" aria-hidden="true">{String(y).slice(2)}</span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
