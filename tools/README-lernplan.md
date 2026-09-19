# Lernplan als PDF bauen

Der Lernplan wird aus `Lernplan-Geschichte-LK.md` erzeugt:

```bash
# 1. Markdown -> druckfertiges HTML (A4-CSS)
python3 tools/lernplan_to_html.py Lernplan-Geschichte-LK.md /tmp/lernplan.html

# 2. HTML -> PDF (Chromium, mit Seitenzahlen in der Fußzeile)
node tools/lernplan_to_pdf.mjs /tmp/lernplan.html Lernplan-Geschichte-LK.pdf
```

Voraussetzungen: `pip install markdown`, `npm install playwright-core`
sowie ein Chromium unter dem in `lernplan_to_pdf.mjs` gesetzten Pfad.
