/* h3lp page logic. Mobile first, bilingual EN/FR, works offline after the first visit.
   Nothing about the visitor is stored or sent. The one exception is opt-in: the safety
   plan can be kept in this browser, and only when the person chooses it.
   The weather check asks Open-Meteo for a city's forecast (fixed city coordinates). */
(function () {
  "use strict";
  var D = window.H3lpData, I = window.H3lpIntent, SKY = window.H3lpSky;
  if (!D) return;

  var EXIT_URL = "https://www.theweathernetwork.com/ca";
  var PLAN_KEY = "h3lp.safetyplan.v1";
  var BY_ID = {};
  D.R.forEach(function (r) { BY_ID[r.id] = r; });
  var TAB = {};
  D.TABS.forEach(function (t) { TAB[t.id] = t; });
  var CITY = {};
  D.CITIES.forEach(function (c) { CITY[c.slug] = c; });

  var state = { lang: "en", city: "", view: null, q: "" };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- small helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function S(path) {
    var o = D.STR[state.lang];
    path.split(".").forEach(function (k) { o = o == null ? o : o[k]; });
    return o;
  }
  function fill(str, vars) { return String(str).replace(/\{(\w+)\}/g, function (m, k) { return vars && vars[k] != null ? vars[k] : m; }); }
  function icon(id, cls) { return '<svg class="i' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; }
  function fr() { return state.lang === "fr"; }
  function cityName(slug) { var c = CITY[slug || ""]; return c ? (fr() && c.fr ? c.fr : c.en) : ""; }
  function L(r) {
    var f = fr() && r.fr ? r.fr : {};
    return { who: f.who || r.who, title: f.title || r.title, body: f.body || r.body, actions: f.actions || r.actions, regionLabel: f.regionLabel || r.regionLabel };
  }
  function motionOK() { return !(reduce && reduce.matches); }
  function scrollToEl(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: motionOK() ? "smooth" : "auto", block: "start" });
  }

  /* ---------- language ---------- */
  function applyLang() {
    var html = document.documentElement;
    html.lang = fr() ? "fr-CA" : "en";
    document.title = S("docTitle");
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", S("metaDesc"));
    var nodes = document.querySelectorAll("[data-t]");
    for (var i = 0; i < nodes.length; i++) {
      var v = S(nodes[i].getAttribute("data-t"));
      if (typeof v === "string") nodes[i].textContent = v;
    }
    var attrs = document.querySelectorAll("[data-ta]");
    for (var j = 0; j < attrs.length; j++) {
      attrs[j].getAttribute("data-ta").split(";").forEach(function (pair) {
        var p = pair.split(":");
        var val = S(p[1]);
        if (typeof val === "string") attrs[j].setAttribute(p[0], val);
      });
    }
    var lb = $("lang");
    lb.textContent = S("langBtn");
    lb.setAttribute("lang", S("langBtnLang"));
    lb.setAttribute("aria-label", S("langBtnAria"));
    buildCitySelect($("city"));
    buildChips(); buildPaths(); buildTiles(); buildGround(); buildPlanForm(); buildNumbers();
    paintSky();
  }

  /* ---------- URL: language, view and city, replaced in place (never pushed) ---------- */
  var PRIVATE_VIEWS = { safe: true };
  function syncURL() {
    var parts = [], v = state.view;
    if (fr()) parts.push("fr");
    var tab = v && v.kind === "tab" && !PRIVATE_VIEWS[v.id] ? v.id : "";
    if (tab) parts.push(tab);
    else if (state.city) parts.push("home");
    if (state.city) parts.push(state.city);
    var h = parts.length ? "#" + parts.join("/") : location.pathname + location.search;
    try { history.replaceState(null, "", h); } catch (e) {}
  }
  /* #[fr/][tab|home][/city]. Anything else (#help, #main) is not a route and changes nothing. */
  function parseHash() {
    var h = location.hash.replace(/^#/, "");
    if (!h) return false;
    var parts = h.split("/"), lang = "en";
    if (parts[0] === "fr") { lang = "fr"; parts.shift(); }
    var tab = parts[0] || "", city = parts[1] || "";
    if (tab && tab !== "home" && !TAB[tab]) return false;
    state.lang = lang;
    state.city = CITY[city] ? city : "";
    state.view = tab && tab !== "home" ? { kind: "tab", id: tab } : null;
    return true;
  }

  /* ---------- the sky ---------- */
  function paintSky() {
    if (!SKY) return;
    var p = SKY.palette(new Date());
    var s = p.stops, g = p.glow;
    var root = document.documentElement.style;
    root.setProperty("--sky", "linear-gradient(90deg," + s[0] + " 0%," + s[1] + " " + Math.max(g - 34, 1) + "%," + s[2] + " " + g + "%," + s[3] + " " + Math.min(g + 34, 99) + "%," + s[4] + " 100%)");
    root.setProperty("--sky-top", s[0]);
    root.setProperty("--sky-mid", s[1]);
    root.setProperty("--sky-glow", s[2]);
    root.setProperty("--sun", p.sun);
    document.documentElement.setAttribute("data-sky", p.phase);
    var sr = SKY.nextSunrise(new Date());
    var el = $("sunrise");
    if (el && sr) {
      var t;
      try { t = new Intl.DateTimeFormat(fr() ? "fr-CA" : "en-CA", { timeZone: "America/Toronto", hour: "numeric", minute: "2-digit" }).format(sr); }
      catch (e) { t = sr.toTimeString().slice(0, 5); }
      el.textContent = fill(S("sunrise"), { t: t });
    }
  }

  /* ---------- hours and live status (pinned to Ontario time) ---------- */
  function nowInOntario() {
    try {
      var parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", hour12: false, weekday: "short", hour: "numeric", minute: "numeric" }).formatToParts(new Date());
      var m = {}; parts.forEach(function (p) { m[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[m.weekday], mins: (parseInt(m.hour, 10) % 24) * 60 + parseInt(m.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function fmtMin(m) {
    var hh = Math.floor(m / 60), mm = m % 60;
    if (fr()) return hh + " h" + (mm ? " " + ("0" + mm).slice(-2) : "");
    var ap = hh >= 12 ? "pm" : "am";
    hh = hh % 12; if (hh === 0) hh = 12;
    return hh + (mm ? ":" + ("0" + mm).slice(-2) : "") + ap;
  }
  function hasPhone(r) { return r.actions.some(function (a) { return /^(tel|sms):/.test(a.href); }); }
  function status(r) {
    var st = S("status"), h = r.hours;
    if (h === "24/7") return { cls: "s-always", text: st.always };
    if (h && h.days) {
      var now = nowInOntario();
      if (h.days.indexOf(now.day) > -1 && now.mins >= h.from && now.mins < h.to) return { cls: "s-open", text: fill(st.open, { t: fmtMin(h.to) }) };
      if (h.days.indexOf(now.day) > -1 && now.mins < h.from) return { cls: "s-closed", text: fill(st.opens, { t: fmtMin(h.from) }) };
      for (var k = 1; k <= 7; k++) {
        var d = (now.day + k) % 7;
        if (h.days.indexOf(d) > -1) {
          if (k === 1 && h.days.length === 7) return { cls: "s-closed", text: fill(st.opens, { t: fmtMin(h.from) }) };
          return { cls: "s-closed", text: fill(st.opensDay, { day: S("days")[d], t: fmtMin(h.from) }) };
        }
      }
    }
    return hasPhone(r) ? { cls: "s-confirm", text: st.confirm } : { cls: "s-online", text: st.online };
  }
  function refreshStatus() {
    var els = document.querySelectorAll(".status[data-id]");
    for (var i = 0; i < els.length; i++) {
      var r = BY_ID[els[i].getAttribute("data-id")];
      if (!r) continue;
      var s = status(r);
      els[i].className = "status " + s.cls;
      els[i].textContent = s.text;
    }
  }

  /* ---------- cards ---------- */
  function displayNumber(href) {
    var n = href.replace(/^(tel|sms):/, "").replace(/\?.*$/, "");
    if (n.length <= 4) return n;
    var d = n.replace(/\D/g, "");
    if (d.length === 11 && d[0] === "1") d = d.slice(1);
    if (d.length !== 10) return n;
    return fr() ? "1 " + d.slice(0, 3) + " " + d.slice(3, 6) + "-" + d.slice(6) : (n.length === 11 ? "1-" : "") + d.slice(0, 3) + "-" + d.slice(3, 6) + "-" + d.slice(6);
  }
  function catIcon(r, tab) {
    if (r.id === "911") return "lifebuoy";
    var t = TAB[tab] || TAB[r.cats[0]] || TAB.all;
    return t.icon;
  }
  function cardHTML(r, tab) {
    var l = L(r), st = status(r);
    var phone = l.actions.filter(function (a) { return /^(tel|sms):/.test(a.href); });
    var web = l.actions.filter(function (a) { return /^https?:/.test(a.href); });
    /* Call and Text lead. A local listing whose own action is a website keeps it first,
       and its "call 211 to confirm" line moves down with the quiet actions. */
    var webFirst = l.actions.length && /^https?:/.test(l.actions[0].href) && phone.every(function (a) { return a.href === "tel:211"; });
    var primary = phone.length && !webFirst ? phone : web.slice(0, 1);
    var quiet = phone.length && !webFirst ? web : web.slice(1).concat(phone);
    var html = '<article class="card' + (r.hot ? " hot" : "") + '" data-id="' + esc(r.id) + '">';
    html += '<div class="card-top"><span class="card-ic">' + icon(catIcon(r, tab)) + "</span>" +
      '<p class="kicker">' + esc(l.who) + "</p>" +
      '<span class="status ' + st.cls + '" data-id="' + esc(r.id) + '">' + esc(st.text) + "</span></div>";
    html += "<h3>" + esc(l.title) + "</h3>";
    html += '<p class="card-body">' + esc(l.body) + "</p>";
    html += '<div class="acts">' + primary.map(function (a) {
      var ic = /^tel:/.test(a.href) ? "call" : /^sms:/.test(a.href) ? "text" : "arrow";
      var ext = /^https?:/.test(a.href) ? ' target="_blank" rel="noopener noreferrer"' : "";
      return '<a class="btn btn-primary" href="' + esc(a.href) + '"' + ext + ">" + icon(ic) + "<span>" + esc(a.label) + "</span></a>";
    }).join("") + "</div>";
    var q = quiet.map(function (a) {
      var tel = /^(tel|sms):/.test(a.href);
      var ic = tel ? "call" : /chat|clavard/i.test(a.label) ? "chat" : "web";
      return '<a class="btn btn-quiet" href="' + esc(a.href) + '"' + (tel ? "" : ' target="_blank" rel="noopener noreferrer"') + ">" + icon(ic) + "<span>" + esc(a.label) + "</span></a>";
    });
    var firstPhone = phone[0];
    if (firstPhone) q.push('<button class="btn btn-quiet" type="button" data-copy="' + esc(displayNumber(firstPhone.href)) + '">' + icon("copy") + "<span>" + esc(S("copyNumber")) + "</span></button>");
    q.push('<button class="btn btn-quiet" type="button" data-share="' + esc(r.id) + '">' + icon("share") + "<span>" + esc(S("share")) + "</span></button>");
    html += '<div class="acts2">' + q.join("") + "</div>";
    var meta = r.local ? S("tagLocal") : S("tagChecked");
    var where = r.region ? fill(S("tagIn"), { city: l.regionLabel || cityName(state.city) }) : (r.scope ? S("scope")[r.scope] : "");
    html += '<p class="card-meta"><span>' + icon("verified") + esc(meta) + "</span>" + (where ? "<span>" + icon("pin") + esc(where) + "</span>" : "") + "</p>";
    return html + "</article>";
  }
  function dedupe(list) {
    var seen = {}, out = [];
    list.forEach(function (r) { var k = r.svc || r.id; if (r && !seen[k]) { seen[k] = true; out.push(r); } });
    return out;
  }
  function regionOf(slug) { var c = CITY[slug || ""]; return c && c.region ? c.region : "other"; }
  function visible(r) { return !r.region || !state.city || r.region === regionOf(state.city); }
  function tabList(tab) {
    var list = D.R.filter(function (r) { return r.cats.indexOf(tab) > -1 && visible(r); });
    if (state.city) list.sort(function (a, b) { return (b.region ? 1 : 0) - (a.region ? 1 : 0); });
    return list;
  }
  function idList(ids) { return ids.map(function (id) { return BY_ID[id]; }).filter(function (r) { return r && visible(r); }); }

  /* ---------- weather safety (Open-Meteo, the one live source) ---------- */
  var wxCache = {}, wxWait = {};
  function weatherFor(slug, cb) {
    var c = CITY[slug];
    if (!c || c.lat == null || !window.fetch || navigator.onLine === false) return cb(null);
    var hour = Math.floor(Date.now() / 3600000);
    var key = slug + ":" + hour;
    if (wxCache[key] !== undefined) return cb(wxCache[key]);
    if (wxWait[key]) { wxWait[key].push(cb); return; }
    wxWait[key] = [cb];
    var done = cb;
    cb = function (v) { var list = wxWait[key] || [done]; delete wxWait[key]; list.forEach(function (f) { f(v); }); };
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 4000);
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + c.lat + "&longitude=" + c.lon +
      "&hourly=apparent_temperature&daily=apparent_temperature_max&timezone=America%2FToronto&forecast_days=2";
    fetch(url, { signal: ctl ? ctl.signal : undefined, credentials: "omit", referrerPolicy: "no-referrer" })
      .then(function (res) { if (!res.ok) throw new Error("http " + res.status); return res.json(); })
      .then(function (j) {
        clearTimeout(timer);
        var out = null;
        var times = j.hourly && j.hourly.time, temps = j.hourly && j.hourly.apparent_temperature;
        var nowISO = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hour12: false }).format(new Date()).replace(" ", "T").slice(0, 13);
        var low = null;
        if (times && temps) {
          var today = nowISO.slice(0, 10);
          for (var i = 0; i < times.length; i++) {
            var t = times[i].slice(0, 13);
            if (t < nowISO) continue;
            /* tonight: from now until 8 am tomorrow */
            if (t.slice(0, 10) > today && parseInt(t.slice(11, 13), 10) > 8) break;
            if (typeof temps[i] === "number" && (low === null || temps[i] < low)) low = temps[i];
          }
        }
        var high = j.daily && j.daily.apparent_temperature_max ? j.daily.apparent_temperature_max[0] : null;
        if (low !== null && low <= -15) out = { kind: "cold", t: Math.round(low) };
        else if (typeof high === "number" && high >= 32) out = { kind: "hot", t: Math.round(high) };
        wxCache[key] = out;
        cb(out);
      })
      .catch(function () { clearTimeout(timer); cb(null); });
  }
  function fmtTemp(t) { return (t < 0 ? "\u2212" + Math.abs(t) : String(t)) + (fr() ? "\u00a0\u00b0C" : "\u00b0C"); }
  function wxHTML(w) {
    if (!w) return "";
    var W = S("weather");
    return '<div class="wx' + (w.kind === "hot" ? " hot" : "") + '" role="note">' + icon(w.kind === "hot" ? "sun" : "snow") +
      '<p class="wx-t">' + esc(fill(W[w.kind], { t: fmtTemp(w.t), city: cityName(state.city) })) + "</p>" +
      '<div class="row"><a class="btn btn-primary" href="tel:211">' + icon("call") + "<span>" + esc(W.call) + "</span></a>" +
      '<button class="btn btn-quiet" type="button" data-tab="safe">' + icon("safe") + "<span>" + esc(W.safe) + "</span></button></div>" +
      '<p class="note">' + esc(W.source) + "</p></div>";
  }
  function paintWeather() {
    var slots = document.querySelectorAll("[data-weather]");
    if (!state.city) { for (var i = 0; i < slots.length; i++) slots[i].innerHTML = ""; return; }
    var city = state.city;
    weatherFor(city, function (w) {
      if (city !== state.city) return;
      var s = document.querySelectorAll("[data-weather]");
      for (var k = 0; k < s.length; k++) s[k].innerHTML = wxHTML(w);
    });
  }

  /* ---------- building blocks ---------- */
  function buildCitySelect(sel) {
    if (!sel) return;
    sel.innerHTML = D.CITIES.map(function (c) {
      return '<option value="' + c.slug + '"' + (c.slug === state.city ? " selected" : "") + ">" + esc(fr() && c.fr ? c.fr : c.en) + "</option>";
    }).join("");
    sel.value = state.city;
  }
  function pressed(kind, id) { return state.view && state.view.kind === kind && state.view.id === id ? "true" : "false"; }
  function buildChips() {
    $("chips").innerHTML = D.SITUATIONS.map(function (s) {
      return '<button class="chip" type="button" data-sit="' + s.id + '" aria-pressed="' + pressed("sit", s.id) + '">' + icon(s.icon) + "<span>" + esc(s[state.lang]) + "</span></button>";
    }).join("");
  }
  function buildPaths() {
    $("paths").innerHTML = D.PATHS.map(function (p) {
      var c = S("paths")[p.id];
      return '<button class="path' + (p.hot ? " hot" : "") + '" type="button" data-path="' + p.id + '" aria-pressed="' + pressed("path", p.id) + '">' +
        '<span class="path-ic">' + icon(p.icon) + '</span><span><span class="path-t">' + esc(c.label) + '</span><span class="path-s">' + esc(c.sub) + "</span></span>" + icon("chevron") + "</button>";
    }).join("");
  }
  function buildTiles() {
    $("tiles").innerHTML = D.TABS.map(function (t) {
      return '<button class="tile" type="button" data-tab="' + t.id + '" aria-pressed="' + pressed("tab", t.id) + '">' + icon(t.icon) + "<span>" + esc(t[state.lang].label) + "</span></button>";
    }).join("");
  }
  function markPressed() {
    var all = document.querySelectorAll("[data-sit],[data-path],.tile[data-tab]");
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var kind = el.hasAttribute("data-sit") ? "sit" : el.hasAttribute("data-path") ? "path" : "tab";
      var id = el.getAttribute("data-sit") || el.getAttribute("data-path") || el.getAttribute("data-tab");
      el.setAttribute("aria-pressed", pressed(kind, id));
    }
  }

  /* ---------- the panel: a situation, a path or a category ---------- */
  function sayHTML(tab) {
    var lines = D.SAY[state.lang] && D.SAY[state.lang][tab];
    if (!lines) return "";
    var o = fr() ? "\u00ab\u00a0" : "\u201c", c = fr() ? "\u00a0\u00bb" : "\u201d";
    return '<details class="sayit"><summary>' + icon("talk") + "<span>" + esc(S("saySummary")) + "</span>" + icon("chevron") + "</summary><div>" +
      lines.map(function (q) { return '<p class="line">' + o + esc(q) + c + "</p>"; }).join("") +
      '<p class="reassure">' + esc(S("sayReassure")) + "</p></div></details>";
  }
  function introText(tab) {
    var t = D.INTRO[state.lang][tab];
    if (!t) return "";
    var city = cityName(state.city);
    t = t.replace(/<\/?b>/g, "");
    return fill(t, {
      here: state.city ? fill(S("hereCity"), { city: city }) : S("here"),
      hereAll: state.city ? fill(S("hereAllCity"), { city: city }) : S("hereAll")
    });
  }
  function countText(list) {
    var n = dedupe(list).length;
    return state.city ? fill(S("hintCity"), { n: n, city: cityName(state.city) }) : fill(S("hintAll"), { n: n });
  }
  function exitNoteHTML() {
    return '<p class="exit-note">' + icon("exit") + "<span>" + esc(S("exitHelp")) + " " + esc(S("exitPrivacy")) + "</span></p>";
  }
  function cityBarHTML(list) {
    return '<div class="panel-bar"><div class="select"><select data-city aria-label="' + esc(S("cityAria")) + '"></select>' + icon("chevron") + "</div>" +
      '<p class="count">' + esc(countText(list)) + "</p></div>";
  }

  function renderPanel(focus) {
    var panel = $("panel"), v = state.view;
    markPressed();
    if (!v) { panel.hidden = true; panel.innerHTML = ""; return; }
    var html = '<div class="panel-in"><div class="panel-head">', list = [], tabForIcon = null, crisisLine = "", body = "", after = "";
    if (v.kind === "tab") {
      var t = TAB[v.id], tt = t[state.lang];
      list = tabList(v.id);
      tabForIcon = v.id;
      html += '<p class="eyebrow">' + icon(t.icon) + esc(S("browseTitle")) + "</p><h2 tabindex=\"-1\">" + esc(tt.title) + '</h2><p class="panel-note">' + esc(tt.note) + "</p>";
      body += '<p class="lead">' + esc(introText(v.id)) + "</p>";
      if (v.id === "safe") body += exitNoteHTML();
      body += sayHTML(v.id);
      if (v.id === "food" || v.id === "safe") body += '<div data-weather="panel"></div>';
      body += cityBarHTML(list);
      if (v.id === "money") after += '<div class="tips">' + D.TIPS.map(function (tp) {
        return '<div class="tip"><h4>' + esc(fr() ? tp.hFr : tp.h) + "</h4><p>" + esc(fr() ? tp.pFr : tp.p) + "</p></div>";
      }).join("") + "</div>";
    } else if (v.kind === "sit") {
      var s = D.SITUATIONS.filter(function (x) { return x.id === v.id; })[0];
      var st = TAB[s.tab];
      list = s.ids ? idList(s.ids) : tabList(s.tab);
      tabForIcon = s.tab;
      html += '<p class="eyebrow">' + icon(s.icon) + esc(S("chipsLabel")) + "</p><h2 tabindex=\"-1\">" + esc(s[state.lang]) + "</h2>";
      if (s.crisis) crisisLine = S("crisis")[s.crisis];
      body += '<p class="lead">' + esc(introText(s.tab)) + "</p>";
      if (s.crisis === "abuse" || s.tab === "safe") body += exitNoteHTML();
      if (!s.crisis) body += sayHTML(s.tab);
      if (s.weather || s.tab === "food") body += '<div data-weather="panel"></div>';
      body += cityBarHTML(list);
      after += '<div class="seeall"><button class="btn btn-quiet" type="button" data-tab="' + st.id + '">' + icon(st.icon) + "<span>" + esc(fill(S("seeAll"), { tab: st[state.lang].title })) + "</span></button></div>";
    } else if (v.kind === "path") {
      var p = D.PATHS.filter(function (x) { return x.id === v.id; })[0], pc = S("paths")[v.id];
      list = p.ids ? idList(p.ids) : tabList(p.tab);
      tabForIcon = p.tab || "talk";
      html += '<p class="eyebrow">' + icon(p.icon) + esc(S("pathsLabel")) + "</p><h2 tabindex=\"-1\">" + esc(pc.title) + "</h2>";
      if (v.id === "now") crisisLine = S("crisis").self;
      if (pc.lead) body += '<p class="lead">' + esc(pc.lead) + "</p>";
      else if (p.tab) body += '<p class="lead">' + esc(introText(p.tab)) + "</p>";
      if (pc.steps) body += '<ol class="steps">' + pc.steps.map(function (x) { return "<li><span>" + esc(x) + "</span></li>"; }).join("") + "</ol>";
      if (v.id === "now") body += '<div class="wait"><p>' + esc(S("whileYouWait")) + '</p><button class="btn btn-quiet" type="button" data-open="breathe">' + icon("breathe") + "<span>" + esc(S("breatheLink")) + "</span></button></div>";
      if (p.tab) body += cityBarHTML(list);
    }
    html += "</div>";
    if (crisisLine) html += '<p class="crisis-line">' + esc(crisisLine) + "</p>";
    html += body;
    list = dedupe(list);
    html += '<div class="cards">' + list.map(function (r) { return cardHTML(r, tabForIcon); }).join("") + "</div>";
    html += after;
    html += '<div class="panel-foot"><a class="btn btn-quiet" href="#browse" data-jump="browse">' + icon("compass") + "<span>" + esc(S("backToBrowse")) + "</span></a></div></div>";
    panel.innerHTML = html;
    panel.hidden = false;
    var sels = panel.querySelectorAll("select[data-city]");
    for (var i = 0; i < sels.length; i++) buildCitySelect(sels[i]);
    paintWeather();
    if (focus) {
      scrollToEl(panel);
      var h2 = panel.querySelector("h2");
      if (h2) h2.focus({ preventScroll: true });
    }
  }
  function openView(v, focus) {
    state.view = v;
    syncURL();
    renderPanel(focus);
  }

  /* ---------- search: on this device only ---------- */
  var qTimer = null;
  function renderAnswer() {
    var box = $("answer"), q = state.q;
    $("qclear").hidden = !q;
    if (!q.trim() || !I) { box.hidden = true; box.innerHTML = ""; $("qlive").textContent = ""; return; }
    var m = I.match(q);
    var list = dedupe(idList(m.ids)).slice(0, 8);
    var html = "";
    if (m.crisis) html += '<p class="crisis-line">' + esc(S("crisis")[m.crisis]) + "</p>";
    if (!list.length) {
      html += '<p class="nomatch">' + esc(S("noMatch")) + "</p>";
      list = [BY_ID["211"]];
    }
    var n = list.length;
    html += '<div class="answer-head"><p class="answer-count">' + esc(n === 1 ? S("result1") : fill(S("results"), { n: n })) + "</p></div>";
    if (m.crisis === "abuse") html += exitNoteHTML();
    html += '<div class="cards">' + list.map(function (r) { return cardHTML(r, m.tabs[0]); }).join("") + "</div>";
    var tabs = m.tabs.filter(function (t) { return TAB[t]; }).slice(0, 2);
    if (tabs.length) html += '<div class="seeall">' + tabs.map(function (t) {
      return '<button class="btn btn-quiet" type="button" data-tab="' + t + '">' + icon(TAB[t].icon) + "<span>" + esc(fill(S("seeAll"), { tab: TAB[t][state.lang].title })) + "</span></button>";
    }).join("") + "</div>";
    box.innerHTML = html;
    box.hidden = false;
    var live = (m.crisis ? S("crisis")[m.crisis] + " " : "") + (n === 1 ? S("result1") : fill(S("results"), { n: n }));
    $("qlive").textContent = live;
  }
  function initSearch() {
    var q = $("q");
    q.addEventListener("input", function () {
      state.q = q.value;
      clearTimeout(qTimer);
      qTimer = setTimeout(renderAnswer, 140);
    });
    q.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); clearTimeout(qTimer); renderAnswer(); var a = $("answer"); if (!a.hidden) scrollToEl(a); }
      if (e.key === "Escape" && q.value) { e.preventDefault(); q.value = ""; state.q = ""; renderAnswer(); }
    });
    $("qclear").addEventListener("click", function () { q.value = ""; state.q = ""; renderAnswer(); q.focus(); });
  }

  /* ---------- copy and share ---------- */
  function flash(btn, text) {
    var span = btn.querySelector("span"), old = span.textContent;
    btn.classList.add("done"); span.textContent = text;
    setTimeout(function () { btn.classList.remove("done"); span.textContent = old; }, 1800);
  }
  function copyText(text, btn, label) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.className = "sr";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); flash(btn, label); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { flash(btn, label); }, fallback);
    else fallback();
  }
  function shareEntry(id, btn) {
    var r = BY_ID[id]; if (!r) return;
    var l = L(r), first = l.actions[0];
    var text = l.title + " · " + first.label + " · " + S("shareSuffix");
    var url = location.origin + location.pathname + (fr() ? "#fr" : "");
    if (navigator.share) navigator.share({ title: "h3lp", text: text, url: url }).catch(function () {});
    else copyText(text + " " + url, btn, S("shared"));
  }

  /* ---------- one delegated click handler for the whole page ---------- */
  function initClicks() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-sit],[data-path],[data-tab],[data-copy],[data-share],[data-open],[data-jump]") : null;
      if (!t) return;
      if (t.hasAttribute("data-sit")) { clearSearch(); openView({ kind: "sit", id: t.getAttribute("data-sit") }, true); }
      else if (t.hasAttribute("data-path")) { clearSearch(); openView({ kind: "path", id: t.getAttribute("data-path") }, true); }
      else if (t.hasAttribute("data-tab")) { if (sheetOpen) closeSheet(); openView({ kind: "tab", id: t.getAttribute("data-tab") }, true); }
      else if (t.hasAttribute("data-copy")) copyText(t.getAttribute("data-copy"), t, S("copied"));
      else if (t.hasAttribute("data-share")) shareEntry(t.getAttribute("data-share"), t);
      else if (t.hasAttribute("data-open")) openSheet(t.getAttribute("data-open"), t);
      else if (t.hasAttribute("data-jump")) { e.preventDefault(); var b = $(t.getAttribute("data-jump")); scrollToEl(b); var first = document.querySelector(".tile"); if (first) first.focus({ preventScroll: true }); }
    });
    document.addEventListener("change", function (e) {
      var sel = e.target;
      if (sel.id === "city" || sel.hasAttribute("data-city")) setCity(sel.value);
    });
  }
  function clearSearch() { var q = $("q"); if (q.value) { q.value = ""; state.q = ""; renderAnswer(); } }
  function setCity(slug) {
    state.city = CITY[slug] ? slug : "";
    var sels = document.querySelectorAll("#city, select[data-city]");
    for (var i = 0; i < sels.length; i++) sels[i].value = state.city;
    syncURL();
    var focusSel = document.activeElement && document.activeElement.tagName === "SELECT" ? document.activeElement : null;
    var inPanel = focusSel && focusSel.hasAttribute("data-city");
    if (state.view) renderPanel(false);
    if (state.q) renderAnswer();
    paintWeather();
    if (inPanel) { var s = document.querySelector("#panel select[data-city]"); if (s) s.focus(); }
  }

  /* ---------- Quick exit: button, or Shift three times within 5 seconds ---------- */
  function quickExit(e) {
    if (e) e.preventDefault();
    var veil = $("veil");
    veil.hidden = false;
    try { document.title = ""; } catch (x) {}
    var q = $("q"); if (q) q.value = "";
    try { window.location.replace(EXIT_URL); } catch (x) { window.location.href = EXIT_URL; }
  }
  function initExit() {
    var btn = $("exit"), live = $("shiftLive");
    btn.addEventListener("click", quickExit);
    var presses = [], reset = null, bare = false;
    function paint() {
      btn.setAttribute("data-n", String(presses.length));
      btn.classList.toggle("armed", presses.length > 0);
    }
    /* Only a Shift pressed and released on its own counts (the GOV.UK pattern). Shift held
       for a capital letter never counts, and any other key starts the count again, so a
       person typing "My Dad Hits Me" is never thrown out of the page. */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Shift") { if (!e.repeat) bare = true; return; }
      bare = false;
      if (presses.length) { presses = []; clearTimeout(reset); paint(); live.textContent = ""; }
    }, true);
    document.addEventListener("keyup", function (e) {
      if (e.key !== "Shift" || !bare) return;
      bare = false;
      var now = Date.now();
      presses = presses.filter(function (t) { return now - t < 5000; });
      presses.push(now);
      paint();
      if (presses.length >= 3) { quickExit(); return; }
      live.textContent = fill(S("shiftLive"), { n: presses.length });
      clearTimeout(reset);
      reset = setTimeout(function () { presses = []; paint(); live.textContent = ""; }, 5000);
    });
  }

  /* ---------- sheets (tools): closable, focus managed, strip stays usable ---------- */
  var sheetOpen = null, sheetReturn = null;
  function setInert(on) {
    ["main", "footer", "header"].forEach(function (sel) {
      var el = document.querySelector(sel === "main" ? "#main" : sel === "footer" ? ".foot" : "header.top");
      if (!el) return;
      if (on) { el.setAttribute("inert", ""); el.setAttribute("aria-hidden", "true"); }
      else { el.removeAttribute("inert"); el.removeAttribute("aria-hidden"); }
    });
  }
  function openSheet(id, from) {
    var el = $("sheet-" + id);
    if (!el) return;
    if (sheetOpen) closeSheet(true);
    sheetOpen = el; sheetReturn = from || document.activeElement;
    el.hidden = false;
    el.scrollTop = 0;
    document.documentElement.classList.add("sheet-open");
    setInert(true);
    if (id === "plan") loadPlan();
    var h = el.querySelector("h2");
    h.setAttribute("tabindex", "-1");
    h.focus();
  }
  function closeSheet(silent) {
    if (!sheetOpen) return;
    if (sheetOpen.id === "sheet-breathe") stopBreath(true);
    sheetOpen.hidden = true;
    sheetOpen = null;
    document.documentElement.classList.remove("sheet-open");
    setInert(false);
    if (!silent && sheetReturn && document.contains(sheetReturn)) sheetReturn.focus();
  }
  function initSheets() {
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("[data-close]")) closeSheet();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sheetOpen) { e.preventDefault(); closeSheet(); }
    });
  }

  /* ---------- Breathe with me: 4 in, 6 out, six breaths, no holds ---------- */
  var B = { running: false, t0: 0, acc: 0, raf: 0, total: 60000, lastSec: -1 };
  function ease(x) { return 0.5 - 0.5 * Math.cos(Math.PI * x); }
  function breathFrame() {
    if (!B.running) return;
    var el = B.acc + (performance.now() - B.t0);
    if (el >= B.total) { finishBreath(); return; }
    var cyc = el % 10000, inhale = cyc < 4000;
    var f = inhale ? ease(cyc / 4000) : 1 - ease((cyc - 4000) / 6000);
    if (motionOK()) {
      var sun = $("bsun");
      sun.style.setProperty("--grow", (0.78 + 0.22 * f).toFixed(4));
      sun.style.setProperty("--rise", (18 - 40 * f).toFixed(2) + "%");
    }
    $("bbar").style.transform = "scaleX(" + (el / B.total).toFixed(4) + ")";
    var sec = Math.floor(el / 1000);
    if (sec !== B.lastSec) {
      B.lastSec = sec;
      var inCyc = Math.floor(cyc / 1000);
      var word = inhale ? S("breathe.in") : S("breathe.out");
      var n = inhale ? inCyc + 1 : inCyc - 3;
      var txt = word;
      for (var k = 2; k <= n; k++) txt += ", " + k;
      $("bcount").textContent = txt;
      $("bleft").textContent = fill(S("breathe.left"), { s: Math.ceil((B.total - el) / 1000) });
    }
    B.raf = requestAnimationFrame(breathFrame);
  }
  function setGo(play) {
    var go = $("bgo");
    go.querySelector("use").setAttribute("href", play ? "#i-play" : "#i-pause");
    $("bgoT").textContent = play ? (B.acc > 0 ? S("breathe.resume") : S("breathe.start")) : S("breathe.pause");
  }
  function startBreath() {
    $("bafter").hidden = true;
    B.running = true; B.t0 = performance.now(); B.lastSec = -1;
    setGo(false);
    B.raf = requestAnimationFrame(breathFrame);
  }
  function pauseBreath() {
    if (!B.running) return;
    B.running = false; cancelAnimationFrame(B.raf);
    B.acc += performance.now() - B.t0;
    setGo(true);
  }
  function stopBreath(reset) {
    B.running = false; cancelAnimationFrame(B.raf);
    if (reset) {
      B.acc = 0; B.lastSec = -1;
      $("bbar").style.transform = "scaleX(0)";
      $("bsun").style.removeProperty("--grow"); $("bsun").style.removeProperty("--rise");
      $("bcount").textContent = S("breathe.ready"); $("bleft").textContent = "";
      setGo(true);
    }
  }
  function finishBreath() {
    stopBreath(false);
    B.acc = 0;
    $("bbar").style.transform = "scaleX(1)";
    $("bcount").textContent = S("breathe.out");
    $("bleft").textContent = "";
    setGo(true);
    $("bdone").textContent = S("breathe.done");
    $("bafter").hidden = false;
    $("bdone").setAttribute("tabindex", "-1");
    $("bdone").focus();
  }
  var G = { i: 0 };
  function buildGround() {
    var g = S("breathe.ground");
    $("gsteps").innerHTML = g.map(function (x, k) {
      return '<li class="' + (k === G.i ? "now" : k < G.i ? "past" : "") + '"' + (k === G.i ? ' aria-current="step"' : "") + ">" + esc(x) + "</li>";
    }).join("");
    $("gback").disabled = G.i === 0;
  }
  function initBreathe() {
    $("bgo").addEventListener("click", function () { if (B.running) pauseBreath(); else startBreath(); });
    $("bagain").addEventListener("click", function () {
      $("bafter").hidden = true;
      if ($("ground").hidden) { stopBreath(true); startBreath(); }
      else { G.i = 0; buildGround(); }
    });
    var seg = document.querySelectorAll("#sheet-breathe .seg button");
    for (var i = 0; i < seg.length; i++) seg[i].addEventListener("click", function () {
      var mode = this.getAttribute("data-mode");
      for (var k = 0; k < seg.length; k++) seg[k].setAttribute("aria-checked", String(seg[k] === this));
      $("breath").hidden = mode !== "breath";
      $("ground").hidden = mode !== "ground";
      $("bafter").hidden = true;
      stopBreath(true);
      G.i = 0; buildGround();
    });
    $("gnext").addEventListener("click", function () {
      var n = S("breathe.ground").length;
      if (G.i < n - 1) { G.i++; buildGround(); }
      else { $("bdone").textContent = S("breathe.groundDone"); $("bafter").hidden = false; $("bdone").setAttribute("tabindex", "-1"); $("bdone").focus(); }
    });
    $("gback").addEventListener("click", function () { if (G.i > 0) { G.i--; buildGround(); } });
    document.addEventListener("visibilitychange", function () { if (document.hidden) pauseBreath(); });
  }

  /* ---------- My safety plan: printed by default, saved only by choice ---------- */
  var planMode = "print";
  function store() { try { return window.localStorage; } catch (e) { return null; } }
  function planData() {
    var f = $("plan"), out = { v: 1, steps: [], lines: [] };
    var tas = f.querySelectorAll("textarea");
    for (var i = 0; i < tas.length; i++) out.steps.push(tas[i].value);
    var cb = f.querySelectorAll("input[type=checkbox]:checked");
    for (var k = 0; k < cb.length; k++) out.lines.push(cb[k].value);
    return out;
  }
  function buildPlanForm() {
    var f = $("plan"), keep = f.children.length ? planData() : null;
    var steps = S("plan.steps");
    f.innerHTML = steps.map(function (s, i) {
      var id = "ps" + i, extra = "";
      if (i === 4) {
        extra = '<div class="checks">' + D.PLAN_LINES.map(function (lid) {
          var r = BY_ID[lid], l = L(r), ph = l.actions.filter(function (a) { return /^(tel|sms):/.test(a.href); })[0];
          return '<label class="check"><input type="checkbox" value="' + lid + '" /><span>' + esc(l.title) + (ph ? " <b>" + esc(displayNumber(ph.href)) + "</b>" : "") + "</span></label>";
        }).join("") + "</div>";
      }
      return '<fieldset><legend><b>' + (i + 1) + "</b><span>" + esc(s.t) + '</span></legend><p class="help" id="' + id + 'h">' + esc(s.h) + "</p>" + extra +
        '<textarea id="' + id + '" aria-describedby="' + id + 'h" placeholder="' + esc(s.p) + '" rows="3"></textarea></fieldset>';
    }).join("");
    if (keep) fillPlan(keep);
  }
  function fillPlan(d) {
    var tas = $("plan").querySelectorAll("textarea");
    for (var i = 0; i < tas.length; i++) tas[i].value = (d.steps && d.steps[i]) || "";
    var cb = $("plan").querySelectorAll("input[type=checkbox]");
    for (var k = 0; k < cb.length; k++) cb[k].checked = !!(d.lines && d.lines.indexOf(cb[k].value) > -1);
  }
  function setPlanMode(mode, quiet) {
    planMode = mode;
    var radios = document.querySelectorAll("input[name=pmode]");
    for (var i = 0; i < radios.length; i++) radios[i].checked = radios[i].value === mode;
    $("pwarn").hidden = mode !== "save";
    if (mode === "save") {
      savePlan();
      try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    }
    if (!quiet) $("pstatus").textContent = mode === "save" ? S("plan.statusSaved") : S("plan.statusTemp");
  }
  function savePlan() {
    if (planMode !== "save") return;
    var s = store();
    try { if (s) s.setItem(PLAN_KEY, JSON.stringify(planData())); } catch (e) {}
  }
  function loadPlan() {
    var s = store(), raw = null;
    try { raw = s ? s.getItem(PLAN_KEY) : null; } catch (e) {}
    if (raw) {
      try { fillPlan(JSON.parse(raw)); } catch (e) {}
      setPlanMode("save", true);
      $("pstatus").textContent = S("plan.statusSaved");
    } else if (planMode !== "save") {
      $("pstatus").textContent = S("plan.statusTemp");
    }
  }
  function lineName(lid) {
    var r = BY_ID[lid], l = L(r), ph = l.actions.filter(function (a) { return /^(tel|sms):/.test(a.href); })[0];
    var name = l.title.replace(/^(Call|Appelez le)\s+/, "");
    var num = ph ? displayNumber(ph.href) : "";
    return name.indexOf(num) > -1 || !num ? name : name + "  " + num;
  }
  function planPrintHTML() {
    var d = planData(), steps = S("plan.steps");
    var html = "<h1>" + esc(S("tools.plan.title")) + "</h1>";
    steps.forEach(function (s, i) {
      var txt = d.steps[i] || "";
      if (i === 4 && d.lines.length) txt = d.lines.map(function (lid) {
        return lineName(lid);
      }).join("\n") + (txt ? "\n" + txt : "");
      html += "<h2>" + (i + 1) + ". " + esc(s.t) + "</h2>" + (txt ? "<p>" + esc(txt) + "</p>" : '<div class="blank"></div>');
    });
    html += '<p class="pp-foot">' + esc(S("plan.printFoot")) + "<br />" + esc(S("plan.credit")) + "</p>";
    return html;
  }
  function printWith(cls) {
    document.body.classList.remove("print-card", "print-plan", "print-wallet");
    cls.forEach(function (c) { document.body.classList.add(c); });
    window.print();
  }
  function planImage() {
    var d = planData(), steps = S("plan.steps");
    var W = 1080, pad = 72, c = document.createElement("canvas"), ctx = c.getContext("2d");
    var font = '"Atkinson Next", system-ui, sans-serif', disp = '"Fraunces", Georgia, serif';
    function wrap(text, size, weight, family, maxW) {
      ctx.font = weight + " " + size + "px " + family;
      var out = [];
      String(text).split("\n").forEach(function (para) {
        var words = para.split(/\s+/), line = "";
        words.forEach(function (w) {
          var test = line ? line + " " + w : w;
          if (ctx.measureText(test).width > maxW && line) { out.push(line); line = w; } else line = test;
        });
        out.push(line);
      });
      return out;
    }
    var blocks = [{ lines: wrap(S("tools.plan.title"), 64, "500", disp, W - 2 * pad), size: 64, weight: "500", family: disp, lh: 76, gap: 28 }];
    steps.forEach(function (s, i) {
      var txt = d.steps[i] || "";
      if (i === 4 && d.lines.length) txt = d.lines.map(function (lid) {
        return lineName(lid);
      }).join("\n") + (txt ? "\n" + txt : "");
      blocks.push({ lines: wrap((i + 1) + ". " + s.t, 34, "700", font, W - 2 * pad), size: 34, weight: "700", family: font, lh: 44, gap: 8 });
      blocks.push({ lines: wrap(txt || " ", 32, "400", font, W - 2 * pad), size: 32, weight: "400", family: font, lh: 46, gap: 26, muted: !txt });
    });
    blocks.push({ lines: wrap(S("plan.printFoot"), 26, "400", font, W - 2 * pad), size: 26, weight: "400", family: font, lh: 36, gap: 0, foot: true });
    var H = pad + 8;
    blocks.forEach(function (b) { H += b.lines.length * b.lh + b.gap; });
    H += pad;
    c.width = W; c.height = H;
    ctx.fillStyle = "#f6f2ea"; ctx.fillRect(0, 0, W, H);
    var grad = ctx.createLinearGradient(0, 0, W, 0);
    var sky = SKY ? SKY.palette(new Date()).stops : ["#273064", "#5a4f7e", "#d7917c", "#5a4f7e", "#273064"];
    sky.forEach(function (col, i) { grad.addColorStop(i / 4, col); });
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, 10);
    var y = pad + 8;
    blocks.forEach(function (b) {
      ctx.font = b.weight + " " + b.size + "px " + b.family;
      ctx.fillStyle = b.foot ? "#4b5650" : "#1a211d";
      ctx.textBaseline = "top";
      b.lines.forEach(function (ln) { ctx.fillText(ln, pad, y); y += b.lh; });
      y += b.gap;
    });
    c.toBlob(function (blob) { if (blob) download(blob, S("plan.imageName")); }, "image/png");
  }
  function download(blob, name) {
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = name; a.rel = "noopener";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function initPlan() {
    var radios = document.querySelectorAll("input[name=pmode]");
    for (var i = 0; i < radios.length; i++) radios[i].addEventListener("change", function () { setPlanMode(this.value); if (this.value === "print") clearStoredPlan(); });
    var t = null;
    $("plan").addEventListener("input", function () { clearTimeout(t); t = setTimeout(savePlan, 300); });
    $("plan").addEventListener("change", savePlan);
    $("pprint").addEventListener("click", function () { $("printplan").innerHTML = planPrintHTML(); printWith(["print-plan"]); });
    $("pwallet").addEventListener("click", function () { $("printplan").innerHTML = planPrintHTML(); printWith(["print-plan", "print-wallet"]); });
    $("pimage").addEventListener("click", function () {
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(planImage); else planImage();
    });
    $("pdelete").addEventListener("click", function () {
      clearStoredPlan();
      fillPlan({ steps: [], lines: [] });
      setPlanMode("print", true);
      $("pstatus").textContent = S("plan.deleted");
    });
  }
  function clearStoredPlan() { var s = store(); try { if (s) s.removeItem(PLAN_KEY); } catch (e) {} }

  /* ---------- Save key numbers: a vCard 3.0 file made on the device ---------- */
  function buildNumbers() {
    $("numlist").innerHTML = D.CONTACTS.map(function (c) {
      return '<li><span>' + esc(c[state.lang]) + '</span><span class="n">' + esc(displayNumber("tel:" + c.tel.replace("+", ""))) + '</span><span class="d">' + esc(fr() ? c.noteFr : c.noteEn) + "</span></li>";
    }).join("");
  }
  function vEsc(s) { return String(s).replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n"); }
  function vcard() {
    return D.CONTACTS.map(function (c) {
      var name = c[state.lang];
      return ["BEGIN:VCARD", "VERSION:3.0", "N:;" + vEsc(name) + ";;;", "FN:" + vEsc(name), "TEL;TYPE=VOICE:" + c.tel,
        "NOTE:" + vEsc((fr() ? c.noteFr : c.noteEn) + " h3lp.francobernal.ca"), "END:VCARD"].join("\r\n");
    }).join("\r\n") + "\r\n";
  }
  function initNumbers() {
    $("vcf").addEventListener("click", function () {
      download(new Blob([vcard()], { type: "text/vcard;charset=utf-8" }), S("numbers.fileName"));
      $("vcfdone").textContent = S("numbers.after");
    });
  }

  /* ---------- wallet card, report link, brand and skip link ---------- */
  function initMisc() {
    $("printCard").addEventListener("click", function () { printWith(["print-card"]); });
    $("report").addEventListener("click", function () {
      /* the address is assembled only when tapped, so it never sits in the page */
      var u = atob("ZnJhbmNvYmVybmFsY2E="), d = atob("Z21haWwuY29t");
      location.href = "mailto:" + u + "\u0040" + d + "?subject=" + encodeURIComponent(S("reportSubject"));
    });
    $("brand").addEventListener("click", function (e) {
      e.preventDefault();
      if (sheetOpen) closeSheet(true);
      window.scrollTo({ top: 0, behavior: motionOK() ? "smooth" : "auto" });
      $("h1").setAttribute("tabindex", "-1");
      $("h1").focus({ preventScroll: true });
    });
    document.querySelector(".skip").addEventListener("click", function (e) {
      e.preventDefault();
      var q = $("q");
      scrollToEl($("help"));
      if (q) q.focus({ preventScroll: true });
    });
    $("lang").addEventListener("click", function () {
      state.lang = fr() ? "en" : "fr";
      applyLang();
      syncURL();
      renderPanel(false);
      renderAnswer();
      paintWeather();
    });
  }

  /* ---------- strip height drives the sheet offset and scroll padding ---------- */
  function initStripSize() {
    var strip = $("strip");
    function set() { document.documentElement.style.setProperty("--strip-h", strip.offsetHeight + "px"); }
    set();
    if (window.ResizeObserver) new ResizeObserver(set).observe(strip);
    else window.addEventListener("resize", set);
  }

  /* ---------- clocks: sky and open-now refresh each minute, paused when hidden ---------- */
  function initClock() {
    var timer = null;
    function tick() { paintSky(); refreshStatus(); }
    function start() { clearInterval(timer); timer = setInterval(tick, 60000); }
    document.addEventListener("visibilitychange", function () { if (document.hidden) clearInterval(timer); else { tick(); start(); } });
    start();
  }

  function initOffline() {
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  }

  /* ---------- start ---------- */
  function boot() {
    var routed = parseHash();
    if (!routed) {
      if (location.hash) { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
      var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "";
      if (/^fr\b/i.test(nav)) state.lang = "fr";
    }
    applyLang();
    initStripSize();
    initSearch();
    initClicks();
    initExit();
    initSheets();
    initBreathe();
    initPlan();
    initNumbers();
    initMisc();
    initClock();
    initOffline();
    if (state.view) renderPanel(false);
    paintWeather();
    window.addEventListener("hashchange", function () {
      if (parseHash()) { applyLang(); renderPanel(true); paintWeather(); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
