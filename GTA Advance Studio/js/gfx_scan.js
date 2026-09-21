/* GTA Advance Studio - gfx_scan.js
   Findet Sprites (4bpp, BIOS-RLE oder roh) und 240x160-Vollbilder (8bpp) in der ROM.
   Portierung des erprobten Verfahrens aus gta_adv_tex.py. */
(function (global) {
'use strict';
var G = global.GTAS;

var SPRITE_SCAN_MIN = 0x700000;
var SCREEN_W = 240, SCREEN_H = 160;

function spriteRecord(d, locs, total) {
  /* Record: [w][h][0][0][Pointer][Groesse]; Groesse == w*h/2 (ein Frame) oder == Gesamtgroesse.
     total > 0: RLE-Fall, die Gesamtgroesse muss ein Vielfaches der Framegroesse sein.
     total = 0: unkomprimierter Fall, nur die Framegroesse zaehlt. */
  if (!locs) return null;
  for (var i = 0; i < locs.length; i++) {
    var loc = locs[i], rc = loc - 4;
    if (rc < 0 || loc + 8 > d.length) continue;
    var w = d[rc], h = d[rc + 1];
    if (!w || !h || (w & 7) || (h & 7)) continue;
    var fb = w * h / 2, sz = G.u32(d, rc + 8), ok;
    if (total > 0) ok = (total % fb === 0) && (sz === fb || sz === total);
    else ok = (sz === fb);
    if (ok) return { rc: rc, w: w, h: h, fb: fb, loc: loc };
  }
  return null;
}

function framesFor(w, h, fb, n) {
  var k = Math.floor(n / fb), frames = [];
  for (var i = 0; i < k; i++) {
    var fw = w, fh = h;
    if (i === 1 && k === 2 && w !== h) { fw = h; fh = w; }
    frames.push({ w: fw, h: fh, boff: i * fb });
  }
  return frames;
}

async function scanAssets(rom, onProgress) {
  var d = rom.data, res = [];
  /* 1) Pointer-Index */
  if (onProgress) onProgress(0.02, 'Pointer-Index wird aufgebaut ...');
  await G.yieldUI();
  var refs = new Map();
  var n4 = d.length >> 2;
  for (var i = 0; i < n4; i++) {
    var o = i << 2;
    if (d[o + 3] !== 0x08) continue;
    var t = d[o] | (d[o + 1] << 8) | (d[o + 2] << 16);
    if (t >= d.length) continue;
    var a = refs.get(t);
    if (a) a.push(o); else refs.set(t, [o]);
  }
  if (onProgress) onProgress(0.25, 'Sprites werden gesucht ...');
  await G.yieldUI();

  var targets = [];
  refs.forEach(function (v, k) { if (k >= SPRITE_SCAN_MIN) targets.push(k); });
  targets.sort(function (a, b) { return a - b; });

  /* 2) Sprites */
  var tick = 0;
  for (var ti = 0; ti < targets.length; ti++) {
    var off = targets[ti];
    if (off + 4 > d.length) continue;
    if ((++tick & 2047) === 0) { if (onProgress) onProgress(0.25 + 0.5 * ti / targets.length, 'Sprites: ' + res.length + ' gefunden'); await G.yieldUI(); }
    var comp = null, out = null, cons = 0, rec = null;
    if (!(off & 3) && d[off] === 0x30) {
      var r = G.rleDecode(d, off, 0x8000);
      if (r && r.data.length >= 32 && r.data.length % 32 === 0) {
        rec = spriteRecord(d, refs.get(off), r.data.length);
        if (rec) { comp = 'rle'; out = r.data; cons = r.used; }
      }
    }
    if (!rec) {
      rec = spriteRecord(d, refs.get(off), 0);
      if (rec && off + rec.fb <= d.length) { comp = 'raw'; out = d.subarray(off, off + rec.fb); cons = rec.fb; }
      else continue;
    }
    var nn = out.length, fb = rec.fb;
    var frames = framesFor(rec.w, rec.h, fb, nn);
    var slot;
    if (comp === 'raw') slot = nn;
    else {
      var end = G.align4(off + cons);
      slot = (rec.rc >= off + cons ? Math.min(end, rec.rc) : end) - off;
    }
    /* Paletten ueber die Zeiger-Kette Record <- Tabelle <- Objekt(+4) */
    var pals = [];
    var tl = refs.get(rec.rc);
    if (tl) for (var a1 = 0; a1 < tl.length; a1++) {
      var fl = refs.get(tl[a1]);
      if (!fl) continue;
      for (var b1 = 0; b1 < fl.length; b1++) {
        var f = fl[b1];
        if (f + 8 > d.length) continue;
        var v = G.u32(d, f + 4);
        if (v >>> 24 === 0x08) {
          var po = v & 0xFFFFFF;
          if (po < d.length && G.isPal(d, po, 16) && pals.indexOf(po) < 0) pals.push(po);
        }
      }
    }
    pals.sort(function (x, y) { return x - y; });
    res.push({
      kind: 'sprite', comp: comp, off: off, cons: cons, slot: slot, outSize: nn,
      bpp: 4, frames: frames, record: rec.rc, refs: refs.get(off).slice(), palVariants: pals
    });
  }

  /* 3) Vollbilder 240x160 */
  if (onProgress) onProgress(0.8, 'Vollbilder werden gesucht ...');
  await G.yieldUI();
  var starts = [];
  for (var s = 0; s < targets.length; s++) {
    var so = targets[s];
    if ((so & 3) || so + 4 > d.length || d[so] !== 0x30) continue;
    if ((d[so + 1] | (d[so + 2] << 8) | (d[so + 3] << 16)) === SCREEN_W * SCREEN_H) starts.push(so);
  }
  var seen = {}, screens = [];
  for (var si = 0; si < starts.length; si++) {
    var o2 = starts[si];
    while (!seen[o2]) {
      var rr = G.rleDecode(d, o2, 0x40000);
      if (!rr || rr.data.length !== SCREEN_W * SCREEN_H) break;
      var pal = G.align4(o2 + rr.used);
      if (!G.isPal(d, pal, 128)) break;
      seen[o2] = 1;
      screens.push({
        kind: 'screen', comp: 'rle', off: o2, cons: rr.used, slot: pal - o2, outSize: rr.data.length,
        bpp: 8, frames: [{ w: SCREEN_W, h: SCREEN_H, boff: 0 }],
        refs: (refs.get(o2) || []).slice(), pal: { off: pal, n: 128 }, palVariants: [pal]
      });
      o2 = pal + 256;
    }
  }
  screens.sort(function (a, b) { return a.off - b.off; });
  res = res.concat(screens);

  /* 4) Paletten zuordnen */
  if (onProgress) onProgress(0.9, 'Paletten werden zugeordnet ...');
  await G.yieldUI();
  var sorted = res.slice().sort(function (a, b) { return a.off - b.off; });
  var last = null;
  for (var k2 = 0; k2 < sorted.length; k2++) {
    var x = sorted[k2];
    if (x.kind !== 'sprite') continue;
    if (x.palVariants.length) { x.pal = { off: x.palVariants[0], n: 16, fallback: false }; last = x.palVariants[0]; }
    else x.pal = { off: last, n: 16, fallback: true };
  }

  /* 5) Duplikat-Gruppen */
  if (onProgress) onProgress(0.95, 'Duplikate werden erkannt ...');
  await G.yieldUI();
  var groups = new Map();
  for (var k3 = 0; k3 < res.length; k3++) {
    var y = res[k3];
    var data = assetOut(d, y, y.off);
    y.outSha1 = G.sha1(data);
    var key = y.kind + '|' + y.outSha1 + '|' + JSON.stringify(y.frames);
    var g = groups.get(key);
    if (g) g.push(y); else groups.set(key, [y]);
  }
  var gid = 0;
  groups.forEach(function (lst) {
    if (lst.length > 1) { gid++; var nm = 'dup' + ('00' + gid).slice(-3); lst.forEach(function (z) { z.group = nm; }); }
    else lst[0].group = null;
  });

  /* 6) Namen */
  res.forEach(function (x) {
    var f = x.frames[0], dims = f.w + 'x' + f.h;
    if (x.frames.length === 2) dims += '+' + x.frames[1].w + 'x' + x.frames[1].h;
    else if (x.frames.length > 2) dims += '_x' + x.frames.length;
    x.id = (x.kind === 'sprite' ? 'spr_' : 'scr_') + G.hex(x.off, 6).toLowerCase();
    x.dims = dims;
    x.file = (x.kind === 'sprite' ? 'sprites/' : 'screens/') + x.id + '_' + dims + '.png';
  });
  res.sort(function (a, b) { return a.off - b.off; });

  /* 7) Palettenliste */
  var palSet = new Map();
  res.forEach(function (x) {
    (x.palVariants || []).forEach(function (po) {
      var nCol = (x.kind === 'sprite') ? 16 : 128;
      if (!palSet.has(po)) palSet.set(po, nCol);
    });
    if (x.pal && x.pal.off !== null && x.pal.off !== undefined && !x.pal.fallback) palSet.set(x.pal.off, x.pal.n);
  });
  var pals2 = [];
  palSet.forEach(function (nCol, po) { pals2.push({ off: po, n: nCol }); });
  pals2.sort(function (a, b) { return a.off - b.off; });

  if (onProgress) onProgress(1, 'fertig');
  return { assets: res, palettes: pals2, refs: refs };
}

/* Unkomprimierte Kacheldaten eines Assets lesen */
function assetOut(d, x, off) {
  off = (off === undefined || off === null) ? x.off : off;
  if (x.comp === 'raw') return d.subarray(off, off + x.outSize);
  var r = G.rleDecode(d, off, 0x40000);
  return r ? r.data : null;
}

G.gfx = {
  scanAssets: scanAssets,
  assetOut: assetOut,
  SPRITE_SCAN_MIN: SPRITE_SCAN_MIN,
  SCREEN_W: SCREEN_W, SCREEN_H: SCREEN_H
};

})(window);
