import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="et_pb_section hero-section">
      <div className="et_pb_row hero-row">
        <div className="et_pb_column hero-column">
          <div className="et_pb_text hero-text">
            <div className="et_pb_text_inner">
              <h1>
                Wilma<br />
                <span className="hero-name">Henderikse</span>
              </h1>
            </div>
          </div>
          <div className="et_pb_text hero-subtitle">
            <div className="et_pb_text_inner">
              <h2><span>maatschappelijk ondernemer</span></h2>
              <h2><span>onderzoeker</span></h2>
              <h2><span>auteur</span></h2>
            </div>
          </div>
        </div>
        <div className="et_pb_column hero-column-empty"></div>
      </div>
    </section>
  );
}

export default Hero;

