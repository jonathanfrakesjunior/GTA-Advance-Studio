/* GTA Advance Studio - Schriften
   Die Spieltexte werden zur Laufzeit aus 8x8-Glyphen zusammengesetzt (4bpp,
   32 Byte je Zeichen, fortlaufend). Gefunden ueber das VRAM eines Savestates:
   die dort sichtbaren Buchstaben stehen Byte fuer Byte so in der ROM.

   Aufbau eines Schriftblocks (88 Glyphen):
     0      Pfeil-/Markierungszeichen
     1-26   A-Z
     27     -      28-30 leer      31 .
     32-36  , ' ? ! $
     37-46  0-9
     47     +
     48-66  Akzentbuchstaben (eigene Kodierung des Spiels, nicht Latin-1)
     67-72  / : ; ( ) %
     73-87  Symbole und Fuellzeichen

   Die HUD-Schrift ist ein eigener, kurzer Block: Herzen, Sterne, Doppelpunkt, Ziffern. */
(function (global) {
'use strict';
var G = global.GTAS, el = G.el, App = G.App;
G.cache = G.cache || {};

var GLYPH = 32;                 /* Bytes je 8x8-Glyphe in 4bpp */
var TEXT_COUNT = 88;            /* Glyphen je Textschriftblock */
var HUD_COUNT = 16;

function labelsText() {
  var L = ['▷'];
  for (var c = 0; c < 26; c++) L.push(String.fromCharCode(65 + c));
  L.push('-', '', '', '', '.', ',', '’', '?', '!', '$');
  for (var n = 0; n <= 9; n++) L.push(String(n));
  L.push('+');
  for (var a = 1; a <= 19; a++) L.push('Akz' + a);
  L.push('/', ':', ';', '(', ')', '%');
  while (L.length < TEXT_COUNT) L.push('Sym' + (L.length - 72));
  return L;
}
function labelsHud() {
  var L = ['·', '♥', '♥', '★', '☆', ':'];
  for (var n = 0; n <= 9; n++) L.push(String(n));
  return L;
}
var LBL_TEXT = labelsText(), LBL_HUD = labelsHud();

/* Formmaske einer Glyphe: 1 Bit je Pixel, unabhaengig von der Farbstufe */
function glyphMask(d, o) {
  var m = new Uint8Array(8);
  for (var y = 0; y < 8; y++) {
    var v = 0;
    for (var x = 0; x < 8; x++) {
      var b = d[o + y * 4 + (x >> 1)];
      var px = (x & 1) === 0 ? (b & 15) : (b >> 4);
      if (px) v |= 1 << (7 - x);
    }
    m[y] = v;
  }
  return m;
}
function maskEq(a, b, invert) {
  for (var i = 0; i < 8; i++) if ((invert ? (~b[i] & 255) : b[i]) !== a[i]) return false;
  return true;
}

/* Alle Schriften suchen: ueber die Formfolge A-Z, normal und invertiert */
function findFonts(rom) {
  if (G.cache.fonts) return G.cache.fonts;
  var d = rom.data, out = [];

  /* Referenzformen A-Z aus der ersten bekannten Schrift, sonst aus dem Fund selbst */
  var refA = 0x346828, ref = null;
  if (refA + 26 * GLYPH <= d.length) {
    ref = [];
    for (var k = 0; k < 26; k++) ref.push(glyphMask(d, refA + k * GLYPH));
  }
  if (!ref) { G.cache.fonts = out; return out; }

  for (var inv = 0; inv < 2; inv++) {
    for (var o = 8; o + 26 * GLYPH <= d.length; o += GLYPH) {
      if (!maskEq(ref[0], glyphMask(d, o), inv === 1)) continue;
      var ok = true;
      for (var i = 1; i < 26; i++) {
        if (!maskEq(ref[i], glyphMask(d, o + i * GLYPH), inv === 1)) { ok = false; break; }
      }
      if (!ok) continue;
      var start = o - GLYPH;                       /* Glyphe 0 steht vor dem A */
      if (start < 0) continue;
      out.push({ kind: 'text', off: start, count: TEXT_COUNT, labels: LBL_TEXT,
        name: (inv ? 'Textschrift, invertiert' : 'Textschrift') + ' @ ' + G.hx(start),
        inverted: !!inv });
    }
  }

  /* HUD-Schrift ueber die Ziffernformen finden */
  var hudDig = 0x342EC8, hudRef = null;
  if (hudDig + 10 * GLYPH <= d.length) {
    hudRef = [];
    for (var h = 0; h < 10; h++) hudRef.push(glyphMask(d, hudDig + h * GLYPH));
  }
  if (hudRef) {
    for (var p = 8; p + 10 * GLYPH <= d.length; p += GLYPH) {
      if (!maskEq(hudRef[0], glyphMask(d, p), false)) continue;
      var ok2 = true;
      for (var j = 1; j < 10; j++) if (!maskEq(hudRef[j], glyphMask(d, p + j * GLYPH), false)) { ok2 = false; break; }
      if (!ok2) continue;
      var hs = p - 6 * GLYPH;
      if (hs < 0) continue;
      out.push({ kind: 'hud', off: hs, count: HUD_COUNT, labels: LBL_HUD,
        name: 'HUD-Schrift @ ' + G.hx(hs), inverted: false });
    }
  }

  out.sort(function (a, b) { return a.off - b.off; });
  out.forEach(function (f, i) {
    f.i = i;
    f.id = 'font_' + G.hex(f.off, 6).toLowerCase();
    f.bytes = f.count * GLYPH;
    /* benutzte Farbstufen ermitteln - sagt, wie viele Graustufen die Schrift nutzt */
    var used = {};
    for (var k = 0; k < f.bytes; k++) { var b = d[f.off + k]; used[b & 15] = 1; used[b >> 4] = 1; }
    f.shades = Object.keys(used).map(Number).sort(function (x, y) { return x - y; });
  });
  G.cache.fonts = out;
  return out;
}

/* Glyphen als ein Indexbild (16 je Reihe) */
function fontSheet(d, f, cols) {
  cols = cols || 16;
  var rows = Math.ceil(f.count / cols), W = cols * 8, H = rows * 8;
  var img = new Uint8Array(W * H);
  for (var t = 0; t < f.count; t++) {
    var tx = (t % cols) * 8, ty = ((t / cols) | 0) * 8, b = f.off + t * GLYPH;
    for (var y = 0; y < 8; y++) for (var x = 0; x < 8; x++) {
      var v = d[b + y * 4 + (x >> 1)];
      img[(ty + y) * W + tx + x] = (x & 1) === 0 ? (v & 15) : (v >> 4);
    }
  }
  return { px: img, w: W, h: H, cols: cols, rows: rows };
}
function sheetToRom(rom, f, idx, cols) {
  cols = cols || 16;
  var W = cols * 8, d = rom.data, changed = 0;
  for (var t = 0; t < f.count; t++) {
    var tx = (t % cols) * 8, ty = ((t / cols) | 0) * 8, b = f.off + t * GLYPH;
    for (var y = 0; y < 8; y++) for (var x = 0; x < 4; x++) {
      var lo = idx[(ty + y) * W + tx + x * 2] & 15;
      var hi = idx[(ty + y) * W + tx + x * 2 + 1] & 15;
      var nv = lo | (hi << 4);
      if (d[b + y * 4 + x] !== nv) { d[b + y * 4 + x] = nv; changed++; }
    }
  }
  return changed;
}

/* Anzeigepalette: Graustufen ueber die tatsaechlich benutzten Farbstufen */
function fontPal() {
  var p = [];
  for (var i = 0; i < 16; i++) { var v = Math.round(i * 255 / 15); p.push([v, v, v]); }
  p[0] = [26, 30, 38];
  return p;
}

G.registerTab({
  id: 'font', label: 'Schriften', icon: 'A', needsRom: true,
  render: function (v) {
    var rom = App.rom;
    var st = G.cache.fontui || (G.cache.fontui = { sel: 0, glyph: null, zoom: 4 });

    v.appendChild(el('h2', { text: 'Schriften' }));
    v.appendChild(el('p', { class: 'lead',
      text: 'Die Spieltexte werden zur Laufzeit aus 8x8-Glyphen gesetzt: 4bpp, 32 Byte je Zeichen, fortlaufend '
        + 'in der ROM. Gefunden habe ich sie ueber den Bildspeicher des beiliegenden Savestates - die dort '
        + 'sichtbaren Buchstaben stehen genauso in der ROM.' }));

    var body = el('div'); v.appendChild(body);

    if (!G.cache.fonts) {
      body.appendChild(el('div', { class: 'card' }, [
        el('p', { text: 'Die Schriften muessen einmalig gesucht werden (Formvergleich ueber A-Z).' }),
        el('button', { class: 'primary', text: 'Schriften suchen', onclick: async function () {
          G.busy('Schriften werden gesucht ...'); await G.yieldUI();
          findFonts(rom); G.busy(false); G.refreshTab();
        } })
      ]));
      return;
    }

    var fonts = G.cache.fonts;
    if (!fonts.length) { body.appendChild(el('div', { class: 'card err', text: 'Keine Schrift gefunden - andere ROM-Fassung?' })); return; }
    render();

    function render() {
      G.clear(body);
      if (st.sel >= fonts.length) st.sel = 0;
      var f = fonts[st.sel], pal = fontPal();

      var sel = el('select', { onchange: function () { st.sel = +this.value; st.glyph = null; render(); } });
      fonts.forEach(function (x, i) { sel.appendChild(el('option', { value: i, text: x.name + '  (' + x.count + ' Zeichen)' })); });
      sel.value = st.sel;

      var zoomSel = el('select', { onchange: function () { st.zoom = +this.value; render(); } });
      [3, 4, 6, 8].forEach(function (z) { zoomSel.appendChild(el('option', { value: z, text: z + 'x' })); });
      zoomSel.value = st.zoom;

      body.appendChild(el('div', { class: 'toolbar' }, [
        el('span', { class: 'mut', text: 'Schrift' }), sel,
        el('span', { class: 'mut', text: 'Zoom' }), zoomSel,
        el('span', { class: 'sep' }),
        el('button', { class: 'primary', text: 'PNG exportieren', onclick: function () { exportOne(f); } }),
        el('button', { text: 'PNG importieren', onclick: function () { importOne(f); } }),
        el('button', { text: 'Alle als ZIP', onclick: function () { exportZip(); } }),
        el('span', { class: 'spacer' }),
        el('span', { class: 'pill', text: f.bytes + ' Byte ab ' + G.hx(f.off) })
      ]));

      var split = el('div', { class: 'split' }), left = el('div', { style: 'flex:1;min-width:0' }), side = el('div', { class: 'side' });
      split.appendChild(left); split.appendChild(side); body.appendChild(split);

      /* Glyphenraster mit Beschriftung */
      var grid = el('div', { class: 'gridwrap' });
      grid.style.setProperty('--cw', (8 * st.zoom + 16) + 'px');
      for (var t = 0; t < f.count; t++) {
        (function (t) {
          var cv = el('canvas');
          var px = new Uint8Array(64), b = f.off + t * GLYPH;
          for (var y = 0; y < 8; y++) for (var x = 0; x < 8; x++) {
            var val = rom.data[b + y * 4 + (x >> 1)];
            px[y * 8 + x] = (x & 1) === 0 ? (val & 15) : (val >> 4);
          }
          G.drawToCanvas(cv, px, 8, 8, pal, false);
          cv.style.width = (8 * st.zoom) + 'px';
          var lab = f.labels[t] || '';
          var tile = el('div', { class: 'tile' + (st.glyph === t ? ' sel' : ''),
            title: 'Zeichen ' + t + '  ' + G.hx(f.off + t * GLYPH),
            onclick: function () { st.glyph = t; render(); } }, [cv, el('small', { text: lab || ('#' + t) })]);
          grid.appendChild(tile);
        })(t);
      }
      left.appendChild(grid);

      /* Seitenleiste */
      var box = el('div', { class: 'card sticky' });
      box.appendChild(el('h4', { text: f.name }));
      var kv = el('div', { class: 'kv' });
      function add(k, val) { kv.appendChild(el('b', { text: k })); kv.appendChild(el('span', { class: 'mono', text: val })); }
      add('Offset', G.hx(f.off));
      add('Zeichen', f.count + ' × 8x8, 4bpp');
      add('Groesse', f.bytes + ' Byte');
      add('Farbstufen', f.shades.join(', '));
      box.appendChild(kv);
      if (st.glyph !== null && st.glyph < f.count) {
        box.appendChild(el('h4', { text: 'Zeichen ' + st.glyph + (f.labels[st.glyph] ? '  ·  ' + f.labels[st.glyph] : ''), style: 'margin-top:12px' }));
        var big = el('canvas', { style: 'width:128px;image-rendering:pixelated;border-radius:6px' });
        var gpx = new Uint8Array(64), gb = f.off + st.glyph * GLYPH;
        for (var yy = 0; yy < 8; yy++) for (var xx = 0; xx < 8; xx++) {
          var gv = rom.data[gb + yy * 4 + (xx >> 1)];
          gpx[yy * 8 + xx] = (xx & 1) === 0 ? (gv & 15) : (gv >> 4);
        }
        G.drawToCanvas(big, gpx, 8, 8, pal, false);
        box.appendChild(big);
        box.appendChild(el('p', { class: 'hint mono', text: G.hx(gb) }));
      }
      box.appendChild(el('p', { class: 'hint', style: 'margin-top:10px',
        text: 'Export und Import laufen ueber ein Kachelblatt mit 16 Zeichen je Reihe. Groesse beibehalten, '
          + 'hoechstens 16 Farbstufen; geschrieben wird an Ort und Stelle, nichts wird verschoben.' }));
      side.appendChild(box);
      side.appendChild(el('div', { class: 'card' }, [
        el('h4', { text: 'Zur Kodierung' }),
        el('p', { class: 'hint', text: 'A-Z, Ziffern und die gaengigen Satzzeichen sind gesichert. '
          + 'Die 19 Akzentbuchstaben benutzen eine eigene Kodierung des Spiels (nicht Latin-1) - '
          + 'welcher Zeichencode auf welche Glyphe zeigt, rechnet der Programmcode aus, es gibt dafuer '
          + 'keine Tabelle in der ROM. Sie sind darum nach Position benannt.' })
      ]));
    }

    function exportOne(f) {
      var sh = fontSheet(rom.data, f, 16);
      G.download(f.id + '_' + f.count + 'zeichen.png',
        G.pngWriteIndexed(sh.px, sh.w, sh.h, fontPal(), false), 'image/png');
    }
    async function importOne(f) {
      var file = await G.pickFile('.png'); if (!file) return;
      try {
        var png = G.pngRead(await G.readFileBytes(file));
        var sh = fontSheet(rom.data, f, 16);
        if (png.w !== sh.w || png.h !== sh.h) throw new Error('Blatt muss ' + sh.w + 'x' + sh.h + ' Pixel gross sein');
        var idx = G.pngToIndices(png, { w: sh.w, h: sh.h }, fontPal(), png.mode !== 'P', function () {});
        var mx = 0; for (var i = 0; i < idx.length; i++) if (idx[i] > mx) mx = idx[i];
        if (mx > 15) throw new Error('Farbstufe ' + mx + ' - erlaubt sind 0..15');
        var ch = sheetToRom(rom, f, idx, 16);
        G.cache.fonts = null;
        G.updateStatus();
        G.toast(ch ? (ch + ' Byte der Schrift ersetzt.') : 'Schrift ist identisch - nichts geaendert.');
        findFonts(rom); G.refreshTab();
      } catch (e) { G.toast('Fehler: ' + e.message, 'err'); }
    }
    async function exportZip() {
      var z = new G.ZipWriter();
      fonts.forEach(function (f) {
        var sh = fontSheet(rom.data, f, 16);
        z.add(f.id + '_' + f.count + 'zeichen.png', G.pngWriteIndexed(sh.px, sh.w, sh.h, fontPal(), false));
      });
      G.download('schriften.zip', z.build(), 'application/zip');
      G.toast(fonts.length + ' Schriften exportiert.');
    }
  }
});

G.findFonts = findFonts;
G.fontSheet = fontSheet;
G.fontSheetToRom = sheetToRom;
G.fontPal = fontPal;
})(window);
