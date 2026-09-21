/* GTA Advance Studio - Sprites, Menue-/Vollbilder */
(function (global) {
'use strict';
var G = global.GTAS, el = G.el, App = G.App;
G.cache = G.cache || {};

/* --------------------------------------------------------------- Analyse */
async function ensureScan() {
  if (G.cache.gfx) return G.cache.gfx;
  G.busy('Grafiken werden gesucht ... (einmalig, dauert einige Sekunden)');
  await G.yieldUI();
  var r = await G.gfx.scanAssets(App.rom, function (f, t) { G.busyProgress(f, t); });
  G.cache.gfx = r;
  G.busy(false);
  G.toast('Gefunden: ' + r.assets.filter(function (a) { return a.kind === 'sprite'; }).length + ' Sprites, '
    + r.assets.filter(function (a) { return a.kind === 'screen'; }).length + ' Vollbilder, '
    + r.palettes.length + ' Paletten.');
  return r;
}
G.ensureGfxScan = ensureScan;

/* Palette eines Assets ermitteln (mit Ersatz) */
function palOf(a, override) {
  var d = App.rom.data, po = (override !== undefined && override !== null) ? override : (a.pal ? a.pal.off : null);
  var n = a.kind === 'screen' ? 128 : 16;
  if (po === null || po === undefined || !G.isPal(d, po, n)) return G.grayPal(n);
  return G.readPal(d, po, n);
}
G.gfxPalOf = palOf;

/* Asset als Indexbild */
function assetCanvasPx(a) {
  var out = G.gfx.assetOut(App.rom.data, a, a.off);
  if (!out) return null;
  return G.framesToCanvas(out, a.frames, a.bpp);
}
G.assetCanvasPx = assetCanvasPx;

function drawToCanvas(cv, px, w, h, pal, transparent0) {
  cv.width = w; cv.height = h;
  var ctx = cv.getContext('2d'), img = ctx.createImageData(w, h), D = img.data;
  for (var i = 0; i < w * h; i++) {
    var v = px[i], c = pal[v] || [255, 0, 255];
    D[i * 4] = c[0]; D[i * 4 + 1] = c[1]; D[i * 4 + 2] = c[2];
    D[i * 4 + 3] = (transparent0 && v === 0) ? 0 : 255;
  }
  ctx.putImageData(img, 0, 0);
}
G.drawToCanvas = drawToCanvas;

/* ------------------------------------------------------------- Import-Kern */
function pngToIndices(png, base, pal, byColor, warn) {
  var W = base.w, H = base.h;
  if (png.w !== W || png.h !== H) throw new Error('Bildgroesse ' + png.w + 'x' + png.h + ', erwartet ' + W + 'x' + H);
  var n = pal.length, i;
  if (png.mode === 'P' && !byColor) {
    var mx = 0;
    for (i = 0; i < png.idx.length; i++) if (png.idx[i] > mx) mx = png.idx[i];
    if (mx >= n) throw new Error('Palettenindex ' + mx + ' im PNG, erlaubt sind 0..' + (n - 1));
    if (png.pal) {
      var same = true;
      for (i = 0; i < n && same; i++) {
        var pc = png.pal[i] || [0, 0, 0];
        if (pc[0] !== pal[i][0] || pc[1] !== pal[i][1] || pc[2] !== pal[i][2]) same = false;
      }
      if (!same && warn) warn('PNG-Palette weicht ab - es werden die Palettenindizes verwendet. '
        + 'Farben aenderst du ueber die Palette im Studio oder per Farbabgleich.');
    }
    return png.idx;
  }
  /* Farbabgleich */
  var out = new Uint8Array(W * H), far = 0, cacheMap = new Map();
  var rgba = png.rgba;
  for (i = 0; i < W * H; i++) {
    var r = rgba[i * 4], g = rgba[i * 4 + 1], b = rgba[i * 4 + 2], al = rgba[i * 4 + 3];
    if (al < 128) { out[i] = 0; continue; }
    var key = (r << 16) | (g << 8) | b, hit = cacheMap.get(key);
    if (hit === undefined) {
      var best = 1, bd = 1e9;
      for (var k = 1; k < n; k++) {
        var dr = pal[k][0] - r, dg = pal[k][1] - g, db = pal[k][2] - b, dd = dr * dr + dg * dg + db * db;
        if (dd < bd) { bd = dd; best = k; }
      }
      if (bd > 900) far++;
      hit = best; cacheMap.set(key, best);
    }
    out[i] = hit;
  }
  if (far && warn) warn(far + ' Farben lagen weit ausserhalb der Palette und wurden auf die naechste gerundet.');
  return out;
}
G.pngToIndices = pngToIndices;

/* Neue Bilddaten in die ROM schreiben (in place oder verschoben) */
function writeAsset(rom, a, newOut, alloc, report) {
  var blob = (a.comp === 'raw') ? newOut : G.rleEncode(newOut);
  if (blob.length <= a.slot) {
    rom.data.set(blob, a.off);
    for (var i = blob.length; i < a.slot; i++) rom.data[a.off + i] = 0;
    report.push(a.id + ': an Ort und Stelle (' + blob.length + '/' + a.slot + ' Bytes)');
    return true;
  }
  if (!a.refs || !a.refs.length) {
    report.push('FEHLER ' + a.id + ': ' + blob.length + ' Bytes, Platz ' + a.slot + ', keine Pointer bekannt - nicht verschiebbar');
    return false;
  }
  var no = alloc.alloc(blob.length);
  if (no < 0) {
    report.push('FEHLER ' + a.id + ': kein freier Platz mehr (ROM unter "ROM & Projekt" auf 32 MB erweitern)');
    return false;
  }
  rom.data.set(blob, no);
  for (var k = 0; k < a.refs.length; k++) G.putU32(rom.data, a.refs[k], G.BASE + no);
  a.off = no; a.slot = G.align4(blob.length);
  report.push(a.id + ': verschoben nach ' + G.hx(no) + ' (' + blob.length + ' Bytes, ' + a.refs.length + ' Pointer angepasst)');
  return true;
}
G.writeAsset = writeAsset;

/* Import eines PNG in ein Asset (inkl. Duplikat-Abgleich) */
async function importPngToAsset(a, pngBytes, opts) {
  var rom = App.rom, scan = G.cache.gfx;
  var png = G.pngRead(pngBytes);
  var base = assetCanvasPx(a);
  var pal = palOf(a);
  var warns = [];
  var idx = pngToIndices(png, base, pal, opts && opts.byColor, function (m) { warns.push(m); });
  var maxv = 0; for (var i = 0; i < idx.length; i++) if (idx[i] > maxv) maxv = idx[i];
  if (a.bpp === 4 && maxv > 15) throw new Error('Palettenindex > 15 - 4bpp erlaubt nur 16 Farben');
  if (a.bpp === 8 && maxv > 127) throw new Error('Palettenindex > 127 - Vollbilder erlauben nur 128 Farben');
  var oldOut = G.gfx.assetOut(rom.data, a, a.off);
  var newOut = G.canvasToOut(idx, base.w, a.frames, a.bpp, oldOut);
  if (G.bytesEqual(newOut, oldOut)) return { changed: 0, report: [a.id + ': unveraendert'], warns: warns };

  var alloc = (opts && opts.alloc) || new G.Allocator(rom, false), report = [], ok = 0, targets = [a];
  if (a.group && !(opts && opts.noSyncDups)) {
    scan.assets.forEach(function (y) { if (y !== a && y.group === a.group) targets.push(y); });
  }
  targets.forEach(function (t) { if (writeAsset(rom, t, newOut, alloc, report)) ok++; });
  G.updateStatus();
  return { changed: ok, report: report, warns: warns };
}
G.importPngToAsset = importPngToAsset;

/* ------------------------------------------------------------------ Ansicht */
function buildGfxTab(kind, title, lead) {
  return function (v) {
    var state = G.cache['gfxui_' + kind] || (G.cache['gfxui_' + kind] = { page: 0, q: '', sel: null, size: 'alle', zoom: 2 });

    v.appendChild(el('h2', { text: title }));
    v.appendChild(el('p', { class: 'lead', text: lead }));

    var body = el('div');
    v.appendChild(body);

    if (!G.cache.gfx) {
      body.appendChild(el('div', { class: 'card' }, [
        el('p', { text: 'Die ROM muss einmalig nach Grafiken durchsucht werden. Das Ergebnis bleibt fuer diese Sitzung gespeichert.' }),
        el('button', { class: 'primary', text: 'Grafiken suchen', onclick: async function () { await ensureScan(); G.refreshTab(); } })
      ]));
      return;
    }

    var all = G.cache.gfx.assets.filter(function (a) { return a.kind === kind; });
    render();

    function filtered() {
      var q = state.q.trim().toLowerCase();
      return all.filter(function (a) {
        if (state.size !== 'alle' && a.dims !== state.size) return false;
        if (!q) return true;
        return a.id.indexOf(q) >= 0 || a.dims.indexOf(q) >= 0 || (a.group || '').indexOf(q) >= 0
          || G.hex(a.off, 6).toLowerCase().indexOf(q) >= 0;
      });
    }

    function render() {
      G.clear(body);
      var list = filtered();
      var PER = 240, pages = Math.max(1, Math.ceil(list.length / PER));
      if (state.page >= pages) state.page = 0;

      /* Werkzeugleiste */
      var sizes = {}; all.forEach(function (a) { sizes[a.dims] = (sizes[a.dims] || 0) + 1; });
      var sizeSel = el('select', { onchange: function () { state.size = this.value; state.page = 0; render(); } });
      sizeSel.appendChild(el('option', { value: 'alle', text: 'alle Groessen (' + all.length + ')' }));
      Object.keys(sizes).sort(function (x, y) { return sizes[y] - sizes[x]; }).forEach(function (s) {
        sizeSel.appendChild(el('option', { value: s, text: s + '  (' + sizes[s] + ')' }));
      });
      sizeSel.value = state.size;

      var q = el('input', { type: 'search', placeholder: 'Suche: Name, Offset, Gruppe ...', value: state.q, style: 'width:230px',
        oninput: function () { state.q = this.value; state.page = 0; render(); } });

      var zoomSel = el('select', { onchange: function () { state.zoom = +this.value; render(); } });
      [1, 2, 3, 4].forEach(function (z) { zoomSel.appendChild(el('option', { value: z, text: z + 'x' })); });
      zoomSel.value = state.zoom;

      var tb = el('div', { class: 'toolbar' }, [
        q, sizeSel,
        el('span', { class: 'mut', text: 'Zoom' }), zoomSel,
        el('span', { class: 'sep' }),
        el('button', { text: 'Alle als ZIP exportieren', onclick: function () { exportZip(list); } }),
        el('button', { text: 'PNG-Dateien importieren', onclick: function () { importMany(list); } }),
        el('span', { class: 'spacer' }),
        el('span', { class: 'pill', text: list.length + ' Eintraege' })
      ]);
      body.appendChild(tb);

      var split = el('div', { class: 'split' });
      var left = el('div', { style: 'flex:1;min-width:0' });
      var side = el('div', { class: 'side' });
      split.appendChild(left); split.appendChild(side);
      body.appendChild(split);

      var grid = el('div', { class: 'gridwrap' });
      grid.style.setProperty('--cw', (kind === 'screen' ? 200 : 96) + 'px');
      var page = list.slice(state.page * PER, state.page * PER + PER);
      page.forEach(function (a) {
        var t = el('div', { class: 'tile' + (state.sel === a ? ' sel' : ''), onclick: function () { state.sel = a; render(); } });
        var cv = el('canvas');
        var px = assetCanvasPx(a);
        if (px) {
          drawToCanvas(cv, px.px, px.w, px.h, palOf(a), true);
          cv.style.width = Math.min(px.w * state.zoom, kind === 'screen' ? 240 : 88) + 'px';
        }
        t.appendChild(cv);
        t.appendChild(el('small', { text: a.dims + (a.group ? ' · ' + a.group : '') }));
        t.appendChild(el('small', { class: 'mono', text: G.hex(a.off, 6) }));
        grid.appendChild(t);
      });
      left.appendChild(grid);

      if (pages > 1) {
        var pg = el('div', { class: 'row', style: 'margin-top:10px;justify-content:center' });
        pg.appendChild(el('button', { text: '‹ zurueck', onclick: function () { if (state.page > 0) { state.page--; render(); } } }));
        pg.appendChild(el('span', { class: 'mut', text: 'Seite ' + (state.page + 1) + ' / ' + pages }));
        pg.appendChild(el('button', { text: 'weiter ›', onclick: function () { if (state.page < pages - 1) { state.page++; render(); } } }));
        left.appendChild(pg);
      }

      side.appendChild(detailPanel(state.sel, render));
    }

    function detailPanel(a, redraw) {
      var box = el('div', { class: 'card sticky' });
      if (!a) { box.appendChild(el('p', { class: 'hint', text: 'Links eine Grafik anklicken, um sie zu bearbeiten.' })); return box; }
      box.appendChild(el('h4', { text: a.id }));
      var px = assetCanvasPx(a);
      var cv = el('canvas', { style: 'width:100%;max-width:260px;image-rendering:pixelated;background:repeating-conic-gradient(#3a3f4b 0 25%,#2e333d 0 50%) 0 0/12px 12px;border-radius:6px' });
      if (px) drawToCanvas(cv, px.px, px.w, px.h, palOf(a), true);
      box.appendChild(cv);

      var kv = el('div', { class: 'kv', style: 'margin-top:10px' });
      function add(k, val) { kv.appendChild(el('b', { text: k })); kv.appendChild(el('span', { class: 'mono', text: val })); }
      add('Offset', G.hx(a.off));
      add('Format', (a.comp === 'raw' ? 'unkomprimiert' : 'BIOS-RLE') + ', ' + a.bpp + 'bpp');
      add('Groesse', a.dims + '  (' + a.outSize + ' Byte entpackt)');
      add('Platz', a.slot + ' Byte');
      add('Pointer', a.refs.length + (a.refs.length ? ' (' + a.refs.slice(0, 3).map(function (x) { return G.hx(x); }).join(', ') + (a.refs.length > 3 ? ' ...' : '') + ')' : ''));
      if (a.group) add('Duplikatgruppe', a.group);
      box.appendChild(kv);

      /* Palettenwahl */
      if (a.palVariants && a.palVariants.length > 1) {
        var ps = el('select', { onchange: function () { a.pal = { off: +this.value, n: a.pal.n, fallback: false }; redraw(); } });
        a.palVariants.forEach(function (p) { ps.appendChild(el('option', { value: p, text: G.hx(p) })); });
        ps.value = a.pal.off;
        box.appendChild(el('div', { class: 'row', style: 'margin-top:8px' }, [el('span', { class: 'mut', text: 'Palette' }), ps]));
      } else if (a.pal && a.pal.fallback) {
        box.appendChild(el('p', { class: 'hint', text: 'Keine eindeutige Palette gefunden - angezeigt wird eine Ersatzpalette. Die Indizes stimmen trotzdem.' }));
      }

      /* Palettenfelder */
      if (a.pal && a.pal.off !== null && a.pal.off !== undefined) {
        var pal = palOf(a), pr = el('div', { class: 'palrow', style: 'margin-top:8px' });
        pal.forEach(function (c, i) {
          var sw = el('div', { class: 'swatch', title: 'Index ' + i + ' - ' + c.join(','),
            style: 'background:rgb(' + c.join(',') + ')' });
          sw.onclick = function () { editColor(a, i); };
          pr.appendChild(sw);
        });
        box.appendChild(el('h4', { text: 'Palette ' + G.hx(a.pal.off), style: 'margin-top:12px' }));
        box.appendChild(pr);
        box.appendChild(el('p', { class: 'hint', text: 'Auf ein Feld klicken, um die Farbe zu aendern. Mehrere Sprites koennen sich eine Palette teilen.' }));
      }

      var rowBtns = el('div', { class: 'row', style: 'margin-top:12px' }, [
        el('button', { class: 'primary', text: 'PNG exportieren', onclick: function () { exportOne(a); } }),
        el('button', { text: 'PNG importieren', onclick: function () { importOne(a, redraw); } })
      ]);
      box.appendChild(rowBtns);
      box.appendChild(el('div', { class: 'row', style: 'margin-top:6px' }, [
        el('label', { class: 'chk' }, [
          (function () { var c = el('input', { type: 'checkbox' }); c.checked = !!G.cache.byColor; c.onchange = function () { G.cache.byColor = c.checked; }; return c; })(),
          el('span', { text: 'Beim Import Farben zuordnen statt Indizes' })
        ])
      ]));
      return box;
    }

    async function editColor(a, i) {
      var pal = palOf(a), c = pal[i];
      var inp = el('input', { type: 'color', value: '#' + [c[0], c[1], c[2]].map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join('') });
      var wrap = el('div', {}, [el('p', { text: 'Farbe ' + i + ' der Palette ' + G.hx(a.pal.off) + '. Der GBA speichert 15 Bit - die Farbe wird gerundet.' }), inp]);
      var ok = await G.modal('Farbe aendern', wrap, [{ label: 'Abbrechen', value: false }, { label: 'Uebernehmen', value: true, primary: true }]);
      if (!ok) return;
      var hexv = inp.value, r = parseInt(hexv.substr(1, 2), 16), g = parseInt(hexv.substr(3, 2), 16), b = parseInt(hexv.substr(5, 2), 16);
      G.putU16(App.rom.data, a.pal.off + i * 2, G.rgbToC15(r, g, b));
      G.toast('Palettenfarbe geaendert.'); G.updateStatus(); render();
    }

    function exportOne(a) {
      var px = assetCanvasPx(a), pal = palOf(a);
      var png = G.pngWriteIndexed(px.px, px.w, px.h, pal, a.kind === 'sprite');
      G.download(a.id + '_' + a.dims + '.png', png, 'image/png');
    }

    async function importOne(a, redraw) {
      var f = await G.pickFile('.png');
      if (!f) return;
      try {
        var bytes = await G.readFileBytes(f);
        var r = await importPngToAsset(a, bytes, { byColor: !!G.cache.byColor });
        if (!r.changed) { G.toast('Keine Aenderung erkannt.'); return; }
        var msg = r.report.join('\n') + (r.warns.length ? '\n\n' + r.warns.join('\n') : '');
        await G.modal('Import abgeschlossen', el('pre', { class: 'mono', style: 'white-space:pre-wrap', text: msg }), [{ label: 'OK', value: true, primary: true }]);
        redraw();
      } catch (e) { G.toast('Import fehlgeschlagen: ' + e.message, 'err'); }
    }

    async function exportZip(list) {
      G.busy('PNG-Dateien werden erzeugt ...');
      await G.yieldUI();
      var z = new G.ZipWriter();
      for (var i = 0; i < list.length; i++) {
        var a = list[i], px = assetCanvasPx(a);
        if (!px) continue;
        z.add(a.id + '_' + a.dims + '.png', G.pngWriteIndexed(px.px, px.w, px.h, palOf(a), a.kind === 'sprite'));
        if ((i & 63) === 0) { G.busyProgress(i / list.length, 'PNG ' + i + ' / ' + list.length); await G.yieldUI(); }
      }
      /* Paletten als JASC-.pal beilegen */
      var seen = {};
      list.forEach(function (a) {
        if (!a.pal || a.pal.off === null || a.pal.off === undefined || seen[a.pal.off]) return;
        seen[a.pal.off] = 1;
        var pal = palOf(a), txt = 'JASC-PAL\r\n0100\r\n' + pal.length + '\r\n' + pal.map(function (c) { return c.join(' '); }).join('\r\n') + '\r\n';
        z.add('palettes/pal_' + G.hex(a.pal.off, 6).toLowerCase() + '.pal', new TextEncoder().encode(txt));
      });
      var blob = z.build();
      G.busy(false);
      G.download(kind + '_export.zip', blob, 'application/zip');
      G.toast(list.length + ' Grafiken exportiert.');
    }

    async function importMany(list) {
      var files = await G.pickFile('.png', true);
      if (!files || !files.length) return;
      var byId = {};
      list.forEach(function (a) { byId[a.id] = a; });
      G.busy('PNG-Dateien werden eingespielt ...');
      await G.yieldUI();
      var report = [], done = 0, fail = 0;
      for (var i = 0; i < files.length; i++) {
        var f = files[i], m = /((?:spr|scr)_[0-9a-f]{6})/i.exec(f.name);
        if (!m || !byId[m[1].toLowerCase()]) { report.push('uebersprungen: ' + f.name + ' (kein passender Name)'); continue; }
        try {
          var bytes = await G.readFileBytes(f);
          var r = await importPngToAsset(byId[m[1].toLowerCase()], bytes, { byColor: !!G.cache.byColor });
          if (r.changed) { done++; report = report.concat(r.report); }
        } catch (e) { fail++; report.push('FEHLER ' + f.name + ': ' + e.message); }
        G.busyProgress(i / files.length, 'Datei ' + (i + 1) + ' / ' + files.length);
        if ((i & 7) === 0) await G.yieldUI();
      }
      G.busy(false);
      await G.modal('Import: ' + done + ' geaendert, ' + fail + ' Fehler',
        el('pre', { class: 'mono', style: 'white-space:pre-wrap;font-size:12px', text: report.join('\n') || 'nichts geaendert' }),
        [{ label: 'OK', value: true, primary: true }]);
      G.refreshTab();
    }
  };
}

G.registerTab({
  id: 'gfx', label: 'Sprites', icon: '▦', needsRom: true,
  render: buildGfxTab('sprite', 'Sprites',
    'Autos, Figuren, Waffen, Effekte und Objekte - 4bpp mit 16 Farben. Als PNG exportieren, bearbeiten und wieder einspielen. '
    + 'Wird eine Grafik nach dem Packen groesser, verschiebt das Studio sie ans ROM-Ende und passt alle Pointer an.')
});

G.registerTab({
  id: 'screens', label: 'Vollbilder (Raeume)', icon: '▣', needsRom: true,
  render: buildGfxTab('screen', 'Vollbilder (Innenraeume)',
    'Zehn bildschirmfuellende 240x160-Grafiken mit 128-Farben-Palette - die begehbaren Innenraeume. '
    + 'Titelbild, Logo und die uebrigen Menuebilder liegen in einem anderen Format und stehen unter "Menue-Grafiken". '
    + 'Identische Kopien werden beim Import automatisch mitgezogen.')
});

})(window);
