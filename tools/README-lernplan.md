# Dokumente als PDF bauen

Drei Dokumente teilen sich denselben Build:

| Markdown | PDF | Inhalt |
|---|---|---|
| `Lernplan-Geschichte-LK.md` | Lernzettel | Wochenplan, Methodik, Unterrichtsstoff |
| `Probeklausur.md` | Übungsklausur | Material mit Zeilenzählung und drei Aufgaben |
| `Probeklausur-Loesungen.md` | Erwartungshorizont | Musterlösung, Punkteraster, Checkliste |

Der Build läuft in zwei Durchgängen:
Der erste ermittelt, auf welcher Seite jedes Kapitel beginnt, der zweite trägt
diese Seitenzahlen ins Inhaltsverzeichnis ein.

```bash
npm install                       # einmalig, zieht playwright-core
pip install markdown pymupdf      # einmalig

cd tools
for f in Lernplan-Geschichte-LK Probeklausur Probeklausur-Loesungen; do
  python3 build_lernplan.py "../$f.md" "../$f.pdf" /tmp
done
```

Der Dokumenttitel für die Fußzeile wird aus der ersten Überschrift abgeleitet.

| Datei | Aufgabe |
|---|---|
| `build_lernplan.py` | Steuert den Zwei-Pass-Build und füllt das Inhaltsverzeichnis |
| `lernplan_to_html.py` | Markdown nach HTML, enthält das Druck-Stylesheet |
| `lernplan_to_pdf.mjs` | HTML nach PDF über Chromium, setzt die Fußzeile |

Chromium wird unter dem in `lernplan_to_pdf.mjs` gesetzten Pfad erwartet.

## Konventionen in der Markdown-Datei

- `# 4 · Titel` beginnt ein Kapitel und damit eine neue Seite. Die Ziffer vor
  dem `·` wird für die Seitenzahlen im Inhaltsverzeichnis ausgewertet.
- `<p class="lesson">Stunde vom 4. September</p>` setzt die Stundenmarke.
- `- [ ] Aufgabe` wird zu einem Kästchen zum Abhaken.
- Vor jeder Liste muss eine Leerzeile stehen, sonst erkennt Python-Markdown
  sie nicht als Liste.
- Ein Quellentext steht in `<ol class="src">`; jedes `<li>` ist eine Zeile, jede
  fünfte wird nummeriert. `class="para"` setzt einen Absatzabstand davor —
  Leerzeilen als eigene Einträge würden die Zählung verschieben.
- `<div class="task-box">` setzt einen Aufgabenblock, `<div class="pagebreak">`
  erzwingt einen Seitenumbruch.
