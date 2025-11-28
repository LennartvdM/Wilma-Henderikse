import React from 'react';
import './Hero.css';

function Hero() {
  const heroBackground = `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/background-texture.jpg`;
  const portraitImage = `${process.env.PUBLIC_URL}/wp-content/uploads/2018/11/wilma-6.png`;

  return (
    <section
      className="et_pb_section hero-section"
      style={{ '--hero-bg': `url(${heroBackground})` }}
    >
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
        <div 
          className="et_pb_column hero-column-portrait"
          style={{ backgroundImage: `url(${portraitImage})` }}
        ></div>
      </div>
    </section>
  );
}

export default Hero;

