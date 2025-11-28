import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../utils/animations';
import './Work.css';

function Work() {
  const rowRef = useScrollAnimation('fade', 'top', 0, '0');
  const titleRef = useScrollAnimation('slide', 'bottom', 0, '4%');
  const descriptionRef = useScrollAnimation('slide', 'bottom', 100, '4%');
  const buttonRef = useScrollAnimation('zoom', 'top', 0, '0');

  return (
    <section className="et_pb_section work-section">
      <div ref={rowRef} className="et_pb_row work-row">
        <div className="et_pb_column work-column">
          <div ref={titleRef} className="et_pb_text work-title">
            <div className="et_pb_text_inner">
              <h2>mijn werk</h2>
            </div>
          </div>
          <div ref={descriptionRef} className="et_pb_text work-description">
            <div className="et_pb_text_inner">
              Vraagstukken van sociale gelijkheid en rechtvaardigheid vormen een rode draad in mijn werk. Voorbeelden van publicaties vindt u hier:<br />
              <strong>
                <span className="work-link">
                  <a 
                    href="https://www.researchgate.net/profile/Wilma_Henderikse" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    https://www.researchgate.net/profile/Wilma_Henderikse
                  </a>
                </span>
              </strong>
            </div>
          </div>
        </div>
      </div>
      <div className="et_pb_row work-button-row">
        <div className="et_pb_column work-button-column">
          <div ref={buttonRef} className="et_pb_button_module_wrapper">
            <Link to="/publicaties" className="et_pb_button work-button">
              PUBLICATIES
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Work;


