import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { metaFor } from '../routes';

const NAV = [
  { to: '/#werk', label: 'Werk' },
  { to: '/publicaties', label: 'Publicaties', route: true },
  { href: '/monitor/', label: 'Monitor 2025' },
  { to: '/#over', label: 'Over' },
  { to: '/#contact', label: 'Contact' },
];

function useScrollEffects() {
  const { pathname, hash } = useLocation();

  // route change: jump to the anchor (or the top) and update the document title
  useEffect(() => {
    const meta = metaFor(pathname);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  // fade/slide elements in as they enter the viewport
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname, hash]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="wrap site-header__bar">
        <Link to="/" className="wordmark" aria-label="Wilma Henderikse — home">
          <span className="wordmark__mark" aria-hidden="true" />
          Wilma Henderikse
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="visually-hidden">Menu</span>
          <span className="menu-toggle__bars" aria-hidden="true" />
        </button>
        <nav id="site-nav" className="site-nav" aria-label="Hoofdmenu">
          <ul>
            {NAV.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <a href={item.href} className="site-nav__link">{item.label}</a>
                ) : item.route ? (
                  <NavLink to={item.to} className="site-nav__link">{item.label}</NavLink>
                ) : (
                  <Link to={item.to} className="site-nav__link">{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <p className="site-footer__name">Wilma Henderikse</p>
        <ul className="site-footer__links">
          <li><Link to="/publicaties">Publicaties</Link></li>
          <li><a href="/monitor/">Monitor Talent naar de Top 2025</a></li>
          <li><a href="mailto:info@wilmahenderikse.nl">info@wilmahenderikse.nl</a></li>
          <li>
            <a href="https://www.researchgate.net/profile/Wilma_Henderikse" target="_blank" rel="noopener noreferrer">
              ResearchGate
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default function Layout() {
  useScrollEffects();
  return (
    <>
      <a className="skip-link" href="#main">Naar de inhoud</a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
