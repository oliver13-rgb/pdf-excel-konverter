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
  --ink:    #1b2531;
  --navy:   #22405f;
  --navy-d: #16304a;
  --rule:   #dbe3ec;
  --rule-d: #b9c6d4;
  --tint:   #f5f8fb;
  --muted:  #64748b;
}

body {
  font-family: "Liberation Sans", "DejaVu Sans", "Noto Color Emoji", sans-serif;
  font-size: 10.2pt;
  line-height: 1.55;
  color: var(--ink);
  margin: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

p { margin: 0 0 .65em; orphans: 2; widows: 2; }
strong { font-weight: bold; color: var(--navy-d); }
em { font-style: italic; }

/* ---------- Kapitel ---------- */
h1 {
  font-size: 20pt; line-height: 1.22; color: var(--navy);
  margin: 0 0 1em; padding-bottom: .3em;
  border-bottom: 2.5pt solid var(--navy);
  page-break-before: always; page-break-after: avoid;
  letter-spacing: -.2pt;
}
body > h1:first-child {
  font-size: 26pt; page-break-before: auto;
  border-bottom: none; margin-bottom: .45em; padding-bottom: 0;
}
body > h1:first-child + p {
  font-size: 10pt; color: var(--muted); line-height: 1.5;
  border-left: 3pt solid var(--navy); padding: .1em 0 .1em .8em; margin-bottom: 1.6em;
}
body > h1:first-child + p strong { color: var(--navy); font-size: 11.5pt; }

h2 {
  font-size: 13pt; color: var(--navy-d); margin: 1.7em 0 .55em;
  padding-bottom: .2em; border-bottom: .75pt solid var(--rule);
  page-break-after: avoid;
}
h1 + h2 { margin-top: 0; }

h3 {
  font-size: 10.8pt; color: #34506b; margin: 1.3em 0 .45em;
  page-break-after: avoid;
}

hr { display: none; }

/* ---------- Stundenmarke ---------- */
p.lesson {
  display: inline-block; font-size: 7.6pt; letter-spacing: .4pt;
  text-transform: uppercase; color: var(--muted);
  background: var(--tint); border: .5pt solid var(--rule);
  border-radius: 2pt; padding: .25em .6em;
  margin: -.15em 0 1em;
}

/* ---------- Inhaltsverzeichnis ---------- */
.toc {
  background: var(--tint); border: .5pt solid var(--rule); border-radius: 3pt;
  padding: 1em 1.2em 1.1em; margin: 0 0 1.8em;
}
.toc-head {
  font-size: 11pt; font-weight: bold; color: var(--navy);
  margin-bottom: .7em; letter-spacing: .3pt;
}
.toc-list { list-style: none; counter-reset: toc; margin: 0; padding: 0; }
.toc-list li {
  display: flex; align-items: baseline; margin: .38em 0;
  counter-increment: toc; font-size: 10pt;
}
.toc-list li::before {
  content: counter(toc); order: 0; flex: 0 0 1.5em;
  font-weight: bold; color: var(--navy);
}
.toc-list .t { order: 1; flex: 0 1 auto; }
.toc-list li::after {
  content: ""; order: 2; flex: 1 1 auto;
  border-bottom: .75pt dotted var(--rule-d); margin: 0 .5em .3em;
}
.toc-list .p { order: 3; flex: 0 0 auto; font-weight: bold; color: var(--navy); }

/* ---------- Listen ---------- */
ul, ol { margin: .25em 0 .85em; padding-left: 1.4em; }
li { margin-bottom: .3em; page-break-inside: avoid; }
li > ul, li > ol { margin-top: .3em; }

li.task { list-style: none; margin-left: -1.2em; padding-left: 1.55em; position: relative; }
li.task::before {
  content: ""; position: absolute; left: 0; top: .3em;
  width: .8em; height: .8em; border: .75pt solid var(--navy);
  border-radius: 1.5pt; background: #fff;
}

/* ---------- Tabellen ---------- */
table {
  width: 100%; border-collapse: collapse; margin: .55em 0 1.1em;
  font-size: 9.1pt; line-height: 1.4; page-break-inside: auto;
}
thead { display: table-header-group; }
tr { page-break-inside: avoid; }
th {
  background: var(--navy); color: #fff; font-weight: bold;
  text-align: left; padding: .45em .6em; border: .5pt solid var(--navy);
  vertical-align: bottom;
}
td { padding: .42em .6em; border: .5pt solid var(--rule); vertical-align: top; }
tbody tr:nth-child(even) td { background: #f8fafc; }
tbody td:first-child { font-weight: bold; color: var(--navy-d); }
td strong { color: inherit; }

/* Kopflose Tabellen (erste Zeile leer) ruhiger setzen */
table.plain th { background: none; border-color: transparent; padding: 0; height: 0; }

/* ---------- Merkkästen ---------- */
blockquote {
  margin: .8em 0; padding: .65em .9em;
  background: var(--tint); border-left: 3pt solid var(--navy);
  page-break-inside: avoid; font-size: 9.8pt;
}
blockquote p:last-child { margin-bottom: 0; }

/* ---------- Codeblock ---------- */
pre {
  background: #f2f6fa; border: .5pt solid var(--rule); border-radius: 2pt;
  padding: .75em .9em; font-family: "Liberation Mono", "DejaVu Sans Mono", monospace;
  font-size: 8.5pt; line-height: 1.55; white-space: pre-wrap;
  page-break-inside: avoid; margin: .55em 0 1.1em;
}
code { font-family: "Liberation Mono", "DejaVu Sans Mono", monospace; font-size: 9pt; }
p code, li code, td code { background: #eef3f8; padding: .08em .3em; border-radius: 2pt; }

h2 + p, h2 + table, h2 + ul, h3 + ul, h3 + p, p.lesson + p, p.lesson + table {
  page-break-before: avoid;
}
"""


def build(src, dst):
    text = io.open(src, encoding="utf-8").read()

    md = markdown.Markdown(extensions=["tables", "fenced_code", "sane_lists", "attr_list"])
    html = md.convert(text)

    # "- [ ] Aufgabe" -> Checkbox-Kacheln
    html = re.sub(r"<li>(\s*)\[ \]\s*", r'<li class="task">', html)
    html = re.sub(r"<li>(\s*)<p>\[ \]\s*", r'<li class="task"><p>', html)

    # Tabellen ohne echte Kopfzeile erkennen und ruhiger setzen
    html = re.sub(
        r"<table>\s*<thead>\s*<tr>\s*(<th[^>]*>\s*</th>\s*)+</tr>",
        lambda m: '<table class="plain">' + m.group(0)[len("<table>"):],
        html,
    )

    page = (
        u'<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
        u"<title>Lernzettel Geschichte — Klausur 25.09.2026</title>\n"
        u"<style>%s</style>\n</head>\n<body>\n%s\n</body>\n</html>\n" % (CSS, html)
    )
    io.open(dst, "w", encoding="utf-8").write(page)
    return page


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2])
    print("HTML geschrieben:", sys.argv[2])
