import React from 'react';
import Cover from './Cover';

export default function PubCard({ pub, compact = false, eager = false }) {
  const facts = [pub.external ? 'Externe link' : 'PDF', pub.pages && `${pub.pages} p.`, pub.size]
    .filter(Boolean)
    .join(' · ');
  return (
    <article className={`pub${compact ? ' pub--compact' : ''}`}>
      <a className="pub__link" href={pub.href} target="_blank" rel="noopener noreferrer">
        <Cover pub={pub} eager={eager} />
        <div className="pub__body">
          <p className="pub__kicker">
            <span>{pub.year}</span>
            <span aria-hidden="true">·</span>
            <span>{pub.type}</span>
          </p>
          <h3 className="pub__title">{pub.title}</h3>
          {pub.subtitle && !compact && <p className="pub__subtitle">{pub.subtitle}</p>}
          {pub.authors && !compact && <p className="pub__authors">{pub.authors}</p>}
          {!compact && (
            <p className="pub__facts">
              <span className="pub__download" aria-hidden="true">{pub.external ? "↗" : "↓"}</span>
              {facts}
            </p>
          )}
        </div>
      </a>
    </article>
  );
}
