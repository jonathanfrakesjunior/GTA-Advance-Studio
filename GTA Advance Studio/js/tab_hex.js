/* GTA Advance Studio - Hex-/Rohdaten-Editor */
(function (global) {
'use strict';
var G = global.GTAS, el = G.el, App = G.App;
G.cache = G.cache || {};

var MARKS = [
  [0x0000A0, 'ROM-Kopf (Titel, Code, Pruefsumme)'],
  [0x071E1C, 'Erstes PCM-Sample'],
  [0x330000, 'Textbereich Anfang'],
  [0x3D0000, 'Interne Bezeichner'],
  [0x3F0218, 'Erste Welt-Textur'],
  [0x7C9964, 'Menue-Texte (UI)'],
  [0x8DCC48, 'Insel 1: Objektliste (360)'],
  [0x8DE2D0, 'Insel 1: Kollisionsebene'],
  [0x8EE2D8, 'Insel 1: Zonen (5)'],
  [0x8EE31C, 'Insel 1: Zellen'],
  [0x90E324, 'Insel 1: Ebene B'],
  [0x9AF180, 'Insel 2: Objektliste (355)'],
  [0x9B07B8, 'Insel 2: Kollisionsebene'],
  [0x9B87E0, 'Insel 2: Zellen'],
  [0xA5B9F8, 'Insel 3: Objektliste (255)'],
  [0xA5C9F0, 'Insel 3: Kollisionsebene'],
  [0xA64A18, 'Insel 3: Zellen'],
  [0xA80000, 'Sprite-Bereich Anfang'],
  [0xC98C6C, 'Abspann-Texttabellen'],
  [0xCA788C, 'Sound-Index (Sample-Zeiger)'],
  [0xCC0000, 'Dialogtabellen'],
  [0xD40000, 'Ereignis-Datensaetze'],
  [0xEBFBA4, 'Block-/Modelltabelle'],
  [0xEC46D4, 'UI-Stringtabelle (3090)']
];

function hexDump(d, start, rows) {
  var out = '';
  for (var r = 0; r < rows; r++) {
    var o = start + r * 16;
    if (o >= d.length) break;
    var line = G.hex(o, 7) + '  ', asc = '';
    for (var i = 0; i < 16; i++) {
      if (o + i < d.length) {
        var b = d[o + i];
        line += (b < 16 ? '0' : '') + b.toString(16).toUpperCase() + ' ';
        asc += (b >= 32 && b < 127) ? String.fromCharCode(b) : '.';
      } else { line += '   '; asc += ' '; }
      if (i === 7) line += ' ';
    }
    out += line + ' ' + asc + '\n';
  }
  return out;
}

G.registerTab({
  id: 'hex', label: 'Hex / Rohdaten', icon: '⌗', needsRom: true,
  render: function (v) {
    var st = G.cache.hexui || (G.cache.hexui = { addr: 0x8DCC48, rows: 40 });
    var rom = App.rom;

    v.appendChild(el('h2', { text: 'Hex- und Rohdaten-Editor' }));
    v.appendChild(el('p', { class: 'lead',
      text: 'Direkter Zugriff auf jede Stelle der ROM - fuer alles, was die anderen Werkzeuge nicht abdecken. '
        + 'Die Lesezeichen fuehren zu allen bekannten Strukturen.' }));

    var addrIn = el('input', { type: 'text', value: '0x' + G.hex(st.addr, 6), style: 'width:120px;font-family:Consolas,monospace' });
    var view = el('div', { class: 'hexview' });
    var info = el('div', { class: 'hint', style: 'margin-top:6px' });

    function goto(a) {
      a = Math.max(0, Math.min(rom.data.length - 16, a | 0));
      st.addr = a & ~15;
      addrIn.value = '0x' + G.hex(st.addr, 6);
      redraw();
    }
    function redraw() {
      view.textContent = hexDump(rom.data, st.addr, st.rows);
      var d = rom.data, o = st.addr;
      info.textContent = 'Bereich: ' + G.regionName(o)
        + '   ·   u32 @' + G.hx(o) + ' = 0x' + G.hex(G.u32(d, o), 8)
        + '   ·   u16 = ' + G.u16(d, o)
        + (((G.u32(d, o) >>> 24) === 0x08) ? '   ·   Zeiger auf ' + G.hx(G.u32(d, o) & 0xFFFFFF) : '');
    }

    var markSel = el('select', { onchange: function () { if (this.value !== '') goto(+this.value); } });
    markSel.appendChild(el('option', { value: '', text: 'Lesezeichen ...' }));
    MARKS.forEach(function (m) { markSel.appendChild(el('option', { value: m[0], text: G.hex(m[0], 6) + '  ' + m[1] })); });

    v.appendChild(el('div', { class: 'toolbar' }, [
      el('span', { class: 'mut', text: 'Adresse' }), addrIn,
      el('button', { text: 'Gehe zu', onclick: function () { goto(parseInt(addrIn.value.replace(/^0x/i, ''), 16)); } }),
      el('button', { text: '‹ −256', onclick: function () { goto(st.addr - 256); } }),
      el('button', { text: '+256 ›', onclick: function () { goto(st.addr + 256); } }),
      markSel,
      el('span', { class: 'sep' }),
      el('button', { text: 'Suchen', onclick: search }),
      el('button', { text: 'Bytes bearbeiten', onclick: editBytes }),
      el('button', { text: 'Bereich speichern', onclick: dumpRegion }),
      el('button', { text: 'Bereich einspielen', onclick: loadRegion })
    ]));
    v.appendChild(view);
    v.appendChild(info);
    addrIn.onkeydown = function (e) { if (e.key === 'Enter') goto(parseInt(addrIn.value.replace(/^0x/i, ''), 16)); };
    view.addEventListener('wheel', function (e) {
      e.preventDefault();
      goto(st.addr + (e.deltaY > 0 ? 160 : -160));
    }, { passive: false });
    redraw();

    async function search() {
      var inp = el('input', { type: 'text', placeholder: 'z. B. 30 A0 00 oder "PORTLAND"', style: 'width:100%' });
      var from = el('input', { type: 'text', value: '0x' + G.hex(st.addr, 6), style: 'width:120px' });
      var box = el('div', {}, [
        el('div', { class: 'langbox' }, [el('span', { class: 'lg', text: 'Suche' }), inp]),
        el('div', { class: 'langbox' }, [el('span', { class: 'lg', text: 'ab' }), from]),
        el('p', { class: 'hint', text: 'Hex-Bytes durch Leerzeichen trennen, Text in Anfuehrungszeichen setzen.' })
      ]);
      var ok = await G.modal('In der ROM suchen', box, [{ label: 'Abbrechen', value: false }, { label: 'Suchen', value: true, primary: true }]);
      if (!ok || !inp.value.trim()) return;
      var q = inp.value.trim(), pat;
      if (/^["'].*["']$/.test(q)) {
        var s = q.slice(1, -1);
        pat = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) pat[i] = s.charCodeAt(i) & 255;
      } else {
        var parts = q.split(/[\s,]+/).filter(Boolean);
        pat = new Uint8Array(parts.length);
        for (var k = 0; k < parts.length; k++) {
          var b = parseInt(parts[k], 16);
          if (isNaN(b)) { G.toast('Ungueltiges Byte: ' + parts[k], 'err'); return; }
          pat[k] = b & 255;
        }
      }
      var d = rom.data, start = (parseInt(from.value.replace(/^0x/i, ''), 16) | 0) + 1;
      for (var o = start; o < d.length - pat.length; o++) {
        var hit = true;
        for (var j = 0; j < pat.length; j++) if (d[o + j] !== pat[j]) { hit = false; break; }
        if (hit) { goto(o); G.toast('Gefunden bei ' + G.hx(o)); return; }
      }
      G.toast('Nicht gefunden.', 'warn');
    }

    async function editBytes() {
      var at = el('input', { type: 'text', value: '0x' + G.hex(st.addr, 6), style: 'width:120px' });
      var bytes = el('textarea', { style: 'width:100%;min-height:80px', placeholder: '00 11 22 AA ...' });
      bytes.value = Array.prototype.slice.call(rom.data.subarray(st.addr, st.addr + 16))
        .map(function (b) { return (b < 16 ? '0' : '') + b.toString(16).toUpperCase(); }).join(' ');
      var box = el('div', {}, [
        el('div', { class: 'langbox' }, [el('span', { class: 'lg', text: 'Adresse' }), at]),
        el('div', { class: 'langbox' }, [el('span', { class: 'lg', text: 'Bytes' }), bytes]),
        el('p', { class: 'hint', text: 'Die angegebenen Bytes werden ab dieser Adresse geschrieben. Laenge frei waehlbar.' })
      ]);
      var ok = await G.modal('Bytes schreiben', box, [{ label: 'Abbrechen', value: false }, { label: 'Schreiben', value: true, primary: true }]);
      if (!ok) return;
      var o = parseInt(at.value.replace(/^0x/i, ''), 16);
      var parts = bytes.value.trim().split(/[\s,]+/).filter(Boolean), arr = new Uint8Array(parts.length);
      for (var i = 0; i < parts.length; i++) {
        var b = parseInt(parts[i], 16);
        if (isNaN(b)) { G.toast('Ungueltiges Byte: ' + parts[i], 'err'); return; }
        arr[i] = b & 255;
      }
      if (o < 0 || o + arr.length > rom.data.length) { G.toast('Bereich liegt ausserhalb der ROM.', 'err'); return; }
      rom.data.set(arr, o);
      G.updateStatus(); G.toast(arr.length + ' Bytes geschrieben.'); goto(o);
    }

    async function dumpRegion() {
      var a = el('input', { type: 'text', value: '0x' + G.hex(st.addr, 6), style: 'width:120px' });
      var n = el('input', { type: 'text', value: '0x1000', style: 'width:120px' });
      var box = el('div', {}, [
        el('div', { class: 'langbox' }, [el('span', { class: 'lg', text: 'ab' }), a]),
        el('div', { class: 'langbox' }, [el('span', { class: 'lg', text: 'Laenge' }), n])
      ]);
      var ok = await G.modal('Bereich als Datei speichern', box, [{ label: 'Abbrechen', value: false }, { label: 'Speichern', value: true, primary: true }]);
      if (!ok) return;
      var o = parseInt(a.value.replace(/^0x/i, ''), 16), ln = parseInt(n.value.replace(/^0x/i, ''), 16);
      G.download('rom_' + G.hex(o, 6) + '_' + ln + '.bin', rom.data.slice(o, o + ln));
    }

    async function loadRegion() {
      var f = await G.pickFile('.bin,.dat'); if (!f) return;
      var a = el('input', { type: 'text', value: '0x' + G.hex(st.addr, 6), style: 'width:120px' });
      var ok = await G.modal('Datei an Adresse schreiben',
        el('div', {}, [
          el('div', { class: 'langbox' }, [el('span', { class: 'lg', text: 'Adresse' }), a]),
          el('p', { class: 'hint', text: 'Datei: ' + f.name + ' (' + f.size + ' Byte)' })
        ]),
        [{ label: 'Abbrechen', value: false }, { label: 'Schreiben', value: true, primary: true }]);
      if (!ok) return;
      var bytes = await G.readFileBytes(f), o = parseInt(a.value.replace(/^0x/i, ''), 16);
      if (o < 0 || o + bytes.length > rom.data.length) { G.toast('Passt nicht in die ROM.', 'err'); return; }
      rom.data.set(bytes, o);
      G.updateStatus(); G.toast(bytes.length + ' Bytes geschrieben.'); goto(o);
    }
  }
});
})(window);
