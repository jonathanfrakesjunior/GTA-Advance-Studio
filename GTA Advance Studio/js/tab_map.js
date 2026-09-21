/* GTA Advance Studio - Karten-Editor (3 Level) */
(function (global) {
'use strict';
var G = global.GTAS, el = G.el, App = G.App;
G.cache = G.cache || {};

/* Lage der Objekt- und Zonenlisten (aus der ROM verifiziert) */
var LEVELS = {
  1: { objOff: 0x8DCC48, objN: 360, zoneOff: 0x8EE2D8, zoneN: 5 },
  2: { objOff: 0x9AF180, objN: 355, zoneOff: 0x9B87C0, zoneN: 2 },
  3: { objOff: 0xA5B9F8, objN: 255, zoneOff: 0xA649F8, zoneN: 2 }
};
var MINI = 8;                       /* Pixel pro Zelle in der Uebersichtsebene */
var MASKN = { 0: 'begehbar', 11: 'gesperrt' };

/* Gebaeude-/Flaechentypen ergeben sich aus Kollision und Hoehe. Die Einteilung
   stammt aus der Auswertung aller drei Inseln: Kollision kennt nur 0 und 11,
   die Hoehe im Wesentlichen 0 (Strassenebene), 16 (Gehweg-/Gebaeudeebene)
   und 32 (obere Ebene); dazwischenliegende Werte sind Rampen. */
var KINDS = [
  { id: 'strasse',   name: 'Strasse',                  color: '#5a5f6b', desc: 'Hoehe 0, begehbar - Fahrbahn' },
  { id: 'gehweg',    name: 'Gehweg / Freiflaeche',     color: '#7fb04e', desc: 'Hoehe 16, begehbar' },
  { id: 'gebaeude',  name: 'Gebaeude / Sperre',        color: '#c0553f', desc: 'Hoehe 16, gesperrt' },
  { id: 'oben',      name: 'Obere Ebene',              color: '#4da3ff', desc: 'Hoehe 32, begehbar' },
  { id: 'obensperr', name: 'Obere Ebene, gesperrt',    color: '#8f6bd8', desc: 'Hoehe 32, gesperrt' },
  { id: 'rampe',     name: 'Rampe / Uebergang',        color: '#ffc24d', desc: 'Zwischenhoehen' },
  { id: 'sperre0',   name: 'Sperre auf Strassenebene', color: '#2b4a8f', desc: 'Hoehe 0, gesperrt - Wasser, Randsperren' }
];
var KINDBY = {};
KINDS.forEach(function (k) { KINDBY[k.id] = k; });

function cellKind(mask, h) {
  if (h === 0) return mask ? 'sperre0' : 'strasse';
  if (h === 16) return mask ? 'gebaeude' : 'gehweg';
  if (h === 32) return mask ? 'obensperr' : 'oben';
  return 'rampe';
}
G.mapCellKind = cellKind;
G.mapKinds = KINDS;

/* Standalone-Zugriff auf eine Insel, unabhaengig vom Editor-Zwischenspeicher */
G.mapReadLevel = function (rom, lv) {
  var T = G.TILES[lv], d = rom.data, N = T.w * T.h, i;
  var cells = new Uint16Array(N), mask = new Uint8Array(N), hmap = new Uint8Array(N);
  for (i = 0; i < N; i++) cells[i] = G.u16(d, T.off.cells + i * 2);
  mask.set(d.subarray(T.off.mask, T.off.mask + N));
  hmap.set(d.subarray(T.off.layerB, T.off.layerB + N));
  var L = LEVELS[lv], objects = [], zones = [];
  for (i = 0; i < L.objN; i++) {
    var o = L.objOff + i * 16;
    objects.push([G.u16(d, o + 4), G.u16(d, o + 6), G.u16(d, o + 8), G.u16(d, o + 10)]);
  }
  for (i = 0; i < L.zoneN; i++) {
    var z = L.zoneOff + i * 12;
    zones.push([G.u16(d, z), G.u16(d, z + 2), G.u16(d, z + 4), G.u16(d, z + 6), G.u16(d, z + 8), G.u16(d, z + 10)]);
  }
  return { level: lv, w: T.w, h: T.h, cells: cells, mask: mask, hmap: hmap, objects: objects, zones: zones };
};
G.mapWriteLevel = function (rom, lv, m) {
  var T = G.TILES[lv], d = rom.data, N = T.w * T.h, i;
  if (m.cells && m.cells.length === N) for (i = 0; i < N; i++) G.putU16(d, T.off.cells + i * 2, m.cells[i]);
  if (m.mask && m.mask.length === N) d.set(m.mask, T.off.mask);
  if (m.hmap && m.hmap.length === N) d.set(m.hmap, T.off.layerB);
  var L = LEVELS[lv];
  if (m.objects) m.objects.forEach(function (a, k) {
    if (k >= L.objN) return;
    var o = L.objOff + k * 16;
    G.putU16(d, o + 4, a[0]); G.putU16(d, o + 6, a[1]); G.putU16(d, o + 8, a[2]);
    if (a.length > 3) G.putU16(d, o + 10, a[3]);
  });
  if (m.zones) m.zones.forEach(function (a, k) {
    if (k >= L.zoneN) return;
    var z = L.zoneOff + k * 12;
    G.putU16(d, z, a[0]); G.putU16(d, z + 2, a[1]); G.putU16(d, z + 4, a[2]);
    G.putU16(d, z + 6, a[3]); G.putU16(d, z + 8, a[4]);
    if (a.length > 5) G.putU16(d, z + 10, a[5]);
  });
};

/* Pruefen, ob hinter einer Liste der erwartete Deskriptor {Anzahl, Zeiger} steht */
function verifyList(d, off, n, rec) {
  var end = off + n * rec;
  if (end + 8 > d.length) return false;
  return G.u32(d, end) === n && G.u32(d, end + 4) === (G.BASE + off);
}

function loadLevel(lv) {
  var key = 'map' + lv;
  if (G.cache[key]) return G.cache[key];
  var T = G.TILES[lv], d = App.rom.data, N = T.w * T.h;
  var m = {
    lv: lv, w: T.w, h: T.h, N: N, T: T,
    cells: new Uint16Array(N), mask: new Uint8Array(N), hmap: new Uint8Array(N),
    objects: [], zones: [], info: LEVELS[lv], undo: [], redo: []
  };
  var i;
  for (i = 0; i < N; i++) m.cells[i] = G.u16(d, T.off.cells + i * 2);
  m.mask.set(d.subarray(T.off.mask, T.off.mask + N));
  m.hmap.set(d.subarray(T.off.layerB, T.off.layerB + N));
  var L = LEVELS[lv];
  m.objOk = verifyList(d, L.objOff, L.objN, 16);
  m.zoneOk = verifyList(d, L.zoneOff, L.zoneN, 12);
  for (i = 0; i < L.objN; i++) {
    var o = L.objOff + i * 16;
    m.objects.push({ i: i, off: o, x: G.u16(d, o + 4), y: G.u16(d, o + 6), type: G.u16(d, o + 8), flags: G.u16(d, o + 10) });
  }
  for (i = 0; i < L.zoneN; i++) {
    var z = L.zoneOff + i * 12;
    m.zones.push({ i: i, off: z, id: G.u16(d, z), x0: G.u16(d, z + 2), y0: G.u16(d, z + 4), x1: G.u16(d, z + 6), y1: G.u16(d, z + 8), f: G.u16(d, z + 10) });
  }
  m.valMap = {};
  T.values.forEach(function (v) { m.valMap[v.v] = v; });
  /* Zu jedem Zellwert die vorherrschende Flaechenart bestimmen - daraus wird
     die nach Gebaeudetypen sortierte Kachelauswahl gebaut. */
  var per = {};
  for (i = 0; i < N; i++) {
    var v = m.cells[i], k = cellKind(m.mask[i], m.hmap[i]);
    var e = per[v] || (per[v] = { n: 0, kinds: {} });
    e.n++; e.kinds[k] = (e.kinds[k] || 0) + 1;
  }
  m.kindOf = {};
  T.values.forEach(function (vd) {
    var e = per[vd.v];
    if (!e) {
      /* kommt auf dieser Insel nicht vor - aus den Standardwerten ableiten */
      m.kindOf[vd.v] = cellKind(maskFor(m, vd.v), heightFor(m, vd.v));
      vd.used = 0;
      return;
    }
    var best = null, bn = -1;
    for (var k in e.kinds) if (e.kinds[k] > bn) { bn = e.kinds[k]; best = k; }
    m.kindOf[vd.v] = best;
    vd.used = e.n;
  });
  G.cache[key] = m;
  return m;
}

/* Standardwerte fuer Kollision und Hoehe eines Zellwerts (aus der Kartenauswertung) */
function maskFor(m, v) {
  var mm = m.T.maskMajor[String(v)];
  if (mm !== undefined) return mm;
  var t = (v >> 7) & 7;
  return (t === 2 || t === 3 || t === 5) ? 11 : 0;
}
function heightFor(m, v) {
  var hm = m.T.hMajor[String(v)];
  if (hm !== undefined) return hm;
  return ((v >> 7) & 7) === 4 ? 0 : 16;
}

function atlasFor(lv) {
  var k = 'atlas' + lv;
  if (G.cache[k]) return G.cache[k];
  var img = new Image();
  img.src = G.TILES[lv].atlas;
  G.cache[k] = img;
  return img;
}

function avgColor(m, val) {
  var v = m.valMap[val];
  if (v && v.avg) return 'rgb(' + v.avg.join(',') + ')';
  var t = (val >> 7) & 7, lo = val & 0x7F, va = val >> 10;
  return 'hsl(' + ((t * 45 + va * 7) % 360) + ',35%,' + (22 + (lo % 12) * 3) + '%)';
}

G.registerTab({
  id: 'map', label: 'Karten-Editor', icon: '◰', needsRom: true,
  render: function (v) {
    var st = G.cache.mapui || (G.cache.mapui = {
      lv: 1, layer: 'cells', tool: 'pen', brush: 1, grid: false,
      view: 'textur', showObj: true, showZone: true,
      cur: null, curMask: 0, curH: 0, kindFilter: 'alle', palQ: '',
      linkKind: true, recent: [],
      zoom: 3, ox: 0, oy: 0, sel: null, selRect: null, clip: null
    });
    var m = loadLevel(st.lv);
    var atlas = atlasFor(st.lv);

    v.appendChild(el('h2', { text: 'Karten-Editor' }));
    var warn = [];
    if (!m.objOk) warn.push('Objektliste konnte nicht verifiziert werden');
    if (!m.zoneOk) warn.push('Zonenliste konnte nicht verifiziert werden');
    if (warn.length) v.appendChild(el('div', { class: 'card warnc', text: warn.join(' · ') + ' - Werte trotzdem bearbeitbar, aber bitte pruefen.' }));

    /* ---------------- Werkzeugleisten ---------------- */
    var bar = el('div', { class: 'toolbar' });
    var bar2 = el('div', { class: 'toolbar' });
    v.appendChild(bar); v.appendChild(bar2);

    /* ---------------- Aufbau ---------------- */
    var stage = el('div', { id: 'mapstage' });
    var cv = el('canvas', { id: 'mapcv' });
    var hint = el('div', { class: 'maphint' });
    stage.appendChild(cv); stage.appendChild(hint);
    var side = el('div', { class: 'side', style: 'width:330px' });
    v.appendChild(el('div', { class: 'split' }, [stage, side]));

    var miniCv = el('canvas', { class: 'minimap', width: 150, height: 150 });
    var inspBox = el('div', { class: 'card', style: 'padding:9px 11px' });
    var legendBox = el('div', { class: 'card', style: 'padding:9px 11px' });
    var palHead = el('div', { class: 'row tight', style: 'margin-bottom:6px' });
    var palBox = el('div', { class: 'palgrid' });
    var extraBox = el('div', { class: 'card', style: 'padding:9px 11px' });
    side.appendChild(el('div', { class: 'card', style: 'padding:9px 11px' }, [
      el('h4', { text: 'Uebersicht' }), miniCv,
      el('p', { class: 'hint', style: 'margin:5px 0 0', text: 'Klicken springt zu dieser Stelle.' })
    ]));
    side.appendChild(inspBox);
    side.appendChild(legendBox);
    side.appendChild(el('div', { class: 'card', style: 'padding:9px 11px' }, [palHead, palBox]));
    side.appendChild(extraBox);

    var status = el('div', { class: 'mapstatus mono' });
    v.appendChild(status);

    /* Uebersichtsebene (Texturen) */
    var mini = document.createElement('canvas');
    mini.width = m.w * MINI; mini.height = m.h * MINI;
    var mctx = mini.getContext('2d');
    mctx.imageSmoothingEnabled = false;
    var ctx = cv.getContext('2d');
    var built = false;

    function drawMiniCell(x, y) {
      var val = m.cells[y * m.w + x], vd = m.valMap[val], cols = m.T.atlasCols;
      mctx.clearRect(x * MINI, y * MINI, MINI, MINI);
      if (vd && vd.tex >= 0 && atlas.complete && atlas.naturalWidth) {
        mctx.drawImage(atlas, (vd.tex % cols) * 40, ((vd.tex / cols) | 0) * 40, 40, 40, x * MINI, y * MINI, MINI, MINI);
      } else { mctx.fillStyle = avgColor(m, val); mctx.fillRect(x * MINI, y * MINI, MINI, MINI); }
    }
    function buildMini() {
      for (var y = 0; y < m.h; y++) for (var x = 0; x < m.w; x++) drawMiniCell(x, y);
      built = true;
    }

    /* ---------------- Zeichnen ---------------- */
    function kindColor(i) { return KINDBY[cellKind(m.mask[i], m.hmap[i])].color; }

    function draw() {
      if (!built) buildMini();
      var z = st.zoom;
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = '#0b0d11'; ctx.fillRect(0, 0, cv.width, cv.height);
      var x0 = Math.max(0, Math.floor(-st.ox / z)), y0 = Math.max(0, Math.floor(-st.oy / z));
      var x1 = Math.min(m.w, Math.ceil((cv.width - st.ox) / z)), y1 = Math.min(m.h, Math.ceil((cv.height - st.oy) / z));
      var x, y, i;

      if (st.view === 'textur' || st.view === 'mix') {
        if (z > MINI * 1.5 && atlas.complete && atlas.naturalWidth) {
          var cols = m.T.atlasCols;
          for (y = y0; y < y1; y++) for (x = x0; x < x1; x++) {
            var val = m.cells[y * m.w + x], vd = m.valMap[val];
            var px = st.ox + x * z, py = st.oy + y * z;
            if (vd && vd.tex >= 0) ctx.drawImage(atlas, (vd.tex % cols) * 40, ((vd.tex / cols) | 0) * 40, 40, 40, px, py, z + 1, z + 1);
            else { ctx.fillStyle = avgColor(m, val); ctx.fillRect(px, py, z + 1, z + 1); }
          }
        } else {
          ctx.drawImage(mini, x0 * MINI, y0 * MINI, (x1 - x0) * MINI, (y1 - y0) * MINI,
            st.ox + x0 * z, st.oy + y0 * z, (x1 - x0) * z, (y1 - y0) * z);
        }
      }
      if (st.view === 'typen' || st.view === 'mix') {
        ctx.globalAlpha = st.view === 'mix' ? 0.55 : 1;
        for (y = y0; y < y1; y++) for (x = x0; x < x1; x++) {
          i = y * m.w + x;
          ctx.fillStyle = kindColor(i);
          ctx.fillRect(st.ox + x * z, st.oy + y * z, z + 1, z + 1);
        }
        ctx.globalAlpha = 1;
      }
      if (st.view === 'kollision') {
        for (y = y0; y < y1; y++) for (x = x0; x < x1; x++) {
          i = y * m.w + x;
          ctx.fillStyle = m.mask[i] ? '#c0553f' : '#3f7a4a';
          ctx.fillRect(st.ox + x * z, st.oy + y * z, z + 1, z + 1);
        }
      }
      if (st.view === 'hoehe') {
        for (y = y0; y < y1; y++) for (x = x0; x < x1; x++) {
          i = y * m.w + x;
          var hv = Math.min(255, m.hmap[i] * 6);
          ctx.fillStyle = 'rgb(' + hv + ',' + hv + ',' + Math.min(255, hv + 30) + ')';
          ctx.fillRect(st.ox + x * z, st.oy + y * z, z + 1, z + 1);
        }
      }

      /* Raster */
      if (st.grid && z >= 6) {
        ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1; ctx.beginPath();
        for (var gx = x0; gx <= x1; gx++) { var pxx = Math.round(st.ox + gx * z) + .5; ctx.moveTo(pxx, st.oy + y0 * z); ctx.lineTo(pxx, st.oy + y1 * z); }
        for (var gy = y0; gy <= y1; gy++) { var pyy = Math.round(st.oy + gy * z) + .5; ctx.moveTo(st.ox + x0 * z, pyy); ctx.lineTo(st.ox + x1 * z, pyy); }
        ctx.stroke();
      }
      /* Zonen */
      var sc = z / (m.T.worldW / m.w);
      if (st.showZone) {
        ctx.lineWidth = 2;
        m.zones.forEach(function (zz) {
          ctx.strokeStyle = '#4da3ff'; ctx.fillStyle = 'rgba(77,163,255,.12)';
          var X = st.ox + zz.x0 * sc, Y = st.oy + zz.y0 * sc, W = (zz.x1 - zz.x0) * sc, H = (zz.y1 - zz.y0) * sc;
          ctx.fillRect(X, Y, W, H); ctx.strokeRect(X, Y, W, H);
          if (z > 2) { ctx.fillStyle = '#9ecbff'; ctx.font = '11px sans-serif'; ctx.fillText('Zone ' + zz.id, X + 3, Y + 12); }
        });
      }
      /* Objekte */
      if (st.showObj) {
        m.objects.forEach(function (o) {
          var X = st.ox + o.x * sc, Y = st.oy + o.y * sc;
          if (X < -10 || Y < -10 || X > cv.width + 10 || Y > cv.height + 10) return;
          var selected = st.sel && st.sel.kind === 'obj' && st.sel.o === o;
          ctx.fillStyle = selected ? '#ff8a2b' : '#ffc24d';
          ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(X, Y, Math.max(2.5, Math.min(7, z / 5)), 0, 6.283); ctx.fill(); ctx.stroke();
        });
      }
      /* Auswahl */
      if (st.selRect) {
        var r2 = st.selRect;
        ctx.strokeStyle = '#ff8a2b'; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.5;
        ctx.strokeRect(st.ox + r2.x * z, st.oy + r2.y * z, r2.w * z, r2.h * z);
        ctx.setLineDash([]);
      }
      drawMini();
    }

    function drawMini() {
      var g = miniCv.getContext('2d');
      g.imageSmoothingEnabled = false;
      var s = Math.min(miniCv.width / m.w, miniCv.height / m.h);
      var ow = m.w * s, oh = m.h * s, offx = (miniCv.width - ow) / 2, offy = (miniCv.height - oh) / 2;
      g.fillStyle = '#0b0d11'; g.fillRect(0, 0, miniCv.width, miniCv.height);
      if (st.view === 'typen' || st.view === 'kollision' || st.view === 'hoehe') {
        var cell = Math.max(1, Math.ceil(s));
        for (var y = 0; y < m.h; y++) for (var x = 0; x < m.w; x++) {
          var i = y * m.w + x;
          g.fillStyle = st.view === 'kollision' ? (m.mask[i] ? '#c0553f' : '#3f7a4a')
            : st.view === 'hoehe' ? (function () { var hv = Math.min(255, m.hmap[i] * 6); return 'rgb(' + hv + ',' + hv + ',' + Math.min(255, hv + 30) + ')'; })()
            : kindColor(i);
          g.fillRect(offx + x * s, offy + y * s, cell, cell);
        }
      } else {
        g.drawImage(mini, 0, 0, mini.width, mini.height, offx, offy, ow, oh);
      }
      /* Sichtfenster */
      var vx = (-st.ox / st.zoom), vy = (-st.oy / st.zoom);
      var vw = cv.width / st.zoom, vh = cv.height / st.zoom;
      g.strokeStyle = '#ff8a2b'; g.lineWidth = 1.5;
      g.strokeRect(offx + vx * s, offy + vy * s, vw * s, vh * s);
      miniCv.__geo = { s: s, offx: offx, offy: offy };
    }
    miniCv.onclick = function (e) {
      var geo = miniCv.__geo; if (!geo) return;
      var r = miniCv.getBoundingClientRect();
      var cx = (e.clientX - r.left - geo.offx) / geo.s, cy = (e.clientY - r.top - geo.offy) / geo.s;
      st.ox = cv.width / 2 - cx * st.zoom; st.oy = cv.height / 2 - cy * st.zoom;
      draw();
    };

    function resize() {
      var r = stage.getBoundingClientRect();
      cv.width = Math.max(50, r.width | 0); cv.height = Math.max(50, r.height | 0);
      draw();
    }
    function fit() {
      var r = stage.getBoundingClientRect();
      st.zoom = Math.max(0.5, Math.min(r.width / m.w, r.height / m.h));
      st.ox = (r.width - m.w * st.zoom) / 2; st.oy = (r.height - m.h * st.zoom) / 2;
      draw(); buildBars();
    }
    function zoomBy(f) {
      var cx = cv.width / 2, cy = cv.height / 2;
      var nz = Math.max(0.25, Math.min(64, st.zoom * f));
      st.ox = cx - (cx - st.ox) * (nz / st.zoom);
      st.oy = cy - (cy - st.oy) * (nz / st.zoom);
      st.zoom = nz; draw(); buildBars();
    }

    /* ---------------- Werkzeugleisten aufbauen ---------------- */
    function tbtn(id, label, title) {
      return el('button', { class: st.tool === id ? 'on' : '', title: title, text: label,
        onclick: function () { st.tool = id; buildBars(); } });
    }
    function buildBars() {
      G.clear(bar); G.clear(bar2);

      var lvSel = el('select', { title: 'Insel waehlen', onchange: function () { st.lv = +this.value; st.sel = null; st.selRect = null; G.refreshTab(); } });
      [1, 2, 3].forEach(function (l) { lvSel.appendChild(el('option', { value: l, text: 'Insel ' + l + ' (' + G.TILES[l].w + 'x' + G.TILES[l].h + ')' })); });
      lvSel.value = st.lv;
      bar.appendChild(el('span', { class: 'mut', text: 'Insel' })); bar.appendChild(lvSel);
      bar.appendChild(el('span', { class: 'sep' }));

      bar.appendChild(el('span', { class: 'mut', text: 'Bearbeiten' }));
      [['cells', 'Kacheln', 'Was auf der Zelle steht'],
       ['mask', 'Kollision', 'Begehbar oder gesperrt'],
       ['hmap', 'Hoehe', 'Ebene B - Hoehenstufe']].forEach(function (o) {
        bar.appendChild(el('button', { class: st.layer === o[0] ? 'on' : '', text: o[1], title: o[2],
          onclick: function () { st.layer = o[0]; buildBars(); buildPalette(); } }));
      });
      bar.appendChild(el('span', { class: 'sep' }));
      bar.appendChild(tbtn('pen', '✎ Stift', 'Taste P'));
      bar.appendChild(tbtn('line', '╱ Linie', 'Taste L'));
      bar.appendChild(tbtn('rect', '▭ Rechteck', 'Taste R'));
      bar.appendChild(tbtn('fill', '◉ Fuellen', 'Taste F'));
      bar.appendChild(tbtn('pick', '⌘ Pipette', 'Taste I'));
      bar.appendChild(tbtn('sel', '⬚ Auswahl', 'Taste S - dann Strg+C / Strg+V / Entf'));
      bar.appendChild(tbtn('hand', '✋ Schieben', 'Taste H - oder Leertaste halten'));
      var bs = el('select', { title: 'Pinselgroesse', onchange: function () { st.brush = +this.value; } });
      [1, 2, 3, 5, 8].forEach(function (b) { bs.appendChild(el('option', { value: b, text: b + 'x' + b })); });
      bs.value = st.brush;
      bar.appendChild(el('span', { class: 'mut', text: 'Pinsel' })); bar.appendChild(bs);

      /* Zweite Leiste: Ansicht und Aktionen */
      bar2.appendChild(el('span', { class: 'mut', text: 'Ansicht' }));
      [['textur', 'Texturen', 'Kachelgrafik wie im Spiel'],
       ['typen', 'Gebaeudetypen', 'Faerbt jede Zelle nach Strasse, Gehweg, Gebaeude, Rampe ...'],
       ['mix', 'Textur + Typ', 'Beides uebereinander'],
       ['kollision', 'Kollision', 'begehbar / gesperrt'],
       ['hoehe', 'Hoehe', 'Ebene B als Graustufen']].forEach(function (o) {
        bar2.appendChild(el('button', { class: st.view === o[0] ? 'on' : '', text: o[1], title: o[2],
          onclick: function () { st.view = o[0]; buildBars(); buildLegend(); draw(); } }));
      });
      bar2.appendChild(el('span', { class: 'sep' }));
      [['grid', 'Raster', 'Taste G'], ['showObj', 'Objekte', ''], ['showZone', 'Zonen', '']].forEach(function (o) {
        bar2.appendChild(el('button', { class: st[o[0]] ? 'on' : '', text: o[1], title: o[2],
          onclick: function () { st[o[0]] = !st[o[0]]; buildBars(); draw(); } }));
      });
      bar2.appendChild(el('span', { class: 'sep' }));
      bar2.appendChild(el('button', { text: '↶', title: 'Rueckgaengig (Strg+Z)', onclick: undo }));
      bar2.appendChild(el('button', { text: '↷', title: 'Wiederholen (Strg+Y)', onclick: redo }));
      bar2.appendChild(el('button', { text: '−', title: 'Verkleinern', onclick: function () { zoomBy(0.5); } }));
      bar2.appendChild(el('span', { class: 'mut', text: st.zoom.toFixed(1) + 'x' }));
      bar2.appendChild(el('button', { text: '+', title: 'Vergroessern', onclick: function () { zoomBy(2); } }));
      bar2.appendChild(el('button', { text: 'Einpassen', onclick: fit }));
      bar2.appendChild(el('span', { class: 'spacer' }));
      bar2.appendChild(el('button', { class: 'primary', text: 'In ROM schreiben', onclick: writeRom }));
      bar2.appendChild(el('button', { text: 'JSON', title: 'Karte als Datei speichern', onclick: saveJson }));
      bar2.appendChild(el('button', { text: 'Laden', title: 'Karte aus Datei laden', onclick: loadJson }));
      bar2.appendChild(el('button', { text: 'PNG', title: 'Uebersichtsbild speichern', onclick: savePng }));
      bar2.appendChild(el('button', { class: 'danger', text: 'Original', title: 'Diese Insel zuruecksetzen', onclick: resetLevel }));
    }

    /* ---------------- Legende ---------------- */
    function buildLegend() {
      G.clear(legendBox);
      var counts = {};
      for (var i = 0; i < m.N; i++) { var k = cellKind(m.mask[i], m.hmap[i]); counts[k] = (counts[k] || 0) + 1; }
      if (st.view === 'kollision') {
        legendBox.appendChild(el('h4', { text: 'Legende: Kollision' }));
        [['#3f7a4a', 'begehbar (0)'], ['#c0553f', 'gesperrt (11)']].forEach(function (o) {
          legendBox.appendChild(el('div', { class: 'legrow' }, [el('span', { class: 'legsw', style: 'background:' + o[0] }), el('span', { text: o[1] })]));
        });
        return;
      }
      if (st.view === 'hoehe') {
        legendBox.appendChild(el('h4', { text: 'Legende: Hoehe (Ebene B)' }));
        var hs = {};
        for (var j = 0; j < m.N; j++) hs[m.hmap[j]] = (hs[m.hmap[j]] || 0) + 1;
        Object.keys(hs).map(Number).sort(function (a, b) { return hs[b] - hs[a]; }).slice(0, 6).forEach(function (h) {
          var hv = Math.min(255, h * 6);
          legendBox.appendChild(el('div', { class: 'legrow' }, [
            el('span', { class: 'legsw', style: 'background:rgb(' + hv + ',' + hv + ',' + Math.min(255, hv + 30) + ')' }),
            el('span', { text: 'Hoehe ' + h }), el('span', { class: 'legn', text: hs[h].toLocaleString('de-DE') })
          ]));
        });
        return;
      }
      legendBox.appendChild(el('h4', { text: 'Legende: Flaechen- und Gebaeudetypen' }));
      KINDS.forEach(function (k) {
        if (!counts[k.id]) return;
        legendBox.appendChild(el('div', { class: 'legrow', title: k.desc }, [
          el('span', { class: 'legsw', style: 'background:' + k.color }),
          el('span', { text: k.name }),
          el('span', { class: 'legn', text: counts[k.id].toLocaleString('de-DE') })
        ]));
      });
      legendBox.appendChild(el('p', { class: 'hint', style: 'margin:6px 0 0',
        text: 'Der Typ ergibt sich aus Kollision und Hoehe der Zelle, nicht aus der Kachelgrafik.' }));
    }

    /* ---------------- Kachelauswahl ---------------- */
    function buildPalette() {
      G.clear(palHead); G.clear(palBox);
      if (st.layer === 'cells') {
        palHead.appendChild(el('h4', { text: 'Kacheln', style: 'margin:0;flex:1' }));
        var q = el('input', { type: 'search', placeholder: 'Wert ...', value: st.palQ, style: 'width:92px;min-height:26px;padding:2px 6px',
          oninput: function () { st.palQ = this.value; fillTiles(); } });
        palHead.appendChild(q);
        var kf = el('select', { style: 'min-height:26px;padding:2px 4px', onchange: function () { st.kindFilter = this.value; fillTiles(); } });
        kf.appendChild(el('option', { value: 'alle', text: 'alle Typen' }));
        KINDS.forEach(function (k) { kf.appendChild(el('option', { value: k.id, text: k.name })); });
        kf.value = st.kindFilter;
        palHead.appendChild(kf);
        fillTiles();
      } else {
        palHead.appendChild(el('h4', { text: st.layer === 'mask' ? 'Kollisionswerte' : 'Hoehenwerte', style: 'margin:0;flex:1' }));
        fillValues();
      }
    }

    function tileCanvas(vd, size) {
      var c = el('canvas', { width: 40, height: 40 });
      var g2 = c.getContext('2d'); g2.imageSmoothingEnabled = false;
      if (vd.tex >= 0 && atlas.complete && atlas.naturalWidth) {
        g2.drawImage(atlas, (vd.tex % m.T.atlasCols) * 40, ((vd.tex / m.T.atlasCols) | 0) * 40, 40, 40, 0, 0, 40, 40);
      } else { g2.fillStyle = avgColor(m, vd.v); g2.fillRect(0, 0, 40, 40); }
      if (size) c.style.width = c.style.height = size + 'px';
      return c;
    }

    function fillTiles() {
      G.clear(palBox);
      var q = st.palQ.trim().toLowerCase();
      var vals = m.T.values.filter(function (vd) {
        if (st.kindFilter !== 'alle' && m.kindOf[vd.v] !== st.kindFilter) return false;
        if (!q) return true;
        return String(vd.v).indexOf(q) >= 0 || G.hex(vd.v, 4).toLowerCase().indexOf(q) >= 0;
      });
      if (st.recent.length) {
        palBox.appendChild(el('div', { class: 'palgroup', text: 'zuletzt benutzt' }));
        st.recent.slice(0, 8).forEach(function (val) {
          var vd = m.valMap[val]; if (vd) palBox.appendChild(tileItem(vd));
        });
      }
      /* nach Flaechentyp gruppieren, innerhalb nach Haeufigkeit */
      var groups = {};
      vals.forEach(function (vd) { (groups[m.kindOf[vd.v]] = groups[m.kindOf[vd.v]] || []).push(vd); });
      KINDS.forEach(function (k) {
        var g = groups[k.id];
        if (!g || !g.length) return;
        g.sort(function (a, b) { return (b.used || 0) - (a.used || 0); });
        palBox.appendChild(el('div', { class: 'palgroup' }, [
          el('span', { class: 'legsw', style: 'background:' + k.color }),
          el('span', { text: k.name + '  (' + g.length + ')' })
        ]));
        g.forEach(function (vd) { palBox.appendChild(tileItem(vd)); });
      });
      if (!palBox.children.length) palBox.appendChild(el('p', { class: 'hint', text: 'Keine Kachel passt zum Filter.' }));
    }
    function tileItem(vd) {
      var k = KINDBY[m.kindOf[vd.v]];
      var it = el('div', { class: 'palit' + (st.cur === vd.v ? ' sel' : ''),
        title: 'Wert ' + G.hx(vd.v, 4) + ' · ' + (k ? k.name : '') + ' · ' + (vd.used || 0) + 'x auf dieser Insel',
        onclick: function () { selectTile(vd.v); } });
      it.appendChild(tileCanvas(vd));
      it.appendChild(el('small', { text: G.hex(vd.v, 4) }));
      if (k) it.appendChild(el('span', { class: 'palkind', style: 'background:' + k.color }));
      return it;
    }
    function selectTile(val) {
      st.cur = val;
      st.recent = [val].concat(st.recent.filter(function (x) { return x !== val; })).slice(0, 8);
      if (st.linkKind) { st.curMask = maskFor(m, val); st.curH = heightFor(m, val); }
      buildPalette(); updateInspector();
    }

    function fillValues() {
      var a = st.layer === 'mask' ? m.mask : m.hmap, used = {};
      for (var i = 0; i < m.N; i++) used[a[i]] = (used[a[i]] || 0) + 1;
      var cur = st.layer === 'mask' ? st.curMask : st.curH;
      Object.keys(used).map(Number).sort(function (x, y) { return used[y] - used[x]; }).forEach(function (val) {
        var it = el('div', { class: 'palit' + (cur === val ? ' sel' : ''), onclick: function () {
          if (st.layer === 'mask') st.curMask = val; else st.curH = val;
          buildPalette(); updateInspector();
        } });
        var c = el('canvas', { width: 40, height: 40 }), g2 = c.getContext('2d');
        g2.fillStyle = st.layer === 'mask' ? (val ? '#c0553f' : '#3f7a4a')
          : (function () { var hv = Math.min(255, val * 6); return 'rgb(' + hv + ',' + hv + ',' + Math.min(255, hv + 30) + ')'; })();
        g2.fillRect(0, 0, 40, 40);
        g2.fillStyle = '#fff'; g2.font = 'bold 14px sans-serif'; g2.textAlign = 'center';
        g2.fillText(String(val), 20, 26);
        it.appendChild(c);
        it.appendChild(el('small', { text: (st.layer === 'mask' && MASKN[val]) ? MASKN[val] : used[val].toLocaleString('de-DE') + 'x' }));
        palBox.appendChild(it);
      });
      var free = el('input', { type: 'number', min: 0, max: 255, value: cur, style: 'width:100%;margin-top:6px',
        oninput: function () { if (st.layer === 'mask') st.curMask = +this.value; else st.curH = +this.value; updateInspector(); } });
      palBox.appendChild(free);
    }

    /* ---------------- Inspektor ---------------- */
    var hoverCell = null;
    function updateInspector() {
      G.clear(inspBox);
      inspBox.appendChild(el('h4', { text: 'Pinsel & Zelle' }));

      /* Aktueller Pinsel */
      var curVal = st.cur === null ? m.T.defaultValue : st.cur;
      var vd = m.valMap[curVal];
      var brushRow = el('div', { class: 'row tight' });
      if (vd) brushRow.appendChild(tileCanvas(vd, 44));
      var kb = KINDBY[m.kindOf[curVal]];
      brushRow.appendChild(el('div', { style: 'flex:1;min-width:0' }, [
        el('div', { class: 'mono', text: 'Kachel ' + G.hx(curVal, 4) }),
        el('div', { class: 'hint', text: kb ? kb.name : '' }),
        el('div', { class: 'hint', text: 'Kollision ' + st.curMask + ' · Hoehe ' + st.curH })
      ]));
      inspBox.appendChild(brushRow);
      var lk = el('input', { type: 'checkbox' });
      lk.checked = st.linkKind;
      lk.onchange = function () { st.linkKind = lk.checked; if (lk.checked && st.cur !== null) selectTile(st.cur); };
      inspBox.appendChild(el('label', { class: 'chk', style: 'margin-top:6px' }, [lk,
        el('span', { text: 'Kollision und Hoehe mitschreiben' })]));
      inspBox.appendChild(el('p', { class: 'hint', style: 'margin:3px 0 0',
        text: 'Damit bekommt eine gemalte Hauskachel automatisch die passende Sperre und Hoehe.' }));

      /* Zelle unter dem Zeiger */
      var c = hoverCell;
      var box = el('div', { style: 'margin-top:9px;border-top:1px solid var(--line);padding-top:7px' });
      if (!c) box.appendChild(el('p', { class: 'hint', text: 'Zeiger ueber die Karte bewegen ...' }));
      else {
        var i = c.i, k2 = KINDBY[cellKind(m.mask[i], m.hmap[i])];
        var vd2 = m.valMap[m.cells[i]];
        var row = el('div', { class: 'row tight' });
        if (vd2) row.appendChild(tileCanvas(vd2, 44));
        row.appendChild(el('div', { style: 'flex:1;min-width:0' }, [
          el('div', { class: 'mono', text: 'Zelle ' + c.x + ', ' + c.y }),
          el('div', { class: 'mono hint', text: 'Wert ' + G.hx(m.cells[i], 4) }),
          el('div', { class: 'hint' }, [el('span', { class: 'legsw', style: 'background:' + (k2 ? k2.color : '#666') }), el('span', { text: k2 ? k2.name : '' })]),
          el('div', { class: 'hint', text: 'Kollision ' + m.mask[i] + ' · Hoehe ' + m.hmap[i] }),
          el('div', { class: 'hint', text: 'Welt ' + (c.x * (m.T.worldW / m.w)) + ', ' + (c.y * (m.T.worldH / m.h)) })
        ]));
        box.appendChild(row);
      }
      inspBox.appendChild(box);
    }

    function updateExtra() {
      G.clear(extraBox);
      extraBox.appendChild(el('div', { class: 'row tight' }, [
        el('span', { class: 'pill', text: m.w + 'x' + m.h + ' Zellen' }),
        el('span', { class: 'pill', text: m.objects.length + ' Objekte' }),
        el('span', { class: 'pill', text: m.zones.length + ' Zonen' }),
        el('span', { class: 'pill', text: m.undo.length + ' Schritte' })
      ]));
      if (st.sel && st.sel.kind === 'obj') {
        var o = st.sel.o;
        extraBox.appendChild(el('h4', { text: 'Objekt #' + o.i, style: 'margin-top:10px' }));
        [['x', 'X (Welt)'], ['y', 'Y (Welt)'], ['type', 'Typ'], ['flags', 'Flags']].forEach(function (f) {
          var inp = el('input', { type: 'number', value: o[f[0]], min: 0, max: 65535, style: 'width:100%',
            oninput: function () { o[f[0]] = +this.value | 0; draw(); } });
          extraBox.appendChild(el('div', { class: 'langbox' }, [el('span', { class: 'lg', text: f[1] }), inp]));
        });
        extraBox.appendChild(el('button', { text: 'Auswahl aufheben', style: 'margin-top:4px',
          onclick: function () { st.sel = null; updateExtra(); draw(); } }));
      }
      extraBox.appendChild(el('h4', { text: 'Zonen', style: 'margin-top:10px' }));
      var zt = el('table', { class: 'tbl' });
      zt.appendChild(el('tr', {}, [el('th', { text: 'ID' }), el('th', { text: 'x0' }), el('th', { text: 'y0' }), el('th', { text: 'x1' }), el('th', { text: 'y1' })]));
      m.zones.forEach(function (zz) {
        var tr = el('tr');
        ['id', 'x0', 'y0', 'x1', 'y1'].forEach(function (f) {
          var td = el('td');
          td.appendChild(el('input', { type: 'number', value: zz[f], style: 'width:62px;min-height:24px;padding:2px 4px',
            oninput: function () { zz[f] = +this.value | 0; draw(); } }));
          tr.appendChild(td);
        });
        zt.appendChild(tr);
      });
      extraBox.appendChild(zt);
    }

    function updateStatus(c) {
      var parts = ['Insel ' + m.lv, st.zoom.toFixed(1) + 'x'];
      if (c) parts.push('Zelle ' + c.x + ',' + c.y, 'Wert ' + G.hx(m.cells[c.i], 4),
        G.t(KINDBY[cellKind(m.mask[c.i], m.hmap[c.i])].name));
      parts.push(m.undo.length ? m.undo.length + ' Aenderungsschritte' : 'unveraendert');
      status.textContent = parts.map(G.t).join('   ·   ');
    }

    /* ---------------- Eingabe ---------------- */
    function cellAt(ev) {
      var r = cv.getBoundingClientRect();
      var x = Math.floor((ev.clientX - r.left - st.ox) / st.zoom);
      var y = Math.floor((ev.clientY - r.top - st.oy) / st.zoom);
      if (x < 0 || y < 0 || x >= m.w || y >= m.h) return null;
      return { x: x, y: y, i: y * m.w + x };
    }
    function curValue() {
      if (st.layer === 'cells') return st.cur === null ? m.T.defaultValue : st.cur;
      if (st.layer === 'mask') return st.curMask;
      return st.curH;
    }
    function arr(layer) { layer = layer || st.layer; return layer === 'cells' ? m.cells : layer === 'mask' ? m.mask : m.hmap; }

    var stroke = null, drag = null, spaceDown = false;
    function beginStroke() { stroke = { ops: [] }; }
    function setCell(layer, i, val) {
      var a = arr(layer);
      if (a[i] === val) return;
      if (stroke) stroke.ops.push({ l: layer, i: i, o: a[i], n: val });
      a[i] = val;
      if (layer === 'cells') drawMiniCell(i % m.w, (i / m.w) | 0);
    }
    /* Beim Malen auf der Kachelebene optional Kollision und Hoehe mitziehen */
    function paintCell(i, val) {
      setCell(st.layer, i, val);
      if (st.layer === 'cells' && st.linkKind) {
        setCell('mask', i, st.curMask);
        setCell('hmap', i, st.curH);
      }
    }
    function endStroke() {
      if (stroke && stroke.ops.length) { m.undo.push(stroke); if (m.undo.length > 150) m.undo.shift(); m.redo.length = 0; }
      stroke = null;
      updateExtra(); buildLegend(); updateStatus(hoverCell);
    }
    function paintBrush(c, val) {
      var b = st.brush, h = (b - 1) >> 1;
      for (var dy = 0; dy < b; dy++) for (var dx = 0; dx < b; dx++) {
        var x = c.x - h + dx, y = c.y - h + dy;
        if (x >= 0 && y >= 0 && x < m.w && y < m.h) paintCell(y * m.w + x, val);
      }
    }
    function lineCells(a, b, cb) {
      var dx = Math.abs(b.x - a.x), dy = Math.abs(b.y - a.y);
      var sx = a.x < b.x ? 1 : -1, sy = a.y < b.y ? 1 : -1, err = dx - dy, x = a.x, y = a.y;
      for (;;) {
        cb({ x: x, y: y, i: y * m.w + x });
        if (x === b.x && y === b.y) break;
        var e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x += sx; }
        if (e2 < dx) { err += dx; y += sy; }
      }
    }
    function flood(c, val) {
      var a = arr(), from = a[c.i];
      if (from === val) return;
      var q = [c.i], seen = new Uint8Array(m.N);
      seen[c.i] = 1;
      while (q.length) {
        var i = q.pop();
        paintCell(i, val);
        var x = i % m.w, y = (i / m.w) | 0;
        if (x > 0 && !seen[i - 1] && a[i - 1] === from) { seen[i - 1] = 1; q.push(i - 1); }
        if (x < m.w - 1 && !seen[i + 1] && a[i + 1] === from) { seen[i + 1] = 1; q.push(i + 1); }
        if (y > 0 && !seen[i - m.w] && a[i - m.w] === from) { seen[i - m.w] = 1; q.push(i - m.w); }
        if (y < m.h - 1 && !seen[i + m.w] && a[i + m.w] === from) { seen[i + m.w] = 1; q.push(i + m.w); }
      }
    }

    cv.addEventListener('pointerdown', function (ev) {
      cv.setPointerCapture(ev.pointerId);
      var c = cellAt(ev);
      if (st.tool === 'hand' || spaceDown || ev.button === 1) { drag = { px: ev.clientX, py: ev.clientY, ox: st.ox, oy: st.oy }; return; }
      if (!c) return;
      if (st.showObj) {
        var sc = st.zoom / (m.T.worldW / m.w), best = null, bd = 1e9, r = cv.getBoundingClientRect();
        m.objects.forEach(function (o) {
          var X = st.ox + o.x * sc, Y = st.oy + o.y * sc;
          var d2 = Math.pow(X - (ev.clientX - r.left), 2) + Math.pow(Y - (ev.clientY - r.top), 2);
          if (d2 < bd) { bd = d2; best = o; }
        });
        if (best && bd < 64) { st.sel = { kind: 'obj', o: best }; updateExtra(); draw(); return; }
      }
      if (st.tool === 'pick') {
        if (st.layer === 'cells') selectTile(m.cells[c.i]);
        else if (st.layer === 'mask') { st.curMask = m.mask[c.i]; buildPalette(); }
        else { st.curH = m.hmap[c.i]; buildPalette(); }
        updateInspector(); return;
      }
      if (st.tool === 'sel') { drag = { sel: true, x0: c.x, y0: c.y }; st.selRect = { x: c.x, y: c.y, w: 1, h: 1 }; draw(); return; }
      if (st.tool === 'fill') { beginStroke(); flood(c, curValue()); endStroke(); draw(); return; }
      if (st.tool === 'line' || st.tool === 'rect') { drag = { shape: st.tool, a: c, b: c }; return; }
      beginStroke(); paintBrush(c, curValue()); draw();
      drag = { paint: true, last: c };
    });
    cv.addEventListener('pointermove', function (ev) {
      var c = cellAt(ev);
      if (c && (!hoverCell || hoverCell.i !== c.i)) { hoverCell = c; updateInspector(); updateStatus(c); }
      if (!drag) return;
      if (drag.ox !== undefined) { st.ox = drag.ox + (ev.clientX - drag.px); st.oy = drag.oy + (ev.clientY - drag.py); draw(); return; }
      if (drag.sel && c) {
        st.selRect = { x: Math.min(drag.x0, c.x), y: Math.min(drag.y0, c.y), w: Math.abs(c.x - drag.x0) + 1, h: Math.abs(c.y - drag.y0) + 1 };
        draw(); return;
      }
      if (drag.shape && c) { drag.b = c; draw(); previewShape(); return; }
      if (drag.paint && c) {
        var val = curValue();
        lineCells(drag.last, c, function (p) { paintBrush(p, val); });
        drag.last = c; draw();
      }
    });
    cv.addEventListener('pointerleave', function () { hoverCell = null; updateInspector(); updateStatus(null); });
    function previewShape() {
      var z = st.zoom;
      ctx.strokeStyle = '#ff8a2b'; ctx.lineWidth = 1.5;
      if (drag.shape === 'rect') {
        var x = Math.min(drag.a.x, drag.b.x), y = Math.min(drag.a.y, drag.b.y);
        ctx.strokeRect(st.ox + x * z, st.oy + y * z, (Math.abs(drag.b.x - drag.a.x) + 1) * z, (Math.abs(drag.b.y - drag.a.y) + 1) * z);
      } else {
        ctx.beginPath();
        ctx.moveTo(st.ox + (drag.a.x + .5) * z, st.oy + (drag.a.y + .5) * z);
        ctx.lineTo(st.ox + (drag.b.x + .5) * z, st.oy + (drag.b.y + .5) * z);
        ctx.stroke();
      }
    }
    cv.addEventListener('pointerup', function () {
      if (drag && drag.shape) {
        var val = curValue();
        beginStroke();
        if (drag.shape === 'line') lineCells(drag.a, drag.b, function (p) { paintBrush(p, val); });
        else {
          var x0 = Math.min(drag.a.x, drag.b.x), x1 = Math.max(drag.a.x, drag.b.x);
          var y0 = Math.min(drag.a.y, drag.b.y), y1 = Math.max(drag.a.y, drag.b.y);
          for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) paintCell(y * m.w + x, val);
        }
        endStroke();
      }
      if (drag && drag.paint) endStroke();
      drag = null; draw();
    });
    cv.addEventListener('wheel', function (ev) {
      ev.preventDefault();
      var r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top;
      var f = ev.deltaY < 0 ? 1.25 : 0.8, nz = Math.max(0.25, Math.min(64, st.zoom * f));
      st.ox = mx - (mx - st.ox) * (nz / st.zoom); st.oy = my - (my - st.oy) * (nz / st.zoom);
      st.zoom = nz; draw(); buildBars();
    }, { passive: false });

    function onKey(e) {
      if (G.App.active !== 'map') return;
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
      var k = e.key.toLowerCase(), ctrl = e.ctrlKey || e.metaKey;
      if (k === ' ') { spaceDown = true; e.preventDefault(); return; }
      if (ctrl && k === 'z') { e.shiftKey ? redo() : undo(); e.preventDefault(); return; }
      if (ctrl && k === 'y') { redo(); e.preventDefault(); return; }
      if (ctrl && k === 'c') { copySel(); e.preventDefault(); return; }
      if (ctrl && k === 'v') { pasteSel(); e.preventDefault(); return; }
      var map = { p: 'pen', l: 'line', r: 'rect', f: 'fill', i: 'pick', s: 'sel', h: 'hand' };
      if (map[k] && !ctrl) { st.tool = map[k]; buildBars(); return; }
      if (k === 'g') { st.grid = !st.grid; buildBars(); draw(); return; }
      if (k === 'delete' && st.selRect) fillSel();
      if (k === 'escape') { st.selRect = null; st.sel = null; updateExtra(); draw(); }
    }
    function onKeyUp(e) { if (e.key === ' ') spaceDown = false; }
    if (G.cache.mapKeys) {
      document.removeEventListener('keydown', G.cache.mapKeys.down);
      document.removeEventListener('keyup', G.cache.mapKeys.up);
    }
    G.cache.mapKeys = { down: onKey, up: onKeyUp };
    document.addEventListener('keydown', onKey);
    document.addEventListener('keyup', onKeyUp);

    function fillSel() {
      var r = st.selRect; if (!r) return;
      var val = curValue();
      beginStroke();
      for (var y = r.y; y < r.y + r.h; y++) for (var x = r.x; x < r.x + r.w; x++) paintCell(y * m.w + x, val);
      endStroke(); draw();
    }
    function copySel() {
      var r = st.selRect; if (!r) { G.toast('Zuerst mit dem Auswahlwerkzeug einen Bereich markieren.'); return; }
      var c = { w: r.w, h: r.h, cells: [], mask: [], hmap: [] };
      for (var y = 0; y < r.h; y++) for (var x = 0; x < r.w; x++) {
        var i = (r.y + y) * m.w + (r.x + x);
        c.cells.push(m.cells[i]); c.mask.push(m.mask[i]); c.hmap.push(m.hmap[i]);
      }
      st.clip = c; G.toast('Bereich ' + r.w + 'x' + r.h + ' kopiert.');
    }
    function pasteSel() {
      var c = st.clip, r = st.selRect;
      if (!c) { G.toast('Zwischenablage ist leer.'); return; }
      if (!r) { G.toast('Zielpunkt mit dem Auswahlwerkzeug markieren.'); return; }
      beginStroke();
      for (var y = 0; y < c.h; y++) for (var x = 0; x < c.w; x++) {
        var tx = r.x + x, ty = r.y + y;
        if (tx >= m.w || ty >= m.h) continue;
        var i = ty * m.w + tx, k = y * c.w + x;
        setCell('cells', i, c.cells[k]);
        setCell('mask', i, c.mask[k]);
        setCell('hmap', i, c.hmap[k]);
      }
      endStroke(); draw(); G.toast('Eingefuegt.');
    }
    function applyOps(s, back) {
      for (var i = back ? s.ops.length - 1 : 0; back ? i >= 0 : i < s.ops.length; back ? i-- : i++) {
        var op = s.ops[i];
        arr(op.l)[op.i] = back ? op.o : op.n;
        if (op.l === 'cells') drawMiniCell(op.i % m.w, (op.i / m.w) | 0);
      }
    }
    function undo() {
      var s = m.undo.pop(); if (!s) { G.toast('Nichts rueckgaengig zu machen.'); return; }
      applyOps(s, true); m.redo.push(s); draw(); updateExtra(); buildLegend(); updateStatus(hoverCell);
    }
    function redo() {
      var s = m.redo.pop(); if (!s) return;
      applyOps(s, false); m.undo.push(s); draw(); updateExtra(); buildLegend(); updateStatus(hoverCell);
    }

    /* ---------------- Speichern ---------------- */
    function writeRom() {
      G.mapWriteLevel(App.rom, m.lv, {
        cells: m.cells, mask: m.mask, hmap: m.hmap,
        objects: m.objects.map(function (o) { return [o.x, o.y, o.type, o.flags]; }),
        zones: m.zones.map(function (z) { return [z.id, z.x0, z.y0, z.x1, z.y1, z.f]; })
      });
      G.updateStatus();
      G.toast('Insel ' + m.lv + ' in die ROM geschrieben.');
    }
    function saveJson() {
      var o = {
        format: 'gta_adv_map/2', level: m.lv, w: m.w, h: m.h, rom_sha1: App.rom.sha1,
        cells: G.b64enc(new Uint8Array(m.cells.buffer, m.cells.byteOffset, m.cells.byteLength)),
        mask: G.b64enc(m.mask), layerB: G.b64enc(m.hmap),
        objects: m.objects.map(function (x) { return [x.x, x.y, x.type, x.flags]; }),
        zones: m.zones.map(function (z) { return [z.id, z.x0, z.y0, z.x1, z.y1, z.f]; })
      };
      G.download('insel' + m.lv + '_karte.json', new TextEncoder().encode(JSON.stringify(o)), 'application/json');
      G.toast('Karte als JSON gespeichert.');
    }
    async function loadJson() {
      var f = await G.pickFile('.json'); if (!f) return;
      try {
        applyMapJson(JSON.parse(await G.readFileText(f)));
        G.toast('Karte geladen. Mit "In ROM schreiben" uebernehmen.');
      } catch (e) { G.toast('Fehler: ' + e.message, 'err'); }
    }
    function applyMapJson(j) {
      if (j.format !== 'gta_adv_map/2' && j.format !== 'gta_adv_map/1') throw new Error('unbekanntes Format');
      if (j.level !== m.lv || j.w !== m.w || j.h !== m.h) throw new Error('gehoert zu einer anderen Insel oder Groesse');
      var nc = G.b64dec(j.cells), nm = G.b64dec(j.mask || j.maskA), nh = G.b64dec(j.layerB);
      m.cells.set(new Uint16Array(nc.buffer, nc.byteOffset, nc.byteLength >> 1));
      if (nm && nm.length === m.N) m.mask.set(nm);
      if (nh && nh.length === m.N) m.hmap.set(nh);
      if (j.objects) j.objects.forEach(function (a, i) {
        if (!m.objects[i]) return;
        m.objects[i].x = a[0]; m.objects[i].y = a[1]; m.objects[i].type = a[2]; if (a.length > 3) m.objects[i].flags = a[3];
      });
      if (j.zones) j.zones.forEach(function (a, i) {
        if (!m.zones[i]) return;
        var z = m.zones[i]; z.id = a[0]; z.x0 = a[1]; z.y0 = a[2]; z.x1 = a[3]; z.y1 = a[4]; if (a.length > 5) z.f = a[5];
      });
      m.undo.length = 0; m.redo.length = 0;
      built = false; draw(); updateExtra(); buildLegend(); buildPalette();
    }
    function savePng() {
      if (!built) buildMini();
      mini.toBlob(function (b) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(b); a.download = 'insel' + m.lv + '_uebersicht.png';
        document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      });
    }
    async function resetLevel() {
      var ok = await G.confirmBox('Original wiederherstellen', 'Insel ' + m.lv + ' wird aus der Original-ROM neu geladen. '
        + 'Aenderungen an dieser Insel gehen verloren (bereits in die ROM geschriebene bleiben, bis du erneut schreibst).');
      if (!ok) return;
      var b = App.rom.base, T = m.T, i;
      for (i = 0; i < m.N; i++) m.cells[i] = G.u16(b, T.off.cells + i * 2);
      m.mask.set(b.subarray(T.off.mask, T.off.mask + m.N));
      m.hmap.set(b.subarray(T.off.layerB, T.off.layerB + m.N));
      m.objects.forEach(function (o) { o.x = G.u16(b, o.off + 4); o.y = G.u16(b, o.off + 6); o.type = G.u16(b, o.off + 8); o.flags = G.u16(b, o.off + 10); });
      m.undo.length = 0; m.redo.length = 0;
      built = false; draw(); updateExtra(); buildLegend(); G.toast('Original wiederhergestellt.');
    }

    /* ---------------- Start ---------------- */
    if (st.cur === null) st.cur = m.T.defaultValue;
    if (st.linkKind) { st.curMask = maskFor(m, st.cur); st.curH = heightFor(m, st.cur); }
    buildBars(); buildLegend(); buildPalette(); updateInspector(); updateExtra(); updateStatus(null);
    if (!atlas.complete) atlas.onload = function () { built = false; draw(); buildPalette(); updateInspector(); };
    setTimeout(function () { resize(); fit(); }, 30);
    if (window.ResizeObserver) new ResizeObserver(function () { resize(); }).observe(stage);
  }
});
})(window);
