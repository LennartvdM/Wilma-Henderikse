import React, { useState, useMemo, useCallback } from 'react';
import { useScrollAnimation } from '../utils/animations';
import './PublicationsGallery.css';

function PublicationsGallery() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const publications = [
    {
      image: `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/Scherven-Brengen-Geluk-2.png`,
      pdf: `${process.env.PUBLIC_URL}/wp-content/uploads/publications/scherven-brengen-geluk.pdf`,
      size: { cols: 6, rows: 6 } // HUGE
    },
    {
      image: `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/Sleutels_tot_succes_VDH-1.png`,
      pdf: `${process.env.PUBLIC_URL}/wp-content/uploads/publications/sleutels_tot_succes_vdh.pdf`,
      size: { cols: 3, rows: 3 } // Medium
    },
    {
      image: `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/Rijkmetleeftijd-2.png`,
      pdf: `${process.env.PUBLIC_URL}/wp-content/uploads/publications/rijk-met-leeftijd-aan-de-slag-met-leeftijdsbewust-beleid-bij-de-rijksoverheid.pdf`,
      size: { cols: 2, rows: 2 } // TINY
    },
    {
      image: `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/Bedrijven-Monitor.png`,
      pdf: `${process.env.PUBLIC_URL}/wp-content/uploads/publications/bedrijvenmonitor-topvrouwen-2017.pdf`,
      size: { cols: 2, rows: 2 } // TINY
    },
    {
      image: `${process.env.PUBLIC_URL}/wp-content/uploads/2018/10/Gelijke-Kansen-kaft.png`,
      pdf: `${process.env.PUBLIC_URL}/wp-content/uploads/publications/werken-aan-gelijke-kansen-en-non-discriminatie.pdf`,
      size: { cols: 6, rows: 6 } // HUGE
    },
    {
      image: `${process.env.PUBLIC_URL}/wp-content/uploads/2021/11/Screenshot-2021-11-16-183809.png`,
      pdf: `${process.env.PUBLIC_URL}/wp-content/uploads/publications/werkende-vaders-strategieën-voor-vaders-die-werk-en-zorg-willen-combineren.pdf`,
      size: { cols: 2, rows: 3 } // Small
    }
  ];

  const image0Ref = useScrollAnimation('fade', 'top', 0, '0');
  const image1Ref = useScrollAnimation('slide', 'bottom', 0, '0');
  const image2Ref = useScrollAnimation('fade', 'right', 0, '0');
  const image3Ref = useScrollAnimation('fade', 'right', 0, '0');
  const image4Ref = useScrollAnimation('fade', 'top', 0, '0');
  const image5Ref = useScrollAnimation('fade', 'top', 0, '0');

  const refs = [image0Ref, image1Ref, image2Ref, image3Ref, image4Ref, image5Ref];

  // Grid dimensions
  const GRID_COLS = 16;
  const GRID_ROWS = 20; // Enough rows for the layout

  // Helper function to check if two rectangles overlap
  const doRectsOverlap = useCallback((rect1, rect2) => {
    return !(
      rect1.right <= rect2.left ||
      rect1.left >= rect2.right ||
      rect1.bottom <= rect2.top ||
      rect1.top >= rect2.bottom
    );
  }, []);

  // Helper to check if a position is valid (no overlaps, within bounds)
  const isValidPosition = useCallback((position, size, placedCards) => {
    // Check bounds
    if (position.col < 1 || position.col + size.cols - 1 > GRID_COLS) return false;
    if (position.row < 1 || position.row + size.rows - 1 > GRID_ROWS) return false;

    // Check overlaps with already placed cards
    const newBounds = {
      left: position.col,
      right: position.col + size.cols,
      top: position.row,
      bottom: position.row + size.rows
    };

    for (const placedCard of placedCards) {
      const placedBounds = {
        left: placedCard.position.col,
        right: placedCard.position.col + placedCard.size.cols,
        top: placedCard.position.row,
        bottom: placedCard.position.row + placedCard.size.rows
      };

      if (doRectsOverlap(newBounds, placedBounds)) {
        return false;
      }
    }

    return true;
  }, [GRID_COLS, GRID_ROWS, doRectsOverlap]);

  // Spiral placement algorithm: clockwise (left->top->right->bottom)
  const placeCardsInSpiral = useCallback((cards) => {
    const placedCards = [];
    
    if (cards.length === 0) return placedCards;

    // Start with first card at center-left position
    const startCol = Math.max(1, Math.floor(GRID_COLS / 4));
    const startRow = Math.max(1, Math.floor(GRID_ROWS / 3));
    
    placedCards.push({
      ...cards[0],
      position: { col: startCol, row: startRow }
    });

    // For each subsequent card, try placing it in a spiral pattern around the last placed card
    for (let i = 1; i < cards.length; i++) {
      const card = cards[i];
      const lastCard = placedCards[placedCards.length - 1];
      
      // Spiral pattern: try positions in clockwise order (left, top, right, bottom)
      // at increasing distances
      let placed = false;
      
      for (let radius = 1; radius <= Math.max(GRID_COLS, GRID_ROWS) && !placed; radius++) {
        // Try positions in clockwise spiral: left, top, right, bottom
        const spiralPositions = [
          // Left side
          { col: lastCard.position.col - card.size.cols - radius, row: lastCard.position.row },
          { col: lastCard.position.col - card.size.cols - radius, row: lastCard.position.row - radius },
          { col: lastCard.position.col - card.size.cols - radius, row: lastCard.position.row + radius },
          // Top side
          { col: lastCard.position.col, row: lastCard.position.row - card.size.rows - radius },
          { col: lastCard.position.col - radius, row: lastCard.position.row - card.size.rows - radius },
          { col: lastCard.position.col + radius, row: lastCard.position.row - card.size.rows - radius },
          // Right side
          { col: lastCard.position.col + lastCard.size.cols + radius, row: lastCard.position.row },
          { col: lastCard.position.col + lastCard.size.cols + radius, row: lastCard.position.row - radius },
          { col: lastCard.position.col + lastCard.size.cols + radius, row: lastCard.position.row + radius },
          // Bottom side
          { col: lastCard.position.col, row: lastCard.position.row + lastCard.size.rows + radius },
          { col: lastCard.position.col - radius, row: lastCard.position.row + lastCard.size.rows + radius },
          { col: lastCard.position.col + radius, row: lastCard.position.row + lastCard.size.rows + radius }
        ];
        
        // Try each position in the spiral
        for (const testPos of spiralPositions) {
          if (isValidPosition(testPos, card.size, placedCards)) {
            placedCards.push({
              ...card,
              position: testPos
            });
            placed = true;
            break;
          }
        }
      }
      
      // Fallback: exhaustive search if spiral didn't work
      if (!placed) {
        for (let row = 1; row <= GRID_ROWS - card.size.rows + 1 && !placed; row++) {
          for (let col = 1; col <= GRID_COLS - card.size.cols + 1 && !placed; col++) {
            const testPos = { col, row };
            if (isValidPosition(testPos, card.size, placedCards)) {
              placedCards.push({
                ...card,
                position: testPos
              });
              placed = true;
            }
          }
        }
      }
    }

    return placedCards;
  }, [GRID_COLS, GRID_ROWS, isValidPosition]); // Dependencies: grid dimensions and validation function

  // Calculate card positions using spiral algorithm
  const cardPositions = useMemo(() => {
    return placeCardsInSpiral(publications);
  }, [placeCardsInSpiral, publications]);

  // Helper function to get card bounding box (in grid units, accounting for nudge)
  const getCardBounds = (position, size, nudgeX = 0, nudgeY = 0) => {
    const maxWidth = 1400;
    const numColumns = 16;
    const gap = 6;
    const columnWidth = (maxWidth - (gap * (numColumns - 1))) / numColumns;
    const rowHeight = 60;
    
    const gridX = nudgeX / columnWidth;
    const gridY = nudgeY / rowHeight;
    
    return {
      left: position.col + gridX,
      right: position.col + size.cols + gridX,
      top: position.row + gridY,
      bottom: position.row + size.rows + gridY
    };
  };

  // Calculate optimal nudge direction for a card relative to hovered card
  const calculateNudgeDirection = (cardPos, cardSize, hoveredPos, hoveredSize) => {
    const cardCenterX = cardPos.col + cardSize.cols / 2;
    const cardCenterY = cardPos.row + cardSize.rows / 2;
    const hoveredCenterX = hoveredPos.col + hoveredSize.cols / 2;
    const hoveredCenterY = hoveredPos.row + hoveredSize.rows / 2;

    const deltaX = cardCenterX - hoveredCenterX;
    const deltaY = cardCenterY - hoveredCenterY;

    let nudgeX = 0;
    let nudgeY = 0;
    const nudgeAmount = 8;

    // Check for horizontal overlap
    const cardEndCol = cardPos.col + cardSize.cols;
    const hoveredEndCol = hoveredPos.col + hoveredSize.cols;
    const horizontalOverlap = cardPos.col < hoveredEndCol && cardEndCol > hoveredPos.col;

    // Check for vertical overlap
    const cardEndRow = cardPos.row + cardSize.rows;
    const hoveredEndRow = hoveredPos.row + hoveredSize.rows;
    const verticalOverlap = cardPos.row < hoveredEndRow && cardEndRow > hoveredPos.row;

    if (horizontalOverlap && verticalOverlap) {
      nudgeX = deltaX > 0 ? nudgeAmount : -nudgeAmount;
      nudgeY = deltaY > 0 ? nudgeAmount : -nudgeAmount;
    } else if (horizontalOverlap) {
      nudgeX = deltaX > 0 ? nudgeAmount : -nudgeAmount;
    } else if (verticalOverlap) {
      nudgeY = deltaY > 0 ? nudgeAmount : -nudgeAmount;
    }

    return { nudgeX, nudgeY };
  };

  // Calculate all nudges with collision detection
  const calculateNudges = (hoveredIndex) => {
    if (hoveredIndex === null) return {};

    const hoveredCard = cardPositions[hoveredIndex];
    if (!hoveredCard) return {};

    const nudges = {};

    // First pass: calculate initial nudges
    cardPositions.forEach((card, index) => {
      if (index === hoveredIndex) return;

      const nudge = calculateNudgeDirection(
        card.position,
        card.size,
        hoveredCard.position,
        hoveredCard.size
      );

      if (nudge.nudgeX !== 0 || nudge.nudgeY !== 0) {
        nudges[index] = nudge;
      }
    });

    // Second pass: resolve collisions
    const nudgeKeys = Object.keys(nudges).map(Number);
    for (let i = 0; i < nudgeKeys.length; i++) {
      for (let j = i + 1; j < nudgeKeys.length; j++) {
        const index1 = nudgeKeys[i];
        const index2 = nudgeKeys[j];

        const card1 = cardPositions[index1];
        const card2 = cardPositions[index2];

        const nudge1 = nudges[index1];
        const nudge2 = nudges[index2];

        const bounds1 = getCardBounds(card1.position, card1.size, nudge1.nudgeX, nudge1.nudgeY);
        const bounds2 = getCardBounds(card2.position, card2.size, nudge2.nudgeX, nudge2.nudgeY);

        if (doRectsOverlap(bounds1, bounds2)) {
          const dist1 = Math.abs(card1.position.col - hoveredCard.position.col) + 
                       Math.abs(card1.position.row - hoveredCard.position.row);
          const dist2 = Math.abs(card2.position.col - hoveredCard.position.col) + 
                       Math.abs(card2.position.row - hoveredCard.position.row);

          const overlapX = Math.min(bounds1.right, bounds2.right) - Math.max(bounds1.left, bounds2.left);
          const overlapY = Math.min(bounds1.bottom, bounds2.bottom) - Math.max(bounds1.top, bounds2.top);

          const reductionFactor = 0.6;
          if (dist1 > dist2) {
            nudges[index1].nudgeX *= reductionFactor;
            nudges[index1].nudgeY *= reductionFactor;
          } else if (dist2 > dist1) {
            nudges[index2].nudgeX *= reductionFactor;
            nudges[index2].nudgeY *= reductionFactor;
          } else {
            nudges[index1].nudgeX *= reductionFactor;
            nudges[index1].nudgeY *= reductionFactor;
            nudges[index2].nudgeX *= reductionFactor;
            nudges[index2].nudgeY *= reductionFactor;
          }

          const newBounds1 = getCardBounds(card1.position, card1.size, nudges[index1].nudgeX, nudges[index1].nudgeY);
          const newBounds2 = getCardBounds(card2.position, card2.size, nudges[index2].nudgeX, nudges[index2].nudgeY);

          if (doRectsOverlap(newBounds1, newBounds2)) {
            if (overlapX > overlapY) {
              if (dist1 >= dist2) nudges[index1].nudgeX = 0;
              if (dist2 >= dist1) nudges[index2].nudgeX = 0;
            } else {
              if (dist1 >= dist2) nudges[index1].nudgeY = 0;
              if (dist2 >= dist1) nudges[index2].nudgeY = 0;
            }
          }
        }
      }
    }

    return nudges;
  };

  // Calculate all nudges when hoveredIndex changes
  const nudges = hoveredIndex !== null ? calculateNudges(hoveredIndex) : {};

  return (
    <section className="et_pb_section publications-gallery-section">
      <div className="et_pb_row publications-gallery-row">
        {cardPositions.map((card, index) => {
          const isHovered = hoveredIndex === index;
          const cardNudge = nudges[index] || { nudgeX: 0, nudgeY: 0 };
          const nudgeX = cardNudge.nudgeX;
          const nudgeY = cardNudge.nudgeY;
          const shouldNudge = nudgeX !== 0 || nudgeY !== 0;
          
          let transformValue = '';
          if (isHovered) {
            transformValue = 'translateY(-4px) scale(1.03)';
          } else if (shouldNudge) {
            transformValue = `translate(${nudgeX}px, ${nudgeY}px)`;
          }
          
          return (
            <div 
              key={index}
              ref={refs[index]} 
              className={`et_pb_image publication-image publication-image-${index} ${isHovered ? 'is-hovered' : ''}`}
              style={{
                gridColumn: `${card.position.col} / span ${card.size.cols}`,
                gridRow: `${card.position.row} / span ${card.size.rows}`,
                ...(transformValue && { transform: transformValue }),
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: isHovered ? 10 : 'auto',
                opacity: 1,
                visibility: 'visible'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <a href={card.pdf} target="_blank" rel="noopener noreferrer">
                <span className="et_pb_image_wrap">
                  <img 
                    src={card.image} 
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
