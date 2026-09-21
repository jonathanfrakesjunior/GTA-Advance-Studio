/* GTA Advance Studio - Missionen, Instanzen und Ereignisse
   Das Spiel haelt seine Missionslogik in benannten Datensaetzen. Dieses Modul
   findet diese Tabellen anhand der Namenszeiger und macht die Felder bearbeitbar. */
(function (global) {
'use strict';
var G = global.GTAS, el = G.el, App = G.App;
G.cache = G.cache || {};

var DATA_LO = 0xC80000, DATA_HI = 0xD60000;

function prefixLabel(p) {
  var M = {
    i: 'Instanzen (platzierte Spielobjekte)',
    e: 'Ereignisse / Textausloeser',
    l: 'Orte und Wegpunkte',
    g: 'globale Eintraege',
    m: 'Missionen',
    t: 'Ausloeser',
    brief: 'Briefings',
    pickup: 'Aufsammelbares',
    package: 'Pakete',
    mission: 'Missionen',
    briefing: 'Briefings',
    pager: 'Pager-Nachrichten',
    start: 'Startpunkte',
    playerstart: 'Spieler-Startpunkte',
    success: 'Erfolgsmeldungen',
    fail: 'Fehlschlaege'
  };
  return M[p] || null;
}

async function buildTables() {
  if (G.cache.mis) return G.cache.mis;
  var db = G.cache.text;
  if (!db) {
    G.busy('Texte werden gesucht (Grundlage fuer die Missionsdaten) ...');
    await G.yieldUI();
    db = await G.textScan(App.rom, function (f, t) { G.busyProgress(f, t); });
    G.busy(false);
  }
  var d = App.rom.data;
  /* Bezeichner nach Offset */
  var identByOff = new Map();
  db.list.forEach(function (s) { if (s.ident) identByOff.set(s.off, s); });

  /* Fundstellen von Namenszeigern im Datenbereich */
  var locs = [];
  identByOff.forEach(function (s, off) {
    s.refs.forEach(function (L) { if (L >= DATA_LO && L < DATA_HI) locs.push({ L: L, s: s }); });
  });
  locs.sort(function (a, b) { return a.L - b.L; });

  /* Laeufe mit konstanter Schrittweite erkennen */
  var tables = [], i = 0;
  while (i < locs.length) {
    var best = null;
    [64, 48, 32, 28, 24, 20, 16, 12, 8].forEach(function (stride) {
      if (best) return;
      var n = 1;
      while (i + n < locs.length && locs[i + n].L - locs[i + n - 1].L === stride) n++;
      if (n >= 4) best = { stride: stride, n: n };
    });
    if (!best) { i++; continue; }
    var base = locs[i].L, recs = [];
    for (var k = 0; k < best.n; k++) recs.push(locs[i + k]);
    /* Haeufigstes Namenspraefix bestimmt die Beschriftung der Tabelle */
    var pc = {};
    recs.forEach(function (r) {
      var p = r.s.text.indexOf('_') > 0 ? r.s.text.split('_')[0] : r.s.text.replace(/[0-9]+$/, '');
      pc[p] = (pc[p] || 0) + 1;
    });
    var prefix = Object.keys(pc).sort(function (a, b) { return pc[b] - pc[a]; })[0];
    tables.push({
      base: base, stride: best.stride, count: best.n,
      prefix: prefix,
      label: (prefixLabel(prefix) || ('"' + prefix + '"-Datensaetze')),
      recs: recs.map(function (r, idx) { return { off: r.L, name: r.s.text, s: r.s, i: idx }; })
    });
    i += best.n;
  }
  /* Tabellen mit gleichem Praefix und gleicher Schrittweite zusammenfassen */
  tables.sort(function (a, b) { return b.count - a.count; });
  var res = { tables: tables, identCount: identByOff.size };
  G.cache.mis = res;
  return res;
}

/* Deutung eines 32-Bit-Feldes */
function describe(d, val) {
  if ((val >>> 24) === 0x08) {
    var t = val & 0xFFFFFF;
    if (t < d.length) {
      var db = G.cache.text;
      if (db) {
        var hit = db.list.filter(function (s) { return s.off === t; })[0];
        if (hit) return { kind: 'str', text: hit.text, s: hit };
      }
      return { kind: 'ptr', target: t };
    }
  }
  if (val === 0) return { kind: 'zero' };
  if (val < 0x10000) return { kind: 'int' };
  return { kind: 'raw' };
}

G.missionTables = buildTables;

G.registerTab({
  id: 'mission', label: 'Missionen & Objekte', icon: '⚑', needsRom: true,
  render: function (v) {
    var st = G.cache.misui || (G.cache.misui = { tab: 0, q: '', sel: null, page: 0 });

    v.appendChild(el('h2', { text: 'Missionen und Objekte' }));
    v.appendChild(el('p', { class: 'lead',
      text: 'Das Spiel beschreibt Missionen, platzierte Objekte und Ereignisse ueber benannte Datensaetze. '
        + 'Das Studio findet diese Tabellen ueber ihre Namenszeiger und zeigt jedes Feld an - '
        + 'Zahlenwerte, Zeiger auf Texte und Verweise auf andere Datensaetze lassen sich direkt aendern.' }));

    var body = el('div'); v.appendChild(body);

    if (!G.cache.mis) {
      body.appendChild(el('div', { class: 'card' }, [
        el('p', { text: 'Die Missionsdaten muessen einmalig analysiert werden.' }),
        el('button', { class: 'primary', text: 'Missionsdaten analysieren', onclick: async function () {
          G.busy('Datensaetze werden gesucht ...'); await G.yieldUI();
          await buildTables(); G.busy(false); G.refreshTab();
        } })
      ]));
      body.appendChild(el('div', { class: 'card warnc' }, [
        el('b', { text: 'Hinweis zum Umfang: ' }),
        el('span', { text: 'Die Namen und die Tabellenstruktur sind gesichert - die Bedeutung der einzelnen Zahlenfelder '
          + 'ist es nicht vollstaendig. Das Studio zeigt darum jedes Feld mit seiner Deutung (Zahl, Zeiger, Text) an, '
          + 'statt eine Bedeutung zu erfinden. Aendere Werte in kleinen Schritten und teste im Emulator.' })
      ]));
      return;
    }

    var DB = G.cache.mis;
    if (!DB.tables.length) { body.appendChild(el('div', { class: 'card err', text: 'Keine benannten Datensatztabellen gefunden.' })); return; }
    render();

    function render() {
      G.clear(body);
      var T = DB.tables[st.tab] || DB.tables[0];

      var tabSel = el('select', { onchange: function () { st.tab = +this.value; st.sel = null; st.page = 0; render(); } });
      DB.tables.forEach(function (t, i) {
        tabSel.appendChild(el('option', { value: i, text: t.label + '  · ' + t.count + ' Eintraege · ' + t.stride + ' Byte' }));
      });
      tabSel.value = st.tab;

      body.appendChild(el('div', { class: 'toolbar' }, [
        el('span', { class: 'mut', text: 'Tabelle' }), tabSel,
        el('input', { type: 'search', placeholder: 'Name suchen ...', value: st.q, style: 'width:220px',
          oninput: function () { st.q = this.value; st.page = 0; render(); } }),
        el('span', { class: 'sep' }),
        el('button', { text: 'Tabelle als CSV', onclick: function () { exportCsv(T); } }),
        el('span', { class: 'spacer' }),
        el('span', { class: 'pill', text: 'Basis ' + G.hx(T.base) })
      ]));

      var q = st.q.trim().toLowerCase();
      var recs = T.recs.filter(function (r) { return !q || r.name.toLowerCase().indexOf(q) >= 0; });
      var PER = 150, pages = Math.max(1, Math.ceil(recs.length / PER));
      if (st.page >= pages) st.page = 0;

      var split = el('div', { class: 'split' }), left = el('div', { style: 'flex:1;min-width:0' }), side = el('div', { class: 'side', style: 'width:360px' });
      split.appendChild(left); split.appendChild(side); body.appendChild(split);

      var wrap = el('div', { class: 'txtlist' }), tb = el('table', { class: 'tbl' });
      tb.appendChild(el('tr', {}, [el('th', { text: '#' }), el('th', { text: 'Name' }), el('th', { text: 'Offset' })]));
      recs.slice(st.page * PER, st.page * PER + PER).forEach(function (r) {
        var tr = el('tr', { class: st.sel === r ? 'sel' : '', onclick: function () { st.sel = r; render(); } });
        tr.appendChild(el('td', { class: 'mut', text: r.i }));
        tr.appendChild(el('td', { text: r.name }));
        tr.appendChild(el('td', { class: 'mono mut', text: G.hex(r.off, 6) }));
        tb.appendChild(tr);
      });
      wrap.appendChild(tb); left.appendChild(wrap);

      if (pages > 1) {
        left.appendChild(el('div', { class: 'row', style: 'margin-top:10px;justify-content:center' }, [
          el('button', { text: '‹', onclick: function () { if (st.page > 0) { st.page--; render(); } } }),
          el('span', { class: 'mut', text: 'Seite ' + (st.page + 1) + ' / ' + pages }),
          el('button', { text: '›', onclick: function () { if (st.page < pages - 1) { st.page++; render(); } } })
        ]));
      }
      side.appendChild(detail(T));
    }

    function detail(T) {
      var box = el('div', { class: 'card sticky' }), r = st.sel, d = App.rom.data;
      if (!r) {
        box.appendChild(el('p', { class: 'hint', text: 'Links einen Datensatz anklicken.' }));
        box.appendChild(el('p', { class: 'hint', text: 'Jeder Eintrag dieser Tabelle ist ' + T.stride + ' Byte gross '
          + 'und beginnt hier beim Namenszeiger.' }));
        return box;
      }
      box.appendChild(el('h4', { text: r.name }));
      box.appendChild(el('p', { class: 'hint mono', text: G.hx(r.off) + '  ·  ' + T.stride + ' Byte' }));

      var tb = el('table', { class: 'tbl' });
      tb.appendChild(el('tr', {}, [el('th', { text: '+' }), el('th', { text: 'Wert' }), el('th', { text: 'Bedeutung' })]));
      for (var f = 0; f < T.stride; f += 4) {
        (function (f) {
          var val = G.u32(d, r.off + f), info = describe(d, val);
          var tr = el('tr');
          tr.appendChild(el('td', { class: 'mut mono', text: f }));
          var td = el('td');
          var inp = el('input', { type: 'text', value: '0x' + G.hex(val, 8), style: 'width:104px;min-height:24px;padding:2px 5px;font-family:Consolas,monospace' });
          inp.onchange = function () {
            var nv = parseInt(inp.value.trim(), inp.value.trim().slice(0, 2).toLowerCase() === '0x' ? 16 : 10);
            if (isNaN(nv)) { G.toast('Ungueltiger Wert.', 'err'); inp.value = '0x' + G.hex(val, 8); return; }
            G.putU32(d, r.off + f, nv >>> 0);
            G.updateStatus(); G.toast('Feld +' + f + ' gesetzt.'); render();
          };
          td.appendChild(inp);
          tr.appendChild(td);
          var td2 = el('td', { class: 'mut', style: 'font-size:11.5px' });
          if (info.kind === 'str') {
            td2.appendChild(el('span', { text: '“' + (info.text.length > 40 ? info.text.slice(0, 40) + '…' : info.text) + '”' }));
            td2.appendChild(el('button', { text: 'Text', style: 'margin-left:5px;padding:1px 6px;min-height:20px',
              onclick: function () { G.cache.textui = G.cache.textui || {}; G.cache.textui.q = info.text.slice(0, 30); G.cache.textui.mode = 'alle'; G.cache.textui.page = 0; G.selectTab('text'); } }));
          } else if (info.kind === 'ptr') td2.textContent = 'Zeiger → ' + G.hx(info.target) + ' (' + G.regionName(info.target) + ')';
          else if (info.kind === 'zero') td2.textContent = '0';
          else if (info.kind === 'int') {
            td2.textContent = val + (val >= 64 && val <= 16384 ? '  ' + G.t('(koennte Weltkoordinate sein)') : '');
          } else {
            var lo = val & 0xFFFF, hi = (val >>> 16) & 0xFFFF;
            td2.textContent = 'u16: ' + lo + ' / ' + hi + '   s32: ' + (val | 0);
          }
          tr.appendChild(td2);
          tb.appendChild(tr);
        })(f);
      }
      box.appendChild(tb);
      box.appendChild(el('p', { class: 'hint', style: 'margin-top:8px',
        text: 'Gezeigt wird ein kompletter Eintrag ab dem Namenszeiger. Alle ' + T.stride + ' Byte sind erfasst; '
          + 'wo genau die logische Satzgrenze liegt, laesst sich aus den Rohdaten nicht ableiten - '
          + 'die letzten Felder koennen bereits zum naechsten Eintrag gehoeren. '
          + 'Werte werden sofort in die ROM geschrieben, "ROM & Projekt" setzt alles zurueck.' }));
      return box;
    }

    function exportCsv(T) {
      var d = App.rom.data, head = ['nr', 'name', 'offset'];
      for (var f = 0; f < T.stride; f += 4) head.push('+' + f);
      var rows = [head.join(';')];
      T.recs.forEach(function (r) {
        var row = [r.i, r.name, G.hex(r.off, 6)];
        for (var f = 0; f < T.stride; f += 4) row.push('0x' + G.hex(G.u32(d, r.off + f), 8));
        rows.push(row.join(';'));
      });
      G.download('tabelle_' + G.hex(T.base, 6) + '.csv', new TextEncoder().encode('﻿' + rows.join('\r\n')), 'text/csv');
      G.toast(T.recs.length + ' Datensaetze exportiert.');
    }
  }
});
})(window);
