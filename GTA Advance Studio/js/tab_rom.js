/* GTA Advance Studio - ROM & Projekt */
(function (global) {
'use strict';
var G = global.GTAS, el = G.el, App = G.App;

/* ------------------------------------------------------------ Projektdatei */
G.saveProject = function () {
  var rom = App.rom;
  if (!rom) { G.toast('Keine ROM geladen.', 'err'); return; }
  G.busy('Projekt wird geschrieben ...');
  setTimeout(function () {
    var runs = rom.diff();
    var proj = {
      format: 'gta_advance_studio/1',
      created: new Date().toISOString(),
      name: App.project.name,
      notes: App.project.notes,
      rom_sha1: rom.sha1,
      rom_name: rom.name,
      rom_size: rom.data.length,
      orig_size: rom.origSize,
      patches: runs.map(function (r) { return { off: r.off, data: G.b64enc(r.bytes) }; })
    };
    var txt = JSON.stringify(proj);
    G.busy(false);
    G.download((App.project.name || 'projekt').replace(/[^\w\- ]+/g, '_') + '.gtastudio', new TextEncoder().encode(txt), 'application/json');
    G.toast('Projekt gespeichert (' + runs.length + ' Aenderungsbloecke).');
  }, 30);
};

G.loadProject = async function (file) {
  if (!App.rom) { G.toast('Bitte zuerst die Original-ROM laden, dann das Projekt.', 'err'); return; }
  try {
    var txt = await G.readFileText(file);
    var p = JSON.parse(txt);
    if (p.format !== 'gta_advance_studio/1') throw new Error('Unbekanntes Projektformat');
    var rom = App.rom;
    if (p.rom_sha1 !== rom.sha1) {
      var go = await G.confirmBox('ROM passt nicht', 'Das Projekt wurde mit einer anderen ROM erstellt. Trotzdem anwenden?');
      if (!go) return;
    }
    rom.data = rom.base.slice();
    if (p.rom_size > rom.data.length) rom.expandTo(p.rom_size);
    p.patches.forEach(function (r) {
      var b = G.b64dec(r.data);
      if (r.off + b.length > rom.data.length) rom.expandTo(r.off + b.length);
      rom.data.set(b, r.off);
    });
    App.project.name = p.name || 'Projekt';
    App.project.notes = p.notes || '';
    G.cache = {};
    G.toast('Projekt geladen: ' + p.patches.length + ' Aenderungsbloecke.');
    G.selectTab('rom');
  } catch (e) { G.toast('Projekt-Fehler: ' + e.message, 'err'); }
};

/* ------------------------------------------------------------ IPS-Patch */
G.saveIPS = async function () {
  var rom = App.rom;
  if (!rom) { G.toast('Keine ROM geladen.', 'err'); return; }
  if (!rom.changedBytes()) { G.toast('Keine Aenderungen - ein Patch waere leer.', 'warn'); return; }
  G.busy('IPS-Patch wird erstellt ...');
  await G.yieldUI();
  try {
    /* Kopf-Pruefsumme wie beim ROM-Export mit in den Patch nehmen */
    rom.fixHeader();
    var res = G.buildIPS(rom.base, rom.data);
    G.busyProgress(0.6, 'Patch wird gegengeprueft ...');
    await G.yieldUI();
    var back = G.applyIPS(rom.base, res.patch);
    var ok = back.length === rom.data.length;
    if (ok) for (var i = 0; i < back.length; i++) if (back[i] !== rom.data[i]) { ok = false; break; }
    G.busy(false);
    if (!ok) { G.toast('Selbstkontrolle fehlgeschlagen - es wurde nichts geschrieben.', 'err'); return; }
    var base = (App.project.name || rom.name.replace(/\.(gba|bin)$/i, '')).replace(/[^\w\- ]+/g, '_');
    G.download(base + '.ips', res.patch, 'application/octet-stream');
    G.toast('IPS-Patch gespeichert: ' + res.records + ' Datensaetze, '
      + (res.bytes / 1024).toFixed(1) + ' KB' + (res.wide ? ' (IPS32, weil die ROM groesser als 16 MB ist)' : '') + '.');
  } catch (e) {
    G.busy(false);
    G.toast('Fehler: ' + e.message, 'err');
  }
};

/* ------------------------------------------------------------------- Ansicht */
G.registerTab({
  id: 'rom', label: 'ROM & Projekt', icon: '■', needsRom: true,
  render: function (v) {
    var rom = App.rom;
    v.appendChild(el('h2', { text: 'ROM & Projekt' }));
    v.appendChild(el('p', { class: 'lead', text: 'Zustand der geladenen ROM, Projektverwaltung und Ausgabe der fertigen Moddatei.' }));

    var known = rom.sha1 === G.EXPECTED_SHA1;
    var kv = el('div', { class: 'kv' });
    function add(k, val, cls) { kv.appendChild(el('b', { text: k })); kv.appendChild(el('span', { class: cls || 'mono', text: val })); }
    add('Datei', rom.name, '');
    add('Interner Titel', rom.title() + '  (' + rom.code() + ')');
    add('Groesse', (rom.data.length / 1048576).toFixed(2) + ' MB  (' + rom.data.length.toLocaleString('de-DE') + ' Bytes)');
    add('SHA-1', rom.sha1);
    add('Erkannt als', known ? 'Grand Theft Auto Advance (Europe) (En,Fr,De,Es,It)' : 'unbekannte Fassung - Adressen koennen abweichen', known ? '' : 'warn');
    add('Kopf-Pruefsumme', rom.headerOk() ? 'gueltig' : 'ungueltig (wird beim Speichern korrigiert)', '');
    add('Geaenderte Bytes', rom.changedBytes().toLocaleString('de-DE'), '');
    var fs = rom.freeStart();
    add('Freier Bereich', G.hx(fs) + ' bis ' + G.hx(rom.data.length) + '  (' + (((rom.data.length - fs) / 1024) | 0) + ' KB)');
    v.appendChild(el('div', { class: 'card' }, [el('h4', { text: 'ROM-Informationen' }), kv]));

    /* Projekt */
    var nameIn = el('input', { type: 'text', value: App.project.name, style: 'width:100%',
      oninput: function () { App.project.name = this.value; } });
    var notesIn = el('textarea', { style: 'width:100%;min-height:70px', placeholder: 'Notizen zum Mod ...',
      oninput: function () { App.project.notes = this.value; } });
    notesIn.value = App.project.notes;
    v.appendChild(el('div', { class: 'card' }, [
      el('h4', { text: 'Projekt' }),
      el('div', { class: 'row' }, [el('span', { class: 'mut', text: 'Name' }), nameIn]),
      notesIn,
      el('div', { class: 'row', style: 'margin-top:8px' }, [
        el('button', { class: 'primary', text: 'Projekt speichern', onclick: G.saveProject }),
        el('button', { text: 'Projekt oeffnen', onclick: async function () {
          var f = await G.pickFile('.gtastudio,.json'); if (f) G.loadProject(f);
        } }),
        el('span', { class: 'hint', text: 'Die Projektdatei enthaelt nur deine Aenderungen - die ROM selbst wird nicht mitgespeichert.' })
      ])
    ]));

    /* IPS-Patch */
    v.appendChild(el('div', { class: 'card' }, [
      el('h4', { text: 'Mod als IPS-Patch' }),
      el('p', { class: 'hint', text: 'Ein IPS-Patch enthaelt nur deine Aenderungen, nicht das Spiel selbst. '
        + 'So kannst du einen Mod weitergeben, ohne die ROM mitzuliefern - andere wenden den Patch auf ihre '
        + 'eigene Kopie an.' }),
      el('div', { class: 'row', style: 'margin-top:8px' }, [
        el('button', { class: 'primary', text: 'IPS-Patch erstellen', onclick: G.saveIPS }),
        el('span', { class: 'hint', text: 'Prueft sich selbst: der Patch wird sofort auf die Original-ROM '
          + 'angewendet und mit deinem Stand verglichen.' })
      ])
    ]));

    /* Ausgabe */
    v.appendChild(el('div', { class: 'card' }, [
      el('h4', { text: 'Fertige ROM' }),
      el('div', { class: 'row' }, [
        el('button', { class: 'primary', text: 'ROM speichern (.gba)', onclick: G.saveRom }),
        el('button', { text: 'Auf 32 MB erweitern', onclick: async function () {
          if (rom.data.length >= 0x2000000) { G.toast('Die ROM ist bereits 32 MB gross.'); return; }
          var ok = await G.confirmBox('ROM erweitern',
            'Die ROM wird auf 32 MB vergroessert. Das schafft Platz fuer grosse Umbauten, '
            + 'setzt beim Spielen auf echter Hardware aber ein 32-MB-faehiges Modul voraus. Emulatoren koennen das immer.');
          if (!ok) return;
          rom.expandTo(0x2000000);
          G.toast('ROM auf 32 MB erweitert.'); G.refreshTab(); G.updateStatus();
        } }),
        el('button', { class: 'danger', text: 'Alle Aenderungen verwerfen', onclick: async function () {
          var ok = await G.confirmBox('Zuruecksetzen', 'Saemtliche Aenderungen gehen verloren. Fortfahren?');
          if (!ok) return;
          rom.resetAll(); G.cache = {}; G.toast('Auf Originalzustand zurueckgesetzt.'); G.refreshTab(); G.updateStatus();
        } })
      ]),
      el('p', { class: 'hint', style: 'margin:8px 0 0',
        text: 'Beim Speichern wird die Kopf-Pruefsumme automatisch neu berechnet. Teste die Ausgabe vor dem Flashen in einem Emulator.' })
    ]));

    /* Aenderungsuebersicht */
    var box = el('div', { class: 'card' }, [el('h4', { text: 'Aenderungen im Detail' })]);
    var btn = el('button', { text: 'Aenderungsliste berechnen', onclick: function () {
      var runs = rom.diff();
      G.clear(box); box.appendChild(el('h4', { text: 'Aenderungen im Detail' }));
      if (!runs.length) { box.appendChild(el('p', { class: 'hint', text: 'Keine Aenderungen gegenueber dem Original.' })); return; }
      var t = el('table', { class: 'tbl' });
      t.appendChild(el('tr', {}, [el('th', { text: 'Offset' }), el('th', { text: 'Laenge' }), el('th', { text: 'Bereich' })]));
      runs.slice(0, 500).forEach(function (r) {
        t.appendChild(el('tr', {}, [
          el('td', { class: 'mono', text: G.hx(r.off) }),
          el('td', { text: r.len.toLocaleString('de-DE') + ' B' }),
          el('td', { class: 'mut', text: G.regionName(r.off) })
        ]));
      });
      box.appendChild(t);
      if (runs.length > 500) box.appendChild(el('p', { class: 'hint', text: '... und ' + (runs.length - 500) + ' weitere Bloecke' }));
    } });
    box.appendChild(btn);
    v.appendChild(box);
  }
});

/* Grobe Zuordnung von Offsets zu Bereichen - hilft bei der Orientierung */
var REGIONS = [
  [0x000000, 0x071E1C, 'Programmcode'],
  [0x071E1C, 0x330000, 'Sound-Samples (PCM)'],
  [0x330000, 0x3F0000, 'Texte & Bezeichner'],
  [0x3F0000, 0x800000, 'Welt-Texturen (8bpp)'],
  [0x800000, 0x8D0000, 'Grafik/Weltdaten'],
  [0x8D0000, 0xA80000, 'Kartendaten (3 Level)'],
  [0xA80000, 0xC80000, 'Sprites'],
  [0xC80000, 0xCC0000, 'Tabellen & Sound-Index'],
  [0xCC0000, 0xD50000, 'Missions- und Objektdaten'],
  [0xD50000, 0xEC0000, 'Modell-/Blockdaten'],
  [0xEC0000, 0xFD0000, 'Verweistabellen'],
  [0xFD0000, 0x2000000, 'freier Bereich / neue Daten']
];
G.regionName = function (off) {
  for (var i = 0; i < REGIONS.length; i++) if (off >= REGIONS[i][0] && off < REGIONS[i][1]) return REGIONS[i][2];
  return '-';
};
G.REGIONS = REGIONS;

})(window);
