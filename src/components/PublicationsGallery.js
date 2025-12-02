import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '../utils/animations';
import './PublicationsGallery.css';

function PublicationsGallery() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [cardPositions, setCardPositions] = useState([]);
  
  const publications = [
    {
      image: `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/Scherven-Brengen-Geluk-2.png`,
      pdf: `${process.env.PUBLIC_URL}/wp-content/uploads/publications/scherven-brengen-geluk.pdf`,
      baseSize: { cols: 6, rows: 6 }, // HUGE
      basePosition: { col: 1, row: 1 }
    },
    {
      image: `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/Sleutels_tot_succes_VDH-1.png`,
      pdf: `${process.env.PUBLIC_URL}/wp-content/uploads/publications/sleutels_tot_succes_vdh.pdf`,
      baseSize: { cols: 3, rows: 3 }, // Medium
      basePosition: { col: 7, row: 1 }
    },
    {
      image: `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/Rijkmetleeftijd-2.png`,
      pdf: `${process.env.PUBLIC_URL}/wp-content/uploads/publications/rijk-met-leeftijd-aan-de-slag-met-leeftijdsbewust-beleid-bij-de-rijksoverheid.pdf`,
      baseSize: { cols: 2, rows: 2 }, // TINY
      basePosition: { col: 10, row: 1 }
    },
    {
      image: `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/Bedrijven-Monitor.png`,
      pdf: `${process.env.PUBLIC_URL}/wp-content/uploads/publications/bedrijvenmonitor-topvrouwen-2017.pdf`,
      baseSize: { cols: 2, rows: 2 }, // TINY
      basePosition: { col: 12, row: 1 }
    },
    {
      image: `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/Gelijke-Kansen-kaft.png`,
      pdf: `${process.env.PUBLIC_URL}/wp-content/uploads/publications/werken-aan-gelijke-kansen-en-non-discriminatie.pdf`,
      baseSize: { cols: 6, rows: 6 }, // HUGE
      basePosition: { col: 7, row: 4 }
    },
    {
      image: `${process.env.PUBLIC_URL}/wp-content/uploads/2021/11/Screenshot-2021-11-16-183809.png`,
      pdf: `${process.env.PUBLIC_URL}/wp-content/uploads/publications/werkende-vaders-strategieën-voor-vaders-die-werk-en-zorg-willen-combineren.pdf`,
      baseSize: { cols: 2, rows: 3 }, // Small
      basePosition: { col: 10, row: 3 }
    }
  ];

  const image0Ref = useScrollAnimation('fade', 'top', 0, '0');
  const image1Ref = useScrollAnimation('slide', 'bottom', 0, '0');
  const image2Ref = useScrollAnimation('fade', 'right', 0, '0');
  const image3Ref = useScrollAnimation('fade', 'right', 0, '0');
  const image4Ref = useScrollAnimation('fade', 'top', 0, '0');
  const image5Ref = useScrollAnimation('fade', 'top', 0, '0');

  const refs = [image0Ref, image1Ref, image2Ref, image3Ref, image4Ref, image5Ref];

  // Initialize positions
  useEffect(() => {
    const initialPositions = publications.map((pub) => ({
      size: { ...pub.baseSize },
      position: { ...pub.basePosition }
    }));
    setCardPositions(initialPositions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="et_pb_section publications-gallery-section">
      <div className="et_pb_row publications-gallery-row">
        {publications.map((publication, index) => {
          const position = cardPositions[index] || {
            size: publication.baseSize,
            position: publication.basePosition
          };
          
          // Calculate gentle nudge for other cards when one is hovered
          const isHovered = hoveredIndex === index;
          const shouldNudge = hoveredIndex !== null && hoveredIndex !== index;
          const hoveredCard = hoveredIndex !== null ? cardPositions[hoveredIndex] : null;
          
          let nudgeX = 0;
          let nudgeY = 0;
          
          if (shouldNudge && hoveredCard) {
            // Check if this card is near the hovered card
            const thisEndCol = position.position.col + position.size.cols;
            const thisEndRow = position.position.row + position.size.rows;
            const hoveredEndCol = hoveredCard.position.col + hoveredCard.size.cols;
            const hoveredEndRow = hoveredCard.position.row + hoveredCard.size.rows;
            
            // Gentle nudge away from hovered card
            if (position.position.col < hoveredEndCol && thisEndCol > hoveredCard.position.col) {
              // Overlap horizontally - nudge right
              nudgeX = 8;
            }
            if (position.position.row < hoveredEndRow && thisEndRow > hoveredCard.position.row) {
              // Overlap vertically - nudge down
              nudgeY = 8;
            }
          }
          
          // Build transform string based on hover state
          let transformValue = '';
          if (isHovered) {
            // Hovered card: only hover transform, no nudge
            transformValue = 'translateY(-4px) scale(1.03)';
          } else if (shouldNudge) {
            // Other cards: only nudge transform
            transformValue = `translate(${nudgeX}px, ${nudgeY}px)`;
          }
          // If neither hovered nor nudged, transform is empty (no transform)
          
          return (
            <div 
              key={index}
              ref={refs[index]} 
              className={`et_pb_image publication-image publication-image-${index} ${isHovered ? 'is-hovered' : ''}`}
              style={{
                gridColumn: `${position.position.col} / span ${position.size.cols}`,
                gridRow: `${position.position.row} / span ${position.size.rows}`,
                ...(transformValue && { transform: transformValue }),
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: isHovered ? 10 : 'auto',
                opacity: 1,
                visibility: 'visible'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <a href={publication.pdf} target="_blank" rel="noopener noreferrer">
                <span className="et_pb_image_wrap">
                  <img 
                    src={publication.image} 
                    alt={`Publication ${index + 1}`}
                  />
                </span>
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PublicationsGallery;
