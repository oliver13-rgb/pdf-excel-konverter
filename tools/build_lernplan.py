#!/usr/bin/env python3
"""Baut das Lernzettel-PDF in zwei Durchgängen.

Durchgang 1 liefert die Seitenzahlen der Kapitel, Durchgang 2 trägt sie
ins Inhaltsverzeichnis ein.
"""
import io
import os
import re
import subprocess
import sys

import pymupdf

import lernplan_to_html

HERE = os.path.dirname(os.path.abspath(__file__))


def render_pdf(html_path, pdf_path, node_cwd):
    """node_cwd muss das Verzeichnis mit node_modules/playwright-core sein."""
    subprocess.check_call(
        ["node", os.path.join(HERE, "lernplan_to_pdf.mjs"),
         os.path.abspath(html_path), os.path.abspath(pdf_path)],
        cwd=node_cwd, stdout=subprocess.DEVNULL,
    )


def chapter_pages(pdf_path, count):
    """Seite, auf der jede Kapitelüberschrift '<n> ·' steht."""
    doc = pymupdf.open(pdf_path)
    pages = {}
    for i in range(doc.page_count):
        for line in doc[i].get_text().split("\n"):
            m = re.match(r"^(\d+)\s*·\s", line.strip())
            if m:
                n = int(m.group(1))
                if 1 <= n <= count and n not in pages:
                    pages[n] = i + 1
    doc.close()
    return pages


def fill_toc(html, pages):
    def sub(m):
        n = int(m.group(1))
        return m.group(0).replace('<span class="p"></span>',
                                  '<span class="p">%s</span>' % pages.get(n, ""))
    return re.sub(r'<li data-ch="(\d+)">.*?</li>', sub, html, flags=re.S)


def main(md_path, pdf_path, work_dir):
    pdf_path = os.path.abspath(pdf_path)
    html_path = os.path.join(work_dir, "lernplan.html")

    html = lernplan_to_html.build(md_path, html_path)
    n_ch = len(re.findall(r'<li data-ch="\d+">', html))

    render_pdf(html_path, pdf_path, work_dir)
    pages = chapter_pages(pdf_path, n_ch)
    missing = [n for n in range(1, n_ch + 1) if n not in pages]
    if missing:
        print("WARNUNG: keine Seitenzahl für Kapitel", missing)

    io.open(html_path, "w", encoding="utf-8").write(fill_toc(html, pages))
    render_pdf(html_path, pdf_path, work_dir)

    doc = pymupdf.open(pdf_path)
    print("PDF: %s (%d Seiten)" % (pdf_path, doc.page_count))
    print("Kapitelseiten:", ", ".join("%d→S.%d" % (k, pages[k]) for k in sorted(pages)))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
