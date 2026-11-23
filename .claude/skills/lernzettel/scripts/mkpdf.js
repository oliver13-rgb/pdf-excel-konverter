// Druckt eine Print-HTML (siehe SKILL.md, Schritt 5) als A4-PDF.
// Aufruf: node mkpdf.js <print.html> <ausgabe.pdf> "<Fußzeilen-Titel>"
// Erwartet in der Seite: window.__d = {cards, quiz, zs, ps, plan} (zs/ps optional).
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const [input, output, footer = 'Lernheft'] = process.argv.slice(2);
  if (!input || !output) { console.error('Aufruf: node mkpdf.js <print.html> <ausgabe.pdf> "<Titel>"'); process.exit(1); }
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.resolve(input), { waitUntil: 'networkidle' });
  await p.evaluate(() => {
    const d = window.__d || {};
    const $ = s => document.querySelector(s);
    document.querySelectorAll('section.view').forEach(s => s.hidden = false);
    document.querySelectorAll('details').forEach(x => x.open = true);

    // Tagesplan als Abhak-Liste
    if (d.plan && $('#plan-list')) {
      $('#plan-list').innerHTML = '<ol>' + d.plan.map(p => `<li>☐ <b>${p[0]}:</b> ${p[1]}</li>`).join('') + '</ol>';
      if ($('#plan-score')) $('#plan-score').textContent = '';
    }
    // Karteikarten als Frage → Antwort-Liste, nach Thema gruppiert
    if (d.cards && $('#v-karten .card')) {
      let h = '<h2><span class="mark">Karteikarten (Frage → Antwort)</span></h2><p class="muted">Antwort abdecken, laut beantworten, dann prüfen.</p>';
      let last = '';
      d.cards.forEach(c => { if (c[0] !== last) { h += `<h3 style="margin-top:14px">${c[0]}</h3>`; last = c[0]; } h += `<div class="pq">${c[1]}</div><div class="pa">${c[2]}</div>`; });
      $('#v-karten .card').innerHTML = h;
    }
    // Quiz: Fragen zuerst, Lösungen gesammelt am Ende
    if (d.quiz && $('#v-quiz .card')) {
      let qh = '<h2><span class="mark">Quiz</span></h2><p class="muted">Lösungen stehen am Ende des Abschnitts.</p><ol>';
      d.quiz.forEach(x => { qh += `<li style="margin-bottom:8px"><b>${x[0]}</b><br>${x[1].map((o, i) => 'abcd'[i] + ') ' + o).join('<br>')}</li>`; });
      qh += '</ol><h3>Lösungen</h3><ol>' + d.quiz.map(x => `<li><b>${'abcd'[x[2]]})</b> ${x[3]}</li>`).join('') + '</ol>';
      $('#v-quiz .card').innerHTML = qh;
    }
    // Zuordnen: Lücken + Lösungen darunter. d.zs = [[satz, lösung, begründung]], d.ps = [[satz, lösung]], d.zLegend / d.pLegend optional
    if ((d.zs || d.ps) && $('#v-zuordnen')) {
      let zh = '<div class="card">';
      if (d.zs) zh += `<h2><span class="mark t">${d.zTitle || 'Zuordnen'}</span></h2>${d.zLegend ? `<p style="font-size:13px">${d.zLegend}</p>` : ''}<ol>${d.zs.map(x => `<li>${x[0]} &nbsp;→ ____</li>`).join('')}</ol>`;
      if (d.ps) zh += `<h2 style="margin-top:14px"><span class="mark">${d.pTitle || 'Zuordnen 2'}</span></h2>${d.pLegend ? `<p style="font-size:13px">${d.pLegend}</p>` : ''}<ol>${d.ps.map(x => `<li>${x[0]} &nbsp;→ ____</li>`).join('')}</ol>`;
      zh += '<h3 style="margin-top:14px">Lösungen</h3>';
      if (d.zs) zh += `<p>${d.zs.map((x, i) => `${i + 1}) ${x[1]}${x[2] ? ' – ' + x[2] : ''}`).join(' · ')}</p>`;
      if (d.ps) zh += `<p>${d.ps.map((x, i) => `${i + 1}) ${(d.pLabels && d.pLabels[x[1]]) || x[1]}`).join(' · ')}</p>`;
      $('#v-zuordnen').innerHTML = zh + '</div>';
    }
  });
  await p.pdf({
    path: output, format: 'A4', printBackground: true,
    margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: `<div style="font-size:8px;width:100%;text-align:center;color:#888">${footer} · Seite <span class="pageNumber"></span>/<span class="totalPages"></span></div>`
  });
  await b.close();
})();
