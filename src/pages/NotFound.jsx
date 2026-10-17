import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="wrap">
        <p className="eyebrow eyebrow--plain">404</p>
        <h1 className="page-title">Deze pagina bestaat <em>niet (meer)</em>.</h1>
        <p className="page-lede">Misschien vindt u wat u zoekt via de publicaties of de homepage.</p>
        <div className="hero__actions">
          <Link className="button button--dark" to="/">Naar de homepage</Link>
          <Link className="button button--ghost" to="/publicaties">Publicaties</Link>
        </div>
      </div>
    </section>
  );
}
