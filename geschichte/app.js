/* =========================================================================
   Kursarchiv Geschichte S1 — Anwendungslogik
   Liest die Inhalte aus daten.js, rendert die Ansichten und merkt sich den
   Lernfortschritt (lokal; zusätzlich in der Cloud, wenn die Seite als
   Artifact mit db-Fähigkeit läuft).
   ========================================================================= */

(function () {
  "use strict";

  /* ------------------------------------------------------------ Werkzeuge */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  /** Schutzschicht + leichte Auszeichnung: **fett** wird zu <strong>. */
  function fmt(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  function schluessel(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return "k" + (h >>> 0).toString(36);
  }

  function mische(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ------------------------------------------------------- Fortschritt */

  const LEER = { gelernt: {}, boxen: {}, aufgaben: {}, quiz: null };
  const SPEICHER = "geschichte-s1-fortschritt";
  let stand = JSON.parse(JSON.stringify(LEER));
  let cloud = null;
  let schreibTimer = null;

  function ladeLokal() {
    try {
      const roh = localStorage.getItem(SPEICHER);
      if (roh) stand = Object.assign(JSON.parse(JSON.stringify(LEER)), JSON.parse(roh));
    } catch (e) { /* privater Modus o. Ä. — dann eben ohne */ }
  }

  function sichere() {
    try { localStorage.setItem(SPEICHER, JSON.stringify(stand)); } catch (e) { /* ignorieren */ }
    if (!cloud) return;
    clearTimeout(schreibTimer);
    schreibTimer = setTimeout(() => {
      cloud.set({ stand: JSON.stringify(stand), zeit: Date.now() }).catch(() => {});
    }, 600);
  }

  async function verbindeCloud() {
    let db = null;
    try { db = await (window.claude && window.claude.use ? window.claude.use("db") : null); } catch (e) { db = null; }
    if (!db) return;
    try {
      const ref = db.doc("fortschritt/stand");
      const snap = await ref.get();
      if (snap && snap.exists) {
        const d = snap.data() || {};
        if (typeof d.stand === "string") {
          stand = Object.assign(JSON.parse(JSON.stringify(LEER)), JSON.parse(d.stand));
          zeichneAlles();
        }
      }
      cloud = ref;
      const note = $("#syncnote");
      note.dataset.state = "cloud";
      note.textContent = "Fortschritt synchronisiert";
    } catch (e) { cloud = null; }
  }

  /* ------------------------------------------------------------ Navigation */

  const BEREICHE = [
    { id: "uebersicht", label: "Übersicht" },
    { id: "stunden", label: "Stunden" },
    { id: "zeitstrahl", label: "Zeitstrahl" },
    { id: "begriffe", label: "Begriffe" },
    { id: "karten", label: "Karteikarten" },
    { id: "quiz", label: "Quiz" },
    { id: "klausur", label: "Klausur & Abi" },
    { id: "aufgaben", label: "Aufgaben" }
  ];

  function bautNav() {
    const nav = $("#nav");
    BEREICHE.forEach((b, i) => {
      const btn = el("button", null, '<span class="idx">' + String(i + 1).padStart(2, "0") + "</span><span>" + esc(b.label) + "</span>");
      btn.type = "button";
      btn.addEventListener("click", () => zeige(b.id));
      nav.appendChild(btn);
    });
  }

  function zeige(id) {
    if (!BEREICHE.some((b) => b.id === id)) id = "uebersicht";
    BEREICHE.forEach((b, i) => {
      const aktiv = b.id === id;
      $("#view-" + b.id).dataset.active = aktiv ? "true" : "false";
      $("#nav").children[i].setAttribute("aria-current", aktiv ? "true" : "false");
    });
    if (location.hash.slice(1) !== id) history.replaceState(null, "", "#" + id);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ---------------------------------------------------------------- Theme */

  function setzeTheme(modus) {
    if (modus === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", modus);
    try { localStorage.setItem("geschichte-s1-theme", modus); } catch (e) {}
    ["auto", "light", "dark"].forEach((m) => {
      $("#th-" + m).setAttribute("aria-pressed", m === modus ? "true" : "false");
    });
  }

  function themeStart() {
    let m = "auto";
    try { m = localStorage.getItem("geschichte-s1-theme") || "auto"; } catch (e) {}
    setzeTheme(m);
    document.querySelectorAll("[data-theme-set]").forEach((b) => {
      b.addEventListener("click", () => setzeTheme(b.dataset.themeSet));
    });
  }

  /* ------------------------------------------------------------ Filterleiste */

  function bauFilter(host, kats, beiWahl) {
    host.innerHTML = "";
    const alle = ["Alle"].concat(kats);
    alle.forEach((k) => {
      const b = el("button", null, esc(k));
      b.type = "button";
      b.setAttribute("aria-pressed", k === "Alle" ? "true" : "false");
      b.addEventListener("click", () => {
        Array.from(host.children).forEach((c) => c.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        beiWahl(k === "Alle" ? null : k);
      });
      host.appendChild(b);
    });
  }

  /* -------------------------------------------------------------- Übersicht */

  function zeichneUebersicht() {
    const neueste = STUNDEN[0];
    $("#hero-meta").innerHTML =
      "<span>Kurs <b>" + esc(KURS.kurs) + "</b></span>" +
      "<span>Lehrkraft <b>" + esc(KURS.lehrkraft) + "</b></span>" +
      "<span>Themenbereich <b>" + esc(KURS.themenbereich) + "</b></span>" +
      "<span>Stand <b>" + esc(neueste.datum) + "</b></span>";

    const gelernt = STUNDEN.filter((s) => stand.gelernt[s.id]).length;
    const inBox3 = KARTEN.filter((k) => (stand.boxen[schluessel(k.f)] || 1) >= 3).length;
    const offen = AUFGABEN.filter((a) => !stand.aufgaben[a.id]).length;

    const stats = [
      { k: "Stunden erfasst", v: STUNDEN.length, sub: gelernt + " als gelernt markiert", pct: gelernt / STUNDEN.length },
      { k: "Karteikarten", v: KARTEN.length, sub: inBox3 + " sitzen sicher", pct: inBox3 / KARTEN.length },
      { k: "Begriffe im Glossar", v: GLOSSAR.length, sub: "aus " + STUNDEN.length + " Stunden", pct: null },
      { k: "Offene Aufgaben", v: offen, sub: AUFGABEN.length + " insgesamt", pct: null }
    ];

    const row = $("#statrow");
    row.innerHTML = "";
    stats.forEach((s) => {
      const n = el("div", "stat");
      n.innerHTML =
        '<div class="k">' + esc(s.k) + "</div>" +
        '<div class="v">' + s.v + " <small>" + esc(s.sub) + "</small></div>" +
        (s.pct == null ? "" : '<div class="bar"><i style="width:' + Math.round(s.pct * 100) + '%"></i></div>');
      row.appendChild(n);
    });

    const lf = $("#leitfragen");
    lf.innerHTML = "";
    KURS.leitfragen.forEach((f) => lf.appendChild(el("li", null, esc(f))));

    const z = $("#zuletzt");
    z.innerHTML = "";
    const karte = el("div", "panel");
    karte.innerHTML =
      '<span class="chip accent">' + esc(neueste.datum) + "</span>" +
      '<h3 style="margin-top:10px;font-size:21px">' + esc(neueste.titel) + "</h3>" +
      '<p style="margin-top:7px;color:var(--ink-2);font-size:15px;max-width:var(--maxread)">' + esc(neueste.untertitel) + "</p>";
    const b = el("div", "fcbtns");
    const go = el("button", "btn primary", "Zur Stunde");
    go.type = "button";
    go.addEventListener("click", () => {
      zeige("stunden");
      const d = document.getElementById("st-" + neueste.id);
      if (d) { d.open = true; d.scrollIntoView({ block: "center" }); }
    });
    b.appendChild(go);
    karte.appendChild(b);
    z.appendChild(karte);

    const o = $("#offene-uebersicht");
    o.innerHTML = "";
    const p = el("div", "panel");
    if (!offen) {
      p.innerHTML = '<p class="leer" style="padding:0">Nichts offen – alle Hausaufgaben sind abgehakt.</p>';
    } else {
      const ul = el("ul", "punkte");
      AUFGABEN.filter((a) => !stand.aufgaben[a.id]).forEach((a) => {
        ul.appendChild(el("li", null, fmt(a.text) + ' <span class="chip">' + esc(a.datum) + "</span>"));
      });
      p.appendChild(ul);
    }
    o.appendChild(p);
  }

  /* ---------------------------------------------------------------- Stunden */

  function blockHtml(b) {
    switch (b.t) {
      case "absatz":
        return '<div class="block"><p class="absatz">' + fmt(b.text) + "</p></div>";

      case "liste": {
        let h = '<div class="block">';
        if (b.h) h += "<h4>" + esc(b.h) + "</h4>";
        if (b.vorspann) h += '<p class="vorspann">' + fmt(b.vorspann) + "</p>";
        h += '<ul class="punkte">' + b.items.map((i) => "<li>" + fmt(i) + "</li>").join("") + "</ul>";
        if (b.fuss) h += '<p class="fuss">' + fmt(b.fuss) + "</p>";
        return h + "</div>";
      }

      case "karten": {
        let h = '<div class="block breit">';
        if (b.h) h += "<h4>" + esc(b.h) + (b.eyebrow ? ' <span class="chip">' + esc(b.eyebrow) + "</span>" : "") + "</h4>";
        h += '<div class="kgrid">' + b.items.map((i) =>
          '<div class="kcard"><div class="k">' + esc(i.k) + '</div><div class="v">' + fmt(i.v) + "</div></div>").join("") + "</div>";
        if (b.fuss) h += '<p class="fuss">' + fmt(b.fuss) + "</p>";
        return h + "</div>";
      }

      case "stufen": {
        let h = '<div class="block breit"><h4>' + esc(b.h) + '</h4><div class="stufen">';
        h += b.items.map((i) =>
          '<div class="stufe"><div class="num"></div><div><h5>' + esc(i.k) + "</h5><ul>" +
          i.v.map((v) => "<li>" + fmt(v) + "</li>").join("") + "</ul></div></div>").join("");
        return h + "</div></div>";
      }

      case "wolke":
        return '<div class="block breit"><h4>' + esc(b.h) + '</h4><div class="wolke">' +
          b.items.map((i) => "<span>" + esc(i) + "</span>").join("") + "</div></div>";

      case "merke":
        return '<div class="merke"><span class="label">Merke</span>' + fmt(b.text) + "</div>";

      case "definition":
        return '<div class="defbox"><h4>' + esc(b.h) + "</h4><p>" + fmt(b.text) + "</p>" +
          (b.zusatz ? '<p class="zusatz">' + fmt(b.zusatz) + "</p>" : "") + "</div>";

      case "quelle":
        return '<div class="zitat">' +
          (b.h ? '<span class="chip brass">' + esc(b.h) + '</span><div style="height:10px"></div>' : "") +
          "<blockquote>" + esc(b.text) + "</blockquote>" +
          '<p class="sig">' + esc([b.autor, b.werk, b.jahr].filter(Boolean).join(" · ")) + "</p>" +
          (b.hinweis ? '<p class="hinweis">' + fmt(b.hinweis) + "</p>" : "") + "</div>";

      case "auftrag": {
        let h = '<div class="auftrag"><span class="label">Arbeitsauftrag</span>';
        if (b.h) h += '<div style="font-family:var(--f-mono);font-size:11px;color:var(--ink-3);margin-bottom:6px">' + esc(b.h) + "</div>";
        h += '<p class="frage">' + esc(b.text) + "</p>";
        if (b.antwort && b.antwort.length) {
          h += '<details class="loesung"><summary>Ergebnis aus dem Unterricht anzeigen</summary><ul class="punkte">' +
            b.antwort.map((a) => "<li>" + fmt(a) + "</li>").join("") + "</ul></details>";
        } else {
          h += '<p class="keineloesung">Im Unterricht mündlich bearbeitet – kein Tafelergebnis in den Folien.</p>';
        }
        return h + "</div>";
      }

      case "geruest":
        return '<div class="geruest"><h4 style="font-size:15.5px;margin-bottom:9px">' + esc(b.h) + "</h4>" +
          '<p class="einleitung">' + esc(b.einleitung) + "</p><ol>" +
          b.schritte.map((s) => "<li>" + esc(s) + "</li>").join("") + "</ol></div>";

      case "schema":
        return schemaTO();

      default:
        return "";
    }
  }

  function schemaTO() {
    return '<div class="block breit schema"><h4>Das T-O-Schema hinter der Karte</h4><figure>' +
      '<svg width="190" height="190" viewBox="0 0 190 190" role="img" aria-label="T-O-Schema: Asien oben, Europa unten links, Afrika unten rechts, Jerusalem im Zentrum">' +
      '<circle cx="95" cy="95" r="88" fill="var(--surface-2)" stroke="var(--accent)" stroke-width="2"/>' +
      '<path d="M7 95 H183" stroke="var(--accent)" stroke-width="2" fill="none"/>' +
      '<path d="M95 95 V183" stroke="var(--accent)" stroke-width="2" fill="none"/>' +
      '<text x="95" y="62" text-anchor="middle" font-family="Newsreader, Georgia, serif" font-size="17" fill="var(--ink)">ASIA</text>' +
      '<text x="52" y="145" text-anchor="middle" font-family="Newsreader, Georgia, serif" font-size="14" fill="var(--ink)">EUROPA</text>' +
      '<text x="140" y="145" text-anchor="middle" font-family="Newsreader, Georgia, serif" font-size="14" fill="var(--ink)">AFRICA</text>' +
      '<text x="95" y="18" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--ink-3)">OSTEN</text>' +
      '<circle cx="95" cy="95" r="4.5" fill="var(--brass)"/>' +
      '<text x="103" y="91" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--brass)">Jerusalem</text>' +
      "</svg>" +
      "<figcaption>Das <strong>O</strong> ist der Weltozean, der die bewohnte Erde umschließt. Das <strong>T</strong> bilden Mittelmeer, Nil und Don: Sie trennen Asien (oben, weil der Osten oben liegt) von Europa und Afrika. Im Schnittpunkt steht Jerusalem – die Karte ordnet nach Heilsgeschichte, nicht nach Messung.</figcaption>" +
      "</figure></div>";
  }

  let stundenFilter = null;
  let stundenSuche = "";

  function zeichneStunden() {
    const host = $("#stundenliste");
    host.innerHTML = "";
    const q = stundenSuche.trim().toLowerCase();

    const treffer = STUNDEN.filter((s) => {
      if (stundenFilter && s.tags.indexOf(stundenFilter) === -1) return false;
      if (!q) return true;
      return JSON.stringify(s).toLowerCase().indexOf(q) !== -1;
    });

    if (!treffer.length) {
      host.appendChild(el("p", "leer", "Keine Stunde passt zu dieser Suche."));
      return;
    }

    treffer.forEach((s) => {
      const d = el("details", "stunde" + (s.neu ? " istneu" : ""));
      d.id = "st-" + s.id;
      if (q) d.open = true;

      const tag = s.datum.slice(0, 2);
      const rest = s.datum.slice(3);
      const sum = el("summary");
      sum.innerHTML =
        '<div class="datum"><b>' + esc(tag) + "</b>" + esc(rest) + "</div>" +
        '<div class="kopf"><h3>' + esc(s.titel) + "</h3>" +
        '<p class="unter">' + esc(s.untertitel) + "</p>" +
        '<div class="tags">' + (s.neu ? '<span class="chip accent">Neu</span>' : "") +
        '<span class="chip">Stunde ' + s.nr + "</span>" +
        s.tags.map((t) => '<span class="chip">' + esc(t) + "</span>").join("") +
        (s.hausaufgabe ? '<span class="chip brass">Hausaufgabe</span>' : "") +
        "</div></div>";

      const status = el("div", "status");
      const btn = el("button", "gelerntbtn", stand.gelernt[s.id] ? "✓ Gelernt" : "Als gelernt markieren");
      btn.type = "button";
      btn.setAttribute("aria-pressed", stand.gelernt[s.id] ? "true" : "false");
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (stand.gelernt[s.id]) delete stand.gelernt[s.id];
        else stand.gelernt[s.id] = true;
        sichere();
        btn.setAttribute("aria-pressed", stand.gelernt[s.id] ? "true" : "false");
        btn.textContent = stand.gelernt[s.id] ? "✓ Gelernt" : "Als gelernt markieren";
        zeichneUebersicht();
      });
      status.appendChild(btn);
      status.appendChild(el("span", "caret", "▶"));
      sum.appendChild(status);
      d.appendChild(sum);

      const koerper = el("div", "stundenkoerper");
      if (s.wiederholung) {
        koerper.appendChild(el("div", "wiederholung", '<span class="chip">Wiederholung</span><span>' + esc(s.wiederholung) + "</span>"));
      }
      koerper.insertAdjacentHTML("beforeend", s.bloecke.map(blockHtml).join(""));
      if (s.hausaufgabe) {
        koerper.insertAdjacentHTML("beforeend",
          '<div class="hausaufgabe"><span class="label">Hausaufgabe</span><p>' + fmt(s.hausaufgabe) + "</p></div>");
      }
      d.appendChild(koerper);
      host.appendChild(d);
    });
  }

  /* ------------------------------------------------------------- Zeitstrahl */

  let tlFilter = null;

  function zeichneZeitstrahl() {
    const host = $("#zeitstrahl");
    host.innerHTML = "";
    const items = ZEITSTRAHL.filter((z) => !tlFilter || z.kat === tlFilter);
    if (!items.length) { host.appendChild(el("p", "leer", "Keine Einträge in dieser Kategorie.")); return; }
    items.forEach((z) => {
      host.appendChild(el("div", "tlitem",
        '<span class="jahr">' + esc(z.jahr) + "</span>" +
        "<h4>" + esc(z.titel) + "</h4>" +
        "<p>" + esc(z.text) + "</p>" +
        '<span class="chip">' + esc(z.kat) + "</span>"));
    });
  }

  /* ---------------------------------------------------------------- Glossar */

  let glFilter = null;
  let glSuche = "";

  function zeichneGlossar() {
    const host = $("#glossar");
    host.innerHTML = "";
    const q = glSuche.trim().toLowerCase();
    const items = GLOSSAR
      .filter((g) => !glFilter || g.kat === glFilter)
      .filter((g) => !q || (g.begriff + " " + g.kurz + " " + g.lang).toLowerCase().indexOf(q) !== -1);

    if (!items.length) { host.appendChild(el("p", "leer", "Kein Begriff passt zu dieser Suche.")); return; }

    items.forEach((g) => {
      const wrap = el("div", "gterm");
      wrap.innerHTML =
        "<dt>" + esc(g.begriff) + '<span class="chip">' + esc(g.kat) + "</span></dt>" +
        '<dd><p class="kurz">' + esc(g.kurz) + '</p><p class="lang">' + esc(g.lang) + "</p></dd>";
      host.appendChild(wrap);
    });
  }

  /* ----------------------------------------------------------- Karteikarten */

  let fcFilter = null;
  let fcStapel = [];
  let fcPos = 0;
  let fcOffen = false;

  function fcAuswahl() {
    const alle = KARTEN.filter((k) => !fcFilter || k.kat === fcFilter);
    // Box 1 zuerst, dann 2, dann 3 — innerhalb der Box gemischt.
    const nachBox = [[], [], []];
    alle.forEach((k) => nachBox[Math.min(3, stand.boxen[schluessel(k.f)] || 1) - 1].push(k));
    return mische(nachBox[0]).concat(mische(nachBox[1]), mische(nachBox[2]));
  }

  function fcNeu() {
    fcStapel = fcAuswahl();
    fcPos = 0;
    fcOffen = false;
    zeichneKarte();
  }

  function zeichneKarte() {
    const karte = fcStapel[fcPos];
    const box = $("#fcard");
    const btns = $("#fc-btns");
    btns.innerHTML = "";

    if (!karte) {
      box.innerHTML = '<div class="front">Keine Karten in dieser Auswahl.</div>';
      return;
    }

    const nr = (stand.boxen[schluessel(karte.f)] || 1);
    box.innerHTML =
      '<span class="seite">' + (fcOffen ? "Antwort" : "Frage") + " · Box " + nr + "</span>" +
      '<div class="front">' + esc(karte.f) + "</div>" +
      (fcOffen ? '<div class="back">' + fmt(karte.r) + "</div>" : '<span class="hint">Klicken oder Leertaste zum Aufdecken</span>');

    $("#fc-zaehler").textContent = "Karte " + (fcPos + 1) + " von " + fcStapel.length;
    $("#fc-kat").textContent = karte.kat;

    if (!fcOffen) {
      const b = el("button", "btn primary", "Antwort aufdecken");
      b.type = "button";
      b.addEventListener("click", aufdecken);
      btns.appendChild(b);
    } else {
      const gut = el("button", "btn primary", "Gewusst →");
      gut.type = "button";
      gut.addEventListener("click", () => bewerte(true));
      const schlecht = el("button", "btn", "Nochmal");
      schlecht.type = "button";
      schlecht.addEventListener("click", () => bewerte(false));
      btns.appendChild(gut);
      btns.appendChild(schlecht);
    }

    const skip = el("button", "btn ghost", "Überspringen");
    skip.type = "button";
    skip.addEventListener("click", weiter);
    btns.appendChild(skip);

    const neu = el("button", "btn ghost", "Stapel neu mischen");
    neu.type = "button";
    neu.addEventListener("click", fcNeu);
    btns.appendChild(neu);

    zeichneBoxen();
  }

  function zeichneBoxen() {
    const host = $("#fc-boxen");
    const alle = KARTEN.filter((k) => !fcFilter || k.kat === fcFilter);
    const z = [0, 0, 0];
    alle.forEach((k) => z[Math.min(3, stand.boxen[schluessel(k.f)] || 1) - 1]++);
    host.innerHTML =
      '<div class="b">Box 1 · neu <b>' + z[0] + "</b></div>" +
      '<div class="b">Box 2 · wackelig <b>' + z[1] + "</b></div>" +
      '<div class="b">Box 3 · sitzt <b>' + z[2] + "</b></div>";
  }

  function aufdecken() { fcOffen = true; zeichneKarte(); }

  function weiter() {
    fcOffen = false;
    fcPos = fcStapel.length ? (fcPos + 1) % fcStapel.length : 0;
    zeichneKarte();
  }

  function bewerte(gewusst) {
    const karte = fcStapel[fcPos];
    if (karte) {
      const s = schluessel(karte.f);
      const jetzt = stand.boxen[s] || 1;
      stand.boxen[s] = gewusst ? Math.min(3, jetzt + 1) : 1;
      sichere();
      zeichneUebersicht();
    }
    weiter();
  }

  /* ------------------------------------------------------------------- Quiz */

  let qStapel = [];
  let qPos = 0;
  let qPunkte = 0;
  let qBeantwortet = false;

  function quizStart() {
    qStapel = mische(QUIZ);
    qPos = 0;
    qPunkte = 0;
    qBeantwortet = false;
    zeichneQuiz();
  }

  function zeichneQuiz() {
    const host = $("#quizwrap");
    host.innerHTML = "";

    if (qPos >= qStapel.length) {
      const proz = Math.round((qPunkte / qStapel.length) * 100);
      const card = el("div", "qcard");
      const urteil = proz >= 85 ? "Sitzt. Das ist Abi-Niveau."
        : proz >= 65 ? "Solide – die Lücken stecken in den Details."
        : "Noch wacklig. Geh die Stunden und Karteikarten nochmal durch.";
      card.innerHTML =
        '<div class="ergebnis"><div class="gross">' + qPunkte + "/" + qStapel.length + "</div>" +
        "<p>" + proz + " % richtig. " + esc(urteil) + "</p></div>";
      const f = el("div", "qfoot");
      const b = el("button", "btn primary", "Neue Runde");
      b.type = "button";
      b.addEventListener("click", quizStart);
      f.appendChild(b);
      if (stand.quiz) f.appendChild(el("span", "qscore", "Bester Stand: " + stand.quiz.punkte + "/" + stand.quiz.gesamt));
      card.appendChild(f);
      host.appendChild(card);

      if (!stand.quiz || qPunkte / qStapel.length > stand.quiz.punkte / stand.quiz.gesamt) {
        stand.quiz = { punkte: qPunkte, gesamt: qStapel.length, zeit: Date.now() };
        sichere();
      }
      return;
    }

    const f = qStapel[qPos];
    const card = el("div", "qcard");
    card.innerHTML =
      '<div class="qnum">Frage ' + (qPos + 1) + " von " + qStapel.length + " · " + esc(f.kat) + "</div>" +
      '<div class="qfrage">' + esc(f.frage) + "</div>";

    const opts = el("div", "qopts");
    f.optionen.forEach((o, i) => {
      const b = el("button", "qopt", '<span class="mark">' + "ABCD"[i] + "</span><span>" + esc(o) + "</span>");
      b.type = "button";
      b.addEventListener("click", () => {
        if (qBeantwortet) return;
        qBeantwortet = true;
        const richtig = i === f.richtig;
        if (richtig) qPunkte++;
        Array.from(opts.children).forEach((c, ci) => {
          c.disabled = true;
          if (ci === f.richtig) c.dataset.ergebnis = "richtig";
          else if (ci === i) c.dataset.ergebnis = "falsch";
        });
        card.insertBefore(el("p", "qerkl", (richtig ? "<strong>Richtig.</strong> " : "<strong>Nicht ganz.</strong> ") + esc(f.erklaerung)), fuss);
        weiterBtn.disabled = false;
        weiterBtn.focus();
      });
      opts.appendChild(b);
    });
    card.appendChild(opts);

    const fuss = el("div", "qfoot");
    const weiterBtn = el("button", "btn primary", qPos === qStapel.length - 1 ? "Auswerten" : "Weiter");
    weiterBtn.type = "button";
    weiterBtn.disabled = true;
    weiterBtn.addEventListener("click", () => { qPos++; qBeantwortet = false; zeichneQuiz(); });
    fuss.appendChild(weiterBtn);
    fuss.appendChild(el("span", "qscore", "Punkte " + qPunkte + " · " + (stand.quiz ? "Bestwert " + stand.quiz.punkte + "/" + stand.quiz.gesamt : "noch kein Bestwert")));
    card.appendChild(fuss);

    host.appendChild(card);
  }

  /* --------------------------------------------------------- Klausur & Abi */

  function zeichneKlausur() {
    const f = $("#abi-fakten");
    f.className = "abifakten";
    f.innerHTML =
      '<div class="abifakt"><div class="k">Aufgabenarten</div><div class="v">' + ABI.aufgabenarten.map(esc).join("<br>") + "</div></div>" +
      ABI.zeit.map((z) => '<div class="abifakt"><div class="k">' + esc(z.niveau) + '</div><div class="v"><b>' + z.minuten + "</b> Minuten</div></div>").join("") +
      '<div class="abifakt"><div class="k">Hilfsmittel</div><div class="v">' + esc(ABI.hilfsmittel) + "</div></div>" +
      '<div class="abifakt" style="grid-column:1/-1"><div class="k">Wichtig</div><div class="v">' + esc(ABI.zeithinweis) + " " + esc(ABI.grundlage) + "</div></div>";

    const sp = $("#abi-schwerpunkte");
    sp.innerHTML = "";
    ABI.schwerpunkte.forEach((s) => {
      const n = el("div", "sp" + (s.aktuell ? " aktuell" : ""));
      n.innerHTML =
        '<div class="nr">Schwerpunkt ' + esc(s.nr) + (s.aktuell ? " · Themenbereich dieser Reihe" : "") + "</div>" +
        '<div class="bereich">' + esc(s.themenbereich) + "</div>" +
        "<h3>" + esc(s.titel) + "</h3>" +
        "<h5>Inhaltsfelder</h5><ul>" + s.inhaltsfelder.map((i) => "<li>" + esc(i) + "</li>").join("") + "</ul>" +
        "<h5>Zusätzlich auf erhöhtem Niveau</h5><ul>" + s.additum.map((i) => "<li>" + esc(i) + "</li>").join("") + "</ul>";
      sp.appendChild(n);
    });

    $("#abi-ablauf").innerHTML = ABI.ablauf.map((a) => "<li>" + fmt(a) + "</li>").join("") +
      "<li>" + fmt(ABI.hinweis) + "</li>";

    zeichneOperatoren("");
  }

  function zeichneOperatoren(q) {
    const host = $("#optabelle");
    host.innerHTML = "";
    q = q.trim().toLowerCase();
    const items = OPERATOREN.filter((o) => !q || (o.worte.join(" ") + " " + o.def).toLowerCase().indexOf(q) !== -1);
    let letzterAB = null;
    items.forEach((o) => {
      if (o.ab !== letzterAB) {
        letzterAB = o.ab;
        const r = el("tr", "abrow");
        r.innerHTML = '<td colspan="2">Anforderungsbereich ' + esc(o.ab) + "</td>";
        host.appendChild(r);
      }
      const r = el("tr");
      r.innerHTML =
        '<td class="worte">' + o.worte.map((w) => "<span>" + esc(w) + "</span>").join("") + "</td>" +
        '<td class="def">' + esc(o.def) + "</td>";
      host.appendChild(r);
    });
    if (!items.length) {
      host.innerHTML = '<tr><td colspan="2"><p class="leer">Kein Operator passt zu dieser Suche.</p></td></tr>';
    }
  }

  /* --------------------------------------------------------------- Aufgaben */

  function zeichneAufgaben() {
    const host = $("#todo");
    host.innerHTML = "";
    if (!AUFGABEN.length) { host.appendChild(el("p", "leer", "Bisher wurden keine Hausaufgaben vergeben.")); return; }
    AUFGABEN.forEach((a) => {
      const lab = el("label");
      const cb = el("input");
      cb.type = "checkbox";
      cb.id = "todo-" + a.id;
      cb.checked = !!stand.aufgaben[a.id];
      cb.addEventListener("change", () => {
        if (cb.checked) stand.aufgaben[a.id] = true;
        else delete stand.aufgaben[a.id];
        sichere();
        zeichneUebersicht();
      });
      const txt = el("span", "txt",
        '<span class="satz">' + fmt(a.text) + "</span>" +
        '<span class="meta">Aufgegeben am ' + esc(a.datum) + "</span>");
      lab.appendChild(cb);
      lab.appendChild(txt);
      host.appendChild(lab);
    });
  }

  /* ----------------------------------------------------------------- Aufbau */

  function zeichneAlles() {
    zeichneUebersicht();
    zeichneStunden();
    zeichneZeitstrahl();
    zeichneGlossar();
    zeichneKlausur();
    zeichneAufgaben();
    fcNeu();
  }

  function start() {
    themeStart();
    ladeLokal();
    bautNav();

    const themen = Array.from(new Set(STUNDEN.flatMap((s) => s.tags))).sort();
    bauFilter($("#stunden-filter"), themen, (k) => { stundenFilter = k; zeichneStunden(); });
    bauFilter($("#tl-filter"), Array.from(new Set(ZEITSTRAHL.map((z) => z.kat))), (k) => { tlFilter = k; zeichneZeitstrahl(); });
    bauFilter($("#gl-filter"), Array.from(new Set(GLOSSAR.map((g) => g.kat))).sort(), (k) => { glFilter = k; zeichneGlossar(); });
    bauFilter($("#fc-filter"), Array.from(new Set(KARTEN.map((k) => k.kat))).sort(), (k) => { fcFilter = k; fcNeu(); });

    $("#stunden-suche").addEventListener("input", (e) => { stundenSuche = e.target.value; zeichneStunden(); });
    $("#gl-suche").addEventListener("input", (e) => { glSuche = e.target.value; zeichneGlossar(); });
    $("#op-suche").addEventListener("input", (e) => zeichneOperatoren(e.target.value));

    $("#fcard").addEventListener("click", () => { if (!fcOffen) aufdecken(); else weiter(); });

    $("#reset").addEventListener("click", () => {
      if (!window.confirm("Wirklich den gesamten Lernfortschritt löschen?")) return;
      stand = JSON.parse(JSON.stringify(LEER));
      sichere();
      zeichneAlles();
    });

    document.addEventListener("keydown", (e) => {
      if ($("#view-karten").dataset.active !== "true") return;
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") { e.preventDefault(); fcOffen ? weiter() : aufdecken(); }
      if (e.key === "ArrowRight") { e.preventDefault(); weiter(); }
      if (fcOffen && (e.key === "1" || e.key === "j")) bewerte(true);
      if (fcOffen && (e.key === "2" || e.key === "n")) bewerte(false);
    });

    zeichneAlles();
    quizStart();
    zeige(location.hash.slice(1) || "uebersicht");
    window.addEventListener("hashchange", () => zeige(location.hash.slice(1)));

    verbindeCloud();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
