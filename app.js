/*
 * PDF <-> Excel Konverter
 * Alles laeuft 100% im Browser (client-side). Es wird nichts hochgeladen.
 *
 * Verwendete Bibliotheken (per CDN eingebunden, siehe index.html):
 * - pdf.js        -> PDF lesen / Text extrahieren
 * - SheetJS (xlsx) -> Excel lesen / schreiben
 * - jsPDF + AutoTable -> PDF aus Tabellendaten erzeugen
 */

// PDF.js braucht einen Worker fuer die Hintergrundverarbeitung
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ---- DOM-Referenzen ----
const dropzone = document.getElementById("dropzone");
const dropzoneText = document.getElementById("dropzone-text");
const fileInput = document.getElementById("file-input");
const statusSection = document.getElementById("status");
const statusText = document.getElementById("status-text");
const resultSection = document.getElementById("result");
const resultText = document.getElementById("result-text");
const downloadLink = document.getElementById("download-link");
const resetBtn = document.getElementById("reset-btn");
const errorSection = document.getElementById("error");
const errorText = document.getElementById("error-text");
const modePdf2Xlsx = document.getElementById("mode-pdf2xlsx");
const modeXlsx2Pdf = document.getElementById("mode-xlsx2pdf");

// Aktueller Modus: "pdf2xlsx" oder "xlsx2pdf"
let currentMode = "pdf2xlsx";

// ---- Modus-Umschaltung ----
function setMode(mode) {
  currentMode = mode;
  if (mode === "pdf2xlsx") {
    modePdf2Xlsx.classList.add("active");
    modeXlsx2Pdf.classList.remove("active");
    fileInput.accept = ".pdf";
    dropzoneText.textContent = "PDF-Datei hierher ziehen oder klicken, um sie auszuwaehlen";
  } else {
    modeXlsx2Pdf.classList.add("active");
    modePdf2Xlsx.classList.remove("active");
    fileInput.accept = ".xlsx,.xls";
    dropzoneText.textContent = "Excel-Datei (.xlsx) hierher ziehen oder klicken, um sie auszuwaehlen";
  }
  resetUI();
}

modePdf2Xlsx.addEventListener("click", () => setMode("pdf2xlsx"));
modeXlsx2Pdf.addEventListener("click", () => setMode("xlsx2pdf"));

// ---- UI-Hilfsfunktionen ----
function resetUI() {
  statusSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  errorSection.classList.add("hidden");
  if (downloadLink.href && downloadLink.href.startsWith("blob:")) {
    URL.revokeObjectURL(downloadLink.href);
  }
  downloadLink.removeAttribute("href");
  fileInput.value = "";
}

function showStatus(text) {
  errorSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  statusText.textContent = text;
  statusSection.classList.remove("hidden");
}

function showResult(blob, filename) {
  statusSection.classList.add("hidden");
  errorSection.classList.add("hidden");
  const url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = filename;
  resultText.textContent = "Fertig! Deine Datei wurde lokal erstellt.";
  resultSection.classList.remove("hidden");
}

function showError(message) {
  statusSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  errorText.textContent = "Fehler: " + message;
  errorSection.classList.remove("hidden");
}

resetBtn.addEventListener("click", resetUI);

// ---- Drag & Drop / Datei-Auswahl ----
dropzone.addEventListener("click", () => fileInput.click());

dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  if (e.dataTransfer.files.length > 0) {
    handleFile(e.dataTransfer.files[0]);
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    handleFile(fileInput.files[0]);
  }
});

// ---- Haupt-Verarbeitung ----
function handleFile(file) {
  resetUI();

  const isPdf = file.name.toLowerCase().endsWith(".pdf");
  const isExcel = file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls");

  if (currentMode === "pdf2xlsx" && !isPdf) {
    showError("Bitte waehle eine PDF-Datei aus.");
    return;
  }
  if (currentMode === "xlsx2pdf" && !isExcel) {
    showError("Bitte waehle eine Excel-Datei (.xlsx) aus.");
    return;
  }

  if (currentMode === "pdf2xlsx") {
    convertPdfToXlsx(file);
  } else {
    convertXlsxToPdf(file);
  }
}

// ---- PDF -> Excel ----
async function convertPdfToXlsx(file) {
  try {
    showStatus("Lese PDF-Datei...");
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const workbook = XLSX.utils.book_new();

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      showStatus(`Verarbeite Seite ${pageNum} von ${pdf.numPages}...`);
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const rows = extractRowsFromTextContent(textContent);
      const sheet = XLSX.utils.aoa_to_sheet(rows);

      let sheetName = `Seite ${pageNum}`;
      if (sheetName.length > 31) sheetName = sheetName.substring(0, 31);
      XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    }

    showStatus("Erstelle Excel-Datei...");
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const outputName = file.name.replace(/\.pdf$/i, "") + ".xlsx";
    showResult(blob, outputName);
  } catch (err) {
    console.error(err);
    showError("PDF konnte nicht verarbeitet werden. " + err.message);
  }
}

// Wandelt die Textelemente einer PDF-Seite in Tabellenzeilen um.
// Heuristik: Elemente mit aehnlicher y-Position bilden eine Zeile.
// Innerhalb einer Zeile werden Elemente mit groesserem horizontalen Abstand
// als eigene Zellen (Spalten) behandelt.
function extractRowsFromTextContent(textContent) {
  const items = textContent.items
    .filter((item) => item.str !== undefined && item.str.trim() !== "")
    .map((item) => ({
      text: item.str,
      x: item.transform[4],
      y: item.transform[5],
      width: item.width,
    }));

  if (items.length === 0) return [[]];

  // Nach y-Position gruppieren (PDF-Koordinaten: y waechst nach oben,
  // daher sortieren wir absteigend, damit oben auf der Seite zuerst kommt)
  const Y_TOLERANCE = 3;
  items.sort((a, b) => b.y - a.y || a.x - b.x);

  const lines = [];
  for (const item of items) {
    let line = lines.find((l) => Math.abs(l.y - item.y) <= Y_TOLERANCE);
    if (!line) {
      line = { y: item.y, items: [] };
      lines.push(line);
    }
    line.items.push(item);
  }

  // Innerhalb jeder Zeile: nach x sortieren und Zellen anhand von Luecken trennen
  const GAP_THRESHOLD = 8; // grosszuegiger Schwellenwert in PDF-Punkten

  const rows = lines.map((line) => {
    line.items.sort((a, b) => a.x - b.x);
    const cells = [];
    let currentCell = "";
    let lastEndX = null;

    for (const item of line.items) {
      if (lastEndX !== null && item.x - lastEndX > GAP_THRESHOLD) {
        cells.push(currentCell.trim());
        currentCell = "";
      }
      currentCell += (currentCell ? " " : "") + item.text;
      lastEndX = item.x + item.width;
    }
    if (currentCell) cells.push(currentCell.trim());

    return cells;
  });

  return rows;
}

// ---- Excel -> PDF ----
async function convertXlsxToPdf(file) {
  try {
    showStatus("Lese Excel-Datei...");
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt" });

    let firstSheet = true;
    for (const sheetName of workbook.SheetNames) {
      showStatus(`Verarbeite Tabellenblatt "${sheetName}"...`);
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
        defval: "",
      });

      if (data.length === 0) continue;

      if (!firstSheet) {
        doc.addPage();
      }
      firstSheet = false;

      doc.setFontSize(12);
      doc.text(sheetName, 40, 30);

      const head = [data[0]];
      const body = data.slice(1);

      doc.autoTable({
        head: head,
        body: body,
        startY: 45,
        styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 40, right: 40 },
      });
    }

    showStatus("Erstelle PDF-Datei...");
    const blob = doc.output("blob");
    const outputName = file.name.replace(/\.xlsx?$/i, "") + ".pdf";
    showResult(blob, outputName);
  } catch (err) {
    console.error(err);
    showError("Excel-Datei konnte nicht verarbeitet werden. " + err.message);
  }
}

// Initialer Modus
setMode("pdf2xlsx");
