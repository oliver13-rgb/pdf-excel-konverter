# PDF ⇄ Excel Konverter (Client-Side)

Eine kleine Webanwendung zur Konvertierung zwischen PDF und Excel (.xlsx) –
**komplett im Browser**, ohne Server-Upload.

## Dateien

```
index.html   -> Struktur / UI
style.css    -> Design (modernes Drag & Drop, responsive)
app.js       -> Konvertierungslogik
```

## Verwendete Bibliotheken (per CDN, kein npm/Build nötig)

| Bibliothek       | Zweck                                      |
|-------------------|---------------------------------------------|
| **PDF.js** (Mozilla) | PDF öffnen und Text + Position pro Seite auslesen |
| **SheetJS (xlsx)**   | Excel-Datei lesen und schreiben (.xlsx)     |
| **jsPDF**            | PDF-Dokument erzeugen                       |
| **jsPDF-AutoTable**  | Tabellen sauber als PDF-Tabelle rendern     |

Alle vier werden als `<script>`-Tags von `cdnjs.cloudflare.com` geladen
(siehe `index.html`). Es ist **kein** `npm install`, kein Build-Schritt
und kein Server-Code nötig.

## Wie funktioniert die Konvertierung?

### PDF → Excel
1. PDF.js öffnet die Datei direkt aus dem `ArrayBuffer` im Browser.
2. Für jede Seite wird `getTextContent()` aufgerufen – das liefert jedes
   Textstück mit seiner x/y-Position auf der Seite.
3. Texte mit ähnlicher y-Position werden als **eine Zeile** zusammengefasst.
4. Innerhalb einer Zeile werden Texte mit größerem horizontalem Abstand als
   **eigene Spalten/Zellen** erkannt (Heuristik über `GAP_THRESHOLD`).
5. Diese Zeilen/Spalten werden mit SheetJS in ein Arbeitsblatt geschrieben –
   eine Excel-Seite pro PDF-Seite.

> ⚠️ **Wichtig:** PDFs enthalten von Haus aus *keine* Tabellenstruktur,
> sondern nur Text mit Positionsangaben. Die Erkennung von Spalten ist daher
> eine **Heuristik** und funktioniert am besten bei klar strukturierten,
> "echten" Texttabellen (nicht bei eingescannten Bildern/Fotos – dafür wäre
> zusätzlich eine OCR-Bibliothek wie `tesseract.js` nötig).

### Excel → PDF
1. SheetJS liest die `.xlsx`-Datei direkt aus dem `ArrayBuffer`.
2. Jedes Tabellenblatt wird mit `sheet_to_json(..., {header:1})` in ein
   2D-Array (Zeilen/Spalten) umgewandelt.
3. jsPDF + AutoTable rendern dieses Array als formatierte Tabelle in ein
   PDF – ein Tabellenblatt pro PDF-Seite (Querformat für mehr Platz).

## Sicherheit & Datenschutz – warum diese Lösung sicher ist

✅ **Es gibt absichtlich kein Backend.**
- Die Datei wird per `file.arrayBuffer()` direkt im Speicher des Browsers
  gelesen und dort verarbeitet.
- Es gibt **keinen** `fetch()`/`XMLHttpRequest`-Aufruf, der die Datei
  irgendwohin sendet – auch nicht an den Server, der die Webseite
  ausliefert (z. B. Vercel/Netlify/GitHub Pages).
- Das Ergebnis wird über `URL.createObjectURL(blob)` als lokaler
  Download-Link bereitgestellt – auch dieser Blob existiert nur im
  Speicher des Nutzers.
- Sobald der Tab geschlossen oder die Seite neu geladen wird, sind alle
  Daten weg. Nichts wird dauerhaft gespeichert (kein localStorage, keine
  Cookies mit Dateiinhalten).

🔍 **Das kann jeder selbst überprüfen:**
- Öffne die Browser-Entwicklertools → Tab "Netzwerk" (Network) während der
  Konvertierung. Es wird **kein** Request mit dem Dateiinhalt gesendet.
- Der gesamte Quellcode liegt offen in `app.js` – es gibt keine versteckte
  Logik.

⚠️ Einzige "externe" Verbindungen sind die **CDN-Skripte** beim ersten Laden
der Seite (PDF.js, SheetJS, jsPDF). Diese laden nur Programmcode, keine
Nutzerdateien. Wer das vermeiden möchte, kann die vier Bibliotheken
herunterladen und lokal im Projektordner ablegen (siehe Abschnitt "Optional:
Bibliotheken lokal hosten" unten).

## Hosting / Teilen (kostenlos)

Da es eine reine **statische Seite** ist (HTML/CSS/JS, kein Build-Schritt),
kannst du sie auf jeder der folgenden Plattformen kostenlos hosten:

### Variante A: GitHub Pages
1. Erstelle ein neues GitHub-Repository und lade `index.html`, `style.css`
   und `app.js` hoch (z. B. per Drag & Drop im Browser oder via `git push`).
2. Gehe zu **Settings → Pages**.
3. Wähle als Quelle den Branch `main` und Ordner `/ (root)`.
4. Nach kurzer Zeit ist die Seite unter
   `https://<dein-username>.github.io/<repo-name>/` erreichbar.

### Variante B: Netlify
1. Gehe zu [app.netlify.com](https://app.netlify.com) → "Add new site" →
   "Deploy manually".
2. Ziehe den Ordner mit den drei Dateien per Drag & Drop in das Upload-Feld.
3. Netlify generiert sofort einen Link (z. B. `https://dein-name.netlify.app`),
   den du teilen kannst.

### Variante C: Vercel
1. Lade das Projekt zu GitHub hoch (wie bei Variante A, Schritt 1).
2. Gehe zu [vercel.com](https://vercel.com) → "New Project" → Repository
   auswählen.
3. Da es ein statisches Projekt ist, sind keine Build-Einstellungen nötig
   ("Framework Preset: Other" / "Static" reicht aus, "Build Command" leer
   lassen).
4. Vercel stellt einen Link bereit, z. B. `https://dein-projekt.vercel.app`.

In allen drei Fällen genügt es, die drei Dateien (`index.html`, `style.css`,
`app.js`) im Hauptverzeichnis zu haben – kein `package.json`, kein `npm
install` nötig.

## Optional: Bibliotheken lokal hosten (statt CDN)

Falls du auch die CDN-Abhängigkeit vermeiden willst:
1. Lade folgende Dateien herunter und lege sie in einen Ordner `vendor/`:
   - `pdf.min.js` und `pdf.worker.min.js` (von pdf.js)
   - `xlsx.full.min.js` (von SheetJS)
   - `jspdf.umd.min.js` und `jspdf.plugin.autotable.min.js`
2. Passe in `index.html` die `<script src="...">`-Pfade auf
   `vendor/<dateiname>` an.
3. Passe in `app.js` die Zeile
   `pdfjsLib.GlobalWorkerOptions.workerSrc = "..."` ebenfalls auf den
   lokalen Pfad an (`vendor/pdf.worker.min.js`).

Damit lädt die Seite ausschließlich von deinem eigenen Hosting – ideal,
wenn du maximale Kontrolle willst.

## Grenzen / mögliche Erweiterungen

- **Gescannte PDFs (Bilder)**: Für Texterkennung aus Fotos/Scans wäre
  zusätzlich `tesseract.js` (OCR, ebenfalls client-side) nötig.
- **Komplexe Excel-Formatierung** (Farben, Formeln, Diagramme) wird beim
  PDF-Export nicht 1:1 übernommen – nur die reinen Zellwerte werden als
  Tabelle dargestellt.
- **Sehr große Dateien**: Da alles im Arbeitsspeicher des Browsers
  passiert, kann es bei sehr großen PDFs/Excel-Dateien (>50 MB) zu
  Performance-Einbußen kommen.
