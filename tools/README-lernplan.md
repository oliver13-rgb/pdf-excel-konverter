# Lernzettel als PDF bauen

Quelle ist `Lernplan-Geschichte-LK.md`. Der Build läuft in zwei Durchgängen:
Der erste ermittelt, auf welcher Seite jedes Kapitel beginnt, der zweite trägt
diese Seitenzahlen ins Inhaltsverzeichnis ein.

```bash
npm install                       # einmalig, zieht playwright-core
pip install markdown pymupdf      # einmalig

cd tools
python3 build_lernplan.py ../Lernplan-Geschichte-LK.md ../Lernplan-Geschichte-LK.pdf /tmp
```

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
