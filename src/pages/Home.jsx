import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PubCard from '../components/PubCard';
import { catalog, THEMES } from '../data/catalog';

const REPORT_2024 = catalog.find((p) => p.file?.startsWith('wie-vooruit-wil'));
// newest five with a real cover, one per title (the 2020 monitor and its factsheet share one)
const RECENT = catalog
  .filter((p) => p.cover)
  .filter((p, i, all) => all.findIndex((q) => q.title === p.title) === i)
  .slice(0, 5);

// Editorial section: a small label in the left column, the title and content to its right.
function Section({ id, label, title, className = '', children }) {
  return (
    <section className={`section ${className}`} aria-labelledby={`${id}-title`} id={id}>
      <div className="wrap section__grid">
        <p className="section__label reveal">{label}</p>
        <div className="section__body">
          <h2 id={`${id}-title`} className="section__title reveal">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero__grid">
        <div className="hero__text">
          <ul className="hero__roles reveal">
            <li>Onderzoeker</li>
            <li>Maatschappelijk ondernemer</li>
            <li>Auteur</li>
          </ul>
          <h1 className="hero__name reveal">Wilma Henderikse</h1>
          <p className="hero__lede reveal">
            Vraagstukken van sociale gelijkheid en rechtvaardigheid vormen een rode draad in mijn
            werk — van vrouwen aan de top tot culturele diversiteit, leeftijd en de combinatie van
            werk en zorg.
          </p>
        </div>
        <figure className="hero__portrait reveal">
          <img
            src="/img/wilma-1000.webp"
            srcSet="/img/wilma-560.webp 560w, /img/wilma-1000.webp 1000w"
            sizes="(max-width: 760px) 70vw, 30vw"
            width="1000"
            height="1063"
            alt="Portret van Wilma Henderikse"
            fetchpriority="high"
          />
        </figure>
      </div>
    </section>
  );
}

// The monitor itself, live, on screens wide enough for the desktop deck. Phones get the
// preview and the link: a scroll-driven deck inside a frame on a phone fights the page scroll.
function useWideScreen() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (pointer: fine)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return wide;
}

// The deck's Inleiding has women hopping in from all over its screen. Inside a frame that
// ends at the frame's edge — so we ADOPT the deck's two sky layers (same origin) into a
// host element laid exactly over the frame, without clipping: the deck keeps animating
// them, their coordinates now simply run past the frame. And the deck starts on the
// reader's first wheel tick, which we give it once the frame is well in view.
function useLiveDeck(frameRef, skyRef, stageRef) {
  useEffect(() => {
    const frame = frameRef.current;
    const sky = skyRef.current;
    const stage = stageRef.current;
    if (!frame || !sky || !stage) return undefined;
    let observer;
    let io;
    let ticked = false;
    const adopt = () => {
      const doc = frame.contentDocument;
      if (!doc || !doc.body) return;
      doc.querySelectorAll('.p02-sky').forEach((layer) => sky.appendChild(layer));
    };
    const start = () => {
      const doc = frame.contentDocument;
      if (!doc || !doc.body || !doc.defaultView) return;
      adopt();
      observer = new MutationObserver(adopt);
      observer.observe(doc.body, { childList: true });
      io = new IntersectionObserver(
        (entries) => {
          if (ticked || !entries.some((e) => e.intersectionRatio >= 0.6)) return;
          ticked = true;
          doc.defaultView.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }));
          io.disconnect();
        },
        { threshold: [0.6] },
      );
      io.observe(stage);
    };
    if (frame.contentDocument?.readyState === 'complete' && frame.contentDocument.body?.children.length) start();
    else frame.addEventListener('load', start, { once: true });
    return () => {
      frame.removeEventListener('load', start);
      observer?.disconnect();
      io?.disconnect();
    };
  }, [frameRef, skyRef, stageRef]);
}

function LiveMonitor() {
  const frameRef = useRef(null);
  const skyRef = useRef(null);
  const stageRef = useRef(null);
  useLiveDeck(frameRef, skyRef, stageRef);
  return (
    <div className="feature__stage" ref={stageRef}>
      <aside className="feature__path">
        <p className="feature__note">
          Scroll in het venster om door de monitor te gaan; scroll hier om verder te gaan op deze
          pagina.
        </p>
        <a className="arrow-link" href="/monitor/">
          Volledig scherm <span aria-hidden="true">→</span>
        </a>
      </aside>
      <div className="feature__window">
        <iframe
          ref={frameRef}
          className="feature__frame"
          src="/monitor/"
          title="Talent naar de Top — Monitor 2025, interactief"
          loading="lazy"
        />
        <div className="feature__sky" ref={skyRef} aria-hidden="true" />
      </div>
    </div>
  );
}

function MonitorFeature() {
  const wide = useWideScreen();
  return (
    <section className="feature" id="monitor" aria-labelledby="feature-title">
      <div className="wrap section__grid feature__head">
        <p className="section__label reveal">Uitgelicht</p>
        <div className="section__body feature__intro reveal">
          <h2 id="feature-title" className="feature__title">
            Talent naar de Top <span>Monitor 2025</span>
          </h2>
          <p className="feature__body">
            De voortgang van vrouwen en cultureel divers talent in topfuncties bij Nederlandse
            organisaties — niet als rapport, maar als verhaal om doorheen te scrollen. Wilma
            Henderikse werkte mee aan de analyse en presentatie.
          </p>
          <div className="actions">
            <a className="btn btn--teal" href="/monitor/">
              {wide ? 'Open op volledig scherm' : 'Open de monitor'} <span aria-hidden="true">→</span>
            </a>
            {REPORT_2024 && (
              <a className="btn btn--quiet" href={REPORT_2024.href} target="_blank" rel="noopener noreferrer">
                Rapport 2024 · PDF
              </a>
            )}
          </div>
        </div>
      </div>
      {wide ? (
        <LiveMonitor />
      ) : (
        <div className="feature__stage feature__stage--still reveal">
          <a className="feature__preview" href="/monitor/" aria-label="Open de monitor">
            <img src="/img/monitor-preview.webp" width="1200" height="750" alt="" loading="lazy" />
          </a>
        </div>
      )}
    </section>
  );
}

function Work() {
  return (
    <Section id="werk" label="Werk" title="Onderzoek en advies over gelijke kansen op de werkvloer.">
      <ol className="themes">
        {Object.entries(THEMES).map(([key, theme], i) => (
          <li key={key} className="reveal" style={{ '--i': i }}>
            <Link to={`/publicaties?thema=${key}`} className="theme">
              <span className="theme__label">{theme.label}</span>
              <span className="theme__blurb">{theme.blurb}</span>
              <span className="theme__more" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Recent() {
  return (
    <Section id="recent" label="Recent" title="Nieuwste publicaties" className="section--tint">
      <div className="shelf">
        {RECENT.map((p, i) => (
          <div key={p.id} className="reveal" style={{ '--i': i }}>
            <PubCard pub={p} compact />
          </div>
        ))}
      </div>
      <p className="section__foot reveal">
        <Link className="arrow-link" to="/publicaties">
          Alle publicaties <span aria-hidden="true">→</span>
        </Link>
      </p>
    </Section>
  );
}

function Quote() {
  return (
    <section className="quote" aria-label="Citaat">
      <figure className="wrap quote__grid reveal">
        <blockquote>
          <p>It’s the job that’s never started as takes longest to finish.</p>
        </blockquote>
        <figcaption>J.R.R. Tolkien</figcaption>
      </figure>
    </section>
  );
}

function About() {
  return (
    <Section id="over" label="Over Wilma" title="Een leven lang bezig met gelijke kansen." className="section--deep">
      <div className="about">
        <figure className="about__photo reveal">
          <img
            src="/img/lepelaar-1400.webp"
            srcSet="/img/lepelaar-700.webp 700w, /img/lepelaar-1400.webp 1400w"
            sizes="(max-width: 760px) 92vw, 36vw"
            width="1400"
            height="1400"
            alt="Wilma Henderikse in het veld met een lepelaar in haar armen"
            loading="lazy"
          />
        </figure>
        <div className="about__text reveal">
          <div className="prose">
            <p>
              Wilma Henderikse begon haar loopbaan als wetenschappelijk onderzoeker en hoofd van de
              Wetenschapswinkel aan de Erasmus Universiteit, en specialiseerde zich daarna in
              marketing en communicatie. Op Curaçao richtte ze marketingbureau Insight op; in 1993
              stapte ze als partner over naar VanDoorneHuiskes en partners.
            </p>
            <p>
              Vraagstukken van sociale ongelijkheid, gender en diversiteit houden haar al een leven
              lang bezig. Ze schreef er veel publicaties over en participeerde in diverse
              internationale commissies en projecten.
            </p>
            <p>
              Daarnaast is ze bestuurlijk actief in sport, onderwijs en hulpverlening, en als
              vrijwilliger op diverse fronten. Met heel veel plezier werkt ze mee aan natuur- en
              milieuactiviteiten.
            </p>
          </div>
          <a
            className="arrow-link"
            href="https://www.researchgate.net/profile/Wilma_Henderikse"
            target="_blank"
            rel="noopener noreferrer"
          >
            Profiel op ResearchGate <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap section__grid">
        <p className="section__label reveal">Contact</p>
        <div className="section__body">
          <h2 id="contact-title" className="contact__title reveal">
            Vragen? Hier kunt u mij bereiken.
          </h2>
          <a className="contact__mail reveal" href="mailto:info@wilmahenderikse.nl">
            info@wilmahenderikse.nl
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <MonitorFeature />
      <Work />
      <Recent />
      <Quote />
      <About />
      <Contact />
    </>
  );
}
