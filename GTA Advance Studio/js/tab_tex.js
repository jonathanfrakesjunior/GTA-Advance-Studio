/* GTA Advance Studio - Welt-Texturen (unkomprimierte 8bpp-Bitmaps) */
(function (global) {
'use strict';
var G = global.GTAS, el = G.el, App = G.App;
G.cache = G.cache || {};

var TEX_LO = 0x3F0000, TEX_HI = 0x800000;
var TAB_LO = 0xEBE000, TAB_HI = 0xEC0000;   /* Bereich der Texturtabellen */
var SIZES = { 1024: 32, 4096: 64, 16384: 128 };

/* Texturliste aus den Verweistabellen ableiten */
function scanTextures(rom) {
  if (G.cache.tex) return G.cache.tex;
  var d = rom.data, set = {}, o, v, t;
  for (o = TAB_LO; o + 4 <= Math.min(TAB_HI, d.length); o += 4) {
    if (d[o + 3] !== 0x08) continue;
    t = d[o] | (d[o + 1] << 8) | (d[o + 2] << 16);
    if (t >= TEX_LO && t < TEX_HI) set[t] = 1;
  }
  var keys = Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
  var list = [];
  for (var i = 0; i < keys.length; i++) {
    var off = keys[i], nx = (i + 1 < keys.length) ? keys[i + 1] : off + 4096;
    var size = nx - off;
    if (!SIZES[size]) {
      /* letzte Textur einer Kette: groesstes passendes Quadrat verwenden */
      if (size >= 16384) size = 16384; else if (size >= 4096) size = 4096; else if (size >= 1024) size = 1024; else continue;
    }
    list.push({ off: off, size: size, dim: SIZES[size], id: 'tex_' + G.hex(off, 6).toLowerCase() });
  }
  G.cache.tex = list;
  return list;
}

/* Die Weltpalette: 256 Farben, in der ROM viermal abgelegt (u. a. direkt hinter
   den Kartendaten von Insel 1 und 2). Nachgewiesen ueber das Paletten-RAM eines
   Savestates - dort steht genau dieser Block, Byte fuer Byte.
   Erkennungsmuster sind die ersten vier Eintraege. */
var WORLD_SIG = [0x7C1F, 0xF3FF, 0xEBBD, 0xE37B];

function findWorldPalettes(rom) {
  if (G.cache.worldpal) return G.cache.worldpal;
  var d = rom.data, out = [];
  for (var o = 0; o + 512 <= d.length; o += 4) {
    var ok = true;
    for (var k = 0; k < WORLD_SIG.length; k++) if (G.u16(d, o + k * 2) !== WORLD_SIG[k]) { ok = false; break; }
    if (!ok) continue;
    /* echte Palette: viele verschiedene Farben */
    var seen = {}, n = 0;
    for (var i = 0; i < 256; i++) { var v = G.u16(d, o + i * 2); if (!seen[v]) { seen[v] = 1; n++; } }
    if (n >= 200) out.push(o);
  }
  G.cache.worldpal = out;
  return out;
}
G.findWorldPalettes = findWorldPalettes;

/* Weitere Paletten zur Auswahl: 256-Farben-Bloecke und die 128-Farben-Paletten
   der Vollbilder - nuetzlich, um Sonderfaelle auszuprobieren. */
function palCandidates(rom) {
  if (G.cache.texpals) return G.cache.texpals;
  var d = rom.data, out = [], last = -1;
  findWorldPalettes(rom).forEach(function (o, i) {
    out.push({ off: o, n: 256, name: 'Weltpalette' + (i ? ' (Kopie ' + (i + 1) + ')' : '') + ' @ ' + G.hx(o) });
  });
  var world = {};
  findWorldPalettes(rom).forEach(function (o) { world[o] = 1; });
  for (var o = 0x300000; o + 512 <= d.length && out.length < 250; o += 4) {
    if (o < last || world[o]) continue;
    if (!G.isPal(d, o, 256)) continue;
    /* genug verschiedene Farben und nicht ueberwiegend schwarz */
    var seen = {}, n = 0, zero = 0;
    for (var i = 0; i < 256; i++) {
      var v = G.u16(d, o + i * 2);
      if (!v) zero++;
      if (!seen[v]) { seen[v] = 1; n++; }
    }
    if (n < 80 || zero > 96) continue;
    out.push({ off: o, n: 256, name: '256 Farben @ ' + G.hx(o) });
    last = o + 512;
  }
  /* die 128-Farben-Paletten der Vollbilder sind sicher echte Paletten */
  if (G.cache.gfx) {
    G.cache.gfx.assets.forEach(function (a) {
      if (a.kind === 'screen' && a.pal) out.unshift({ off: a.pal.off, n: 128, name: 'Vollbild-Palette ' + G.hx(a.pal.off) });
    });
  }
  G.cache.texpals = out;
  return out;
}

function texPal(rom, sel) {
  if (sel === 'grau' || sel === undefined || sel === null) return G.grayPal(256);
  var off = +sel;
  if (!G.isPal(rom.data, off, 256)) {
    if (G.isPal(rom.data, off, 128)) {
      var p = G.readPal(rom.data, off, 128);
      while (p.length < 256) p.push([0, 0, 0]);
      return p;
    }
    return G.grayPal(256);
  }
  return G.readPal(rom.data, off, 256);
}

G.registerTab({
  id: 'tex', label: 'Welt-Texturen', icon: '▤', needsRom: true,
  render: function (v) {
    var rom = App.rom;
    var st = G.cache.texui || (G.cache.texui = { page: 0, sel: null, pal: null, q: '', dim: 'alle', zoom: 1 });
    if (st.pal === null) { var wp = findWorldPalettes(rom); st.pal = wp.length ? wp[0] : 'grau'; }

    v.appendChild(el('h2', { text: 'Welt-Texturen' }));
    v.appendChild(el('p', { class: 'lead',
      text: 'Die unkomprimierten 8-Bit-Texturen der Stadt (32x32, 64x64 und 128x128 Pixel) - Dachflaechen, Fassaden, '
        + 'Strassenbelag. Groesse und Lage sind fest: beim Import werden die Pixel direkt an derselben Stelle ersetzt.' }));

    var list = scanTextures(rom);
    if (!list.length) { v.appendChild(el('div', { class: 'card err', text: 'Keine Texturtabellen gefunden - andere ROM-Fassung?' })); return; }

    var body = el('div'); v.appendChild(body);
    render();

    function filtered() {
      var q = st.q.trim().toLowerCase();
      return list.filter(function (t) {
        if (st.dim !== 'alle' && t.dim !== +st.dim) return false;
        if (!q) return true;
        return t.id.indexOf(q) >= 0;
      });
    }

    function render() {
      G.clear(body);
      var fl = filtered(), PER = 200, pages = Math.max(1, Math.ceil(fl.length / PER));
      if (st.page >= pages) st.page = 0;

      var palSel = el('select', { onchange: function () { st.pal = this.value; render(); } });
      palSel.appendChild(el('option', { value: 'grau', text: 'Graustufen (neutral)' }));
      palCandidates(rom).forEach(function (p) { palSel.appendChild(el('option', { value: p.off, text: p.name })); });
      palSel.value = st.pal;

      var dimSel = el('select', { onchange: function () { st.dim = this.value; st.page = 0; render(); } });
      var cnt = { 32: 0, 64: 0, 128: 0 };
      list.forEach(function (t) { cnt[t.dim]++; });
      dimSel.appendChild(el('option', { value: 'alle', text: 'alle (' + list.length + ')' }));
      [32, 64, 128].forEach(function (dd) { dimSel.appendChild(el('option', { value: dd, text: dd + 'x' + dd + ' (' + cnt[dd] + ')' })); });
      dimSel.value = st.dim;

      body.appendChild(el('div', { class: 'toolbar' }, [
        el('input', { type: 'search', placeholder: 'Suche nach Offset ...', value: st.q, style: 'width:190px',
          oninput: function () { st.q = this.value; st.page = 0; render(); } }),
        dimSel,
        el('span', { class: 'mut', text: 'Anzeigepalette' }), palSel,
        el('span', { class: 'sep' }),
        el('button', { text: 'Alle als ZIP exportieren', onclick: function () { exportZip(fl); } }),
        el('button', { text: 'PNG-Dateien importieren', onclick: function () { importMany(fl); } }),
        el('span', { class: 'spacer' }),
        el('span', { class: 'pill', text: fl.length + ' Texturen' })
      ]));

      var split = el('div', { class: 'split' }), left = el('div', { style: 'flex:1;min-width:0' }), side = el('div', { class: 'side' });
      split.appendChild(left); split.appendChild(side); body.appendChild(split);

      var pal = texPal(rom, st.pal);
      var grid = el('div', { class: 'gridwrap' });
      grid.style.setProperty('--cw', '104px');
      fl.slice(st.page * PER, st.page * PER + PER).forEach(function (t) {
        var tile = el('div', { class: 'tile' + (st.sel === t ? ' sel' : ''), onclick: function () { st.sel = t; render(); } });
        var cv = el('canvas');
        G.drawToCanvas(cv, rom.data.subarray(t.off, t.off + t.size), t.dim, t.dim, pal, false);
        cv.style.width = '88px';
        tile.appendChild(cv);
        tile.appendChild(el('small', { text: t.dim + 'x' + t.dim }));
        tile.appendChild(el('small', { class: 'mono', text: G.hex(t.off, 6) }));
        grid.appendChild(tile);
      });
      left.appendChild(grid);

      if (pages > 1) {
        left.appendChild(el('div', { class: 'row', style: 'margin-top:10px;justify-content:center' }, [
          el('button', { text: '‹ zurueck', onclick: function () { if (st.page > 0) { st.page--; render(); } } }),
          el('span', { class: 'mut', text: 'Seite ' + (st.page + 1) + ' / ' + pages }),
          el('button', { text: 'weiter ›', onclick: function () { if (st.page < pages - 1) { st.page++; render(); } } })
        ]));
      }

      side.appendChild(detail(pal));
    }

    function detail(pal) {
      var box = el('div', { class: 'card sticky' }), t = st.sel;
      if (!t) {
        box.appendChild(el('p', { class: 'hint', text: 'Links eine Textur anklicken.' }));
        box.appendChild(el('p', { class: 'hint', text: 'Angezeigt wird die Weltpalette der Engine - 256 Farben, in der ROM viermal '
          + 'abgelegt. Beim Bearbeiten zaehlen die Palettenindizes, und die bleiben bei Export und Import exakt erhalten.' }));
        return box;
      }
      box.appendChild(el('h4', { text: t.id }));
      var cv = el('canvas', { style: 'width:100%;max-width:256px;image-rendering:pixelated;border-radius:6px' });
      G.drawToCanvas(cv, App.rom.data.subarray(t.off, t.off + t.size), t.dim, t.dim, pal, false);
      box.appendChild(cv);
      var kv = el('div', { class: 'kv', style: 'margin-top:10px' });
      kv.appendChild(el('b', { text: 'Offset' })); kv.appendChild(el('span', { class: 'mono', text: G.hx(t.off) }));
      kv.appendChild(el('b', { text: 'Groesse' })); kv.appendChild(el('span', { class: 'mono', text: t.dim + 'x' + t.dim + ' = ' + t.size + ' Byte' }));
      box.appendChild(kv);
      box.appendChild(el('div', { class: 'row', style: 'margin-top:12px' }, [
        el('button', { class: 'primary', text: 'PNG exportieren', onclick: function () {
          var png = G.pngWriteIndexed(App.rom.data.subarray(t.off, t.off + t.size), t.dim, t.dim, pal, false);
          G.download(t.id + '_' + t.dim + 'x' + t.dim + '.png', png, 'image/png');
        } }),
        el('button', { text: 'PNG importieren', onclick: async function () {
          var f = await G.pickFile('.png'); if (!f) return;
          try {
            var bytes = await G.readFileBytes(f), png = G.pngRead(bytes);
            var idx = toIndices(png, t, pal);
            App.rom.data.set(idx, t.off);
            G.toast('Textur ' + t.id + ' ersetzt (' + t.size + ' Byte).');
            G.updateStatus(); render();
          } catch (e) { G.toast('Fehler: ' + e.message, 'err'); }
        } })
      ]));
      return box;
    }

    function toIndices(png, t, pal) {
      if (png.w !== t.dim || png.h !== t.dim) throw new Error('Bild muss ' + t.dim + 'x' + t.dim + ' Pixel gross sein');
      if (png.mode === 'P') return png.idx;
      /* RGB: naechste Palettenfarbe suchen */
      var out = new Uint8Array(t.size), cache = new Map();
      for (var i = 0; i < out.length; i++) {
        var r = png.rgba[i * 4], g = png.rgba[i * 4 + 1], b = png.rgba[i * 4 + 2];
        var key = (r << 16) | (g << 8) | b, hit = cache.get(key);
        if (hit === undefined) {
          var best = 0, bd = 1e9;
          for (var k = 0; k < pal.length; k++) {
            var dr = pal[k][0] - r, dg = pal[k][1] - g, db = pal[k][2] - b, dd = dr * dr + dg * dg + db * db;
            if (dd < bd) { bd = dd; best = k; }
          }
          hit = best; cache.set(key, best);
        }
        out[i] = hit;
      }
      return out;
    }

    async function exportZip(fl) {
      G.busy('Texturen werden exportiert ...'); await G.yieldUI();
      var pal = texPal(rom, st.pal), z = new G.ZipWriter();
      for (var i = 0; i < fl.length; i++) {
        var t = fl[i];
        z.add(t.id + '_' + t.dim + 'x' + t.dim + '.png',
          G.pngWriteIndexed(rom.data.subarray(t.off, t.off + t.size), t.dim, t.dim, pal, false));
        if ((i & 31) === 0) { G.busyProgress(i / fl.length, 'Textur ' + i + ' / ' + fl.length); await G.yieldUI(); }
      }
      G.busy(false);
      G.download('welt_texturen.zip', z.build(), 'application/zip');
      G.toast(fl.length + ' Texturen exportiert.');
    }

    async function importMany(fl) {
      var files = await G.pickFile('.png', true);
      if (!files || !files.length) return;
      var byId = {}; list.forEach(function (t) { byId[t.id] = t; });
      var pal = texPal(rom, st.pal), rep = [], ok = 0;
      G.busy('Texturen werden eingespielt ...'); await G.yieldUI();
      for (var i = 0; i < files.length; i++) {
        var f = files[i], m = /(tex_[0-9a-f]{6})/i.exec(f.name);
        if (!m || !byId[m[1].toLowerCase()]) { rep.push('uebersprungen: ' + f.name); continue; }
        try {
          var t = byId[m[1].toLowerCase()];
          var png = G.pngRead(await G.readFileBytes(f));
          rom.data.set(toIndices(png, t, pal), t.off);
          ok++; rep.push(t.id + ': ersetzt');
        } catch (e) { rep.push('FEHLER ' + f.name + ': ' + e.message); }
        G.busyProgress(i / files.length);
        if ((i & 7) === 0) await G.yieldUI();
      }
      G.busy(false); G.updateStatus();
      await G.modal(ok + ' Texturen ersetzt', el('pre', { class: 'mono', style: 'white-space:pre-wrap;font-size:12px', text: rep.join('\n') }), [{ label: 'OK', value: true, primary: true }]);
      render();
    }
  }
});

G.scanTextures = scanTextures;
})(window);
