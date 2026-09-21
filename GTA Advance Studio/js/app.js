/* GTA Advance Studio - app.js : Programmrahmen, Navigation, Dialoge */
(function (global) {
'use strict';
var G = global.GTAS;

var App = G.App = {
  rom: null,
  tabs: [],
  active: null,
  project: { name: 'Unbenanntes Projekt', notes: '' }
};

/* ---------------------------------------------------------------- DOM-Hilfen */
function $(id) { return document.getElementById(id); }
function el(tag, attrs, children) {
  var e = document.createElement(tag);
  if (attrs) for (var k in attrs) {
    if (k === 'class') e.className = attrs[k];
    else if (k === 'text') e.textContent = G.t(attrs[k]);
    else if (k === 'html') e.innerHTML = G.t(attrs[k]);
    else if (k === 'title' || k === 'placeholder') e.setAttribute(k, G.t(attrs[k]));
    else if (k.slice(0, 2) === 'on') e[k] = attrs[k];
    else if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k]);
  }
  if (children) for (var i = 0; i < children.length; i++) {
    var c = children[i];
    if (c === null || c === undefined) continue;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return e;
}
function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }
G.$ = $; G.el = el; G.clear = clear;

/* ---------------------------------------------------------------- Meldungen */
var toastTimer = null;
function toast(msg, kind) {
  var t = $('toast');
  t.textContent = G.t(msg);
  t.className = 'show' + (kind ? ' ' + kind : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.className = ''; }, kind === 'err' ? 6000 : 3000);
}
G.toast = toast;

function busy(text) {
  var b = $('busy');
  if (text === false) { b.classList.remove('show'); return; }
  $('busyText').textContent = G.t(text || 'Bitte warten ...');
  $('busyBar').style.width = '0%';
  b.classList.add('show');
}
function busyProgress(frac, text) {
  $('busyBar').style.width = Math.round(frac * 100) + '%';
  if (text) $('busyText').textContent = G.t(text);
}
G.busy = busy; G.busyProgress = busyProgress;
/* Gibt dem Browser Zeit zum Zeichnen */
function yieldUI() { return new Promise(function (r) { setTimeout(r, 0); }); }
G.yieldUI = yieldUI;

/* Modal-Dialog */
function modal(title, bodyNode, buttons) {
  return new Promise(function (resolve) {
    var wrap = $('modal'), box = $('modalBox');
    clear(box);
    box.appendChild(el('h3', { text: G.t(title) }));
    var body = el('div', { class: 'modal-body' });
    if (typeof bodyNode === 'string') body.appendChild(el('div', { html: G.t(bodyNode) }));
    else body.appendChild(bodyNode);
    box.appendChild(body);
    var foot = el('div', { class: 'modal-foot' });
    (buttons || [{ label: 'OK', value: true }]).forEach(function (b) {
      foot.appendChild(el('button', {
        class: b.primary ? 'primary' : (b.danger ? 'danger' : ''),
        text: G.t(b.label),
        onclick: function () { wrap.classList.remove('show'); resolve(b.value); }
      }));
    });
    box.appendChild(foot);
    wrap.classList.add('show');
    wrap.onclick = function (e) { if (e.target === wrap) { wrap.classList.remove('show'); resolve(null); } };
  });
}
G.modal = modal;
function confirmBox(title, text) {
  return modal(title, '<p>' + G.t(text) + '</p>', [
    { label: 'Abbrechen', value: false },
    { label: 'Ja, ausfuehren', value: true, primary: true }
  ]);
}
G.confirmBox = confirmBox;

/* ---------------------------------------------------------------- Dateien */
function download(name, bytes, mime) {
  var blob = new Blob([bytes], { type: mime || 'application/octet-stream' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
}
G.download = download;

function pickFile(accept, multiple) {
  return new Promise(function (resolve) {
    var inp = el('input', { type: 'file', accept: accept || '', style: 'display:none' });
    if (multiple) inp.multiple = true;
    inp.onchange = function () { var f = multiple ? Array.prototype.slice.call(inp.files) : inp.files[0]; inp.remove(); resolve(f || null); };
    document.body.appendChild(inp); inp.click();
  });
}
G.pickFile = pickFile;

function readFileBytes(file) {
  return new Promise(function (resolve, reject) {
    var r = new FileReader();
    r.onload = function () { resolve(new Uint8Array(r.result)); };
    r.onerror = function () { reject(new Error('Datei konnte nicht gelesen werden')); };
    r.readAsArrayBuffer(file);
  });
}
G.readFileBytes = readFileBytes;

function readFileText(file) {
  return new Promise(function (resolve, reject) {
    var r = new FileReader();
    r.onload = function () { resolve(r.result); };
    r.onerror = function () { reject(new Error('Datei konnte nicht gelesen werden')); };
    r.readAsText(file);
  });
}
G.readFileText = readFileText;

/* ---------------------------------------------------------------- Tabs */
function registerTab(def) { App.tabs.push(def); }
G.registerTab = registerTab;

G.buildNav = buildNav;
function buildNav() {
  var nav = clear($('nav'));
  App.tabs.forEach(function (t) {
    var b = el('button', {
      class: 'navbtn', id: 'nav_' + t.id, title: t.hint || '',
      onclick: function () { selectTab(t.id); }
    }, [el('span', { class: 'ico', text: t.icon || '' }), el('span', { text: G.t(t.label) })]);
    nav.appendChild(b);
  });
}
function selectTab(id) {
  var t = App.tabs.filter(function (x) { return x.id === id; })[0];
  if (!t) return;
  if (t.needsRom && !App.rom) { toast('Bitte zuerst eine ROM laden.', 'err'); return; }
  App.active = id;
  Array.prototype.forEach.call(document.querySelectorAll('.navbtn'), function (b) { b.classList.remove('on'); });
  var nb = $('nav_' + id); if (nb) nb.classList.add('on');
  var view = clear($('view'));
  view.scrollTop = 0;
  try { t.render(view); } catch (e) { view.appendChild(el('div', { class: 'card err', text: 'Fehler in "' + t.label + '": ' + e.message })); console.error(e); }
  updateStatus();
}
G.selectTab = selectTab;

function refreshTab() { if (App.active) selectTab(App.active); }
G.refreshTab = refreshTab;

function updateStatus() {
  var s = $('status');
  if (!App.rom) { s.textContent = G.t('Keine ROM geladen'); return; }
  var ch = App.rom.changedBytes(), loc = G.lang === 'de' ? 'de-DE' : 'en-US';
  s.innerHTML = '<b>' + App.rom.name + '</b> &middot; ' + (App.rom.data.length / 1048576).toFixed(0) + ' MB &middot; ' +
    (ch ? '<span class="warn">' + G.t('{0} geaenderte Bytes').replace('{0}', ch.toLocaleString(loc)) + '</span>' : G.t('unveraendert')) +
    ' &middot; ' + G.t('frei ab {0}').replace('{0}', G.hx(App.rom.freeStart()));
}
G.updateStatus = updateStatus;

/* ---------------------------------------------------------------- ROM laden */
var EXPECTED_SHA1 = '06230842626da504f92396074f7c655e100f5d44';
G.EXPECTED_SHA1 = EXPECTED_SHA1;

async function loadRomFile(file) {
  busy('ROM wird gelesen ...');
  await yieldUI();
  try {
    var bytes = await readFileBytes(file);
    if (bytes.length < 0x100000) throw new Error('Datei ist zu klein fuer eine GBA-ROM.');
    busyProgress(0.4, 'Pruefsumme wird berechnet ...');
    await yieldUI();
    var rom = new G.Rom(bytes, file.name);
    App.rom = rom;
    G.cache = {};                       /* Analyse-Zwischenspeicher leeren */
    busy(false);
    if (rom.sha1 !== EXPECTED_SHA1) {
      toast('Andere ROM-Version erkannt - bekannte Adressen koennen abweichen.', 'warn');
    } else {
      toast('ROM geladen und verifiziert (GTA Advance Europe).');
    }
    buildNav();
    selectTab('rom');
  } catch (e) {
    busy(false);
    toast('Fehler: ' + e.message, 'err');
    console.error(e);
  }
}
G.loadRomFile = loadRomFile;

/* ---------------------------------------------------------------- Start */
function buildLangPicker() {
  var sel = el('select', { id: 'langSel', title: 'Sprache der Oberflaeche / interface language',
    onchange: function () { G.setLang(this.value); } });
  G.LANGS.forEach(function (l) { sel.appendChild(el('option', { value: l.id, text: l.name })); });
  sel.value = G.lang;
  var host = $('langHost');
  if (host) { clear(host); host.appendChild(sel); }
}
G.buildLangPicker = buildLangPicker;

/* Feste Texte aus index.html (Kopfleiste, Warte-Anzeige) uebersetzen.
   Der deutsche Ursprungstext wird einmalig gemerkt. */
function translateStatic() {
  ['btnLoadRom', 'btnProject', 'btnSaveRom', 'busyText'].forEach(function (id) {
    var n = $(id);
    if (!n) return;
    if (!n.dataset.de) n.dataset.de = n.textContent;
    n.textContent = G.t(n.dataset.de);
  });
  var sel = $('langSel');
  if (sel) sel.value = G.lang;
}
G.translateStatic = translateStatic;

function start() {
  G.initLang();
  buildLangPicker();
  translateStatic();
  buildNav();
  $('btnLoadRom').onclick = async function () {
    var f = await pickFile('.gba,.bin');
    if (f) loadRomFile(f);
  };
  $('btnSaveRom').onclick = function () { G.saveRom(); };
  $('btnProject').onclick = function () { selectTab('rom'); };

  document.body.addEventListener('dragover', function (e) { e.preventDefault(); document.body.classList.add('drag'); });
  document.body.addEventListener('dragleave', function (e) { if (e.target === document.body) document.body.classList.remove('drag'); });
  document.body.addEventListener('drop', function (e) {
    e.preventDefault(); document.body.classList.remove('drag');
    var f = e.dataTransfer.files[0];
    if (!f) return;
    if (/\.(gba|bin)$/i.test(f.name)) loadRomFile(f);
    else if (/\.gtastudio$/i.test(f.name)) G.loadProject(f);
    else toast('Bitte eine .gba-ROM oder eine .gtastudio-Projektdatei ablegen.', 'err');
  });

  selectTab('start');
}
G.start = start;

/* ROM speichern (mit Kopf-Pruefsumme) */
G.saveRom = function () {
  if (!App.rom) { toast('Keine ROM geladen.', 'err'); return; }
  App.rom.fixHeader();
  var base = App.rom.name.replace(/\.(gba|bin)$/i, '');
  G.download(base + '_mod.gba', App.rom.data, 'application/octet-stream');
  toast('Gemoddete ROM gespeichert.');
};

window.addEventListener('DOMContentLoaded', start);
window.addEventListener('beforeunload', function (e) {
  if (App.rom && App.rom.changedBytes() > 0) { e.preventDefault(); e.returnValue = ''; }
});

})(window);
