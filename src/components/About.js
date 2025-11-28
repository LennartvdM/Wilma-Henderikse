import React from 'react';
import './About.css';

function About() {
  const lepelaarImage = `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/lepelaar-11.png`;

  return (
    <>
      <section className="et_pb_section about-section">
        <div className="et_pb_row about-row">
          <div className="et_pb_column about-column-left">
            <div className="et_pb_row_inner about-row-inner">
              <div className="et_pb_column about-column-inner">
                <div className="et_pb_text about-title">
                  <div className="et_pb_text_inner">
                    <h2>Over Wilma</h2>
                  </div>
                </div>
                <div className="et_pb_text about-description">
                  <div className="et_pb_text_inner">
                    <p>
                      Begon haar loopbaan als wetenschappelijk onderzoeker en hoofd Wetenschapswinkel bij de Erasmus universiteit, om zich vervolgens te specialiseren in marketing en communicatie. Richtte op Curaçao marketingbureau Insight op en stapte in 1993 over naar VanDoorneHuiskes als partner. Vraagstukken van sociale ongelijkheid, gender en diversiteit houden haar al een leven lang bezig. Zij schreef veel publicaties hierover en participeerde in diverse internationale commissies en projecten. <span>Bestuurlijk actief in sport, onderwijs en hulpverlening, en als vrijwilliger op diverse fronten. Ze werkt met heel veel plezier mee aan natuur- en milieuactiviteiten.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="et_pb_column about-column-right">
            <div className="et_pb_image about-image">
              <span className="et_pb_image_wrap">
                <img src={lepelaarImage} alt="Lepelaar" />
              </span>
            </div>
          </div>
        </div>
      </section>
      <section
        className="et_pb_section about-parallax-section"
        style={{ '--about-bg': `url(${lepelaarImage})` }}
      >
        <div className="et_parallax_bg" style={{ backgroundImage: `url(${lepelaarImage})` }}></div>
        <div className="et_pb_row about-parallax-row">
          <div className="et_pb_column about-parallax-column"></div>
          <div className="et_pb_column about-parallax-column"></div>
        </div>
      </section>
    </>
  );
}

export default About;

