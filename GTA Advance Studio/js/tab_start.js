/* GTA Advance Studio - Startseite */
(function (global) {
'use strict';
var G = global.GTAS, el = G.el;

G.registerTab({
  id: 'start', label: 'Start', icon: '⌂',
  render: function (v) {
    var hero = el('div', { class: 'hero' }, [
      el('h1', { text: 'GTA Advance Studio' }),
      el('p', { class: 'lead', text: 'Vollstaendiger Mod-Baukasten fuer Grand Theft Auto Advance (Game Boy Advance). '
        + 'Grafiken, Karten, Texte, Sounds, Missionsdaten - alles in einem Programm, ohne Installation.' }),
      el('div', { class: 'row' }, [
        el('button', { class: 'primary', text: 'ROM laden', onclick: async function () {
          var f = await G.pickFile('.gba,.bin'); if (f) G.loadRomFile(f);
        } }),
        el('button', { text: 'Projekt oeffnen', onclick: async function () {
          var f = await G.pickFile('.gtastudio,.json'); if (f) G.loadProject(f);
        } }),
        el('span', { class: 'hint', text: 'oder Datei einfach ins Fenster ziehen' })
      ])
    ]);
    v.appendChild(hero);

    v.appendChild(el('h3', { text: 'Was du bearbeiten kannst' }));
    var feats = [
      ['☷ Komplett-Paket', 'Alle Daten auf einmal als ZIP heraus- und wieder hineinschreiben - rund 3.550 Dateien in neun Bereichen, ohne jede einzeln auszuwaehlen.'],
      ['▦ Sprites', 'Rund 2.500 Sprites (Autos, Figuren, Effekte) ansehen, als PNG exportieren und wieder einspielen. Verschiebt Daten automatisch, wenn sie groesser werden.'],
      ['✦ Menue-Grafiken', 'Titelbild, Logo mit allen Animationsstufen, Zwischensequenzen, Portraits, Briefing-Tafeln und Symbole - 116 Bilder aus Kacheln, Tilemap und Palette.'],
      ['▣ Vollbilder (Raeume)', 'Die zehn begehbaren 240x160-Innenraeume mit 128-Farben-Palette.'],
      ['▤ Welt-Texturen', 'Die 640 unkomprimierten 8-Bit-Texturen der Stadt - Daecher, Fassaden, Strassenbelag - in den echten Farben der gefundenen Weltpalette.'],
      ['A Schriften', 'HUD- und Textschrift als 8x8-Glyphen: A-Z, Ziffern, Satzzeichen und Akzentbuchstaben ansehen, exportieren und austauschen.'],
      ['◰ Karten-Editor', 'Alle drei Inseln mit fuenf Ansichten - die Gebaeudetypen-Ansicht faerbt Strasse, Gehweg, Gebaeude und Hochstrasse ein. Mit Uebersichtskarte, Zell-Inspektor und nach Typ gruppierter Kachelauswahl.'],
      ['⌸ Text-Editor', 'Saemtliche Spieltexte in fuenf Sprachen (EN/ES/FR/IT/DE) inklusive Menue-Strings, mit automatischer Neuverlinkung bei laengeren Texten.'],
      ['♪ Sound', 'Alle PCM-Samples anhoeren, als WAV exportieren und eigene WAV-Dateien importieren.'],
      ['⚑ Missionen und Objekte', 'Die benannten Spiel-Datensaetze (Missionen, Instanzen, Ereignisse, Dialogverweise) durchsuchen und Werte aendern.'],
      ['⌗ Hex-Editor', 'Rohzugriff auf jede Stelle der ROM, mit Lesezeichen aller bekannten Strukturen.']
    ];
    var fg = el('div', { class: 'feat' });
    feats.forEach(function (f) { fg.appendChild(el('div', { class: 'f' }, [el('b', { text: f[0] }), el('span', { text: f[1] })])); });
    v.appendChild(fg);

    v.appendChild(el('h3', { text: 'So gehst du vor' }));
    var st = el('ol', { class: 'steps' });
    ['ROM laden (deine eigene, legal erstellte Kopie von "Grand Theft Auto Advance").',
     'Im linken Menue den Bereich waehlen und Aenderungen vornehmen.',
     'Unter "ROM & Projekt" regelmaessig das Projekt speichern - es enthaelt nur deine Aenderungen.',
     'Mit "ROM speichern" die fertige .gba erzeugen und im Emulator (z. B. mGBA) testen.'
    ].forEach(function (t) { st.appendChild(el('li', { text: t })); });
    v.appendChild(st);

    v.appendChild(el('div', { class: 'card warnc' }, [
      el('b', { text: 'Wichtig: ' }),
      el('span', { text: 'Das Studio veraendert nie deine Originaldatei. Alle Aenderungen leben im Speicher, '
        + 'bis du sie als neue ROM oder als Projektdatei sicherst. Teste eine gemoddete ROM immer erst im Emulator.' })
    ]));
  }
});
})(window);
