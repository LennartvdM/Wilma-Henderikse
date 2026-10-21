import React from 'react';

// The PDF's own front page when it has one; otherwise (bare title pages, external
// links) a typographic cover in the site's palette, tinted by the main theme.
export default function Cover({ pub, eager = false }) {
  if (pub.cover) {
    return (
      <div className="cover">
        <img
          src={pub.cover.src}
          width={pub.cover.w}
          height={pub.cover.h}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    );
  }
  return (
    <div className={`cover cover--set cover--${pub.themes[0]}`} aria-hidden="true">
      <span className="cover__type">{pub.type}</span>
      <span className="cover__title">{pub.title}</span>
      <span className="cover__year">{pub.year}</span>
    </div>
  );
}
