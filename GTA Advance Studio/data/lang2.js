/* GTA Advance Studio - Uebersetzungen, Teil 2:
   Erklaertexte, Hinweise, Rueckmeldungen und Dialoge.
   Wird nach data/lang.js geladen und ergaenzt dessen Woerterbuecher.
   Schreibweise wie Teil 1 (ohne Akzente, passend zum Rest der Oberflaeche). */
(function (L) {
'use strict';
function add(id, o) { L[id] = L[id] || {}; for (var k in o) L[id][k] = o[k]; }

/* ================================================================= EN */
add('en', {
/* Startseite */
'Vollstaendiger Mod-Baukasten fuer Grand Theft Auto Advance (Game Boy Advance). Grafiken, Karten, Texte, Sounds, Missionsdaten - alles in einem Programm, ohne Installation.':
  'Complete modding toolkit for Grand Theft Auto Advance (Game Boy Advance). Graphics, maps, texts, sounds, mission data - all in one program, no installation.',
'ROM laden (deine eigene, legal erstellte Kopie von {0}).':'Load the ROM (your own, legally dumped copy of "Grand Theft Auto Advance").',
'Im linken Menue den Bereich waehlen und Aenderungen vornehmen.':'Pick an area in the left menu and make your changes.',
'Unter {0} regelmaessig das Projekt speichern - es enthaelt nur deine Aenderungen.':'Save the project regularly under "ROM & project" - it only contains your changes.',
'Mit {0} die fertige .gba erzeugen und im Emulator (z. B. mGBA) testen.':'Use "Save ROM" to create the finished .gba and test it in an emulator (e.g. mGBA).',
'Das Studio veraendert nie deine Originaldatei. Alle Aenderungen leben im Speicher, bis du sie als neue ROM oder als Projektdatei sicherst. Teste eine gemoddete ROM immer erst im Emulator.':
  'The studio never modifies your original file. All changes live in memory until you save them as a new ROM or as a project file. Always test a modded ROM in an emulator first.',
'Alle Daten auf einmal als ZIP heraus- und wieder hineinschreiben - rund {0} Dateien in neun Bereichen, ohne jede einzeln auszuwaehlen.':
  'Write all data out as one ZIP and back in again - about {0} files in nine areas, without picking each one.',
'Rund {0} Sprites (Autos, Figuren, Effekte) ansehen, als PNG exportieren und wieder einspielen. Verschiebt Daten automatisch, wenn sie groesser werden.':
  'View about {0} sprites (cars, characters, effects), export them as PNG and import them again. Data is relocated automatically when it grows.',
'Die zehn begehbaren {0}-Innenraeume mit {1}-Farben-Palette.':'The ten walkable {0} interiors with a {1}-colour palette.',
'Titelbild, Logo mit allen Animationsstufen, Zwischensequenzen, Portraits, Briefing-Tafeln und Symbole - {0} Bilder aus Kacheln, Tilemap und Palette.':
  'Title screen, logo with all animation frames, cutscenes, portraits, briefing boards and icons - {0} images made of tiles, tilemap and palette.',
'Die {0} unkomprimierten {1}-Bit-Texturen der Stadt - Daecher, Fassaden, Strassenbelag - in den echten Farben der gefundenen Weltpalette.':
  'The {0} uncompressed {1}-bit city textures - roofs, facades, road surfaces - in the real colours of the world palette.',
'HUD- und Textschrift als {0}-Glyphen: A-Z, Ziffern, Satzzeichen und Akzentbuchstaben ansehen, exportieren und austauschen.':
  'HUD and text font as {0} glyphs: view, export and replace A-Z, digits, punctuation and accented letters.',
'Alle drei Inseln mit fuenf Ansichten - die Gebaeudetypen-Ansicht faerbt Strasse, Gehweg, Gebaeude und Hochstrasse ein. Mit Uebersichtskarte, Zell-Inspektor und nach Typ gruppierter Kachelauswahl.':
  'All three islands with five views - the building-type view colours road, pavement, buildings and elevated road. With overview map, cell inspector and tile picker grouped by type.',
'Saemtliche Spieltexte in fuenf Sprachen (EN/ES/FR/IT/DE) inklusive Menue-Strings, mit automatischer Neuverlinkung bei laengeren Texten.':
  'All game texts in five languages (EN/ES/FR/IT/DE) including menu strings, with automatic re-linking for longer texts.',
'Alle PCM-Samples anhoeren, als WAV exportieren und eigene WAV-Dateien importieren.':'Listen to all PCM samples, export them as WAV and import your own WAV files.',
'Die benannten Spiel-Datensaetze (Missionen, Instanzen, Ereignisse, Dialogverweise) durchsuchen und Werte aendern.':
  'Browse the named game records (missions, instances, events, dialogue references) and change values.',
'Rohzugriff auf jede Stelle der ROM, mit Lesezeichen aller bekannten Strukturen.':'Raw access to every byte of the ROM, with bookmarks for all known structures.',
'Vollbilder (Raeume)':'Full screens (rooms)','Welt-Texturen':'World textures','Karten-Editor':'Map editor','Missionen und Objekte':'Missions and objects',
'Menue-Grafiken':'Menu graphics','Schriften':'Fonts','Hex-Editor':'Hex editor','Sound':'Sound','Sprites':'Sprites','Auswahl':'Select',
'Fuellen':'Fill','Schieben':'Pan',

/* ROM & Projekt */
'Zustand der geladenen ROM, Projektverwaltung und Ausgabe der fertigen Moddatei.':'State of the loaded ROM, project management and output of the finished mod file.',
'Die Projektdatei enthaelt nur deine Aenderungen - die ROM selbst wird nicht mitgespeichert.':'The project file only contains your changes - the ROM itself is not stored in it.',
'Beim Speichern wird die Kopf-Pruefsumme automatisch neu berechnet. Teste die Ausgabe vor dem Flashen in einem Emulator.':
  'The header checksum is recalculated automatically on saving. Test the output in an emulator before flashing.',
'Ein IPS-Patch enthaelt nur deine Aenderungen, nicht das Spiel selbst. So kannst du einen Mod weitergeben, ohne die ROM mitzuliefern - andere wenden den Patch auf ihre eigene Kopie an.':
  'An IPS patch only contains your changes, not the game itself. This lets you share a mod without distributing the ROM - others apply the patch to their own copy.',
'Prueft sich selbst: der Patch wird sofort auf die Original-ROM angewendet und mit deinem Stand verglichen.':
  'Self-checking: the patch is immediately applied to the original ROM and compared with your current state.',
'IPS-Patch wird erstellt ...':'Creating IPS patch ...','Patch wird gegengeprueft ...':'Verifying patch ...',
'IPS-Patch gespeichert: {0} Datensaetze, {1} KB.':'IPS patch saved: {0} records, {1} KB.',
'IPS-Patch gespeichert: {0} Datensaetze, {1} KB (IPS32, weil die ROM groesser als {2} MB ist).':'IPS patch saved: {0} records, {1} KB (IPS32, because the ROM is larger than {2} MB).',
'Keine Aenderungen - ein Patch waere leer.':'No changes - the patch would be empty.',
'Selbstkontrolle fehlgeschlagen - es wurde nichts geschrieben.':'Self-check failed - nothing was written.',
'Keine Aenderungen gegenueber dem Original.':'No changes compared to the original.',
'Auf Originalzustand zurueckgesetzt.':'Reset to the original state.',
'Saemtliche Aenderungen gehen verloren. Fortfahren?':'All changes will be lost. Continue?',
'Zuruecksetzen':'Reset',
'ROM passt nicht':'ROM does not match',
'Das Projekt wurde mit einer anderen ROM erstellt. Trotzdem anwenden?':'The project was created with a different ROM. Apply anyway?',
'Bitte zuerst die Original-ROM laden, dann das Projekt.':'Please load the original ROM first, then the project.',
'Projekt geladen: {0} Aenderungsbloecke.':'Project loaded: {0} change blocks.',
'Projekt gespeichert ({0} Aenderungsbloecke).':'Project saved ({0} change blocks).',
'Projekt wird geschrieben ...':'Writing project ...',
'Die ROM ist bereits {0} MB gross.':'The ROM is already {0} MB.',
'ROM auf {0} MB erweitert.':'ROM expanded to {0} MB.',
'Die ROM wird auf {0} MB vergroessert. Das schafft Platz fuer grosse Umbauten, setzt beim Spielen auf echter Hardware aber ein {1}-MB-faehiges Modul voraus. Emulatoren koennen das immer.':
  'The ROM will be expanded to {0} MB. This makes room for large conversions, but playing on real hardware then requires a {1} MB capable cartridge. Emulators always handle it.',
'unbekannte Fassung - Adressen koennen abweichen':'unknown version - addresses may differ',
'ungueltig (wird beim Speichern korrigiert)':'invalid (fixed on saving)',
'... und {0} weitere Bloecke':'... and {0} more blocks','... und {0} weitere':'... and {0} more',
'Grand Theft Auto Advance (Europe) (En,Fr,De,Es,It)':'Grand Theft Auto Advance (Europe) (En,Fr,De,Es,It)',

/* allgemein */
'Keine ROM geladen.':'No ROM loaded.',
'Datei ist zu klein fuer eine GBA-ROM.':'File is too small for a GBA ROM.',
'Datei konnte nicht gelesen werden':'File could not be read',
'Bitte eine .gba-ROM oder eine .gtastudio-Projektdatei ablegen.':'Please drop a .gba ROM or a .gtastudio project file.',
'Import abgeschlossen':'Import finished','Import abgeschlossen.':'Import finished.',
'Import fehlgeschlagen':'Import failed','Import: {0} geaendert, {1} Fehler':'Import: {0} changed, {1} errors',
'nichts geaendert':'nothing changed','uebersprungen: {0}':'skipped: {0}','uebersprungen: {0} (kein passender Name)':'skipped: {0} (no matching name)',
'kein passender Name':'no matching name','Eintraege':'entries','{0} Eintraege':'{0} entries',
'alle ({0})':'all ({0})','alle Groessen ({0})':'all sizes ({0})','Ungueltiger Wert.':'Invalid value.',

/* Sprites / Vollbilder */
'Autos, Figuren, Waffen, Effekte und Objekte - {0}bpp mit {1} Farben. Als PNG exportieren, bearbeiten und wieder einspielen. Wird eine Grafik nach dem Packen groesser, verschiebt das Studio sie ans ROM-Ende und passt alle Pointer an.':
  'Cars, characters, weapons, effects and objects - {0}bpp with {1} colours. Export as PNG, edit and import again. If a graphic grows after packing, the studio moves it to the end of the ROM and updates all pointers.',
'Zehn bildschirmfuellende {0}-Grafiken mit {1}-Farben-Palette - die begehbaren Innenraeume. Titelbild, Logo und die uebrigen Menuebilder liegen in einem anderen Format und stehen unter {2}. Identische Kopien werden beim Import automatisch mitgezogen.':
  'Ten full-screen {0} graphics with a {1}-colour palette - the walkable interiors. Title screen, logo and the other menu images use a different format and are found under "Menu graphics". Identical copies are updated automatically on import.',
'Die ROM muss einmalig nach Grafiken durchsucht werden. Das Ergebnis bleibt fuer diese Sitzung gespeichert.':
  'The ROM has to be scanned for graphics once. The result is kept for this session.',
'Gefunden: {0} Sprites, {1} Vollbilder, {2} Paletten.':'Found: {0} sprites, {1} full screens, {2} palettes.',
'Auf ein Feld klicken, um die Farbe zu aendern. Mehrere Sprites koennen sich eine Palette teilen.':'Click a swatch to change the colour. Several sprites can share one palette.',
'Keine eindeutige Palette gefunden - angezeigt wird eine Ersatzpalette. Die Indizes stimmen trotzdem.':'No unique palette found - a substitute palette is shown. The indices are still correct.',
'Farbe {0} der Palette {1}. Der GBA speichert {2} Bit - die Farbe wird gerundet.':'Colour {0} of palette {1}. The GBA stores {2} bits - the colour will be rounded.',
'Palette {0}':'Palette {0}','Palettenfarbe geaendert.':'Palette colour changed.',
'{0} Farben lagen weit ausserhalb der Palette und wurden auf die naechste gerundet.':'{0} colours were far outside the palette and were rounded to the nearest one.',
'PNG-Palette weicht ab - es werden die Palettenindizes verwendet. Farben aenderst du ueber die Palette im Studio oder per Farbabgleich.':
  'PNG palette differs - the palette indices are used. Change colours via the palette in the studio or with colour matching.',
'Bildgroesse {0}, erwartet {1}':'Image size {0}, expected {1}','Groesse {0}, erwartet {1}':'Size {0}, expected {1}',
'Palettenindex {0} im PNG, erlaubt sind {1}..{2}':'Palette index {0} in the PNG, allowed are {1}..{2}',
'Palettenindex > {0} - {1}bpp erlaubt nur {2} Farben':'Palette index > {0} - {1}bpp only allows {2} colours',
'Palettenindex > {0} - Vollbilder erlauben nur {1} Farben':'Palette index > {0} - full screens only allow {1} colours',
'{0}: unveraendert':'{0}: unchanged',
'{0}: an Ort und Stelle ({1}/{2} Bytes)':'{0}: in place ({1}/{2} bytes)',
'{0}: verschoben nach {1} ({2} Bytes, {3} Pointer angepasst)':'{0}: moved to {1} ({2} bytes, {3} pointers updated)',
'FEHLER {0}: {1} Bytes, Platz {2}, keine Pointer bekannt - nicht verschiebbar':'ERROR {0}: {1} bytes, room {2}, no known pointers - cannot be moved',
'FEHLER {0}: kein freier Platz mehr (ROM unter {1} auf {2} MB erweitern)':'ERROR {0}: no free space left (expand the ROM to {2} MB under "ROM & project")',
'{0} Grafiken exportiert.':'{0} graphics exported.','Grafiken exportiert.':'Graphics exported.',
'PNG-Dateien werden erzeugt ...':'Creating PNG files ...','PNG-Dateien werden eingespielt ...':'Importing PNG files ...',

/* Menue-Grafiken */
'Titelbild, Logo mit seinen Animationsstufen, Zwischensequenzen, Figuren-Portraits, Briefing-Tafeln und Waffen-/Objektsymbole. Jedes Bild besteht aus {0}bpp-Kacheln, einer Tilemap und einer {1}-Farben-Palette.':
  'Title screen, logo with its animation frames, cutscenes, character portraits, briefing boards and weapon/object icons. Each image consists of {0}bpp tiles, a tilemap and a {1}-colour palette.',
'Bekannte Bilder: #{0} Titelbild, #{1}-#{2} GTA-Advance-Logo, #{3} Rockstar-Logo, #{4} Digital Eclipse. Mit ★ markierte Eintraege sind benannt - du kannst auch nach dem Namen suchen.':
  'Known images: #{0} title screen, #{1}-#{2} GTA Advance logo, #{3} Rockstar logo, #{4} Digital Eclipse. Entries marked with ★ are named - you can also search by name.',
'Beim Import baut das Studio Kacheln und Tilemap neu auf und erkennt dabei gespiegelte Wiederholungen. Bildgroesse beibehalten, hoechstens {0} Farben, Index {1} ist transparent. Braucht das Ergebnis mehr Platz, wandert der Block ans ROM-Ende und der Datensatz wird angepasst.':
  'On import the studio rebuilds tiles and tilemap and detects mirrored repeats. Keep the image size, at most {0} colours, index {1} is transparent. If the result needs more room, the block moves to the end of the ROM and the record is updated.',
'Keine Menue-Bildtabelle gefunden - andere ROM-Fassung?':'No menu image table found - different ROM version?',
'Bild #{0} ist identisch - nichts geaendert.':'Image #{0} is identical - nothing changed.',
'Bild #{0} ersetzt: {1} Kacheln, an Ort und Stelle.':'Image #{0} replaced: {1} tiles, in place.',
'Bild #{0} ersetzt: {1} Kacheln, verschoben nach {2}.':'Image #{0} replaced: {1} tiles, moved to {2}.',
'#{0}: identisch, nichts geaendert':'#{0}: identical, nothing changed',
'#{0}: {1} Kacheln':'#{0}: {1} tiles','#{0}: {1} Kacheln, verschoben nach {2}':'#{0}: {1} tiles, moved to {2}',
'{0}  ({1} Stueck, {2} B)':'{0}  ({1} pcs, {2} B)',
'Farbe {0} aendern':'Change colour {0}',
'Palette {0}. Der GBA speichert {1} Bit, die Farbe wird gerundet.':'Palette {0}. The GBA stores {1} bits, the colour will be rounded.',
'Palettenindex {0} - erlaubt sind nur {1} Farben ({2}..{3})':'Palette index {0} - only {1} colours are allowed ({2}..{3})',
'{0} verschiedene Kacheln - die Hardware erlaubt hoechstens {1}':'{0} different tiles - the hardware allows at most {1}',
'kein freier Platz mehr - ROM unter {0} auf {1} MB erweitern':'no free space left - expand the ROM to {1} MB under "ROM & project"',
'{0} Menue-Grafiken exportiert.':'{0} menu graphics exported.',
'Menue-Grafiken exportiert.':'Menu graphics exported.',
'Menue-Grafiken werden exportiert ...':'Exporting menu graphics ...','Menue-Grafiken werden eingespielt ...':'Importing menu graphics ...',

/* Welt-Texturen */
'Die unkomprimierten {0}-Bit-Texturen der Stadt ({1}, {2} und {3} Pixel) - Dachflaechen, Fassaden, Strassenbelag. Groesse und Lage sind fest: beim Import werden die Pixel direkt an derselben Stelle ersetzt.':
  'The uncompressed {0}-bit city textures ({1}, {2} and {3} pixels) - roofs, facades, road surfaces. Size and position are fixed: on import the pixels are replaced in the same place.',
'Angezeigt wird die Weltpalette der Engine - {0} Farben, in der ROM viermal abgelegt. Beim Bearbeiten zaehlen die Palettenindizes, und die bleiben bei Export und Import exakt erhalten.':
  'The engine\'s world palette is shown - {0} colours, stored four times in the ROM. When editing, the palette indices are what counts, and they are preserved exactly on export and import.',
'{0} Farben @ {1}':'{0} colours @ {1}',
'Keine Texturtabellen gefunden - andere ROM-Fassung?':'No texture tables found - different ROM version?',
'{0} Texturen exportiert.':'{0} textures exported.','Texturen exportiert.':'Textures exported.','{0} Texturen ersetzt':'{0} textures replaced',
'Texturen werden exportiert ...':'Exporting textures ...','Texturen werden eingespielt ...':'Importing textures ...',

/* Schriften */
'Die Spieltexte werden zur Laufzeit aus {0}-Glyphen gesetzt: {1}bpp, {2} Byte je Zeichen, fortlaufend in der ROM. Gefunden habe ich sie ueber den Bildspeicher des beiliegenden Savestates - die dort sichtbaren Buchstaben stehen genauso in der ROM.':
  'The game texts are drawn at runtime from {0} glyphs: {1}bpp, {2} bytes per character, stored consecutively in the ROM. They were located via the video memory of the included savestate - the letters visible there are stored the same way in the ROM.',
'A-Z, Ziffern und die gaengigen Satzzeichen sind gesichert. Die {0} Akzentbuchstaben benutzen eine eigene Kodierung des Spiels (nicht Latin-{1}) - welcher Zeichencode auf welche Glyphe zeigt, rechnet der Programmcode aus, es gibt dafuer keine Tabelle in der ROM. Sie sind darum nach Position benannt.':
  'A-Z, digits and the common punctuation marks are confirmed. The {0} accented letters use the game\'s own encoding (not Latin-{1}) - the program code computes which character code points to which glyph, there is no table for it in the ROM. They are therefore named by position.',
'Keine Schrift gefunden - andere ROM-Fassung?':'No font found - different ROM version?',
'{0} Byte der Schrift ersetzt.':'{0} bytes of the font replaced.',
'Schrift ist identisch - nichts geaendert.':'Font is identical - nothing changed.',
'{0} Schriften exportiert.':'{0} fonts exported.','Zeichen {0}':'Character {0}','Zeichen {0}  {1}':'Character {0}  {1}',
'{0} PNG - HUD- und Textschrift':'{0} PNG - HUD and text font',

/* Karten-Editor */
'Hoehe {0}, begehbar':'Height {0}, walkable','Hoehe {0}, gesperrt':'Height {0}, blocked',
'Hoehe {0}, begehbar - Fahrbahn':'Height {0}, walkable - roadway','Hoehe {0}, gesperrt - Wasser, Randsperren':'Height {0}, blocked - water, edge barriers',
'Zwischenhoehen':'Intermediate heights','Kollision {0} · Hoehe {1}':'Collision {0} · height {1}',
'{0} Zellen':'{0} cells','Insel {0}':'Island {0}','Insel {0} ({1})':'Island {0} ({1})','Zelle {0},{1}':'Cell {0},{1}','Wert {0}':'Value {0}',
'{0} Aenderungsschritte':'{0} edit steps','Taste H - oder Leertaste halten':'Key H - or hold the space bar',
'Insel {0} in die ROM geschrieben.':'Island {0} written to the ROM.',
'Insel {0} wird aus der Original-ROM neu geladen. Aenderungen an dieser Insel gehen verloren (bereits in die ROM geschriebene bleiben, bis du erneut schreibst).':
  'Island {0} will be reloaded from the original ROM. Changes to this island will be lost (changes already written to the ROM stay until you write again).',
'Original wiederherstellen':'Restore original',
'Karte als JSON gespeichert.':'Map saved as JSON.','Karte geladen. Mit {0} uebernehmen.':'Map loaded. Apply it with "Write to ROM".',
'gehoert zu einer anderen Insel oder Groesse':'belongs to a different island or size',
'Keine Kachel passt zum Filter.':'No tile matches the filter.','Nichts rueckgaengig zu machen.':'Nothing to undo.',
'Zwischenablage ist leer.':'Clipboard is empty.','Zuerst mit dem Auswahlwerkzeug einen Bereich markieren.':'First mark an area with the selection tool.',
'Zielpunkt mit dem Auswahlwerkzeug markieren.':'Mark the target point with the selection tool.',
'Objektliste konnte nicht verifiziert werden':'Object list could not be verified','Zonenliste konnte nicht verifiziert werden':'Zone list could not be verified',
'Objektliste konnte nicht verifiziert werden - Werte trotzdem bearbeitbar, aber bitte pruefen.':'Object list could not be verified - values can still be edited, but please check them.',
'Zonenliste konnte nicht verifiziert werden - Werte trotzdem bearbeitbar, aber bitte pruefen.':'Zone list could not be verified - values can still be edited, but please check them.',
'Objektliste konnte nicht verifiziert werden · Zonenliste konnte nicht verifiziert werden - Werte trotzdem bearbeitbar, aber bitte pruefen.':'Object list and zone list could not be verified - values can still be edited, but please check them.',

/* Text-Editor */
'Alle ueber Zeiger erreichbaren Zeichenketten der ROM: Missionsdialoge in fuenf Sprachen, Menuetexte, Ortsnamen und interne Bezeichner. Laengere Texte werden automatisch ans ROM-Ende verschoben und alle Zeiger nachgezogen.':
  'All strings in the ROM reachable via pointers: mission dialogue in five languages, menu texts, place names and internal identifiers. Longer texts are moved to the end of the ROM automatically and all pointers are updated.',
'Die ROM muss einmalig nach Texten durchsucht werden.':'The ROM has to be scanned for texts once.',
'Text bearbeiten':'Edit text','Suchen und Ersetzen':'Find and replace','Suchen nach ...':'Find ...','Ersetzen durch ...':'Replace with ...',
'Wirkt nur auf die gerade sichtbare Auswahl (Filter und Suche werden beruecksichtigt).':'Only affects the currently visible selection (filter and search are taken into account).',
'Offset {0} · {1} Zeiger · GBA-Zeichensatz: nur Zeichen bis Code {2} (Latin-{3}).':'Offset {0} · {1} pointers · GBA character set: only characters up to code {2} (Latin-{3}).',
'→ wird ans ROM-Ende verschoben':'→ will be moved to the end of the ROM','{0} Zeichen nicht darstellbar':'{0} characters cannot be displayed',
'Gespeichert.':'Saved.','Gespeichert, {0} Text(e) verschoben.':'Saved, {0} text(s) moved.','Gespeichert, {0} Zeichen ersetzt.':'Saved, {0} characters replaced.',
'Gespeichert, {0} Text(e) verschoben, {1} Zeichen ersetzt.':'Saved, {0} text(s) moved, {1} characters replaced.',
'{0} Texte geaendert.':'{0} texts changed.','{0} Texte geaendert, {1} verschoben.':'{0} texts changed, {1} moved.',
'{0} Texte uebernommen.':'{0} texts applied.','{0} Texte uebernommen, {1} verschoben.':'{0} texts applied, {1} moved.',

/* Sound */
'Alle PCM-Samples der ROM: Sprachaufnahmen, Motoren, Waffen, Radio-Schnipsel. Anhoeren, als WAV sichern und eigene Aufnahmen einspielen - das Studio wandelt automatisch in das {0}-Bit-Format des Game Boy Advance um.':
  'All PCM samples in the ROM: voice recordings, engines, weapons, radio snippets. Listen, save as WAV and import your own recordings - the studio converts automatically to the Game Boy Advance {0}-bit format.',
'Diese ROM benutzt keinen Sequenzer wie Nintendos MusicPlayer2000 (Sappy). Es gibt darin also keine MIDI- oder Notendaten, die man exportieren koennte - die gesamte Musik und alle Gerausche liegen als fertig aufgenommene PCM-Samples vor. Genau die bearbeitest du hier: Wer eigene Musik einbauen will, rendert sie als WAV und spielt sie als Sample ein.':
  'This ROM does not use a sequencer such as Nintendo\'s MusicPlayer2000 (Sappy). So there is no MIDI or note data that could be exported - all music and sound effects are stored as pre-recorded PCM samples. That is exactly what you edit here: to add your own music, render it as WAV and import it as a sample.',
'Die ROM enthaelt keinen Noten-/Sequenzer-Teil (kein MusicPlayer2000). Musik liegt komplett als PCM vor - eigene Musik baust du als WAV ein.':
  'The ROM contains no note/sequencer part (no MusicPlayer2000). All music is PCM - add your own music as WAV.',
'Kuerzere Aufnahmen passen immer. Laengere werden ans ROM-Ende verschoben und alle Zeiger angepasst - das geht nur, wenn mindestens ein Zeiger bekannt ist.':
  'Shorter recordings always fit. Longer ones are moved to the end of the ROM and all pointers are updated - this only works if at least one pointer is known.',
'Die ROM muss einmalig nach Samples durchsucht werden.':'The ROM has to be scanned for samples once.',
'Daten ab':'Data from','Wiedergabe nicht moeglich':'Playback not possible',
'Sample ersetzt (an Ort und Stelle).':'Sample replaced (in place).','Sample ersetzt, verschoben nach {0}.':'Sample replaced, moved to {0}.',
'{0}: verschoben nach {1} ({2} B)':'{0}: moved to {1} ({2} B)','{0}: ersetzt ({1} B)':'{0}: replaced ({1} B)',
'Sample ist laenger und hat keinen bekannten Zeiger - nicht verschiebbar':'Sample is longer and has no known pointer - cannot be moved',
'kein freier Platz mehr - ROM auf {0} MB erweitern':'no free space left - expand the ROM to {0} MB',
'keine WAV-Datei':'not a WAV file','nur unkomprimiertes PCM wird unterstuetzt':'only uncompressed PCM is supported','{0} Bit werden nicht unterstuetzt':'{0} bit is not supported',
'WAV-Dateien werden erzeugt ...':'Creating WAV files ...','WAV-Dateien werden eingespielt ...':'Importing WAV files ...',

/* Missionen */
'Das Spiel beschreibt Missionen, platzierte Objekte und Ereignisse ueber benannte Datensaetze. Das Studio findet diese Tabellen ueber ihre Namenszeiger und zeigt jedes Feld an - Zahlenwerte, Zeiger auf Texte und Verweise auf andere Datensaetze lassen sich direkt aendern.':
  'The game describes missions, placed objects and events through named records. The studio finds these tables via their name pointers and shows every field - numbers, pointers to texts and references to other records can be changed directly.',
'Die Namen und die Tabellenstruktur sind gesichert - die Bedeutung der einzelnen Zahlenfelder ist es nicht vollstaendig. Das Studio zeigt darum jedes Feld mit seiner Deutung (Zahl, Zeiger, Text) an, statt eine Bedeutung zu erfinden. Aendere Werte in kleinen Schritten und teste im Emulator.':
  'The names and the table structure are confirmed - the meaning of the individual number fields is not fully known. The studio therefore shows every field with its interpretation (number, pointer, text) instead of inventing a meaning. Change values in small steps and test in the emulator.',
'Die Missionsdaten muessen einmalig analysiert werden.':'The mission data has to be analysed once.',
'Texte werden gesucht (Grundlage fuer die Missionsdaten) ...':'Searching texts (basis for the mission data) ...',
'Keine benannten Datensatztabellen gefunden.':'No named record tables found.',
'Jeder Eintrag dieser Tabelle ist {0} Byte gross und beginnt hier beim Namenszeiger.':'Each entry of this table is {0} bytes long and starts here at the name pointer.',
'(koennte Weltkoordinate sein)':'(could be a world coordinate)',
'{0} Datensaetze exportiert.':'{0} records exported.',

/* Hex-Editor */
'Direkter Zugriff auf jede Stelle der ROM - fuer alles, was die anderen Werkzeuge nicht abdecken. Die Lesezeichen fuehren zu allen bekannten Strukturen.':
  'Direct access to every byte of the ROM - for everything the other tools do not cover. The bookmarks lead to all known structures.',
'{0}  ROM-Kopf (Titel, Code, Pruefsumme)':'{0}  ROM header (title, code, checksum)','{0}  Menue-Texte (UI)':'{0}  Menu texts (UI)',
'{0}  Abspann-Texttabellen':'{0}  Credits text tables','{0}  Dialogtabellen':'{0}  Dialogue tables','{0}  Ereignis-Datensaetze':'{0}  Event records',
'{0}  Insel {1}: Zellen':'{0}  Island {1}: cells','{0}  Insel {1}: Zonen ({2})':'{0}  Island {1}: zones ({2})','{0}  Insel {1}: Ebene B':'{0}  Island {1}: layer B',
'{0}  Sound-Index (Sample-Zeiger)':'{0}  Sound index (sample pointers)',
'z. B. {0} A0 {1} oder {2}':'e.g. {0} A0 {1} or {2}'
});

/* ================================================================= ES */
add('es', {
'Vollstaendiger Mod-Baukasten fuer Grand Theft Auto Advance (Game Boy Advance). Grafiken, Karten, Texte, Sounds, Missionsdaten - alles in einem Programm, ohne Installation.':
  'Kit completo de modding para Grand Theft Auto Advance (Game Boy Advance). Graficos, mapas, textos, sonidos, datos de misiones - todo en un programa, sin instalacion.',
'ROM laden (deine eigene, legal erstellte Kopie von {0}).':'Carga la ROM (tu propia copia de "Grand Theft Auto Advance", extraida legalmente).',
'Im linken Menue den Bereich waehlen und Aenderungen vornehmen.':'Elige un area en el menu de la izquierda y haz tus cambios.',
'Unter {0} regelmaessig das Projekt speichern - es enthaelt nur deine Aenderungen.':'Guarda el proyecto con regularidad en "ROM y proyecto" - solo contiene tus cambios.',
'Mit {0} die fertige .gba erzeugen und im Emulator (z. B. mGBA) testen.':'Con "Guardar ROM" creas el .gba final; pruebalo en un emulador (p. ej. mGBA).',
'Das Studio veraendert nie deine Originaldatei. Alle Aenderungen leben im Speicher, bis du sie als neue ROM oder als Projektdatei sicherst. Teste eine gemoddete ROM immer erst im Emulator.':
  'El estudio nunca modifica tu archivo original. Todos los cambios viven en memoria hasta que los guardes como ROM nueva o como archivo de proyecto. Prueba siempre una ROM modificada primero en un emulador.',
'Alle Daten auf einmal als ZIP heraus- und wieder hineinschreiben - rund {0} Dateien in neun Bereichen, ohne jede einzeln auszuwaehlen.':
  'Exporta todos los datos de una vez como ZIP y vuelve a importarlos - unos {0} archivos en nueve areas, sin elegir cada uno.',
'Rund {0} Sprites (Autos, Figuren, Effekte) ansehen, als PNG exportieren und wieder einspielen. Verschiebt Daten automatisch, wenn sie groesser werden.':
  'Ver unos {0} sprites (coches, personajes, efectos), exportarlos como PNG e importarlos de nuevo. Los datos se reubican solos si crecen.',
'Die zehn begehbaren {0}-Innenraeume mit {1}-Farben-Palette.':'Los diez interiores transitables de {0} con paleta de {1} colores.',
'Titelbild, Logo mit allen Animationsstufen, Zwischensequenzen, Portraits, Briefing-Tafeln und Symbole - {0} Bilder aus Kacheln, Tilemap und Palette.':
  'Pantalla de titulo, logo con todas sus fases de animacion, cinematicas, retratos, paneles de briefing e iconos - {0} imagenes de tiles, tilemap y paleta.',
'Die {0} unkomprimierten {1}-Bit-Texturen der Stadt - Daecher, Fassaden, Strassenbelag - in den echten Farben der gefundenen Weltpalette.':
  'Las {0} texturas sin comprimir de {1} bits de la ciudad - tejados, fachadas, asfalto - con los colores reales de la paleta del mundo.',
'HUD- und Textschrift als {0}-Glyphen: A-Z, Ziffern, Satzzeichen und Akzentbuchstaben ansehen, exportieren und austauschen.':
  'Fuente del HUD y de texto como glifos de {0}: ver, exportar y sustituir A-Z, cifras, signos de puntuacion y letras acentuadas.',
'Alle drei Inseln mit fuenf Ansichten - die Gebaeudetypen-Ansicht faerbt Strasse, Gehweg, Gebaeude und Hochstrasse ein. Mit Uebersichtskarte, Zell-Inspektor und nach Typ gruppierter Kachelauswahl.':
  'Las tres islas con cinco vistas - la vista de tipos de edificio colorea calle, acera, edificios y paso elevado. Con minimapa, inspector de celdas y selector de tiles agrupado por tipo.',
'Saemtliche Spieltexte in fuenf Sprachen (EN/ES/FR/IT/DE) inklusive Menue-Strings, mit automatischer Neuverlinkung bei laengeren Texten.':
  'Todos los textos del juego en cinco idiomas (EN/ES/FR/IT/DE) incluidos los del menu, con reenlace automatico para textos mas largos.',
'Alle PCM-Samples anhoeren, als WAV exportieren und eigene WAV-Dateien importieren.':'Escucha todas las muestras PCM, exportalas como WAV e importa tus propios WAV.',
'Die benannten Spiel-Datensaetze (Missionen, Instanzen, Ereignisse, Dialogverweise) durchsuchen und Werte aendern.':
  'Explora los registros con nombre del juego (misiones, instancias, eventos, referencias de dialogo) y cambia valores.',
'Rohzugriff auf jede Stelle der ROM, mit Lesezeichen aller bekannten Strukturen.':'Acceso directo a cada byte de la ROM, con marcadores de todas las estructuras conocidas.',
'Vollbilder (Raeume)':'Pantallas completas (interiores)','Welt-Texturen':'Texturas del mundo','Karten-Editor':'Editor de mapas','Missionen und Objekte':'Misiones y objetos',
'Menue-Grafiken':'Graficos de menu','Schriften':'Fuentes','Hex-Editor':'Editor hexadecimal','Sound':'Sonido','Sprites':'Sprites','Auswahl':'Seleccion',
'Fuellen':'Rellenar','Schieben':'Mover vista',
'oder Datei einfach ins Fenster ziehen':'o simplemente arrastra el archivo a la ventana',

'Zustand der geladenen ROM, Projektverwaltung und Ausgabe der fertigen Moddatei.':'Estado de la ROM cargada, gestion del proyecto y salida del mod terminado.',
'Die Projektdatei enthaelt nur deine Aenderungen - die ROM selbst wird nicht mitgespeichert.':'El archivo de proyecto solo contiene tus cambios - la ROM no se guarda en el.',
'Beim Speichern wird die Kopf-Pruefsumme automatisch neu berechnet. Teste die Ausgabe vor dem Flashen in einem Emulator.':
  'Al guardar se recalcula automaticamente la suma de control de la cabecera. Prueba el resultado en un emulador antes de grabarlo en un cartucho.',
'Ein IPS-Patch enthaelt nur deine Aenderungen, nicht das Spiel selbst. So kannst du einen Mod weitergeben, ohne die ROM mitzuliefern - andere wenden den Patch auf ihre eigene Kopie an.':
  'Un parche IPS solo contiene tus cambios, no el juego. Asi puedes compartir un mod sin distribuir la ROM - los demas aplican el parche a su propia copia.',
'Prueft sich selbst: der Patch wird sofort auf die Original-ROM angewendet und mit deinem Stand verglichen.':
  'Se comprueba solo: el parche se aplica enseguida a la ROM original y se compara con tu version.',
'IPS-Patch wird erstellt ...':'Creando parche IPS ...','Patch wird gegengeprueft ...':'Verificando parche ...',
'IPS-Patch gespeichert: {0} Datensaetze, {1} KB.':'Parche IPS guardado: {0} registros, {1} KB.',
'IPS-Patch gespeichert: {0} Datensaetze, {1} KB (IPS32, weil die ROM groesser als {2} MB ist).':'Parche IPS guardado: {0} registros, {1} KB (IPS32, porque la ROM supera los {2} MB).',
'Keine Aenderungen - ein Patch waere leer.':'No hay cambios - el parche estaria vacio.',
'Selbstkontrolle fehlgeschlagen - es wurde nichts geschrieben.':'La autocomprobacion fallo - no se ha escrito nada.',
'Keine Aenderungen gegenueber dem Original.':'No hay cambios respecto al original.',
'Auf Originalzustand zurueckgesetzt.':'Restablecido al estado original.',
'Saemtliche Aenderungen gehen verloren. Fortfahren?':'Se perderan todos los cambios. Continuar?',
'Zuruecksetzen':'Restablecer','ROM passt nicht':'La ROM no coincide',
'Das Projekt wurde mit einer anderen ROM erstellt. Trotzdem anwenden?':'El proyecto se creo con otra ROM. Aplicar de todos modos?',
'Bitte zuerst die Original-ROM laden, dann das Projekt.':'Carga primero la ROM original y despues el proyecto.',
'Projekt geladen: {0} Aenderungsbloecke.':'Proyecto cargado: {0} bloques de cambios.',
'Projekt gespeichert ({0} Aenderungsbloecke).':'Proyecto guardado ({0} bloques de cambios).',
'Projekt wird geschrieben ...':'Guardando proyecto ...',
'Die ROM ist bereits {0} MB gross.':'La ROM ya tiene {0} MB.','ROM auf {0} MB erweitert.':'ROM ampliada a {0} MB.',
'Die ROM wird auf {0} MB vergroessert. Das schafft Platz fuer grosse Umbauten, setzt beim Spielen auf echter Hardware aber ein {1}-MB-faehiges Modul voraus. Emulatoren koennen das immer.':
  'La ROM se ampliara a {0} MB. Esto deja sitio para grandes cambios, pero para jugar en hardware real necesitas un cartucho de {1} MB. Los emuladores siempre lo admiten.',
'unbekannte Fassung - Adressen koennen abweichen':'version desconocida - las direcciones pueden variar',
'ungueltig (wird beim Speichern korrigiert)':'no valido (se corrige al guardar)',
'... und {0} weitere Bloecke':'... y {0} bloques mas','... und {0} weitere':'... y {0} mas',
'Andere ROM-Version erkannt - bekannte Adressen koennen abweichen.':'Detectada otra version de la ROM - las direcciones conocidas pueden variar.',
'Kartendaten ({0} Level)':'Datos de mapa ({0} niveles)','Missions- und Objektdaten':'Datos de misiones y objetos',
'Notizen zum Mod ...':'Notas sobre el mod ...','Tabellen & Sound-Index':'Tablas e indice de sonido','Verweistabellen':'Tablas de referencias',
'Welt-Texturen ({0}bpp)':'Texturas del mundo ({0}bpp)','freier Bereich / neue Daten':'zona libre / datos nuevos',

'Keine ROM geladen.':'No hay ninguna ROM cargada.','Datei ist zu klein fuer eine GBA-ROM.':'El archivo es demasiado pequeno para una ROM de GBA.',
'Datei konnte nicht gelesen werden':'No se pudo leer el archivo',
'Bitte eine .gba-ROM oder eine .gtastudio-Projektdatei ablegen.':'Suelta una ROM .gba o un archivo de proyecto .gtastudio.',
'Import abgeschlossen':'Importacion terminada','Import abgeschlossen.':'Importacion terminada.',
'Import fehlgeschlagen':'Error al importar','Import: {0} geaendert, {1} Fehler':'Importacion: {0} cambiados, {1} errores',
'nichts geaendert':'nada cambiado','uebersprungen: {0}':'omitido: {0}','uebersprungen: {0} (kein passender Name)':'omitido: {0} (ningun nombre coincide)',
'Eintraege':'entradas','{0} Eintraege':'{0} entradas','alle ({0})':'todas ({0})','alle Groessen ({0})':'todos los tamanos ({0})','Ungueltiger Wert.':'Valor no valido.',
'Uebernehmen':'Aplicar','Ersetzen':'Reemplazar','Farbe aendern':'Cambiar color',

'Autos, Figuren, Waffen, Effekte und Objekte - {0}bpp mit {1} Farben. Als PNG exportieren, bearbeiten und wieder einspielen. Wird eine Grafik nach dem Packen groesser, verschiebt das Studio sie ans ROM-Ende und passt alle Pointer an.':
  'Coches, personajes, armas, efectos y objetos - {0}bpp con {1} colores. Exporta como PNG, edita e importa de nuevo. Si un grafico crece al comprimirlo, el estudio lo mueve al final de la ROM y ajusta todos los punteros.',
'Zehn bildschirmfuellende {0}-Grafiken mit {1}-Farben-Palette - die begehbaren Innenraeume. Titelbild, Logo und die uebrigen Menuebilder liegen in einem anderen Format und stehen unter {2}. Identische Kopien werden beim Import automatisch mitgezogen.':
  'Diez graficos de pantalla completa de {0} con paleta de {1} colores - los interiores transitables. La pantalla de titulo, el logo y las demas imagenes de menu usan otro formato y estan en "Graficos de menu". Las copias identicas se actualizan solas al importar.',
'Die ROM muss einmalig nach Grafiken durchsucht werden. Das Ergebnis bleibt fuer diese Sitzung gespeichert.':'Hay que analizar la ROM una vez en busca de graficos. El resultado se conserva durante esta sesion.',
'Grafiken werden gesucht ... (einmalig, dauert einige Sekunden)':'Buscando graficos ... (solo una vez, tarda unos segundos)',
'Gefunden: {0} Sprites, {1} Vollbilder, {2} Paletten.':'Encontrado: {0} sprites, {1} pantallas completas, {2} paletas.',
'Auf ein Feld klicken, um die Farbe zu aendern. Mehrere Sprites koennen sich eine Palette teilen.':'Haz clic en una casilla para cambiar el color. Varios sprites pueden compartir una paleta.',
'Keine eindeutige Palette gefunden - angezeigt wird eine Ersatzpalette. Die Indizes stimmen trotzdem.':'No se encontro una paleta clara - se muestra una paleta sustituta. Los indices siguen siendo correctos.',
'Farbe {0} der Palette {1}. Der GBA speichert {2} Bit - die Farbe wird gerundet.':'Color {0} de la paleta {1}. La GBA guarda {2} bits - el color se redondea.',
'Palette {0}':'Paleta {0}','Palettenfarbe geaendert.':'Color de paleta cambiado.',
'Beim Import Farben zuordnen statt Indizes':'Al importar, asignar colores en lugar de indices',
'{0} Farben lagen weit ausserhalb der Palette und wurden auf die naechste gerundet.':'{0} colores estaban muy fuera de la paleta y se redondearon al mas cercano.',
'PNG-Palette weicht ab - es werden die Palettenindizes verwendet. Farben aenderst du ueber die Palette im Studio oder per Farbabgleich.':
  'La paleta del PNG es distinta - se usan los indices de paleta. Cambia los colores con la paleta del estudio o con la asignacion de colores.',
'Bildgroesse {0}, erwartet {1}':'Tamano de imagen {0}, se esperaba {1}','Groesse {0}, erwartet {1}':'Tamano {0}, se esperaba {1}',
'Palettenindex {0} im PNG, erlaubt sind {1}..{2}':'Indice de paleta {0} en el PNG, se permiten {1}..{2}',
'Palettenindex > {0} - {1}bpp erlaubt nur {2} Farben':'Indice de paleta > {0} - {1}bpp solo permite {2} colores',
'Palettenindex > {0} - Vollbilder erlauben nur {1} Farben':'Indice de paleta > {0} - las pantallas completas solo permiten {1} colores',
'{0}: unveraendert':'{0}: sin cambios','{0}: an Ort und Stelle ({1}/{2} Bytes)':'{0}: en su sitio ({1}/{2} bytes)',
'{0}: verschoben nach {1} ({2} Bytes, {3} Pointer angepasst)':'{0}: movido a {1} ({2} bytes, {3} punteros ajustados)',
'FEHLER {0}: {1} Bytes, Platz {2}, keine Pointer bekannt - nicht verschiebbar':'ERROR {0}: {1} bytes, espacio {2}, sin punteros conocidos - no se puede mover',
'FEHLER {0}: kein freier Platz mehr (ROM unter {1} auf {2} MB erweitern)':'ERROR {0}: no queda espacio libre (amplia la ROM a {2} MB en "ROM y proyecto")',
'{0} Grafiken exportiert.':'{0} graficos exportados.','Grafiken exportiert.':'Graficos exportados.',
'PNG-Dateien werden erzeugt ...':'Creando archivos PNG ...','PNG-Dateien werden eingespielt ...':'Importando archivos PNG ...',

'Titelbild, Logo mit seinen Animationsstufen, Zwischensequenzen, Figuren-Portraits, Briefing-Tafeln und Waffen-/Objektsymbole. Jedes Bild besteht aus {0}bpp-Kacheln, einer Tilemap und einer {1}-Farben-Palette.':
  'Pantalla de titulo, logo con sus fases de animacion, cinematicas, retratos de personajes, paneles de briefing e iconos de armas/objetos. Cada imagen consta de tiles de {0}bpp, un tilemap y una paleta de {1} colores.',
'Bekannte Bilder: #{0} Titelbild, #{1}-#{2} GTA-Advance-Logo, #{3} Rockstar-Logo, #{4} Digital Eclipse. Mit ★ markierte Eintraege sind benannt - du kannst auch nach dem Namen suchen.':
  'Imagenes conocidas: #{0} pantalla de titulo, #{1}-#{2} logo de GTA Advance, #{3} logo de Rockstar, #{4} Digital Eclipse. Las entradas con ★ tienen nombre - tambien puedes buscar por nombre.',
'Beim Import baut das Studio Kacheln und Tilemap neu auf und erkennt dabei gespiegelte Wiederholungen. Bildgroesse beibehalten, hoechstens {0} Farben, Index {1} ist transparent. Braucht das Ergebnis mehr Platz, wandert der Block ans ROM-Ende und der Datensatz wird angepasst.':
  'Al importar, el estudio reconstruye tiles y tilemap y detecta repeticiones reflejadas. Manten el tamano de la imagen, como maximo {0} colores, el indice {1} es transparente. Si el resultado necesita mas espacio, el bloque pasa al final de la ROM y se ajusta el registro.',
'Keine Menue-Bildtabelle gefunden - andere ROM-Fassung?':'No se encontro la tabla de imagenes de menu - otra version de la ROM?',
'Bild #{0} ist identisch - nichts geaendert.':'La imagen #{0} es identica - nada cambiado.',
'Bild #{0} ersetzt: {1} Kacheln, an Ort und Stelle.':'Imagen #{0} sustituida: {1} tiles, en su sitio.',
'Bild #{0} ersetzt: {1} Kacheln, verschoben nach {2}.':'Imagen #{0} sustituida: {1} tiles, movida a {2}.',
'#{0}: identisch, nichts geaendert':'#{0}: identica, nada cambiado','#{0}: {1} Kacheln':'#{0}: {1} tiles','#{0}: {1} Kacheln, verschoben nach {2}':'#{0}: {1} tiles, movida a {2}',
'{0}  ({1} Stueck, {2} B)':'{0}  ({1} uds., {2} B)','Farbe {0} aendern':'Cambiar color {0}',
'Palette {0}. Der GBA speichert {1} Bit, die Farbe wird gerundet.':'Paleta {0}. La GBA guarda {1} bits, el color se redondea.',
'Palettenindex {0} - erlaubt sind nur {1} Farben ({2}..{3})':'Indice de paleta {0} - solo se permiten {1} colores ({2}..{3})',
'{0} verschiedene Kacheln - die Hardware erlaubt hoechstens {1}':'{0} tiles distintos - el hardware permite como maximo {1}',
'kein freier Platz mehr - ROM unter {0} auf {1} MB erweitern':'no queda espacio libre - amplia la ROM a {1} MB en "ROM y proyecto"',
'{0} Menue-Grafiken exportiert.':'{0} graficos de menu exportados.','Menue-Grafiken exportiert.':'Graficos de menu exportados.',
'Menue-Grafiken werden exportiert ...':'Exportando graficos de menu ...','Menue-Grafiken werden eingespielt ...':'Importando graficos de menu ...',
'Suche: Nummer oder Offset ...':'Buscar: numero u offset ...',

'Die unkomprimierten {0}-Bit-Texturen der Stadt ({1}, {2} und {3} Pixel) - Dachflaechen, Fassaden, Strassenbelag. Groesse und Lage sind fest: beim Import werden die Pixel direkt an derselben Stelle ersetzt.':
  'Las texturas sin comprimir de {0} bits de la ciudad ({1}, {2} y {3} pixeles) - tejados, fachadas, asfalto. Tamano y posicion son fijos: al importar, los pixeles se sustituyen en el mismo lugar.',
'Angezeigt wird die Weltpalette der Engine - {0} Farben, in der ROM viermal abgelegt. Beim Bearbeiten zaehlen die Palettenindizes, und die bleiben bei Export und Import exakt erhalten.':
  'Se muestra la paleta del mundo del motor - {0} colores, guardada cuatro veces en la ROM. Al editar cuentan los indices de paleta, que se conservan exactamente al exportar e importar.',
'{0} Farben @ {1}':'{0} colores @ {1}','Keine Texturtabellen gefunden - andere ROM-Fassung?':'No se encontraron tablas de texturas - otra version de la ROM?',
'{0} Texturen exportiert.':'{0} texturas exportadas.','Texturen exportiert.':'Texturas exportadas.','{0} Texturen ersetzt':'{0} texturas sustituidas',
'Texturen werden exportiert ...':'Exportando texturas ...','Texturen werden eingespielt ...':'Importando texturas ...',
'Suche nach Offset ...':'Buscar por offset ...',

'Die Spieltexte werden zur Laufzeit aus {0}-Glyphen gesetzt: {1}bpp, {2} Byte je Zeichen, fortlaufend in der ROM. Gefunden habe ich sie ueber den Bildspeicher des beiliegenden Savestates - die dort sichtbaren Buchstaben stehen genauso in der ROM.':
  'Los textos del juego se componen en tiempo real con glifos de {0}: {1}bpp, {2} bytes por caracter, seguidos en la ROM. Se localizaron a traves de la memoria de video del savestate incluido - las letras visibles alli estan igual en la ROM.',
'A-Z, Ziffern und die gaengigen Satzzeichen sind gesichert. Die {0} Akzentbuchstaben benutzen eine eigene Kodierung des Spiels (nicht Latin-{1}) - welcher Zeichencode auf welche Glyphe zeigt, rechnet der Programmcode aus, es gibt dafuer keine Tabelle in der ROM. Sie sind darum nach Position benannt.':
  'A-Z, cifras y los signos de puntuacion habituales estan confirmados. Las {0} letras acentuadas usan una codificacion propia del juego (no Latin-{1}) - el codigo del programa calcula que caracter apunta a que glifo, no hay tabla en la ROM. Por eso se nombran por posicion.',
'Die Schriften muessen einmalig gesucht werden (Formvergleich ueber A-Z).':'Hay que buscar las fuentes una vez (comparando la forma de A-Z).',
'Keine Schrift gefunden - andere ROM-Fassung?':'No se encontro ninguna fuente - otra version de la ROM?',
'{0} Byte der Schrift ersetzt.':'{0} bytes de la fuente sustituidos.','Schrift ist identisch - nichts geaendert.':'La fuente es identica - nada cambiado.',
'{0} Schriften exportiert.':'{0} fuentes exportadas.','Zeichen {0}':'Caracter {0}','Zeichen {0}  {1}':'Caracter {0}  {1}','Farbstufen':'Niveles de color',
'{0} PNG - HUD- und Textschrift':'{0} PNG - fuente del HUD y de texto',

'Hoehe {0}, begehbar':'Altura {0}, transitable','Hoehe {0}, gesperrt':'Altura {0}, bloqueado',
'Hoehe {0}, begehbar - Fahrbahn':'Altura {0}, transitable - calzada','Hoehe {0}, gesperrt - Wasser, Randsperren':'Altura {0}, bloqueado - agua, limites',
'Zwischenhoehen':'Alturas intermedias','Kollision {0} · Hoehe {1}':'Colision {0} · altura {1}',
'{0} Zellen':'{0} celdas','Insel {0}':'Isla {0}','Insel {0} ({1})':'Isla {0} ({1})','Zelle {0},{1}':'Celda {0},{1}','Wert {0}':'Valor {0}',
'{0} Aenderungsschritte':'{0} pasos de edicion','Taste H - oder Leertaste halten':'Tecla H - o mantener la barra espaciadora',
'Insel {0} in die ROM geschrieben.':'Isla {0} escrita en la ROM.',
'Insel {0} wird aus der Original-ROM neu geladen. Aenderungen an dieser Insel gehen verloren (bereits in die ROM geschriebene bleiben, bis du erneut schreibst).':
  'La isla {0} se recargara desde la ROM original. Los cambios en esta isla se perderan (los ya escritos en la ROM se mantienen hasta que vuelvas a escribir).',
'Original wiederherstellen':'Restaurar original','Karte als JSON gespeichert.':'Mapa guardado como JSON.',
'Karte geladen. Mit {0} uebernehmen.':'Mapa cargado. Aplicalo con "Escribir en la ROM".',
'gehoert zu einer anderen Insel oder Groesse':'pertenece a otra isla u otro tamano',
'Keine Kachel passt zum Filter.':'Ningun tile coincide con el filtro.','Nichts rueckgaengig zu machen.':'Nada que deshacer.',
'Zwischenablage ist leer.':'El portapapeles esta vacio.','Zuerst mit dem Auswahlwerkzeug einen Bereich markieren.':'Marca primero un area con la herramienta de seleccion.',
'Zielpunkt mit dem Auswahlwerkzeug markieren.':'Marca el punto de destino con la herramienta de seleccion.',
'Objektliste konnte nicht verifiziert werden':'No se pudo verificar la lista de objetos','Zonenliste konnte nicht verifiziert werden':'No se pudo verificar la lista de zonas',
'Objektliste konnte nicht verifiziert werden - Werte trotzdem bearbeitbar, aber bitte pruefen.':'No se pudo verificar la lista de objetos - los valores se pueden editar, pero revisalos.',
'Zonenliste konnte nicht verifiziert werden - Werte trotzdem bearbeitbar, aber bitte pruefen.':'No se pudo verificar la lista de zonas - los valores se pueden editar, pero revisalos.',
'Auswahl aufheben':'Quitar seleccion','Begehbar oder gesperrt':'Transitable o bloqueado','Beides uebereinander':'Ambos superpuestos',
'Damit bekommt eine gemalte Hauskachel automatisch die passende Sperre und Hoehe.':'Asi un tile de edificio pintado recibe automaticamente el bloqueo y la altura adecuados.',
'Der Typ ergibt sich aus Kollision und Hoehe der Zelle, nicht aus der Kachelgrafik.':'El tipo depende de la colision y la altura de la celda, no del grafico del tile.',
'Diese Insel zuruecksetzen':'Restablecer esta isla','Ebene B - Hoehenstufe':'Capa B - nivel de altura','Ebene B als Graustufen':'Capa B en escala de grises',
'Faerbt jede Zelle nach Strasse, Gehweg, Gebaeude, Rampe ...':'Colorea cada celda segun calle, acera, edificio, rampa ...',
'Hoehenwerte':'Valores de altura','Insel waehlen':'Elegir isla','Kachelgrafik wie im Spiel':'Grafico de tiles como en el juego',
'Karte als Datei speichern':'Guardar mapa como archivo','Karte aus Datei laden':'Cargar mapa desde archivo',
'Klicken springt zu dieser Stelle.':'Un clic salta a esta posicion.','Legende: Hoehe (Ebene B)':'Leyenda: altura (capa B)',
'Pinselgroesse':'Tamano del pincel','Rueckgaengig (Strg+Z)':'Deshacer (Ctrl+Z)','Wiederholen (Strg+Y)':'Rehacer (Ctrl+Y)',
'Uebersichtsbild speichern':'Guardar imagen general','Was auf der Zelle steht':'Que hay en la celda','Zeiger ueber die Karte bewegen ...':'Mueve el puntero sobre el mapa ...',

'Alle ueber Zeiger erreichbaren Zeichenketten der ROM: Missionsdialoge in fuenf Sprachen, Menuetexte, Ortsnamen und interne Bezeichner. Laengere Texte werden automatisch ans ROM-Ende verschoben und alle Zeiger nachgezogen.':
  'Todas las cadenas de la ROM accesibles por punteros: dialogos de misiones en cinco idiomas, textos de menu, nombres de lugares e identificadores internos. Los textos mas largos se mueven solos al final de la ROM y se actualizan todos los punteros.',
'Die ROM muss einmalig nach Texten durchsucht werden.':'Hay que analizar la ROM una vez en busca de textos.',
'Texte werden gelesen ...':'Leyendo textos ...','Gross-/Kleinschreibung beachten':'Distinguir mayusculas y minusculas',
'Text bearbeiten':'Editar texto','Suchen und Ersetzen':'Buscar y reemplazar','Suchen nach ...':'Buscar ...','Ersetzen durch ...':'Reemplazar por ...',
'Wirkt nur auf die gerade sichtbare Auswahl (Filter und Suche werden beruecksichtigt).':'Solo afecta a la seleccion visible (se tienen en cuenta filtro y busqueda).',
'Offset {0} · {1} Zeiger · GBA-Zeichensatz: nur Zeichen bis Code {2} (Latin-{3}).':'Offset {0} · {1} punteros · juego de caracteres de GBA: solo caracteres hasta el codigo {2} (Latin-{3}).',
'→ wird ans ROM-Ende verschoben':'→ se movera al final de la ROM','{0} Zeichen nicht darstellbar':'{0} caracteres no representables',
'Gespeichert.':'Guardado.','Gespeichert, {0} Text(e) verschoben.':'Guardado, {0} texto(s) movido(s).','Gespeichert, {0} Zeichen ersetzt.':'Guardado, {0} caracteres sustituidos.',
'Gespeichert, {0} Text(e) verschoben, {1} Zeichen ersetzt.':'Guardado, {0} texto(s) movido(s), {1} caracteres sustituidos.',
'{0} Texte geaendert.':'{0} textos cambiados.','{0} Texte geaendert, {1} verschoben.':'{0} textos cambiados, {1} movidos.',
'{0} Texte uebernommen.':'{0} textos aplicados.','{0} Texte uebernommen, {1} verschoben.':'{0} textos aplicados, {1} movidos.',
'CSV, alle Sprachen':'CSV, todos los idiomas','{0} CSV, alle Sprachen':'{0} CSV, todos los idiomas','{0} PNG inkl. Titelbild und Logo':'{0} PNG incl. pantalla de titulo y logo',
'je Tabelle eine CSV':'un CSV por tabla',

'Alle PCM-Samples der ROM: Sprachaufnahmen, Motoren, Waffen, Radio-Schnipsel. Anhoeren, als WAV sichern und eigene Aufnahmen einspielen - das Studio wandelt automatisch in das {0}-Bit-Format des Game Boy Advance um.':
  'Todas las muestras PCM de la ROM: voces, motores, armas, fragmentos de radio. Escuchalas, guardalas como WAV e importa tus propias grabaciones - el estudio las convierte solo al formato de {0} bits de la Game Boy Advance.',
'Diese ROM benutzt keinen Sequenzer wie Nintendos MusicPlayer2000 (Sappy). Es gibt darin also keine MIDI- oder Notendaten, die man exportieren koennte - die gesamte Musik und alle Gerausche liegen als fertig aufgenommene PCM-Samples vor. Genau die bearbeitest du hier: Wer eigene Musik einbauen will, rendert sie als WAV und spielt sie als Sample ein.':
  'Esta ROM no usa un secuenciador como el MusicPlayer2000 (Sappy) de Nintendo. Por tanto no hay datos MIDI ni de notas que exportar - toda la musica y los efectos estan grabados como muestras PCM. Eso es justo lo que editas aqui: para anadir tu propia musica, renderizala como WAV e importala como muestra.',
'Die ROM enthaelt keinen Noten-/Sequenzer-Teil (kein MusicPlayer2000). Musik liegt komplett als PCM vor - eigene Musik baust du als WAV ein.':
  'La ROM no tiene parte de notas/secuenciador (sin MusicPlayer2000). Toda la musica es PCM - anade tu propia musica como WAV.',
'Kuerzere Aufnahmen passen immer. Laengere werden ans ROM-Ende verschoben und alle Zeiger angepasst - das geht nur, wenn mindestens ein Zeiger bekannt ist.':
  'Las grabaciones mas cortas siempre caben. Las mas largas se mueven al final de la ROM y se ajustan todos los punteros - solo funciona si se conoce al menos un puntero.',
'Die ROM muss einmalig nach Samples durchsucht werden.':'Hay que analizar la ROM una vez en busca de muestras.',
'Kette wird verfolgt ...':'Siguiendo la cadena ...','Suche: Offset oder Abtastrate ...':'Buscar: offset o frecuencia de muestreo ...',
'Daten ab':'Datos desde','Wiedergabe nicht moeglich':'No se puede reproducir',
'Sample ersetzt (an Ort und Stelle).':'Muestra sustituida (en su sitio).','Sample ersetzt, verschoben nach {0}.':'Muestra sustituida, movida a {0}.',
'{0}: verschoben nach {1} ({2} B)':'{0}: movida a {1} ({2} B)','{0}: ersetzt ({1} B)':'{0}: sustituida ({1} B)',
'Sample ist laenger und hat keinen bekannten Zeiger - nicht verschiebbar':'La muestra es mas larga y no tiene puntero conocido - no se puede mover',
'kein freier Platz mehr - ROM auf {0} MB erweitern':'no queda espacio libre - amplia la ROM a {0} MB',
'keine WAV-Datei':'no es un archivo WAV','nur unkomprimiertes PCM wird unterstuetzt':'solo se admite PCM sin comprimir','{0} Bit werden nicht unterstuetzt':'{0} bits no son compatibles',
'WAV-Dateien werden erzeugt ...':'Creando archivos WAV ...','WAV-Dateien werden eingespielt ...':'Importando archivos WAV ...',

'Das Spiel beschreibt Missionen, platzierte Objekte und Ereignisse ueber benannte Datensaetze. Das Studio findet diese Tabellen ueber ihre Namenszeiger und zeigt jedes Feld an - Zahlenwerte, Zeiger auf Texte und Verweise auf andere Datensaetze lassen sich direkt aendern.':
  'El juego describe misiones, objetos colocados y eventos mediante registros con nombre. El estudio encuentra estas tablas por sus punteros de nombre y muestra cada campo - valores numericos, punteros a textos y referencias a otros registros se pueden cambiar directamente.',
'Die Namen und die Tabellenstruktur sind gesichert - die Bedeutung der einzelnen Zahlenfelder ist es nicht vollstaendig. Das Studio zeigt darum jedes Feld mit seiner Deutung (Zahl, Zeiger, Text) an, statt eine Bedeutung zu erfinden. Aendere Werte in kleinen Schritten und teste im Emulator.':
  'Los nombres y la estructura de las tablas estan confirmados - el significado de cada campo numerico no del todo. Por eso el estudio muestra cada campo con su interpretacion (numero, puntero, texto) en lugar de inventar un significado. Cambia los valores poco a poco y prueba en el emulador.',
'Die Missionsdaten muessen einmalig analysiert werden.':'Hay que analizar los datos de misiones una vez.',
'Datensaetze werden gesucht ...':'Buscando registros ...','Texte werden gesucht (Grundlage fuer die Missionsdaten) ...':'Buscando textos (base de los datos de misiones) ...',
'Keine benannten Datensatztabellen gefunden.':'No se encontraron tablas de registros con nombre.',
'Jeder Eintrag dieser Tabelle ist {0} Byte gross und beginnt hier beim Namenszeiger.':'Cada entrada de esta tabla ocupa {0} bytes y empieza aqui, en el puntero de nombre.',
'(koennte Weltkoordinate sein)':'(podria ser una coordenada del mundo)','{0} Datensaetze exportiert.':'{0} registros exportados.',
'Ausloeser':'Disparador','Ereignisse / Textausloeser':'Eventos / disparadores de texto','Erfolgsmeldungen':'Mensajes de exito','Fehlschlaege':'Fracasos',
'Instanzen (platzierte Spielobjekte)':'Instancias (objetos colocados)','Missionen':'Misiones','Name suchen ...':'Buscar nombre ...','Orte und Wegpunkte':'Lugares y puntos de ruta',
'Pager-Nachrichten':'Mensajes del buscapersonas','globale Eintraege':'entradas globales',

'Direkter Zugriff auf jede Stelle der ROM - fuer alles, was die anderen Werkzeuge nicht abdecken. Die Lesezeichen fuehren zu allen bekannten Strukturen.':
  'Acceso directo a cada byte de la ROM - para todo lo que no cubren las demas herramientas. Los marcadores llevan a todas las estructuras conocidas.',
'Bereich einspielen':'Importar zona','Bereich speichern':'Guardar zona','Lesezeichen ...':'Marcadores ...','In der ROM suchen':'Buscar en la ROM',
'Hex-Bytes durch Leerzeichen trennen, Text in Anfuehrungszeichen setzen.':'Separa los bytes hex con espacios y pon el texto entre comillas.',
'Wert ...':'Valor ...',
'{0}  ROM-Kopf (Titel, Code, Pruefsumme)':'{0}  Cabecera de la ROM (titulo, codigo, suma de control)','{0}  Menue-Texte (UI)':'{0}  Textos de menu (UI)',
'{0}  Abspann-Texttabellen':'{0}  Tablas de texto de creditos','{0}  Dialogtabellen':'{0}  Tablas de dialogo','{0}  Ereignis-Datensaetze':'{0}  Registros de eventos',
'{0}  Insel {1}: Zellen':'{0}  Isla {1}: celdas','{0}  Insel {1}: Zonen ({2})':'{0}  Isla {1}: zonas ({2})','{0}  Insel {1}: Ebene B':'{0}  Isla {1}: capa B',
'{0}  Sound-Index (Sample-Zeiger)':'{0}  Indice de sonido (punteros de muestras)',
'z. B. {0} A0 {1} oder {2}':'p. ej. {0} A0 {1} o {2}',
'Hinweis zum Umfang: ':'Nota sobre el alcance: ','Zum Thema MIDI: ':'Sobre el MIDI: ','{0} MB  ({1} Bytes)':'{0} MB  ({1} bytes)','{0} Objekte':'{0} objetos','Kachel {0}':'Tile {0}','JSON':'JSON','{0} JSON':'{0} JSON',
'{0}  Insel {1}: Zonen ({2})':'{0}  Isla {1}: zonas ({2})'
});

/* ================================================================= FR */
add('fr', {
'Vollstaendiger Mod-Baukasten fuer Grand Theft Auto Advance (Game Boy Advance). Grafiken, Karten, Texte, Sounds, Missionsdaten - alles in einem Programm, ohne Installation.':
  'Boite a outils complete pour modder Grand Theft Auto Advance (Game Boy Advance). Graphismes, cartes, textes, sons, donnees de mission - tout dans un seul programme, sans installation.',
'ROM laden (deine eigene, legal erstellte Kopie von {0}).':'Charge la ROM (ta propre copie de "Grand Theft Auto Advance", extraite legalement).',
'Im linken Menue den Bereich waehlen und Aenderungen vornehmen.':'Choisis une section dans le menu de gauche et fais tes modifications.',
'Unter {0} regelmaessig das Projekt speichern - es enthaelt nur deine Aenderungen.':'Enregistre regulierement le projet dans "ROM et projet" - il ne contient que tes modifications.',
'Mit {0} die fertige .gba erzeugen und im Emulator (z. B. mGBA) testen.':'Avec "Enregistrer la ROM", cree le .gba final et teste-le dans un emulateur (p. ex. mGBA).',
'Das Studio veraendert nie deine Originaldatei. Alle Aenderungen leben im Speicher, bis du sie als neue ROM oder als Projektdatei sicherst. Teste eine gemoddete ROM immer erst im Emulator.':
  'Le studio ne modifie jamais ton fichier original. Toutes les modifications restent en memoire jusqu\'a ce que tu les enregistres comme nouvelle ROM ou fichier de projet. Teste toujours une ROM moddee d\'abord dans un emulateur.',
'Alle Daten auf einmal als ZIP heraus- und wieder hineinschreiben - rund {0} Dateien in neun Bereichen, ohne jede einzeln auszuwaehlen.':
  'Exporter toutes les donnees d\'un coup en ZIP et les reimporter - environ {0} fichiers dans neuf sections, sans les choisir un par un.',
'Rund {0} Sprites (Autos, Figuren, Effekte) ansehen, als PNG exportieren und wieder einspielen. Verschiebt Daten automatisch, wenn sie groesser werden.':
  'Voir environ {0} sprites (voitures, personnages, effets), les exporter en PNG et les reimporter. Les donnees sont deplacees automatiquement si elles grossissent.',
'Die zehn begehbaren {0}-Innenraeume mit {1}-Farben-Palette.':'Les dix interieurs praticables en {0} avec palette de {1} couleurs.',
'Titelbild, Logo mit allen Animationsstufen, Zwischensequenzen, Portraits, Briefing-Tafeln und Symbole - {0} Bilder aus Kacheln, Tilemap und Palette.':
  'Ecran titre, logo avec toutes ses etapes d\'animation, cinematiques, portraits, panneaux de briefing et icones - {0} images composees de tuiles, tilemap et palette.',
'Die {0} unkomprimierten {1}-Bit-Texturen der Stadt - Daecher, Fassaden, Strassenbelag - in den echten Farben der gefundenen Weltpalette.':
  'Les {0} textures non compressees {1} bits de la ville - toits, facades, chaussee - dans les vraies couleurs de la palette du monde.',
'HUD- und Textschrift als {0}-Glyphen: A-Z, Ziffern, Satzzeichen und Akzentbuchstaben ansehen, exportieren und austauschen.':
  'Police du HUD et du texte en glyphes {0} : voir, exporter et remplacer A-Z, chiffres, ponctuation et lettres accentuees.',
'Alle drei Inseln mit fuenf Ansichten - die Gebaeudetypen-Ansicht faerbt Strasse, Gehweg, Gebaeude und Hochstrasse ein. Mit Uebersichtskarte, Zell-Inspektor und nach Typ gruppierter Kachelauswahl.':
  'Les trois iles avec cinq vues - la vue des types de batiments colore route, trottoir, batiments et voie surelevee. Avec mini-carte, inspecteur de cellule et choix de tuiles groupe par type.',
'Saemtliche Spieltexte in fuenf Sprachen (EN/ES/FR/IT/DE) inklusive Menue-Strings, mit automatischer Neuverlinkung bei laengeren Texten.':
  'Tous les textes du jeu en cinq langues (EN/ES/FR/IT/DE), menus compris, avec re-liaison automatique des textes plus longs.',
'Alle PCM-Samples anhoeren, als WAV exportieren und eigene WAV-Dateien importieren.':'Ecouter tous les samples PCM, les exporter en WAV et importer tes propres WAV.',
'Die benannten Spiel-Datensaetze (Missionen, Instanzen, Ereignisse, Dialogverweise) durchsuchen und Werte aendern.':
  'Parcourir les enregistrements nommes du jeu (missions, instances, evenements, references de dialogue) et modifier les valeurs.',
'Rohzugriff auf jede Stelle der ROM, mit Lesezeichen aller bekannten Strukturen.':'Acces brut a chaque octet de la ROM, avec signets vers toutes les structures connues.',
'Vollbilder (Raeume)':'Ecrans complets (interieurs)','Welt-Texturen':'Textures du monde','Karten-Editor':'Editeur de carte','Missionen und Objekte':'Missions et objets',
'Menue-Grafiken':'Graphismes de menu','Schriften':'Polices','Hex-Editor':'Editeur hexa','Sound':'Son','Sprites':'Sprites','Auswahl':'Selection',
'Fuellen':'Remplir','Schieben':'Deplacer la vue',
'oder Datei einfach ins Fenster ziehen':'ou glisse simplement le fichier dans la fenetre',

'Zustand der geladenen ROM, Projektverwaltung und Ausgabe der fertigen Moddatei.':'Etat de la ROM chargee, gestion du projet et sortie du mod termine.',
'Die Projektdatei enthaelt nur deine Aenderungen - die ROM selbst wird nicht mitgespeichert.':'Le fichier de projet ne contient que tes modifications - la ROM elle-meme n\'y est pas enregistree.',
'Beim Speichern wird die Kopf-Pruefsumme automatisch neu berechnet. Teste die Ausgabe vor dem Flashen in einem Emulator.':
  'La somme de controle de l\'en-tete est recalculee automatiquement a l\'enregistrement. Teste le resultat dans un emulateur avant de le flasher.',
'Ein IPS-Patch enthaelt nur deine Aenderungen, nicht das Spiel selbst. So kannst du einen Mod weitergeben, ohne die ROM mitzuliefern - andere wenden den Patch auf ihre eigene Kopie an.':
  'Un patch IPS ne contient que tes modifications, pas le jeu lui-meme. Tu peux ainsi partager un mod sans distribuer la ROM - les autres appliquent le patch a leur propre copie.',
'Prueft sich selbst: der Patch wird sofort auf die Original-ROM angewendet und mit deinem Stand verglichen.':
  'Auto-verification : le patch est aussitot applique a la ROM d\'origine et compare a ta version.',
'IPS-Patch wird erstellt ...':'Creation du patch IPS ...','Patch wird gegengeprueft ...':'Verification du patch ...',
'IPS-Patch gespeichert: {0} Datensaetze, {1} KB.':'Patch IPS enregistre : {0} enregistrements, {1} Ko.',
'IPS-Patch gespeichert: {0} Datensaetze, {1} KB (IPS32, weil die ROM groesser als {2} MB ist).':'Patch IPS enregistre : {0} enregistrements, {1} Ko (IPS32, car la ROM depasse {2} Mo).',
'Keine Aenderungen - ein Patch waere leer.':'Aucune modification - le patch serait vide.',
'Selbstkontrolle fehlgeschlagen - es wurde nichts geschrieben.':'L\'auto-verification a echoue - rien n\'a ete ecrit.',
'Keine Aenderungen gegenueber dem Original.':'Aucune modification par rapport a l\'original.',
'Auf Originalzustand zurueckgesetzt.':'Retabli a l\'etat d\'origine.',
'Saemtliche Aenderungen gehen verloren. Fortfahren?':'Toutes les modifications seront perdues. Continuer ?',
'Zuruecksetzen':'Reinitialiser','ROM passt nicht':'La ROM ne correspond pas',
'Das Projekt wurde mit einer anderen ROM erstellt. Trotzdem anwenden?':'Le projet a ete cree avec une autre ROM. L\'appliquer quand meme ?',
'Bitte zuerst die Original-ROM laden, dann das Projekt.':'Charge d\'abord la ROM d\'origine, puis le projet.',
'Projekt geladen: {0} Aenderungsbloecke.':'Projet charge : {0} blocs de modifications.',
'Projekt gespeichert ({0} Aenderungsbloecke).':'Projet enregistre ({0} blocs de modifications).',
'Projekt wird geschrieben ...':'Enregistrement du projet ...',
'Die ROM ist bereits {0} MB gross.':'La ROM fait deja {0} Mo.','ROM auf {0} MB erweitert.':'ROM etendue a {0} Mo.',
'Die ROM wird auf {0} MB vergroessert. Das schafft Platz fuer grosse Umbauten, setzt beim Spielen auf echter Hardware aber ein {1}-MB-faehiges Modul voraus. Emulatoren koennen das immer.':
  'La ROM sera etendue a {0} Mo. Cela libere de la place pour de grosses modifications, mais sur du vrai materiel il faut une cartouche de {1} Mo. Les emulateurs le gerent toujours.',
'unbekannte Fassung - Adressen koennen abweichen':'version inconnue - les adresses peuvent differer',
'ungueltig (wird beim Speichern korrigiert)':'invalide (corrige a l\'enregistrement)',
'... und {0} weitere Bloecke':'... et {0} autres blocs','... und {0} weitere':'... et {0} autres',
'Andere ROM-Version erkannt - bekannte Adressen koennen abweichen.':'Autre version de ROM detectee - les adresses connues peuvent differer.',
'Kartendaten ({0} Level)':'Donnees de carte ({0} niveaux)','Missions- und Objektdaten':'Donnees de missions et d\'objets',
'Notizen zum Mod ...':'Notes sur le mod ...','Tabellen & Sound-Index':'Tables et index des sons','Verweistabellen':'Tables de references',
'Welt-Texturen ({0}bpp)':'Textures du monde ({0}bpp)','freier Bereich / neue Daten':'zone libre / nouvelles donnees',

'Keine ROM geladen.':'Aucune ROM chargee.','Datei ist zu klein fuer eine GBA-ROM.':'Le fichier est trop petit pour une ROM GBA.',
'Datei konnte nicht gelesen werden':'Impossible de lire le fichier',
'Bitte eine .gba-ROM oder eine .gtastudio-Projektdatei ablegen.':'Depose une ROM .gba ou un fichier de projet .gtastudio.',
'Import abgeschlossen':'Import termine','Import abgeschlossen.':'Import termine.',
'Import fehlgeschlagen':'Echec de l\'import','Import: {0} geaendert, {1} Fehler':'Import : {0} modifies, {1} erreurs',
'nichts geaendert':'rien de modifie','uebersprungen: {0}':'ignore : {0}','uebersprungen: {0} (kein passender Name)':'ignore : {0} (aucun nom correspondant)',
'Eintraege':'entrees','{0} Eintraege':'{0} entrees','alle ({0})':'toutes ({0})','alle Groessen ({0})':'toutes les tailles ({0})','Ungueltiger Wert.':'Valeur invalide.',
'Uebernehmen':'Appliquer','Ersetzen':'Remplacer','Farbe aendern':'Changer la couleur',

'Autos, Figuren, Waffen, Effekte und Objekte - {0}bpp mit {1} Farben. Als PNG exportieren, bearbeiten und wieder einspielen. Wird eine Grafik nach dem Packen groesser, verschiebt das Studio sie ans ROM-Ende und passt alle Pointer an.':
  'Voitures, personnages, armes, effets et objets - {0}bpp avec {1} couleurs. Exporter en PNG, modifier et reimporter. Si un graphisme grossit apres compression, le studio le deplace a la fin de la ROM et met a jour tous les pointeurs.',
'Zehn bildschirmfuellende {0}-Grafiken mit {1}-Farben-Palette - die begehbaren Innenraeume. Titelbild, Logo und die uebrigen Menuebilder liegen in einem anderen Format und stehen unter {2}. Identische Kopien werden beim Import automatisch mitgezogen.':
  'Dix graphismes plein ecran en {0} avec palette de {1} couleurs - les interieurs praticables. L\'ecran titre, le logo et les autres images de menu utilisent un autre format et se trouvent sous "Graphismes de menu". Les copies identiques sont mises a jour automatiquement a l\'import.',
'Die ROM muss einmalig nach Grafiken durchsucht werden. Das Ergebnis bleibt fuer diese Sitzung gespeichert.':'La ROM doit etre analysee une fois pour trouver les graphismes. Le resultat est conserve pour cette session.',
'Grafiken werden gesucht ... (einmalig, dauert einige Sekunden)':'Recherche des graphismes ... (une seule fois, quelques secondes)',
'Gefunden: {0} Sprites, {1} Vollbilder, {2} Paletten.':'Trouve : {0} sprites, {1} ecrans complets, {2} palettes.',
'Auf ein Feld klicken, um die Farbe zu aendern. Mehrere Sprites koennen sich eine Palette teilen.':'Clique sur une case pour changer la couleur. Plusieurs sprites peuvent partager une palette.',
'Keine eindeutige Palette gefunden - angezeigt wird eine Ersatzpalette. Die Indizes stimmen trotzdem.':'Aucune palette certaine trouvee - une palette de remplacement est affichee. Les indices restent corrects.',
'Farbe {0} der Palette {1}. Der GBA speichert {2} Bit - die Farbe wird gerundet.':'Couleur {0} de la palette {1}. La GBA stocke {2} bits - la couleur sera arrondie.',
'Palette {0}':'Palette {0}','Palettenfarbe geaendert.':'Couleur de palette modifiee.',
'Beim Import Farben zuordnen statt Indizes':'A l\'import, associer les couleurs au lieu des indices',
'{0} Farben lagen weit ausserhalb der Palette und wurden auf die naechste gerundet.':'{0} couleurs etaient tres eloignees de la palette et ont ete arrondies a la plus proche.',
'PNG-Palette weicht ab - es werden die Palettenindizes verwendet. Farben aenderst du ueber die Palette im Studio oder per Farbabgleich.':
  'La palette du PNG differe - les indices de palette sont utilises. Change les couleurs via la palette du studio ou par correspondance des couleurs.',
'Bildgroesse {0}, erwartet {1}':'Taille d\'image {0}, attendu {1}','Groesse {0}, erwartet {1}':'Taille {0}, attendu {1}',
'Palettenindex {0} im PNG, erlaubt sind {1}..{2}':'Indice de palette {0} dans le PNG, autorises : {1}..{2}',
'Palettenindex > {0} - {1}bpp erlaubt nur {2} Farben':'Indice de palette > {0} - le {1}bpp n\'autorise que {2} couleurs',
'Palettenindex > {0} - Vollbilder erlauben nur {1} Farben':'Indice de palette > {0} - les ecrans complets n\'autorisent que {1} couleurs',
'{0}: unveraendert':'{0} : inchange','{0}: an Ort und Stelle ({1}/{2} Bytes)':'{0} : sur place ({1}/{2} octets)',
'{0}: verschoben nach {1} ({2} Bytes, {3} Pointer angepasst)':'{0} : deplace vers {1} ({2} octets, {3} pointeurs mis a jour)',
'FEHLER {0}: {1} Bytes, Platz {2}, keine Pointer bekannt - nicht verschiebbar':'ERREUR {0} : {1} octets, place {2}, aucun pointeur connu - impossible a deplacer',
'FEHLER {0}: kein freier Platz mehr (ROM unter {1} auf {2} MB erweitern)':'ERREUR {0} : plus de place libre (etends la ROM a {2} Mo dans "ROM et projet")',
'{0} Grafiken exportiert.':'{0} graphismes exportes.','Grafiken exportiert.':'Graphismes exportes.',
'PNG-Dateien werden erzeugt ...':'Creation des fichiers PNG ...','PNG-Dateien werden eingespielt ...':'Import des fichiers PNG ...',

'Titelbild, Logo mit seinen Animationsstufen, Zwischensequenzen, Figuren-Portraits, Briefing-Tafeln und Waffen-/Objektsymbole. Jedes Bild besteht aus {0}bpp-Kacheln, einer Tilemap und einer {1}-Farben-Palette.':
  'Ecran titre, logo avec ses etapes d\'animation, cinematiques, portraits de personnages, panneaux de briefing et icones d\'armes/objets. Chaque image se compose de tuiles {0}bpp, d\'une tilemap et d\'une palette de {1} couleurs.',
'Bekannte Bilder: #{0} Titelbild, #{1}-#{2} GTA-Advance-Logo, #{3} Rockstar-Logo, #{4} Digital Eclipse. Mit ★ markierte Eintraege sind benannt - du kannst auch nach dem Namen suchen.':
  'Images connues : #{0} ecran titre, #{1}-#{2} logo GTA Advance, #{3} logo Rockstar, #{4} Digital Eclipse. Les entrees marquees ★ ont un nom - tu peux aussi chercher par nom.',
'Beim Import baut das Studio Kacheln und Tilemap neu auf und erkennt dabei gespiegelte Wiederholungen. Bildgroesse beibehalten, hoechstens {0} Farben, Index {1} ist transparent. Braucht das Ergebnis mehr Platz, wandert der Block ans ROM-Ende und der Datensatz wird angepasst.':
  'A l\'import, le studio reconstruit tuiles et tilemap et detecte les repetitions en miroir. Garde la taille de l\'image, {0} couleurs au maximum, l\'indice {1} est transparent. Si le resultat demande plus de place, le bloc passe a la fin de la ROM et l\'enregistrement est mis a jour.',
'Keine Menue-Bildtabelle gefunden - andere ROM-Fassung?':'Table des images de menu introuvable - autre version de ROM ?',
'Bild #{0} ist identisch - nichts geaendert.':'L\'image #{0} est identique - rien de modifie.',
'Bild #{0} ersetzt: {1} Kacheln, an Ort und Stelle.':'Image #{0} remplacee : {1} tuiles, sur place.',
'Bild #{0} ersetzt: {1} Kacheln, verschoben nach {2}.':'Image #{0} remplacee : {1} tuiles, deplacee vers {2}.',
'#{0}: identisch, nichts geaendert':'#{0} : identique, rien de modifie','#{0}: {1} Kacheln':'#{0} : {1} tuiles','#{0}: {1} Kacheln, verschoben nach {2}':'#{0} : {1} tuiles, deplacee vers {2}',
'{0}  ({1} Stueck, {2} B)':'{0}  ({1} pcs, {2} o)','Farbe {0} aendern':'Changer la couleur {0}',
'Palette {0}. Der GBA speichert {1} Bit, die Farbe wird gerundet.':'Palette {0}. La GBA stocke {1} bits, la couleur sera arrondie.',
'Palettenindex {0} - erlaubt sind nur {1} Farben ({2}..{3})':'Indice de palette {0} - seules {1} couleurs sont autorisees ({2}..{3})',
'{0} verschiedene Kacheln - die Hardware erlaubt hoechstens {1}':'{0} tuiles differentes - le materiel en autorise au plus {1}',
'kein freier Platz mehr - ROM unter {0} auf {1} MB erweitern':'plus de place libre - etends la ROM a {1} Mo dans "ROM et projet"',
'{0} Menue-Grafiken exportiert.':'{0} graphismes de menu exportes.','Menue-Grafiken exportiert.':'Graphismes de menu exportes.',
'Menue-Grafiken werden exportiert ...':'Export des graphismes de menu ...','Menue-Grafiken werden eingespielt ...':'Import des graphismes de menu ...',
'Suche: Nummer oder Offset ...':'Recherche : numero ou offset ...',

'Die unkomprimierten {0}-Bit-Texturen der Stadt ({1}, {2} und {3} Pixel) - Dachflaechen, Fassaden, Strassenbelag. Groesse und Lage sind fest: beim Import werden die Pixel direkt an derselben Stelle ersetzt.':
  'Les textures non compressees {0} bits de la ville ({1}, {2} et {3} pixels) - toits, facades, chaussee. Taille et position sont fixes : a l\'import, les pixels sont remplaces au meme endroit.',
'Angezeigt wird die Weltpalette der Engine - {0} Farben, in der ROM viermal abgelegt. Beim Bearbeiten zaehlen die Palettenindizes, und die bleiben bei Export und Import exakt erhalten.':
  'La palette du monde du moteur est affichee - {0} couleurs, stockee quatre fois dans la ROM. En edition, ce sont les indices de palette qui comptent, et ils sont conserves exactement a l\'export et a l\'import.',
'{0} Farben @ {1}':'{0} couleurs @ {1}','Keine Texturtabellen gefunden - andere ROM-Fassung?':'Aucune table de textures trouvee - autre version de ROM ?',
'{0} Texturen exportiert.':'{0} textures exportees.','Texturen exportiert.':'Textures exportees.','{0} Texturen ersetzt':'{0} textures remplacees',
'Texturen werden exportiert ...':'Export des textures ...','Texturen werden eingespielt ...':'Import des textures ...',
'Suche nach Offset ...':'Recherche par offset ...',

'Die Spieltexte werden zur Laufzeit aus {0}-Glyphen gesetzt: {1}bpp, {2} Byte je Zeichen, fortlaufend in der ROM. Gefunden habe ich sie ueber den Bildspeicher des beiliegenden Savestates - die dort sichtbaren Buchstaben stehen genauso in der ROM.':
  'Les textes du jeu sont composes a l\'execution avec des glyphes {0} : {1}bpp, {2} octets par caractere, a la suite dans la ROM. Ils ont ete trouves via la memoire video du savestate fourni - les lettres visibles y sont stockees de la meme facon dans la ROM.',
'A-Z, Ziffern und die gaengigen Satzzeichen sind gesichert. Die {0} Akzentbuchstaben benutzen eine eigene Kodierung des Spiels (nicht Latin-{1}) - welcher Zeichencode auf welche Glyphe zeigt, rechnet der Programmcode aus, es gibt dafuer keine Tabelle in der ROM. Sie sind darum nach Position benannt.':
  'A-Z, les chiffres et la ponctuation courante sont confirmes. Les {0} lettres accentuees utilisent un codage propre au jeu (pas Latin-{1}) - c\'est le code du programme qui calcule quel caractere pointe vers quel glyphe, il n\'y a pas de table dans la ROM. Elles sont donc nommees par position.',
'Die Schriften muessen einmalig gesucht werden (Formvergleich ueber A-Z).':'Les polices doivent etre recherchees une fois (comparaison des formes A-Z).',
'Keine Schrift gefunden - andere ROM-Fassung?':'Aucune police trouvee - autre version de ROM ?',
'{0} Byte der Schrift ersetzt.':'{0} octets de la police remplaces.','Schrift ist identisch - nichts geaendert.':'La police est identique - rien de modifie.',
'{0} Schriften exportiert.':'{0} polices exportees.','Zeichen {0}':'Caractere {0}','Zeichen {0}  {1}':'Caractere {0}  {1}','Farbstufen':'Niveaux de couleur',
'{0} PNG - HUD- und Textschrift':'{0} PNG - police du HUD et du texte',

'Hoehe {0}, begehbar':'Hauteur {0}, praticable','Hoehe {0}, gesperrt':'Hauteur {0}, bloque',
'Hoehe {0}, begehbar - Fahrbahn':'Hauteur {0}, praticable - chaussee','Hoehe {0}, gesperrt - Wasser, Randsperren':'Hauteur {0}, bloque - eau, limites',
'Zwischenhoehen':'Hauteurs intermediaires','Kollision {0} · Hoehe {1}':'Collision {0} · hauteur {1}',
'{0} Zellen':'{0} cellules','Insel {0}':'Ile {0}','Insel {0} ({1})':'Ile {0} ({1})','Zelle {0},{1}':'Cellule {0},{1}','Wert {0}':'Valeur {0}',
'{0} Aenderungsschritte':'{0} etapes de modification','Taste H - oder Leertaste halten':'Touche H - ou maintenir la barre d\'espace',
'Insel {0} in die ROM geschrieben.':'Ile {0} ecrite dans la ROM.',
'Insel {0} wird aus der Original-ROM neu geladen. Aenderungen an dieser Insel gehen verloren (bereits in die ROM geschriebene bleiben, bis du erneut schreibst).':
  'L\'ile {0} sera rechargee depuis la ROM d\'origine. Les modifications de cette ile seront perdues (celles deja ecrites dans la ROM restent jusqu\'a la prochaine ecriture).',
'Original wiederherstellen':'Restaurer l\'original','Karte als JSON gespeichert.':'Carte enregistree en JSON.',
'Karte geladen. Mit {0} uebernehmen.':'Carte chargee. Applique-la avec "Ecrire dans la ROM".',
'gehoert zu einer anderen Insel oder Groesse':'appartient a une autre ile ou taille',
'Keine Kachel passt zum Filter.':'Aucune tuile ne correspond au filtre.','Nichts rueckgaengig zu machen.':'Rien a annuler.',
'Zwischenablage ist leer.':'Le presse-papiers est vide.','Zuerst mit dem Auswahlwerkzeug einen Bereich markieren.':'Selectionne d\'abord une zone avec l\'outil de selection.',
'Zielpunkt mit dem Auswahlwerkzeug markieren.':'Marque le point cible avec l\'outil de selection.',
'Objektliste konnte nicht verifiziert werden':'La liste d\'objets n\'a pas pu etre verifiee','Zonenliste konnte nicht verifiziert werden':'La liste des zones n\'a pas pu etre verifiee',
'Objektliste konnte nicht verifiziert werden - Werte trotzdem bearbeitbar, aber bitte pruefen.':'La liste d\'objets n\'a pas pu etre verifiee - les valeurs restent modifiables, mais verifie-les.',
'Zonenliste konnte nicht verifiziert werden - Werte trotzdem bearbeitbar, aber bitte pruefen.':'La liste des zones n\'a pas pu etre verifiee - les valeurs restent modifiables, mais verifie-les.',
'Auswahl aufheben':'Annuler la selection','Begehbar oder gesperrt':'Praticable ou bloque','Beides uebereinander':'Les deux superposes',
'Damit bekommt eine gemalte Hauskachel automatisch die passende Sperre und Hoehe.':'Ainsi une tuile de batiment peinte recoit automatiquement le blocage et la hauteur adaptes.',
'Der Typ ergibt sich aus Kollision und Hoehe der Zelle, nicht aus der Kachelgrafik.':'Le type depend de la collision et de la hauteur de la cellule, pas du graphisme de la tuile.',
'Diese Insel zuruecksetzen':'Reinitialiser cette ile','Ebene B - Hoehenstufe':'Couche B - niveau de hauteur','Ebene B als Graustufen':'Couche B en niveaux de gris',
'Faerbt jede Zelle nach Strasse, Gehweg, Gebaeude, Rampe ...':'Colore chaque cellule selon route, trottoir, batiment, rampe ...',
'Hoehenwerte':'Valeurs de hauteur','Insel waehlen':'Choisir l\'ile','Kachelgrafik wie im Spiel':'Graphisme des tuiles comme en jeu',
'Karte als Datei speichern':'Enregistrer la carte dans un fichier','Karte aus Datei laden':'Charger la carte depuis un fichier',
'Klicken springt zu dieser Stelle.':'Un clic saute a cet endroit.','Legende: Hoehe (Ebene B)':'Legende : hauteur (couche B)',
'Pinselgroesse':'Taille du pinceau','Rueckgaengig (Strg+Z)':'Annuler (Ctrl+Z)','Wiederholen (Strg+Y)':'Retablir (Ctrl+Y)',
'Uebersichtsbild speichern':'Enregistrer l\'image d\'ensemble','Was auf der Zelle steht':'Contenu de la cellule','Zeiger ueber die Karte bewegen ...':'Deplace le pointeur sur la carte ...',

'Alle ueber Zeiger erreichbaren Zeichenketten der ROM: Missionsdialoge in fuenf Sprachen, Menuetexte, Ortsnamen und interne Bezeichner. Laengere Texte werden automatisch ans ROM-Ende verschoben und alle Zeiger nachgezogen.':
  'Toutes les chaines de la ROM accessibles par pointeur : dialogues de mission en cinq langues, textes de menu, noms de lieux et identifiants internes. Les textes plus longs sont deplaces automatiquement a la fin de la ROM et tous les pointeurs mis a jour.',
'Die ROM muss einmalig nach Texten durchsucht werden.':'La ROM doit etre analysee une fois pour trouver les textes.',
'Texte werden gelesen ...':'Lecture des textes ...','Gross-/Kleinschreibung beachten':'Respecter la casse',
'Text bearbeiten':'Modifier le texte','Suchen und Ersetzen':'Rechercher et remplacer','Suchen nach ...':'Rechercher ...','Ersetzen durch ...':'Remplacer par ...',
'Wirkt nur auf die gerade sichtbare Auswahl (Filter und Suche werden beruecksichtigt).':'N\'agit que sur la selection visible (filtre et recherche pris en compte).',
'Offset {0} · {1} Zeiger · GBA-Zeichensatz: nur Zeichen bis Code {2} (Latin-{3}).':'Offset {0} · {1} pointeurs · jeu de caracteres GBA : uniquement jusqu\'au code {2} (Latin-{3}).',
'→ wird ans ROM-Ende verschoben':'→ sera deplace a la fin de la ROM','{0} Zeichen nicht darstellbar':'{0} caracteres non affichables',
'Gespeichert.':'Enregistre.','Gespeichert, {0} Text(e) verschoben.':'Enregistre, {0} texte(s) deplace(s).','Gespeichert, {0} Zeichen ersetzt.':'Enregistre, {0} caracteres remplaces.',
'Gespeichert, {0} Text(e) verschoben, {1} Zeichen ersetzt.':'Enregistre, {0} texte(s) deplace(s), {1} caracteres remplaces.',
'{0} Texte geaendert.':'{0} textes modifies.','{0} Texte geaendert, {1} verschoben.':'{0} textes modifies, {1} deplaces.',
'{0} Texte uebernommen.':'{0} textes appliques.','{0} Texte uebernommen, {1} verschoben.':'{0} textes appliques, {1} deplaces.',
'CSV, alle Sprachen':'CSV, toutes les langues','{0} CSV, alle Sprachen':'{0} CSV, toutes les langues','{0} PNG inkl. Titelbild und Logo':'{0} PNG, ecran titre et logo compris',
'je Tabelle eine CSV':'un CSV par table',

'Alle PCM-Samples der ROM: Sprachaufnahmen, Motoren, Waffen, Radio-Schnipsel. Anhoeren, als WAV sichern und eigene Aufnahmen einspielen - das Studio wandelt automatisch in das {0}-Bit-Format des Game Boy Advance um.':
  'Tous les samples PCM de la ROM : voix, moteurs, armes, extraits radio. Ecouter, enregistrer en WAV et importer tes propres enregistrements - le studio convertit automatiquement au format {0} bits de la Game Boy Advance.',
'Diese ROM benutzt keinen Sequenzer wie Nintendos MusicPlayer2000 (Sappy). Es gibt darin also keine MIDI- oder Notendaten, die man exportieren koennte - die gesamte Musik und alle Gerausche liegen als fertig aufgenommene PCM-Samples vor. Genau die bearbeitest du hier: Wer eigene Musik einbauen will, rendert sie als WAV und spielt sie als Sample ein.':
  'Cette ROM n\'utilise pas de sequenceur comme le MusicPlayer2000 (Sappy) de Nintendo. Il n\'y a donc aucune donnee MIDI ou de notes a exporter - toute la musique et tous les bruitages sont des samples PCM deja enregistres. C\'est exactement ce que tu modifies ici : pour ajouter ta propre musique, exporte-la en WAV et importe-la comme sample.',
'Die ROM enthaelt keinen Noten-/Sequenzer-Teil (kein MusicPlayer2000). Musik liegt komplett als PCM vor - eigene Musik baust du als WAV ein.':
  'La ROM ne contient aucune partie notes/sequenceur (pas de MusicPlayer2000). Toute la musique est en PCM - ajoute ta propre musique en WAV.',
'Kuerzere Aufnahmen passen immer. Laengere werden ans ROM-Ende verschoben und alle Zeiger angepasst - das geht nur, wenn mindestens ein Zeiger bekannt ist.':
  'Les enregistrements plus courts tiennent toujours. Les plus longs sont deplaces a la fin de la ROM et tous les pointeurs mis a jour - seulement si au moins un pointeur est connu.',
'Die ROM muss einmalig nach Samples durchsucht werden.':'La ROM doit etre analysee une fois pour trouver les samples.',
'Kette wird verfolgt ...':'Suivi de la chaine ...','Suche: Offset oder Abtastrate ...':'Recherche : offset ou frequence ...',
'Daten ab':'Donnees a partir de','Wiedergabe nicht moeglich':'Lecture impossible',
'Sample ersetzt (an Ort und Stelle).':'Sample remplace (sur place).','Sample ersetzt, verschoben nach {0}.':'Sample remplace, deplace vers {0}.',
'{0}: verschoben nach {1} ({2} B)':'{0} : deplace vers {1} ({2} o)','{0}: ersetzt ({1} B)':'{0} : remplace ({1} o)',
'Sample ist laenger und hat keinen bekannten Zeiger - nicht verschiebbar':'Le sample est plus long et n\'a aucun pointeur connu - impossible a deplacer',
'kein freier Platz mehr - ROM auf {0} MB erweitern':'plus de place libre - etends la ROM a {0} Mo',
'keine WAV-Datei':'pas un fichier WAV','nur unkomprimiertes PCM wird unterstuetzt':'seul le PCM non compresse est pris en charge','{0} Bit werden nicht unterstuetzt':'{0} bits non pris en charge',
'WAV-Dateien werden erzeugt ...':'Creation des fichiers WAV ...','WAV-Dateien werden eingespielt ...':'Import des fichiers WAV ...',

'Das Spiel beschreibt Missionen, platzierte Objekte und Ereignisse ueber benannte Datensaetze. Das Studio findet diese Tabellen ueber ihre Namenszeiger und zeigt jedes Feld an - Zahlenwerte, Zeiger auf Texte und Verweise auf andere Datensaetze lassen sich direkt aendern.':
  'Le jeu decrit missions, objets places et evenements par des enregistrements nommes. Le studio trouve ces tables grace a leurs pointeurs de nom et affiche chaque champ - valeurs numeriques, pointeurs vers des textes et references a d\'autres enregistrements sont modifiables directement.',
'Die Namen und die Tabellenstruktur sind gesichert - die Bedeutung der einzelnen Zahlenfelder ist es nicht vollstaendig. Das Studio zeigt darum jedes Feld mit seiner Deutung (Zahl, Zeiger, Text) an, statt eine Bedeutung zu erfinden. Aendere Werte in kleinen Schritten und teste im Emulator.':
  'Les noms et la structure des tables sont confirmes - la signification de chaque champ numerique ne l\'est pas entierement. Le studio affiche donc chaque champ avec son interpretation (nombre, pointeur, texte) au lieu d\'inventer un sens. Modifie les valeurs par petites etapes et teste dans l\'emulateur.',
'Die Missionsdaten muessen einmalig analysiert werden.':'Les donnees de mission doivent etre analysees une fois.',
'Datensaetze werden gesucht ...':'Recherche des enregistrements ...','Texte werden gesucht (Grundlage fuer die Missionsdaten) ...':'Recherche des textes (base des donnees de mission) ...',
'Keine benannten Datensatztabellen gefunden.':'Aucune table d\'enregistrements nommes trouvee.',
'Jeder Eintrag dieser Tabelle ist {0} Byte gross und beginnt hier beim Namenszeiger.':'Chaque entree de cette table fait {0} octets et commence ici au pointeur de nom.',
'(koennte Weltkoordinate sein)':'(pourrait etre une coordonnee du monde)','{0} Datensaetze exportiert.':'{0} enregistrements exportes.',
'Ausloeser':'Declencheur','Ereignisse / Textausloeser':'Evenements / declencheurs de texte','Erfolgsmeldungen':'Messages de reussite','Fehlschlaege':'Echecs',
'Instanzen (platzierte Spielobjekte)':'Instances (objets places)','Missionen':'Missions','Name suchen ...':'Chercher un nom ...','Orte und Wegpunkte':'Lieux et points de passage',
'Pager-Nachrichten':'Messages du pager','globale Eintraege':'entrees globales',

'Direkter Zugriff auf jede Stelle der ROM - fuer alles, was die anderen Werkzeuge nicht abdecken. Die Lesezeichen fuehren zu allen bekannten Strukturen.':
  'Acces direct a chaque octet de la ROM - pour tout ce que les autres outils ne couvrent pas. Les signets menent a toutes les structures connues.',
'Bereich einspielen':'Importer une zone','Bereich speichern':'Enregistrer une zone','Lesezeichen ...':'Signets ...','In der ROM suchen':'Rechercher dans la ROM',
'Hex-Bytes durch Leerzeichen trennen, Text in Anfuehrungszeichen setzen.':'Separe les octets hexa par des espaces, mets le texte entre guillemets.',
'Wert ...':'Valeur ...',
'{0}  ROM-Kopf (Titel, Code, Pruefsumme)':'{0}  En-tete ROM (titre, code, somme de controle)','{0}  Menue-Texte (UI)':'{0}  Textes de menu (UI)',
'{0}  Abspann-Texttabellen':'{0}  Tables de texte du generique','{0}  Dialogtabellen':'{0}  Tables de dialogue','{0}  Ereignis-Datensaetze':'{0}  Enregistrements d\'evenements',
'{0}  Insel {1}: Zellen':'{0}  Ile {1} : cellules','{0}  Insel {1}: Zonen ({2})':'{0}  Ile {1} : zones ({2})','{0}  Insel {1}: Ebene B':'{0}  Ile {1} : couche B',
'{0}  Sound-Index (Sample-Zeiger)':'{0}  Index des sons (pointeurs de samples)',
'z. B. {0} A0 {1} oder {2}':'p. ex. {0} A0 {1} ou {2}',
'Hinweis zum Umfang: ':'Remarque sur la portee : ','Zum Thema MIDI: ':'A propos du MIDI : ','{0} MB  ({1} Bytes)':'{0} Mo  ({1} octets)','{0} Objekte':'{0} objets','Kachel {0}':'Tuile {0}','JSON':'JSON','{0} JSON':'{0} JSON'
});

/* ================================================================= IT */
add('it', {
'Vollstaendiger Mod-Baukasten fuer Grand Theft Auto Advance (Game Boy Advance). Grafiken, Karten, Texte, Sounds, Missionsdaten - alles in einem Programm, ohne Installation.':
  'Kit completo per il modding di Grand Theft Auto Advance (Game Boy Advance). Grafica, mappe, testi, suoni, dati delle missioni - tutto in un unico programma, senza installazione.',
'ROM laden (deine eigene, legal erstellte Kopie von {0}).':'Carica la ROM (la tua copia di "Grand Theft Auto Advance", estratta legalmente).',
'Im linken Menue den Bereich waehlen und Aenderungen vornehmen.':'Scegli una sezione nel menu a sinistra e apporta le modifiche.',
'Unter {0} regelmaessig das Projekt speichern - es enthaelt nur deine Aenderungen.':'Salva spesso il progetto in "ROM e progetto" - contiene solo le tue modifiche.',
'Mit {0} die fertige .gba erzeugen und im Emulator (z. B. mGBA) testen.':'Con "Salva ROM" crei il .gba finale; provalo in un emulatore (es. mGBA).',
'Das Studio veraendert nie deine Originaldatei. Alle Aenderungen leben im Speicher, bis du sie als neue ROM oder als Projektdatei sicherst. Teste eine gemoddete ROM immer erst im Emulator.':
  'Lo studio non modifica mai il file originale. Tutte le modifiche restano in memoria finche non le salvi come nuova ROM o file di progetto. Prova sempre una ROM modificata prima in un emulatore.',
'Alle Daten auf einmal als ZIP heraus- und wieder hineinschreiben - rund {0} Dateien in neun Bereichen, ohne jede einzeln auszuwaehlen.':
  'Esporta tutti i dati in un unico ZIP e reimportali - circa {0} file in nove sezioni, senza sceglierli uno per uno.',
'Rund {0} Sprites (Autos, Figuren, Effekte) ansehen, als PNG exportieren und wieder einspielen. Verschiebt Daten automatisch, wenn sie groesser werden.':
  'Visualizza circa {0} sprite (auto, personaggi, effetti), esportali come PNG e reimportali. I dati vengono spostati automaticamente se crescono.',
'Die zehn begehbaren {0}-Innenraeume mit {1}-Farben-Palette.':'I dieci interni percorribili in {0} con palette a {1} colori.',
'Titelbild, Logo mit allen Animationsstufen, Zwischensequenzen, Portraits, Briefing-Tafeln und Symbole - {0} Bilder aus Kacheln, Tilemap und Palette.':
  'Schermata del titolo, logo con tutte le fasi di animazione, filmati, ritratti, pannelli di briefing e icone - {0} immagini fatte di tile, tilemap e palette.',
'Die {0} unkomprimierten {1}-Bit-Texturen der Stadt - Daecher, Fassaden, Strassenbelag - in den echten Farben der gefundenen Weltpalette.':
  'Le {0} texture non compresse a {1} bit della citta - tetti, facciate, asfalto - nei veri colori della palette del mondo.',
'HUD- und Textschrift als {0}-Glyphen: A-Z, Ziffern, Satzzeichen und Akzentbuchstaben ansehen, exportieren und austauschen.':
  'Font dell\'HUD e del testo come glifi {0}: visualizza, esporta e sostituisci A-Z, cifre, punteggiatura e lettere accentate.',
'Alle drei Inseln mit fuenf Ansichten - die Gebaeudetypen-Ansicht faerbt Strasse, Gehweg, Gebaeude und Hochstrasse ein. Mit Uebersichtskarte, Zell-Inspektor und nach Typ gruppierter Kachelauswahl.':
  'Tutte e tre le isole con cinque viste - la vista dei tipi di edificio colora strada, marciapiede, edifici e sopraelevata. Con minimappa, ispettore di cella e selettore di tile raggruppato per tipo.',
'Saemtliche Spieltexte in fuenf Sprachen (EN/ES/FR/IT/DE) inklusive Menue-Strings, mit automatischer Neuverlinkung bei laengeren Texten.':
  'Tutti i testi del gioco in cinque lingue (EN/ES/FR/IT/DE) compresi quelli dei menu, con ricollegamento automatico dei testi piu lunghi.',
'Alle PCM-Samples anhoeren, als WAV exportieren und eigene WAV-Dateien importieren.':'Ascolta tutti i campioni PCM, esportali come WAV e importa i tuoi file WAV.',
'Die benannten Spiel-Datensaetze (Missionen, Instanzen, Ereignisse, Dialogverweise) durchsuchen und Werte aendern.':
  'Sfoglia i record con nome del gioco (missioni, istanze, eventi, riferimenti ai dialoghi) e modifica i valori.',
'Rohzugriff auf jede Stelle der ROM, mit Lesezeichen aller bekannten Strukturen.':'Accesso diretto a ogni byte della ROM, con segnalibri per tutte le strutture note.',
'Vollbilder (Raeume)':'Schermate intere (interni)','Welt-Texturen':'Texture del mondo','Karten-Editor':'Editor di mappe','Missionen und Objekte':'Missioni e oggetti',
'Menue-Grafiken':'Grafica dei menu','Schriften':'Font','Hex-Editor':'Editor esadecimale','Sound':'Audio','Sprites':'Sprite','Auswahl':'Selezione',
'Fuellen':'Riempi','Schieben':'Sposta vista',
'oder Datei einfach ins Fenster ziehen':'oppure trascina il file nella finestra',

'Zustand der geladenen ROM, Projektverwaltung und Ausgabe der fertigen Moddatei.':'Stato della ROM caricata, gestione del progetto e output del mod finito.',
'Die Projektdatei enthaelt nur deine Aenderungen - die ROM selbst wird nicht mitgespeichert.':'Il file di progetto contiene solo le tue modifiche - la ROM non viene salvata al suo interno.',
'Beim Speichern wird die Kopf-Pruefsumme automatisch neu berechnet. Teste die Ausgabe vor dem Flashen in einem Emulator.':
  'Al salvataggio il checksum dell\'intestazione viene ricalcolato automaticamente. Prova il risultato in un emulatore prima di scriverlo su cartuccia.',
'Ein IPS-Patch enthaelt nur deine Aenderungen, nicht das Spiel selbst. So kannst du einen Mod weitergeben, ohne die ROM mitzuliefern - andere wenden den Patch auf ihre eigene Kopie an.':
  'Una patch IPS contiene solo le tue modifiche, non il gioco. Cosi puoi condividere un mod senza distribuire la ROM - gli altri applicano la patch alla propria copia.',
'Prueft sich selbst: der Patch wird sofort auf die Original-ROM angewendet und mit deinem Stand verglichen.':
  'Si verifica da sola: la patch viene subito applicata alla ROM originale e confrontata con la tua versione.',
'IPS-Patch wird erstellt ...':'Creazione della patch IPS ...','Patch wird gegengeprueft ...':'Verifica della patch ...',
'IPS-Patch gespeichert: {0} Datensaetze, {1} KB.':'Patch IPS salvata: {0} record, {1} KB.',
'IPS-Patch gespeichert: {0} Datensaetze, {1} KB (IPS32, weil die ROM groesser als {2} MB ist).':'Patch IPS salvata: {0} record, {1} KB (IPS32, perche la ROM supera i {2} MB).',
'Keine Aenderungen - ein Patch waere leer.':'Nessuna modifica - la patch sarebbe vuota.',
'Selbstkontrolle fehlgeschlagen - es wurde nichts geschrieben.':'Autoverifica fallita - non e stato scritto nulla.',
'Keine Aenderungen gegenueber dem Original.':'Nessuna modifica rispetto all\'originale.',
'Auf Originalzustand zurueckgesetzt.':'Ripristinato lo stato originale.',
'Saemtliche Aenderungen gehen verloren. Fortfahren?':'Tutte le modifiche andranno perse. Continuare?',
'Zuruecksetzen':'Ripristina','ROM passt nicht':'La ROM non corrisponde',
'Das Projekt wurde mit einer anderen ROM erstellt. Trotzdem anwenden?':'Il progetto e stato creato con un\'altra ROM. Applicarlo comunque?',
'Bitte zuerst die Original-ROM laden, dann das Projekt.':'Carica prima la ROM originale, poi il progetto.',
'Projekt geladen: {0} Aenderungsbloecke.':'Progetto caricato: {0} blocchi di modifiche.',
'Projekt gespeichert ({0} Aenderungsbloecke).':'Progetto salvato ({0} blocchi di modifiche).',
'Projekt wird geschrieben ...':'Salvataggio del progetto ...',
'Die ROM ist bereits {0} MB gross.':'La ROM e gia di {0} MB.','ROM auf {0} MB erweitert.':'ROM espansa a {0} MB.',
'Die ROM wird auf {0} MB vergroessert. Das schafft Platz fuer grosse Umbauten, setzt beim Spielen auf echter Hardware aber ein {1}-MB-faehiges Modul voraus. Emulatoren koennen das immer.':
  'La ROM verra espansa a {0} MB. Cosi c\'e spazio per grandi modifiche, ma per giocare su hardware reale serve una cartuccia da {1} MB. Gli emulatori la supportano sempre.',
'unbekannte Fassung - Adressen koennen abweichen':'versione sconosciuta - gli indirizzi possono differire',
'ungueltig (wird beim Speichern korrigiert)':'non valido (corretto al salvataggio)',
'... und {0} weitere Bloecke':'... e altri {0} blocchi','... und {0} weitere':'... e altri {0}',
'Andere ROM-Version erkannt - bekannte Adressen koennen abweichen.':'Rilevata un\'altra versione della ROM - gli indirizzi noti possono differire.',
'Kartendaten ({0} Level)':'Dati delle mappe ({0} livelli)','Missions- und Objektdaten':'Dati di missioni e oggetti',
'Notizen zum Mod ...':'Note sul mod ...','Tabellen & Sound-Index':'Tabelle e indice audio','Verweistabellen':'Tabelle di riferimento',
'Welt-Texturen ({0}bpp)':'Texture del mondo ({0}bpp)','freier Bereich / neue Daten':'area libera / nuovi dati',

'Keine ROM geladen.':'Nessuna ROM caricata.','Datei ist zu klein fuer eine GBA-ROM.':'Il file e troppo piccolo per una ROM GBA.',
'Datei konnte nicht gelesen werden':'Impossibile leggere il file',
'Bitte eine .gba-ROM oder eine .gtastudio-Projektdatei ablegen.':'Trascina qui una ROM .gba o un file di progetto .gtastudio.',
'Import abgeschlossen':'Importazione completata','Import abgeschlossen.':'Importazione completata.',
'Import fehlgeschlagen':'Importazione fallita','Import: {0} geaendert, {1} Fehler':'Importazione: {0} modificati, {1} errori',
'nichts geaendert':'nessuna modifica','uebersprungen: {0}':'saltato: {0}','uebersprungen: {0} (kein passender Name)':'saltato: {0} (nessun nome corrispondente)',
'Eintraege':'voci','{0} Eintraege':'{0} voci','alle ({0})':'tutte ({0})','alle Groessen ({0})':'tutte le dimensioni ({0})','Ungueltiger Wert.':'Valore non valido.',
'Uebernehmen':'Applica','Ersetzen':'Sostituisci','Farbe aendern':'Cambia colore',

'Autos, Figuren, Waffen, Effekte und Objekte - {0}bpp mit {1} Farben. Als PNG exportieren, bearbeiten und wieder einspielen. Wird eine Grafik nach dem Packen groesser, verschiebt das Studio sie ans ROM-Ende und passt alle Pointer an.':
  'Auto, personaggi, armi, effetti e oggetti - {0}bpp con {1} colori. Esporta come PNG, modifica e reimporta. Se una grafica cresce dopo la compressione, lo studio la sposta alla fine della ROM e aggiorna tutti i puntatori.',
'Zehn bildschirmfuellende {0}-Grafiken mit {1}-Farben-Palette - die begehbaren Innenraeume. Titelbild, Logo und die uebrigen Menuebilder liegen in einem anderen Format und stehen unter {2}. Identische Kopien werden beim Import automatisch mitgezogen.':
  'Dieci grafiche a schermo intero {0} con palette a {1} colori - gli interni percorribili. Schermata del titolo, logo e le altre immagini dei menu usano un altro formato e si trovano in "Grafica dei menu". Le copie identiche vengono aggiornate automaticamente all\'importazione.',
'Die ROM muss einmalig nach Grafiken durchsucht werden. Das Ergebnis bleibt fuer diese Sitzung gespeichert.':'La ROM va analizzata una volta per trovare la grafica. Il risultato resta memorizzato per questa sessione.',
'Grafiken werden gesucht ... (einmalig, dauert einige Sekunden)':'Ricerca della grafica ... (una sola volta, qualche secondo)',
'Gefunden: {0} Sprites, {1} Vollbilder, {2} Paletten.':'Trovati: {0} sprite, {1} schermate intere, {2} palette.',
'Auf ein Feld klicken, um die Farbe zu aendern. Mehrere Sprites koennen sich eine Palette teilen.':'Clicca su una casella per cambiare il colore. Piu sprite possono condividere una palette.',
'Keine eindeutige Palette gefunden - angezeigt wird eine Ersatzpalette. Die Indizes stimmen trotzdem.':'Nessuna palette certa trovata - viene mostrata una palette sostitutiva. Gli indici restano corretti.',
'Farbe {0} der Palette {1}. Der GBA speichert {2} Bit - die Farbe wird gerundet.':'Colore {0} della palette {1}. Il GBA memorizza {2} bit - il colore verra arrotondato.',
'Palette {0}':'Palette {0}','Palettenfarbe geaendert.':'Colore della palette modificato.',
'Beim Import Farben zuordnen statt Indizes':'All\'importazione, abbina i colori invece degli indici',
'{0} Farben lagen weit ausserhalb der Palette und wurden auf die naechste gerundet.':'{0} colori erano molto fuori dalla palette e sono stati arrotondati al piu vicino.',
'PNG-Palette weicht ab - es werden die Palettenindizes verwendet. Farben aenderst du ueber die Palette im Studio oder per Farbabgleich.':
  'La palette del PNG e diversa - vengono usati gli indici della palette. Cambia i colori con la palette dello studio o con l\'abbinamento dei colori.',
'Bildgroesse {0}, erwartet {1}':'Dimensione immagine {0}, prevista {1}','Groesse {0}, erwartet {1}':'Dimensione {0}, prevista {1}',
'Palettenindex {0} im PNG, erlaubt sind {1}..{2}':'Indice di palette {0} nel PNG, consentiti {1}..{2}',
'Palettenindex > {0} - {1}bpp erlaubt nur {2} Farben':'Indice di palette > {0} - il {1}bpp consente solo {2} colori',
'Palettenindex > {0} - Vollbilder erlauben nur {1} Farben':'Indice di palette > {0} - le schermate intere consentono solo {1} colori',
'{0}: unveraendert':'{0}: invariato','{0}: an Ort und Stelle ({1}/{2} Bytes)':'{0}: sul posto ({1}/{2} byte)',
'{0}: verschoben nach {1} ({2} Bytes, {3} Pointer angepasst)':'{0}: spostato a {1} ({2} byte, {3} puntatori aggiornati)',
'FEHLER {0}: {1} Bytes, Platz {2}, keine Pointer bekannt - nicht verschiebbar':'ERRORE {0}: {1} byte, spazio {2}, nessun puntatore noto - non spostabile',
'FEHLER {0}: kein freier Platz mehr (ROM unter {1} auf {2} MB erweitern)':'ERRORE {0}: spazio libero esaurito (espandi la ROM a {2} MB in "ROM e progetto")',
'{0} Grafiken exportiert.':'{0} grafiche esportate.','Grafiken exportiert.':'Grafiche esportate.',
'PNG-Dateien werden erzeugt ...':'Creazione dei file PNG ...','PNG-Dateien werden eingespielt ...':'Importazione dei file PNG ...',

'Titelbild, Logo mit seinen Animationsstufen, Zwischensequenzen, Figuren-Portraits, Briefing-Tafeln und Waffen-/Objektsymbole. Jedes Bild besteht aus {0}bpp-Kacheln, einer Tilemap und einer {1}-Farben-Palette.':
  'Schermata del titolo, logo con le sue fasi di animazione, filmati, ritratti dei personaggi, pannelli di briefing e icone di armi/oggetti. Ogni immagine e composta da tile {0}bpp, una tilemap e una palette a {1} colori.',
'Bekannte Bilder: #{0} Titelbild, #{1}-#{2} GTA-Advance-Logo, #{3} Rockstar-Logo, #{4} Digital Eclipse. Mit ★ markierte Eintraege sind benannt - du kannst auch nach dem Namen suchen.':
  'Immagini note: #{0} schermata del titolo, #{1}-#{2} logo GTA Advance, #{3} logo Rockstar, #{4} Digital Eclipse. Le voci con ★ hanno un nome - puoi anche cercare per nome.',
'Beim Import baut das Studio Kacheln und Tilemap neu auf und erkennt dabei gespiegelte Wiederholungen. Bildgroesse beibehalten, hoechstens {0} Farben, Index {1} ist transparent. Braucht das Ergebnis mehr Platz, wandert der Block ans ROM-Ende und der Datensatz wird angepasst.':
  'All\'importazione lo studio ricostruisce tile e tilemap e riconosce le ripetizioni speculari. Mantieni la dimensione dell\'immagine, al massimo {0} colori, l\'indice {1} e trasparente. Se il risultato richiede piu spazio, il blocco va alla fine della ROM e il record viene aggiornato.',
'Keine Menue-Bildtabelle gefunden - andere ROM-Fassung?':'Tabella delle immagini dei menu non trovata - altra versione della ROM?',
'Bild #{0} ist identisch - nichts geaendert.':'L\'immagine #{0} e identica - nessuna modifica.',
'Bild #{0} ersetzt: {1} Kacheln, an Ort und Stelle.':'Immagine #{0} sostituita: {1} tile, sul posto.',
'Bild #{0} ersetzt: {1} Kacheln, verschoben nach {2}.':'Immagine #{0} sostituita: {1} tile, spostata a {2}.',
'#{0}: identisch, nichts geaendert':'#{0}: identica, nessuna modifica','#{0}: {1} Kacheln':'#{0}: {1} tile','#{0}: {1} Kacheln, verschoben nach {2}':'#{0}: {1} tile, spostata a {2}',
'{0}  ({1} Stueck, {2} B)':'{0}  ({1} pz., {2} B)','Farbe {0} aendern':'Cambia colore {0}',
'Palette {0}. Der GBA speichert {1} Bit, die Farbe wird gerundet.':'Palette {0}. Il GBA memorizza {1} bit, il colore verra arrotondato.',
'Palettenindex {0} - erlaubt sind nur {1} Farben ({2}..{3})':'Indice di palette {0} - sono consentiti solo {1} colori ({2}..{3})',
'{0} verschiedene Kacheln - die Hardware erlaubt hoechstens {1}':'{0} tile diversi - l\'hardware ne consente al massimo {1}',
'kein freier Platz mehr - ROM unter {0} auf {1} MB erweitern':'spazio libero esaurito - espandi la ROM a {1} MB in "ROM e progetto"',
'{0} Menue-Grafiken exportiert.':'{0} grafiche dei menu esportate.','Menue-Grafiken exportiert.':'Grafica dei menu esportata.',
'Menue-Grafiken werden exportiert ...':'Esportazione della grafica dei menu ...','Menue-Grafiken werden eingespielt ...':'Importazione della grafica dei menu ...',
'Suche: Nummer oder Offset ...':'Cerca: numero o offset ...',

'Die unkomprimierten {0}-Bit-Texturen der Stadt ({1}, {2} und {3} Pixel) - Dachflaechen, Fassaden, Strassenbelag. Groesse und Lage sind fest: beim Import werden die Pixel direkt an derselben Stelle ersetzt.':
  'Le texture non compresse a {0} bit della citta ({1}, {2} e {3} pixel) - tetti, facciate, asfalto. Dimensione e posizione sono fisse: all\'importazione i pixel vengono sostituiti nello stesso punto.',
'Angezeigt wird die Weltpalette der Engine - {0} Farben, in der ROM viermal abgelegt. Beim Bearbeiten zaehlen die Palettenindizes, und die bleiben bei Export und Import exakt erhalten.':
  'Viene mostrata la palette del mondo del motore - {0} colori, memorizzata quattro volte nella ROM. In modifica contano gli indici della palette, che restano identici in esportazione e importazione.',
'{0} Farben @ {1}':'{0} colori @ {1}','Keine Texturtabellen gefunden - andere ROM-Fassung?':'Nessuna tabella delle texture trovata - altra versione della ROM?',
'{0} Texturen exportiert.':'{0} texture esportate.','Texturen exportiert.':'Texture esportate.','{0} Texturen ersetzt':'{0} texture sostituite',
'Texturen werden exportiert ...':'Esportazione delle texture ...','Texturen werden eingespielt ...':'Importazione delle texture ...',
'Suche nach Offset ...':'Cerca per offset ...',

'Die Spieltexte werden zur Laufzeit aus {0}-Glyphen gesetzt: {1}bpp, {2} Byte je Zeichen, fortlaufend in der ROM. Gefunden habe ich sie ueber den Bildspeicher des beiliegenden Savestates - die dort sichtbaren Buchstaben stehen genauso in der ROM.':
  'I testi del gioco vengono composti in tempo reale con glifi {0}: {1}bpp, {2} byte per carattere, in sequenza nella ROM. Sono stati trovati tramite la memoria video del savestate allegato - le lettere visibili li sono memorizzate allo stesso modo nella ROM.',
'A-Z, Ziffern und die gaengigen Satzzeichen sind gesichert. Die {0} Akzentbuchstaben benutzen eine eigene Kodierung des Spiels (nicht Latin-{1}) - welcher Zeichencode auf welche Glyphe zeigt, rechnet der Programmcode aus, es gibt dafuer keine Tabelle in der ROM. Sie sind darum nach Position benannt.':
  'A-Z, cifre e la punteggiatura comune sono confermate. Le {0} lettere accentate usano una codifica propria del gioco (non Latin-{1}) - e il codice del programma a calcolare quale carattere punta a quale glifo, nella ROM non c\'e una tabella. Per questo sono nominate per posizione.',
'Die Schriften muessen einmalig gesucht werden (Formvergleich ueber A-Z).':'I font vanno cercati una volta (confronto delle forme A-Z).',
'Keine Schrift gefunden - andere ROM-Fassung?':'Nessun font trovato - altra versione della ROM?',
'{0} Byte der Schrift ersetzt.':'{0} byte del font sostituiti.','Schrift ist identisch - nichts geaendert.':'Il font e identico - nessuna modifica.',
'{0} Schriften exportiert.':'{0} font esportati.','Zeichen {0}':'Carattere {0}','Zeichen {0}  {1}':'Carattere {0}  {1}','Farbstufen':'Livelli di colore',
'{0} PNG - HUD- und Textschrift':'{0} PNG - font dell\'HUD e del testo',

'Hoehe {0}, begehbar':'Altezza {0}, percorribile','Hoehe {0}, gesperrt':'Altezza {0}, bloccato',
'Hoehe {0}, begehbar - Fahrbahn':'Altezza {0}, percorribile - carreggiata','Hoehe {0}, gesperrt - Wasser, Randsperren':'Altezza {0}, bloccato - acqua, limiti',
'Zwischenhoehen':'Altezze intermedie','Kollision {0} · Hoehe {1}':'Collisione {0} · altezza {1}',
'{0} Zellen':'{0} celle','Insel {0}':'Isola {0}','Insel {0} ({1})':'Isola {0} ({1})','Zelle {0},{1}':'Cella {0},{1}','Wert {0}':'Valore {0}',
'{0} Aenderungsschritte':'{0} passi di modifica','Taste H - oder Leertaste halten':'Tasto H - oppure tieni premuta la barra spaziatrice',
'Insel {0} in die ROM geschrieben.':'Isola {0} scritta nella ROM.',
'Insel {0} wird aus der Original-ROM neu geladen. Aenderungen an dieser Insel gehen verloren (bereits in die ROM geschriebene bleiben, bis du erneut schreibst).':
  'L\'isola {0} verra ricaricata dalla ROM originale. Le modifiche a quest\'isola andranno perse (quelle gia scritte nella ROM restano finche non scrivi di nuovo).',
'Original wiederherstellen':'Ripristina originale','Karte als JSON gespeichert.':'Mappa salvata come JSON.',
'Karte geladen. Mit {0} uebernehmen.':'Mappa caricata. Applicala con "Scrivi nella ROM".',
'gehoert zu einer anderen Insel oder Groesse':'appartiene a un\'altra isola o dimensione',
'Keine Kachel passt zum Filter.':'Nessun tile corrisponde al filtro.','Nichts rueckgaengig zu machen.':'Niente da annullare.',
'Zwischenablage ist leer.':'Gli appunti sono vuoti.','Zuerst mit dem Auswahlwerkzeug einen Bereich markieren.':'Seleziona prima un\'area con lo strumento di selezione.',
'Zielpunkt mit dem Auswahlwerkzeug markieren.':'Segna il punto di destinazione con lo strumento di selezione.',
'Objektliste konnte nicht verifiziert werden':'Impossibile verificare l\'elenco degli oggetti','Zonenliste konnte nicht verifiziert werden':'Impossibile verificare l\'elenco delle zone',
'Objektliste konnte nicht verifiziert werden - Werte trotzdem bearbeitbar, aber bitte pruefen.':'Impossibile verificare l\'elenco degli oggetti - i valori restano modificabili, ma controllali.',
'Zonenliste konnte nicht verifiziert werden - Werte trotzdem bearbeitbar, aber bitte pruefen.':'Impossibile verificare l\'elenco delle zone - i valori restano modificabili, ma controllali.',
'Auswahl aufheben':'Annulla selezione','Begehbar oder gesperrt':'Percorribile o bloccato','Beides uebereinander':'Entrambi sovrapposti',
'Damit bekommt eine gemalte Hauskachel automatisch die passende Sperre und Hoehe.':'Cosi un tile di edificio dipinto riceve automaticamente il blocco e l\'altezza giusti.',
'Der Typ ergibt sich aus Kollision und Hoehe der Zelle, nicht aus der Kachelgrafik.':'Il tipo dipende dalla collisione e dall\'altezza della cella, non dalla grafica del tile.',
'Diese Insel zuruecksetzen':'Ripristina quest\'isola','Ebene B - Hoehenstufe':'Livello B - gradino di altezza','Ebene B als Graustufen':'Livello B in scala di grigi',
'Faerbt jede Zelle nach Strasse, Gehweg, Gebaeude, Rampe ...':'Colora ogni cella come strada, marciapiede, edificio, rampa ...',
'Hoehenwerte':'Valori di altezza','Insel waehlen':'Scegli isola','Kachelgrafik wie im Spiel':'Grafica dei tile come nel gioco',
'Karte als Datei speichern':'Salva mappa su file','Karte aus Datei laden':'Carica mappa da file',
'Klicken springt zu dieser Stelle.':'Un clic salta a questo punto.','Legende: Hoehe (Ebene B)':'Legenda: altezza (livello B)',
'Pinselgroesse':'Dimensione pennello','Rueckgaengig (Strg+Z)':'Annulla (Ctrl+Z)','Wiederholen (Strg+Y)':'Ripeti (Ctrl+Y)',
'Uebersichtsbild speichern':'Salva immagine panoramica','Was auf der Zelle steht':'Contenuto della cella','Zeiger ueber die Karte bewegen ...':'Muovi il puntatore sulla mappa ...',

'Alle ueber Zeiger erreichbaren Zeichenketten der ROM: Missionsdialoge in fuenf Sprachen, Menuetexte, Ortsnamen und interne Bezeichner. Laengere Texte werden automatisch ans ROM-Ende verschoben und alle Zeiger nachgezogen.':
  'Tutte le stringhe della ROM raggiungibili tramite puntatori: dialoghi delle missioni in cinque lingue, testi dei menu, nomi di luoghi e identificatori interni. I testi piu lunghi vengono spostati automaticamente alla fine della ROM e tutti i puntatori aggiornati.',
'Die ROM muss einmalig nach Texten durchsucht werden.':'La ROM va analizzata una volta per trovare i testi.',
'Texte werden gelesen ...':'Lettura dei testi ...','Gross-/Kleinschreibung beachten':'Maiuscole/minuscole',
'Text bearbeiten':'Modifica testo','Suchen und Ersetzen':'Trova e sostituisci','Suchen nach ...':'Trova ...','Ersetzen durch ...':'Sostituisci con ...',
'Wirkt nur auf die gerade sichtbare Auswahl (Filter und Suche werden beruecksichtigt).':'Agisce solo sulla selezione visibile (filtro e ricerca vengono considerati).',
'Offset {0} · {1} Zeiger · GBA-Zeichensatz: nur Zeichen bis Code {2} (Latin-{3}).':'Offset {0} · {1} puntatori · set di caratteri GBA: solo caratteri fino al codice {2} (Latin-{3}).',
'→ wird ans ROM-Ende verschoben':'→ verra spostato alla fine della ROM','{0} Zeichen nicht darstellbar':'{0} caratteri non rappresentabili',
'Gespeichert.':'Salvato.','Gespeichert, {0} Text(e) verschoben.':'Salvato, {0} testo/i spostato/i.','Gespeichert, {0} Zeichen ersetzt.':'Salvato, {0} caratteri sostituiti.',
'Gespeichert, {0} Text(e) verschoben, {1} Zeichen ersetzt.':'Salvato, {0} testo/i spostato/i, {1} caratteri sostituiti.',
'{0} Texte geaendert.':'{0} testi modificati.','{0} Texte geaendert, {1} verschoben.':'{0} testi modificati, {1} spostati.',
'{0} Texte uebernommen.':'{0} testi applicati.','{0} Texte uebernommen, {1} verschoben.':'{0} testi applicati, {1} spostati.',
'CSV, alle Sprachen':'CSV, tutte le lingue','{0} CSV, alle Sprachen':'{0} CSV, tutte le lingue','{0} PNG inkl. Titelbild und Logo':'{0} PNG incl. schermata del titolo e logo',
'je Tabelle eine CSV':'un CSV per tabella',

'Alle PCM-Samples der ROM: Sprachaufnahmen, Motoren, Waffen, Radio-Schnipsel. Anhoeren, als WAV sichern und eigene Aufnahmen einspielen - das Studio wandelt automatisch in das {0}-Bit-Format des Game Boy Advance um.':
  'Tutti i campioni PCM della ROM: voci, motori, armi, spezzoni radio. Ascolta, salva come WAV e importa le tue registrazioni - lo studio converte automaticamente nel formato a {0} bit del Game Boy Advance.',
'Diese ROM benutzt keinen Sequenzer wie Nintendos MusicPlayer2000 (Sappy). Es gibt darin also keine MIDI- oder Notendaten, die man exportieren koennte - die gesamte Musik und alle Gerausche liegen als fertig aufgenommene PCM-Samples vor. Genau die bearbeitest du hier: Wer eigene Musik einbauen will, rendert sie als WAV und spielt sie als Sample ein.':
  'Questa ROM non usa un sequencer come il MusicPlayer2000 (Sappy) di Nintendo. Non ci sono quindi dati MIDI o di note da esportare - tutta la musica e tutti gli effetti sono campioni PCM gia registrati. E proprio questo che modifichi qui: per inserire la tua musica, esportala come WAV e importala come campione.',
'Die ROM enthaelt keinen Noten-/Sequenzer-Teil (kein MusicPlayer2000). Musik liegt komplett als PCM vor - eigene Musik baust du als WAV ein.':
  'La ROM non contiene una parte di note/sequencer (niente MusicPlayer2000). Tutta la musica e PCM - aggiungi la tua musica come WAV.',
'Kuerzere Aufnahmen passen immer. Laengere werden ans ROM-Ende verschoben und alle Zeiger angepasst - das geht nur, wenn mindestens ein Zeiger bekannt ist.':
  'Le registrazioni piu corte entrano sempre. Quelle piu lunghe vengono spostate alla fine della ROM e tutti i puntatori aggiornati - funziona solo se e noto almeno un puntatore.',
'Die ROM muss einmalig nach Samples durchsucht werden.':'La ROM va analizzata una volta per trovare i campioni.',
'Kette wird verfolgt ...':'Analisi della catena ...','Suche: Offset oder Abtastrate ...':'Cerca: offset o frequenza di campionamento ...',
'Daten ab':'Dati da','Wiedergabe nicht moeglich':'Riproduzione impossibile',
'Sample ersetzt (an Ort und Stelle).':'Campione sostituito (sul posto).','Sample ersetzt, verschoben nach {0}.':'Campione sostituito, spostato a {0}.',
'{0}: verschoben nach {1} ({2} B)':'{0}: spostato a {1} ({2} B)','{0}: ersetzt ({1} B)':'{0}: sostituito ({1} B)',
'Sample ist laenger und hat keinen bekannten Zeiger - nicht verschiebbar':'Il campione e piu lungo e non ha puntatori noti - non spostabile',
'kein freier Platz mehr - ROM auf {0} MB erweitern':'spazio libero esaurito - espandi la ROM a {0} MB',
'keine WAV-Datei':'non e un file WAV','nur unkomprimiertes PCM wird unterstuetzt':'e supportato solo PCM non compresso','{0} Bit werden nicht unterstuetzt':'{0} bit non supportati',
'WAV-Dateien werden erzeugt ...':'Creazione dei file WAV ...','WAV-Dateien werden eingespielt ...':'Importazione dei file WAV ...',

'Das Spiel beschreibt Missionen, platzierte Objekte und Ereignisse ueber benannte Datensaetze. Das Studio findet diese Tabellen ueber ihre Namenszeiger und zeigt jedes Feld an - Zahlenwerte, Zeiger auf Texte und Verweise auf andere Datensaetze lassen sich direkt aendern.':
  'Il gioco descrive missioni, oggetti piazzati ed eventi tramite record con nome. Lo studio trova queste tabelle tramite i loro puntatori al nome e mostra ogni campo - valori numerici, puntatori a testi e riferimenti ad altri record si possono modificare direttamente.',
'Die Namen und die Tabellenstruktur sind gesichert - die Bedeutung der einzelnen Zahlenfelder ist es nicht vollstaendig. Das Studio zeigt darum jedes Feld mit seiner Deutung (Zahl, Zeiger, Text) an, statt eine Bedeutung zu erfinden. Aendere Werte in kleinen Schritten und teste im Emulator.':
  'I nomi e la struttura delle tabelle sono confermati - il significato dei singoli campi numerici non del tutto. Per questo lo studio mostra ogni campo con la sua interpretazione (numero, puntatore, testo) invece di inventare un significato. Modifica i valori a piccoli passi e prova nell\'emulatore.',
'Die Missionsdaten muessen einmalig analysiert werden.':'I dati delle missioni vanno analizzati una volta.',
'Datensaetze werden gesucht ...':'Ricerca dei record ...','Texte werden gesucht (Grundlage fuer die Missionsdaten) ...':'Ricerca dei testi (base per i dati delle missioni) ...',
'Keine benannten Datensatztabellen gefunden.':'Nessuna tabella di record con nome trovata.',
'Jeder Eintrag dieser Tabelle ist {0} Byte gross und beginnt hier beim Namenszeiger.':'Ogni voce di questa tabella occupa {0} byte e inizia qui, dal puntatore al nome.',
'(koennte Weltkoordinate sein)':'(potrebbe essere una coordinata del mondo)','{0} Datensaetze exportiert.':'{0} record esportati.',
'Ausloeser':'Attivatore','Ereignisse / Textausloeser':'Eventi / attivatori di testo','Erfolgsmeldungen':'Messaggi di successo','Fehlschlaege':'Fallimenti',
'Instanzen (platzierte Spielobjekte)':'Istanze (oggetti piazzati)','Missionen':'Missioni','Name suchen ...':'Cerca nome ...','Orte und Wegpunkte':'Luoghi e waypoint',
'Pager-Nachrichten':'Messaggi del cercapersone','globale Eintraege':'voci globali',

'Direkter Zugriff auf jede Stelle der ROM - fuer alles, was die anderen Werkzeuge nicht abdecken. Die Lesezeichen fuehren zu allen bekannten Strukturen.':
  'Accesso diretto a ogni byte della ROM - per tutto cio che gli altri strumenti non coprono. I segnalibri portano a tutte le strutture note.',
'Bereich einspielen':'Importa area','Bereich speichern':'Salva area','Lesezeichen ...':'Segnalibri ...','In der ROM suchen':'Cerca nella ROM',
'Hex-Bytes durch Leerzeichen trennen, Text in Anfuehrungszeichen setzen.':'Separa i byte esadecimali con spazi, metti il testo tra virgolette.',
'Wert ...':'Valore ...',
'{0}  ROM-Kopf (Titel, Code, Pruefsumme)':'{0}  Intestazione ROM (titolo, codice, checksum)','{0}  Menue-Texte (UI)':'{0}  Testi dei menu (UI)',
'{0}  Abspann-Texttabellen':'{0}  Tabelle dei testi dei titoli di coda','{0}  Dialogtabellen':'{0}  Tabelle dei dialoghi','{0}  Ereignis-Datensaetze':'{0}  Record degli eventi',
'{0}  Insel {1}: Zellen':'{0}  Isola {1}: celle','{0}  Insel {1}: Zonen ({2})':'{0}  Isola {1}: zone ({2})','{0}  Insel {1}: Ebene B':'{0}  Isola {1}: livello B',
'{0}  Sound-Index (Sample-Zeiger)':'{0}  Indice audio (puntatori ai campioni)',
'z. B. {0} A0 {1} oder {2}':'es. {0} A0 {1} o {2}',
'Hinweis zum Umfang: ':'Nota sulla portata: ','Zum Thema MIDI: ':'Sul MIDI: ','{0} MB  ({1} Bytes)':'{0} MB  ({1} byte)','{0} Objekte':'{0} oggetti','Kachel {0}':'Tile {0}','JSON':'JSON','{0} JSON':'{0} JSON'
});

/* ================================================================= Komplett-Paket */
add('en', {
'Alle bearbeitbaren Daten der ROM auf einmal herausschreiben und genauso wieder einspielen - ohne jede Datei einzeln auszuwaehlen. Das Paket ist ein gewoehnliches ZIP; du kannst es entpacken, bearbeiten und wieder einpacken, solange die Dateinamen gleich bleiben.':'Write all editable ROM data out at once and import it back the same way - without picking each file. The package is an ordinary ZIP; you can unpack it, edit it and pack it again as long as the file names stay the same.',
'Je nach Auswahl dauert das eine halbe bis zwei Minuten und ergibt {0} bis {1} MB. Die ROM wird dabei nicht veraendert.':'Depending on the selection this takes half a minute to two minutes and produces {0} to {1} MB. The ROM is not changed.',
'Es werden nur Dateien uebernommen, die zu einem bekannten Eintrag passen und sich tatsaechlich vom Original unterscheiden. Unbekannte Dateien werden still uebersprungen.':'Only files that match a known entry and actually differ from the original are applied. Unknown files are silently skipped.',
'Hier erscheint nach einem Lauf die Zusammenfassung.':'The summary appears here after a run.',
'Mehrere PNG/WAV/JSON/CSV direkt auswaehlen':'Select several PNG/WAV/JSON/CSV files directly',
'ZIP wird komprimiert':'ZIP will be compressed',
'ZIP wird unkomprimiert gespeichert (Browser kann nicht packen)':'ZIP is stored uncompressed (browser cannot compress)',
'{0} Schritte':'{0} steps',
'Paket erstellen':'Create package',
'Paket einspielen':'Import package',
'Bericht':'Report',
'Paket wird erstellt ...':'Creating package ...',
'Paket wird gelesen ...':'Reading package ...',
'Paket wird eingespielt ...':'Importing package ...',
'Dateien werden gelesen ...':'Reading files ...',
'Nichts ausgewaehlt.':'Nothing selected.',
'Andere ROM':'Different ROM',
'Das Paket wurde aus einer anderen ROM erstellt. Trotzdem einspielen?':'The package was created from a different ROM. Import anyway?',
'Komplett-Paket gespeichert.':'Complete package saved.',
'Paket erstellt':'Package created',
'Paket eingespielt':'Package imported',
'Datei: {0}':'File: {0}',
'Groesse: {0} MB':'Size: {0} MB',
'Dauer: {0} s':'Duration: {0} s',
'Hinweise ({0}):':'Notes ({0}):',
'Keine Aenderung gegenueber der geladenen ROM gefunden.':'No change compared to the loaded ROM found.',
'{0}: {1} geaendert':'{0}: {1} changed',
'{0} PNG':'{0} PNG',
'{0} JSON':'{0} JSON',
'{0} WAV, rund {1} MB':'{0} WAV, about {1} MB',
'rund {0} PNG':'about {0} PNG',
'Fehler':'Error',
'Grafiken {0} / {1}':'Graphics {0} / {1}',
'Menue-Grafiken {0} / {1}':'Menu graphics {0} / {1}',
'Texturen {0} / {1}':'Textures {0} / {1}',
'Sounds {0} / {1}':'Sounds {0} / {1}',
'Texte {0} / {1}':'Texts {0} / {1}',
'Schriften gesichert':'Fonts saved',
'Karten gesichert':'Maps saved',
'Karten eingespielt':'Maps imported',
'Texte werden gesucht ...':'Searching texts ...',
'Samples werden gesucht ...':'Searching samples ...',
'Missionsdaten werden ausgewertet ...':'Analysing mission data ...',
'ZIP wird gepackt ...':'Packing ZIP ...',
'Schriften ...':'Fonts ...',
'Missionsdaten ...':'Mission data ...',
'Texte ...':'Texts ...',
'Samples ...':'Samples ...',
'bitte als indiziertes PNG speichern':'please save as an indexed PNG',
'Blatt muss {0} sein':'Sheet must be {0}',
'Farbstufe {0} - erlaubt sind {1}..{2}':'Colour level {0} - allowed are {1}..{2}',
'gehoert zu Insel {0}':'belongs to island {0}',
'falsche Kartengroesse':'wrong map size'
});
add('es', {
'Alle bearbeitbaren Daten der ROM auf einmal herausschreiben und genauso wieder einspielen - ohne jede Datei einzeln auszuwaehlen. Das Paket ist ein gewoehnliches ZIP; du kannst es entpacken, bearbeiten und wieder einpacken, solange die Dateinamen gleich bleiben.':'Exporta de una vez todos los datos editables de la ROM y vuelve a importarlos igual - sin elegir cada archivo. El paquete es un ZIP normal; puedes descomprimirlo, editarlo y volver a comprimirlo siempre que los nombres de archivo no cambien.',
'Je nach Auswahl dauert das eine halbe bis zwei Minuten und ergibt {0} bis {1} MB. Die ROM wird dabei nicht veraendert.':'Segun la seleccion tarda entre medio minuto y dos minutos y ocupa de {0} a {1} MB. La ROM no se modifica.',
'Es werden nur Dateien uebernommen, die zu einem bekannten Eintrag passen und sich tatsaechlich vom Original unterscheiden. Unbekannte Dateien werden still uebersprungen.':'Solo se aplican los archivos que coinciden con una entrada conocida y que realmente difieren del original. Los archivos desconocidos se omiten sin aviso.',
'Hier erscheint nach einem Lauf die Zusammenfassung.':'Aqui aparece el resumen despues de cada ejecucion.',
'Mehrere PNG/WAV/JSON/CSV direkt auswaehlen':'Elegir varios PNG/WAV/JSON/CSV directamente',
'ZIP wird komprimiert':'El ZIP se comprimira',
'ZIP wird unkomprimiert gespeichert (Browser kann nicht packen)':'El ZIP se guarda sin comprimir (el navegador no puede comprimir)',
'{0} Schritte':'{0} pasos',
'Paket erstellen':'Crear paquete',
'Paket einspielen':'Importar paquete',
'Bericht':'Informe',
'Paket wird erstellt ...':'Creando paquete ...',
'Paket wird gelesen ...':'Leyendo paquete ...',
'Paket wird eingespielt ...':'Importando paquete ...',
'Dateien werden gelesen ...':'Leyendo archivos ...',
'Nichts ausgewaehlt.':'No hay nada seleccionado.',
'Andere ROM':'Otra ROM',
'Das Paket wurde aus einer anderen ROM erstellt. Trotzdem einspielen?':'El paquete se creo a partir de otra ROM. Importar de todos modos?',
'Komplett-Paket gespeichert.':'Paquete completo guardado.',
'Paket erstellt':'Paquete creado',
'Paket eingespielt':'Paquete importado',
'Datei: {0}':'Archivo: {0}',
'Groesse: {0} MB':'Tamano: {0} MB',
'Dauer: {0} s':'Duracion: {0} s',
'Hinweise ({0}):':'Notas ({0}):',
'Keine Aenderung gegenueber der geladenen ROM gefunden.':'No se encontraron cambios respecto a la ROM cargada.',
'{0}: {1} geaendert':'{0}: {1} cambiados',
'{0} PNG':'{0} PNG',
'{0} JSON':'{0} JSON',
'{0} WAV, rund {1} MB':'{0} WAV, unos {1} MB',
'rund {0} PNG':'unos {0} PNG',
'Fehler':'Error',
'Grafiken {0} / {1}':'Graficos {0} / {1}',
'Menue-Grafiken {0} / {1}':'Graficos de menu {0} / {1}',
'Texturen {0} / {1}':'Texturas {0} / {1}',
'Sounds {0} / {1}':'Sonidos {0} / {1}',
'Texte {0} / {1}':'Textos {0} / {1}',
'Schriften gesichert':'Fuentes guardadas',
'Karten gesichert':'Mapas guardados',
'Karten eingespielt':'Mapas importados',
'Texte werden gesucht ...':'Buscando textos ...',
'Samples werden gesucht ...':'Buscando muestras ...',
'Missionsdaten werden ausgewertet ...':'Analizando datos de misiones ...',
'ZIP wird gepackt ...':'Comprimiendo ZIP ...',
'Schriften ...':'Fuentes ...',
'Missionsdaten ...':'Datos de misiones ...',
'Texte ...':'Textos ...',
'Samples ...':'Muestras ...',
'bitte als indiziertes PNG speichern':'guardalo como PNG indexado',
'Blatt muss {0} sein':'La hoja debe medir {0}',
'Farbstufe {0} - erlaubt sind {1}..{2}':'Nivel de color {0} - se permiten {1}..{2}',
'gehoert zu Insel {0}':'pertenece a la isla {0}',
'falsche Kartengroesse':'tamano de mapa incorrecto'
});
add('fr', {
'Alle bearbeitbaren Daten der ROM auf einmal herausschreiben und genauso wieder einspielen - ohne jede Datei einzeln auszuwaehlen. Das Paket ist ein gewoehnliches ZIP; du kannst es entpacken, bearbeiten und wieder einpacken, solange die Dateinamen gleich bleiben.':'Exporter d\'un coup toutes les donnees modifiables de la ROM et les reimporter de la meme facon - sans choisir chaque fichier. Le paquet est un ZIP ordinaire ; tu peux le decompresser, le modifier et le recompresser tant que les noms de fichiers restent identiques.',
'Je nach Auswahl dauert das eine halbe bis zwei Minuten und ergibt {0} bis {1} MB. Die ROM wird dabei nicht veraendert.':'Selon la selection, cela prend d\'une demi-minute a deux minutes et produit de {0} a {1} Mo. La ROM n\'est pas modifiee.',
'Es werden nur Dateien uebernommen, die zu einem bekannten Eintrag passen und sich tatsaechlich vom Original unterscheiden. Unbekannte Dateien werden still uebersprungen.':'Seuls les fichiers qui correspondent a une entree connue et qui different reellement de l\'original sont appliques. Les fichiers inconnus sont ignores sans message.',
'Hier erscheint nach einem Lauf die Zusammenfassung.':'Le resume apparait ici apres chaque execution.',
'Mehrere PNG/WAV/JSON/CSV direkt auswaehlen':'Choisir directement plusieurs PNG/WAV/JSON/CSV',
'ZIP wird komprimiert':'Le ZIP sera compresse',
'ZIP wird unkomprimiert gespeichert (Browser kann nicht packen)':'Le ZIP est enregistre sans compression (le navigateur ne sait pas compresser)',
'{0} Schritte':'{0} etapes',
'Paket erstellen':'Creer le paquet',
'Paket einspielen':'Importer le paquet',
'Bericht':'Rapport',
'Paket wird erstellt ...':'Creation du paquet ...',
'Paket wird gelesen ...':'Lecture du paquet ...',
'Paket wird eingespielt ...':'Import du paquet ...',
'Dateien werden gelesen ...':'Lecture des fichiers ...',
'Nichts ausgewaehlt.':'Rien n\'est selectionne.',
'Andere ROM':'Autre ROM',
'Das Paket wurde aus einer anderen ROM erstellt. Trotzdem einspielen?':'Le paquet a ete cree a partir d\'une autre ROM. L\'importer quand meme ?',
'Komplett-Paket gespeichert.':'Paquet complet enregistre.',
'Paket erstellt':'Paquet cree',
'Paket eingespielt':'Paquet importe',
'Datei: {0}':'Fichier : {0}',
'Groesse: {0} MB':'Taille : {0} Mo',
'Dauer: {0} s':'Duree : {0} s',
'Hinweise ({0}):':'Remarques ({0}) :',
'Keine Aenderung gegenueber der geladenen ROM gefunden.':'Aucune modification trouvee par rapport a la ROM chargee.',
'{0}: {1} geaendert':'{0} : {1} modifies',
'{0} PNG':'{0} PNG',
'{0} JSON':'{0} JSON',
'{0} WAV, rund {1} MB':'{0} WAV, environ {1} Mo',
'rund {0} PNG':'environ {0} PNG',
'Fehler':'Erreur',
'Grafiken {0} / {1}':'Graphismes {0} / {1}',
'Menue-Grafiken {0} / {1}':'Graphismes de menu {0} / {1}',
'Texturen {0} / {1}':'Textures {0} / {1}',
'Sounds {0} / {1}':'Sons {0} / {1}',
'Texte {0} / {1}':'Textes {0} / {1}',
'Schriften gesichert':'Polices enregistrees',
'Karten gesichert':'Cartes enregistrees',
'Karten eingespielt':'Cartes importees',
'Texte werden gesucht ...':'Recherche des textes ...',
'Samples werden gesucht ...':'Recherche des samples ...',
'Missionsdaten werden ausgewertet ...':'Analyse des donnees de mission ...',
'ZIP wird gepackt ...':'Compression du ZIP ...',
'Schriften ...':'Polices ...',
'Missionsdaten ...':'Donnees de mission ...',
'Texte ...':'Textes ...',
'Samples ...':'Samples ...',
'bitte als indiziertes PNG speichern':'enregistre-le en PNG indexe',
'Blatt muss {0} sein':'La planche doit mesurer {0}',
'Farbstufe {0} - erlaubt sind {1}..{2}':'Niveau de couleur {0} - autorises : {1}..{2}',
'gehoert zu Insel {0}':'appartient a l\'ile {0}',
'falsche Kartengroesse':'mauvaise taille de carte'
});
add('it', {
'Alle bearbeitbaren Daten der ROM auf einmal herausschreiben und genauso wieder einspielen - ohne jede Datei einzeln auszuwaehlen. Das Paket ist ein gewoehnliches ZIP; du kannst es entpacken, bearbeiten und wieder einpacken, solange die Dateinamen gleich bleiben.':'Esporta in una volta tutti i dati modificabili della ROM e reimportali allo stesso modo - senza scegliere ogni file. Il pacchetto e un normale ZIP; puoi estrarlo, modificarlo e ricomprimerlo purche i nomi dei file restino uguali.',
'Je nach Auswahl dauert das eine halbe bis zwei Minuten und ergibt {0} bis {1} MB. Die ROM wird dabei nicht veraendert.':'A seconda della selezione ci vogliono da mezzo minuto a due minuti e si ottengono da {0} a {1} MB. La ROM non viene modificata.',
'Es werden nur Dateien uebernommen, die zu einem bekannten Eintrag passen und sich tatsaechlich vom Original unterscheiden. Unbekannte Dateien werden still uebersprungen.':'Vengono applicati solo i file che corrispondono a una voce nota e che differiscono davvero dall\'originale. I file sconosciuti vengono saltati senza avviso.',
'Hier erscheint nach einem Lauf die Zusammenfassung.':'Qui compare il riepilogo dopo ogni esecuzione.',
'Mehrere PNG/WAV/JSON/CSV direkt auswaehlen':'Scegli direttamente piu file PNG/WAV/JSON/CSV',
'ZIP wird komprimiert':'Lo ZIP verra compresso',
'ZIP wird unkomprimiert gespeichert (Browser kann nicht packen)':'Lo ZIP viene salvato non compresso (il browser non puo comprimere)',
'{0} Schritte':'{0} passi',
'Paket erstellen':'Crea pacchetto',
'Paket einspielen':'Importa pacchetto',
'Bericht':'Rapporto',
'Paket wird erstellt ...':'Creazione del pacchetto ...',
'Paket wird gelesen ...':'Lettura del pacchetto ...',
'Paket wird eingespielt ...':'Importazione del pacchetto ...',
'Dateien werden gelesen ...':'Lettura dei file ...',
'Nichts ausgewaehlt.':'Nessuna selezione.',
'Andere ROM':'Altra ROM',
'Das Paket wurde aus einer anderen ROM erstellt. Trotzdem einspielen?':'Il pacchetto e stato creato da un\'altra ROM. Importarlo comunque?',
'Komplett-Paket gespeichert.':'Pacchetto completo salvato.',
'Paket erstellt':'Pacchetto creato',
'Paket eingespielt':'Pacchetto importato',
'Datei: {0}':'File: {0}',
'Groesse: {0} MB':'Dimensione: {0} MB',
'Dauer: {0} s':'Durata: {0} s',
'Hinweise ({0}):':'Note ({0}):',
'Keine Aenderung gegenueber der geladenen ROM gefunden.':'Nessuna modifica rispetto alla ROM caricata.',
'{0}: {1} geaendert':'{0}: {1} modificati',
'{0} PNG':'{0} PNG',
'{0} JSON':'{0} JSON',
'{0} WAV, rund {1} MB':'{0} WAV, circa {1} MB',
'rund {0} PNG':'circa {0} PNG',
'Fehler':'Errore',
'Grafiken {0} / {1}':'Grafiche {0} / {1}',
'Menue-Grafiken {0} / {1}':'Grafica dei menu {0} / {1}',
'Texturen {0} / {1}':'Texture {0} / {1}',
'Sounds {0} / {1}':'Suoni {0} / {1}',
'Texte {0} / {1}':'Testi {0} / {1}',
'Schriften gesichert':'Font salvati',
'Karten gesichert':'Mappe salvate',
'Karten eingespielt':'Mappe importate',
'Texte werden gesucht ...':'Ricerca dei testi ...',
'Samples werden gesucht ...':'Ricerca dei campioni ...',
'Missionsdaten werden ausgewertet ...':'Analisi dei dati delle missioni ...',
'ZIP wird gepackt ...':'Compressione dello ZIP ...',
'Schriften ...':'Font ...',
'Missionsdaten ...':'Dati delle missioni ...',
'Texte ...':'Testi ...',
'Samples ...':'Campioni ...',
'bitte als indiziertes PNG speichern':'salvalo come PNG indicizzato',
'Blatt muss {0} sein':'Il foglio deve essere {0}',
'Farbstufe {0} - erlaubt sind {1}..{2}':'Livello di colore {0} - consentiti {1}..{2}',
'gehoert zu Insel {0}':'appartiene all\'isola {0}',
'falsche Kartengroesse':'dimensione della mappa errata'
});
add('en', { '{0} geaendert':'{0} changed', 'Dauer':'Duration' });
add('es', { '{0} geaendert':'{0} cambiados', 'Dauer':'Duracion' });
add('fr', { '{0} geaendert':'{0} modifies', 'Dauer':'Duree' });
add('it', { '{0} geaendert':'{0} modificati', 'Dauer':'Durata' });

})(GTAS.LANGDATA);
