import React from 'react';
import { useScrollAnimation } from '../utils/animations';
import './Quote.css';

function Quote() {
  const rowRef = useScrollAnimation('fade', 'top', 0, '0');
  const textRef = useScrollAnimation('slide', 'bottom', 0, '4%');

  return (
    <section className="et_pb_section quote-section">
      <div ref={rowRef} className="et_pb_row quote-row">
        <div className="et_pb_column quote-column">
          <div ref={textRef} className="et_pb_text quote-text">
            <div className="et_pb_text_inner">
              <h2>
                <em>"It's the job that's never started as takes longest to finish."</em>
              </h2>
              <h1>
                <strong>
                  <a href="https://www.goodreads.com/author/show/656983.J_R_R_Tolkien" target="_blank" rel="noopener noreferrer">
                    J.R.R. Tolkien
                  </a>
                </strong>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Quote;


