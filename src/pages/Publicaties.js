import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { publications, externalPublications, PUBLICATIONS_PATH } from '../data/publications';
import './Publicaties.css';

function Publicaties() {
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    [...publications, ...externalPublications].forEach(pub => {
      pub.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter publications
  const filteredPublications = useMemo(() => {
    let filtered = [...publications, ...externalPublications];

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(pub => pub.tags.includes(selectedTag));
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pub =>
        pub.title.toLowerCase().includes(term) ||
        pub.summary.toLowerCase().includes(term) ||
        pub.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Sort by date (newest first)
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
    return PUBLICATIONS_PATH + pub.pdf;
  };

  return (
    <div className="page-container">
      <main className="main-content">
        <section className="et_pb_section publicaties-hero-section">
          <div className="et_pb_row publicaties-hero-row">
            <div className="et_pb_column publicaties-hero-column-left">
              <div className="et_pb_text publicaties-title">
                <div className="et_pb_text_inner">
                  <h3><strong>Publicaties</strong></h3>
                </div>
              </div>
            </div>
            <div className="et_pb_column publicaties-hero-column-right">
              <div className="et_pb_text publicaties-home-link">
                <div className="et_pb_text_inner">
                  <h3>
                    <span className="home-link">
                      <Link to="/"><strong>Home</strong></Link>
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="et_pb_section publicaties-filters-section">
          <div className="et_pb_row publicaties-filters-row">
            <div className="et_pb_column publicaties-filters-column">
              <div className="publicaties-search">
                <input
                  type="text"
                  placeholder="Zoek in publicaties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="publicaties-search-input"
                />
              </div>
              <div className="publicaties-tags">
                <button
                  className={`publicaties-tag ${selectedTag === null ? 'active' : ''}`}
                  onClick={() => setSelectedTag(null)}
                >
                  Alle thema's
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`publicaties-tag ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTag && (
                <div className="publicaties-filter-info">
                  <span>Gefilterd op: <strong>{selectedTag}</strong></span>
                  <button onClick={() => setSelectedTag(null)} className="clear-filter">×</button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="et_pb_section publicaties-list-section">
          <div className="et_pb_row publicaties-list-row">
            <div className="et_pb_column publicaties-list-column">
              <div className="publicaties-count">
                {filteredPublications.length} {filteredPublications.length === 1 ? 'publicatie' : 'publicaties'}
              </div>
              <div className="publicaties-grid">
                {filteredPublications.map((pub, index) => (
                  <div key={index} className="publicatie-card">
                    <div className="publicatie-card-header">
                      <div className="publicatie-date">{pub.date}</div>
                      <a
                        href={getPdfPath(pub)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="publicatie-download"
                        title="Download PDF"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                      </a>
                    </div>
                    <h4 className="publicatie-title">
                      <a
                        href={getPdfPath(pub)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pub.title}
                      </a>
                    </h4>
                    <p className="publicatie-summary">{pub.summary}</p>
                    <div className="publicatie-tags">
                      {pub.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="publicatie-tag"
                          onClick={() => setSelectedTag(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {filteredPublications.length === 0 && (
                <div className="publicaties-empty">
                  <p>Geen publicaties gevonden. Probeer een andere zoekterm of thema.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Publicaties;
