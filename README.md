# GTA Advance Studio

A browser-based modding tool for **Grand Theft Auto Advance (Game Boy Advance, European version)**.

Runs entirely in the browser with **no installation, server, Python, dependencies, or internet connection required**.

## Features

* **ROM & Project management**

  * Open and save ROMs
  * Save changes as `.gtastudio` projects
  * Expand ROMs from 16 MB to 32 MB
  * Automatic header checksum recalculation
  * IPS / IPS32 patch creation

* **Complete Package**

  * Export and import all editable data as a ZIP
  * Approximately 3,550 files / 6 MB
  * Supports sprites, graphics, textures, maps, fonts, sounds, texts, and missions
  * Individual files can also be imported directly

* **Sprites**

  * 2,475 sprites
  * PNG export/import
  * Palette editing
  * Automatic relocation when imported graphics no longer fit
  * Duplicate sprite groups are updated automatically

* **Menu Graphics**

  * 116 editable images
  * Title screen, logos, cutscenes, portraits, briefing boards, and icons
  * Indexed PNG import/export
  * Automatic tilemap reconstruction

* **World Textures**

  * 640 city textures
  * Supports rooftops, facades, roads, parking lots, pools, and more

* **Map Editor**

  * All three islands
  * Tiles, collision, and height layers
  * Pencil, line, rectangle, fill, eyedropper, selection, and move tools
  * Undo/redo, copy/paste, grid, zoom, and overview map
  * Editable objects and zones

* **Text Editor**

  * 13,775 pointer-reachable strings
  * Five-language mission dialog support
  * Search and replace
  * CSV export/import
  * Automatic relocation of longer texts and pointer updates

* **Sound**

  * 282 PCM samples
  * WAV export/import
  * Browser playback and waveform display
  * Automatic conversion of imported WAV files

* **Missions & Objects**

  * 18 discovered tables
  * 1,081 mission instances
  * 798 briefings
  * 565 events
  * 337 vehicle entries
  * 228 start points
  * CSV export

* **Hex / Raw Data Editor**

  * Direct ROM access
  * Hex and text search
  * Bookmarks for known structures
  * Arbitrary range import/export

## Getting Started

You can start using GTA Advance Studio in about 30 seconds:

1. Download the project as a ZIP.
2. Open `index.html`, or run `Start GTA Advance Studio.bat`.
3. Load your own legally created copy of the **European GTA Advance ROM**.
4. Choose a section from the left-hand navigation.
5. Edit the desired data.
6. Save your work as a `.gtastudio` project or create a new `.gba` ROM.
7. Test modified ROMs in an emulator such as **mGBA**.
8. To distribute a modification, create an IPS patch under **ROM & Project**.

### Browser Support

Tested with:

* Chrome
* Edge
* Firefox

No server or internet connection is required.

## ROM Compatibility

The expected original ROM is:

```text
SHA-1: 06230842626da504f92396074f7c655e100f5d44
Size:  16 MB
```

Other versions can be loaded, but hardcoded addresses may differ. The Studio warns when a different ROM is detected.

## IPS Patching

GTA Advance Studio can create patches containing only the differences between the original and modified ROM.

The standard IPS format is used for normal ROMs. If the ROM has been expanded to 32 MB, Studio automatically creates an **IPS32** patch. A self-check applies the generated patch to the original ROM and verifies that the result matches the edited ROM exactly.

This allows mods to be distributed **without distributing the original ROM**.

## Languages

The interface supports:

* Deutsch
* English
* Español
* Français
* Italiano

The selected language is remembered by the browser. On first launch, the system language is used when supported.

## Project Structure

```text
index.html
css/
└── studio.css

js/
├── core.js
├── app.js
├── i18n.js
├── gfxscan.js
├── tabbulk.js
├── tabmenu.js
├── tabfont.js
└── tab.js

data/
├── lang.js
├── lang2.js
└── tiles1..3.js
```

The project is written entirely in JavaScript with **no dependencies and no network access**.

## Testing

The project has been tested extensively against the original ROM, including:

* Graphics round-trips
* PNG import/export
* WAV import/export
* Menu graphics reconstruction
* Text relocation and pointer updates
* Map writing
* Project export/import
* Complete package export/import
* Font round-trips
* World palette verification
* IPS and IPS32 patch generation
* All five interface languages

The modded ROM should always be tested in an emulator before use on real hardware. Real-hardware behavior has not been tested.

## Known Bugs

* 116 sprites do not have a clearly identifiable palette.
* Character-code-to-glyph mapping is implemented in program code rather than stored in a ROM table.
* Some ROM regions contain geometry/pointer data rather than graphics.
* Object and zone lists cannot be extended with additional entries.
* Numeric mission-record fields are not fully documented.
* The 3D-like building/block model system is currently accessible only through the Hex Editor.
* Some interface translations may still contain German text or non-native phrasing.
* Menu graphics may change tile order during import, making byte-for-byte comparison with the original unsuitable.

## Important

**GTA Advance Studio does not include or distribute the original GTA Advance ROM.**

Use your own legally obtained copy of the game. The original ROM is never modified in memory; changes are written only when saving a project or creating a new ROM.


# GTA Advance Studio

**Sprachen:** Deutsch · [English](README.md) · [Español](LEEME.md) · [Français](LISEZMOI.md) · [Italiano](LEGGIMI.md)

Mod-Werkzeug für *Grand Theft Auto Advance* (Game Boy Advance, Europe-Fassung).
Läuft ohne Installation im Browser: **`index.html` doppelklicken** (oder
`GTA Advance Studio starten.bat`). Kein Server, kein Python, keine Internetverbindung nötig.

Getestet mit Chrome, Edge und Firefox.

---

## In 30 Sekunden loslegen

1. `index.html` öffnen.
2. **ROM laden** – deine eigene, legal erstellte Kopie von *Grand Theft Auto Advance (Europe)*.
   Die Datei kann auch einfach ins Fenster gezogen werden.
3. Links den Bereich wählen und bearbeiten.
4. Unter **ROM & Projekt** das Projekt speichern (`.gtastudio`) – das sichert nur deine Änderungen.
5. **ROM speichern** erzeugt die fertige `.gba`. Vorher immer im Emulator (z. B. mGBA) testen.
   Zum Weitergeben eines Mods: **IPS-Patch erstellen** (unter ROM & Projekt).

**Sprache:** Oben rechts lässt sich die Oberfläche auf Deutsch, English, Español,
Français oder Italiano umstellen – die fünf Sprachen, die auch die ROM enthält.
Die Wahl wird im Browser gemerkt; beim ersten Start gilt die Systemsprache.

Die Original-ROM wird nie verändert. Alle Änderungen leben im Arbeitsspeicher,
bis du sie als neue ROM oder als Projektdatei sicherst.

Erwartete Original-ROM: SHA-1 `06230842626da504f92396074f7c655e100f5d44`, 16 MB.
Andere Fassungen werden geladen, aber fest hinterlegte Adressen können abweichen –
das Studio warnt in dem Fall.

---

## Die Bereiche

### ROM & Projekt
Kopfdaten, Prüfsumme, freier Speicher, Änderungsliste. Projekt speichern/öffnen,
ROM auf 32 MB erweitern (für große Umbauten), alles zurücksetzen.
Die Kopf-Prüfsumme wird beim Speichern automatisch neu berechnet.

**Mod als IPS-Patch:** *IPS-Patch erstellen* speichert nur die Unterschiede zur
Original-ROM als `.ips`. So lässt sich ein Mod weitergeben, ohne die ROM selbst zu
verteilen – andere wenden den Patch mit einem üblichen Patcher (z. B. Lunar IPS,
Floating IPS, RomPatcher.js) auf ihre eigene Kopie an. Details:

* Standard-IPS (`PATCH` … `EOF`), lange Füllbereiche werden als RLE-Datensätze
  kodiert, der Patch bleibt dadurch klein.
* Der Sonderfall Offset `0x454F46` (sieht aus wie „EOF“) wird umgangen.
* Wurde die ROM auf 32 MB erweitert, reicht das 24-Bit-Format nicht mehr – dann wird
  automatisch **IPS32** geschrieben (`IPS32` … `EEOF`). Das können z. B. Floating IPS
  und RomPatcher.js; ältere Patcher nicht. Das Studio weist beim Speichern darauf hin.
* Selbstkontrolle: vor dem Speichern wird der Patch auf die Original-ROM angewendet
  und mit dem aktuellen Stand verglichen. Nur bei exakter Übereinstimmung wird er
  gespeichert. Die Kopf-Prüfsumme ist im Patch bereits korrigiert.

### Komplett-Paket
Alle bearbeitbaren Daten auf einmal heraus- und wieder hineinschreiben, ohne jede
Datei einzeln auszuwählen.

**Exportieren** erzeugt ein ZIP mit rund 3.550 Dateien (etwa 6 MB, ~4 Sekunden):

```
manifest.json          ROM-Prüfsumme und Anzahl je Bereich
sprites/    2.475 PNG  vollbilder/  10 PNG    menue/     116 PNG
texturen/     640 PNG  schriften/    3 PNG    karten/      3 JSON
sounds/       282 WAV  texte/        1 CSV    missionen/  18 CSV
hud/            7 PNG
```

**Einspielen** liest dasselbe ZIP wieder ein. Du kannst es entpacken, mit deinen
Werkzeugen bearbeiten und neu einpacken – die Dateinamen müssen nur gleich bleiben,
denn darüber läuft die Zuordnung (`spr_a827e0`, `menu_c7a5fc`, `tex_3f0218`,
`snd_071e1c`, …). Über „Einzelne Dateien einspielen" geht es auch ohne ZIP mit einer
Mehrfachauswahl.

* Jeder Bereich lässt sich per Häkchen ein- und ausschalten.
* Es wird nur geschrieben, was sich tatsächlich unterscheidet. Ein Paket unverändert
  wieder einzuspielen lässt die ROM **byteidentisch**.
* Unbekannte oder zusätzliche Dateien werden still übersprungen.
* Alle Bereiche teilen sich einen gemeinsamen Speicherverwalter, damit verschobene
  Daten einander nicht überschreiben.
* Am Ende erscheint ein Bericht: was geändert wurde und was nicht passte.

### Sprites
2.475 Sprites (2.303 BIOS-RLE-komprimiert, 172 unkomprimiert), 4bpp mit 16 Farben:
Autos, Figuren, Waffen, Effekte, Objekte. 304 davon enthalten zwei Frames in einem Block
(meist 32×64 + 64×32 bei Fahrzeugen); die liegen im PNG untereinander.

* Export als indiziertes PNG (einzeln oder alles als ZIP, inklusive `.pal`-Dateien).
* Import per PNG. **Bildgröße nicht ändern.** Indizierte PNGs behalten ihre Indizes;
  RGB/RGBA-PNGs werden der Palette zugeordnet (Schalter *„Farben zuordnen statt Indizes"*).
* Palette direkt im Studio ändern (Farbfeld anklicken). Achtung: viele Sprites
  teilen sich eine Palette.
* Wird eine Grafik nach dem Packen größer als ihr Platz, wandert sie ans ROM-Ende
  und **alle Zeiger darauf werden angepasst**. Reicht der Platz nicht, meldet das
  Studio es, statt etwas kaputtzuschreiben.
* Identische Kopien (Duplikatgruppen) werden beim Import automatisch mitgezogen.

**Paletten:** Jedes Sprite hat seine echte Palette. Normalerweise zeigt ein Objekt
direkt auf den Sprite-Datensatz und daneben auf die Palette. Bei Animationen
(Busse, Feuerwehr, Taxi, Krankenwagen, Kran) zeigt das Objekt aber auf eine
Frame-Liste – `[Anzahl][Zeiger auf Liste][Palette]` –, und alle Frames der Liste
nutzen diese Palette. So sind auch die früher 116 Sprites mit Ersatzpalette gelöst.

Beim Massenimport wird die Datei über den Namen zugeordnet – `spr_a827e0_64x64.png`
gehört zum Sprite `spr_a827e0`. Namen also nicht umbenennen.

### Menü-Grafiken
116 Bilder aus **4bpp-Kacheln + Tilemap + 16-Farben-Palette** – ein anderes Format als
die Sprites, deshalb ein eigener Bereich:

* **Titelbild** (#57): das Stadtpanorama, 480×320 Pixel
* **Logo** (#11–#15): der „Grand Theft Auto Advance"-Schriftzug in fünf Animationsstufen
* **Rockstar-Games-Logo** (#21) und **Digital-Eclipse-Logo** (#22) – die Startbildschirme
* 71 Vollbilder 240×160: Figuren-Portraits, Zwischensequenzen, Briefing-Tafeln
* eine 240×320-Zwischensequenz, zwei 240×40-Rahmen, zwei 240×16-Leisten
* 39 Symbole 64×64: Waffen, Objekte, Karten-Marker

Export als indiziertes PNG (Index 0 ist transparent), Import baut Kacheln **und**
Tilemap neu auf und erkennt dabei gespiegelte Wiederholungen – oft braucht das
Ergebnis sogar weniger Platz als das Original. Passt es nicht mehr, wandert der Block
(Kacheln und Karte bleiben zusammenhängend) ans ROM-Ende und der Datensatz wird
angepasst. Bildgröße beibehalten, höchstens 16 Farben, maximal 1.024 verschiedene Kacheln.
Die Palette lässt sich im Studio direkt ändern.

Bekannte Bilder sind mit ★ markiert und über ihren Namen suchbar.

Die Tabelle steht bei `0xC98D28`, 116 Einträge à 28 Byte:
`{palPtr, flags, tilesPtr, tilesSize, mapPtr, u16 w, u16 h, u32}` – dabei gilt immer
`mapPtr == tilesPtr + tilesSize`.

### Vollbilder (Innenräume)
Die zehn 240×160-Bildschirme (8bpp, 128-Farben-Palette) – die begehbaren Innenräume
(Wohnung, Club, …). Gleiche Bedienung wie bei den Sprites; neun der zehn sind identisch
und werden gemeinsam aktualisiert.

### Welt-Texturen
640 unkomprimierte 8-Bit-Texturen der Stadt: 146× 32×32, 348× 64×64, 146× 128×128 –
Dachflächen, Fassaden, Straßenbelag, Parkplätze, Pools. Lage und Größe sind fest,
der Import schreibt direkt an Ort und Stelle.

**Die Weltpalette ist gefunden:** 256 Farben, in der ROM viermal abgelegt –
`0x853DDC`, `0x91E32C`, `0x9D07F0`, `0xCAC048`, alle vier byteidentisch. Die Kopien
bei `0x91E32C` und `0x9D07F0` stehen unmittelbar hinter den Kartendaten von Insel 1
bzw. 2. Nachgewiesen über das Paletten-RAM des beiliegenden Savestates: dort steht
genau dieser Block, Byte für Byte. Das Studio erkennt sie an ihren ersten vier
Einträgen (`7C1F F3FF EBBD E37B`) und benutzt sie als Voreinstellung; im Ausklappmenü
stehen zusätzlich alle anderen in der ROM gefundenen Paletten zum Ausprobieren.

### Schriften
Die Spieltexte werden zur Laufzeit aus **8×8-Glyphen** gesetzt: 4bpp, 32 Byte je
Zeichen, fortlaufend in der ROM. Drei Schriften sind gefunden:

| Offset | Zeichen | Beschreibung |
|---|---|---|
| `0x342E08` | 16 | HUD-Schrift: Herzen, Sterne, Doppelpunkt, Ziffern 0–9 |
| `0x346808` | 88 | Textschrift, kantengeglättet (Farbstufen 0,1,3,6,8,11–14) |
| `0x347308` | 88 | Textschrift, einfach (Farbstufen 0,1,3,6) |

Aufbau eines Textschriftblocks (88 Glyphen):

```
0        Pfeil-/Markierungszeichen
1–26     A–Z
27 -     28–30 leer     31 .
32–36    , ' ? ! $
37–46    0–9            47 +
48–66    Akzentbuchstaben (19)
67–72    / : ; ( ) %
73–87    Symbole und Füllzeichen
```

Export und Import laufen über ein Kachelblatt mit 16 Zeichen je Reihe
(128×48 Pixel bei der Textschrift). Größe beibehalten, höchstens 16 Farbstufen;
geschrieben wird an Ort und Stelle, nichts wird verschoben.

**Wie ich sie gefunden habe:** über den Bildspeicher des beiliegenden Savestates.
Dort stand sichtbar `CHINATOW…`, `MPH` und die HUD-Ziffern – diese Kacheln habe ich
Byte für Byte in der ROM wiedergefunden. Die Reihenfolge (A=Glyphe 1, B=2, …) ergab
sich direkt aus der Zuordnung der einzelnen Buchstaben.

> **Zur Kodierung:** A–Z, Ziffern und die gängigen Satzzeichen sind gesichert. Welcher
> Zeichencode auf welche Glyphe zeigt, rechnet der Programmcode aus – eine Tabelle
> dafür gibt es in der ROM nicht. Die Zeichen über `0x7F` in den Texten folgen einer
> eigenen Kodierung des Spiels, nicht Latin-1. Die 19 Akzentbuchstaben sind deshalb
> nach Position benannt (`Akz1`…`Akz19`), nicht nach Buchstabe.

### HUD-Grafiken
Die Grafiken der Spielanzeige lädt das Spiel direkt aus dem Programmcode (per DMA,
ohne Tabelle) – deshalb stehen sie nicht bei den Sprites. Per Emulator gefunden
(Grafikspeicher und HUD-Tilemap des laufenden Spiels mit der ROM verglichen):

| Element | Offset | Format | Palette |
|---|---|---|---|
| Waffensymbole (16 × 32×32) | `0x3444E8` | 4bpp-Kacheln | `0xCA635C` |
| Geld-Ziffern `$0–9` (8×16) | `0x343028` | 4bpp, obere/untere Hälfte getrennt | Weltpalette Bank 15 |
| Uhr-Ziffern `0–9` | `0x342EE8` | 4bpp | Weltpalette Bank 15 |
| Radar-Symbole (L, J, V, C, A, K, M, Ziele) | `0x3464E8` | 25 Kacheln | `0xCA637C` |
| Radar-Punkte | `0x342B28` | 23 Kacheln | `0xCA637C` |
| Radar-Ring mit „N“ (48×48) | `0x343BE8` | ein Byte je Pixel | Weltpalette Bank 15 |
| Radar-Maske (48×48) | `0x3432E8` | ein Byte je Pixel | Weltpalette Bank 15 |

Export/Import als indiziertes PNG (16 Farben), an Ort und Stelle. Herzen, Sterne und
die Ziffern der Lebensanzeige gehören zur HUD-Schrift unter „Schriften“. Den
Radar-Inhalt und die Lebenszahl setzt das Spiel zur Laufzeit aus diesen Teilen zusammen.

### Karten-Editor
Alle drei Inseln (Insel 1: 256×256 Zellen, Inseln 2 und 3: 128×256). Eine Zelle
entspricht 64×64 Welteinheiten.

Vier Ebenen je Zelle:
* **Bodengrafik** (16 Bit) – Nummer einer 40×40-Pixel-Zellgrafik aus 5×5 Kacheln.
  Das ist genau das, was das Spiel als Boden zeichnet (per Emulator nachgewiesen).
* **Kacheln** (16 Bit) – der Zellwert (Flächenart)
* **Kollision** (8 Bit) – nur zwei Werte: 0 (Straßennetz) und 11 (Häuserblocks samt
  Gehwegen und Plätzen)
* **Höhe** (Ebene B, 8 Bit) – im Wesentlichen 0, 16 und 32

Beim Malen mit der Kachelauswahl wird die Bodengrafik mitgeschrieben (abschaltbar):
standardmäßig die häufigste Grafik des Werts, per **Grafik-Varianten**-Leiste im
Pinselbereich jede andere (z. B. Mittellinie, Zebrastreifen, Ufer). Die **Pipette**
übernimmt die genaue Grafik einer Zelle – so lassen sich Kreuzungen, Plätze oder
Parks exakt an andere Stellen kopieren. Kopieren/Einfügen nimmt die Bodengrafik mit.

**Fünf Ansichten**, jede mit eigener Legende samt Zellzahlen:

| Ansicht | zeigt |
|---|---|
| Texturen | die echte Bodengrafik des Spiels |
| **Gebäudetypen** | färbt jede Zelle nach Straße, Gehweg, Gebäude, oberer Ebene, Rampe |
| Textur + Typ | beides übereinander |
| Kollision | begehbar / gesperrt |
| Höhe | Ebene B als Graustufen |

Die Gebäudetypen sind nicht geraten, sondern ergeben sich aus Kollision und Höhe.
Die Auswertung aller drei Inseln zeigt: Kollision kennt nur 0 und 11, die Höhe im
Wesentlichen 0, 16 und 32. Daraus werden sieben Flächenarten – in der Typen-Ansicht
sieht man auf einen Blick Straßennetz, bebaute Blöcke und die Hochstraße mit ihren
Rampen.

Weitere Hilfen:
* **Kachelauswahl nach Gebäudetyp gruppiert**, mit Farbpunkt, Häufigkeit auf dieser
  Insel, Suchfeld, Typfilter und einer Zeile „zuletzt benutzt".
* **Kollision und Höhe mitschreiben** (standardmäßig an): Malst du eine Hauskachel,
  bekommt die Zelle automatisch die passende Sperre und Höhe. Ohne das entstünden
  Gebäude, durch die man hindurchlaufen kann.
* **Übersichtskarte** oben rechts mit Sichtfenster – ein Klick springt dorthin.
* **Zell-Inspektor**: zeigt links den aktuellen Pinsel (Kachelbild, Typ, Kollision,
  Höhe) und darunter live die Zelle unter dem Mauszeiger samt Weltkoordinaten.
* **Statuszeile** unter der Karte mit Position, Zellwert, Flächenart und Schrittzähler.
* Objekte und Zonen sind anklick- und bearbeitbar.

Werkzeuge: Stift, Linie, Rechteck, Füllen, Pipette, Auswahl, Schieben;
Pinselgrößen 1–8; Undo/Redo über alle drei Ebenen hinweg; Kopieren/Einfügen; Raster.

Tastatur: `P` `L` `R` `F` `I` `S` `H` für die Werkzeuge, `G` Raster,
`Strg+Z` / `Strg+Y` Undo/Redo, `Strg+C` / `Strg+V`, `Entf` Auswahl füllen,
Leertaste gedrückt halten zum Schieben, Mausrad zoomt.

**In ROM schreiben** überträgt die aktuelle Insel. Größe und Lage bleiben gleich,
es wird nichts verschoben. `JSON` / `Laden` tauscht ganze Karten aus (inklusive
Bodengrafik).

#### Welt-Kacheln (Bodengrafik) importieren und exportieren

Im Seitenbereich unter „Welt-Kacheln“:
* **Kachelsatz** – alle 8×8-Kacheln einer Insel als ein PNG (32 Kacheln je Zeile,
  256 Farben der Weltpalette). Bearbeiten, gleich groß lassen, wieder einspielen –
  jede Kachel wird an Ort und Stelle ersetzt und wirkt überall, wo sie vorkommt.
  (Insel 1: 1.687 Kacheln, Insel 2: 1.818, Insel 3: 1.476.)
* **Ausschnitt** – mit dem Auswahlwerkzeug einen Bereich markieren, **Als Bild
  exportieren** (40 Pixel je Zelle), ein neues Straßenbild, eine Kreuzung oder ein
  ganzes Viertel hineinmalen und **Bild einspielen**. Das Studio zerlegt das Bild in
  Kacheln, verwendet identische Kacheln wieder, belegt frei gewordene Plätze neu und
  schreibt die Bodengrafik sofort in die ROM.

Platz für neue Kacheln: Kacheln, Zellgrafiken und Bodenkarte liegen im Original am
Stück. Reichen die frei gewordenen Plätze nicht, zieht die Bodenkarte in den freien
ROM-Bereich und Kacheln/Zellgrafiken wachsen an ihrem Platz (Insel 1: ca. 130 KB,
Inseln 2/3: ca. 64 KB). Erst danach wäre eine Erweiterung auf 32 MB nötig – das
fragt das Studio vorher.

Grenze des Spiels: Die Engine lädt sichtbare Kacheln in einen Zwischenspeicher mit
256 Plätzen. Die Originalkarten brauchen je Bildschirm höchstens etwa 200. Das
Studio warnt, wenn ein eingespieltes Bild mehr als 240 verschiedene Kacheln auf
einen Bildschirm bringt – dann kann das Spiel dort falsche Kacheln zeigen.

#### 3D-Ansicht

Der Schalter **3D-Ansicht** zeigt den Ausschnitt um die aktuelle Stelle als Relief:
Oberseiten mit der echten Bodengrafik, Höhe aus Ebene B, gesperrte Zellen als Blöcke
(so sieht man Häuserblocks und Straßennetz räumlich). Alle Werkzeuge funktionieren
auch in 3D – die linke Maustaste malt, füllt, wählt aus oder nimmt per Pipette auf.

Steuerung: rechte Maustaste drehen, Mausrad zoomen, mittlere Taste / Leertaste /
Hand-Werkzeug verschieben, Pfeiltasten bewegen, `Q`/`E` drehen. Ein Klick in die
Übersichtskarte springt auch in 3D an die Stelle.

Die Blöcke sind eine Bearbeitungshilfe: Die echten Gebäude sind 3D-Modelle des
Spiels (eigene Datenstruktur), ihre Höhe wird hier nicht nachgebildet. Läuft WebGL
nicht, meldet das Studio das und die 2D-Ansicht bleibt nutzbar.

### Kamera-Hack

Ändert Kameraabstand und -neigung per Zusatzcode in der ROM, fest voreingestellt und
auf Wunsch im Spiel verstellbar. Jederzeit vollständig entfernbar (**Hack entfernen**
stellt alle Originalbytes wieder her).

**Wie die Kamera des Spiels arbeitet** (per Emulator-Analyse ermittelt):
* Kamera im IWRAM bei `0x03000014`: X, Y, **Höhe** (16.16-Festkomma). Die sichtbare
  Breite ist 2 × Höhe; Boden (affine Hintergrundebene) und Sprites werden gemeinsam
  danach skaliert.
* Zielhöhen: 164 zu Fuß und bei Pausenmenü „Camera 1“, 192 bei „Camera 2“, 220 bei
  „Camera 3“ und in Fahrzeugen; Grenzen 164…220.
* Gebäude sind echte 3D-Modelle; ihre Eckpunkte werden bei `0x0800EEBA` mit
  `k = 118 / (Kamerahöhe − z)` perspektivisch projiziert.

**Was der Hack macht:**
* **Abstand**: eigene Zielhöhen für zu Fuß, die drei Kamerastufen des Pausenmenüs
  und Fahrzeuge, dazu eigene Grenzen (64…255; unter 96 experimentell, weil hohe
  Gebäude dann höher als die Kamera sein können). Über 255 geht es nicht – die
  Bodenebene des GBA ist nur 512 Pixel breit.
* **Neigung**: verschiebt den Fluchtpunkt der 3D-Projektion. Alles auf Bodenhöhe
  bleibt exakt, höhere Teile kippen – man sieht die Seitenwände der Gebäude wie bei
  einer schräg gestellten Kamera.
* **Steuerung im Spiel** (abschaltbar): **SELECT halten** + Steuerkreuz = Neigung,
  + `L`/`R` = näher/weiter, + `A` = zurück zur Voreinstellung. Solange SELECT gehalten
  wird, sieht das Spiel keine Tasten; SELECT allein wird beim Loslassen an das Spiel
  weitergereicht.
* **Sichtbereich erweitern**: Gebäude werden schon ab 64 statt 16 Welteinheiten
  außerhalb des Bildes gezeichnet – verhindert Aufpoppen am Rand bei starker Neigung.

Die Vorschau zeigt Beispielgebäude mit derselben Projektionsformel wie das Spiel.

**Ego-Perspektive:** nicht möglich. Die Engine zeichnet den Boden als flache
Hintergrundebene von oben und Autos/Figuren als flache Sprites von oben. Eine
Ego-Perspektive bräuchte einen komplett neuen Renderer. Am nächsten kommt man mit
kleinem Abstand und starker Neigung.

Technik: Der Code (rund 420 Byte Thumb, Kennung `GTASCAM1`) liegt im freien
ROM-Bereich und ist an drei Stellen eingehängt: Projektion `0x0800EED8`,
Tastenabfrage `0x080656F8`, Zielhöhe `0x0800A040`. Die im Spiel verstellten Werte
liegen im IWRAM bei `0x030000C0` – einem 60-Byte-Füllbereich zwischen den
Variablen und dem ARM-Code des Spiels, auf den keine Stelle im Programm verweist.
Eine Kennung schützt zusätzlich vor zufälligem Überschreiben.

### Text-Editor
13.775 über Zeiger erreichbare Zeichenketten – davon 8.698 Spieltexte und 5.077
interne Bezeichner. Die Missionsdialoge liegen in fünf Sprachen vor
(EN/ES/FR/IT/DE); das Studio erkennt 1.166 solcher Sprachgruppen und zeigt sie
gemeinsam zum Bearbeiten an.

* Volltextsuche, Filter nach Sprache, Suchen & Ersetzen über die sichtbare Auswahl.
* CSV-Export/-Import für ganze Übersetzungen.
* Kürzere Texte werden an Ort und Stelle geschrieben. **Längere Texte wandern ans
  ROM-Ende, und alle Zeiger darauf werden angepasst** – neue Texte dürfen also
  beliebig länger sein, solange Platz da ist.
* Zeichensatz: Latin-1 (Codes bis 255). Nicht darstellbare Zeichen werden gemeldet
  und durch `?` ersetzt.

### Sound
282 PCM-Samples, zusammen 2,45 MB und rund 4,5 Minuten – Sprachaufnahmen, Motoren,
Waffen, Radio-Schnipsel. Fast alle mit 9.556 Hz, 8 Bit, mono.

* Wellenform ansehen, direkt im Browser abspielen.
* Als WAV speichern (einzeln oder alles als ZIP), eigene WAV-Dateien einspielen.
  Beliebige Abtastrate, 8/16/24/32 Bit, mono oder stereo – das Studio rechnet um.
* Kürzere Aufnahmen passen immer; längere werden ans ROM-Ende verschoben und die
  Zeiger angepasst.

> **Zu MIDI:** Diese ROM benutzt **keinen** Sequenzer wie Nintendos MusicPlayer2000
> (Sappy). Es gibt darin also keine MIDI- oder Notendaten, die man exportieren
> könnte – Musik und Geräusche liegen komplett als fertig aufgenommene PCM-Samples
> vor. Eigene Musik baust du ein, indem du sie als WAV renderst und als Sample
> einspielst.

### Missionen & Objekte
Das Spiel beschreibt Missionen, platzierte Objekte und Ereignisse über benannte
Datensätze (`i_ambusher16_last1`, `e_notincar_race1`, `brief_failure_bar1`, …).
Das Studio findet 18 solcher Tabellen über ihre Namenszeiger – unter anderem
1.081 Instanzen, 798 Briefings, 565 Ereignisse, 337 Fahrzeugeinträge, 228 Startpunkte.

Jedes Feld wird mit seiner Deutung angezeigt (Zahl, Zeiger, verlinkter Text) und
lässt sich direkt ändern; verlinkte Texte springen in den Text-Editor.
Ganze Tabellen lassen sich als CSV exportieren.

> **Zum Umfang, ehrlich gesagt:** Die Namen, die Tabellengrenzen und die
> Satzgröße sind gesichert. Die Bedeutung der einzelnen Zahlenfelder ist es nicht.
> Das Studio zeigt deshalb jedes Feld mit seiner Deutung an, statt eine Bedeutung
> zu erfinden. Ebenso lässt sich aus den Rohdaten nicht ableiten, wo genau die
> logische Satzgrenze liegt – angezeigt wird ein vollständiger Satz ab dem
> Namenszeiger, die letzten Felder können schon zum nächsten Eintrag gehören.
> Ändere Werte in kleinen Schritten und teste im Emulator.

### Hex / Rohdaten
Direkter Zugriff auf jede Stelle der ROM, mit Lesezeichen aller bekannten
Strukturen, Suche nach Hex-Bytes oder Text, Byte-Editor und Import/Export
beliebiger Bereiche.

---

## Platz in der ROM

Die Original-ROM ist 16 MB groß und ab `0xFD2F4C` frei – rund 180 KB für
verschobene Grafiken, Texte und Samples. Reicht das nicht, erweitert
**ROM & Projekt → Auf 32 MB erweitern** den Adressraum. Emulatoren kommen damit
immer klar; auf echter Hardware muss das Flash-Modul 32 MB können.

## Wie die ROM lauffähig bleibt

* Komprimiert wird im selben BIOS-RLE-Format wie im Original.
  Alle 2.485 Originalgrafiken passen unverändert wieder in ihren Platz zurück.
* Verschobene Daten bekommen ihre Zeiger angepasst; gibt es keinen bekannten
  Zeiger, bricht der Import mit einer Meldung ab, statt etwas zu überschreiben.
* Die Kopf-Prüfsumme wird beim Speichern neu berechnet.
* Ein Import ohne echte Änderung ergibt eine byteidentische ROM.

## Was geprüft wurde

Gegen die Original-ROM in diesem Ordner:

* Grafiksuche liefert exakt dieselben Ergebnisse wie das ältere Python-Werkzeug
  (2.303 + 172 Sprites, 10 Vollbilder, 143 Paletten). Die 116 Sprites, für die die
  alte Suche keine Palette fand (Busse, Feuerwehr, Taxi, Krankenwagen, Kran-Animation),
  haben jetzt ihre echte Palette – siehe „Sprites“. Gegenprobe: bei allen 2.359 Sprites
  mit schon bekannter Palette liefert der neue Weg dieselbe.
* RLE-Kodierung, Kachel↔Bild-Umwandlung und PNG-Schreiben/-Lesen: verlustfreier
  Rundlauf über alle 2.485 Grafiken.
* WAV-Export und -Reimport: byte-genauer Rundlauf.
* Menü-Grafiken: alle 116 Bilder über Kachel-Rückbau geprüft – Pixel identisch,
  kein Bild wird dabei größer (in Summe sogar 1.952 Byte kleiner). Titelbild mit
  Änderung geschrieben, verschoben und zurückgelesen.
* Text kürzen (an Ort und Stelle) und verlängern (verschoben, Zeiger angepasst):
  geprüft und zurückgelesen.
* Karte unverändert zurückschreiben: byteidentisch.
* Objekt- und Zonenlisten gegen die Deskriptoren in der ROM verifiziert.
* Projektdatei: Änderungen exportiert und wieder eingespielt – identisches Ergebnis.
* Komplett-Paket: Export mit allen acht Bereichen (3.547 Dateien, 5,9 MB) und
  unverändert wieder eingespielt → **0 geänderte Bytes**. Danach gezielt je eine
  Datei pro Bereich verändert (Sprite-, Vollbild-, Menü- und Texturpixel, Kartenzelle
  samt Kollision und Objektposition, ein kürzerer und ein längerer Text, ein
  halbiertes Sample, ein Missionsfeld) – alle acht kamen exakt an, alle 2.485
  Grafiken blieben dekodierbar, Kopf-Prüfsumme gültig.
* WAV-Rundlauf über **alle** 282 Samples byte-genau (vorher nur stichprobenartig).
* Schriften: Kachelblatt exportiert und unverändert zurückgespielt – 0 geänderte
  Bytes bei allen drei Schriften; eine gezielte Pixeländerung kam exakt an.
* Weltpalette dreifach abgesichert: identisch mit dem Paletten-RAM des Savestates,
  viermal byteidentisch in der ROM, und die damit gerenderten Texturen zeigen
  erkennbare Dächer, Pools und Parkflächen statt Rauschen.

* IPS-Patch: Einzelbyte, lange Null- und Füllbereiche (RLE), eine Änderung genau
  bei `0x454F46`, 200.000 verstreute Änderungen, ein echter Mod (Sprite + verschobener
  Text) und eine auf 32 MB erweiterte ROM (IPS32) – jeder Patch ergab angewendet
  wieder exakt die bearbeitete ROM.
* Sprachen: alle Bereiche in allen fünf Sprachen geöffnet – keine Fehler; die
  automatische Suche nach verbliebenen deutschen Texten fand in Oberfläche,
  Hinweisen und Meldungen nichts mehr. Vereinzelt können zusammengesetzte
  Kleinigkeiten (z. B. ein Tooltip in der Kachelauswahl) noch deutsch sein.

* **Kamera-Hack** im Emulator (mGBA, per Debugger ferngesteuert): Neigung 0 ergibt
  ein bytegleiches Bild wie das Original; Abstand 96…250, Neigung in beide Richtungen,
  SELECT-Steuerung und Zurücksetzen funktionieren vom Einschalten an; über
  Wachpunkte bestätigt, dass nur der eigene Code in den RAM-Block schreibt. Die vom
  Studio erzeugte ROM ist bytegleich mit der im Emulator getesteten.
* **Bodengrafik**: aus den Level-Tabellen dekodiert und mit dem Spielbild verglichen.
  Kachelsatz und Ausschnitte unverändert zurückgespielt → 0 geänderte Bytes. Mehrere
  überlappende Importe auf allen drei Inseln → jede Zelle der Insel stimmt mit dem
  Erwarteten überein. Ein eingespieltes Muster und ein im Editor gemalter
  Straßenstreifen erscheinen im Emulator korrekt im Spiel. Komplett-Paket überträgt
  geänderte Bodengrafik exakt (zweiter Import ändert nichts mehr).
* **3D-Ansicht**: Malen, Füllen, Pipette und Rückgängig in 3D.
* **HUD-Grafiken**: alle sieben Elemente unverändert re-importiert → 0 geänderte Bytes;
  ein umgemaltes Waffen-Icon und umgemalte Geld-Ziffern erscheinen genau so im Spiel.

**Nicht geprüft:** das Verhalten auf echter Hardware. Teste eine gemoddete ROM
immer erst im Emulator.

---

## Bekannte Grenzen

* Die Zuordnung Zeichencode → Glyphe steckt im Programmcode, nicht in einer Tabelle.
  Die Akzentbuchstaben der Schriften sind darum nach Position benannt.
* Die Bereiche `0x800000–0x8D0000` und `0xEE0000–0xF83880` sind Geometrie- und
  Zeigerdaten des Gebäude-Renderers, keine Bilder. Als 4bpp- oder 8bpp-Grafik
  gelesen ergeben sie nur Rauschen.
* Objekt- und Zonenlisten haben eine feste Länge; Werte sind änderbar, neue
  Einträge lassen sich nicht anhängen, weil direkt dahinter der Deskriptor steht.
* Die Bedeutung der Zahlenfelder in den Missionsdatensätzen ist nicht dokumentiert.
* Das 3D-artige Gebäude-/Blockmodellsystem (ab `0xD50000`) ist nur über den
  Hex-Editor erreichbar.
* Übersetzungen: Spielinhalte (Texte aus der ROM, Missions- und Dateinamen) bleiben
  natürlich, wie sie sind. Die Übersetzungen der Oberfläche sind ohne Akzente
  geschrieben (wie die deutschen Umlaute als ae/oe/ue) und stammen nicht von
  Muttersprachlern. Fehlt irgendwo ein Eintrag, erscheint der deutsche Text.
* Kamera-Hack: Ego-Perspektive ist mit dieser Engine nicht machbar (siehe oben).
  Autos, Figuren und der Boden bleiben flach; nur 3D-Gebäude kippen bei Neigung.
* Welt-Kacheln: Mehr als etwa 240 verschiedene Kacheln pro Bildschirm können im
  Spiel zu falschen Kacheln führen. Ein Bild-Import wird direkt in die ROM geschrieben
  und leert die Rückgängig-Liste des Karteneditors.
* Die Bedeutung von Kollision (0/11) ist „Straßennetz“ gegenüber „Häuserblock“
  (inklusive Gehwegen und Plätzen); wer wo gehen oder fahren darf, regelt das Spiel
  zusätzlich über andere Daten.
* Beim Import von Menü-Grafiken ändert sich die Reihenfolge der Kacheln; das ist
  für das Spiel bedeutungslos, macht einen Byte-Vergleich mit dem Original aber
  unbrauchbar.

## Aufbau des Ordners

```
index.html                     Start
css/studio.css
js/core.js                     Bytes, SHA-1, PNG, ZIP, Inflate, BIOS-RLE, GBA-Kacheln, IPS, ROM-Verwaltung
js/app.js                      Rahmen, Navigation, Dialoge
js/i18n.js                     Sprachumschaltung
data/lang*.js                  Übersetzungen (EN/ES/FR/IT), Schlüssel = deutscher Text
js/gfx_scan.js                 Sprite- und Vollbildsuche
js/tab_bulk.js                 Komplett-Paket (ZIP-Export/-Import)
js/tab_menu.js                 Menü-Grafiken (Kacheln + Tilemap)
js/tab_font.js                 Schriften
js/tab_hud.js                  HUD-Grafiken
js/tab_camera.js               Kamera-Hack (Oberflaeche, Einbau, Entfernen)
data/camhack.js                Maschinencode des Kamera-Hacks
js/map_ground.js               Bodengrafik der Inseln (Lesen, Kachel-Import/-Export)
js/map3d.js                    3D-Ansicht des Karten-Editors (WebGL)
js/tab_*.js                    die uebrigen Bereiche
data/tiles1..3.js              Kachelvorschau und Kartenadressen der drei Inseln
```

Alles ist reines JavaScript ohne Abhängigkeiten und ohne Netzwerkzugriff.

### Übersetzungen ergänzen

Schlüssel ist immer der deutsche Text, wie er im Programm steht. Zahlen, Hex-Werte,
Dateinamen und Namen in Anführungszeichen werden vorher durch `{0}`, `{1}` … ersetzt,
damit z. B. „3 Texturen exportiert.“ und „640 Texturen exportiert.“ denselben Eintrag
`'{0} Texturen exportiert.'` nutzen. Fehlende Einträge findest du in der
Browser-Konsole mit `GTAS.i18nCollect = true`, danach etwas bedienen und
`GTAS.i18nReport()` aufrufen.

