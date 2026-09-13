/* =========================================================================
   Baut aus index.html, style.css, daten.js und app.js eine einzige
   eigenständige HTML-Datei: Geschichtslaerm-2028.html
   Aufruf:  node build.js
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const hier = __dirname;
const lies = (n) => fs.readFileSync(path.join(hier, n), "utf8");

const html = lies("index.html");
const css = lies("style.css");
const daten = lies("daten.js");
const app = lies("app.js");

// Schützt vor einem </script> im Quelltext, das die Datei sonst zerreißen würde.
const sicher = (js) => js.replace(/<\/script>/gi, "<\\/script>");

const eineDatei = html
  .replace(
    '<link rel="stylesheet" href="style.css">',
    "<style>\n" + css + "\n</style>"
  )
  .replace(
    '<script src="daten.js"></script>\n<script src="app.js"></script>',
    "<script>\n" + sicher(daten) + "\n</script>\n<script>\n" + sicher(app) + "\n</script>"
  );

for (const rest of ['href="style.css"', 'src="daten.js"', 'src="app.js"']) {
  if (eineDatei.indexOf(rest) !== -1) {
    console.error("FEHLER: " + rest + " wurde nicht ersetzt — index.html hat sich geändert.");
    process.exit(1);
  }
}

// index.html ist absichtlich ohne <html>/<head>/<body> geschrieben, damit es
// auch als Artifact funktioniert. Für die Einzeldatei ergänzen wir das Gerüst.
const trenner = '<div class="shell">';
const schnitt = eineDatei.indexOf(trenner);
if (schnitt === -1) {
  console.error('FEHLER: <div class="shell"> nicht gefunden — index.html hat sich geändert.');
  process.exit(1);
}

const kopf = eineDatei.slice(0, schnitt).trim();
const rumpf = eineDatei.slice(schnitt).trim();

const ziel = path.join(hier, "Geschichtslaerm-2028.html");
fs.writeFileSync(ziel,
  "<!doctype html>\n<html lang=\"de\">\n<head>\n" + kopf +
  "\n</head>\n<body>\n" + rumpf + "\n</body>\n</html>\n");

const kb = (fs.statSync(ziel).size / 1024).toFixed(0);
console.log("Geschichtslaerm-2028.html geschrieben — " + kb + " KB, eine Datei, ohne Abhängigkeiten.");
