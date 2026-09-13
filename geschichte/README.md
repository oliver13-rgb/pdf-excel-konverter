# Geschichtslärm 2028

Lern-Website für das **Profil Geschichte-Kunst, Jahrgang 11**, Abiturjahrgang 2028.
Sie bündelt zwei getrennte, aber verknüpfte Stränge:

- **Geschichte S1 (P4)** – die Unterrichtsreihe „Vom mittelalterlichen Weltbild zur europäischen Expansion“
- **Seminarfach** – Quellenkunde, Analysemethode und Operatoren für den schriftlichen Teil

Statische Seite ohne Abhängigkeiten: `index.html` im Browser öffnen genügt.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Seitengerüst und Navigation |
| `style.css` | Stilsystem (Hell/Dunkel/Auto über CSS-Tokens) |
| `app.js` | Rendering, Filter, Karteikarten, Quiz, Fortschrittsspeicher |
| `daten.js` | **Alle Inhalte.** Die einzige Datei, die pro Unterrichtswoche wächst. |
| `build.js` | Baut aus den vier Dateien eine einzelne, offline lauffähige HTML-Datei |
| `Geschichtslaerm-2028.html` | Das Ergebnis des Builds – zum Weitergeben und Offline-Nutzen |

Nach jeder Inhaltsänderung neu bauen:

```bash
node build.js
```

Der Lernfortschritt (gelernte Stunden, Karteikarten-Boxen, Quiz-Bestwert, abgehakte Aufgaben)
liegt im `localStorage`. Läuft die Seite als Artifact mit `db`-Fähigkeit, wird er zusätzlich
in der Cloud gespeichert und geräteübergreifend geladen — der Status dazu steht unten links.

## Eine neue Stunde oder Sitzung eintragen

Alles passiert in `daten.js`:

1. **`STUNDEN`** (Geschichte) bzw. **`SEMINAR.sitzungen`** (Seminarfach) — neues Objekt an den
   **Anfang** des Arrays. `nr` hochzählen, `neu: true` setzen und beim bisher neuesten Eintrag
   desselben Fachs `neu` auf `false` ändern. `id` ist das ISO-Datum (`"2026-09-18"`, im Seminar
   mit Präfix: `"sem-2026-09-18"`), `datum` das deutsche Format (`"18.09.2026"`).
2. **`ZEITSTRAHL`** — neue Jahreszahlen ergänzen, chronologisch einsortiert.
3. **`GLOSSAR`** — neue Fachbegriffe mit `kurz` (Merksatz) und `lang` (Erläuterung).
4. **`KARTEN`** — Karteikarten: `f` = Frage, `r` = Antwort.
5. **`QUIZ`** — Multiple Choice: `richtig` ist der Index der korrekten Option (0-basiert).
6. **`AUFGABEN`** — nur, wenn eine Hausaufgabe vergeben wurde.
7. **`WERKSTATT`** — nur, wenn das Seminarfach ein neues Werkzeug einführt.
8. **`BRUECKEN`** — wenn eine Seminarmethode auf einen konkreten Geschichtsinhalt passt.

### Fachzuordnung

In `ZEITSTRAHL`, `GLOSSAR`, `KARTEN` und `QUIZ` steuert das Feld `fach` die Filter und die
Farbgebung. Ohne Angabe gilt `"Geschichte"`; Seminareinträge brauchen ausdrücklich
`fach: "Seminar"`. `stunde` verweist auf eine `STUNDEN`-`id`, `sitzung` auf eine
`SEMINAR.sitzungen`-`id`.

In Texten wirkt `**fett**`; alles andere wird als reiner Text ausgegeben.

### Blocktypen für `bloecke`

```js
{ t: "absatz",     text }                                  // Fließtext
{ t: "liste",      h, vorspann?, items: [], fuss? }        // Aufzählung mit Rauten
{ t: "karten",     h, eyebrow?, items: [{k, v}], fuss? }   // Begriffskacheln nebeneinander
{ t: "stufen",     h, items: [{k, v: []}] }                // nummerierte Stufenfolge
{ t: "wolke",      h, items: [] }                          // Sammlung als Pillen
{ t: "merke",      text }                                  // Merkkasten (Messing)
{ t: "definition", h, text, zusatz? }                      // Definitionskasten (Verdigris)
{ t: "quelle",     h?, text, autor, werk?, jahr, hinweis? }// Zitat mit Quellenangabe
{ t: "auftrag",    h?, text, antwort: [] }                 // Arbeitsauftrag, Lösung ausklappbar
{ t: "geruest",    h, einleitung, schritte: [] }           // Schreibgerüst für Erörterungen
{ t: "schema",     name: "to" }                            // T-O-Schema als SVG
{ t: "bausteine",  h, items: [{phase, hinweis?, saetze}] } // Formulierungshilfen
{ t: "verweis",    text, ziel: "<bereich-id>" }            // Sprung in einen anderen Bereich
```

Leeres `antwort: []` zeigt den Hinweis, dass der Auftrag nur mündlich bearbeitet wurde.

## Inhaltliche Grundlage

- Geschichte S1: Unterrichtsfolien vom 26.08., 02.09., 04.09. und 11.09.2026 (Tony Gugenheimer)
- Seminarfach: Folien vom 21.08., 28.08. und 04.09.2026
- A-Heft Geschichte, Abitur 2028: schriftliche Prüfung (Auszug) — Schwerpunkte und Operatorenliste

## Prüfen nach einer Änderung

```bash
node --check daten.js && node --check app.js && node build.js
```
