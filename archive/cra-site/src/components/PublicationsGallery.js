import React, { useState, useMemo, useCallback } from 'react';
import { useScrollAnimation } from '../utils/animations';
import './PublicationsGallery.css';

// Publications array moved outside component to ensure stable reference
const PUBLICATIONS = [
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

function PublicationsGallery() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

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

  // Calculate position score: higher = better (considers center preference, size, and clustering)
  const scorePosition = useCallback((position, size, placedCards, cardArea, centerOffset = { col: 0, row: 0 }) => {
    // Add small random offset to center to create variation
    const centerCol = GRID_COLS / 2 + centerOffset.col;
    const centerRow = GRID_ROWS / 2 + centerOffset.row;
    
    // Card center position
    const cardCenterCol = position.col + size.cols / 2;
    const cardCenterRow = position.row + size.rows / 2;
    
    // Distance from grid center (weighted by card size - larger cards prefer center more)
    const distFromCenter = Math.sqrt(
      Math.pow(cardCenterCol - centerCol, 2) + 
      Math.pow(cardCenterRow - centerRow, 2)
    );
    const centerScore = 100 / (1 + distFromCenter * (1 + cardArea / 10)); // Size-weighted center preference
    
    // Proximity to existing cards (clustering/density)
    let proximityScore = 0;
    if (placedCards.length > 0) {
      let minDistance = Infinity;
      for (const placedCard of placedCards) {
        const placedCenterCol = placedCard.position.col + placedCard.size.cols / 2;
        const placedCenterRow = placedCard.position.row + placedCard.size.rows / 2;
        const distance = Math.sqrt(
          Math.pow(cardCenterCol - placedCenterCol, 2) + 
          Math.pow(cardCenterRow - placedCenterRow, 2)
        );
        minDistance = Math.min(minDistance, distance);
      }
      // Closer to existing cards = better (but not too close to avoid overlaps)
      proximityScore = minDistance < 10 ? 50 / (1 + minDistance) : 0;
    }
    
    // Adjacency bonus (snug placement)
    let adjacencyBonus = 0;
    let largeCardVerticalPenalty = 0;
    let largeCardHorizontalBonus = 0;
    
    // Define threshold for "large" cards (e.g., area >= 20)
    const LARGE_CARD_THRESHOLD = 20;
    const isLargeCard = cardArea >= LARGE_CARD_THRESHOLD;
    
    for (const placedCard of placedCards) {
      const placedCardArea = placedCard.size.cols * placedCard.size.rows;
      const isPlacedCardLarge = placedCardArea >= LARGE_CARD_THRESHOLD;
      
      // Check if directly adjacent (no gap)
      // Horizontal adjacency: touching horizontally AND rows overlap
      const horizontallyAdjacent = 
        (position.col + size.cols === placedCard.position.col || 
         placedCard.position.col + placedCard.size.cols === position.col) &&
        (position.row < placedCard.position.row + placedCard.size.rows &&
         position.row + size.rows > placedCard.position.row);
      
      // Vertical adjacency: touching vertically AND cols overlap
      const verticallyAdjacent = 
        (position.row + size.rows === placedCard.position.row ||
         placedCard.position.row + placedCard.size.rows === position.row) &&
        (position.col < placedCard.position.col + placedCard.size.cols &&
         position.col + size.cols > placedCard.position.col);
      
      const isAdjacent = horizontallyAdjacent || verticallyAdjacent;
      
      if (isAdjacent) {
        adjacencyBonus = 30;
        
        // Large card rules: penalize vertical stacking, enforce horizontal staggered arrangement
        if (isLargeCard && isPlacedCardLarge) {
          if (verticallyAdjacent) {
            // Large cards stacked vertically - apply very heavy penalty
            largeCardVerticalPenalty = -200;
          } else if (horizontallyAdjacent) {
            // Large cards arranged horizontally - check for staggered alignment
            const cardCenterRow = position.row + size.rows / 2;
            const cardTop = position.row;
            const cardBottom = position.row + size.rows;
            const placedCardTop = placedCard.position.row;
            const placedCardBottom = placedCard.position.row + placedCard.size.rows;
            const placedCardCenterRow = placedCard.position.row + placedCard.size.rows / 2;
            
            // Check if this card's center aligns with placed card's top or bottom edge (within 0.5 grid cells)
            const centerAlignsWithTop = Math.abs(cardCenterRow - placedCardTop) < 0.5;
            const centerAlignsWithBottom = Math.abs(cardCenterRow - placedCardBottom) < 0.5;
            
            // Check if placed card's center aligns with this card's top or bottom edge
            const placedCenterAlignsWithTop = Math.abs(placedCardCenterRow - cardTop) < 0.5;
            const placedCenterAlignsWithBottom = Math.abs(placedCardCenterRow - cardBottom) < 0.5;
            
            const isStaggered = centerAlignsWithTop || centerAlignsWithBottom || placedCenterAlignsWithTop || placedCenterAlignsWithBottom;
            
            // Check if cards are perfectly parallel (centers aligned or top/bottom edges aligned)
            const centersAligned = Math.abs(cardCenterRow - placedCardCenterRow) < 1;
            const topsAligned = Math.abs(cardTop - placedCardTop) < 1;
            const bottomsAligned = Math.abs(cardBottom - placedCardBottom) < 1;
            const isParallel = centersAligned || (topsAligned && bottomsAligned);
            
            if (isStaggered) {
              // Staggered alignment - strong bonus (cards meet halfway)
              largeCardHorizontalBonus = 150;
            } else if (isParallel) {
              // Perfectly parallel - very heavy penalty to force staggered alignment
              largeCardHorizontalBonus = -150;
            } else {
              // Somewhat offset but not perfectly staggered - small bonus
              largeCardHorizontalBonus = 30;
            }
          }
        }
        break;
      }
    }
    
    // Also check for vertical overlap/stacking even if not directly adjacent
    if (isLargeCard) {
      for (const placedCard of placedCards) {
        const placedCardArea = placedCard.size.cols * placedCard.size.rows;
        const isPlacedCardLarge = placedCardArea >= LARGE_CARD_THRESHOLD;
        
        if (isPlacedCardLarge) {
          // Check if cards would be vertically stacked (one above/below the other)
          const verticalOverlap = 
            (position.col < placedCard.position.col + placedCard.size.cols &&
             position.col + size.cols > placedCard.position.col);
          
          const isVerticallyStacked = 
            verticalOverlap &&
            (position.row + size.rows <= placedCard.position.row ||
             placedCard.position.row + placedCard.size.rows <= position.row);
          
          if (isVerticallyStacked) {
            // Apply very heavy penalty for vertical stacking of large cards
            largeCardVerticalPenalty = Math.max(largeCardVerticalPenalty, -150);
          }
        }
      }
    }
    
    return centerScore + proximityScore + adjacencyBonus + largeCardVerticalPenalty + largeCardHorizontalBonus;
  }, [GRID_COLS, GRID_ROWS]);

  // Size-aware density-optimized placement with multi-pass optimization
  const placeCardsInSpiral = useCallback((cards) => {
    if (cards.length === 0) return [];
    
    // Sort cards by size (area) - largest first to prioritize center placement
    const sortedCards = [...cards].sort((a, b) => {
      const areaA = a.size.cols * a.size.rows;
      const areaB = b.size.cols * b.size.rows;
      return areaB - areaA; // Largest first
    });
    
    let placedCards = [];
    
    // Add random offset to center for variation (between -2 and +2 grid cells)
    const centerOffsetCol = (Math.random() - 0.5) * 4;
    const centerOffsetRow = (Math.random() - 0.5) * 4;
    const centerOffset = { col: centerOffsetCol, row: centerOffsetRow };
    
    // Place first (largest) card near center (with offset)
    const centerCol = Math.floor(GRID_COLS / 2) + Math.round(centerOffsetCol);
    const centerRow = Math.floor(GRID_ROWS / 2) + Math.round(centerOffsetRow);
    const firstCard = sortedCards[0];
    const startCol = Math.max(1, centerCol - Math.floor(firstCard.size.cols / 2));
    const startRow = Math.max(1, centerRow - Math.floor(firstCard.size.rows / 2));
    
    placedCards.push({
      ...firstCard,
      position: { col: startCol, row: startRow }
    });
    
    // Place remaining cards with scoring system
    const LARGE_CARD_THRESHOLD_PLACE = 20;
    
    for (let i = 1; i < sortedCards.length; i++) {
      const card = sortedCards[i];
      const cardArea = card.size.cols * card.size.rows;
      const isLargeCard = cardArea >= LARGE_CARD_THRESHOLD_PLACE;
      let bestPosition = null;
      let bestScore = -Infinity;
      
      // Collect all candidate positions: adjacent to all placed cards
      const candidates = [];
      
      for (const placedCard of placedCards) {
        const placedCardArea = placedCard.size.cols * placedCard.size.rows;
        const isPlacedCardLarge = placedCardArea >= LARGE_CARD_THRESHOLD_PLACE;
        
        // If both cards are large, ONLY allow staggered horizontal positions (exclusive rule)
        if (isLargeCard && isPlacedCardLarge) {
          // For large cards, ONLY generate staggered horizontal positions
          const placedCardTop = placedCard.position.row;
          const placedCardBottom = placedCard.position.row + placedCard.size.rows;
          
          // Left side - ONLY staggered positions (center aligns with edge)
          candidates.push(
            { col: placedCard.position.col - card.size.cols, row: placedCardTop - Math.floor(card.size.rows / 2) },
            { col: placedCard.position.col - card.size.cols, row: placedCardBottom - Math.floor(card.size.rows / 2) }
          );
          
          // Right side - ONLY staggered positions (center aligns with edge)
          candidates.push(
            { col: placedCard.position.col + placedCard.size.cols, row: placedCardTop - Math.floor(card.size.rows / 2) },
            { col: placedCard.position.col + placedCard.size.cols, row: placedCardBottom - Math.floor(card.size.rows / 2) }
          );
          // Do NOT add parallel positions for large cards
        } else {
          // For non-large cards or mixed pairs, allow all adjacent positions
          candidates.push(
            { col: placedCard.position.col - card.size.cols, row: placedCard.position.row },
            { col: placedCard.position.col, row: placedCard.position.row - card.size.rows },
            { col: placedCard.position.col + placedCard.size.cols, row: placedCard.position.row },
            { col: placedCard.position.col, row: placedCard.position.row + placedCard.size.rows }
          );
        }
      }
      
      // Score all valid candidate positions
      for (const candidate of candidates) {
        if (isValidPosition(candidate, card.size, placedCards)) {
          // For large cards, check if this position would create parallel alignment with other large cards
          let isValidForLargeCard = true;
          if (isLargeCard) {
            for (const placedCard of placedCards) {
              const placedCardArea = placedCard.size.cols * placedCard.size.rows;
              const isPlacedCardLarge = placedCardArea >= LARGE_CARD_THRESHOLD_PLACE;
              
              if (isPlacedCardLarge) {
                // Check if horizontally adjacent
                const candidateEndCol = candidate.col + card.size.cols;
                const placedEndCol = placedCard.position.col + placedCard.size.cols;
                const horizontallyAdjacent = 
                  (candidateEndCol === placedCard.position.col || placedEndCol === candidate.col) &&
                  (candidate.row < placedCard.position.row + placedCard.size.rows &&
                   candidate.row + card.size.rows > placedCard.position.row);
                
                if (horizontallyAdjacent) {
                  // Check if parallel (not staggered)
                  const candidateCenterRow = candidate.row + card.size.rows / 2;
                  const placedCenterRow = placedCard.position.row + placedCard.size.rows / 2;
                  const candidateTop = candidate.row;
                  const candidateBottom = candidate.row + card.size.rows;
                  const placedTop = placedCard.position.row;
                  const placedBottom = placedCard.position.row + placedCard.size.rows;
                  
                  const isStaggered = 
                    Math.abs(candidateCenterRow - placedTop) < 0.5 ||
                    Math.abs(candidateCenterRow - placedBottom) < 0.5 ||
                    Math.abs(placedCenterRow - candidateTop) < 0.5 ||
                    Math.abs(placedCenterRow - candidateBottom) < 0.5;
                  
                  const isParallel = Math.abs(candidateCenterRow - placedCenterRow) < 1 ||
                    (Math.abs(candidateTop - placedTop) < 1 && Math.abs(candidateBottom - placedBottom) < 1);
                  
                  // Reject parallel alignment - only allow staggered
                  if (isParallel && !isStaggered) {
                    isValidForLargeCard = false;
                    break;
                  }
                }
              }
            }
          }
          
          if (isValidForLargeCard) {
            const score = scorePosition(candidate, card.size, placedCards, cardArea, centerOffset);
            // Add small random factor (0-5%) to break ties and create variation
            const randomFactor = 1 + (Math.random() - 0.5) * 0.1;
            const adjustedScore = score * randomFactor;
            if (adjustedScore > bestScore) {
              bestScore = adjustedScore;
              bestPosition = candidate;
            }
          }
        }
      }
      
      // If no adjacent position found, search nearby positions
      if (!bestPosition) {
        for (const placedCard of placedCards) {
          const placedCardArea = placedCard.size.cols * placedCard.size.rows;
          const isPlacedCardLarge = placedCardArea >= LARGE_CARD_THRESHOLD_PLACE;
          
          for (let offset = 1; offset <= 3; offset++) {
            let nearbyCandidates = [];
            
            // If both are large, only consider staggered horizontal positions
            if (isLargeCard && isPlacedCardLarge) {
              const placedTop = placedCard.position.row;
              const placedBottom = placedCard.position.row + placedCard.size.rows;
              nearbyCandidates = [
                { col: placedCard.position.col - card.size.cols - offset, row: placedTop - Math.floor(card.size.rows / 2) },
                { col: placedCard.position.col - card.size.cols - offset, row: placedBottom - Math.floor(card.size.rows / 2) },
                { col: placedCard.position.col + placedCard.size.cols + offset, row: placedTop - Math.floor(card.size.rows / 2) },
                { col: placedCard.position.col + placedCard.size.cols + offset, row: placedBottom - Math.floor(card.size.rows / 2) }
              ];
            } else {
              nearbyCandidates = [
                { col: placedCard.position.col - card.size.cols - offset, row: placedCard.position.row },
                { col: placedCard.position.col, row: placedCard.position.row - card.size.rows - offset },
                { col: placedCard.position.col + placedCard.size.cols + offset, row: placedCard.position.row },
                { col: placedCard.position.col, row: placedCard.position.row + placedCard.size.rows + offset }
              ];
            }
            
            for (const candidate of nearbyCandidates) {
              if (isValidPosition(candidate, card.size, placedCards)) {
                // Validate staggered alignment for large cards
                let isValidForLargeCard = true;
                if (isLargeCard) {
                  for (const checkCard of placedCards) {
                    const checkCardArea = checkCard.size.cols * checkCard.size.rows;
                    const isCheckCardLarge = checkCardArea >= LARGE_CARD_THRESHOLD_PLACE;
                    
                    if (isCheckCardLarge) {
                      const candidateEndCol = candidate.col + card.size.cols;
                      const checkEndCol = checkCard.position.col + checkCard.size.cols;
                      const horizontallyAdjacent = 
                        (candidateEndCol === checkCard.position.col || checkEndCol === candidate.col) &&
                        (candidate.row < checkCard.position.row + checkCard.size.rows &&
                         candidate.row + card.size.rows > checkCard.position.row);
                      
                      if (horizontallyAdjacent) {
                        const candidateCenterRow = candidate.row + card.size.rows / 2;
                        const checkCenterRow = checkCard.position.row + checkCard.size.rows / 2;
                        const candidateTop = candidate.row;
                        const candidateBottom = candidate.row + card.size.rows;
                        const checkTop = checkCard.position.row;
                        const checkBottom = checkCard.position.row + checkCard.size.rows;
                        
                        const isStaggered = 
                          Math.abs(candidateCenterRow - checkTop) < 0.5 ||
                          Math.abs(candidateCenterRow - checkBottom) < 0.5 ||
                          Math.abs(checkCenterRow - candidateTop) < 0.5 ||
                          Math.abs(checkCenterRow - candidateBottom) < 0.5;
                        
                        const isParallel = Math.abs(candidateCenterRow - checkCenterRow) < 1 ||
                          (Math.abs(candidateTop - checkTop) < 1 && Math.abs(candidateBottom - checkBottom) < 1);
                        
                        if (isParallel && !isStaggered) {
                          isValidForLargeCard = false;
                          break;
                        }
                      }
                    }
                  }
                }
                
                if (isValidForLargeCard) {
                  const score = scorePosition(candidate, card.size, placedCards, cardArea, centerOffset);
                  // Add small random factor to break ties
                  const randomFactor = 1 + (Math.random() - 0.5) * 0.1;
                  const adjustedScore = score * randomFactor;
                  if (adjustedScore > bestScore) {
                    bestScore = adjustedScore;
                    bestPosition = candidate;
                  }
                }
              }
            }
          }
        }
      }
      
      // Fallback: exhaustive search with scoring
      if (!bestPosition) {
        for (let row = 1; row <= GRID_ROWS - card.size.rows + 1; row++) {
          for (let col = 1; col <= GRID_COLS - card.size.cols + 1; col++) {
            const candidate = { col, row };
            if (isValidPosition(candidate, card.size, placedCards)) {
              // For large cards, validate staggered alignment with other large cards
              let isValidForLargeCard = true;
              if (isLargeCard) {
                for (const checkCard of placedCards) {
                  const checkCardArea = checkCard.size.cols * checkCard.size.rows;
                  const isCheckCardLarge = checkCardArea >= LARGE_CARD_THRESHOLD_PLACE;
                  
                  if (isCheckCardLarge) {
                    const candidateEndCol = candidate.col + card.size.cols;
                    const checkEndCol = checkCard.position.col + checkCard.size.cols;
                    const horizontallyAdjacent = 
                      (candidateEndCol === checkCard.position.col || checkEndCol === candidate.col) &&
                      (candidate.row < checkCard.position.row + checkCard.size.rows &&
                       candidate.row + card.size.rows > checkCard.position.row);
                    
                    if (horizontallyAdjacent) {
                      const candidateCenterRow = candidate.row + card.size.rows / 2;
                      const checkCenterRow = checkCard.position.row + checkCard.size.rows / 2;
                      const candidateTop = candidate.row;
                      const candidateBottom = candidate.row + card.size.rows;
                      const checkTop = checkCard.position.row;
                      const checkBottom = checkCard.position.row + checkCard.size.rows;
                      
                      const isStaggered = 
                        Math.abs(candidateCenterRow - checkTop) < 0.5 ||
                        Math.abs(candidateCenterRow - checkBottom) < 0.5 ||
                        Math.abs(checkCenterRow - candidateTop) < 0.5 ||
                        Math.abs(checkCenterRow - candidateBottom) < 0.5;
                      
                      const isParallel = Math.abs(candidateCenterRow - checkCenterRow) < 1 ||
                        (Math.abs(candidateTop - checkTop) < 1 && Math.abs(candidateBottom - checkBottom) < 1);
                      
                      // Reject parallel - only allow staggered
                      if (isParallel && !isStaggered) {
                        isValidForLargeCard = false;
                        break;
                      }
                    }
                  }
                }
              }
              
              if (isValidForLargeCard) {
                const score = scorePosition(candidate, card.size, placedCards, cardArea, centerOffset);
                // Add small random factor to break ties
                const randomFactor = 1 + (Math.random() - 0.5) * 0.1;
                const adjustedScore = score * randomFactor;
                if (adjustedScore > bestScore) {
                  bestScore = adjustedScore;
                  bestPosition = candidate;
                }
              }
            }
          }
        }
      }
      
      if (bestPosition) {
        placedCards.push({
          ...card,
          position: bestPosition
        });
      }
    }
    
    // Multi-pass optimization: try to improve density by repositioning cards
    const MAX_OPTIMIZATION_PASSES = 2;
    for (let pass = 0; pass < MAX_OPTIMIZATION_PASSES; pass++) {
      let improved = false;
      
      // Randomize order of cards to process for variation
      const cardIndices = Array.from({ length: placedCards.length - 1 }, (_, i) => i + 1);
      for (let j = cardIndices.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [cardIndices[j], cardIndices[k]] = [cardIndices[k], cardIndices[j]];
      }
      
      // Try repositioning each card (except the first/largest) in random order
      for (const i of cardIndices) {
        const card = placedCards[i];
        const cardArea = card.size.cols * card.size.rows;
        const currentScore = scorePosition(card.position, card.size, placedCards.filter((_, idx) => idx !== i), cardArea, centerOffset);
        
        // Temporarily remove this card
        const otherCards = placedCards.filter((_, idx) => idx !== i);
        
        // Find better position
        let bestNewPosition = card.position;
        let bestNewScore = currentScore;
        
        // Check adjacent positions to other cards
        const isLargeCardOpt = cardArea >= 20;
        for (const otherCard of otherCards) {
          const otherCardArea = otherCard.size.cols * otherCard.size.rows;
          const isOtherCardLarge = otherCardArea >= 20;
          
          let candidates = [];
          
          // If both are large cards, ONLY consider staggered horizontal positions
          if (isLargeCardOpt && isOtherCardLarge) {
            const otherTop = otherCard.position.row;
            const otherBottom = otherCard.position.row + otherCard.size.rows;
            candidates = [
              { col: otherCard.position.col - card.size.cols, row: otherTop - Math.floor(card.size.rows / 2) },
              { col: otherCard.position.col - card.size.cols, row: otherBottom - Math.floor(card.size.rows / 2) },
              { col: otherCard.position.col + otherCard.size.cols, row: otherTop - Math.floor(card.size.rows / 2) },
              { col: otherCard.position.col + otherCard.size.cols, row: otherBottom - Math.floor(card.size.rows / 2) }
            ];
          } else {
            // For non-large or mixed pairs, allow all adjacent positions
            candidates = [
              { col: otherCard.position.col - card.size.cols, row: otherCard.position.row },
              { col: otherCard.position.col, row: otherCard.position.row - card.size.rows },
              { col: otherCard.position.col + otherCard.size.cols, row: otherCard.position.row },
              { col: otherCard.position.col, row: otherCard.position.row + otherCard.size.rows }
            ];
          }
          
          for (const candidate of candidates) {
            if (isValidPosition(candidate, card.size, otherCards)) {
              // Additional validation: for large cards, ensure staggered alignment
              let isValidForLargeCard = true;
              if (isLargeCardOpt && isOtherCardLarge) {
                const candidateEndCol = candidate.col + card.size.cols;
                const otherEndCol = otherCard.position.col + otherCard.size.cols;
                const horizontallyAdjacent = 
                  (candidateEndCol === otherCard.position.col || otherEndCol === candidate.col) &&
                  (candidate.row < otherCard.position.row + otherCard.size.rows &&
                   candidate.row + card.size.rows > otherCard.position.row);
                
                if (horizontallyAdjacent) {
                  const candidateCenterRow = candidate.row + card.size.rows / 2;
                  const otherCenterRow = otherCard.position.row + otherCard.size.rows / 2;
                  const candidateTop = candidate.row;
                  const candidateBottom = candidate.row + card.size.rows;
                  const otherTop = otherCard.position.row;
                  const otherBottom = otherCard.position.row + otherCard.size.rows;
                  
                  const isStaggered = 
                    Math.abs(candidateCenterRow - otherTop) < 0.5 ||
                    Math.abs(candidateCenterRow - otherBottom) < 0.5 ||
                    Math.abs(otherCenterRow - candidateTop) < 0.5 ||
                    Math.abs(otherCenterRow - candidateBottom) < 0.5;
                  
                  const isParallel = Math.abs(candidateCenterRow - otherCenterRow) < 1 ||
                    (Math.abs(candidateTop - otherTop) < 1 && Math.abs(candidateBottom - otherBottom) < 1);
                  
                  // Reject if parallel - only allow staggered
                  if (isParallel && !isStaggered) {
                    isValidForLargeCard = false;
                  }
                }
              }
              
              if (isValidForLargeCard) {
                const newScore = scorePosition(candidate, card.size, otherCards, cardArea, centerOffset);
                // Add small random factor for variation
                const randomFactor = 1 + (Math.random() - 0.5) * 0.05;
                const adjustedScore = newScore * randomFactor;
                if (adjustedScore > bestNewScore) {
                  bestNewScore = adjustedScore;
                  bestNewPosition = candidate;
                  improved = true;
                }
              }
            }
          }
        }
        
        // Update position if better
        if (bestNewPosition !== card.position) {
          placedCards[i].position = bestNewPosition;
        }
      }
      
      // If no improvements, stop early
      if (!improved) break;
    }
    
    // Large card staggered alignment optimization: enforce horizontal staggered arrangement (EXCLUSIVE)
    const LARGE_CARD_THRESHOLD_OPT = 20;
    const largeCards = placedCards
      .map((card, idx) => ({ card, idx, area: card.size.cols * card.size.rows }))
      .filter(({ area }) => area >= LARGE_CARD_THRESHOLD_OPT)
      .sort((a, b) => b.area - a.area);
    
    if (largeCards.length >= 2) {
      // Try to fix staggered alignment for large cards - be more aggressive
      for (let attempt = 0; attempt < 5; attempt++) {
        let fixed = false;
        
        for (let i = 0; i < largeCards.length; i++) {
          for (let j = i + 1; j < largeCards.length; j++) {
            const card1 = largeCards[i];
            const card2 = largeCards[j];
            
            // Check if they're horizontally adjacent
            const card1EndCol = card1.card.position.col + card1.card.size.cols;
            const card2EndCol = card2.card.position.col + card2.card.size.cols;
            const horizontallyAdjacent = 
              (card1EndCol === card2.card.position.col || card2EndCol === card1.card.position.col) &&
              (card1.card.position.row < card2.card.position.row + card2.card.size.rows &&
               card1.card.position.row + card1.card.size.rows > card2.card.position.row);
            
            if (horizontallyAdjacent) {
              // Check if they're staggered
              const card1CenterRow = card1.card.position.row + card1.card.size.rows / 2;
              const card2CenterRow = card2.card.position.row + card2.card.size.rows / 2;
              const card1Top = card1.card.position.row;
              const card1Bottom = card1.card.position.row + card1.card.size.rows;
              const card2Top = card2.card.position.row;
              const card2Bottom = card2.card.position.row + card2.card.size.rows;
              
              const isStaggered = 
                Math.abs(card1CenterRow - card2Top) < 0.5 ||
                Math.abs(card1CenterRow - card2Bottom) < 0.5 ||
                Math.abs(card2CenterRow - card1Top) < 0.5 ||
                Math.abs(card2CenterRow - card1Bottom) < 0.5;
              
              const isParallel = Math.abs(card1CenterRow - card2CenterRow) < 1 ||
                (Math.abs(card1Top - card2Top) < 1 && Math.abs(card1Bottom - card2Bottom) < 1);
              
              // If parallel, try to fix by moving one card to create stagger
              if (isParallel && !isStaggered) {
                const otherCards = placedCards.filter((_, idx) => idx !== card1.idx && idx !== card2.idx);
                
                // Try moving card2 to align its center with card1's top or bottom
                const staggerPositions = [
                  { col: card2.card.position.col, row: card1Top - Math.floor(card2.card.size.rows / 2) },
                  { col: card2.card.position.col, row: card1Bottom - Math.floor(card2.card.size.rows / 2) }
                ];
                
                for (const newPos of staggerPositions) {
                  if (isValidPosition(newPos, card2.card.size, otherCards.concat([card1.card]))) {
                    placedCards[card2.idx].position = newPos;
                    fixed = true;
                    break;
                  }
                }
                
                if (!fixed) {
                  // Try moving card1 instead
                  const staggerPositions2 = [
                    { col: card1.card.position.col, row: card2Top - Math.floor(card1.card.size.rows / 2) },
                    { col: card1.card.position.col, row: card2Bottom - Math.floor(card1.card.size.rows / 2) }
                  ];
                  
                  for (const newPos of staggerPositions2) {
                    if (isValidPosition(newPos, card1.card.size, otherCards.concat([card2.card]))) {
                      placedCards[card1.idx].position = newPos;
                      fixed = true;
                      break;
                    }
                  }
                }
              }
            }
          }
        }
        
        if (!fixed) break;
      }
    }
    
    // Center-pull optimization: magnetically pull cards toward center if space exists
    // Use the offset center for consistency
    const pullCenterCol = centerCol;
    const pullCenterRow = centerRow;
    const MAX_CENTER_PULL_PASSES = 3;
    
    for (let pass = 0; pass < MAX_CENTER_PULL_PASSES; pass++) {
      let moved = false;
      
      // Randomize order for variation
      const pullIndices = Array.from({ length: placedCards.length }, (_, i) => i);
      for (let j = pullIndices.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [pullIndices[j], pullIndices[k]] = [pullIndices[k], pullIndices[j]];
      }
      
      // Try to move each card closer to center (in random order)
      for (const i of pullIndices) {
        const card = placedCards[i];
        const cardArea = card.size.cols * card.size.rows;
        const currentCenterCol = card.position.col + card.size.cols / 2;
        const currentCenterRow = card.position.row + card.size.rows / 2;
        
        // Calculate direction to center (using offset center)
        const deltaCol = pullCenterCol - currentCenterCol;
        const deltaRow = pullCenterRow - currentCenterRow;
        
        // Try moving one step closer to center (in both directions if needed)
        const stepCol = deltaCol > 0 ? 1 : deltaCol < 0 ? -1 : 0;
        const stepRow = deltaRow > 0 ? 1 : deltaRow < 0 ? -1 : 0;
        
        // Try moving horizontally first (if needed)
        if (stepCol !== 0) {
          const newPosCol = { col: card.position.col + stepCol, row: card.position.row };
          const otherCards = placedCards.filter((_, idx) => idx !== i);
          
          if (isValidPosition(newPosCol, card.size, otherCards)) {
            const currentScore = scorePosition(card.position, card.size, otherCards, cardArea, centerOffset);
            const newScore = scorePosition(newPosCol, card.size, otherCards, cardArea, centerOffset);
            
            // Move if it improves or maintains score (center pull is beneficial)
            // Add small random variation to threshold
            const threshold = 0.9 + (Math.random() - 0.5) * 0.1; // 0.85 to 0.95
            if (newScore >= currentScore * threshold) {
              placedCards[i].position = newPosCol;
              moved = true;
              continue;
            }
          }
        }
        
        // Try moving vertically (if needed and horizontal didn't work)
        if (stepRow !== 0) {
          const newPosRow = { col: card.position.col, row: card.position.row + stepRow };
          const otherCards = placedCards.filter((_, idx) => idx !== i);
          
          if (isValidPosition(newPosRow, card.size, otherCards)) {
            const currentScore = scorePosition(card.position, card.size, otherCards, cardArea, centerOffset);
            const newScore = scorePosition(newPosRow, card.size, otherCards, cardArea, centerOffset);
            
            // Move if it improves or maintains score
            // Add small random variation to threshold
            const threshold = 0.9 + (Math.random() - 0.5) * 0.1; // 0.85 to 0.95
            if (newScore >= currentScore * threshold) {
              placedCards[i].position = newPosRow;
              moved = true;
            }
          }
        }
      }
      
      // If no cards moved, stop early
      if (!moved) break;
    }
    
    return placedCards;
  }, [GRID_COLS, GRID_ROWS, isValidPosition, scorePosition]); // Dependencies: grid dimensions and validation function

  // Shuffle array function (Fisher-Yates algorithm)
  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Calculate card positions using spiral algorithm with randomized order
  // PUBLICATIONS is a stable constant, so we don't need to include it in deps
  const cardPositions = useMemo(() => {
    const shuffledCards = shuffleArray(PUBLICATIONS);
    return placeCardsInSpiral(shuffledCards);
  }, [placeCardsInSpiral, shuffleArray]);

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
