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

  // Check if two grid areas overlap
  const checkOverlap = (pos1, size1, pos2, size2) => {
    const end1Col = pos1.col + size1.cols;
    const end1Row = pos1.row + size1.rows;
    const end2Col = pos2.col + size2.cols;
    const end2Row = pos2.row + size2.rows;

    return !(
      end1Col <= pos2.col ||
      pos1.col >= end2Col ||
      end1Row <= pos2.row ||
      pos1.row >= end2Row
    );
  };

  // Initialize positions
  useEffect(() => {
    const initialPositions = publications.map((pub) => ({
      size: { ...pub.baseSize },
      position: { ...pub.basePosition }
    }));
    setCardPositions(initialPositions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recalculate positions when a card is hovered
  useEffect(() => {
    if (hoveredIndex === null) {
      // Reset to base positions
      const basePositions = publications.map((pub) => ({
        size: { ...pub.baseSize },
        position: { ...pub.basePosition }
      }));
      setCardPositions(basePositions);
      return;
    }

    setCardPositions((prevPositions) => {
      // Get current positions or initialize from base
      const currentPositions = prevPositions.length > 0 
        ? prevPositions.map(pos => ({ ...pos, size: { ...pos.size }, position: { ...pos.position } }))
        : publications.map((pub) => ({
            size: { ...pub.baseSize },
            position: { ...pub.basePosition }
          }));
      
      const newPositions = currentPositions.map(pos => ({
        size: { ...pos.size },
        position: { ...pos.position }
      }));
      
      if (newPositions.length === 0) return prevPositions;
      
      const hoveredCard = newPositions[hoveredIndex];
      const basePub = publications[hoveredIndex];
      
      // Grow the hovered card
      hoveredCard.size = {
        cols: Math.min(basePub.baseSize.cols + 1, 7),
        rows: Math.min(basePub.baseSize.rows + 1, 7)
      };

      // Adjust other cards to avoid overlap
      for (let i = 0; i < newPositions.length; i++) {
        if (i === hoveredIndex) continue;

        const currentCard = newPositions[i];
        let hasOverlap = checkOverlap(
          hoveredCard.position,
          hoveredCard.size,
          currentCard.position,
          currentCard.size
        );

        if (hasOverlap) {
          // Try moving the card to the right first
          const newPositionRight = {
            col: hoveredCard.position.col + hoveredCard.size.cols,
            row: currentCard.position.row
          };
          
          // Check if new position is valid (within grid bounds and no overlap with others)
          let isValidRight = newPositionRight.col + currentCard.size.cols <= 17; // 16 columns + 1
          if (isValidRight) {
            let hasConflict = false;
            for (let j = 0; j < newPositions.length; j++) {
              if (j === i || j === hoveredIndex) continue;
              if (checkOverlap(newPositionRight, currentCard.size, newPositions[j].position, newPositions[j].size)) {
                hasConflict = true;
                break;
              }
            }
            if (!hasConflict) {
              currentCard.position = newPositionRight;
              continue;
            }
          }

          // Try moving down
          const newPositionDown = {
            col: currentCard.position.col,
            row: hoveredCard.position.row + hoveredCard.size.rows
          };
          
          let isValidDown = true; // No row limit for now
          if (isValidDown) {
            let hasConflict = false;
            for (let j = 0; j < newPositions.length; j++) {
              if (j === i || j === hoveredIndex) continue;
              if (checkOverlap(newPositionDown, currentCard.size, newPositions[j].position, newPositions[j].size)) {
                hasConflict = true;
                break;
              }
            }
            if (!hasConflict) {
              currentCard.position = newPositionDown;
            }
          }
        }
      }

      return newPositions;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredIndex]);

  return (
    <section className="et_pb_section publications-gallery-section">
      <div className="et_pb_row publications-gallery-row">
        {publications.map((publication, index) => {
          const position = cardPositions[index] || {
            size: publication.baseSize,
            position: publication.basePosition
          };
          
          return (
            <div 
              key={index}
              ref={refs[index]} 
              className={`et_pb_image publication-image publication-image-${index} ${hoveredIndex === index ? 'is-hovered' : ''}`}
              style={{
                gridColumn: `${position.position.col} / span ${position.size.cols}`,
                gridRow: `${position.position.row} / span ${position.size.rows}`,
                transition: 'all 0.3s ease'
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
