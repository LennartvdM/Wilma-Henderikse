import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { publications, externalPublications, PUBLICATIONS_PATH } from '../data/publications';
import './Publicaties.css';

function Publicaties() {
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const allTags = useMemo(() => {
    const tags = new Set();
    [...publications, ...externalPublications].forEach(pub => {
      pub.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  const filteredPublications = useMemo(() => {
    let filtered = [...publications, ...externalPublications];

    if (selectedTag) {
      filtered = filtered.filter(pub => pub.tags.includes(selectedTag));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pub =>
        pub.title.toLowerCase().includes(term) ||
        pub.summary.toLowerCase().includes(term) ||
        pub.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return filtered.sort((a, b) => {
      const dateA = parseInt(a.date) || 0;
      const dateB = parseInt(b.date) || 0;
      return dateB - dateA;
    });
  }, [selectedTag, searchTerm]);

  const getPdfPath = (pub) => {
    if (pub.external) {
      return pub.pdf;
    }
    return `${PUBLICATIONS_PATH}${pub.pdf}`;
  };

  return (
    <div className="publicaties-page">
      <header className="publicaties-hero">
        <div>
          <p className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-divider">/</span>
            <span>Publicaties</span>
          </p>
          <h1 className="publicaties-heading">Publicaties</h1>
          <p className="publicaties-subtitle">
            Een levend overzicht van publicaties, monitors en factsheets rond diversiteit,
            inclusie en gelijke kansen.
          </p>
        </div>
        <div className="publicaties-count-chip">
          {filteredPublications.length} {filteredPublications.length === 1 ? 'publicatie' : 'publicaties'}
        </div>
      </header>

      <section className="publicaties-toolbar">
        <div className="toolbar-row">
          <label className="search-field">
            <span className="search-label">Zoeken</span>
            <input
              type="text"
              placeholder="Titel, thema of trefwoord"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
          <div className="filter-meta">
            <span className="filter-title">Thema's</span>
            {selectedTag && (
              <button className="clear-filter" onClick={() => setSelectedTag(null)}>
                Wis filter
              </button>
            )}
          </div>
          <div className="tag-pills" aria-label="Thema filters">
            <button
              className={`pill ${selectedTag === null ? 'active' : ''}`}
              onClick={() => setSelectedTag(null)}
            >
              Alle thema's
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`pill ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="publicaties-grid-section">
        <div className="publicaties-grid" role="list">
          {filteredPublications.map((pub, index) => (
            <article key={index} className="publicatie-card" role="listitem">
              <div className="card-top">
                <span className="date-chip">{pub.date || '–'}</span>
                <a
                  href={getPdfPath(pub)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-link"
                  aria-label={`Download ${pub.title}`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 3v12" />
                    <path d="M7 10l5 5 5-5" />
                    <path d="M5 19h14" />
                  </svg>
                  <span>Download</span>
                </a>
              </div>
              <h3 className="card-title">
                <a href={getPdfPath(pub)} target="_blank" rel="noopener noreferrer">{pub.title}</a>
              </h3>
              <p className="card-summary">{pub.summary}</p>
              <div className="card-tags" aria-label="Tags">
                {pub.tags.map((tag, tagIndex) => (
                  <button
                    type="button"
                    key={`${tag}-${tagIndex}`}
                    className="tag-chip"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
        {filteredPublications.length === 0 && (
          <div className="publicaties-empty">
            <p>Geen publicaties gevonden. Probeer een andere zoekterm of thema.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Publicaties;
