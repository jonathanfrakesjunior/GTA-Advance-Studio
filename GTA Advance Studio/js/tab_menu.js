/* GTA Advance Studio - Menue-Grafiken
   Titelbild, Logo, Zwischensequenzen, Portraits, Briefing-Tafeln und Symbole.
   Aufbau je Bild:  16-Farben-Palette + 4bpp-Kacheln + Tilemap (u16 je Zelle).
   Datensatz (28 Byte):  palPtr, flags, tilesPtr, tilesSize, mapPtr, u16 w, u16 h, u32 rest
   Dabei gilt immer  mapPtr == tilesPtr + tilesSize  - Kacheln und Karte liegen also
   als ein zusammenhaengender Block in der ROM. */
(function (global) {
'use strict';
var G = global.GTAS, el = G.el, App = G.App;
G.cache = G.cache || {};

var REC = 28;

/* Bilder, die ich beim Durchsehen eindeutig identifiziert habe. Die Nummern sind
   die Reihenfolge in der Tabelle bei 0xC98D28 und damit stabil. */
var NAMES = {
  10: 'Logo-Animation, Stufe 1 (leer)',
  11: 'GTA-Advance-Logo, Stufe 2',
  12: 'GTA-Advance-Logo, Stufe 3',
  13: 'GTA-Advance-Logo, Stufe 4',
  14: 'GTA-Advance-Logo, Stufe 5',
  15: 'GTA-Advance-Logo, Stufe 6',
  21: 'Rockstar-Games-Logo',
  22: 'Digital-Eclipse-Logo',
  36: 'Platzhalter "flying airplane sample"',
  57: 'Titelbild - Stadtpanorama (480x320)',
  58: 'Flugzeug (Overlay)'
};


function readRec(d, o) {
  var pal = G.u32(d, o), fl = G.u32(d, o + 4), tp = G.u32(d, o + 8),
      ts = G.u32(d, o + 12), mp = G.u32(d, o + 16),
      w = G.u16(d, o + 20), h = G.u16(d, o + 22);
  if ((pal >>> 24) !== 8 || (tp >>> 24) !== 8 || (mp >>> 24) !== 8) return null;
  if (fl > 64) return null;
  if (!(w >= 1 && w <= 64 && h >= 1 && h <= 64)) return null;
  if (ts < 32 || ts > 0x20000 || (ts & 31)) return null;
  pal &= 0xFFFFFF; tp &= 0xFFFFFF; mp &= 0xFFFFFF;
  if (tp + ts > d.length || mp + w * h * 2 > d.length) return null;
  if (mp !== tp + ts) return null;              /* die feste Invariante */
  return { off: o, pal: pal, flags: fl, tiles: tp, size: ts, map: mp, w: w, h: h, rest: G.u32(d, o + 24) };
}

function scanMenu(rom) {
  if (G.cache.menu) return G.cache.menu;
  var d = rom.data, list = [], o = 0;
  while (o < d.length - REC) {
    var r = readRec(d, o);
    if (r) { list.push(r); o += REC; } else o += 4;
  }
  list.forEach(function (r, i) {
    r.i = i;
    r.id = 'menu_' + G.hex(r.tiles, 6).toLowerCase();
    r.px = r.w * 8; r.py = r.h * 8;
    r.dims = r.px + 'x' + r.py;
    r.tileCount = r.size / 32;
    r.name = NAMES[i] || null;
  });
  G.cache.menu = list;
  return list;
}

function menuPal(d, r) {
  var banks = 1, i;
  for (i = 0; i < r.w * r.h; i++) { var pb = (G.u16(d, r.map + i * 2) >> 12) & 15; if (pb + 1 > banks) banks = pb + 1; }
  var p = [];
  for (var b = 0; b < banks; b++) for (i = 0; i < 16; i++) p.push(G.c15ToRgb(G.u16(d, r.pal + b * 32 + i * 2)));
  while (p.length < 16) p.push([255, 0, 255]);
  r.banks = banks;
  return p;
}

/* Bild als Indexbild aufbauen */
function menuPixels(d, r) {
  var W = r.px, H = r.py, img = new Uint8Array(W * H);
  for (var ty = 0; ty < r.h; ty++) for (var tx = 0; tx < r.w; tx++) {
    var e = G.u16(d, r.map + (ty * r.w + tx) * 2);
    var tid = e & 0x3FF, hf = (e >> 10) & 1, vf = (e >> 11) & 1, pb = (e >> 12) & 15;
    var base = r.tiles + tid * 32;
    for (var y = 0; y < 8; y++) {
      var sy = vf ? 7 - y : y, row = base + sy * 4;
      for (var x = 0; x < 8; x++) {
        var sx = hf ? 7 - x : x;
        var b = row + (sx >> 1) < d.length ? d[row + (sx >> 1)] : 0;
        var px = (sx & 1) === 0 ? (b & 15) : (b >> 4);
        img[(ty * 8 + y) * W + tx * 8 + x] = px ? (px | (pb << 4)) : 0;
      }
    }
  }
  return img;
}

/* Indexbild -> Kacheln + Tilemap, mit Erkennung gespiegelter Wiederholungen */
function pixelsToTiles(idx, w, h) {
  var tw = w >> 3, th = h >> 3, tiles = [], mapEntries = new Uint16Array(tw * th), seen = new Map();
  function key(t) { var s = ''; for (var i = 0; i < 32; i++) s += String.fromCharCode(t[i]); return s; }
  for (var ty = 0; ty < th; ty++) for (var tx = 0; tx < tw; tx++) {
    var base = new Uint8Array(32), y, x;
    for (y = 0; y < 8; y++) for (x = 0; x < 4; x++) {
      var a = idx[(ty * 8 + y) * w + tx * 8 + x * 2] & 15, b2 = idx[(ty * 8 + y) * w + tx * 8 + x * 2 + 1] & 15;
      base[y * 4 + x] = a | (b2 << 4);
    }
    /* vier Varianten bilden */
    function flipH(t) { var o = new Uint8Array(32); for (var yy = 0; yy < 8; yy++) for (var xx = 0; xx < 4; xx++) { var v = t[yy * 4 + (3 - xx)]; o[yy * 4 + xx] = ((v & 15) << 4) | (v >> 4); } return o; }
    function flipV(t) { var o = new Uint8Array(32); for (var yy = 0; yy < 8; yy++) o.set(t.subarray((7 - yy) * 4, (7 - yy) * 4 + 4), yy * 4); return o; }
    var cand = [[base, 0], [flipH(base), 1], [flipV(base), 2], [flipV(flipH(base)), 3]];
    var hit = null;
    for (var c = 0; c < 4; c++) {
      var k = key(cand[c][0]), g = seen.get(k);
      if (g !== undefined) { hit = { id: g, fl: cand[c][1] }; break; }
    }
    if (!hit) {
      var id = tiles.length;
      tiles.push(base);
      seen.set(key(base), id);
      hit = { id: id, fl: 0 };
    }
    var flags = 0;
    if (hit.fl & 1) flags |= 0x400;
    if (hit.fl & 2) flags |= 0x800;
    mapEntries[ty * tw + tx] = (hit.id & 0x3FF) | flags;
  }
  var tileData = new Uint8Array(tiles.length * 32);
  for (var i = 0; i < tiles.length; i++) tileData.set(tiles[i], i * 32);
  return { tiles: tileData, map: mapEntries, count: tiles.length };
}

/* Schreiben: Kacheln + Karte bleiben ein Block. Passt er nicht, wandert er ans ROM-Ende. */
function writeMenuImage(rom, r, built, alloc) {
  var d = rom.data;
  var newTotal = built.tiles.length + built.map.length * 2;
  var oldTotal = r.size + r.w * r.h * 2;
  var target;
  if (newTotal <= oldTotal) {
    target = r.tiles;
    for (var z = newTotal; z < oldTotal; z++) d[target + z] = 0;
  } else {
    target = alloc.alloc(newTotal);
    if (target < 0) throw new Error('kein freier Platz mehr - ROM unter "ROM & Projekt" auf 32 MB erweitern');
  }
  d.set(built.tiles, target);
  for (var i = 0; i < built.map.length; i++) G.putU16(d, target + built.tiles.length + i * 2, built.map[i]);
  G.putU32(d, r.off + 8, G.BASE + target);
  G.putU32(d, r.off + 12, built.tiles.length);
  G.putU32(d, r.off + 16, G.BASE + target + built.tiles.length);
  var moved = target !== r.tiles;
  r.tiles = target; r.size = built.tiles.length; r.map = target + built.tiles.length; r.tileCount = built.count;
  return { moved: moved, to: target };
}

/* Dateiname und Zuordnung - mehrere Eintraege koennen sich dieselben Kacheln
   teilen, darum steht die laufende Nummer vorn und entscheidet beim Import. */
function menuFileName(r) { return 'm' + ('00' + r.i).slice(-3) + '_' + r.id + '_' + r.dims + '.png'; }
function menuMatch(list, name) {
  var mi = /(?:^|\/)m(\d{3})_menu_([0-9a-f]{6})/i.exec(name);
  if (mi) {
    var byIdx = list[parseInt(mi[1], 10)];
    if (byIdx && byIdx.id === 'menu_' + mi[2].toLowerCase()) return byIdx;
  }
  var mk = /(menu_[0-9a-f]{6})/i.exec(name);
  if (!mk) return null;
  for (var i = 0; i < list.length; i++) if (list[i].id === mk[1].toLowerCase()) return list[i];
  return null;
}

/* PNG auf Palettenindizes bringen und pruefen */
function pngToMenuIdx(rom, r, pngBytes, byColor) {
  var png = G.pngRead(pngBytes);
  if (png.w !== r.px || png.h !== r.py) throw new Error('Bild muss ' + r.px + 'x' + r.py + ' Pixel gross sein');
  var pal = menuPal(rom.data, r).slice(0, 16);
  var idx = G.pngToIndices(png, { w: r.px, h: r.py }, pal, byColor, function () {});
  var mx = 0; for (var i = 0; i < idx.length; i++) if (idx[i] > mx) mx = idx[i];
  if (mx > 15) throw new Error('Palettenindex ' + mx + ' - erlaubt sind nur 16 Farben (0..15)');
  return idx;
}

/* Zeigt das PNG schon genau das, was in der ROM steht? Dann nichts anfassen -
   der Kachel-Rueckbau wuerde sonst gleiche Bilder mit anderer Kachelreihenfolge
   schreiben und die ROM unnoetig veraendern. */
function menuIdxEqual(rom, r, idx) {
  var cur = menuPixels(rom.data, r);
  if (cur.length !== idx.length) return false;
  for (var i = 0; i < cur.length; i++) if ((cur[i] & 15) !== (idx[i] & 15)) return false;
  return true;
}

/* PNG in ein Menue-Bild uebernehmen (auch vom Komplett-Import genutzt) */
function importPng(rom, r, pngBytes, byColor, alloc) {
  var idx = pngToMenuIdx(rom, r, pngBytes, byColor);
  if (menuIdxEqual(rom, r, idx)) return { moved: false, to: r.tiles, count: r.tileCount, unchanged: true };
  var built = pixelsToTiles(idx, r.px, r.py);
  if (built.count > 1024) throw new Error(built.count + ' verschiedene Kacheln - die Hardware erlaubt hoechstens 1024');
  var res = writeMenuImage(rom, r, built, alloc || new G.Allocator(rom, false));
  res.count = built.count;
  return res;
}

G.registerTab({
  id: 'menu', label: 'Menue-Grafiken', icon: '✦', needsRom: true,
  render: function (v) {
    var rom = App.rom;
    var st = G.cache.menuui || (G.cache.menuui = { page: 0, sel: null, q: '', size: 'alle', byColor: false });

    v.appendChild(el('h2', { text: 'Menue-Grafiken' }));
    v.appendChild(el('p', { class: 'lead',
      text: 'Titelbild, Logo mit seinen Animationsstufen, Zwischensequenzen, Figuren-Portraits, Briefing-Tafeln und '
        + 'Waffen-/Objektsymbole. Jedes Bild besteht aus 4bpp-Kacheln, einer Tilemap und einer 16-Farben-Palette.' }));

    var list = scanMenu(rom);
    if (!list.length) { v.appendChild(el('div', { class: 'card err', text: 'Keine Menue-Bildtabelle gefunden - andere ROM-Fassung?' })); return; }

    var body = el('div'); v.appendChild(body);
    render();

    function filtered() {
      var q = st.q.trim().toLowerCase();
      return list.filter(function (r) {
        if (st.size !== 'alle' && r.dims !== st.size) return false;
        if (!q) return true;
        return r.id.indexOf(q) >= 0 || r.dims.indexOf(q) >= 0 || String(r.i) === q
          || (r.name && r.name.toLowerCase().indexOf(q) >= 0);
      });
    }

    function render() {
      G.clear(body);
      var fl = filtered(), PER = 60, pages = Math.max(1, Math.ceil(fl.length / PER));
      if (st.page >= pages) st.page = 0;

      var sizes = {}; list.forEach(function (r) { sizes[r.dims] = (sizes[r.dims] || 0) + 1; });
      var sizeSel = el('select', { onchange: function () { st.size = this.value; st.page = 0; render(); } });
      sizeSel.appendChild(el('option', { value: 'alle', text: 'alle Groessen (' + list.length + ')' }));
      Object.keys(sizes).sort(function (a, b) { return sizes[b] - sizes[a]; }).forEach(function (s) {
        sizeSel.appendChild(el('option', { value: s, text: s + '  (' + sizes[s] + ')' }));
      });
      sizeSel.value = st.size;

      body.appendChild(el('div', { class: 'toolbar' }, [
        el('input', { type: 'search', placeholder: 'Suche: Nummer oder Offset ...', value: st.q, style: 'width:210px',
          oninput: function () { st.q = this.value; st.page = 0; render(); } }),
        sizeSel,
        el('span', { class: 'sep' }),
        el('button', { text: 'Alle als ZIP exportieren', onclick: function () { exportZip(fl); } }),
        el('button', { text: 'PNG-Dateien importieren', onclick: function () { importMany(); } }),
        el('span', { class: 'spacer' }),
        el('span', { class: 'pill', text: fl.length + ' Bilder' })
      ]));

      var split = el('div', { class: 'split' }), left = el('div', { style: 'flex:1;min-width:0' }), side = el('div', { class: 'side' });
      split.appendChild(left); split.appendChild(side); body.appendChild(split);

      var grid = el('div', { class: 'gridwrap' });
      grid.style.setProperty('--cw', '132px');
      fl.slice(st.page * PER, st.page * PER + PER).forEach(function (r) {
        var t = el('div', { class: 'tile' + (st.sel === r ? ' sel' : ''), onclick: function () { st.sel = r; render(); } });
        var cv = el('canvas');
        G.drawToCanvas(cv, menuPixels(rom.data, r), r.px, r.py, menuPal(rom.data, r), true);
        cv.style.width = '120px';
        t.appendChild(cv);
        t.appendChild(el('small', { text: '#' + r.i + (r.name ? '  ★' : '') + '  ' + r.dims,
          title: r.name || '' }));
        t.appendChild(el('small', { class: 'mono', text: G.hex(r.tiles, 6) }));
        grid.appendChild(t);
      });
      left.appendChild(grid);

      if (pages > 1) {
        left.appendChild(el('div', { class: 'row', style: 'margin-top:10px;justify-content:center' }, [
          el('button', { text: '‹ zurueck', onclick: function () { if (st.page > 0) { st.page--; render(); } } }),
          el('span', { class: 'mut', text: 'Seite ' + (st.page + 1) + ' / ' + pages }),
          el('button', { text: 'weiter ›', onclick: function () { if (st.page < pages - 1) { st.page++; render(); } } })
        ]));
      }
      side.appendChild(detail());
    }

    function detail() {
      var box = el('div', { class: 'card sticky' }), r = st.sel, d = rom.data;
      if (!r) {
        box.appendChild(el('p', { class: 'hint', text: 'Links ein Bild anklicken.' }));
        box.appendChild(el('p', { class: 'hint', text: 'Bekannte Bilder: #57 Titelbild, #11-#15 GTA-Advance-Logo, '
          + '#21 Rockstar-Logo, #22 Digital Eclipse. Mit ★ markierte Eintraege sind benannt - '
          + 'du kannst auch nach dem Namen suchen.' }));
        return box;
      }
      box.appendChild(el('h4', { text: '#' + r.i + ' · ' + r.dims }));
      if (r.name) box.appendChild(el('p', { style: 'margin:0 0 6px;color:var(--acc);font-weight:600', text: r.name }));
      var pal = menuPal(d, r);
      var cv = el('canvas', { style: 'width:100%;image-rendering:pixelated;border-radius:6px;background:repeating-conic-gradient(#3a3f4b 0 25%,#2e333d 0 50%) 0 0/12px 12px' });
      G.drawToCanvas(cv, menuPixels(d, r), r.px, r.py, pal, true);
      box.appendChild(cv);

      var kv = el('div', { class: 'kv', style: 'margin-top:10px' });
      function add(k, val) { kv.appendChild(el('b', { text: k })); kv.appendChild(el('span', { class: 'mono', text: val })); }
      add('Datensatz', G.hx(r.off));
      add('Kacheln', G.hx(r.tiles) + '  (' + r.tileCount + ' Stueck, ' + r.size + ' B)');
      add('Tilemap', G.hx(r.map) + '  (' + (r.w * r.h) + ' Zellen)');
      add('Palette', G.hx(r.pal) + '  (16 Farben)');
      add('Raster', r.w + 'x' + r.h + ' Kacheln');
      box.appendChild(kv);

      var pr = el('div', { class: 'palrow', style: 'margin-top:8px' });
      pal.slice(0, 16).forEach(function (c, i) {
        var sw = el('div', { class: 'swatch', title: 'Index ' + i + (i === 0 ? ' (transparent)' : '') + ' - ' + c.join(','),
          style: 'background:rgb(' + c.join(',') + ')' });
        sw.onclick = function () { editColor(r, i, c); };
        pr.appendChild(sw);
      });
      box.appendChild(el('h4', { text: 'Palette', style: 'margin-top:12px' }));
      box.appendChild(pr);

      box.appendChild(el('div', { class: 'row', style: 'margin-top:12px' }, [
        el('button', { class: 'primary', text: 'PNG exportieren', onclick: function () { exportOne(r); } }),
        el('button', { text: 'PNG importieren', onclick: function () { importOne(r); } })
      ]));
      box.appendChild(el('label', { class: 'chk', style: 'margin-top:6px' }, [
        (function () { var c = el('input', { type: 'checkbox' }); c.checked = st.byColor; c.onchange = function () { st.byColor = c.checked; }; return c; })(),
        el('span', { text: 'Beim Import Farben zuordnen statt Indizes' })
      ]));
      box.appendChild(el('p', { class: 'hint', style: 'margin-top:8px',
        text: 'Beim Import baut das Studio Kacheln und Tilemap neu auf und erkennt dabei gespiegelte Wiederholungen. '
          + 'Bildgroesse beibehalten, hoechstens 16 Farben, Index 0 ist transparent. '
          + 'Braucht das Ergebnis mehr Platz, wandert der Block ans ROM-Ende und der Datensatz wird angepasst.' }));
      return box;
    }

    async function editColor(r, i, c) {
      var inp = el('input', { type: 'color', value: '#' + c.map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join('') });
      var ok = await G.modal('Farbe ' + i + ' aendern',
        el('div', {}, [el('p', { text: 'Palette ' + G.hx(r.pal) + '. Der GBA speichert 15 Bit, die Farbe wird gerundet.' }), inp]),
        [{ label: 'Abbrechen', value: false }, { label: 'Uebernehmen', value: true, primary: true }]);
      if (!ok) return;
      var hv = inp.value;
      G.putU16(rom.data, r.pal + i * 2, G.rgbToC15(parseInt(hv.substr(1, 2), 16), parseInt(hv.substr(3, 2), 16), parseInt(hv.substr(5, 2), 16)));
      G.updateStatus(); render();
    }

    function exportOne(r) {
      var png = G.pngWriteIndexed(menuPixels(rom.data, r), r.px, r.py, menuPal(rom.data, r), true);
      G.download(menuFileName(r), png, 'image/png');
    }

    async function importOne(r) {
      var f = await G.pickFile('.png'); if (!f) return;
      try {
        var res = importPng(rom, r, await G.readFileBytes(f), st.byColor, new G.Allocator(rom, false));
        G.updateStatus();
        if (res.unchanged) { G.toast('Bild #' + r.i + ' ist identisch - nichts geaendert.'); return; }
        G.toast('Bild #' + r.i + ' ersetzt: ' + res.count + ' Kacheln'
          + (res.moved ? ', verschoben nach ' + G.hx(res.to) : ', an Ort und Stelle') + '.');
        render();
      } catch (e) { G.toast('Fehler: ' + e.message, 'err'); }
    }

    async function exportZip(fl) {
      G.busy('Menue-Grafiken werden exportiert ...'); await G.yieldUI();
      var z = new G.ZipWriter();
      for (var i = 0; i < fl.length; i++) {
        var r = fl[i];
        z.add(menuFileName(r), G.pngWriteIndexed(menuPixels(rom.data, r), r.px, r.py, menuPal(rom.data, r), true));
        if ((i & 7) === 0) { G.busyProgress(i / fl.length, 'Bild ' + i + ' / ' + fl.length); await G.yieldUI(); }
      }
      var blob = z.build();
      G.busy(false);
      G.download('menue_grafiken.zip', blob, 'application/zip');
      G.toast(fl.length + ' Menue-Grafiken exportiert.');
    }

    async function importMany() {
      var files = await G.pickFile('.png', true);
      if (!files || !files.length) return;
      var alloc = new G.Allocator(rom, false), rep = [], ok = 0;
      G.busy('Menue-Grafiken werden eingespielt ...'); await G.yieldUI();
      for (var i = 0; i < files.length; i++) {
        var f = files[i], r = menuMatch(list, f.name);
        if (!r) { rep.push('uebersprungen: ' + f.name); continue; }
        try {
          var res = importPng(rom, r, await G.readFileBytes(f), st.byColor, alloc);
          if (res.unchanged) { rep.push('#' + r.i + ': identisch, nichts geaendert'); continue; }
          ok++; rep.push('#' + r.i + ': ' + res.count + ' Kacheln' + (res.moved ? ', verschoben nach ' + G.hx(res.to) : ''));
        } catch (e) { rep.push('FEHLER ' + f.name + ': ' + e.message); }
        G.busyProgress(i / files.length);
        await G.yieldUI();
      }
      G.busy(false); G.updateStatus();
      await G.modal(ok + ' Bilder ersetzt', el('pre', { class: 'mono', style: 'white-space:pre-wrap;font-size:12px', text: rep.join('\n') }),
        [{ label: 'OK', value: true, primary: true }]);
      render();
    }
  }
});

G.menuScan = scanMenu;
G.menuPixels = menuPixels;
G.menuPal = menuPal;
G.menuToTiles = pixelsToTiles;
G.menuWrite = writeMenuImage;
G.menuImportPng = importPng;
G.menuIdxEqual = menuIdxEqual;
G.menuFileName = menuFileName;
G.menuMatch = menuMatch;
})(window);
