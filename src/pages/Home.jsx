import React from 'react';
import { Link } from 'react-router-dom';
import PubCard from '../components/PubCard';
import { catalog, stats, THEMES, countByTheme } from '../data/catalog';

const REPORT_2024 = catalog.find((p) => p.file?.startsWith('wie-vooruit-wil'));
// newest five with a real cover, one per title (the 2020 monitor and its factsheet share one)
const RECENT = catalog
  .filter((p) => p.cover)
  .filter((p, i, all) => all.findIndex((q) => q.title === p.title) === i)
  .slice(0, 5);

function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero__grid">
        <div className="hero__text">
          <p className="eyebrow reveal">
            <span>Onderzoeker</span>
            <span>Maatschappelijk ondernemer</span>
            <span>Auteur</span>
          </p>
          <h1 className="hero__name reveal">
            Wilma <em>Henderikse</em>
          </h1>
          <p className="hero__lede reveal">
            Vraagstukken van sociale gelijkheid en rechtvaardigheid vormen een rode draad in mijn
            werk — van vrouwen aan de top tot culturele diversiteit, leeftijd en de combinatie van
            werk en zorg.
          </p>
          <div className="hero__actions reveal">
            <a className="button button--dark" href="/monitor/">
              Bekijk de Monitor 2025 <span aria-hidden="true">→</span>
            </a>
            <Link className="button button--ghost" to="/publicaties">
              Alle publicaties
            </Link>
          </div>
          <dl className="hero__stats reveal">
            <div>
              <dt>Publicaties</dt>
              <dd>{stats.count}</dd>
            </div>
            <div>
              <dt>Archief</dt>
              <dd>
                {stats.first}–{stats.last}
              </dd>
            </div>
            <div>
              <dt>Monitors</dt>
              <dd>{stats.monitors}</dd>
            </div>
          </dl>
        </div>
        <figure className="hero__portrait reveal">
          <div className="arch">
            <img
              src="/img/wilma-1000.webp"
              srcSet="/img/wilma-560.webp 560w, /img/wilma-1000.webp 1000w"
              sizes="(max-width: 760px) 80vw, 40vw"
              width="1000"
              height="1063"
              alt="Portret van Wilma Henderikse"
              fetchpriority="high"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}

function MonitorFeature() {
  return (
    <section className="feature" id="monitor" aria-labelledby="feature-title">
      <div className="wrap">
        <div className="feature__card reveal">
          <div className="feature__text">
            <p className="feature__kicker">Uitgelicht · interactief</p>
            <h2 id="feature-title" className="feature__title">
              Talent naar de Top
              <span>Monitor 2025</span>
            </h2>
            <p className="feature__body">
              De voortgang van vrouwen en cultureel divers talent in topfuncties bij Nederlandse
              organisaties — niet als rapport, maar als verhaal om doorheen te scrollen. Wilma
              Henderikse werkte mee aan de analyse en presentatie.
            </p>
            <div className="feature__actions">
              <a className="button button--indigo" href="/monitor/">
                Open de monitor <span aria-hidden="true">→</span>
              </a>
              {REPORT_2024 && (
                <a className="feature__secondary" href={REPORT_2024.href} target="_blank" rel="noopener noreferrer">
                  Rapport 2024 als PDF
                </a>
              )}
            </div>
          </div>
          <a className="feature__preview" href="/monitor/" tabIndex={-1} aria-hidden="true">
            <span className="feature__window">
              <span className="feature__dots" />
              <img src="/img/monitor-preview.webp" width="1200" height="750" alt="" loading="lazy" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="work" id="werk" aria-labelledby="werk-title">
      <div className="wrap">
        <header className="section-head reveal">
          <p className="eyebrow eyebrow--plain">Mijn werk</p>
          <h2 id="werk-title" className="section-title">
            Onderzoek dat organisaties helpt <em>de deur te openen</em>.
          </h2>
        </header>
        <ol className="themes">
          {Object.entries(THEMES).map(([key, theme], i) => (
            <li key={key} className="theme reveal" style={{ '--i': i }}>
              <Link to={`/publicaties?thema=${key}`} className="theme__link">
                <span className="theme__count">{String(countByTheme[key]).padStart(2, '0')}</span>
                <span className="theme__label">{theme.label}</span>
                <span className="theme__blurb">{theme.blurb}</span>
                <span className="theme__more" aria-hidden="true">→</span>
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
    <section className="recent" aria-labelledby="recent-title">
      <div className="wrap">
        <header className="section-head section-head--row reveal">
          <h2 id="recent-title" className="section-title section-title--sm">Recente publicaties</h2>
          <Link className="link-arrow" to="/publicaties">
            Alle {stats.count} publicaties <span aria-hidden="true">→</span>
          </Link>
        </header>
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
      <figure className="wrap quote__inner reveal">
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
    <section className="about" id="over" aria-labelledby="over-title">
      <div className="wrap about__grid">
        <figure className="about__photo reveal">
          <img
            src="/img/lepelaar-1400.webp"
            srcSet="/img/lepelaar-700.webp 700w, /img/lepelaar-1400.webp 1400w"
            sizes="(max-width: 760px) 92vw, 44vw"
            width="1400"
            height="1400"
            alt="Wilma Henderikse in het veld met een lepelaar in haar armen"
            loading="lazy"
          />
        </figure>
        <div className="about__text">
          <p className="eyebrow eyebrow--plain reveal">Over Wilma</p>
          <h2 id="over-title" className="section-title reveal">
            Een leven lang bezig met <em>gelijke kansen</em>.
          </h2>
          <div className="prose reveal">
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
            className="link-arrow reveal"
            href="https://www.researchgate.net/profile/Wilma_Henderikse"
            target="_blank"
            rel="noopener noreferrer"
          >
            Profiel op ResearchGate <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact__inner">
        <p className="eyebrow eyebrow--plain reveal">Contact</p>
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
