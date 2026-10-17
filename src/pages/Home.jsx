import React from 'react';
import { Link } from 'react-router-dom';
import PubCard from '../components/PubCard';
import Timeline from '../components/Timeline';
import { catalog, stats, THEMES, countByTheme } from '../data/catalog';

const REPORT_2024 = catalog.find((p) => p.file?.startsWith('wie-vooruit-wil'));
// newest five with a real cover, one per title (the 2020 monitor and its factsheet share one)
const RECENT = catalog
  .filter((p) => p.cover)
  .filter((p, i, all) => all.findIndex((q) => q.title === p.title) === i)
  .slice(0, 5);

function SectionHead({ id, title, children }) {
  return (
    <header className="shead reveal">
      <h2 id={id} className="shead__title">{title}</h2>
      {children && <div className="shead__aside">{children}</div>}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero__grid">
        <h1 className="hero__name reveal">
          <span>Wilma</span>
          <span>Henderikse</span>
        </h1>
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
        <ul className="hero__roles reveal">
          <li>Onderzoeker</li>
          <li>Maatschappelijk ondernemer</li>
          <li>Auteur</li>
        </ul>
        <div className="hero__intro reveal">
          <p className="hero__lede">
            Vraagstukken van sociale gelijkheid en rechtvaardigheid vormen een rode draad in mijn
            werk — van vrouwen aan de top tot culturele diversiteit, leeftijd en de combinatie van
            werk en zorg.
          </p>
          <div className="actions">
            <a className="btn btn--yellow" href="/monitor/">
              Bekijk de Monitor 2025 <span aria-hidden="true">→</span>
            </a>
            <Link className="btn btn--line" to="/publicaties">
              Alle publicaties
            </Link>
          </div>
        </div>
      </div>
      <div className="wrap reveal">
        <Timeline />
      </div>
    </section>
  );
}

function MonitorFeature() {
  return (
    <section className="feature" id="monitor" aria-labelledby="feature-title">
      <div className="wrap feature__grid">
        <div className="feature__text reveal">
          <p className="feature__label">Uitgelicht — interactief</p>
          <h2 id="feature-title" className="feature__title">
            Talent naar de Top <span>Monitor 2025</span>
          </h2>
          <p className="feature__body">
            De voortgang van vrouwen en cultureel divers talent in topfuncties bij Nederlandse
            organisaties — niet als rapport, maar als verhaal om doorheen te scrollen. Wilma
            Henderikse werkte mee aan de analyse en presentatie.
          </p>
          <div className="actions">
            <a className="btn btn--yellow" href="/monitor/">
              Open de monitor <span aria-hidden="true">→</span>
            </a>
            {REPORT_2024 && (
              <a className="btn btn--line" href={REPORT_2024.href} target="_blank" rel="noopener noreferrer">
                Rapport 2024 · PDF
              </a>
            )}
          </div>
        </div>
        <a className="feature__preview reveal" href="/monitor/" tabIndex={-1} aria-hidden="true">
          <img src="/img/monitor-preview.webp" width="1200" height="750" alt="" loading="lazy" />
        </a>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="section" id="werk" aria-labelledby="werk-title">
      <div className="wrap">
        <SectionHead id="werk-title" title="Werk">
          <p>
            Onderzoek en advies over gelijke kansen op de werkvloer, in vijf thema’s. Het getal is
            het aantal publicaties per thema.
          </p>
        </SectionHead>
        <ol className="themes">
          {Object.entries(THEMES).map(([key, theme], i) => (
            <li key={key} className="reveal" style={{ '--i': i }}>
              <Link to={`/publicaties?thema=${key}`} className="theme">
                <span className="theme__label">{theme.label}</span>
                <span className="theme__blurb">{theme.blurb}</span>
                <span className="theme__count">{countByTheme[key]}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Recent() {
  return (
    <section className="section section--grey" aria-labelledby="recent-title">
      <div className="wrap">
        <SectionHead id="recent-title" title="Recent">
          <Link className="arrow-link" to="/publicaties">
            Alle {stats.count} publicaties <span aria-hidden="true">→</span>
          </Link>
        </SectionHead>
        <div className="shelf">
          {RECENT.map((p, i) => (
            <div key={p.id} className="reveal" style={{ '--i': i }}>
              <PubCard pub={p} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section className="quote" aria-label="Citaat">
      <figure className="wrap quote__grid reveal">
        <span className="quote__mark" aria-hidden="true">“</span>
        <blockquote>
          <p>It’s the job that’s never started as takes longest to finish.</p>
        </blockquote>
        <figcaption>— J.R.R. Tolkien</figcaption>
      </figure>
    </section>
  );
}

function About() {
  return (
    <section className="section section--grey" id="over" aria-labelledby="over-title">
      <div className="wrap">
        <SectionHead id="over-title" title="Over Wilma" />
        <div className="about">
          <figure className="about__photo reveal">
            <img
              src="/img/lepelaar-1400.webp"
              srcSet="/img/lepelaar-700.webp 700w, /img/lepelaar-1400.webp 1400w"
              sizes="(max-width: 760px) 92vw, 40vw"
              width="1400"
              height="1400"
              alt="Wilma Henderikse in het veld met een lepelaar in haar armen"
              loading="lazy"
            />
          </figure>
          <div className="about__text reveal">
            <p className="about__lead">
              Begon haar loopbaan als wetenschappelijk onderzoeker en hoofd van de
              Wetenschapswinkel aan de Erasmus Universiteit, en specialiseerde zich daarna in
              marketing en communicatie.
            </p>
            <div className="prose">
              <p>
                Op Curaçao richtte ze marketingbureau Insight op; in 1993 stapte ze als partner over
                naar VanDoorneHuiskes en partners. Vraagstukken van sociale ongelijkheid, gender en
                diversiteit houden haar al een leven lang bezig. Ze schreef er veel publicaties over
                en participeerde in diverse internationale commissies en projecten.
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
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 id="contact-title" className="contact__title reveal">
          Vragen? Hier kunt u mij bereiken.
        </h2>
        <a className="contact__mail reveal" href="mailto:info@wilmahenderikse.nl">
          info@wilmahenderikse.nl
        </a>
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
