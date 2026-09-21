/* GTA Advance Studio - Text-Editor (alle Spieltexte, 5 Sprachen) */
(function (global) {
'use strict';
var G = global.GTAS, el = G.el, App = G.App;
G.cache = G.cache || {};

var LANGS = ['EN', 'ES', 'FR', 'IT', 'DE'];
var LANGNAME = { EN: 'Englisch', ES: 'Spanisch', FR: 'Franzoesisch', IT: 'Italienisch', DE: 'Deutsch', '?': 'unbekannt' };

function okByte(b) { return (b >= 0x20 && b <= 0x7E) || (b >= 0xA0 && b <= 0xFF); }

function decodeAt(d, off, max) {
  var s = '', i = off, n = Math.min(d.length, off + (max || 1024));
  while (i < n) {
    var b = d[i];
    if (b === 0) return { text: s, len: i - off };
    if (!okByte(b)) return null;
    s += String.fromCharCode(b);
    i++;
  }
  return null;
}
function encodeLatin1(s) {
  var out = new Uint8Array(s.length), bad = 0;
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    if (c > 255) { c = 63; bad++; }
    out[i] = c;
  }
  return { bytes: out, bad: bad };
}

/* Alle ueber Pointer erreichbaren Zeichenketten sammeln */
async function scanStrings(rom, onProgress) {
  if (G.cache.text) return G.cache.text;
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
  if (onProgress) onProgress(0.5, 'Texte werden gelesen ...');
  await G.yieldUI();

  var list = [], keys = [];
  refs.forEach(function (v, k) { keys.push(k); });
  keys.sort(function (a, b) { return a - b; });
  for (i = 0; i < keys.length; i++) {
    var off = keys[i];
    if (!okByte(d[off])) continue;
    var r = decodeAt(d, off, 1024);
    if (!r || r.len < 2) continue;
    if (!/[A-Za-zÀ-ÿ]/.test(r.text)) continue;
    var loc = refs.get(off);
    /* Platz bis zum naechsten belegten Ziel bzw. bis zum naechsten Nicht-Null-Byte */
    var end = off + r.len + 1, slot = r.len;
    var j = end;
    while (j < d.length && d[j] === 0 && j - end < 64) j++;
    slot = j - off - 1;
    var ident = /^[a-z][a-z0-9_]*$/.test(r.text);
    list.push({ off: off, text: r.text, orig: r.text, len: r.len, slot: slot, refs: loc, ident: ident });
    if ((i & 8191) === 0) { if (onProgress) onProgress(0.5 + 0.5 * i / keys.length); await G.yieldUI(); }
  }

  /* Gruppen bilden: Laeufe von Tabelleneintraegen mit Schrittweite 8 */
  var entries = [];
  list.forEach(function (s) { s.refs.forEach(function (L) { entries.push({ L: L, s: s }); }); });
  entries.sort(function (a, b) { return a.L - b.L; });
  var gid = 0, k = 0;
  while (k < entries.length) {
    var run = [entries[k]], k2 = k + 1;
    while (k2 < entries.length && entries[k2].L - entries[k2 - 1].L === 8) { run.push(entries[k2]); k2++; }
    if (run.length >= 5) {
      for (var b = 0; b + 5 <= run.length; b += 5) {
        gid++;
        for (var q = 0; q < 5; q++) {
          var e = run[b + q];
          if (e.s.group) continue;
          e.s.group = gid;
          e.s.lang = langOf(d, e.L);
        }
      }
    }
    k = k2;
  }
  var res = { list: list, refs: refs, groups: gid };
  G.cache.text = res;
  return res;
}

/* Sprach-Kennung aus dem Tabelleneintrag ableiten */
function langOf(d, L) {
  var a = (L >= 4) ? G.u32(d, L - 4) : 99, b = G.u32(d, L + 4);
  if (a <= 4) return LANGS[a];
  if (b <= 4) return LANGS[(b + 4) % 5];
  return '?';
}

/* Text schreiben: passt er in den alten Platz, sonst verschieben + Pointer anpassen */
function writeString(rom, s, txt, alloc) {
  var enc = encodeLatin1(txt);
  var d = rom.data;
  if (enc.bytes.length <= s.slot) {
    d.set(enc.bytes, s.off);
    for (var i = enc.bytes.length; i <= s.slot; i++) d[s.off + i] = 0;
    s.text = txt; s.len = enc.bytes.length;
    return { moved: false, bad: enc.bad };
  }
  var no = alloc.alloc(enc.bytes.length + 1);
  if (no < 0) throw new Error('kein freier Platz mehr - ROM unter "ROM & Projekt" auf 32 MB erweitern');
  d.set(enc.bytes, no); d[no + enc.bytes.length] = 0;
  for (var k = 0; k < s.refs.length; k++) G.putU32(d, s.refs[k], G.BASE + no);
  s.off = no; s.slot = enc.bytes.length; s.text = txt; s.len = enc.bytes.length;
  return { moved: true, to: no, bad: enc.bad };
}

G.registerTab({
  id: 'text', label: 'Text-Editor', icon: '⌸', needsRom: true,
  render: function (v) {
    var st = G.cache.textui || (G.cache.textui = { q: '', page: 0, mode: 'spiel', lang: 'alle', sel: null });

    v.appendChild(el('h2', { text: 'Text-Editor' }));
    v.appendChild(el('p', { class: 'lead',
      text: 'Alle ueber Zeiger erreichbaren Zeichenketten der ROM: Missionsdialoge in fuenf Sprachen, Menuetexte, '
        + 'Ortsnamen und interne Bezeichner. Laengere Texte werden automatisch ans ROM-Ende verschoben und alle Zeiger nachgezogen.' }));

    var body = el('div'); v.appendChild(body);

    if (!G.cache.text) {
      body.appendChild(el('div', { class: 'card' }, [
        el('p', { text: 'Die ROM muss einmalig nach Texten durchsucht werden.' }),
        el('button', { class: 'primary', text: 'Texte suchen', onclick: async function () {
          G.busy('Texte werden gesucht ...'); await G.yieldUI();
          await scanStrings(App.rom, function (f, t) { G.busyProgress(f, t); });
          G.busy(false); G.refreshTab();
        } })
      ]));
      return;
    }

    var DB = G.cache.text;
    render();

    function filtered() {
      var q = st.q.trim().toLowerCase();
      return DB.list.filter(function (s) {
        if (st.mode === 'spiel' && s.ident) return false;
        if (st.mode === 'ident' && !s.ident) return false;
        if (st.lang !== 'alle' && s.lang !== st.lang) return false;
        if (!q) return true;
        return s.text.toLowerCase().indexOf(q) >= 0 || G.hex(s.off, 6).toLowerCase().indexOf(q) >= 0;
      });
    }

    function render() {
      G.clear(body);
      var fl = filtered(), PER = 120, pages = Math.max(1, Math.ceil(fl.length / PER));
      if (st.page >= pages) st.page = 0;

      var modeSel = el('select', { onchange: function () { st.mode = this.value; st.page = 0; render(); } });
      [['spiel', 'Spieltexte'], ['ident', 'interne Bezeichner'], ['alle', 'alles']].forEach(function (o) {
        modeSel.appendChild(el('option', { value: o[0], text: o[1] }));
      });
      modeSel.value = st.mode;

      var langSel = el('select', { onchange: function () { st.lang = this.value; st.page = 0; render(); } });
      langSel.appendChild(el('option', { value: 'alle', text: 'alle Sprachen' }));
      LANGS.forEach(function (l) { langSel.appendChild(el('option', { value: l, text: LANGNAME[l] })); });
      langSel.value = st.lang;

      body.appendChild(el('div', { class: 'toolbar' }, [
        el('input', { type: 'search', placeholder: 'Volltextsuche ...', value: st.q, style: 'width:270px',
          oninput: function () { st.q = this.value; st.page = 0; render(); } }),
        modeSel, langSel,
        el('span', { class: 'sep' }),
        el('button', { text: 'Suchen & Ersetzen', onclick: replaceDialog }),
        el('button', { text: 'Als CSV exportieren', onclick: function () { exportCsv(fl); } }),
        el('button', { text: 'CSV importieren', onclick: importCsv }),
        el('span', { class: 'spacer' }),
        el('span', { class: 'pill', text: fl.length.toLocaleString('de-DE') + ' von ' + DB.list.length.toLocaleString('de-DE') })
      ]));

      var wrap = el('div', { class: 'txtlist' });
      var t = el('table', { class: 'tbl' });
      t.appendChild(el('tr', {}, [
        el('th', { text: 'Offset', style: 'width:82px' }),
        el('th', { text: 'Spr.', style: 'width:44px' }),
        el('th', { text: 'Text' }),
        el('th', { text: 'Platz', style: 'width:76px' }),
        el('th', { text: '', style: 'width:64px' })
      ]));
      fl.slice(st.page * PER, st.page * PER + PER).forEach(function (s) {
        var changed = s.text !== s.orig;
        var tr = el('tr', { class: st.sel === s ? 'sel' : '' });
        tr.appendChild(el('td', { class: 'mono', text: G.hex(s.off, 6) }));
        tr.appendChild(el('td', { class: 'mut', text: s.lang || '' }));
        var td = el('td');
        td.appendChild(el('span', { text: s.text.length > 110 ? s.text.slice(0, 110) + ' ...' : s.text,
          style: changed ? 'color:var(--acc)' : '' }));
        if (s.group) td.appendChild(el('span', { class: 'pill', style: 'margin-left:6px', text: 'Gruppe ' + s.group }));
        tr.appendChild(td);
        tr.appendChild(el('td', { class: 'mut mono', text: s.len + '/' + s.slot }));
        var act = el('td');
        act.appendChild(el('button', { text: 'edit', style: 'padding:2px 8px;min-height:22px',
          onclick: function () { editString(s); } }));
        act.appendChild(el('span'));
        tr.appendChild(act);
        t.appendChild(tr);
      });
      wrap.appendChild(t);
      body.appendChild(wrap);

      if (pages > 1) {
        body.appendChild(el('div', { class: 'row', style: 'margin-top:10px;justify-content:center' }, [
          el('button', { text: '‹ zurueck', onclick: function () { if (st.page > 0) { st.page--; render(); } } }),
          el('span', { class: 'mut', text: 'Seite ' + (st.page + 1) + ' / ' + pages }),
          el('button', { text: 'weiter ›', onclick: function () { if (st.page < pages - 1) { st.page++; render(); } } })
        ]));
      }
    }

    /* Einzelnen Text bzw. die ganze Sprachgruppe bearbeiten */
    async function editString(s) {
      var members = s.group ? DB.list.filter(function (x) { return x.group === s.group; }) : [s];
      members.sort(function (a, b) { return LANGS.indexOf(a.lang) - LANGS.indexOf(b.lang); });
      var box = el('div'), inputs = [];
      members.forEach(function (mm) {
        var ta = el('textarea', { style: 'width:100%' });
        ta.value = mm.text;
        var cnt = el('span', { class: 'hint' });
        function upd() {
          var enc = encodeLatin1(ta.value);
          cnt.textContent = enc.bytes.length + ' / ' + mm.slot + ' Byte'
            + (enc.bytes.length > mm.slot ? '  ' + G.t('→ wird ans ROM-Ende verschoben') : '')
            + (enc.bad ? '  · ' + G.t('{0} Zeichen nicht darstellbar').replace('{0}', enc.bad) : '');
          cnt.className = enc.bad ? 'hint over' : 'hint';
        }
        ta.oninput = upd; upd();
        inputs.push({ s: mm, ta: ta });
        box.appendChild(el('div', { class: 'langbox' }, [
          el('span', { class: 'lg', text: mm.lang || G.hex(mm.off, 6) }),
          el('div', {}, [ta, cnt])
        ]));
      });
      box.appendChild(el('p', { class: 'hint', text: 'Offset ' + G.hx(s.off) + ' · ' + s.refs.length + ' Zeiger '
        + '· GBA-Zeichensatz: nur Zeichen bis Code 255 (Latin-1).' }));

      var ok = await G.modal('Text bearbeiten' + (s.group ? ' (Sprachgruppe ' + s.group + ')' : ''), box,
        [{ label: 'Abbrechen', value: false }, { label: 'Uebernehmen', value: true, primary: true }]);
      if (!ok) return;
      var alloc = new G.Allocator(App.rom, false), moved = 0, badTotal = 0;
      try {
        inputs.forEach(function (it) {
          if (it.ta.value === it.s.text) return;
          var r = writeString(App.rom, it.s, it.ta.value, alloc);
          if (r.moved) moved++;
          badTotal += r.bad;
        });
      } catch (e) { G.toast('Fehler: ' + e.message, 'err'); }
      G.updateStatus();
      G.toast('Gespeichert' + (moved ? ', ' + moved + ' Text(e) verschoben' : '') + (badTotal ? ', ' + badTotal + ' Zeichen ersetzt' : '') + '.');
      render();
    }

    async function replaceDialog() {
      var f = el('input', { type: 'text', placeholder: 'Suchen nach ...', style: 'width:100%' });
      var r = el('input', { type: 'text', placeholder: 'Ersetzen durch ...', style: 'width:100%' });
      var cs = el('input', { type: 'checkbox' });
      var box = el('div', {}, [
        el('div', { class: 'langbox' }, [el('span', { class: 'lg', text: 'Suchen' }), f]),
        el('div', { class: 'langbox' }, [el('span', { class: 'lg', text: 'Ersetzen' }), r]),
        el('label', { class: 'chk' }, [cs, el('span', { text: 'Gross-/Kleinschreibung beachten' })]),
        el('p', { class: 'hint', text: 'Wirkt nur auf die gerade sichtbare Auswahl (Filter und Suche werden beruecksichtigt).' })
      ]);
      var ok = await G.modal('Suchen und Ersetzen', box, [{ label: 'Abbrechen', value: false }, { label: 'Ersetzen', value: true, primary: true }]);
      if (!ok || !f.value) return;
      var fl = filtered(), alloc = new G.Allocator(App.rom, false), cnt = 0, moved = 0;
      var re = new RegExp(f.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), cs.checked ? 'g' : 'gi');
      try {
        fl.forEach(function (s) {
          if (!re.test(s.text)) { re.lastIndex = 0; return; }
          re.lastIndex = 0;
          var nt = s.text.replace(re, r.value);
          if (nt === s.text) return;
          var res = writeString(App.rom, s, nt, alloc);
          cnt++; if (res.moved) moved++;
        });
      } catch (e) { G.toast('Abgebrochen: ' + e.message, 'err'); }
      G.updateStatus();
      G.toast(cnt + ' Texte geaendert' + (moved ? ', ' + moved + ' verschoben' : '') + '.');
      render();
    }

    function exportCsv(fl) {
      var rows = ['offset;sprache;gruppe;platz;text'];
      fl.forEach(function (s) {
        rows.push(G.hex(s.off, 6) + ';' + (s.lang || '') + ';' + (s.group || '') + ';' + s.slot + ';"' + s.text.replace(/"/g, '""') + '"');
      });
      G.download('texte.csv', new TextEncoder().encode('﻿' + rows.join('\r\n')), 'text/csv');
      G.toast(fl.length + ' Texte als CSV exportiert.');
    }

    async function importCsv() {
      var f = await G.pickFile('.csv'); if (!f) return;
      var txt = await G.readFileText(f);
      var lines = txt.replace(/^﻿/, '').split(/\r?\n/), byOff = {};
      DB.list.forEach(function (s) { byOff[G.hex(s.off, 6)] = s; });
      var alloc = new G.Allocator(App.rom, false), cnt = 0, moved = 0, skipped = 0;
      for (var i = 1; i < lines.length; i++) {
        var ln = lines[i]; if (!ln.trim()) continue;
        var m = /^([0-9A-Fa-f]{6});[^;]*;[^;]*;[^;]*;"((?:[^"]|"")*)"$/.exec(ln);
        if (!m) { skipped++; continue; }
        var s = byOff[m[1].toUpperCase()];
        if (!s) { skipped++; continue; }
        var nt = m[2].replace(/""/g, '"');
        if (nt === s.text) continue;
        try { var r = writeString(App.rom, s, nt, alloc); cnt++; if (r.moved) moved++; }
        catch (e) { G.toast('Abgebrochen: ' + e.message, 'err'); break; }
      }
      G.updateStatus();
      G.toast(cnt + ' Texte uebernommen' + (moved ? ', ' + moved + ' verschoben' : '') + (skipped ? ', ' + skipped + ' Zeilen uebersprungen' : '') + '.');
      render();
    }
  }
});

G.textScan = scanStrings;
G.textWrite = writeString;
})(window);
