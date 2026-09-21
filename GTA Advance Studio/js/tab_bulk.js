/* GTA Advance Studio - Komplett-Paket
   Exportiert saemtliche bearbeitbaren Daten der ROM in ein einziges ZIP und
   spielt ein solches Paket in einem Rutsch wieder ein. */
(function (global) {
'use strict';
var G = global.GTAS, el = G.el, App = G.App;
G.cache = G.cache || {};

var CATS = [
  { id: 'sprites',   name: 'Sprites',              dir: 'sprites/',   hint: 'rund 2.475 PNG' },
  { id: 'screens',   name: 'Vollbilder (Raeume)',  dir: 'vollbilder/', hint: '10 PNG' },
  { id: 'menu',      name: 'Menue-Grafiken',       dir: 'menue/',     hint: '116 PNG inkl. Titelbild und Logo' },
  { id: 'texturen',  name: 'Welt-Texturen',        dir: 'texturen/',  hint: '640 PNG' },
  { id: 'schriften', name: 'Schriften',            dir: 'schriften/', hint: '3 PNG - HUD- und Textschrift' },
  { id: 'karten',    name: 'Karten',               dir: 'karten/',    hint: '3 JSON' },
  { id: 'texte',     name: 'Texte',                dir: 'texte/',     hint: '1 CSV, alle Sprachen' },
  { id: 'sounds',    name: 'Sounds',               dir: 'sounds/',    hint: '282 WAV, rund 2,5 MB' },
  { id: 'missionen', name: 'Missionsdaten',        dir: 'missionen/', hint: 'je Tabelle eine CSV' }
];

function csvEscape(s) { return '"' + String(s).replace(/"/g, '""') + '"'; }

/* Vergleicht zwei Kartenstaende - nur bei echtem Unterschied wird geschrieben */
function mapGleich(a, b) {
  function arrEq(x, y) {
    if (!y || x.length !== y.length) return false;
    for (var i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
    return true;
  }
  function listEq(x, y) {
    if (!y || x.length !== y.length) return false;
    for (var i = 0; i < x.length; i++) for (var k = 0; k < x[i].length; k++) if (x[i][k] !== y[i][k]) return false;
    return true;
  }
  return arrEq(a.cells, b.cells) && arrEq(a.mask, b.mask) && arrEq(a.hmap, b.hmap)
    && listEq(a.objects, b.objects) && listEq(a.zones, b.zones);
}

/* ---------------------------------------------------------------- Export */
async function exportAll(sel, onStep) {
  var rom = App.rom, z = new G.ZipWriter();
  var manifest = {
    format: 'gta_advance_studio_paket/1',
    created: new Date().toISOString(),
    rom_sha1: rom.sha1, rom_size: rom.data.length,
    kategorien: {}
  };

  if (sel.sprites || sel.screens) {
    await onStep('Grafiken werden gesucht ...', 0);
    var scan = await G.ensureGfxScan();
    var kinds = [];
    if (sel.sprites) kinds.push(['sprite', 'sprites/']);
    if (sel.screens) kinds.push(['screen', 'vollbilder/']);
    for (var ki = 0; ki < kinds.length; ki++) {
      var kind = kinds[ki][0], dir = kinds[ki][1];
      var list = scan.assets.filter(function (a) { return a.kind === kind; });
      for (var i = 0; i < list.length; i++) {
        var a = list[i], px = G.assetCanvasPx(a);
        if (!px) continue;
        z.add(dir + a.id + '_' + a.dims + '.png',
          G.pngWriteIndexed(px.px, px.w, px.h, G.gfxPalOf(a), a.kind === 'sprite'));
        if ((i & 63) === 0) await onStep(dir + ' ' + i + ' / ' + list.length, i / list.length);
      }
      manifest.kategorien[kind === 'sprite' ? 'sprites' : 'screens'] = list.length;
    }
  }

  if (sel.menu) {
    var ml = G.menuScan(rom);
    for (var mi = 0; mi < ml.length; mi++) {
      var r = ml[mi];
      z.add('menue/' + G.menuFileName(r),
        G.pngWriteIndexed(G.menuPixels(rom.data, r), r.px, r.py, G.menuPal(rom.data, r), true));
      if ((mi & 15) === 0) await onStep('Menue-Grafiken ' + mi + ' / ' + ml.length, mi / ml.length);
    }
    manifest.kategorien.menu = ml.length;
  }

  if (sel.texturen) {
    var tl = G.scanTextures(rom), gray = G.grayPal(256);
    for (var ti = 0; ti < tl.length; ti++) {
      var t = tl[ti];
      z.add('texturen/' + t.id + '_' + t.dim + 'x' + t.dim + '.png',
        G.pngWriteIndexed(rom.data.subarray(t.off, t.off + t.size), t.dim, t.dim, gray, false));
      if ((ti & 63) === 0) await onStep('Texturen ' + ti + ' / ' + tl.length, ti / tl.length);
    }
    manifest.kategorien.texturen = tl.length;
  }

  if (sel.schriften) {
    var fl2 = G.findFonts(rom);
    fl2.forEach(function (f) {
      var sh = G.fontSheet(rom.data, f, 16);
      z.add('schriften/' + f.id + '_' + f.count + 'zeichen.png',
        G.pngWriteIndexed(sh.px, sh.w, sh.h, G.fontPal(), false));
    });
    manifest.kategorien.schriften = fl2.length;
    await onStep('Schriften gesichert', 1);
  }

  if (sel.karten) {
    for (var lv = 1; lv <= 3; lv++) {
      var mm = G.mapReadLevel(rom, lv);
      var obj = {
        format: 'gta_adv_map/2', level: lv, w: mm.w, h: mm.h, rom_sha1: rom.sha1,
        cells: G.b64enc(new Uint8Array(mm.cells.buffer, mm.cells.byteOffset, mm.cells.byteLength)),
        mask: G.b64enc(mm.mask), layerB: G.b64enc(mm.hmap),
        objects: mm.objects, zones: mm.zones
      };
      z.add('karten/insel' + lv + '.json', new TextEncoder().encode(JSON.stringify(obj)));
    }
    manifest.kategorien.karten = 3;
    await onStep('Karten gesichert', 1);
  }

  if (sel.texte) {
    await onStep('Texte werden gesucht ...', 0);
    var db = await G.textScan(rom, function (f, t) { onStep(t || 'Texte ...', f); });
    var rows = ['offset;sprache;gruppe;platz;text'];
    db.list.forEach(function (s) {
      rows.push(G.hex(s.off, 6) + ';' + (s.lang || '') + ';' + (s.group || '') + ';' + s.slot + ';' + csvEscape(s.text));
    });
    z.add('texte/texte.csv', new TextEncoder().encode('﻿' + rows.join('\r\n')));
    manifest.kategorien.texte = db.list.length;
  }

  if (sel.sounds) {
    await onStep('Samples werden gesucht ...', 0);
    var snd = await G.soundScan(rom, function (f, t) { onStep(t || 'Samples ...', f); });
    for (var si = 0; si < snd.list.length; si++) {
      var s2 = snd.list[si];
      z.add('sounds/' + s2.id + '_' + s2.rate + 'Hz.wav', G.wav.toWav(rom.data, s2));
      if ((si & 15) === 0) await onStep('Sounds ' + si + ' / ' + snd.list.length, si / snd.list.length);
    }
    manifest.kategorien.sounds = snd.list.length;
  }

  if (sel.missionen) {
    await onStep('Missionsdaten werden ausgewertet ...', 0);
    var mis = await G.missionTables();
    mis.tables.forEach(function (T, idx) {
      var head = ['nr', 'name', 'offset'];
      for (var f = 0; f < T.stride; f += 4) head.push('+' + f);
      var lines = [head.join(';')];
      T.recs.forEach(function (rr) {
        var row = [rr.i, rr.name, G.hex(rr.off, 6)];
        for (var f2 = 0; f2 < T.stride; f2 += 4) row.push('0x' + G.hex(G.u32(rom.data, rr.off + f2), 8));
        lines.push(row.join(';'));
      });
      z.add('missionen/' + ('0' + idx).slice(-2) + '_' + T.prefix + '_' + G.hex(T.base, 6) + '.csv',
        new TextEncoder().encode('﻿' + lines.join('\r\n')));
    });
    manifest.kategorien.missionen = mis.tables.length;
  }

  manifest.dateien = z.count();
  z.add('manifest.json', new TextEncoder().encode(JSON.stringify(manifest, null, 1)));
  z.add('LIESMICH.txt', new TextEncoder().encode(
    'GTA Advance Studio - Komplett-Paket\r\n\r\n'
    + 'Dateinamen nicht aendern: das Studio ordnet die Dateien beim Import\r\n'
    + 'ueber die Kennung im Namen zu (z. B. spr_a827e0, menu_c7a5fc, tex_3f0218, snd_071e1c).\r\n'
    + 'Bildgroessen beibehalten. Neue Dateien hinzufuegen bringt nichts - es werden\r\n'
    + 'nur Dateien uebernommen, die zu einem bekannten Eintrag passen.\r\n\r\n'
    + 'Zum Einspielen: Studio oeffnen, ROM laden, "Komplett-Paket" -> "Paket einspielen".\r\n'));

  await onStep('ZIP wird gepackt ...', 0);
  return await z.buildAsync(function (f) { return onStep('ZIP wird gepackt ...', f); });
}

/* ---------------------------------------------------------------- Import */
async function importAll(files, sel, onStep) {
  var rom = App.rom, rep = [], counts = {}, alloc = new G.Allocator(rom, false);
  function note(cat, msg) { rep.push('[' + cat + '] ' + msg); }
  function bump(cat) { counts[cat] = (counts[cat] || 0) + 1; }

  var names = [];
  files.forEach(function (_, k) { names.push(k); });

  /* --- Grafiken (Sprites und Vollbilder) --- */
  if (sel.sprites || sel.screens) {
    var gfxNames = names.filter(function (n) { return /(^|\/)(spr|scr)_[0-9a-f]{6}/i.test(n) && /\.png$/i.test(n); });
    if (gfxNames.length) {
      await onStep('Grafiken werden gesucht ...', 0);
      var scan = await G.ensureGfxScan();
      var byId = {};
      scan.assets.forEach(function (a) { byId[a.id] = a; });
      for (var i = 0; i < gfxNames.length; i++) {
        var n = gfxNames[i], mm = /((?:spr|scr)_[0-9a-f]{6})/i.exec(n);
        var a = byId[mm[1].toLowerCase()];
        if (!a) continue;
        if (a.kind === 'sprite' && !sel.sprites) continue;
        if (a.kind === 'screen' && !sel.screens) continue;
        try {
          var res = await G.importPngToAsset(a, files.get(n), { alloc: alloc });
          if (res.changed) { bump(a.kind === 'sprite' ? 'sprites' : 'screens'); }
        } catch (e) { note('Grafik', n + ': ' + e.message); }
        if ((i & 31) === 0) await onStep('Grafiken ' + i + ' / ' + gfxNames.length, i / gfxNames.length);
      }
    }
  }

  /* --- Menue-Grafiken --- */
  if (sel.menu) {
    var menuNames = names.filter(function (n) { return /menu_[0-9a-f]{6}/i.test(n) && /\.png$/i.test(n); });
    if (menuNames.length) {
      var ml = G.menuScan(rom);
      for (var j = 0; j < menuNames.length; j++) {
        var mn = menuNames[j], r2 = G.menuMatch(ml, mn);
        if (!r2) continue;
        try {
          var rr = G.menuImportPng(rom, r2, files.get(mn), false, alloc);
          if (!rr.unchanged) bump('menu');
        } catch (e) { note('Menue', mn + ': ' + e.message); }
        if ((j & 7) === 0) await onStep('Menue-Grafiken ' + j + ' / ' + menuNames.length, j / menuNames.length);
      }
    }
  }

  /* --- Welt-Texturen --- */
  if (sel.texturen) {
    var texNames = names.filter(function (n) { return /tex_[0-9a-f]{6}/i.test(n) && /\.png$/i.test(n); });
    if (texNames.length) {
      var tl = G.scanTextures(rom), tById = {};
      tl.forEach(function (t) { tById[t.id] = t; });
      for (var k = 0; k < texNames.length; k++) {
        var tn = texNames[k], tk = /(tex_[0-9a-f]{6})/i.exec(tn), t2 = tById[tk[1].toLowerCase()];
        if (!t2) continue;
        try {
          var png = G.pngRead(files.get(tn));
          if (png.w !== t2.dim || png.h !== t2.dim) throw new Error('Groesse ' + png.w + 'x' + png.h + ', erwartet ' + t2.dim + 'x' + t2.dim);
          if (png.mode !== 'P') throw new Error('bitte als indiziertes PNG speichern');
          var changed = false;
          for (var p2 = 0; p2 < t2.size; p2++) if (rom.data[t2.off + p2] !== png.idx[p2]) { changed = true; break; }
          if (changed) { rom.data.set(png.idx.subarray(0, t2.size), t2.off); bump('texturen'); }
        } catch (e) { note('Textur', tn + ': ' + e.message); }
        if ((k & 63) === 0) await onStep('Texturen ' + k + ' / ' + texNames.length, k / texNames.length);
      }
    }
  }

  /* --- Schriften --- */
  if (sel.schriften) {
    var fontNames = names.filter(function (n) { return /font_[0-9a-f]{6}/i.test(n) && /\.png$/i.test(n); });
    if (fontNames.length) {
      await onStep('Schriften ...', 0);
      var fonts = G.findFonts(rom), fById = {};
      fonts.forEach(function (f) { fById[f.id] = f; });
      fontNames.forEach(function (fn) {
        var fk = /(font_[0-9a-f]{6})/i.exec(fn), f2 = fById[fk[1].toLowerCase()];
        if (!f2) return;
        try {
          var png2 = G.pngRead(files.get(fn));
          var sh2 = G.fontSheet(rom.data, f2, 16);
          if (png2.w !== sh2.w || png2.h !== sh2.h) throw new Error('Blatt muss ' + sh2.w + 'x' + sh2.h + ' sein');
          var idx2 = G.pngToIndices(png2, { w: sh2.w, h: sh2.h }, G.fontPal(), png2.mode !== 'P', function () {});
          var mx2 = 0; for (var q2 = 0; q2 < idx2.length; q2++) if (idx2[q2] > mx2) mx2 = idx2[q2];
          if (mx2 > 15) throw new Error('Farbstufe ' + mx2 + ' - erlaubt sind 0..15');
          if (G.fontSheetToRom(rom, f2, idx2, 16)) { bump('schriften'); G.cache.fonts = null; }
        } catch (e) { note('Schrift', fn + ': ' + e.message); }
      });
    }
  }

  /* --- Karten --- */
  if (sel.karten) {
    for (var lv = 1; lv <= 3; lv++) {
      var kn = names.filter(function (n) { return new RegExp('insel' + lv + '\\.json$', 'i').test(n); })[0];
      if (!kn) continue;
      try {
        var jj = JSON.parse(new TextDecoder().decode(files.get(kn)));
        if (jj.level !== lv) throw new Error('gehoert zu Insel ' + jj.level);
        var T = G.TILES[lv];
        if (jj.w !== T.w || jj.h !== T.h) throw new Error('falsche Kartengroesse');
        var nc = G.b64dec(jj.cells);
        var neu = {
          cells: new Uint16Array(nc.buffer, nc.byteOffset, nc.byteLength >> 1),
          mask: G.b64dec(jj.mask || jj.maskA), hmap: G.b64dec(jj.layerB),
          objects: jj.objects, zones: jj.zones
        };
        var alt = G.mapReadLevel(rom, lv);
        if (!mapGleich(alt, neu)) {
          G.mapWriteLevel(rom, lv, neu);
          delete G.cache['map' + lv];
          bump('karten');
        }
      } catch (e) { note('Karte', kn + ': ' + e.message); }
    }
    await onStep('Karten eingespielt', 1);
  }

  /* --- Texte --- */
  if (sel.texte) {
    var tn2 = names.filter(function (n) { return /texte\.csv$/i.test(n); })[0];
    if (tn2) {
      await onStep('Texte werden gesucht ...', 0);
      var db = await G.textScan(rom, function (f, t) { onStep(t || 'Texte ...', f); });
      var byOff = {};
      db.list.forEach(function (s) { byOff[G.hex(s.off, 6)] = s; });
      var lines = new TextDecoder().decode(files.get(tn2)).replace(/^﻿/, '').split(/\r?\n/);
      for (var li = 1; li < lines.length; li++) {
        var ln = lines[li]; if (!ln.trim()) continue;
        var mt = /^([0-9A-Fa-f]{6});[^;]*;[^;]*;[^;]*;"((?:[^"]|"")*)"$/.exec(ln);
        if (!mt) continue;
        var s3 = byOff[mt[1].toUpperCase()];
        if (!s3) continue;
        var nt = mt[2].replace(/""/g, '"');
        if (nt === s3.text) continue;
        try { G.textWrite(rom, s3, nt, alloc); bump('texte'); }
        catch (e) { note('Text', G.hx(s3.off) + ': ' + e.message); break; }
        if ((li & 511) === 0) await onStep('Texte ' + li + ' / ' + lines.length, li / lines.length);
      }
    }
  }

  /* --- Sounds --- */
  if (sel.sounds) {
    var sndNames = names.filter(function (n) { return /snd_[0-9a-f]{6}/i.test(n) && /\.wav$/i.test(n); });
    if (sndNames.length) {
      await onStep('Samples werden gesucht ...', 0);
      var snd = await G.soundScan(rom, function (f, t) { onStep(t || 'Samples ...', f); });
      var sById = {};
      snd.list.forEach(function (s) { sById[s.id] = s; });
      for (var wi = 0; wi < sndNames.length; wi++) {
        var wn = sndNames[wi], wk = /(snd_[0-9a-f]{6})/i.exec(wn), s4 = sById[wk[1].toLowerCase()];
        if (!s4) continue;
        try {
          var wav = G.wav.fromWav(files.get(wn));
          var pcm = G.wav.resampleTo8(wav.data, wav.rate, s4.rate);
          var identisch = pcm.length === s4.size;
          for (var pi = 0; identisch && pi < pcm.length; pi++) if ((pcm[pi] & 255) !== rom.data[s4.off + 16 + pi]) identisch = false;
          if (!identisch) { G.soundWrite(rom, s4, pcm, s4.rate, alloc); bump('sounds'); }
        } catch (e) { note('Sound', wn + ': ' + e.message); }
        if ((wi & 15) === 0) await onStep('Sounds ' + wi + ' / ' + sndNames.length, wi / sndNames.length);
      }
    }
  }

  /* --- Missionsdaten --- */
  if (sel.missionen) {
    var misNames = names.filter(function (n) { return /missionen\//i.test(n) && /\.csv$/i.test(n); });
    if (misNames.length) {
      await onStep('Missionsdaten ...', 0);
      for (var ci = 0; ci < misNames.length; ci++) {
        var cn = misNames[ci];
        try {
          var rows = new TextDecoder().decode(files.get(cn)).replace(/^﻿/, '').split(/\r?\n/);
          var head = rows[0].split(';');
          var fieldCols = [];
          head.forEach(function (h, idx2) { if (/^\+\d+$/.test(h)) fieldCols.push([idx2, parseInt(h.slice(1), 10)]); });
          for (var ri = 1; ri < rows.length; ri++) {
            if (!rows[ri].trim()) continue;
            var cols = rows[ri].split(';');
            var off = parseInt(cols[2], 16);
            if (!(off > 0 && off < rom.data.length)) continue;
            fieldCols.forEach(function (fc) {
              var val = parseInt(cols[fc[0]], 16);
              if (isNaN(val)) return;
              if (G.u32(rom.data, off + fc[1]) !== (val >>> 0)) { G.putU32(rom.data, off + fc[1], val >>> 0); bump('missionen'); }
            });
          }
        } catch (e) { note('Mission', cn + ': ' + e.message); }
      }
    }
  }

  G.updateStatus();
  return { counts: counts, report: rep };
}

/* ---------------------------------------------------------------- Ansicht */
G.registerTab({
  id: 'bulk', label: 'Komplett-Paket', icon: '☷', needsRom: true,
  render: function (v) {
    var st = G.cache.bulkui || (G.cache.bulkui = { sel: {} });
    CATS.forEach(function (c) { if (st.sel[c.id] === undefined) st.sel[c.id] = true; });

    v.appendChild(el('h2', { text: 'Komplett-Paket' }));
    v.appendChild(el('p', { class: 'lead',
      text: 'Alle bearbeitbaren Daten der ROM auf einmal herausschreiben und genauso wieder einspielen - '
        + 'ohne jede Datei einzeln auszuwaehlen. Das Paket ist ein gewoehnliches ZIP; du kannst es entpacken, '
        + 'bearbeiten und wieder einpacken, solange die Dateinamen gleich bleiben.' }));

    var box = el('div', { class: 'card' });
    box.appendChild(el('h4', { text: 'Welche Bereiche' }));
    var grid = el('div', { class: 'grid2' });
    CATS.forEach(function (c) {
      var cb = el('input', { type: 'checkbox' });
      cb.checked = !!st.sel[c.id];
      cb.onchange = function () { st.sel[c.id] = cb.checked; };
      grid.appendChild(el('label', { class: 'chk', style: 'align-items:flex-start' }, [cb,
        el('span', {}, [el('b', { text: c.name, style: 'color:var(--fg)' }), el('br'), el('span', { class: 'hint', text: c.hint })])]));
    });
    box.appendChild(grid);
    box.appendChild(el('div', { class: 'row', style: 'margin-top:10px' }, [
      el('button', { text: 'alles', onclick: function () { CATS.forEach(function (c) { st.sel[c.id] = true; }); G.refreshTab(); } }),
      el('button', { text: 'nichts', onclick: function () { CATS.forEach(function (c) { st.sel[c.id] = false; }); G.refreshTab(); } }),
      el('span', { class: 'spacer' }),
      el('span', { class: 'hint', text: G.CAN_DEFLATE ? 'ZIP wird komprimiert' : 'ZIP wird unkomprimiert gespeichert (Browser kann nicht packen)' })
    ]));
    v.appendChild(box);

    v.appendChild(el('div', { class: 'card' }, [
      el('h4', { text: 'Paket erstellen' }),
      el('p', { class: 'hint', text: 'Je nach Auswahl dauert das eine halbe bis zwei Minuten und ergibt 5 bis 25 MB. '
        + 'Die ROM wird dabei nicht veraendert.' }),
      el('div', { class: 'row', style: 'margin-top:8px' }, [
        el('button', { class: 'primary', text: 'Alles exportieren (.zip)', onclick: doExport })
      ])
    ]));

    v.appendChild(el('div', { class: 'card' }, [
      el('h4', { text: 'Paket einspielen' }),
      el('p', { class: 'hint', text: 'Es werden nur Dateien uebernommen, die zu einem bekannten Eintrag passen und '
        + 'sich tatsaechlich vom Original unterscheiden. Unbekannte Dateien werden still uebersprungen.' }),
      el('div', { class: 'row', style: 'margin-top:8px' }, [
        el('button', { class: 'primary', text: 'Paket einspielen (.zip)', onclick: doImport }),
        el('button', { text: 'Einzelne Dateien einspielen', title: 'Mehrere PNG/WAV/JSON/CSV direkt auswaehlen', onclick: doImportLoose })
      ])
    ]));

    var out = el('div', { class: 'card' }, [el('h4', { text: 'Bericht' }),
      el('p', { class: 'hint', text: 'Hier erscheint nach einem Lauf die Zusammenfassung.' })]);
    v.appendChild(out);

    async function step(text, frac) {
      G.busyProgress(frac || 0, text);
      await G.yieldUI();
    }

    async function doExport() {
      var sel = st.sel;
      if (!CATS.some(function (c) { return sel[c.id]; })) { G.toast('Nichts ausgewaehlt.', 'err'); return; }
      G.busy('Paket wird erstellt ...');
      await G.yieldUI();
      try {
        var t0 = Date.now();
        var zip = await exportAll(sel, step);
        G.busy(false);
        var name = (App.project.name || 'gta_advance').replace(/[^\w\- ]+/g, '_') + '_paket.zip';
        G.download(name, zip, 'application/zip');
        showReport(out, 'Paket erstellt', [
          'Datei: ' + name,
          'Groesse: ' + (zip.length / 1048576).toFixed(1) + ' MB',
          'Dauer: ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s'
        ]);
        G.toast('Komplett-Paket gespeichert.');
      } catch (e) { G.busy(false); G.toast('Fehler: ' + e.message, 'err'); console.error(e); }
    }

    async function doImport() {
      var f = await G.pickFile('.zip'); if (!f) return;
      G.busy('Paket wird gelesen ...'); await G.yieldUI();
      try {
        var bytes = await G.readFileBytes(f);
        var files = G.zipRead(bytes);
        var man = files.get('manifest.json');
        if (man) {
          var mj = JSON.parse(new TextDecoder().decode(man));
          if (mj.rom_sha1 && mj.rom_sha1 !== App.rom.sha1) {
            G.busy(false);
            var go = await G.confirmBox('Andere ROM', 'Das Paket wurde aus einer anderen ROM erstellt. Trotzdem einspielen?');
            if (!go) return;
            G.busy('Paket wird eingespielt ...'); await G.yieldUI();
          }
        }
        await applyFiles(files);
      } catch (e) { G.busy(false); G.toast('Fehler: ' + e.message, 'err'); console.error(e); }
    }

    async function doImportLoose() {
      var fl = await G.pickFile('.png,.wav,.json,.csv', true);
      if (!fl || !fl.length) return;
      G.busy('Dateien werden gelesen ...'); await G.yieldUI();
      try {
        var files = new Map();
        for (var i = 0; i < fl.length; i++) files.set(fl[i].name, await G.readFileBytes(fl[i]));
        await applyFiles(files);
      } catch (e) { G.busy(false); G.toast('Fehler: ' + e.message, 'err'); console.error(e); }
    }

    async function applyFiles(files) {
      var t0 = Date.now();
      var res = await importAll(files, st.sel, step);
      G.busy(false);
      var lines = [];
      CATS.forEach(function (c) { if (res.counts[c.id]) lines.push(c.name + ': ' + res.counts[c.id] + ' geaendert'); });
      if (!lines.length) lines.push('Keine Aenderung gegenueber der geladenen ROM gefunden.');
      lines.push('Dauer: ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
      if (res.report.length) {
        lines.push('');
        lines.push('Hinweise (' + res.report.length + '):');
        lines = lines.concat(res.report.slice(0, 60));
        if (res.report.length > 60) lines.push('... und ' + (res.report.length - 60) + ' weitere');
      }
      showReport(out, 'Paket eingespielt', lines);
      G.toast('Import abgeschlossen.');
      G.refreshTab();
    }

    function showReport(node, title, lines) {
      G.clear(node);
      node.appendChild(el('h4', { text: title }));
      node.appendChild(el('pre', { class: 'mono', style: 'white-space:pre-wrap;font-size:12px;margin:0', text: lines.join('\n') }));
    }
  }
});

G.bulkExport = exportAll;
G.bulkImport = importAll;
})(window);
