/* GTA Advance Studio - Sprachen
   Die Oberflaeche ist auf Deutsch geschrieben; dieser Baustein uebersetzt sie
   zur Laufzeit. Uebersetzt wird an wenigen Stellen zentral (el, toast, busy,
   modal, Navigation), damit die Fachmodule frei von Sprachcode bleiben.

   Zahlen und Hex-Werte werden vor dem Nachschlagen durch Platzhalter ersetzt,
   damit zusammengesetzte Meldungen wie "3 von 116 Bildern" mit einem einzigen
   Eintrag abgedeckt sind. Fehlt ein Eintrag, bleibt der deutsche Text stehen -
   die Oberflaeche bricht also nie weg. */
(function (global) {
'use strict';
var G = global.GTAS = global.GTAS || {};

G.LANGS = [
  { id: 'de', name: 'Deutsch' },
  { id: 'en', name: 'English' },
  { id: 'es', name: 'Espanol' },
  { id: 'fr', name: 'Francais' },
  { id: 'it', name: 'Italiano' }
];
G.LANGDATA = G.LANGDATA || {};
G.lang = 'de';
G.i18nMiss = Object.create(null);     /* gesammelte Fehlstellen, hilft beim Pflegen */
G.i18nCollect = false;

/* Veraenderliche Teile: Anfuehrungszeichen-Namen, Hex-Werte, Zahlen und Masse
   wie 240x160. Sie werden zu {0},{1},... damit alle Varianten einer Meldung
   von einem einzigen Eintrag abgedeckt sind. */
var TOKEN = /"[^"]*"|[\w\-.]+\.(?:png|wav|json|csv|bin|gba)\b|\b[a-z]{2,6}_[0-9a-f]{4,8}\b|0x[0-9A-Fa-f]+|\b[0-9A-F]{6,8}\b|\b\d+(?:[.,]\d+)*(?:x\d*(?:[.,]\d+)*)?/g;

/* Text -> Vorlage mit {0},{1}, ... und die herausgeloesten Werte */
function tokenize(s) {
  var vals = [], i = 0;
  var tpl = s.replace(TOKEN, function (m) {
    vals.push(m);
    return '{' + (i++) + '}';
  });
  return { tpl: tpl, vals: vals };
}
function detokenize(tpl, vals) {
  return tpl.replace(/\{(\d+)\}/g, function (m, k) {
    var v = vals[+k];
    return v === undefined ? m : v;
  });
}

function t(s) {
  if (typeof s !== 'string' || !s) return s;
  if (G.lang === 'de') return s;
  var dict = G.LANGDATA[G.lang];
  if (!dict) return s;
  if (dict[s] !== undefined) return dict[s];
  /* Mehrzeilige Berichte zeilenweise */
  if (s.indexOf('\n') >= 0) return s.split('\n').map(t).join('\n');
  var tk = tokenize(s);
  if (tk.vals.length) {
    var tr = dict[tk.tpl];
    if (tr !== undefined) return detokenize(tr, tk.vals);
  }
  /* Icon oder Kennbuchstabe vor dem Text ("♪ Sound", "A Schriften") */
  var m = /^([^\sA-Za-z0-9]{1,2}\s+|[A-Z]\s+)(.+)$/.exec(s);
  if (m) {
    var rest = t(m[2]);
    if (rest !== m[2]) return m[1] + rest;
  }
  /* "Kopf: Meldung" - beide Teile einzeln, z. B. "Import fehlgeschlagen: <Fehler>" */
  var c = s.indexOf(': ');
  if (c > 0) {
    var head = s.slice(0, c), tail = s.slice(c + 2);
    var th = t(head), tt = t(tail);
    if (th !== head || tt !== tail) return th + ': ' + tt;
  }
  if (G.i18nCollect) G.i18nMiss[tk.vals.length ? tk.tpl : s] = 1;
  return s;
}
G.t = t;

G.setLang = function (id, quiet) {
  if (!G.LANGS.some(function (l) { return l.id === id; })) return;
  G.lang = id;
  try { localStorage.setItem('gtas_lang', id); } catch (e) {}
  document.documentElement.setAttribute('lang', id);
  if (!quiet) {
    if (G.translateStatic) G.translateStatic();
    if (G.buildNav) G.buildNav();
    if (G.refreshTab) G.refreshTab();
    if (G.updateStatus) G.updateStatus();
  }
};
G.initLang = function () {
  var id = null;
  try { id = localStorage.getItem('gtas_lang'); } catch (e) {}
  if (!id) {
    var nav = (navigator.language || 'de').slice(0, 2).toLowerCase();
    if (G.LANGS.some(function (l) { return l.id === nav; })) id = nav;
  }
  G.setLang(id || 'de', true);
};

/* Bequemlichkeit: gesammelte Fehlstellen als JSON holen */
G.i18nReport = function () { return Object.keys(G.i18nMiss).sort(); };

})(window);
