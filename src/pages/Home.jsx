import React from 'react';
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

function MonitorFeature() {
  return (
    <section className="feature" id="monitor" aria-labelledby="feature-title">
      <div className="wrap">
        <div className="feature__panel reveal">
          <div className="feature__text">
            <p className="feature__label">Uitgelicht · interactief</p>
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
                Open de monitor <span aria-hidden="true">→</span>
              </a>
              {REPORT_2024 && (
                <a className="btn btn--quiet" href={REPORT_2024.href} target="_blank" rel="noopener noreferrer">
                  Rapport 2024 · PDF
                </a>
              )}
            </div>
          </div>
          <a className="feature__preview" href="/monitor/" tabIndex={-1} aria-hidden="true">
            <img src="/img/monitor-preview.webp" width="1200" height="750" alt="" loading="lazy" />
          </a>
        </div>
      </div>
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
