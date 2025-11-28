import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="page-container">
      <main className="main-content">
        <section className="et_pb_section not-found-section">
          <div className="et_pb_row not-found-row">
            <div className="et_pb_column not-found-column">
              <div className="et_pb_text not-found-content">
                <div className="et_pb_text_inner">
                  <h1>404</h1>
                  <h2>Pagina niet gevonden</h2>
                  <p>De pagina die u zoekt bestaat niet of is verplaatst.</p>
                  <Link to="/" className="not-found-link">
                    Terug naar home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default NotFound;




