# wilmahenderikse.nl

De website van Wilma Henderikse — onderzoeker, maatschappelijk ondernemer en auteur.

- **/** — homepage: introductie, uitgelichte Monitor 2025, thema's, recente publicaties, over Wilma, contact
- **/publicaties** — alle publicaties met covers, zoeken en filteren op thema en soort
- **/monitor/** — de interactieve scrolly *Talent naar de Top — Monitor 2025* (overgenomen van monitortalent.nl)

React + Vite. Elke pagina wordt bij het bouwen vooraf gerenderd naar echte HTML
(`scripts/prerender.mjs`), dus de inhoud staat er meteen, ook zonder JavaScript en
voor zoekmachines; daarna neemt React het over.

## Werken aan de site

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # → build/ (wat er gepubliceerd wordt)
npm run preview   # bekijk de build lokaal
```

| Wat | Waar |
| --- | --- |
| Teksten homepage | `src/pages/Home.jsx` |
| Publicatielijst, thema's | `src/data/publications.js` |
| Vormgeving (kleuren, letters, layout) | `src/styles.css` — tokens bovenaan |
| Menu en footer | `src/components/Layout.jsx` |
| Paginatitels/omschrijvingen | `src/routes.js` |
| Foto's | `public/img/` |

## Publicatie toevoegen

1. Zet de PDF in `public/wp-content/uploads/publications/` (bestandsnaam zonder rare tekens).
2. Voeg een regel toe aan `src/data/publications.js` (velden staan bovenin dat bestand uitgelegd).
3. `npm run covers` — rendert de voorkant van de PDF naar `public/covers/` en legt het
   aantal pagina's en de bestandsgrootte vast in `src/data/pdf-meta.json`.
   Heeft de PDF geen echte kaft (alleen een kale titelpagina), dan tekent de site zelf een
   typografische cover. Vereist `pdftoppm` (poppler) en Python met Pillow.
4. Commit de PDF, de cover en `pdf-meta.json`.

## De Monitor-scrolly bijwerken

De scrolly wordt gebouwd in de repo van monitortalent.nl (`Vragenlijst-Executive-Search`,
`factsheet-deck/`). Als die een nieuwe versie heeft:

```bash
# naast deze repo uitgecheckt:
node scripts/sync-monitor.mjs --from ../Vragenlijst-Executive-Search          # versie uit deck.json
node scripts/sync-monitor.mjs --from ../Vragenlijst-Executive-Search --rev c272
```

Dit kopieert de snapshot naar `public/monitor/` en past hem aan voor deze site (paden,
een terug-link naar de homepage in plaats van de survey-link, canonical naar
monitortalent.nl). De gesynchroniseerde versie staat in `public/monitor/VERSION`.
Bewerk `public/monitor/` niet met de hand — wijzig de bron en synchroniseer opnieuw.

## Hosting

`netlify.toml` (publiceert `build/`, stuurt oude WordPress-PDF-links door) en
`vercel.json` voor Vercel. De vorige versies van de site staan ter referentie in
`archive/` (de WordPress-export en de eerdere React/CRA-versie).
