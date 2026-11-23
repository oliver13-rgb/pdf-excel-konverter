---
name: lernzettel
description: Erstellt aus Schul-Notizen (Fotos von Heften, iPad-Notizen, Lernzetteln, Themenlisten) einen Lerntrainer als Artifact und ein Lernheft als PDF für eine Klassenarbeit/Klausur. Verwenden, wenn der Nutzer Material für eine Arbeit, einen Test, ein Lernblatt, einen Lernzettel oder eine Lern-PDF schickt oder sich auf eine Prüfung vorbereiten will – egal welches Fach.
---

# Lernzettel & Lernheft

Der Nutzer (Schüler, Oberstufe) hat ausdrücklich gesagt, dass genau dieses Vorgehen, diese Struktur und dieses Design immer wieder so gemacht werden sollen. Referenz: `beispiel/reli-trainer.html` (Artifact) und `beispiel/reli-print.html` (Druckversion) – Religion, Exodus 3 / Gottesbilder. **Vor dem Bauen beide Dateien lesen und als Vorlage nehmen**, nicht neu erfinden.

Sprache: Deutsch, einfache klare Sätze, Fachbegriffe fett. Ziel: Der Stoff ist **innerhalb eines Tages aktiv anwendbar**.

## Ablauf

### 1. Material vollständig auswerten
- Alle Fotos lesen: handschriftliche Notizen, Lernzettel, Lehrer-Ergänzungen (oft handschriftlich auf Ausdrucken), Themenliste aus dem Planer.
- Die **Themenliste ist die Klammer**: Jedes genannte Thema muss vorkommen. Ausrufezeichen/Kreise = Schwerpunkt → im Plan und in der Probeklausur hervorheben.
- **Aufgabenformat** aus den Notizen übernehmen (z. B. „1. Text + Zusammenfassung, 2. Verknüpfung mit Thema, 3. Bewertung/Diskussion“ = AFB I–III).
- Lehrer-Ergänzungen als eigene Hinweisbox („Ergänzung aus dem Unterricht“) aufnehmen.
- Wenn zwei Modelle zum selben Thema vorkommen (z. B. Lebensphasen + Stufenmodell), **beide** aufnehmen und im Chat darauf hinweisen.
- Themen ohne Material (stehen nur auf der Liste) nicht erfinden, sondern im Chat nennen und Nachreichen anbieten.
- Nichts Unleserliches raten: lieber neutral formulieren.

### 2. Aufbau (immer diese Reihenfolge – baut aufeinander auf)
1. **Tagesplan** – „So sieht die Arbeit aus“ (Tabelle Aufgabe / Was tun / Operatoren), Lerntag in ~8 Blöcken mit Minuten und Pausen (Lesen → Karten → Zuordnen → Quiz → Probeklausur unter Zeit → Vergleich → abends Kurz-Check), Kurz-Check-Liste, **Eselsbrücken** (Akronyme, Bild-Ketten).
2. **Wissen** – nummerierte Abschnitte pro Thema, Tabellen für Vergleiche/Symbole/Stufen, Merksätze in farbigen Hinweisboxen (`.note` rosa = Kernaussage/Wichtig, `.note.t` türkis = Ergänzung/Merke).
3. **Karteikarten** – 30–40 Karten, nach Thema gruppiert, Frage → Antwort (Antwort mit fetten Schlüsselwörtern). Interaktiv: umdrehen, „Wusste ich“ / „Nochmal“, Fortschrittsbalken, Themenfilter.
4. **Quiz** – 20–25 Multiple-Choice-Fragen mit je einer kurzen Erklärung; Neu starten, „Nur falsche wiederholen“.
5. **Zuordnen** – Übung, die genau Aufgabentyp 2 (Einordnen) trainiert: Beispielsätze → Stufe/Kategorie, mit Begründung, die man so in die Arbeit schreiben könnte.
6. **Probeklausur** – selbst geschriebener, fiktiver Übungstext (als fiktiv kennzeichnen, keine geschützten Texte abschreiben), der möglichst viele Themen berührt; Aufgaben im echten Format mit Operatoren und AFB; **Erwartungshorizont zum Aufklappen** je Aufgabe (inkl. Pro/Contra + Beispiel-Fazit); **Satzbausteine**; 5–6 **weitere mögliche Fragen** mit Musterantwort.

### 3. Design (aus der Vorlage übernehmen)
- Lernheft-Look passend zu den Textmarker-Farben des Nutzers: Akzent Magenta/Pink (`--accent`), zweite Farbe Türkis (`--teal`), kühles helles Grau als Hintergrund, weiße Karten.
- Überschriften als **Textmarker-Streifen** (`.mark`, `.mark.t`).
- Schriften: Bricolage Grotesque (Überschriften), Source Sans 3 (Text).
- Helles + dunkles Theme, mobil nutzbar, Reiter-Navigation über `#hash`.
- Fortschritt (Plan-Häkchen, Zuordnen, Klausur-Entwurf) per `localStorage` mit try/catch.
- Die Fachfarbe darf je nach Fach variieren; Struktur und Komponenten bleiben gleich.

### 4. Artifact veröffentlichen
- Erst `Artifact` mit `action: "quickstart"`, `intent: "other"`, dann die HTML schreiben (Vorlage kopieren, Inhalte ersetzen), Script mit `node --check` prüfen, veröffentlichen. Titel z. B. „<Fach>-Arbeit Trainer“, Icon `book`.
- Alle Daten im Script als Arrays: `plan`, `cards` (`[thema, frage, antwort]`), `quiz` (`[frage, [4 Optionen], richtigerIndex, erklärung]`), `zs` / `ps` (Zuordnen).

### 5. PDF (wenn gewünscht, immer anbieten)
- Druckversion aus der Trainer-HTML ableiten (siehe `beispiel/reli-print.html`):
  - vor dem Klausur-Entwurf-Block `window.__d={cards,quiz,zs,ps,plan};` einfügen (optional `zTitle, zLegend, pTitle, pLegend, pLabels`),
  - `data-theme="light"`, eigenes `<!doctype html><html><head>…<body>`,
  - Print-CSS: Navigation/Buttons/Textarea ausblenden, `section.view{break-before:page}`, Karten ohne Rahmen (`.card{border:0;padding:0}`), `tr,li,.note,h2,h3{break-inside:avoid}`, `h2,h3{break-after:avoid}`, weißer Hintergrund, `body{font-size:12.5px}`. **Kein** `break-inside:avoid` auf ganzen Karten (sonst halbleere Seiten).
- `node scripts/mkpdf.js print.html <Fach>-Arbeit-Lernheft.pdf "<Fach>-Arbeit"` – macht aus Karten eine Frage→Antwort-Liste, aus dem Quiz Fragen + Lösungen am Ende, aus Zuordnen Lücken + Lösungen, klappt alle Erwartungshorizonte auf, A4 mit Seitenzahlen.
- Einmal Seitenübersicht ansehen (`pdftoppm -r 30` + Montage), auf leere Seiten prüfen, dann mit `SendUserFile` schicken.

### 6. Antwort im Chat
Kurz: Link, was in welchem Reiter steckt, Hinweise auf fehlendes Material oder doppelte Modelle, ein Tipp (Probeklausur unter Zeit schreiben).
