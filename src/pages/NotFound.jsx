import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="wrap">
        <h1 className="page-title">Niet gevonden</h1>
        <p className="page-lede">
          Deze pagina bestaat niet (meer). Misschien vindt u wat u zoekt via de publicaties of de
          homepage.
        </p>
        <div className="actions">
          <Link className="btn btn--teal" to="/">
            Naar de homepage <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn btn--quiet" to="/publicaties">
            Publicaties
          </Link>
        </div>
      </div>
    </section>
  );
}
