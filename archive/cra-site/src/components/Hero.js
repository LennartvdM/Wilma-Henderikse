import React from 'react';
import { useScrollAnimation } from '../utils/animations';
import './Hero.css';

function Hero() {
  const heroBackground = `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/background-texture.jpg`;
  const portraitImage = `${process.env.PUBLIC_URL}/wp-content/uploads/2018/11/wilma-6.png`;
  
  const sectionRef = useScrollAnimation('zoom', 'top', 0, '4%');
  const textRef = useScrollAnimation('slide', 'bottom', 0, '0');
  const titleRef = useScrollAnimation('fade', 'top', 0, '0');
  const subtitleRef = useScrollAnimation('slide', 'top', 0, '17%');

  return (
    <section
      ref={sectionRef}
      className="et_pb_section hero-section"
      style={{ '--hero-bg': `url(${heroBackground})` }}
    >
      <div className="et_pb_row hero-row">
        <div className="et_pb_column hero-column">
          <div ref={textRef} className="et_pb_text hero-text">
            <div className="et_pb_text_inner">
              <h1 ref={titleRef}>
                Wilma<br />
                <span className="hero-name">Henderikse</span>
              </h1>
            </div>
          </div>
          <div ref={subtitleRef} className="et_pb_text hero-subtitle">
            <div className="et_pb_text_inner">
              <h2><span>maatschappelijk ondernemer</span></h2>
              <h2><span>onderzoeker</span></h2>
              <h2><span>auteur</span></h2>
            </div>
          </div>
        </div>
        <div 
          className="et_pb_column hero-column-portrait"
          style={{ 
            backgroundImage: `url(${portraitImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
      </div>
    </section>
  );
}

export default Hero;

