// Scroll-triggered animation utilities matching Divi functionality
// Supports: fade, slide (top/bottom/left/right), zoom

import { useEffect, useRef } from 'react';

export const initScrollAnimations = () => {
  const animatedElements = document.querySelectorAll('[data-animation]');
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.getAttribute('data-animation');
          const delay = element.getAttribute('data-animation-delay') || '0';
          
          element.style.animationDelay = `${delay}ms`;
          element.classList.add('et-animated', `et-animation-${animation}`);
          
          // Remove observer after animation triggers
          observer.unobserve(element);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );
  
  animatedElements.forEach((el) => observer.observe(el));
};

// React hook for scroll animations
export const useScrollAnimation = (animation, direction = 'top', delay = 0, intensity = '0') => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    element.setAttribute('data-animation', animation);
    element.setAttribute('data-animation-direction', direction);
    element.setAttribute('data-animation-delay', delay);
    element.setAttribute('data-animation-intensity', intensity);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.style.animationDelay = `${delay}ms`;
            element.classList.add('et-animated', `et-animation-${animation}`);
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [animation, direction, delay, intensity]);
  
  return ref;
};

