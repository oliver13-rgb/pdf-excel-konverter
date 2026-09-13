/* =========================================================================
   Kursarchiv Geschichte S1 (P4) — Inhaltsdaten
   -------------------------------------------------------------------------
   Diese Datei ist die EINZIGE Datei, die pro Unterrichtswoche wächst.
   Neue Stunde ergänzen: Objekt vorne in STUNDEN einfügen (neu: true setzen,
   bei der Vorwoche neu auf false), dann passende Einträge in ZEITSTRAHL,
   GLOSSAR, KARTEN, QUIZ und AUFGABEN ergänzen. Feldbeschreibung: README.md
   ========================================================================= */

const KURS = {
  fach: "Geschichte",
  kurs: "S1 (P4)",
  lehrkraft: "Tony Gugenheimer",
  reihe: "Vom mittelalterlichen Weltbild zur europäischen Expansion",
  themenbereich: "Kulturbegegnungen – Europa und die Welt",
  abiturjahrgang: 2028,
  leitfragen: [
    "Welches Weltbild löst die Mappa mundi ab – und was bleibt von ihr?",
    "Warum geht die Expansion von Europa aus und nicht von woanders, z. B. China?",
    "Entdeckung oder Eroberung? Welche Auswirkungen haben die Perspektiven der Quelle?",
    "Welche Folgen der Expansion prägen unsere Gegenwart bis heute?"
  ]
};

/* ---------------------------------------------------------------- STUNDEN */

const STUNDEN = [
  {
    id: "2026-09-11",
    nr: 4,
    datum: "11.09.2026",
    titel: "Kultur definieren – und Huntingtons „Kampf der Kulturen“",
    untertitel: "Von der Arbeitsdefinition über das Filmbeispiel Dune zur kontroversen These",
    tags: ["Kulturtheorie", "Begriffsarbeit", "Kontroverse"],
    neu: true,
    wiederholung: "Einstieg mit den Folien der Vorstunde: Kulturbegriff (eng / weit / wertend), Bitterlis vier Stufen, Akkulturation – Assimilation – Koexistenz.",
    bloecke: [
      {
        t: "definition",
        h: "Was ist Kultur? — die Arbeitsdefinition des Kurses",
        text: "Kultur bezeichnet alle Erscheinungsformen des menschlichen Daseins, die auf bestimmten **Wertvorstellungen** und **erlernten Verhaltensweisen** beruhen, **veränderlich** sind und (an die nächsten Generationen) **tradiert** werden.",
        zusatz: "→ Gegenbegriff zu „Natur“ (= vom Menschen nicht beeinflusst). Entscheidend ist der UMGANG mit der Natur, nicht die Natur selbst."
      },
      {
        t: "liste",
        h: "Filmbeispiel Dune — ein Kulturkontakt im Labor",
        items: [
          "Wüstenplanet, fast vollständig mit Sand bedeckt, bis zu 90 Grad",
          "Kolonisten treffen auf einen der Anführer der indigenen Bevölkerung",
          "Ein Scout war vorgeschickt worden und ist beim Treffen im Raum anwesend",
          "→ Einordnung nach Bitterli: **Kulturkontakt** (dauerhafte Berührung, kein Gleichgewicht der Partner)"
        ]
      },
      {
        t: "quelle",
        h: "Huntingtons These",
        text: "Der nächste Weltkrieg wird nicht zwischen Staaten, sondern zwischen Kulturen geführt werden.",
        autor: "Samuel Huntington",
        werk: "Clash of Civilisations",
        jahr: "1992/1993",
        hinweis: "Impuls im Unterricht: Gibt es aktuelle Konflikte, die diese These stützen könnten?"
      },
      {
        t: "auftrag",
        h: "Arbeitsauftrag",
        text: "Erläutere Huntingtons Theorie vom Kampf der Kulturen. — Hilfsimpuls: „Wie würdet ihr die Theorie jemandem erklären, der keine Ahnung vom Thema hat?“",
        antwort: [
          "Kulturkampf ist **vermeidbar**, wenn es globale Akzeptanz unterschiedlicher Werte gibt",
          "Zum Kampf kommt es dann, wenn **Wertesysteme kollidieren** – nach sehr spezifischen Kriterien, z. B. Sprache, Glaube",
          "Huntington unterteilt in „größere“ und „kleinere“ **Kulturkreise** anstelle von politischen Ideologien/Gesellschaftssystemen (z. B. Kapitalismus, Sozialismus) – Achtung auf das Machtgleichgewicht"
        ]
      },
      {
        t: "merke",
        text: "Schwierigkeit der These: Kultur wird in Konflikten häufig **als Deckmantel missbraucht** – für eigentlich politische, ökonomische oder territoriale Beweggründe."
      },
      {
        t: "geruest",
        h: "Schreibgerüst: Diskutieren Sie, inwiefern Huntington Kulturen als Chance oder als Bedrohung begreift",
        einleitung: "„Huntingtons Theorie vom Kampf der Kulturen ist äußerst kontrovers zu sehen, insbesondere, ob sie eher als Chance oder als Bedrohung anzusehen ist. (…) Dem kann jedoch nur teilweise zugestimmt werden:“",
        schritte: [
          "Zum einen …",
          "Darüber hinaus …",
          "Schließlich / Schlussendlich / Außerdem …",
          "Zwar könnte angeführt werden, dass … Aber …",
          "Fazit"
        ]
      }
    ],
    hausaufgabe: null
  },

  {
    id: "2026-09-04",
    nr: 3,
    datum: "04.09.2026",
    titel: "Kulturen – der Begriff, mit dem alles anfängt",
    untertitel: "Begriffsarbeit, Bitterlis Kulturtheorie und Cortés’ Eroberung des Aztekenreichs",
    tags: ["Kulturtheorie", "Begriffsarbeit", "Eroberung"],
    neu: false,
    wiederholung: "Einstieg mit der Vorstunde: „Neue Welt“ als kritischer Begriff und die Quellenarbeit zum Vertrag von Santa Fe (Q4).",
    bloecke: [
      {
        t: "wolke",
        h: "Was gehört alles zu „Kultur“? — Sammlung im Kurs",
        items: ["Tradition", "Musik, Kunst", "Essen", "Wertvorstellungen (Körper, Geist usw.)", "Sprache(n)", "familiäre Beziehungen", "Glaube", "Kleidungsstil", "Tänze", "Architektur", "Schmuck", "Leitbilder / ikonische Vorbilder", "Umgang mit der eigenen Geschichte", "Feiertage", "Erziehung", "Fokus/Ausrichtung der Bildung"]
      },
      {
        t: "karten",
        h: "Was meinen wir, wenn wir „Kultur“ sagen? — drei Begriffe",
        eyebrow: "Begriffsarbeit",
        items: [
          { k: "Der enge Begriff", v: "Kultur als Kunst, Literatur, Musik, Architektur – das, was eine Gesellschaft an Werken hervorbringt." },
          { k: "Der weite Begriff", v: "Kultur als Gesamtheit der Lebensformen: Sprache, Religion, Recht, Wirtschaft, Essen, Kleidung, Vorstellungen von Zeit und Tod." },
          { k: "Der wertende Begriff", v: "„Kultur“ als Gegenbegriff zu „Barbarei“ oder „Natur“ – historisch das gefährlichste Verständnis." }
        ]
      },
      {
        t: "merke",
        text: "Kulturen sind **keine geschlossenen Behälter mit klaren Rändern**. Sie sind veränderlich, in sich widersprüchlich und stehen seit jeher im Austausch. Wer von „der“ europäischen oder „der“ afrikanischen Kultur spricht, hat die interdisziplinäre Ebene bereits von vorneherein exkludiert – und diese Vereinfachung war historisch fast immer **der erste Schritt zur Rechtfertigung von Herrschaft**."
      },
      {
        t: "karten",
        h: "Eigenes und Fremdes: drei Werkzeugbegriffe",
        eyebrow: "Begriffsarbeit",
        items: [
          { k: "Ethnozentrismus", v: "Die eigene Gruppe wird zum Maßstab aller Dinge. Was abweicht, gilt nicht als anders, sondern als schlechter." },
          { k: "Alterität", v: "Das Fremde als das Andere – wahrgenommen immer durch die Brille der eigenen Erwartungen, selten so, wie es sich selbst versteht." },
          { k: "Barbarentopos", v: "Ein seit der Antike verfügbares Bildmuster: die Anderen als roh, gesetzlos, tierhaft. Es wird immer neu befüllt und bleibt abrufbar." }
        ],
        fuss: "Wir prüfen an Quellen, ob diese Muster wirken."
      },
      {
        t: "stufen",
        h: "Bitterlis Kulturtheorie — vier Formen der Begegnung",
        items: [
          { k: "Kulturberührung", v: ["erste, zeitlich begrenzte Begegnung zwischen Kulturen", "gastfreundlich, neugierig, vorsichtig"] },
          { k: "Kulturkontakt", v: ["dauerhafte Berührung!", "häufig keine Gleichberechtigung der Partner", "wechselseitige Beziehung", "auf Verständnis / Beziehungen ausgerichtet"] },
          { k: "Kulturzusammenstoß", v: ["technische Überlegenheit der einen Partei gegenüber der anderen wird ausgenutzt (teils bis zur Unterwerfung)", "eine der Kulturen muss weiterentwickelt sein / sich weiterentwickelt fühlen"] },
          { k: "Kulturverflechtung", v: ["lange andauernder Prozess über mehrere Generationen (!)", "Voraussetzung: langer Kulturkontakt → Gleichgewicht beider Kulturen", "Austausch von Werten und kulturellen Praktiken → Mischkulturen können entstehen", "gegenseitige, wechselseitige Anpassung erfordert ANPASSUNGSFÄHIGKEIT"] }
        ]
      },
      {
        t: "karten",
        h: "Drei Ergebnisse von Kulturkontakt",
        items: [
          { k: "Akkulturation", v: "wechselseitige Annahme einzelner Elemente der jeweils anderen Kultur und Integration in die eigene (z. B. Transnistrien)" },
          { k: "Assimilation", v: "schrittweise einseitige Aufnahme kultureller Elemente bis zur Auflösung der einen Kultur in die andere" },
          { k: "Koexistenz", v: "bezeichnet das i. d. R. friedliche Nebeneinanderleben von Kulturen / Nationen / Ethnien" }
        ]
      },
      {
        t: "auftrag",
        h: "Cortés’ Eroberung des Aztekenreichs",
        text: "Wie hat Cortés es geschafft, das Aztekenreich zu besiegen / zu kolonisieren?",
        antwort: [
          "Durch Aufnahme von **Schiffbrüchigen** Möglichkeit zum Erwerb der Sprache und Kennenlernen der Umgebung",
          "**Dolmetscherin** (Sklavin der Azteken) → Möglichkeiten der Kommunikation",
          "Hangelte sich mit dem Schiff an der Küste entlang → Hinweise auf die Lokalisierung der Hauptstadt **Tenochtitlan** verdichten sich",
          "Armee (500 Mann) plus Geschütze suchte den Landweg zur Hauptstadt; unterwegs Unterstützung durch viele indigene Stämme → Cortés machte sich **Verfeindungen der Stämme zunutze**",
          "**Moctezuma** versuchte, die Spanier durch Geldgeschenke vom Marsch auf die Hauptstadt abzuhalten"
        ]
      }
    ],
    hausaufgabe: "Fasst eure jeweilige Quelle zusammen und stellt dar, wie Cortés / Moctezuma die Begegnung wahrnimmt."
  },

  {
    id: "2026-09-02",
    nr: 2,
    datum: "02.09.2026",
    titel: "Für Gott und Gold – die iberische Expansion",
    untertitel: "Reconquista, Entdeckungsfahrten und die Quellenarbeit zu Kolumbus 1492",
    tags: ["Expansion", "Quellenarbeit", "Begriffskritik"],
    neu: false,
    wiederholung: null,
    bloecke: [
      {
        t: "absatz",
        text: "Überleitung der Stunde: Wo die Mappa mundi Heilsgeschichte ordnete, treten nun **Kompass, Portolankarte und Reisebericht** – Europa beginnt, die Welt zu befahren, zu vermessen und zu beanspruchen."
      },
      {
        t: "liste",
        h: "„Reconquista“ – eine wirkliche „Rückeroberung“?",
        items: [
          "**711** Eroberung der iberischen Halbinsel (vorher: Westgotenreich) durch maurische Truppen",
          "**781** Granada wird muslimisch",
          "→ in der Folge: viele Feldzüge gegen Mauren (v. a. von Rittern aus europäischem Raum → **Kreuzzugscharakter**)",
          "**1492** endgültige „Rückeroberung“"
        ]
      },
      {
        t: "liste",
        h: "Warum der Begriff umstritten ist",
        items: [
          "politische und wirtschaftliche Gründe für die Rückeroberung",
          "kontrovers: nach **800 Jahren** muslimischer Herrschaft von „Rückeroberung“ zu sprechen",
          "ebenfalls kontrovers: Besetzung / Eroberung weiterer Gebiete",
          "in der Folge: immer stärkere Betonung des religiösen Charakters (**reconquista wird eher zur conquista**)",
          "→ die iberische Halbinsel prosperiert zwischen 711 und 1492",
          "→ Wendepunkt: Eroberung von **Konstantinopel** im Osten (heute Istanbul) durch die Osmanen",
          "→ Muslime werden stärker als Bedrohung der Christenheit wahrgenommen ➔ Wiederaufnahme der Bestrebungen, die Halbinsel zurückzuerobern"
        ]
      },
      {
        t: "liste",
        h: "Die Entdeckungsfahrten",
        items: [
          "**1488** Bartolomeu Diaz segelt bis zur Spitze Südafrikas",
          "**1492** Christoph Kolumbus segelt über den Atlantik bis nach San Salvador (für Spanien)",
          "**1494** Vertrag von Tordesillas teilt zukünftige Entdeckungen in der Welt zwischen Portugal und Spanien auf",
          "**1498** Vasco da Gama entdeckt den östlichen Seeweg nach Indien (für Portugal)",
          "**1519–1522** Ferdinand Magellan umsegelt Südamerika und umrundet über den Pazifik die Welt"
        ]
      },
      {
        t: "quelle",
        h: "Papstbulle Inter Caetera (1493)",
        text: "…dass der katholische Glaube und die christliche Religion, besonders in unseren Zeiten, erhöht und überall erweitert und verbreitet werden, dass das Heil der Seelen gesucht und barbarische Nationen unterworfen und zum Glauben selbst bekehrt werden.",
        autor: "Papst Alexander VI.",
        werk: "Inter Caetera",
        jahr: "1493",
        hinweis: "Mit dieser Bulle teilte der Papst die Neue Welt zwischen Spanien und Portugal auf. Achte auf die Junktur „unterworfen und bekehrt“ – Mission und Herrschaft stehen im selben Satz."
      },
      {
        t: "liste",
        h: "„Neue Welt“ – ein kritischer Begriff?",
        items: [
          "„neu“ impliziert, dass es vorher nicht da war",
          "Perspektivwechsel (indigene Bevölkerung) fehlt",
          "symbolhaft für **Eurozentrismus** → alles außerhalb wird exkludiert",
          "Aber: aus kirchlicher Perspektive tatsächlich „neu“",
          "Folgen wiederum: einzigartig (neu) für die Welt",
          "Weltbild / Perspektive auf die Welt wird völlig verändert / revolutioniert → das Machtgefüge innerhalb Europas verändert sich für immer",
          "**WICHTIG:** Der Begriff stammt vom **Klerus** → „neu“ soll einen Auftrag implizieren (Bekehrung)",
          "Info: klerikal (adj.) = von der Kirche stammend"
        ]
      },
      {
        t: "auftrag",
        h: "Quelle Q4 – Vertrag von Santa Fe",
        text: "Erläutert, inwiefern es sich im Kern noch um eine „Entdeckungsfahrt“ handelt.",
        antwort: [
          "Vertrag von Santa Fe: **Ressourcen und deren Verwendung** stehen im Mittelpunkt",
          "**9/10** von allem, was Kolumbus entdeckt (Länder, Ressourcen), gehen an das spanische Königshaus",
          "Kolumbus’ Intention weniger auf Entdeckung und mehr auf **Bereicherung** ausgerichtet (eher „Eroberungs-“ als „Entdeckungsfahrt“?)",
          "Kolumbus wird **Gouverneur** → erhält Steuern auf die Gebiete",
          "Titelverleihung: **Admiral + Vizekönig** der „neuen“ Gebiete",
          "**Urteil:** Indizien einer echten „Erkundungsfahrt“ fehlen; gleichzeitig war das Ziel, den westlichen Seeweg nach Indien zu „entdecken“, und perspektivisch wird das Weltbild verändert"
        ]
      },
      {
        t: "auftrag",
        h: "Kulturbegegnungen — Filmanalyse",
        text: "Betrachtet den Ausschnitt der Serie „Shōgun“ (2024) über das Aufeinandertreffen des britischen Seefahrers Blackthorne mit Fürst Toranaga im Jahr 1600. Erklärt, mit welchen Mitteln die Kommunikation zwischen den Parteien stattfindet und wie sich beide Kulturen „begegnen“.",
        antwort: []
      }
    ],
    hausaufgabe: null
  },

  {
    id: "2026-08-26",
    nr: 1,
    datum: "26.08.2026",
    titel: "Einführungsstunde: Vom mittelalterlichen Weltbild zur Expansion",
    untertitel: "Was heißt „Geschichte“? — die Mappa mundi und die Triebkräfte um 1500",
    tags: ["Weltbild", "Quellenkunde", "Grundlagen"],
    neu: false,
    wiederholung: null,
    bloecke: [
      {
        t: "absatz",
        text: "Geschichte ist nicht die Vergangenheit selbst, sondern das, was wir aus ihren Spuren deutend über sie erzählen – **immer aus einer Gegenwart heraus und mit Fragen an sie**."
      },
      {
        t: "karten",
        h: "Was heißt eigentlich „Geschichte“?",
        items: [
          { k: "Zwei Bedeutungen", v: "**res gestae** – das Geschehene selbst · **historia rerum gestarum** – die Erzählung darüber · Deshalb gibt es Deutungen, nicht „die“ Wahrheit!" },
          { k: "Vergangenheit ≠ Geschichte", v: "Vergangenheit ist unwiederbringlich vorbei · Überliefert ist nur ein Bruchteil – Quellen sind Zufall und Auswahl · Aus Resten wird durch Fragen Geschichte" },
          { k: "Woher wir es wissen", v: "Schriftliche, materielle und bildliche Quellen · Darstellungen der Forschung · Methode: **Quellenkritik statt Nacherzählung**" }
        ]
      },
      {
        t: "merke",
        text: "Geschichte beginnt dort, wo Menschen ihre Vergangenheit **befragen** – und mit der Schrift beginnt ihre Überlieferung im engeren Sinn."
      },
      {
        t: "liste",
        h: "Die Welt im Kopf – eine Mappa mundi",
        vorspann: "Hereford-Karte, um 1300 (vgl. Ebstorfer Weltkarte). Was zeigt diese Karte – und was nicht?",
        items: [
          "**Osten oben, Jerusalem im Zentrum** – Ordnung nach Heilsgeschichte, nicht nach Messung",
          "Bekanntes und Erzähltes stehen nebeneinander: Städte, Bibelszenen, Fabelwesen",
          "**Ränder der Welt = Grenzen des Wissens**",
          "Leitfrage: Wie verändert sich dieses Weltbild ab dem 15. Jahrhundert?"
        ]
      },
      { t: "schema", name: "to" },
      {
        t: "absatz",
        text: "Überleitung: **Von der gedeuteten Welt zur vermessenen Welt.** Wo die Mappa mundi Heilsgeschichte ordnete, treten nun Kompass, Portolankarte und Reisebericht – Europa beginnt, die Welt zu befahren, zu vermessen und zu beanspruchen."
      },
      {
        t: "karten",
        h: "Europäische Expansion: Triebkräfte um 1500",
        items: [
          { k: "Wirtschaft", v: "Gewürze, Gold und Silber; nach 1453 blockierte Landwege nach Asien" },
          { k: "Technik", v: "Karavelle, Kompass, Astrolabium, Portolankarten und der Buchdruck" },
          { k: "Religion", v: "Missionsauftrag und Kreuzzugsdenken als Legitimation" },
          { k: "Politik", v: "Konkurrenz der Kronen Portugal und Kastilien, Vertrag von Tordesillas 1494" },
          { k: "Wissen", v: "Antike Geographie, Reiseberichte und wachsende Neugier" },
          { k: "Folgen", v: "Kolonialherrschaft, Sklavenhandel, Austausch von Pflanzen und Krankheiten" }
        ],
        fuss: "Perspektivwechsel: Expansion ist zugleich Eroberung – wir fragen konsequent nach beiden Seiten der Begegnung."
      }
    ],
    hausaufgabe: "Aufgabe 2 auf dem Arbeitsblatt."
  }
];

/* ------------------------------------------------------------- ZEITSTRAHL */

const ZEITSTRAHL = [
  { jahr: "711", titel: "Maurische Eroberung Iberiens", text: "Maurische Truppen erobern die iberische Halbinsel; vorher bestand dort das Westgotenreich.", kat: "Reconquista", stunde: "2026-09-02" },
  { jahr: "781", titel: "Granada wird muslimisch", text: "In der Folge zahlreiche Feldzüge gegen die Mauren, v. a. von Rittern aus dem europäischen Raum – mit Kreuzzugscharakter.", kat: "Reconquista", stunde: "2026-09-02" },
  { jahr: "um 1300", titel: "Hereford-Karte", text: "Mappa mundi mit Osten oben und Jerusalem im Zentrum: eine Ordnung nach Heilsgeschichte, nicht nach Messung.", kat: "Weltbild", stunde: "2026-08-26" },
  { jahr: "1453", titel: "Fall Konstantinopels", text: "Die Osmanen erobern Konstantinopel. Wendepunkt: Muslime werden stärker als Bedrohung der Christenheit wahrgenommen, die Landwege nach Asien gelten als blockiert.", kat: "Weltbild", stunde: "2026-09-02" },
  { jahr: "1488", titel: "Diaz umsegelt die Südspitze Afrikas", text: "Bartolomeu Diaz segelt bis zur Spitze Südafrikas.", kat: "Expansion", stunde: "2026-09-02" },
  { jahr: "1492", titel: "Ende der Reconquista & Fahrt des Kolumbus", text: "Endgültige „Rückeroberung“ der iberischen Halbinsel. Im selben Jahr segelt Christoph Kolumbus für Spanien über den Atlantik bis nach San Salvador.", kat: "Expansion", stunde: "2026-09-02" },
  { jahr: "1493", titel: "Papstbulle Inter Caetera", text: "Alexander VI. teilt die Neue Welt zwischen Spanien und Portugal auf – mit dem Auftrag, „barbarische Nationen“ zu unterwerfen und zu bekehren.", kat: "Vertrag", stunde: "2026-09-02" },
  { jahr: "1494", titel: "Vertrag von Tordesillas", text: "Teilt zukünftige Entdeckungen in der Welt zwischen Portugal und Spanien auf.", kat: "Vertrag", stunde: "2026-09-02" },
  { jahr: "1498", titel: "Vasco da Gama erreicht Indien", text: "Entdeckt für Portugal den östlichen Seeweg nach Indien.", kat: "Expansion", stunde: "2026-09-02" },
  { jahr: "1519–22", titel: "Magellans Weltumsegelung", text: "Ferdinand Magellan umsegelt Südamerika und umrundet über den Pazifik die Welt.", kat: "Expansion", stunde: "2026-09-02" },
  { jahr: "1519–21", titel: "Cortés erobert das Aztekenreich", text: "Sprache durch Schiffbrüchige und Dolmetscherin, Bündnisse mit verfeindeten indigenen Stämmen, 500 Mann plus Geschütze – Moctezuma versucht die Spanier mit Geschenken aufzuhalten.", kat: "Eroberung", stunde: "2026-09-04" },
  { jahr: "1600", titel: "Blackthorne trifft Toranaga", text: "Aufeinandertreffen des britischen Seefahrers mit dem japanischen Fürsten – Gegenstand der Filmanalyse zu „Shōgun“ (2024).", kat: "Begegnung", stunde: "2026-09-02" },
  { jahr: "1992/93", titel: "Huntington: Clash of Civilisations", text: "These, der nächste Weltkrieg werde nicht zwischen Staaten, sondern zwischen Kulturen geführt.", kat: "Rezeption", stunde: "2026-09-11" }
];

/* ---------------------------------------------------------------- GLOSSAR */

const GLOSSAR = [
  { begriff: "res gestae", kurz: "Das Geschehene selbst.", lang: "Lateinisch für „die geschehenen Dinge“: die Vergangenheit als Ereignis – im Unterschied zur Erzählung darüber.", kat: "Grundlagen", stunde: "2026-08-26" },
  { begriff: "historia rerum gestarum", kurz: "Die Erzählung über das Geschehene.", lang: "Die Darstellung der Vergangenheit. Weil sie erzählt wird, gibt es Deutungen – nicht „die“ Wahrheit.", kat: "Grundlagen", stunde: "2026-08-26" },
  { begriff: "Quellenkritik", kurz: "Methode statt Nacherzählung.", lang: "Quellen werden nach Herkunft, Absicht und Perspektive befragt, statt ihren Inhalt nur wiederzugeben. Überliefert ist immer nur ein Bruchteil – Quellen sind Zufall und Auswahl.", kat: "Grundlagen", stunde: "2026-08-26" },
  { begriff: "Mappa mundi", kurz: "Mittelalterliche Weltkarte.", lang: "Z. B. die Hereford-Karte (um 1300) oder die Ebstorfer Weltkarte: Osten oben, Jerusalem im Zentrum. Geordnet nach Heilsgeschichte, nicht nach Messung; Bekanntes und Erzähltes stehen nebeneinander; die Ränder markieren die Grenzen des Wissens.", kat: "Weltbild", stunde: "2026-08-26" },
  { begriff: "T-O-Schema", kurz: "Bauprinzip der Mappa mundi.", lang: "Ein O (der Weltozean) umschließt die bewohnte Welt, ein T aus Mittelmeer, Nil und Don/Tanais teilt sie in Asien (oben, Osten), Europa (unten links) und Afrika (unten rechts). Im Schnittpunkt liegt Jerusalem.", kat: "Weltbild", stunde: "2026-08-26" },
  { begriff: "Reconquista", kurz: "„Rückeroberung“ der iberischen Halbinsel.", lang: "Bezeichnung für die christlichen Feldzüge von 711 bis 1492. Umstritten, weil nach 800 Jahren muslimischer Herrschaft kaum von „Rück“-Eroberung zu sprechen ist und weil der religiöse Charakter zunehmend betont wurde: aus der reconquista wird eher eine conquista.", kat: "Expansion", stunde: "2026-09-02" },
  { begriff: "conquista", kurz: "Eroberung ohne Rückgewinnungsanspruch.", lang: "Gegenbegriff zur „Rückeroberung“: Besetzung und Eroberung weiterer Gebiete, legitimiert durch Religion.", kat: "Expansion", stunde: "2026-09-02" },
  { begriff: "„Neue Welt“", kurz: "Kritischer Begriff aus dem Klerus.", lang: "„neu“ impliziert, dass es vorher nicht da war, und blendet die Perspektive der indigenen Bevölkerung aus – symbolhaft für Eurozentrismus. Aus kirchlicher Perspektive war die Welt tatsächlich „neu“; der Begriff stammt vom Klerus und soll einen Auftrag implizieren: Bekehrung.", kat: "Begriffskritik", stunde: "2026-09-02" },
  { begriff: "Eurozentrismus", kurz: "Europa als Maßstab der Weltdeutung.", lang: "Alles außerhalb Europas wird aus der Betrachtung exkludiert oder nur relativ zu Europa beschrieben.", kat: "Begriffskritik", stunde: "2026-09-02" },
  { begriff: "klerikal", kurz: "von der Kirche stammend (adj.).", lang: "Kennzeichnet Begriffe und Deutungen, deren Ursprung im Klerus liegt – z. B. die Rede von der „Neuen Welt“.", kat: "Begriffskritik", stunde: "2026-09-02" },
  { begriff: "Vertrag von Santa Fe", kurz: "Kolumbus’ Vertrag mit der Krone (Q4).", lang: "Regelt Ressourcen und deren Verwendung: 9/10 aller Funde gehen an das spanische Königshaus, Kolumbus wird Gouverneur und erhält Steuern, dazu die Titel Admiral und Vizekönig. Spricht eher für eine Eroberungs- als für eine Entdeckungsfahrt.", kat: "Quelle", stunde: "2026-09-02" },
  { begriff: "Inter Caetera", kurz: "Papstbulle von 1493.", lang: "Alexander VI. teilt die Neue Welt zwischen Spanien und Portugal auf und verbindet Seelenheil mit Unterwerfung „barbarischer Nationen“.", kat: "Quelle", stunde: "2026-09-02" },
  { begriff: "Vertrag von Tordesillas", kurz: "Weltaufteilung 1494.", lang: "Teilt zukünftige Entdeckungen zwischen Portugal und Spanien auf – politische Triebkraft der Expansion.", kat: "Quelle", stunde: "2026-09-02" },
  { begriff: "Kultur", kurz: "Erlernte, tradierte, veränderliche Lebensformen.", lang: "Alle Erscheinungsformen des menschlichen Daseins, die auf bestimmten Wertvorstellungen und erlernten Verhaltensweisen beruhen, veränderlich sind und an die nächsten Generationen tradiert werden. Gegenbegriff zu „Natur“ – es zählt der Umgang mit der Natur.", kat: "Kulturtheorie", stunde: "2026-09-11" },
  { begriff: "Enger Kulturbegriff", kurz: "Kultur als Werke.", lang: "Kunst, Literatur, Musik, Architektur – das, was eine Gesellschaft an Werken hervorbringt.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { begriff: "Weiter Kulturbegriff", kurz: "Kultur als Gesamtheit der Lebensformen.", lang: "Sprache, Religion, Recht, Wirtschaft, Essen, Kleidung, Vorstellungen von Zeit und Tod.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { begriff: "Wertender Kulturbegriff", kurz: "Kultur gegen „Barbarei“.", lang: "„Kultur“ als Gegenbegriff zu „Barbarei“ oder „Natur“ – historisch das gefährlichste Verständnis, weil es Herrschaft rechtfertigt.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { begriff: "Ethnozentrismus", kurz: "Die eigene Gruppe als Maßstab.", lang: "Was abweicht, gilt nicht als anders, sondern als schlechter.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { begriff: "Alterität", kurz: "Das Fremde als das Andere.", lang: "Wahrgenommen immer durch die Brille der eigenen Erwartungen, selten so, wie es sich selbst versteht.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { begriff: "Barbarentopos", kurz: "Bildmuster der rohen Anderen.", lang: "Seit der Antike verfügbar: die Anderen als roh, gesetzlos, tierhaft. Wird immer neu befüllt und bleibt abrufbar.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { begriff: "Kulturberührung", kurz: "Bitterli, Stufe 1.", lang: "Erste, zeitlich begrenzte Begegnung zwischen Kulturen: gastfreundlich, neugierig, vorsichtig.", kat: "Bitterli", stunde: "2026-09-04" },
  { begriff: "Kulturkontakt", kurz: "Bitterli, Stufe 2.", lang: "Dauerhafte Berührung, häufig ohne Gleichberechtigung der Partner; wechselseitige Beziehung, auf Verständnis und Beziehungen ausgerichtet.", kat: "Bitterli", stunde: "2026-09-04" },
  { begriff: "Kulturzusammenstoß", kurz: "Bitterli, Stufe 3.", lang: "Die technische Überlegenheit der einen Partei wird ausgenutzt, teils bis zur Unterwerfung. Eine Kultur muss weiterentwickelt sein oder sich weiterentwickelt fühlen.", kat: "Bitterli", stunde: "2026-09-04" },
  { begriff: "Kulturverflechtung", kurz: "Bitterli, Stufe 4.", lang: "Lang andauernder Prozess über mehrere Generationen. Voraussetzung ist ein langer Kulturkontakt im Gleichgewicht; Werte und Praktiken werden ausgetauscht, Mischkulturen können entstehen. Erfordert Anpassungsfähigkeit auf beiden Seiten.", kat: "Bitterli", stunde: "2026-09-04" },
  { begriff: "Akkulturation", kurz: "Wechselseitige Übernahme.", lang: "Wechselseitige Annahme einzelner Elemente der jeweils anderen Kultur und Integration in die eigene (z. B. Transnistrien).", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { begriff: "Assimilation", kurz: "Einseitige Angleichung.", lang: "Schrittweise einseitige Aufnahme kultureller Elemente bis zur Auflösung der einen Kultur in die andere.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { begriff: "Koexistenz", kurz: "Friedliches Nebeneinander.", lang: "Das i. d. R. friedliche Nebeneinanderleben von Kulturen, Nationen oder Ethnien.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { begriff: "Clash of Civilisations", kurz: "Huntington 1992/93.", lang: "These, der nächste Weltkrieg werde nicht zwischen Staaten, sondern zwischen Kulturen geführt. Kampf entsteht, wenn Wertesysteme kollidieren; Huntington gliedert die Welt in größere und kleinere Kulturkreise statt in politische Ideologien. Kritik: Kultur dient in Konflikten oft als Deckmantel für politische, ökonomische oder territoriale Motive.", kat: "Kontroverse", stunde: "2026-09-11" }
];

/* ----------------------------------------------------------- KARTEIKARTEN */

const KARTEN = [
  { f: "Welche zwei Bedeutungen von „Geschichte“ unterscheidet man?", r: "**res gestae** = das Geschehene selbst · **historia rerum gestarum** = die Erzählung darüber. Deshalb gibt es Deutungen, nicht „die“ Wahrheit.", kat: "Grundlagen", stunde: "2026-08-26" },
  { f: "Warum ist Vergangenheit nicht dasselbe wie Geschichte?", r: "Vergangenheit ist unwiederbringlich vorbei; überliefert ist nur ein Bruchteil. Quellen sind Zufall und Auswahl – aus Resten wird erst **durch Fragen** Geschichte.", kat: "Grundlagen", stunde: "2026-08-26" },
  { f: "Welche Methode steht der bloßen Nacherzählung gegenüber?", r: "**Quellenkritik**: Quellen nach Herkunft, Absicht und Perspektive befragen.", kat: "Grundlagen", stunde: "2026-08-26" },
  { f: "Wie ist eine Mappa mundi aufgebaut?", r: "**Osten oben, Jerusalem im Zentrum.** Geordnet nach Heilsgeschichte, nicht nach Messung. Städte, Bibelszenen und Fabelwesen stehen nebeneinander; die Ränder markieren die Grenzen des Wissens.", kat: "Weltbild", stunde: "2026-08-26" },
  { f: "Nenne zwei berühmte Mappae mundi.", r: "Die **Hereford-Karte** (um 1300) und die **Ebstorfer Weltkarte**.", kat: "Weltbild", stunde: "2026-08-26" },
  { f: "Wofür stehen T und O im T-O-Schema?", r: "Das **O** ist der die Welt umschließende Ozean, das **T** bilden Mittelmeer, Nil und Don – sie teilen die Welt in Asien (oben/Osten), Europa und Afrika.", kat: "Weltbild", stunde: "2026-08-26" },
  { f: "Nenne die sechs Triebkräfte der europäischen Expansion um 1500.", r: "**Wirtschaft** (Gewürze, Gold, Silber) · **Technik** (Karavelle, Kompass, Astrolabium, Portolankarten, Buchdruck) · **Religion** (Mission, Kreuzzugsdenken) · **Politik** (Konkurrenz Portugal–Kastilien) · **Wissen** (antike Geographie, Reiseberichte) · und als Folgen: Kolonialherrschaft, Sklavenhandel, Austausch von Pflanzen und Krankheiten.", kat: "Expansion", stunde: "2026-08-26" },
  { f: "Was geschah 711 auf der iberischen Halbinsel?", r: "Maurische Truppen erobern die Halbinsel; zuvor bestand dort das **Westgotenreich**.", kat: "Expansion", stunde: "2026-09-02" },
  { f: "Warum ist der Begriff „Reconquista“ umstritten?", r: "Nach **800 Jahren** muslimischer Herrschaft ist „Rückeroberung“ fragwürdig; zudem wurden weitere Gebiete erobert und der religiöse Charakter immer stärker betont – aus der reconquista wird eher eine **conquista**. Außerdem prosperierte die Halbinsel zwischen 711 und 1492.", kat: "Expansion", stunde: "2026-09-02" },
  { f: "Welches Ereignis gilt als Wendepunkt für die Wiederaufnahme der Reconquista?", r: "Die Eroberung **Konstantinopels** durch die Osmanen (1453): Muslime werden stärker als Bedrohung der Christenheit wahrgenommen.", kat: "Expansion", stunde: "2026-09-02" },
  { f: "1488 – wer und was?", r: "**Bartolomeu Diaz** segelt bis zur Spitze Südafrikas.", kat: "Daten", stunde: "2026-09-02" },
  { f: "1492 – wer und was?", r: "**Christoph Kolumbus** segelt für Spanien über den Atlantik bis nach **San Salvador**. Im selben Jahr endet die Reconquista.", kat: "Daten", stunde: "2026-09-02" },
  { f: "1494 – wer und was?", r: "**Vertrag von Tordesillas**: teilt zukünftige Entdeckungen zwischen Portugal und Spanien auf.", kat: "Daten", stunde: "2026-09-02" },
  { f: "1498 – wer und was?", r: "**Vasco da Gama** entdeckt für Portugal den östlichen Seeweg nach Indien.", kat: "Daten", stunde: "2026-09-02" },
  { f: "1519–1522 – wer und was?", r: "**Ferdinand Magellan** umsegelt Südamerika und umrundet über den Pazifik die Welt.", kat: "Daten", stunde: "2026-09-02" },
  { f: "Was regelt die Papstbulle Inter Caetera (1493)?", r: "Papst **Alexander VI.** teilt die Neue Welt zwischen Spanien und Portugal auf – begründet damit, dass der katholische Glaube verbreitet, das Seelenheil gesucht und „barbarische Nationen unterworfen und bekehrt“ werden sollen.", kat: "Quellen", stunde: "2026-09-02" },
  { f: "Warum ist der Begriff „Neue Welt“ kritisch zu sehen?", r: "„neu“ impliziert, dass es vorher nicht da war, und blendet die indigene Perspektive aus → **Eurozentrismus**. Der Begriff stammt vom **Klerus** und impliziert einen Auftrag: Bekehrung. Aus kirchlicher Perspektive war sie aber tatsächlich „neu“, und die Folgen waren für die Welt einzigartig.", kat: "Begriffskritik", stunde: "2026-09-02" },
  { f: "Was verrät der Vertrag von Santa Fe über Kolumbus’ Motive?", r: "**9/10** aller Funde gehen an die Krone, Kolumbus wird **Gouverneur** mit Steuerrecht sowie **Admiral und Vizekönig**. Ressourcen stehen im Mittelpunkt → eher Eroberungs- als Entdeckungsfahrt.", kat: "Quellen", stunde: "2026-09-02" },
  { f: "Definiere „Kultur“ (Arbeitsdefinition des Kurses).", r: "Alle Erscheinungsformen des menschlichen Daseins, die auf bestimmten **Wertvorstellungen** und **erlernten Verhaltensweisen** beruhen, **veränderlich** sind und an die nächsten Generationen **tradiert** werden. Gegenbegriff zu „Natur“ – es zählt der Umgang mit ihr.", kat: "Kulturtheorie", stunde: "2026-09-11" },
  { f: "Nenne die drei Kulturbegriffe der Begriffsarbeit.", r: "**Eng** (Kunst, Literatur, Musik, Architektur) · **weit** (Gesamtheit der Lebensformen) · **wertend** (Gegenbegriff zu „Barbarei“ – historisch das gefährlichste Verständnis).", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { f: "Warum ist es problematisch, von „der“ europäischen Kultur zu sprechen?", r: "Kulturen sind keine geschlossenen Behälter mit klaren Rändern – sie sind veränderlich, widersprüchlich und im Austausch. Die Vereinfachung war historisch fast immer **der erste Schritt zur Rechtfertigung von Herrschaft**.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { f: "Ethnozentrismus – Definition?", r: "Die **eigene Gruppe wird zum Maßstab aller Dinge**. Was abweicht, gilt nicht als anders, sondern als schlechter.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { f: "Alterität – Definition?", r: "Das Fremde als **das Andere** – wahrgenommen immer durch die Brille der eigenen Erwartungen, selten so, wie es sich selbst versteht.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { f: "Barbarentopos – Definition?", r: "Ein seit der **Antike** verfügbares Bildmuster: die Anderen als roh, gesetzlos, tierhaft. Es wird immer neu befüllt und bleibt abrufbar.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { f: "Nenne Bitterlis vier Formen der Kulturbegegnung in der richtigen Reihenfolge.", r: "**Kulturberührung → Kulturkontakt → Kulturzusammenstoß → Kulturverflechtung**", kat: "Bitterli", stunde: "2026-09-04" },
  { f: "Kulturberührung nach Bitterli?", r: "Erste, **zeitlich begrenzte** Begegnung zwischen Kulturen – gastfreundlich, neugierig, vorsichtig.", kat: "Bitterli", stunde: "2026-09-04" },
  { f: "Kulturkontakt nach Bitterli?", r: "**Dauerhafte** Berührung, häufig ohne Gleichberechtigung der Partner; wechselseitige Beziehung, auf Verständnis und Beziehungen ausgerichtet.", kat: "Bitterli", stunde: "2026-09-04" },
  { f: "Kulturzusammenstoß nach Bitterli?", r: "Die **technische Überlegenheit** der einen Partei wird ausgenutzt, teils bis zur Unterwerfung. Eine Kultur muss weiterentwickelt sein oder sich so fühlen.", kat: "Bitterli", stunde: "2026-09-04" },
  { f: "Kulturverflechtung nach Bitterli?", r: "Lang andauernder Prozess über **mehrere Generationen**. Voraussetzung: langer Kulturkontakt im Gleichgewicht. Werte und Praktiken werden ausgetauscht, Mischkulturen entstehen – erfordert **Anpassungsfähigkeit**.", kat: "Bitterli", stunde: "2026-09-04" },
  { f: "Unterscheide Akkulturation, Assimilation und Koexistenz.", r: "**Akkulturation**: wechselseitige Übernahme einzelner Elemente (z. B. Transnistrien). **Assimilation**: einseitige Aufnahme bis zur Auflösung der einen Kultur. **Koexistenz**: i. d. R. friedliches Nebeneinanderleben.", kat: "Kulturtheorie", stunde: "2026-09-04" },
  { f: "Wie gelang Cortés die Eroberung des Aztekenreichs?", r: "Sprache und Ortskenntnis durch aufgenommene **Schiffbrüchige**, eine **Dolmetscherin**, Küstenfahrt zur Lokalisierung von **Tenochtitlan**, 500 Mann plus Geschütze und vor allem **Bündnisse mit verfeindeten indigenen Stämmen**. Moctezuma versuchte, ihn mit Geldgeschenken aufzuhalten.", kat: "Eroberung", stunde: "2026-09-04" },
  { f: "Wie lautet Huntingtons These (1992/93)?", r: "„Der nächste Weltkrieg wird nicht zwischen Staaten, sondern **zwischen Kulturen** geführt werden.“ (Clash of Civilisations)", kat: "Kontroverse", stunde: "2026-09-11" },
  { f: "Unter welcher Bedingung ist der Kulturkampf nach Huntington vermeidbar?", r: "Wenn es **globale Akzeptanz unterschiedlicher Werte** gibt. Zum Kampf kommt es, wenn Wertesysteme kollidieren (Sprache, Glaube u. a.).", kat: "Kontroverse", stunde: "2026-09-11" },
  { f: "Was ist der zentrale Einwand gegen Huntington?", r: "Kultur wird in Konflikten häufig **als Deckmantel missbraucht** – für politische, ökonomische oder territoriale Beweggründe.", kat: "Kontroverse", stunde: "2026-09-11" },
  { f: "Wie ordnet man das Treffen in Dune nach Bitterli ein?", r: "Als **Kulturkontakt**: Kolonisten treffen dauerhaft auf die indigene Bevölkerung des Wüstenplaneten, ein vorgeschickter Scout ist anwesend – die Partner sind nicht gleichberechtigt.", kat: "Kulturtheorie", stunde: "2026-09-11" },
  { f: "Welche vier Leitfragen begleiten die Unterrichtsreihe?", r: "1. Welches Weltbild löst die Mappa mundi ab? 2. Warum geht die Expansion von Europa aus? 3. Entdeckung oder Eroberung – was macht die Perspektive der Quelle? 4. Welche Folgen prägen unsere Gegenwart?", kat: "Grundlagen", stunde: "2026-08-26" }
];

/* ------------------------------------------------------------------- QUIZ */

const QUIZ = [
  { frage: "Was bezeichnet „historia rerum gestarum“?", optionen: ["Das Geschehene selbst", "Die Erzählung über das Geschehene", "Die Quellenkritik", "Die Chronologie der Ereignisse"], richtig: 1, erklaerung: "res gestae = das Geschehene selbst; historia rerum gestarum = die Erzählung darüber.", kat: "Grundlagen" },
  { frage: "Wo liegt auf der Hereford-Karte das Zentrum der Welt?", optionen: ["Rom", "Konstantinopel", "Jerusalem", "Der Ozean"], richtig: 2, erklaerung: "Osten oben, Jerusalem im Zentrum – geordnet nach Heilsgeschichte, nicht nach Messung.", kat: "Weltbild" },
  { frage: "Welche Himmelsrichtung liegt auf einer Mappa mundi oben?", optionen: ["Norden", "Süden", "Osten", "Westen"], richtig: 2, erklaerung: "Der Osten (Orient) liegt oben – daher das Wort „Orientierung“.", kat: "Weltbild" },
  { frage: "Was bildet im T-O-Schema das „O“?", optionen: ["Der Weltozean, der die Erde umschließt", "Das Mittelmeer", "Die Mauern Jerusalems", "Der Nil"], richtig: 0, erklaerung: "Das O ist der umschließende Ozean; das T bilden Mittelmeer, Nil und Don.", kat: "Weltbild" },
  { frage: "Wann eroberten maurische Truppen die iberische Halbinsel?", optionen: ["661", "711", "781", "1492"], richtig: 1, erklaerung: "711 – vorher bestand dort das Westgotenreich. 781 wird Granada muslimisch.", kat: "Daten" },
  { frage: "Welches Ereignis gilt als Wendepunkt, der die Reconquista wieder befeuerte?", optionen: ["Die Entdeckung Amerikas", "Der Fall Konstantinopels durch die Osmanen", "Der Vertrag von Tordesillas", "Magellans Weltumsegelung"], richtig: 1, erklaerung: "1453 – danach werden Muslime stärker als Bedrohung der Christenheit wahrgenommen.", kat: "Expansion" },
  { frage: "Warum ist der Begriff „Reconquista“ kontrovers?", optionen: ["Weil die Feldzüge nie stattfanden", "Weil nach 800 Jahren muslimischer Herrschaft kaum von „Rückeroberung“ zu sprechen ist", "Weil er von Historikern des 20. Jahrhunderts erfunden wurde", "Weil er nur Portugal betrifft"], richtig: 1, erklaerung: "Außerdem wurden weitere Gebiete erobert und der religiöse Charakter zunehmend betont – aus der reconquista wird eher eine conquista.", kat: "Expansion" },
  { frage: "Wer segelte 1488 bis zur Südspitze Afrikas?", optionen: ["Vasco da Gama", "Ferdinand Magellan", "Bartolomeu Diaz", "Christoph Kolumbus"], richtig: 2, erklaerung: "Da Gama erreichte 1498 Indien, Magellan umrundete 1519–22 die Welt.", kat: "Daten" },
  { frage: "Was regelte der Vertrag von Tordesillas 1494?", optionen: ["Die Aufteilung zukünftiger Entdeckungen zwischen Portugal und Spanien", "Das Ende der Reconquista", "Die Rechte des Kolumbus gegenüber der Krone", "Den Frieden mit den Osmanen"], richtig: 0, erklaerung: "Die Rechte des Kolumbus regelte der Vertrag von Santa Fe.", kat: "Expansion" },
  { frage: "Welcher Papst erließ 1493 die Bulle Inter Caetera?", optionen: ["Innozenz III.", "Alexander VI.", "Julius II.", "Leo X."], richtig: 1, erklaerung: "Alexander VI. teilte damit die Neue Welt zwischen Spanien und Portugal auf.", kat: "Quellen" },
  { frage: "Welcher Anteil der Funde geht laut Vertrag von Santa Fe an das spanische Königshaus?", optionen: ["Die Hälfte", "Ein Drittel", "9/10", "Alles"], richtig: 2, erklaerung: "Die Ressourcen stehen im Mittelpunkt – ein starkes Indiz für eine Eroberungs- statt Entdeckungsfahrt.", kat: "Quellen" },
  { frage: "Welche Titel erhielt Kolumbus im Vertrag von Santa Fe?", optionen: ["Admiral und Vizekönig", "Herzog und Statthalter", "Kardinal und Legat", "Kapitän und Schatzmeister"], richtig: 0, erklaerung: "Zusätzlich wurde er Gouverneur und erhielt Steuern auf die Gebiete.", kat: "Quellen" },
  { frage: "Aus welcher Sphäre stammt der Begriff „Neue Welt“ – und warum ist das wichtig?", optionen: ["Von Kaufleuten – es ging um Handelsrouten", "Vom Klerus – „neu“ soll den Auftrag der Bekehrung implizieren", "Von Kartographen – die Karten mussten neu gezeichnet werden", "Von den Seefahrern selbst – sie beschrieben ihre Eindrücke"], richtig: 1, erklaerung: "Deshalb trägt der Begriff einen Missionsauftrag in sich – „klerikal“ heißt: von der Kirche stammend.", kat: "Begriffskritik" },
  { frage: "Welcher Kulturbegriff gilt historisch als der gefährlichste?", optionen: ["Der enge Begriff", "Der weite Begriff", "Der wertende Begriff", "Der ethnologische Begriff"], richtig: 2, erklaerung: "„Kultur“ als Gegenbegriff zu „Barbarei“ oder „Natur“ – er rechtfertigt Herrschaft.", kat: "Kulturtheorie" },
  { frage: "Welche Aussage beschreibt Ethnozentrismus?", optionen: ["Das Fremde wird durch die Brille eigener Erwartungen wahrgenommen", "Die eigene Gruppe wird zum Maßstab – Abweichung gilt als schlechter", "Die Anderen erscheinen als roh und gesetzlos", "Kulturen leben friedlich nebeneinander"], richtig: 1, erklaerung: "Die erste Option beschreibt Alterität, die dritte den Barbarentopos, die vierte Koexistenz.", kat: "Kulturtheorie" },
  { frage: "Welche Stufe Bitterlis setzt eine dauerhafte, aber meist ungleiche Beziehung voraus?", optionen: ["Kulturberührung", "Kulturkontakt", "Kulturzusammenstoß", "Kulturverflechtung"], richtig: 1, erklaerung: "Die Kulturberührung ist zeitlich begrenzt; der Zusammenstoß nutzt technische Überlegenheit aus.", kat: "Bitterli" },
  { frage: "Was ist die Voraussetzung für eine Kulturverflechtung?", optionen: ["Militärische Überlegenheit einer Seite", "Ein langer Kulturkontakt im Gleichgewicht beider Kulturen", "Eine gemeinsame Sprache", "Ein Vertrag zwischen den Herrschern"], richtig: 1, erklaerung: "Sie dauert über mehrere Generationen und erfordert Anpassungsfähigkeit auf beiden Seiten.", kat: "Bitterli" },
  { frage: "Was unterscheidet Assimilation von Akkulturation?", optionen: ["Assimilation ist wechselseitig, Akkulturation einseitig", "Assimilation ist einseitig bis zur Auflösung der einen Kultur, Akkulturation wechselseitig", "Beides bedeutet dasselbe", "Assimilation betrifft nur die Sprache"], richtig: 1, erklaerung: "Akkulturation: wechselseitige Übernahme einzelner Elemente. Assimilation: einseitige Aufnahme bis zur Auflösung.", kat: "Kulturtheorie" },
  { frage: "Welcher Faktor war für Cortés’ Erfolg entscheidend?", optionen: ["Zahlenmäßige Überlegenheit seiner Armee", "Er nutzte die Verfeindungen indigener Stämme und gewann sie als Verbündete", "Er kam unbemerkt in Tenochtitlan an", "Moctezuma leistete keinerlei Widerstand"], richtig: 1, erklaerung: "Mit nur 500 Mann plus Geschützen war die Unterstützung vieler indigener Stämme ausschlaggebend – dazu Sprache durch Schiffbrüchige und eine Dolmetscherin.", kat: "Eroberung" },
  { frage: "Wie versuchte Moctezuma, die Spanier aufzuhalten?", optionen: ["Durch einen Überraschungsangriff", "Durch Geldgeschenke", "Durch eine Belagerung der Küste", "Durch ein Bündnis mit Portugal"], richtig: 1, erklaerung: "Er wollte sie damit vom Marsch auf die Hauptstadt abhalten.", kat: "Eroberung" },
  { frage: "Wie lautet Huntingtons Kernthese?", optionen: ["Kriege entstehen aus wirtschaftlicher Ungleichheit", "Der nächste Weltkrieg wird zwischen Kulturen statt zwischen Staaten geführt", "Kulturen verschmelzen zu einer Weltkultur", "Ideologien bestimmen die Konflikte des 21. Jahrhunderts"], richtig: 1, erklaerung: "Clash of Civilisations, 1992/1993. Er gliedert die Welt in Kulturkreise statt in politische Ideologien.", kat: "Kontroverse" },
  { frage: "Was ist der zentrale Einwand gegen Huntingtons These?", optionen: ["Kulturen haben keine Wertesysteme", "Kultur dient in Konflikten oft nur als Deckmantel für politische, ökonomische oder territoriale Motive", "Es gab seit 1993 keine Konflikte mehr", "Kulturkreise lassen sich exakt vermessen"], richtig: 1, erklaerung: "Deshalb ist die These „äußerst kontrovers zu sehen“ – im Abi als Diskussion mit Pro und Contra zu führen.", kat: "Kontroverse" },
  { frage: "Was bedeutet „klerikal“?", optionen: ["weltlich", "von der Kirche stammend", "königlich", "gelehrt"], richtig: 1, erklaerung: "Wichtig für die Kritik am Begriff „Neue Welt“.", kat: "Begriffskritik" },
  { frage: "Welche technischen Errungenschaften ermöglichten die Expansion?", optionen: ["Dampfmaschine und Telegraph", "Karavelle, Kompass, Astrolabium, Portolankarten und Buchdruck", "Sextant und Chronometer", "Kanonenboot und Eisenbahn"], richtig: 1, erklaerung: "Die anderen Erfindungen stammen aus späteren Jahrhunderten.", kat: "Expansion" }
];

/* -------------------------------------------------------------- OPERATOREN */

const OPERATOREN = [
  { ab: "I", worte: ["beschreiben", "darstellen", "zusammenfassen"], def: "Sachverhalte unter Beibehaltung des Sinnes strukturiert auf Wesentliches reduzieren" },
  { ab: "I", worte: ["bezeichnen", "skizzieren"], def: "Sachverhalte, Probleme oder Aussagen formulieren" },
  { ab: "I", worte: ["nennen"], def: "zielgerichtet Informationen zusammentragen, ohne diese zu kommentieren" },
  { ab: "II", worte: ["analysieren", "untersuchen"], def: "unter gezielten Fragestellungen Elemente, Strukturmerkmale und Zusammenhänge herausarbeiten" },
  { ab: "II", worte: ["begründen", "nachweisen"], def: "These oder Wertungen durch Argumente stützen, die auf historischen Beispielen und anderen Belegen gründen" },
  { ab: "II", worte: ["charakterisieren"], def: "historische Sachverhalte in ihren Eigenarten beschreiben und diese dann unter einem bestimmten Gesichtspunkt zusammenfassen" },
  { ab: "II", worte: ["einordnen"], def: "einen oder mehrere historische Sachverhalte in einen Zusammenhang stellen" },
  { ab: "II", worte: ["erklären"], def: "historische Sachverhalte durch Wissen und Einsichten in einen Zusammenhang (Theorie, Modell, Regel, Funktionszusammenhang) einordnen und deuten" },
  { ab: "II", worte: ["erläutern"], def: "wie „erklären“, aber durch zusätzliche Informationen und Beispiele verdeutlichen" },
  { ab: "II", worte: ["herausarbeiten"], def: "aus Materialien bestimmte historische Sachverhalte herausfinden, die nicht explizit genannt werden, und Zusammenhänge zwischen ihnen herstellen" },
  { ab: "II", worte: ["gegenüberstellen"], def: "mehrere Sachverhalte, Probleme oder Aussagen skizzieren und argumentierend gewichten" },
  { ab: "II", worte: ["vergleichen"], def: "auf der Grundlage von Kriterien Gemeinsamkeiten, Ähnlichkeiten und Unterschiede gegliedert darstellen" },
  { ab: "II", worte: ["widerlegen"], def: "Argumente anführen, dass eine These oder eine Position nicht haltbar ist" },
  { ab: "III", worte: ["beurteilen"], def: "aufgrund ausgewiesener Kriterien zu einem Zusammenhang ein triftiges Sachurteil fällen" },
  { ab: "III", worte: ["bewerten", "Stellung nehmen"], def: "unter Offenlegung der eigenen normativen Maßstäbe zu einem Sachverhalt, Problem oder einer These ein begründetes und nachvollziehbares Werturteil fällen" },
  { ab: "III", worte: ["entwickeln"], def: "gewonnene Analyseergebnisse synthetisieren, um zu einer eigenen Deutung zu gelangen" },
  { ab: "III", worte: ["diskutieren", "erörtern"], def: "zu einer Problemstellung oder These eine Pro- und Contra-Argumentation entwickeln, die zu einer begründeten Bewertung führt" },
  { ab: "III", worte: ["prüfen", "überprüfen"], def: "Aussagen (Hypothesen, Behauptungen, Urteile) auf der Grundlage eigenen Wissens beurteilen" },
  { ab: "I–III", worte: ["interpretieren"], def: "Sinnzusammenhänge aus Quellen erschließen und eine begründete Stellungnahme abgeben, die auf einer Darstellung, Analyse, Erläuterung und Bewertung beruht" }
];

/* -------------------------------------------------------------------- ABI */

const ABI = {
  quelle: "A-Heft Geschichte, Abitur 2028: schriftliche Prüfung (Auszug)",
  grundlage: "Grundlage der schriftlichen Abiturprüfung ist der Bildungsplan Studienstufe 2022, Rahmenplan Geschichte.",
  ablauf: [
    "Der Fachlehrkraft werden **drei** Aufgaben (I, II und III) zu **zwei** unterschiedlichen Schwerpunkten vorgelegt.",
    "Der Prüfling erhält alle **drei** Aufgaben und wählt davon **eine** aus, die er bearbeitet.",
    "Vor Bearbeitungsbeginn die Vollständigkeit der Aufgaben prüfen (Anzahl der Blätter, Anlagen usw.).",
    "Auf der Reinschrift vermerken, welche Aufgabe bearbeitet wurde."
  ],
  aufgabenarten: ["Interpretieren von Quellen", "Erörtern von Erklärungen historischer Sachverhalte aus Darstellungen"],
  zeit: [
    { niveau: "Grundlegendes Anforderungsniveau", minuten: 255 },
    { niveau: "Erhöhtes Anforderungsniveau", minuten: 315 }
  ],
  zeithinweis: "Eine gesonderte Lese- oder Auswahlzeit wird nicht gewährt.",
  hilfsmittel: "Rechtschreibwörterbuch, Fremdwörterlexikon",
  hinweis: "Es besteht grundsätzlich Themengleichheit zwischen Kursen auf grundlegendem und erhöhtem Anforderungsniveau. Für das erhöhte Niveau wird ein – auch qualitatives – Additum angegeben. Die Aufgaben unterscheiden sich in Umfang, Anspruch und Komplexität der Fragestellungen sowie der vorgelegten Texte bzw. Medien.",
  schwerpunkte: [
    {
      nr: "I",
      themenbereich: "Kulturbegegnungen – Europa und die Welt",
      titel: "Das deutsche Kolonialreich",
      aktuell: true,
      inhaltsfelder: [
        "Die Inbesitznahme deutscher Kolonien und ihre Vorgeschichte ab 1862",
        "Intentionen, Herrschaft, Wirtschaft und Gewalt in den deutschen Kolonien"
      ],
      additum: [
        "Erinnerungskultur und Spuren der deutschen Kolonialgeschichte, insbesondere in Hamburg, und bundesweite Aufarbeitung der kolonialen Vergangenheit",
        "Vergleich (kriteriengeleitet) mit einem anderen Kolonialreich"
      ]
    },
    {
      nr: "II",
      themenbereich: "Krisen, Umbrüche und Modernisierungsprozesse in Wirtschaft und Gesellschaft",
      titel: "Wirtschaft und Gesellschaft in der Bundesrepublik Deutschland 1949–1990",
      aktuell: false,
      inhaltsfelder: [
        "Wirtschaftsgeschichte vom Wiederaufbau bis zur Wiedervereinigung",
        "Gesellschaft zwischen Tradition(en) und Wandel"
      ],
      additum: [
        "„1968“ und die Folgen",
        "Modernisierung: Ein mehrdeutiger Begriff"
      ]
    }
  ]
};

/* ---------------------------------------------------------------- AUFGABEN */

const AUFGABEN = [
  { id: "ha-2026-09-04", text: "Fasst eure jeweilige Quelle zusammen und stellt dar, wie Cortés / Moctezuma die Begegnung wahrnimmt.", stunde: "2026-09-04", datum: "04.09.2026" },
  { id: "ha-2026-08-26", text: "Aufgabe 2 auf dem Arbeitsblatt bearbeiten.", stunde: "2026-08-26", datum: "26.08.2026" }
];
