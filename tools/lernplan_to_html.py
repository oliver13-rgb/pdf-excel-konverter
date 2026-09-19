#!/usr/bin/env python3
"""Rendert Lernplan-Geschichte-LK.md als druckfertiges HTML (A4)."""
import io
import re
import sys

import markdown

CSS = u"""
@page { size: A4; margin: 17mm 15mm 16mm 15mm; }

* { box-sizing: border-box; }

:root {
  --navy:   #24476b;
  --navy-d: #16314d;
  --rule:   #d4dce5;
  --ink:    #1c2632;
  --muted:  #5b6b7c;
  --tint:   #f2f6fa;
  --warn:   #b45309;
  --warn-bg:#fdf6ec;
  --ok:     #2f6f4e;
  --star:   #a3690a;
}

body {
  font-family: "Liberation Sans", "DejaVu Sans", "Noto Color Emoji", sans-serif;
  font-size: 10.2pt;
  line-height: 1.52;
  color: var(--ink);
  margin: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

p { margin: 0 0 .62em; orphans: 2; widows: 2; }
strong { color: var(--navy-d); }
em { color: #34506b; }

/* ---------- Titelkopf ---------- */
h1 {
  font-size: 19pt; line-height: 1.2; color: var(--navy);
  margin: 0 0 .35em; padding-bottom: .28em;
  border-bottom: 2.5pt solid var(--navy);
  letter-spacing: -.2pt;
}
body > h1:first-child { font-size: 23pt; border-bottom-width: 3.5pt; }
body > h1:first-child + p {
  font-size: 10pt; color: var(--muted); background: var(--tint);
  border-left: 3pt solid var(--navy); padding: .6em .8em; margin-bottom: 1.1em;
}
body > h1:first-child + p strong { color: var(--navy-d); }
h1 ~ h1 { page-break-before: always; margin-top: 0; }

h2 {
  font-size: 13pt; color: var(--navy-d); margin: 1.5em 0 .5em;
  padding-bottom: .18em; border-bottom: 1pt solid var(--rule);
  page-break-after: avoid;
}
h3 {
  font-size: 11.2pt; color: var(--navy-d); margin: 1.25em 0 .45em;
  background: var(--tint); border-left: 3pt solid var(--navy);
  padding: .35em .6em; page-break-after: avoid;
}
h1 + h2, h1 + p + h2 { margin-top: .9em; }

hr { border: 0; border-top: .75pt solid var(--rule); margin: 1.4em 0; }
hr:has(+ h1) { display: none; }   /* Trennlinie direkt vor einem Hauptteil entfaellt */

/* ---------- Listen ---------- */
ul, ol { margin: .2em 0 .8em; padding-left: 1.35em; }
li { margin-bottom: .25em; page-break-inside: avoid; }
li > ul, li > ol { margin-top: .25em; }

/* Checkboxen aus "- [ ] ..." */
li.task { list-style: none; margin-left: -1.15em; padding-left: 1.5em; position: relative; }
li.task::before {
  content: ""; position: absolute; left: 0; top: .28em;
  width: .78em; height: .78em; border: 1pt solid var(--navy);
  border-radius: 1.5pt; background: #fff;
}

/* ---------- Tabellen ---------- */
table {
  width: 100%; border-collapse: collapse; margin: .5em 0 1em;
  font-size: 9.1pt; line-height: 1.38; page-break-inside: auto;
}
thead { display: table-header-group; }
tr { page-break-inside: avoid; }
th {
  background: var(--navy); color: #fff; font-weight: bold;
  text-align: left; padding: .42em .55em; border: .5pt solid var(--navy);
  vertical-align: bottom;
}
td { padding: .38em .55em; border: .5pt solid var(--rule); vertical-align: top; }
tbody tr:nth-child(even) td { background: #f7fafc; }
td strong, th strong { color: inherit; }
tbody td:first-child { font-weight: bold; color: var(--navy-d); }

/* ---------- Zitatblöcke / Merkkästen ---------- */
blockquote {
  margin: .7em 0; padding: .6em .85em;
  background: var(--warn-bg); border-left: 3pt solid var(--warn);
  page-break-inside: avoid; font-size: 9.8pt;
}
blockquote p:last-child { margin-bottom: 0; }
blockquote strong { color: #8a3d05; }

/* ---------- Codeblock (Zeitplan) ---------- */
pre {
  background: #f4f7fa; border: .5pt solid var(--rule); border-radius: 2pt;
  padding: .7em .85em; font-family: "Liberation Mono", "DejaVu Sans Mono", monospace;
  font-size: 8.6pt; line-height: 1.5; white-space: pre-wrap;
  page-break-inside: avoid; margin: .5em 0 1em;
}
code { font-family: "Liberation Mono", "DejaVu Sans Mono", monospace; font-size: 9pt; }
p code, li code, td code { background: #eef3f8; padding: .08em .3em; border-radius: 2pt; }

/* Zusammenhalt sinnvoller Blöcke */
h2 + p, h2 + table, h2 + ul, h3 + ul, h3 + p { page-break-before: avoid; }
"""

FOOT = u"""
<div class="endnote">Lernplan Geschichte-LK · Klausur 25.09.2026 · Spanische Expansion</div>
"""


def build(src, dst):
    text = io.open(src, encoding="utf-8").read()

    md = markdown.Markdown(extensions=["tables", "fenced_code", "sane_lists", "attr_list"])
    html = md.convert(text)

    # "- [ ] Aufgabe" -> echte Checkbox-Kacheln
    html = re.sub(r"<li>(\s*)\[ \]\s*", r'<li class="task">', html)
    html = re.sub(r"<li>(\s*)<p>\[ \]\s*", r'<li class="task"><p>', html)

    page = (
        u'<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
        u"<title>Lernplan Geschichte-LK — Klausur 25.09.2026</title>\n"
        u"<style>%s</style>\n</head>\n<body>\n%s\n</body>\n</html>\n" % (CSS, html)
    )
    io.open(dst, "w", encoding="utf-8").write(page)
    print("HTML geschrieben: %s (%d Zeichen)" % (dst, len(page)))


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2])
