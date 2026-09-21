/* GTA Advance Studio - Sound (PCM-Samples) */
(function (global) {
'use strict';
var G = global.GTAS, el = G.el, App = G.App;
G.cache = G.cache || {};

/* Sample-Kopf: u32 Typ (0 = einmalig, 0x40000000 = Schleife), u32 Rate<<10,
   u32 Schleifenanfang, u32 Laenge, danach vorzeichenbehaftete 8-Bit-Daten. */
function validHeader(d, o) {
  if (o + 16 > d.length) return null;
  var t = G.u32(d, o);
  if (t !== 0 && t !== 0x40000000) return null;
  var f = G.u32(d, o + 4);
  if (f & 0x3FF) return null;
  var rate = f / 1024;
  if (rate < 2000 || rate > 48000) return null;
  var ls = G.u32(d, o + 8), sz = G.u32(d, o + 12);
  if (sz < 64 || sz > 0x180000 || o + 16 + sz > d.length) return null;
  if (ls > sz) return null;
  return { off: o, type: t, rate: rate, loop: ls, size: sz };
}

async function scanSamples(rom, onProgress) {
  if (G.cache.snd) return G.cache.snd;
  var d = rom.data, refs = new Map(), n4 = d.length >> 2, i, o, t;
  if (onProgress) onProgress(0.05, 'Pointer-Index ...');
  await G.yieldUI();
  for (i = 0; i < n4; i++) {
    o = i << 2;
    if (d[o + 3] !== 0x08) continue;
    t = d[o] | (d[o + 1] << 8) | (d[o + 2] << 16);
    if (t >= d.length) continue;
    var a = refs.get(t);
    if (a) a.push(o); else refs.set(t, [o]);
  }
  if (onProgress) onProgress(0.4, 'Samples werden gesucht ...');
  await G.yieldUI();

  var found = [], lo = d.length, hi = 0;
  refs.forEach(function (locs, off) {
    var h = validHeader(d, off);
    if (!h) return;
    h.refs = locs;
    found.push(h);
    if (off < lo) lo = off;
    if (off + 16 + h.size > hi) hi = off + 16 + h.size;
  });
  if (!found.length) { G.cache.snd = { list: [], refs: refs }; return G.cache.snd; }

  /* Nachbarn ohne eigenen Zeiger ergaenzen (fortlaufende Kette) */
  if (onProgress) onProgress(0.7, 'Kette wird verfolgt ...');
  await G.yieldUI();
  var known = {};
  found.forEach(function (h) { known[h.off] = h; });
  found.slice().forEach(function (h) {
    var p = (h.off + 16 + h.size + 3) & ~3;
    for (var step = 0; step < 4000; step++) {
      var nx = null;
      for (var g = 0; g < 40; g += 4) { var hh = validHeader(d, p + g); if (hh) { nx = hh; break; } }
      if (!nx || known[nx.off]) break;
      nx.refs = refs.get(nx.off) || [];
      known[nx.off] = nx; found.push(nx);
      p = (nx.off + 16 + nx.size + 3) & ~3;
    }
  });

  found.sort(function (a, b) { return a.off - b.off; });
  /* Ueberlappungen entfernen */
  var clean = [], last = -1;
  found.forEach(function (h) {
    if (h.off < last) return;
    clean.push(h);
    last = h.off + 16 + h.size;
  });
  /* Ausreisser aussortieren: echte Samples liegen in einem zusammenhaengenden
     Bereich der ROM. Vereinzelte Treffer weit davon entfernt sind Zufallsfunde
     in Tabellen und werden verworfen - sonst wuerde ein Import dort Daten zerstoeren. */
  var groups = [], cur = [];
  clean.forEach(function (h) {
    if (cur.length && h.off - (cur[cur.length - 1].off + 16 + cur[cur.length - 1].size) > 0x40000) { groups.push(cur); cur = []; }
    cur.push(h);
  });
  if (cur.length) groups.push(cur);
  var biggest = 0;
  groups.forEach(function (g) { if (g.length > biggest) biggest = g.length; });
  var list = [];
  groups.forEach(function (g) {
    if (g.length * 20 < biggest) return;          /* weniger als 5 % des Hauptbereichs */
    g.forEach(function (h) {
      h.id = 'snd_' + G.hex(h.off, 6).toLowerCase();
      h.dur = h.size / h.rate;
      list.push(h);
    });
  });
  var res = { list: list, refs: refs };
  G.cache.snd = res;
  return res;
}

/* -------------------------------------------------------------- WAV */
function toWav(d, h) {
  var n = h.size, out = new Uint8Array(44 + n), dv = new DataView(out.buffer);
  function s(o, str) { for (var i = 0; i < str.length; i++) out[o + i] = str.charCodeAt(i); }
  s(0, 'RIFF'); dv.setUint32(4, 36 + n, true); s(8, 'WAVEfmt ');
  dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
  dv.setUint32(24, h.rate, true); dv.setUint32(28, h.rate, true);
  dv.setUint16(32, 1, true); dv.setUint16(34, 8, true);
  s(36, 'data'); dv.setUint32(40, n, true);
  for (var i = 0; i < n; i++) out[44 + i] = (d[h.off + 16 + i] + 128) & 255;
  return out;
}
function fromWav(bytes) {
  var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) !== 'RIFF') throw new Error('keine WAV-Datei');
  var p = 12, fmt = null, data = null, dlen = 0;
  while (p + 8 <= bytes.length) {
    var id = String.fromCharCode(bytes[p], bytes[p + 1], bytes[p + 2], bytes[p + 3]);
    var ln = dv.getUint32(p + 4, true);
    if (id === 'fmt ') fmt = { format: dv.getUint16(p + 8, true), ch: dv.getUint16(p + 10, true), rate: dv.getUint32(p + 12, true), bits: dv.getUint16(p + 22, true) };
    else if (id === 'data') { data = p + 8; dlen = Math.min(ln, bytes.length - p - 8); }
    p += 8 + ln + (ln & 1);
  }
  if (!fmt || data === null) throw new Error('WAV ohne fmt/data-Block');
  if (fmt.format !== 1 && fmt.format !== 3) throw new Error('nur unkomprimiertes PCM wird unterstuetzt');
  var frames = (dlen / (fmt.bits / 8) / fmt.ch) | 0, mono = new Float32Array(frames), i, c, v;
  for (i = 0; i < frames; i++) {
    var acc = 0;
    for (c = 0; c < fmt.ch; c++) {
      var o = data + (i * fmt.ch + c) * (fmt.bits / 8);
      if (fmt.bits === 8) v = (bytes[o] - 128) / 128;
      else if (fmt.bits === 16) v = dv.getInt16(o, true) / 32768;
      else if (fmt.bits === 24) v = ((bytes[o] | (bytes[o + 1] << 8) | (bytes[o + 2] << 16) << 8 >> 8) << 8 >> 8) / 8388608;
      else if (fmt.bits === 32) v = fmt.format === 3 ? dv.getFloat32(o, true) : dv.getInt32(o, true) / 2147483648;
      else throw new Error(fmt.bits + ' Bit werden nicht unterstuetzt');
      acc += v;
    }
    mono[i] = acc / fmt.ch;
  }
  return { rate: fmt.rate, data: mono };
}
function resampleTo8(src, srcRate, dstRate) {
  var ratio = srcRate / dstRate, n = Math.max(1, Math.floor(src.length / ratio));
  var out = new Int8Array(n);
  for (var i = 0; i < n; i++) {
    var sp = i * ratio, i0 = Math.floor(sp), fr = sp - i0;
    var a = src[i0] || 0, b = src[Math.min(src.length - 1, i0 + 1)] || 0;
    var v = Math.round((a + (b - a) * fr) * 128);
    out[i] = v > 127 ? 127 : v < -128 ? -128 : v;
  }
  return out;
}

/* Sample schreiben: passt es, an Ort und Stelle, sonst verschieben + Zeiger anpassen */
function writeSample(rom, s, pcm, rate, alloc) {
  var d = rom.data, i;
  if (pcm.length <= s.size) {
    G.putU32(d, s.off + 4, rate * 1024);
    G.putU32(d, s.off + 12, pcm.length);
    if (s.type && s.loop > pcm.length) G.putU32(d, s.off + 8, 0);
    for (i = 0; i < pcm.length; i++) d[s.off + 16 + i] = pcm[i] & 255;
    for (var k = pcm.length; k < s.size; k++) d[s.off + 16 + k] = 0;
    /* erst nach dem Auffuellen die neue Laenge merken, sonst bleibt der Rest stehen */
    s.size = pcm.length;
    s.rate = rate; s.dur = pcm.length / rate;
    return { moved: false };
  }
  if (!s.refs.length) throw new Error('Sample ist laenger und hat keinen bekannten Zeiger - nicht verschiebbar');
  var no = alloc.alloc(16 + pcm.length);
  if (no < 0) throw new Error('kein freier Platz mehr - ROM auf 32 MB erweitern');
  G.putU32(d, no, s.type); G.putU32(d, no + 4, rate * 1024);
  G.putU32(d, no + 8, 0); G.putU32(d, no + 12, pcm.length);
  for (var j = 0; j < pcm.length; j++) d[no + 16 + j] = pcm[j] & 255;
  for (var r = 0; r < s.refs.length; r++) G.putU32(d, s.refs[r], G.BASE + no);
  s.off = no; s.size = pcm.length; s.rate = rate; s.loop = 0; s.dur = pcm.length / rate;
  return { moved: true, to: no };
}

G.registerTab({
  id: 'sound', label: 'Sound', icon: '♪', needsRom: true,
  render: function (v) {
    var st = G.cache.sndui || (G.cache.sndui = { q: '', page: 0, sel: null, keepRate: true });

    v.appendChild(el('h2', { text: 'Sound' }));
    v.appendChild(el('p', { class: 'lead',
      text: 'Alle PCM-Samples der ROM: Sprachaufnahmen, Motoren, Waffen, Radio-Schnipsel. Anhoeren, als WAV sichern und '
        + 'eigene Aufnahmen einspielen - das Studio wandelt automatisch in das 8-Bit-Format des Game Boy Advance um.' }));

    var body = el('div'); v.appendChild(body);

    if (!G.cache.snd) {
      body.appendChild(el('div', { class: 'card' }, [
        el('p', { text: 'Die ROM muss einmalig nach Samples durchsucht werden.' }),
        el('button', { class: 'primary', text: 'Samples suchen', onclick: async function () {
          G.busy('Samples werden gesucht ...'); await G.yieldUI();
          await scanSamples(App.rom, function (f, t) { G.busyProgress(f, t); });
          G.busy(false); G.refreshTab();
        } })
      ]));
      body.appendChild(el('div', { class: 'card warnc' }, [
        el('b', { text: 'Zum Thema MIDI: ' }),
        el('span', { text: 'Diese ROM benutzt keinen Sequenzer wie Nintendos MusicPlayer2000 (Sappy). '
          + 'Es gibt darin also keine MIDI- oder Notendaten, die man exportieren koennte - die gesamte Musik und alle '
          + 'Gerausche liegen als fertig aufgenommene PCM-Samples vor. Genau die bearbeitest du hier: '
          + 'Wer eigene Musik einbauen will, rendert sie als WAV und spielt sie als Sample ein.' })
      ]));
      return;
    }

    var DB = G.cache.snd;
    render();

    function filtered() {
      var q = st.q.trim().toLowerCase();
      if (!q) return DB.list;
      return DB.list.filter(function (s) { return s.id.indexOf(q) >= 0 || String(s.rate).indexOf(q) >= 0; });
    }

    function render() {
      G.clear(body);
      var fl = filtered(), PER = 100, pages = Math.max(1, Math.ceil(fl.length / PER));
      if (st.page >= pages) st.page = 0;
      var totalBytes = DB.list.reduce(function (a, s) { return a + s.size; }, 0);

      body.appendChild(el('div', { class: 'toolbar' }, [
        el('input', { type: 'search', placeholder: 'Suche: Offset oder Abtastrate ...', value: st.q, style: 'width:240px',
          oninput: function () { st.q = this.value; st.page = 0; render(); } }),
        el('span', { class: 'sep' }),
        el('button', { text: 'Alle als WAV-ZIP exportieren', onclick: function () { exportZip(fl); } }),
        el('button', { text: 'WAV-Dateien importieren', onclick: function () { importMany(); } }),
        el('span', { class: 'spacer' }),
        el('span', { class: 'pill', text: DB.list.length + ' Samples · ' + (totalBytes / 1048576).toFixed(2) + ' MB' })
      ]));

      var split = el('div', { class: 'split' }), left = el('div', { style: 'flex:1;min-width:0' }), side = el('div', { class: 'side' });
      split.appendChild(left); split.appendChild(side); body.appendChild(split);

      var wrap = el('div', { class: 'txtlist' }), t = el('table', { class: 'tbl' });
      t.appendChild(el('tr', {}, [el('th', { text: 'Offset' }), el('th', { text: 'Rate' }), el('th', { text: 'Laenge' }),
        el('th', { text: 'Dauer' }), el('th', { text: 'Schleife' }), el('th', { text: 'Zeiger' })]));
      fl.slice(st.page * PER, st.page * PER + PER).forEach(function (s) {
        var tr = el('tr', { class: st.sel === s ? 'sel' : '', onclick: function () { st.sel = s; render(); } });
        tr.appendChild(el('td', { class: 'mono', text: G.hex(s.off, 6) }));
        tr.appendChild(el('td', { text: s.rate + ' Hz' }));
        tr.appendChild(el('td', { text: s.size.toLocaleString('de-DE') + ' B' }));
        tr.appendChild(el('td', { text: s.dur.toFixed(2) + ' s' }));
        tr.appendChild(el('td', { class: 'mut', text: s.type ? 'ab ' + s.loop : '-' }));
        tr.appendChild(el('td', { class: 'mut', text: s.refs.length }));
        t.appendChild(tr);
      });
      wrap.appendChild(t); left.appendChild(wrap);

      if (pages > 1) {
        left.appendChild(el('div', { class: 'row', style: 'margin-top:10px;justify-content:center' }, [
          el('button', { text: '‹ zurueck', onclick: function () { if (st.page > 0) { st.page--; render(); } } }),
          el('span', { class: 'mut', text: 'Seite ' + (st.page + 1) + ' / ' + pages }),
          el('button', { text: 'weiter ›', onclick: function () { if (st.page < pages - 1) { st.page++; render(); } } })
        ]));
      }

      side.appendChild(detail());
      side.appendChild(el('div', { class: 'card warnc' }, [
        el('b', { text: 'MIDI-Hinweis: ' }),
        el('span', { class: 'hint', text: 'Die ROM enthaelt keinen Noten-/Sequenzer-Teil (kein MusicPlayer2000). '
          + 'Musik liegt komplett als PCM vor - eigene Musik baust du als WAV ein.' })
      ]));
    }

    function detail() {
      var box = el('div', { class: 'card sticky' }), s = st.sel;
      if (!s) { box.appendChild(el('p', { class: 'hint', text: 'Links ein Sample anklicken.' })); return box; }
      box.appendChild(el('h4', { text: s.id }));
      var cv = el('canvas', { class: 'wave' });
      drawWave(cv, App.rom.data, s);
      box.appendChild(cv);
      var kv = el('div', { class: 'kv', style: 'margin-top:10px' });
      function add(k, val) { kv.appendChild(el('b', { text: k })); kv.appendChild(el('span', { class: 'mono', text: val })); }
      add('Offset', G.hx(s.off));
      add('Daten ab', G.hx(s.off + 16));
      add('Abtastrate', s.rate + ' Hz');
      add('Laenge', s.size.toLocaleString('de-DE') + ' Byte · ' + s.dur.toFixed(3) + ' s');
      add('Typ', s.type ? 'Schleife ab ' + s.loop : 'einmalig');
      add('Zeiger', s.refs.length + (s.refs.length ? ' (' + s.refs.slice(0, 2).map(function (x) { return G.hx(x); }).join(', ') + ')' : ''));
      box.appendChild(kv);
      box.appendChild(el('div', { class: 'row', style: 'margin-top:12px' }, [
        el('button', { class: 'primary', text: '▶ Abspielen', onclick: function () { play(s); } }),
        el('button', { text: 'WAV speichern', onclick: function () { G.download(s.id + '_' + s.rate + 'Hz.wav', toWav(App.rom.data, s), 'audio/wav'); } }),
        el('button', { text: 'WAV einspielen', onclick: function () { importOne(s); } })
      ]));
      box.appendChild(el('p', { class: 'hint', style: 'margin-top:8px',
        text: 'Kuerzere Aufnahmen passen immer. Laengere werden ans ROM-Ende verschoben und alle Zeiger angepasst - '
          + 'das geht nur, wenn mindestens ein Zeiger bekannt ist.' }));
      return box;
    }

    function drawWave(cv, d, s) {
      var w = cv.clientWidth || 280, h = 80;
      cv.width = w; cv.height = h;
      var ctx = cv.getContext('2d');
      ctx.fillStyle = '#0f1218'; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#333b4b'; ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
      ctx.strokeStyle = '#ff8a2b'; ctx.beginPath();
      var step = s.size / w;
      for (var x = 0; x < w; x++) {
        var a = (x * step) | 0, b = Math.min(s.size, ((x + 1) * step) | 0), mn = 127, mx = -128;
        for (var i = a; i < b; i++) { var vv = (d[s.off + 16 + i] << 24) >> 24; if (vv < mn) mn = vv; if (vv > mx) mx = vv; }
        if (mn > mx) { mn = mx = 0; }
        ctx.moveTo(x + .5, h / 2 - mx / 128 * (h / 2 - 2));
        ctx.lineTo(x + .5, h / 2 - mn / 128 * (h / 2 - 2));
      }
      ctx.stroke();
      if (s.type && s.loop) {
        var lx = s.loop / s.size * w;
        ctx.strokeStyle = '#4da3ff'; ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, h); ctx.stroke();
      }
    }

    var actx = null;
    function play(s) {
      try {
        if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
        var d = App.rom.data, buf = actx.createBuffer(1, s.size, Math.max(3000, s.rate));
        var ch = buf.getChannelData(0);
        for (var i = 0; i < s.size; i++) ch[i] = (((d[s.off + 16 + i] << 24) >> 24)) / 128;
        var src = actx.createBufferSource();
        src.buffer = buf; src.connect(actx.destination); src.start();
      } catch (e) { G.toast('Wiedergabe nicht moeglich: ' + e.message, 'err'); }
    }

    async function importOne(s) {
      var f = await G.pickFile('.wav'); if (!f) return;
      try {
        var wav = fromWav(await G.readFileBytes(f));
        var rate = st.keepRate ? s.rate : wav.rate;
        var pcm = resampleTo8(wav.data, wav.rate, rate);
        var alloc = new G.Allocator(App.rom, false);
        var r = writeSample(App.rom, s, pcm, rate, alloc);
        G.updateStatus();
        G.toast('Sample ersetzt' + (r.moved ? ', verschoben nach ' + G.hx(r.to) : ' (an Ort und Stelle)') + '.');
        render();
      } catch (e) { G.toast('Fehler: ' + e.message, 'err'); }
    }

    async function exportZip(fl) {
      G.busy('WAV-Dateien werden erzeugt ...'); await G.yieldUI();
      var z = new G.ZipWriter();
      for (var i = 0; i < fl.length; i++) {
        z.add(fl[i].id + '_' + fl[i].rate + 'Hz.wav', toWav(App.rom.data, fl[i]));
        if ((i & 15) === 0) { G.busyProgress(i / fl.length, 'Sample ' + i + ' / ' + fl.length); await G.yieldUI(); }
      }
      var blob = z.build();
      G.busy(false);
      G.download('sounds.zip', blob, 'application/zip');
      G.toast(fl.length + ' Samples exportiert.');
    }

    async function importMany() {
      var files = await G.pickFile('.wav', true);
      if (!files || !files.length) return;
      var byId = {}; DB.list.forEach(function (s) { byId[s.id] = s; });
      var alloc = new G.Allocator(App.rom, false), rep = [], ok = 0;
      G.busy('WAV-Dateien werden eingespielt ...'); await G.yieldUI();
      for (var i = 0; i < files.length; i++) {
        var f = files[i], m = /(snd_[0-9a-f]{6})/i.exec(f.name);
        if (!m || !byId[m[1].toLowerCase()]) { rep.push('uebersprungen: ' + f.name); continue; }
        try {
          var s = byId[m[1].toLowerCase()];
          var wav = fromWav(await G.readFileBytes(f));
          var pcm = resampleTo8(wav.data, wav.rate, s.rate);
          var r = writeSample(App.rom, s, pcm, s.rate, alloc);
          ok++; rep.push(s.id + ': ' + (r.moved ? 'verschoben nach ' + G.hx(r.to) : 'ersetzt') + ' (' + pcm.length + ' B)');
        } catch (e) { rep.push('FEHLER ' + f.name + ': ' + e.message); }
        G.busyProgress(i / files.length);
        await G.yieldUI();
      }
      G.busy(false); G.updateStatus();
      await G.modal(ok + ' Samples ersetzt', el('pre', { class: 'mono', style: 'white-space:pre-wrap;font-size:12px', text: rep.join('\n') }),
        [{ label: 'OK', value: true, primary: true }]);
      render();
    }
  }
});

G.soundScan = scanSamples;
G.wav = { toWav: toWav, fromWav: fromWav, resampleTo8: resampleTo8 };
G.soundWrite = writeSample;
})(window);
