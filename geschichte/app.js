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

  const LEER = { gelernt: {}, boxen: {}, aufgaben: {}, quiz: {} };

  /** Frühere Fassung speicherte genau einen Quiz-Bestwert statt einen je Fach. */
  function migriere(s) {
    if (s.quiz && typeof s.quiz.punkte === "number") s.quiz = { Alle: s.quiz };
    if (!s.quiz) s.quiz = {};
    return s;
  }
  const SPEICHER = "geschichte-s1-fortschritt";
  let stand = JSON.parse(JSON.stringify(LEER));
  let cloud = null;
  let schreibTimer = null;

  function ladeLokal() {
    try {
      const roh = localStorage.getItem(SPEICHER);
      if (roh) stand = migriere(Object.assign(JSON.parse(JSON.stringify(LEER)), JSON.parse(roh)));
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
          stand = migriere(Object.assign(JSON.parse(JSON.stringify(LEER)), JSON.parse(d.stand)));
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

  const GRUPPEN = [
    { gruppe: null, eintraege: [{ id: "uebersicht", label: "Übersicht" }] },
    {
      gruppe: "Geschichte", eintraege: [
        { id: "stunden", label: "Stunden" },
        { id: "zeitstrahl", label: "Zeitstrahl" },
        { id: "begriffe", label: "Begriffe" }
      ]
    },
    {
      gruppe: "Seminarfach", eintraege: [
        { id: "seminar", label: "Sitzungen" },
        { id: "werkstatt", label: "Schreibwerkstatt" }
      ]
    },
    {
      gruppe: "Üben", eintraege: [
        { id: "karten", label: "Karteikarten" },
        { id: "quiz", label: "Quiz" }
      ]
    },
    {
      gruppe: "Prüfung", eintraege: [
        { id: "klausur", label: "Operatoren & Abi" },
        { id: "aufgaben", label: "Aufgaben" }
      ]
    }
  ];

  const BEREICHE = GRUPPEN.reduce((a, g) => a.concat(g.eintraege), []);
  const navKnoepfe = {};

  function bautNav() {
    const nav = $("#nav");
    GRUPPEN.forEach((g) => {
      if (g.gruppe) nav.appendChild(el("span", "navgruppe", esc(g.gruppe)));
      g.eintraege.forEach((b) => {
        const btn = el("button", null, "<span>" + esc(b.label) + "</span>");
        btn.type = "button";
        btn.addEventListener("click", () => zeige(b.id));
        nav.appendChild(btn);
        navKnoepfe[b.id] = btn;
      });
    });
  }

  function zeige(id) {
    if (!BEREICHE.some((b) => b.id === id)) id = "uebersicht";
    BEREICHE.forEach((b) => {
      const aktiv = b.id === id;
      $("#view-" + b.id).dataset.active = aktiv ? "true" : "false";
      navKnoepfe[b.id].setAttribute("aria-current", aktiv ? "true" : "false");
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

  function bauFilter(host, kats, beiWahl, alleLabel) {
    const ALLE = alleLabel || "Alle";
    host.innerHTML = "";
    [ALLE].concat(kats).forEach((k) => {
      const b = el("button", null, esc(k));
      b.type = "button";
      b.setAttribute("aria-pressed", k === ALLE ? "true" : "false");
      b.addEventListener("click", () => {
        Array.from(host.children).forEach((c) => c.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        beiWahl(k === ALLE ? null : k);
      });
      host.appendChild(b);
    });
  }

  /* -------------------------------------------------------------- Übersicht */

  function fachVon(x) { return x.fach || "Geschichte"; }

  function springeZu(bereich, id) {
    zeige(bereich);
    const d = document.getElementById("st-" + id);
    if (d) { d.open = true; d.scrollIntoView({ block: "center" }); }
  }

  function strangKarte(opt) {
    const n = el("div", "strang");
    n.innerHTML =
      '<div class="nr">' + esc(opt.eyebrow) + "</div>" +
      "<h3>" + esc(opt.titel) + "</h3>" +
      '<p class="strangtext">' + esc(opt.text) + "</p>" +
      '<div class="strangzahlen">' + opt.zahlen.map((z) =>
        '<span><b>' + z.v + "</b> " + esc(z.k) + "</span>").join("") + "</div>" +
      '<div class="letzte"><span class="chip accent">' + esc(opt.letzte.datum) + "</span>" +
      '<div class="lt">' + esc(opt.letzte.titel) + "</div></div>";
    const b = el("div", "fcbtns");
    const go = el("button", "btn primary", opt.knopf);
    go.type = "button";
    go.addEventListener("click", () => springeZu(opt.bereich, opt.letzte.id));
    b.appendChild(go);
    n.appendChild(b);
    return n;
  }

  function zeichneUebersicht() {
    const neueste = STUNDEN[0];
    const neuesteSem = SEMINAR.sitzungen[0];
    const letzterTermin = [neueste.datum, neuesteSem.datum]
      .sort((a, b) => a.split(".").reverse().join("") < b.split(".").reverse().join("") ? 1 : -1)[0];

    $("#hero-meta").innerHTML =
      "<span><b>" + esc(KURS.profil) + "</b></span>" +
      "<span>Geschichte <b>" + esc(KURS.kurs) + " · " + esc(KURS.lehrkraft) + "</b></span>" +
      "<span>Schuljahr <b>" + esc(KURS.schuljahr) + "</b></span>" +
      "<span>Stand <b>" + esc(letzterTermin) + "</b></span>";

    const alleSitzungen = STUNDEN.length + SEMINAR.sitzungen.length;
    const gelernt = STUNDEN.concat(SEMINAR.sitzungen).filter((s) => stand.gelernt[s.id]).length;
    const inBox3 = KARTEN.filter((k) => (stand.boxen[schluessel(k.f)] || 1) >= 3).length;
    const offen = AUFGABEN.filter((a) => !stand.aufgaben[a.id]).length;

    const stats = [
      { k: "Termine erfasst", v: alleSitzungen, sub: gelernt + " als gelernt markiert", pct: gelernt / alleSitzungen },
      { k: "Karteikarten", v: KARTEN.length, sub: inBox3 + " sitzen sicher", pct: inBox3 / KARTEN.length },
      { k: "Begriffe im Glossar", v: GLOSSAR.length, sub: "beide Fächer zusammen", pct: null },
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

    const str = $("#straenge");
    str.innerHTML = "";
    str.appendChild(strangKarte({
      eyebrow: "Geschichte S1 · P4 — der Inhalt",
      titel: KURS.reihe,
      text: "Was im Geschichtsunterricht passiert ist: Weltbild, Expansion, Kulturtheorie. Hier steht der Stoff, den die Klausur abfragt.",
      zahlen: [
        { v: STUNDEN.length, k: "Stunden" },
        { v: ZEITSTRAHL.filter((z) => fachVon(z) === "Geschichte").length, k: "Daten" },
        { v: GLOSSAR.filter((g) => fachVon(g) === "Geschichte").length, k: "Begriffe" }
      ],
      letzte: neueste,
      bereich: "stunden",
      knopf: "Zur letzten Stunde"
    }));
    str.appendChild(strangKarte({
      eyebrow: "Seminarfach — die Methode",
      titel: SEMINAR.titel,
      text: "Wie man mit dem Stoff umgeht: Quellenkritik, Analyseschritte, Operatoren. Hier steht das Handwerk für den schriftlichen Teil.",
      zahlen: [
        { v: SEMINAR.sitzungen.length, k: "Sitzungen" },
        { v: WERKSTATT.length, k: "Werkzeuge" },
        { v: GLOSSAR.filter((g) => fachVon(g) === "Seminar").length, k: "Begriffe" }
      ],
      letzte: neuesteSem,
      bereich: "seminar",
      knopf: "Zur letzten Sitzung"
    }));

    const lfb = $("#leitfragen-box");
    lfb.innerHTML = "";
    const lfG = el("div", "panel");
    lfG.innerHTML = '<div class="panelkopf"><span class="chip accent">Geschichte</span> Leitfragen der Unterrichtsreihe</div>' +
      '<ol class="leitfragen">' + KURS.leitfragen.map((f) => "<li>" + esc(f) + "</li>").join("") + "</ol>";
    const lfS = el("div", "panel");
    lfS.innerHTML = '<div class="panelkopf"><span class="chip brass">Seminarfach</span> Leitfrage des Halbjahres</div>' +
      '<p class="grossefrage">' + esc(SEMINAR.leitfrage) + "</p>" +
      '<p class="fuss">' + esc(SEMINAR.leitfrageZusatz) + "</p>";
    lfb.appendChild(lfG);
    lfb.appendChild(lfS);

    const br = $("#bruecken");
    br.innerHTML = "";
    const bl = el("div", "bruecken");
    BRUECKEN.forEach((b) => {
      bl.appendChild(el("div", "bruecke",
        '<div class="von"><span class="chip brass">Seminar</span>' + esc(b.methode) + "</div>" +
        '<div class="pfeil" aria-hidden="true">→</div>' +
        '<div class="nach"><span class="chip accent">Geschichte</span>' + esc(b.ziel) +
        '<p>' + esc(b.text) + "</p></div>"));
    });
    br.appendChild(bl);

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

      case "bausteine": {
        let h = '<div class="block breit"><h4>' + esc(b.h) + '</h4><div class="bausteine">';
        h += b.items.map((i) =>
          '<div class="phase"><div class="phasekopf"><span class="pname">' + esc(i.phase) + "</span>" +
          (i.hinweis ? '<span class="phinweis">' + esc(i.hinweis) + "</span>" : "") + "</div>" +
          '<ul class="saetze">' + i.saetze.map((s) => "<li>" + esc(s) + "</li>").join("") + "</ul></div>").join("");
        return h + "</div></div>";
      }

      case "verweis":
        return '<div class="block"><p class="verweis" data-ziel="' + esc(b.ziel) + '">' + fmt(b.text) + "</p></div>";

      case "schema":
        return schemaTO();

      default:
        return "";
    }
  }

  /** Verweis-Absätze klickbar machen (nach dem Einfügen aufrufen). */
  function verkabelnVerweise(root) {
    root.querySelectorAll(".verweis[data-ziel]").forEach((p) => {
      p.setAttribute("role", "button");
      p.setAttribute("tabindex", "0");
      const hin = () => zeige(p.dataset.ziel);
      p.addEventListener("click", hin);
      p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.code === "Space") { e.preventDefault(); hin(); } });
    });
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
  let seminarFilter = null;
  let seminarSuche = "";

  function zeichneStunden() {
    renderSitzungen({
      liste: STUNDEN, host: $("#stundenliste"), filter: stundenFilter, suche: stundenSuche,
      wort: "Stunde", einheit: "Stunde"
    });
  }

  function zeichneSeminar() {
    renderSitzungen({
      liste: SEMINAR.sitzungen, host: $("#seminarliste"), filter: seminarFilter, suche: seminarSuche,
      wort: "Sitzung", einheit: "Sitzung"
    });
  }

  function renderSitzungen(opt) {
    const host = opt.host;
    host.innerHTML = "";
    const q = opt.suche.trim().toLowerCase();

    const treffer = opt.liste.filter((s) => {
      if (opt.filter && s.tags.indexOf(opt.filter) === -1) return false;
      if (!q) return true;
      return JSON.stringify(s).toLowerCase().indexOf(q) !== -1;
    });

    if (!treffer.length) {
      host.appendChild(el("p", "leer", "Keine " + opt.wort + " passt zu dieser Suche."));
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
        '<span class="chip">' + esc(opt.einheit) + " " + s.nr + "</span>" +
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
      verkabelnVerweise(koerper);
      d.appendChild(koerper);
      host.appendChild(d);
    });
  }

  /* ------------------------------------------------------ Schreibwerkstatt */

  function zeichneWerkstatt() {
    const nav = $("#werkstatt-nav");
    const host = $("#werkstatt");
    nav.innerHTML = "";
    host.innerHTML = "";

    WERKSTATT.forEach((w) => {
      const a = el("button", "wtab", esc(w.titel));
      a.type = "button";
      a.addEventListener("click", () => {
        const ziel = document.getElementById("wz-" + w.id);
        if (ziel) ziel.scrollIntoView({ block: "start", behavior: "smooth" });
      });
      nav.appendChild(a);

      const sec = el("section", "werkzeug");
      sec.id = "wz-" + w.id;
      const sitzung = SEMINAR.sitzungen.filter((s) => s.id === w.sitzung)[0];
      sec.innerHTML =
        '<div class="wkopf"><h3>' + esc(w.titel) + "</h3>" +
        '<p>' + esc(w.untertitel) + "</p>" +
        (sitzung ? '<span class="chip brass">Seminarfach · ' + esc(sitzung.datum) + "</span>" : "") + "</div>";
      sec.insertAdjacentHTML("beforeend", w.bloecke.map(blockHtml).join(""));
      verkabelnVerweise(sec);
      host.appendChild(sec);
    });
  }

  function zeichneSeminarRahmen() {
    $("#seminar-unter").textContent = SEMINAR.untertitel;
    const host = $("#seminar-rahmen");
    host.innerHTML = "";

    const p = el("div", "panel");
    p.innerHTML =
      '<div class="panelkopf"><span class="chip brass">Leitfrage des Halbjahres</span></div>' +
      '<p class="grossefrage">' + esc(SEMINAR.leitfrage) + "</p>" +
      '<p class="fuss">' + esc(SEMINAR.leitfrageZusatz) + "</p>";
    host.appendChild(p);

    const g = el("div", "grid two");
    g.style.marginTop = "14px";
    const fp = el("div", "panel");
    fp.innerHTML = '<div class="panelkopf">Fahrplan durch das Halbjahr</div>' +
      '<div class="stufen">' + SEMINAR.fahrplan.map((f) =>
        '<div class="stufe"><div class="num"></div><div><h5>' + esc(f.k) + "</h5><ul><li>" + esc(f.v) + "</li></ul></div></div>").join("") + "</div>";
    const sp = el("div", "panel");
    sp.innerHTML = '<div class="panelkopf">Die vier Semester</div>' +
      '<ul class="punkte">' + SEMINAR.semester.map((s) =>
        "<li><strong>" + esc(s.k) + "</strong><br>" + esc(s.v) + "</li>").join("") + "</ul>" +
      '<p class="fuss">' + esc(SEMINAR.grundlage) + "</p>";
    g.appendChild(fp);
    g.appendChild(sp);
    host.appendChild(g);
  }

  /* ------------------------------------------------------------- Zeitstrahl */

  let tlFilter = null;
  let tlFach = null;

  function zeichneZeitstrahl() {
    const host = $("#zeitstrahl");
    host.innerHTML = "";
    const items = ZEITSTRAHL
      .filter((z) => !tlFach || fachVon(z) === tlFach)
      .filter((z) => !tlFilter || z.kat === tlFilter);
    if (!items.length) { host.appendChild(el("p", "leer", "Keine Einträge in dieser Auswahl.")); return; }
    items.forEach((z) => {
      host.appendChild(el("div", "tlitem" + (fachVon(z) === "Seminar" ? " sem" : ""),
        '<span class="jahr">' + esc(z.jahr) + "</span>" +
        "<h4>" + esc(z.titel) + "</h4>" +
        "<p>" + esc(z.text) + "</p>" +
        '<span class="chip' + (fachVon(z) === "Seminar" ? " brass" : "") + '">' + esc(z.kat) + "</span>"));
    });
  }

  /* ---------------------------------------------------------------- Glossar */

  let glFilter = null;
  let glFach = null;
  let glSuche = "";

  function zeichneGlossar() {
    const host = $("#glossar");
    host.innerHTML = "";
    const q = glSuche.trim().toLowerCase();
    const items = GLOSSAR
      .filter((g) => !glFach || fachVon(g) === glFach)
      .filter((g) => !glFilter || g.kat === glFilter)
      .filter((g) => !q || (g.begriff + " " + g.kurz + " " + g.lang).toLowerCase().indexOf(q) !== -1);

    if (!items.length) { host.appendChild(el("p", "leer", "Kein Begriff passt zu dieser Suche.")); return; }

    items.forEach((g) => {
      const sem = fachVon(g) === "Seminar";
      const wrap = el("div", "gterm");
      wrap.innerHTML =
        "<dt>" + esc(g.begriff) + '<span class="chip' + (sem ? " brass" : " accent") + '">' +
        (sem ? "Seminar · " : "") + esc(g.kat) + "</span></dt>" +
        '<dd><p class="kurz">' + esc(g.kurz) + '</p><p class="lang">' + esc(g.lang) + "</p></dd>";
      host.appendChild(wrap);
    });
  }

  /** Kategorien, die es im gewählten Fach überhaupt gibt. */
  function katsFuer(liste, fach) {
    return Array.from(new Set(liste.filter((x) => !fach || fachVon(x) === fach).map((x) => x.kat))).sort();
  }

  /* ----------------------------------------------------------- Karteikarten */

  let fcFilter = null;
  let fcFach = null;
  let fcStapel = [];
  let fcPos = 0;
  let fcOffen = false;

  function fcKarten() {
    return KARTEN
      .filter((k) => !fcFach || fachVon(k) === fcFach)
      .filter((k) => !fcFilter || k.kat === fcFilter);
  }

  function fcAuswahl() {
    const alle = fcKarten();
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
    $("#fc-kat").textContent = fachVon(karte) + " · " + karte.kat;

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
    const alle = fcKarten();
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
  let quizFach = null;

  function quizKey() { return quizFach || "Alle"; }

  function bestwert() {
    return (stand.quiz && stand.quiz[quizKey()]) || null;
  }

  function bestwertText() {
    const b = bestwert();
    return b ? "Bestwert " + b.punkte + "/" + b.gesamt : "noch kein Bestwert";
  }

  function quizStart() {
    qStapel = mische(QUIZ.filter((f) => !quizFach || fachVon(f) === quizFach));
    qPos = 0;
    qPunkte = 0;
    qBeantwortet = false;
    zeichneQuiz();
  }

  function zeichneQuiz() {
    const host = $("#quizwrap");
    host.innerHTML = "";

    if (!qStapel.length) {
      host.appendChild(el("p", "leer", "Für diese Auswahl gibt es noch keine Fragen."));
      return;
    }

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
      const alt = bestwert();
      if (alt) f.appendChild(el("span", "qscore", "Bester Stand (" + quizKey() + "): " + alt.punkte + "/" + alt.gesamt));
      card.appendChild(f);
      host.appendChild(card);

      if (!alt || qPunkte / qStapel.length > alt.punkte / alt.gesamt) {
        if (!stand.quiz) stand.quiz = {};
        stand.quiz[quizKey()] = { punkte: qPunkte, gesamt: qStapel.length, zeit: Date.now() };
        sichere();
      }
      return;
    }

    const f = qStapel[qPos];
    const card = el("div", "qcard");
    card.innerHTML =
      '<div class="qnum">Frage ' + (qPos + 1) + " von " + qStapel.length + " · " + esc(fachVon(f)) + " · " + esc(f.kat) + "</div>" +
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
    fuss.appendChild(el("span", "qscore", "Punkte " + qPunkte + " · " + bestwertText()));
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
    zeichneSeminarRahmen();
    zeichneSeminar();
    zeichneWerkstatt();
    zeichneZeitstrahl();
    zeichneGlossar();
    zeichneKlausur();
    zeichneAufgaben();
    fcNeu();
  }

  const FAECHER = ["Geschichte", "Seminar"];

  function start() {
    themeStart();
    ladeLokal();
    bautNav();

    bauFilter($("#stunden-filter"), Array.from(new Set(STUNDEN.flatMap((s) => s.tags))).sort(),
      (k) => { stundenFilter = k; zeichneStunden(); });
    bauFilter($("#seminar-filter"), Array.from(new Set(SEMINAR.sitzungen.flatMap((s) => s.tags))).sort(),
      (k) => { seminarFilter = k; zeichneSeminar(); });

    bauFilter($("#tl-fach"), FAECHER, (f) => {
      tlFach = f; tlFilter = null;
      bauFilter($("#tl-filter"), katsFuer(ZEITSTRAHL, f), (k) => { tlFilter = k; zeichneZeitstrahl(); });
      zeichneZeitstrahl();
    }, "Beide Fächer");
    bauFilter($("#tl-filter"), katsFuer(ZEITSTRAHL, null), (k) => { tlFilter = k; zeichneZeitstrahl(); });

    bauFilter($("#gl-fach"), FAECHER, (f) => {
      glFach = f; glFilter = null;
      bauFilter($("#gl-filter"), katsFuer(GLOSSAR, f), (k) => { glFilter = k; zeichneGlossar(); });
      zeichneGlossar();
    }, "Beide Fächer");
    bauFilter($("#gl-filter"), katsFuer(GLOSSAR, null), (k) => { glFilter = k; zeichneGlossar(); });

    bauFilter($("#fc-fach"), FAECHER, (f) => {
      fcFach = f; fcFilter = null;
      bauFilter($("#fc-filter"), katsFuer(KARTEN, f), (k) => { fcFilter = k; fcNeu(); });
      fcNeu();
    }, "Beide Fächer");
    bauFilter($("#fc-filter"), katsFuer(KARTEN, null), (k) => { fcFilter = k; fcNeu(); });

    bauFilter($("#quiz-fach"), FAECHER, (f) => { quizFach = f; quizStart(); }, "Beide Fächer");

    $("#stunden-suche").addEventListener("input", (e) => { stundenSuche = e.target.value; zeichneStunden(); });
    $("#seminar-suche").addEventListener("input", (e) => { seminarSuche = e.target.value; zeichneSeminar(); });
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
