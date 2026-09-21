/* GTA Advance Studio - core.js
   Grundbausteine: Bytes, Hash, PNG, ZIP, GBA-Formate, ROM-Verwaltung.
   Laeuft ohne Server direkt aus index.html (klassische Skripte, keine Module). */
(function (global) {
'use strict';

var G = global.GTAS = global.GTAS || {};

/* ---------------------------------------------------------------- Bytes */
function hex(v, n) { var s = (v >>> 0).toString(16).toUpperCase(); while (s.length < (n || 6)) s = '0' + s; return s; }
function hx(v, n) { return '0x' + hex(v, n); }
function u16(d, o) { return d[o] | (d[o + 1] << 8); }
function u32(d, o) { return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) + d[o + 3] * 16777216); }
function s32(d, o) { return (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16) | (d[o + 3] << 24)); }
function putU16(d, o, v) { d[o] = v & 255; d[o + 1] = (v >> 8) & 255; }
function putU32(d, o, v) { d[o] = v & 255; d[o + 1] = (v >>> 8) & 255; d[o + 2] = (v >>> 16) & 255; d[o + 3] = (v / 16777216) & 255; }
function align4(x) { return (x + 3) & ~3; }
function bytesEqual(a, b) { if (a.length !== b.length) return false; for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }

/* Base64 ohne Stack-Ueberlauf */
function b64enc(u8) {
  var s = '', CH = 0x8000;
  for (var i = 0; i < u8.length; i += CH) s += String.fromCharCode.apply(null, u8.subarray(i, i + CH));
  return btoa(s);
}
function b64dec(str) {
  var bin = atob(str), a = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return a;
}

/* ---------------------------------------------------------------- SHA-1 */
function sha1(bytes) {
  var h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476, h4 = 0xC3D2E1F0;
  var ml = bytes.length, total = ((ml + 8) >> 6) + 1, buf = new Uint8Array(total * 64);
  buf.set(bytes); buf[ml] = 0x80;
  var bits = ml * 8, dv = new DataView(buf.buffer);
  dv.setUint32(total * 64 - 8, Math.floor(bits / 4294967296));
  dv.setUint32(total * 64 - 4, bits >>> 0);
  var w = new Int32Array(80);
  for (var i = 0; i < total; i++) {
    var off = i * 64, j;
    for (j = 0; j < 16; j++) w[j] = dv.getInt32(off + j * 4);
    for (j = 16; j < 80; j++) { var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16]; w[j] = (n << 1) | (n >>> 31); }
    var a = h0, b = h1, c = h2, d = h3, e = h4, f, k;
    for (j = 0; j < 80; j++) {
      if (j < 20) { f = (b & c) | (~b & d); k = 0x5A827999; }
      else if (j < 40) { f = b ^ c ^ d; k = 0x6ED9EBA1; }
      else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8F1BBCDC; }
      else { f = b ^ c ^ d; k = 0xCA62C1D6; }
      var t = (((a << 5) | (a >>> 27)) + f + e + k + w[j]) | 0;
      e = d; d = c; c = (b << 30) | (b >>> 2); b = a; a = t;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0; h4 = (h4 + e) | 0;
  }
  function p(x) { var s = (x >>> 0).toString(16); while (s.length < 8) s = '0' + s; return s; }
  return p(h0) + p(h1) + p(h2) + p(h3) + p(h4);
}

/* ---------------------------------------------------------------- CRC32 */
var CRCT = (function () {
  var t = new Uint32Array(256);
  for (var i = 0; i < 256; i++) { var c = i; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[i] = c >>> 0; }
  return t;
})();
function crc32(buf, crc) {
  crc = (crc === undefined ? 0 : crc) ^ 0xFFFFFFFF;
  for (var i = 0; i < buf.length; i++) crc = CRCT[(crc ^ buf[i]) & 255] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function adler32(buf) {
  var a = 1, b = 0;
  for (var i = 0; i < buf.length; i++) { a = (a + buf[i]) % 65521; b = (b + a) % 65521; }
  return ((b << 16) | a) >>> 0;
}

/* ------------------------------------------------------------- Inflate */
/* Kompakter RAW-Deflate-Dekoder (fuer PNG-IDAT nach Abzug des zlib-Kopfes). */
function inflateRaw(src, expected) {
  var out = new Uint8Array(expected && expected > 0 ? expected : 1024), olen = 0;
  var pos = 0, bitbuf = 0, bitcnt = 0;
  function grow(n) {
    if (olen + n <= out.length) return;
    var cap = out.length * 2; while (cap < olen + n) cap *= 2;
    var nb = new Uint8Array(cap); nb.set(out.subarray(0, olen)); out = nb;
  }
  function bits(n) {
    while (bitcnt < n) { bitbuf |= src[pos++] << bitcnt; bitcnt += 8; }
    var v = bitbuf & ((1 << n) - 1); bitbuf >>>= n; bitcnt -= n; return v;
  }
  function build(lengths) {
    var maxbits = 0, i;
    for (i = 0; i < lengths.length; i++) if (lengths[i] > maxbits) maxbits = lengths[i];
    var blCount = new Int32Array(maxbits + 1);
    for (i = 0; i < lengths.length; i++) blCount[lengths[i]]++;
    blCount[0] = 0;
    var next = new Int32Array(maxbits + 2), code = 0;
    for (i = 1; i <= maxbits; i++) { code = (code + blCount[i - 1]) << 1; next[i] = code; }
    var codes = new Int32Array(lengths.length);
    for (i = 0; i < lengths.length; i++) if (lengths[i]) codes[i] = next[lengths[i]]++;
    /* Dekodiertabelle: Bit-fuer-Bit (einfach, ausreichend schnell fuer PNG) */
    var first = new Int32Array(maxbits + 1), count = new Int32Array(maxbits + 1), symIdx = new Int32Array(maxbits + 1);
    var sorted = [], n;
    for (n = 1; n <= maxbits; n++) { count[n] = blCount[n]; }
    var offs = new Int32Array(maxbits + 2), s = 0;
    for (n = 1; n <= maxbits; n++) { offs[n] = s; s += blCount[n]; }
    var symbols = new Int32Array(s);
    for (i = 0; i < lengths.length; i++) if (lengths[i]) symbols[offs[lengths[i]]++] = i;
    return { count: count, symbols: symbols, maxbits: maxbits };
  }
  function decode(h) {
    var code = 0, first = 0, index = 0;
    for (var len = 1; len <= h.maxbits; len++) {
      code |= bits(1);
      var cnt = h.count[len];
      if (code - first < cnt) return h.symbols[index + (code - first)];
      index += cnt; first = (first + cnt) << 1; code <<= 1;
    }
    throw new Error('inflate: ungueltiger Code');
  }
  var LBASE = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
  var LEXT  = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  var DBASE = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
  var DEXT  = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
  var fixedL = null, fixedD = null;
  for (;;) {
    var last = bits(1), type = bits(2), i;
    if (type === 0) {
      bitbuf = 0; bitcnt = 0;
      var len = src[pos] | (src[pos + 1] << 8); pos += 4;
      grow(len); out.set(src.subarray(pos, pos + len), olen); olen += len; pos += len;
    } else {
      var lh, dh;
      if (type === 1) {
        if (!fixedL) {
          var ll = new Uint8Array(288);
          for (i = 0; i < 144; i++) ll[i] = 8; for (; i < 256; i++) ll[i] = 9;
          for (; i < 280; i++) ll[i] = 7; for (; i < 288; i++) ll[i] = 8;
          fixedL = build(ll);
          var dl = new Uint8Array(30); for (i = 0; i < 30; i++) dl[i] = 5;
          fixedD = build(dl);
        }
        lh = fixedL; dh = fixedD;
      } else if (type === 2) {
        var hlit = bits(5) + 257, hdist = bits(5) + 1, hclen = bits(4) + 4;
        var ord = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
        var cl = new Uint8Array(19);
        for (i = 0; i < hclen; i++) cl[ord[i]] = bits(3);
        var clh = build(cl), lens = new Uint8Array(hlit + hdist), n = 0;
        while (n < hlit + hdist) {
          var sym = decode(clh);
          if (sym < 16) lens[n++] = sym;
          else if (sym === 16) { var prev = lens[n - 1], r = 3 + bits(2); while (r--) lens[n++] = prev; }
          else if (sym === 17) { var r2 = 3 + bits(3); while (r2--) lens[n++] = 0; }
          else { var r3 = 11 + bits(7); while (r3--) lens[n++] = 0; }
        }
        lh = build(lens.subarray(0, hlit)); dh = build(lens.subarray(hlit));
      } else throw new Error('inflate: reservierter Blocktyp');
      for (;;) {
        var sym2 = decode(lh);
        if (sym2 < 256) { grow(1); out[olen++] = sym2; }
        else if (sym2 === 256) break;
        else {
          sym2 -= 257;
          var length = LBASE[sym2] + bits(LEXT[sym2]);
          var ds = decode(dh), dist = DBASE[ds] + bits(DEXT[ds]);
          grow(length);
          var from = olen - dist;
          for (var k = 0; k < length; k++) out[olen++] = out[from + k];
        }
      }
    }
    if (last) break;
  }
  return out.subarray(0, olen);
}
function inflateZlib(src, expected) { return inflateRaw(src.subarray(2), expected); }

/* Deflate: gespeicherte Bloecke (immer gueltig, keine Kompression). */
function deflateStore(data) {
  var blocks = Math.max(1, Math.ceil(data.length / 65535));
  var out = new Uint8Array(2 + data.length + blocks * 5 + 4), p = 0;
  out[p++] = 0x78; out[p++] = 0x01;
  for (var i = 0; i < blocks; i++) {
    var off = i * 65535, len = Math.min(65535, data.length - off), last = (i === blocks - 1) ? 1 : 0;
    out[p++] = last;
    out[p++] = len & 255; out[p++] = (len >> 8) & 255;
    out[p++] = (~len) & 255; out[p++] = ((~len) >> 8) & 255;
    out.set(data.subarray(off, off + len), p); p += len;
  }
  var ad = adler32(data);
  out[p++] = (ad >>> 24) & 255; out[p++] = (ad >>> 16) & 255; out[p++] = (ad >>> 8) & 255; out[p++] = ad & 255;
  return out.subarray(0, p);
}

/* ------------------------------------------------------------------ PNG */
function pngChunk(type, data) {
  var out = new Uint8Array(12 + data.length), dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  for (var i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}
/* Indiziertes PNG (8bpp Indizes + RGB-Palette, Index 0 transparent falls trans) */
function pngWriteIndexed(idx, w, h, pal, transparentIndex0) {
  var raw = new Uint8Array((w + 1) * h);
  for (var y = 0; y < h; y++) { raw[y * (w + 1)] = 0; raw.set(idx.subarray(y * w, y * w + w), y * (w + 1) + 1); }
  var ihdr = new Uint8Array(13), dv = new DataView(ihdr.buffer);
  dv.setUint32(0, w); dv.setUint32(4, h); ihdr[8] = 8; ihdr[9] = 3; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  var plte = new Uint8Array(pal.length * 3);
  for (var i = 0; i < pal.length; i++) { plte[i * 3] = pal[i][0]; plte[i * 3 + 1] = pal[i][1]; plte[i * 3 + 2] = pal[i][2]; }
  var parts = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk('IHDR', ihdr), pngChunk('PLTE', plte)];
  if (transparentIndex0) {
    var tr = new Uint8Array(1); tr[0] = 0;
    parts.push(pngChunk('tRNS', tr));
  }
  parts.push(pngChunk('IDAT', deflateStore(raw)));
  parts.push(pngChunk('IEND', new Uint8Array(0)));
  var total = 0, k; for (k = 0; k < parts.length; k++) total += parts[k].length;
  var out = new Uint8Array(total), p = 0;
  for (k = 0; k < parts.length; k++) { out.set(parts[k], p); p += parts[k].length; }
  return out;
}
/* RGBA-PNG (fuer Uebersichten/Atlas-Export) */
function pngWriteRGBA(rgba, w, h) {
  var raw = new Uint8Array((w * 4 + 1) * h);
  for (var y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; raw.set(rgba.subarray(y * w * 4, (y + 1) * w * 4), y * (w * 4 + 1) + 1); }
  var ihdr = new Uint8Array(13), dv = new DataView(ihdr.buffer);
  dv.setUint32(0, w); dv.setUint32(4, h); ihdr[8] = 8; ihdr[9] = 6;
  var parts = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk('IHDR', ihdr),
               pngChunk('IDAT', deflateStore(raw)), pngChunk('IEND', new Uint8Array(0))];
  var total = 0, k; for (k = 0; k < parts.length; k++) total += parts[k].length;
  var out = new Uint8Array(total), p = 0;
  for (k = 0; k < parts.length; k++) { out.set(parts[k], p); p += parts[k].length; }
  return out;
}
/* PNG lesen: liefert {w,h,mode:'P'|'RGBA', idx?, pal?, rgba} */
function pngRead(buf) {
  if (buf[0] !== 137 || buf[1] !== 80) throw new Error('keine PNG-Datei');
  var p = 8, w = 0, h = 0, depth = 8, ctype = 6, pal = null, trns = null, idat = [], total = 0;
  var dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  while (p < buf.length) {
    var len = dv.getUint32(p), type = String.fromCharCode(buf[p + 4], buf[p + 5], buf[p + 6], buf[p + 7]);
    var data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = dv.getUint32(p + 8); h = dv.getUint32(p + 12); depth = buf[p + 16]; ctype = buf[p + 17]; if (buf[p + 20]) throw new Error('Interlaced-PNG wird nicht unterstuetzt'); }
    else if (type === 'PLTE') { pal = []; for (var i = 0; i < len; i += 3) pal.push([data[i], data[i + 1], data[i + 2]]); }
    else if (type === 'tRNS') { trns = data.slice(); }
    else if (type === 'IDAT') { idat.push(data); total += len; }
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  var comp = new Uint8Array(total), q = 0;
  for (var k = 0; k < idat.length; k++) { comp.set(idat[k], q); q += idat[k].length; }
  var chan = ctype === 0 ? 1 : ctype === 2 ? 3 : ctype === 3 ? 1 : ctype === 4 ? 2 : 4;
  var bpl = Math.ceil(w * chan * depth / 8);
  var raw = inflateZlib(comp, (bpl + 1) * h);
  /* Filter aufloesen */
  var bpp = Math.max(1, Math.ceil(chan * depth / 8));
  var img = new Uint8Array(bpl * h);
  for (var y = 0; y < h; y++) {
    var ft = raw[y * (bpl + 1)], so = y * (bpl + 1) + 1, dof = y * bpl, pof = (y - 1) * bpl;
    for (var x = 0; x < bpl; x++) {
      var a = x >= bpp ? img[dof + x - bpp] : 0, b = y > 0 ? img[pof + x] : 0, c = (x >= bpp && y > 0) ? img[pof + x - bpp] : 0;
      var v = raw[so + x];
      if (ft === 1) v = (v + a) & 255;
      else if (ft === 2) v = (v + b) & 255;
      else if (ft === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (ft === 4) {
        var pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
      img[dof + x] = v;
    }
  }
  var res = { w: w, h: h, depth: depth, ctype: ctype, pal: pal };
  var rgba = new Uint8Array(w * h * 4), idx = null, px, sh;
  if (ctype === 3) {
    idx = new Uint8Array(w * h);
    for (var yy = 0; yy < h; yy++) for (var xx = 0; xx < w; xx++) {
      if (depth === 8) px = img[yy * bpl + xx];
      else { var per = 8 / depth, bi = yy * bpl + ((xx / per) | 0); sh = 8 - depth * ((xx % per) + 1); px = (img[bi] >> sh) & ((1 << depth) - 1); }
      idx[yy * w + xx] = px;
      var c2 = pal && pal[px] ? pal[px] : [0, 0, 0];
      rgba[(yy * w + xx) * 4] = c2[0]; rgba[(yy * w + xx) * 4 + 1] = c2[1]; rgba[(yy * w + xx) * 4 + 2] = c2[2];
      rgba[(yy * w + xx) * 4 + 3] = (trns && px < trns.length) ? trns[px] : 255;
    }
    res.mode = 'P'; res.idx = idx;
  } else {
    for (var y2 = 0; y2 < h; y2++) for (var x2 = 0; x2 < w; x2++) {
      var o = y2 * bpl + x2 * chan * (depth / 8), t = (y2 * w + x2) * 4;
      if (ctype === 2) { rgba[t] = img[o]; rgba[t + 1] = img[o + 1]; rgba[t + 2] = img[o + 2]; rgba[t + 3] = 255; }
      else if (ctype === 6) { rgba[t] = img[o]; rgba[t + 1] = img[o + 1]; rgba[t + 2] = img[o + 2]; rgba[t + 3] = img[o + 3]; }
      else if (ctype === 0) { rgba[t] = rgba[t + 1] = rgba[t + 2] = img[o]; rgba[t + 3] = 255; }
      else { rgba[t] = rgba[t + 1] = rgba[t + 2] = img[o]; rgba[t + 3] = img[o + 1]; }
    }
    res.mode = 'RGBA';
  }
  res.rgba = rgba;
  return res;
}

/* ------------------------------------------------------------------ ZIP */
var CAN_DEFLATE = (typeof CompressionStream === 'function');
async function deflateRawAsync(data) {
  if (!CAN_DEFLATE) return null;
  try {
    var cs = new CompressionStream('deflate-raw');
    var blob = await new Response(new Blob([data]).stream().pipeThrough(cs)).arrayBuffer();
    return new Uint8Array(blob);
  } catch (e) { return null; }
}

function ZipWriter() { this.files = []; }
ZipWriter.prototype.add = function (name, data) { this.files.push({ name: name, data: data, crc: crc32(data) }); };
ZipWriter.prototype.count = function () { return this.files.length; };
/* build(): unkomprimiert und synchron.  buildAsync(): packt mit deflate, wenn der
   Browser CompressionStream kann - spart bei grossen Paketen viel Platz. */
ZipWriter.prototype.build = function () { return assemble(this.files); };
ZipWriter.prototype.buildAsync = async function (onProgress) {
  var out = [];
  for (var i = 0; i < this.files.length; i++) {
    var f = this.files[i], packed = null;
    if (f.data.length > 64) packed = await deflateRawAsync(f.data);
    if (packed && packed.length < f.data.length) out.push({ name: f.name, data: packed, crc: f.crc, raw: f.data.length, method: 8 });
    else out.push({ name: f.name, data: f.data, crc: f.crc, raw: f.data.length, method: 0 });
    if (onProgress && (i & 31) === 0) await onProgress(i / this.files.length);
  }
  return assemble(out);
};
function assemble(files) {
  var enc = function (s) { return new TextEncoder().encode(s); };
  var parts = [], offset = 0, central = [];
  for (var i = 0; i < files.length; i++) {
    var f = files[i], nm = enc(f.name), method = f.method || 0;
    var raw = (f.raw === undefined) ? f.data.length : f.raw;
    var lh = new Uint8Array(30 + nm.length), dv = new DataView(lh.buffer);
    dv.setUint32(0, 0x04034b50, true); dv.setUint16(4, 20, true); dv.setUint16(6, 0x0800, true);
    dv.setUint16(8, method, true); dv.setUint16(10, 0, true); dv.setUint16(12, 0x21, true);
    dv.setUint32(14, f.crc, true); dv.setUint32(18, f.data.length, true); dv.setUint32(22, raw, true);
    dv.setUint16(26, nm.length, true); dv.setUint16(28, 0, true);
    lh.set(nm, 30);
    parts.push(lh); parts.push(f.data);
    var ch = new Uint8Array(46 + nm.length), cv = new DataView(ch.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, method, true); cv.setUint16(12, 0, true); cv.setUint16(14, 0x21, true);
    cv.setUint32(16, f.crc, true); cv.setUint32(20, f.data.length, true); cv.setUint32(24, raw, true);
    cv.setUint16(28, nm.length, true); cv.setUint32(42, offset, true);
    ch.set(nm, 46);
    central.push(ch);
    offset += lh.length + f.data.length;
  }
  var cstart = offset, csize = 0, j;
  for (j = 0; j < central.length; j++) { parts.push(central[j]); csize += central[j].length; }
  var eocd = new Uint8Array(22), ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true);
  ev.setUint32(12, csize, true); ev.setUint32(16, cstart, true);
  parts.push(eocd);
  var total = 0; for (j = 0; j < parts.length; j++) total += parts[j].length;
  var out = new Uint8Array(total), p = 0;
  for (j = 0; j < parts.length; j++) { out.set(parts[j], p); p += parts[j].length; }
  return out;
}

/* ------------------------------------------------------------------ IPS */
/* IPS-Patch: "PATCH" + Datensaetze + "EOF".
   Datensatz: 3 Byte Offset (BE), 2 Byte Laenge (BE), Daten.
   Laenge 0 = Wiederholung: 2 Byte Anzahl (BE), 1 Byte Wert.
   Offsets ueber 16 MB passen nicht hinein - dafuer gibt es die verbreitete
   Erweiterung IPS32 ("IPS32" + 4-Byte-Offsets + "EEOF"). */
var IPS_EOF = 0x454F46;                 /* "EOF" als Offset - muss vermieden werden */

function ipsDiffRanges(base, data, gapMerge) {
  gapMerge = gapMerge === undefined ? 6 : gapMerge;
  var ranges = [], n = Math.min(base.length, data.length), i = 0;
  while (i < n) {
    if (data[i] === base[i]) { i++; continue; }
    var s = i, e = i + 1, gap = 0;
    i++;
    while (i < n) {
      if (data[i] !== base[i]) { e = i + 1; gap = 0; }
      else if (++gap > gapMerge) break;
      i++;
    }
    ranges.push([s, e]);
  }
  /* Erweiterter Bereich hinter der Originaldatei: alles Neue muss mit */
  if (data.length > base.length) {
    var p = base.length;
    while (p < data.length) {
      while (p < data.length && data[p] === 0) p++;
      if (p >= data.length) break;
      var s2 = p, g2 = 0;
      while (p < data.length) {
        if (data[p] !== 0) g2 = 0;
        else if (++g2 > gapMerge) break;
        p++;
      }
      ranges.push([s2, Math.min(p, data.length)]);
    }
    /* letzte Stelle erzwingen, damit die Zieldatei die volle Groesse bekommt */
    var last = data.length - 1;
    if (!ranges.length || ranges[ranges.length - 1][1] < data.length) ranges.push([last, last + 1]);
  }
  return ranges;
}

function buildIPS(base, data) {
  var ranges = ipsDiffRanges(base, data);
  var maxOff = 0;
  ranges.forEach(function (r) { if (r[1] > maxOff) maxOff = r[1]; });
  var wide = maxOff > 0x1000000;
  var out = [], recs = 0;

  function pushOff(o) {
    if (wide) out.push((o >>> 24) & 255, (o >>> 16) & 255, (o >>> 8) & 255, o & 255);
    else out.push((o >>> 16) & 255, (o >>> 8) & 255, o & 255);
  }
  function emitPlain(off, from, to) {
    var len = to - from;
    pushOff(off);
    out.push((len >> 8) & 255, len & 255);
    for (var k = from; k < to; k++) out.push(data[k]);
    recs++;
  }
  function emitRun(off, val, len) {
    pushOff(off);
    out.push(0, 0, (len >> 8) & 255, len & 255, val);
    recs++;
  }

  ranges.forEach(function (r) {
    var s = r[0], e = r[1];
    /* Offset "EOF" vermeiden: einen Byte frueher beginnen */
    if (!wide && s === IPS_EOF && s > 0) s--;
    while (s < e) {
      var chunkEnd = Math.min(e, s + 0xFFFF);
      /* innerhalb des Stuecks lange Wiederholungen als RLE ausgeben */
      var p = s;
      while (p < chunkEnd) {
        var v = data[p], q = p;
        while (q < chunkEnd && data[q] === v) q++;
        var runLen = q - p;
        if (runLen >= 16) {
          if (p > s) emitPlain(s, s, p);
          var rl = p;
          while (rl < q) {
            var takeR = Math.min(0xFFFF, q - rl);
            emitRun(rl, v, takeR);
            rl += takeR;
          }
          s = q; p = q;
        } else p = q;
      }
      if (s < chunkEnd) { emitPlain(s, s, chunkEnd); s = chunkEnd; }
    }
  });

  var magic = wide ? 'IPS32' : 'PATCH', foot = wide ? 'EEOF' : 'EOF';
  var head = [];
  for (var i = 0; i < magic.length; i++) head.push(magic.charCodeAt(i));
  var tail = [];
  for (var j = 0; j < foot.length; j++) tail.push(foot.charCodeAt(j));
  var patch = new Uint8Array(head.length + out.length + tail.length);
  patch.set(head, 0); patch.set(out, head.length); patch.set(tail, head.length + out.length);
  return { patch: patch, records: recs, wide: wide, bytes: patch.length };
}

/* IPS anwenden - dient hier vor allem der Selbstkontrolle nach dem Erzeugen */
function applyIPS(base, patch) {
  var str = function (o, n) { var s = ''; for (var i = 0; i < n; i++) s += String.fromCharCode(patch[o + i]); return s; };
  var wide, p;
  if (str(0, 5) === 'PATCH') { wide = false; p = 5; }
  else if (str(0, 5) === 'IPS32') { wide = true; p = 5; }
  else throw new Error('keine IPS-Datei');
  var out = base.slice(), footLen = wide ? 4 : 3, foot = wide ? 'EEOF' : 'EOF';
  function grow(need) {
    if (need <= out.length) return;
    var nb = new Uint8Array(need); nb.set(out); out = nb;
  }
  for (;;) {
    if (p + footLen <= patch.length && str(p, footLen) === foot) break;
    var off;
    if (wide) { off = (patch[p] << 24 >>> 0) + (patch[p + 1] << 16) + (patch[p + 2] << 8) + patch[p + 3]; p += 4; }
    else { off = (patch[p] << 16) + (patch[p + 1] << 8) + patch[p + 2]; p += 3; }
    var len = (patch[p] << 8) + patch[p + 1]; p += 2;
    if (len === 0) {
      var rl = (patch[p] << 8) + patch[p + 1]; p += 2;
      var val = patch[p]; p++;
      grow(off + rl);
      for (var k = 0; k < rl; k++) out[off + k] = val;
    } else {
      grow(off + len);
      for (var j = 0; j < len; j++) out[off + j] = patch[p + j];
      p += len;
    }
  }
  return out;
}

/* ZIP lesen: liefert eine Map Name -> Uint8Array. Versteht "gespeichert" und "deflate". */
function zipRead(buf) {
  var dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  /* End-of-central-directory suchen (von hinten, Kommentar moeglich) */
  var eo = -1;
  for (var i = buf.length - 22; i >= 0 && i > buf.length - 22 - 65536; i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eo = i; break; }
  }
  if (eo < 0) throw new Error('keine gueltige ZIP-Datei');
  var count = dv.getUint16(eo + 10, true), cstart = dv.getUint32(eo + 16, true);
  var files = new Map(), p = cstart, dec = new TextDecoder();
  for (var k = 0; k < count; k++) {
    if (dv.getUint32(p, true) !== 0x02014b50) break;
    var method = dv.getUint16(p + 10, true);
    var csize = dv.getUint32(p + 20, true), usize = dv.getUint32(p + 24, true);
    var nlen = dv.getUint16(p + 28, true), elen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
    var lho = dv.getUint32(p + 42, true);
    var name = dec.decode(buf.subarray(p + 46, p + 46 + nlen));
    var lnlen = dv.getUint16(lho + 26, true), lelen = dv.getUint16(lho + 28, true);
    var dstart = lho + 30 + lnlen + lelen;
    var raw = buf.subarray(dstart, dstart + csize);
    var data;
    if (method === 0) data = raw;
    else if (method === 8) data = inflateRaw(raw, usize);
    else throw new Error('Kompressionsverfahren ' + method + ' wird nicht unterstuetzt (' + name + ')');
    if (!/\/$/.test(name)) files.set(name, data);
    p += 46 + nlen + elen + clen;
  }
  return files;
}

/* --------------------------------------------------------- GBA: BIOS-RLE */
function rleDecode(d, off, maxout) {
  maxout = maxout || 0x40000;
  var n = d.length;
  if (off < 0 || off + 4 > n || d[off] !== 0x30) return null;
  var size = d[off + 1] | (d[off + 2] << 8) | (d[off + 3] << 16);
  if (size === 0 || size > maxout) return null;
  var out = new Uint8Array(size), ol = 0, pos = off + 4;
  while (ol < size) {
    if (pos >= n) return null;
    var f = d[pos++];
    if (f & 0x80) {
      if (pos >= n) return null;
      var r = (f & 0x7F) + 3, b = d[pos++];
      if (ol + r > size) r = size - ol;
      for (var i = 0; i < r; i++) out[ol++] = b;
    } else {
      var ln = (f & 0x7F) + 1;
      if (pos + ln > n) return null;
      if (ol + ln > size) ln = size - ol;
      out.set(d.subarray(pos, pos + ln), ol); ol += ln; pos += (f & 0x7F) + 1;
    }
  }
  return { data: out, used: pos - off };
}
function rleEncode(data) {
  var n = data.length, out = [0x30, n & 255, (n >> 8) & 255, (n >> 16) & 255], lit = [];
  function flush() {
    for (var k = 0; k < lit.length; k += 128) {
      var chunk = lit.slice(k, k + 128);
      out.push(chunk.length - 1);
      for (var m = 0; m < chunk.length; m++) out.push(chunk[m]);
    }
    lit.length = 0;
  }
  var i = 0;
  while (i < n) {
    var b = data[i], j = i + 1;
    while (j < n && data[j] === b && j - i < 130) j++;
    var run = j - i;
    if (run >= 3) { flush(); out.push(0x80 | (run - 3)); out.push(b); i = j; }
    else { lit.push(b); i++; }
  }
  flush();
  return new Uint8Array(out);
}

/* ---------------------------------------------------------- GBA: Farben */
var C8 = (function () { var a = new Uint8Array(32); for (var i = 0; i < 32; i++) a[i] = Math.round(i * 255 / 31); return a; })();
function c15ToRgb(v) { return [C8[v & 31], C8[(v >> 5) & 31], C8[(v >> 10) & 31]]; }
function rgbToC15(r, g, b) {
  var R = Math.min(31, ((r | 0) * 31 + 127) / 255 | 0), Gg = Math.min(31, ((g | 0) * 31 + 127) / 255 | 0), B = Math.min(31, ((b | 0) * 31 + 127) / 255 | 0);
  return R | (Gg << 5) | (B << 10);
}
function readPal(d, off, n) { var p = []; for (var i = 0; i < n; i++) p.push(c15ToRgb(u16(d, off + i * 2))); return p; }
function isPal(d, o, n) {
  if (o < 0 || (o & 1) || o + 2 * n > d.length) return false;
  for (var i = 0; i < n; i++) if (u16(d, o + i * 2) >= 0x8000) return false;
  return true;
}
function grayPal(n) { var p = []; for (var i = 0; i < n; i++) { var v = (i * 255 / (n - 1)) | 0; p.push([v, v, v]); } return p; }

/* ---------------------------------------------------------- GBA: Kacheln */
/* 8x8-Kacheln; 4bpp: niedriges Nibble = linker Pixel */
function tilesToImg(buf, off, w, h, bpp) {
  var tw = w >> 3, th = h >> 3, img = new Uint8Array(w * h), tsz = 8 * bpp;
  for (var ty = 0; ty < th; ty++) for (var tx = 0; tx < tw; tx++) {
    var t = (ty * tw + tx) * tsz + off;
    for (var y = 0; y < 8; y++) {
      var row = t + y * bpp, di = (ty * 8 + y) * w + tx * 8;
      if (bpp === 4) for (var x = 0; x < 4; x++) { var b = buf[row + x]; img[di + x * 2] = b & 15; img[di + x * 2 + 1] = b >> 4; }
      else for (var x2 = 0; x2 < 8; x2++) img[di + x2] = buf[row + x2];
    }
  }
  return img;
}
function imgToTiles(img, w, h, bpp, out, off) {
  var tw = w >> 3, th = h >> 3, tsz = 8 * bpp;
  for (var ty = 0; ty < th; ty++) for (var tx = 0; tx < tw; tx++) {
    var t = (ty * tw + tx) * tsz + off;
    for (var y = 0; y < 8; y++) {
      var row = t + y * bpp, si = (ty * 8 + y) * w + tx * 8;
      if (bpp === 4) for (var x = 0; x < 4; x++) out[row + x] = (img[si + x * 2] & 15) | ((img[si + x * 2 + 1] & 15) << 4);
      else for (var x2 = 0; x2 < 8; x2++) out[row + x2] = img[si + x2];
    }
  }
  return out;
}

/* Frames (mehrere Bilder in einem Block) -> eine Leinwand untereinander */
function framesToCanvas(out, frames, bpp) {
  var W = 0, H = 0, i;
  for (i = 0; i < frames.length; i++) { if (frames[i].w > W) W = frames[i].w; H += frames[i].h; }
  var canvas = new Uint8Array(W * H), y = 0;
  for (i = 0; i < frames.length; i++) {
    var f = frames[i], img = tilesToImg(out, f.boff, f.w, f.h, bpp);
    for (var r = 0; r < f.h; r++) canvas.set(img.subarray(r * f.w, r * f.w + f.w), (y + r) * W);
    y += f.h;
  }
  return { px: canvas, w: W, h: H };
}
function canvasToOut(canvas, W, frames, bpp, baseOut) {
  var out = new Uint8Array(baseOut), y = 0;
  for (var i = 0; i < frames.length; i++) {
    var f = frames[i], sub = new Uint8Array(f.w * f.h);
    for (var r = 0; r < f.h; r++) sub.set(canvas.subarray((y + r) * W, (y + r) * W + f.w), r * f.w);
    imgToTiles(sub, f.w, f.h, bpp, out, f.boff);
    y += f.h;
  }
  return out;
}

/* ------------------------------------------------------------------ ROM */
var BASE = 0x08000000, ROM_MAX = 0x02000000;

function Rom(bytes, name) {
  this.name = name || 'rom.gba';
  this.data = bytes;
  this.base = bytes.slice();
  this.sha1 = sha1(bytes);
  this.origSize = bytes.length;
}
Rom.prototype.u8 = function (o) { return this.data[o]; };
Rom.prototype.u16 = function (o) { return u16(this.data, o); };
Rom.prototype.u32 = function (o) { return u32(this.data, o); };
Rom.prototype.ptr = function (o) { var v = u32(this.data, o); return (v >>> 24) === 0x08 ? (v & 0xFFFFFF) : -1; };
Rom.prototype.write = function (off, bytes) { this.data.set(bytes, off); };
Rom.prototype.title = function () { var s = ''; for (var i = 0xA0; i < 0xAC; i++) if (this.data[i]) s += String.fromCharCode(this.data[i]); return s.trim(); };
Rom.prototype.code = function () { var s = ''; for (var i = 0xAC; i < 0xB0; i++) s += String.fromCharCode(this.data[i]); return s; };
Rom.prototype.headerOk = function () {
  var chk = 0;
  for (var i = 0xA0; i < 0xBD; i++) chk = (chk - this.data[i]) & 0xFF;
  chk = (chk - 0x19) & 0xFF;
  return chk === this.data[0xBD];
};
Rom.prototype.fixHeader = function () {
  var chk = 0;
  for (var i = 0xA0; i < 0xBD; i++) chk = (chk - this.data[i]) & 0xFF;
  this.data[0xBD] = (chk - 0x19) & 0xFF;
};
/* Freispeicher am Ende (hinter den letzten Nutzdaten).
   allocTop merkt sich, wie weit schon vergeben wurde - sonst koennte ein neuer
   Allocator in einen Block zurueckrutschen, der auf Nullbytes endet. */
Rom.prototype.freeStart = function () {
  var last = this.data.length;
  while (last > 0 && this.data[last - 1] === 0) last--;
  var p = align4(last) + 16;
  return Math.max(p, this.allocTop || 0);
};
Rom.prototype.expandTo = function (size) {
  if (size <= this.data.length) return false;
  var nb = new Uint8Array(size); nb.set(this.data); this.data = nb;
  return true;
};
/* Liste der Aenderungen gegenueber dem Original (fuer Projektdateien) */
Rom.prototype.diff = function () {
  var runs = [], a = this.base, b = this.data, n = Math.min(a.length, b.length), i = 0;
  while (i < n) {
    if (a[i] !== b[i]) {
      var s = i;
      while (i < n && a[i] !== b[i]) i++;
      /* kleine Luecken zusammenfassen */
      runs.push({ off: s, data: b.subarray(s, i) });
    } else i++;
  }
  if (b.length > a.length) {
    var s2 = a.length;
    /* nur nicht-null Bereiche der Erweiterung sichern */
    var j = s2;
    while (j < b.length) {
      while (j < b.length && b[j] === 0) j++;
      if (j >= b.length) break;
      var st = j;
      while (j < b.length && b[j] !== 0) j++;
      runs.push({ off: st, data: b.subarray(st, j) });
    }
  }
  /* Runs mit Abstand < 64 zusammenfassen */
  var merged = [];
  for (var k = 0; k < runs.length; k++) {
    var r = runs[k];
    if (merged.length) {
      var m = merged[merged.length - 1];
      if (r.off - (m.off + m.len) < 64) {
        var newLen = r.off + r.data.length - m.off;
        var buf = new Uint8Array(newLen);
        buf.set(b.subarray(m.off, m.off + newLen));
        m.bytes = buf; m.len = newLen;
        continue;
      }
    }
    merged.push({ off: r.off, len: r.data.length, bytes: b.slice(r.off, r.off + r.data.length) });
  }
  return merged;
};
Rom.prototype.changedBytes = function () {
  var a = this.base, b = this.data, n = Math.min(a.length, b.length), c = 0;
  for (var i = 0; i < n; i++) if (a[i] !== b[i]) c++;
  return c + Math.max(0, b.length - a.length);
};
Rom.prototype.resetAll = function () { this.data = this.base.slice(); this.allocTop = 0; };

/* Allocator fuer verschobene Daten */
function Allocator(rom, allowExpand) {
  this.rom = rom;
  this.pos = rom.freeStart();
  this.allowExpand = !!allowExpand;
  this.start = this.pos;
}
Allocator.prototype.alloc = function (size) {
  size = align4(size);
  if (this.pos + size > this.rom.data.length) {
    if (this.allowExpand && this.pos + size <= ROM_MAX) {
      var target = this.rom.data.length;
      while (target < this.pos + size && target < ROM_MAX) target *= 2;
      this.rom.expandTo(Math.min(ROM_MAX, target));
    } else return -1;
  }
  var o = this.pos; this.pos += size;
  if (this.pos > (this.rom.allocTop || 0)) this.rom.allocTop = this.pos;
  return o;
};
Allocator.prototype.used = function () { return this.pos - this.start; };

/* Pointer-Index: Ziel-Offset -> Fundstellen */
function buildRefs(d, onProgress) {
  var n = d.length >> 2, map = new Map();
  for (var i = 0; i < n; i++) {
    var o = i << 2;
    if (d[o + 3] !== 0x08) continue;
    var t = d[o] | (d[o + 1] << 8) | (d[o + 2] << 16);
    if (t >= d.length) continue;
    var a = map.get(t);
    if (a) a.push(o); else map.set(t, [o]);
  }
  return map;
}

G.hex = hex; G.hx = hx; G.u16 = u16; G.u32 = u32; G.s32 = s32; G.putU16 = putU16; G.putU32 = putU32;
G.align4 = align4; G.bytesEqual = bytesEqual; G.b64enc = b64enc; G.b64dec = b64dec;
G.sha1 = sha1; G.crc32 = crc32; G.inflateRaw = inflateRaw; G.inflateZlib = inflateZlib; G.deflateStore = deflateStore;
G.pngWriteIndexed = pngWriteIndexed; G.pngWriteRGBA = pngWriteRGBA; G.pngRead = pngRead;
G.ZipWriter = ZipWriter; G.zipRead = zipRead; G.CAN_DEFLATE = CAN_DEFLATE;
G.buildIPS = buildIPS; G.applyIPS = applyIPS;
G.rleDecode = rleDecode; G.rleEncode = rleEncode;
G.c15ToRgb = c15ToRgb; G.rgbToC15 = rgbToC15; G.readPal = readPal; G.isPal = isPal; G.grayPal = grayPal;
G.tilesToImg = tilesToImg; G.imgToTiles = imgToTiles; G.framesToCanvas = framesToCanvas; G.canvasToOut = canvasToOut;
G.Rom = Rom; G.Allocator = Allocator; G.buildRefs = buildRefs;
G.BASE = BASE; G.ROM_MAX = ROM_MAX;

})(window);
