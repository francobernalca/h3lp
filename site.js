/* h3lp — hub logic. Mobile-first.
   - Crafted intro: the uploaded video plays, then transitions into the site.
   - City filter that visibly changes things: local help first, province-wide lines
     confirmed "available in <city>", a live count, and a city-aware heading.
   - Verified, inclusive Ontario/Canada resources (no invented numbers). */
(function () {
  "use strict";

  /* ---------- Category colours (from the logo spectrum) ---------- */
  var COLOR = { talk: "#0c7d92", food: "#e0701f", safe: "#d65745", comm: "#5f9136", play: "#1f8aa6", "new": "#cf9626", money: "#2f8f6f", all: "#0c6b80" };

  var TABS = [
    { id: "talk",  label: "Talk to someone",       icon: "💬", title: "Someone to talk to",        note: "Free · confidential · most 24/7" },
    { id: "food",  label: "Food today",            icon: "🍲", title: "A meal today",               note: "No one should go to sleep hungry." },
    { id: "safe",  label: "A safe place",          icon: "🛡️", title: "If you're not safe",         note: "It's not your fault. You have options." },
    { id: "comm",  label: "Community",             icon: "🤝", title: "Community to belong to",     note: "A safe place to show up." },
    { id: "play",  label: "Sports for youth",      icon: "⚽", title: "Get a kid into sport",       note: "Cost shouldn't keep them out." },
    { id: "new",   label: "New to Canada & legal", icon: "🍁", title: "New to Canada & legal help", note: "You are not alone here." },
    { id: "money", label: "Money basics",          icon: "💵", title: "A first step with money",    note: "Free, trustworthy, nothing to buy." },
    { id: "all",   label: "Not sure",              icon: "🧭", title: "Not sure where to start?",   note: "One call covers almost anything." }
  ];

  /* ---------- Cities → region (regions with a curated local card) ---------- */
  var ALL = "All of Ontario";
  var CITIES = [ALL, "Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Vaughan", "Richmond Hill", "Scarborough", "Oshawa", "Kitchener", "Waterloo", "Cambridge", "Windsor", "Kingston", "Greater Sudbury", "Thunder Bay", "Barrie", "Guelph", "St. Catharines", "Niagara Falls", "Oakville", "Burlington", "North Bay", "Sault Ste. Marie", "Peterborough"];
  var REGION = { "Toronto": "gta", "Mississauga": "gta", "Brampton": "gta", "Markham": "gta", "Vaughan": "gta", "Richmond Hill": "gta", "Scarborough": "gta", "Oshawa": "gta", "Ottawa": "ottawa", "Hamilton": "hamilton", "London": "london", "Kitchener": "waterloo", "Waterloo": "waterloo", "Cambridge": "waterloo", "Kingston": "kingston", "Greater Sudbury": "sudbury", "Thunder Bay": "thunderbay", "Barrie": "barrie", "Guelph": "guelph" };
  function regionOf(c) { return REGION[c] || "other"; }

  function here(c) { return c === ALL ? "across Ontario" : 'in <span class="here">' + c + "</span>"; }
  var INTRO = {
    talk: function (c) { return "Whatever you're carrying, whether it's drugs, drinking, panic, grief, or just feeling like there's no way out, trained responders are ready to listen. Free, confidential crisis lines and support services are available 24/7 " + here(c) + ". There are options for everyone, plus dedicated lines built for youth, Indigenous, Black, 2SLGBTQ+, Muslim, and student communities. Start here."; },
    food: function (c) { return "Free food banks and meal programs " + here(c) + ". Most don't ask for ID or a reason. Pick your city and your nearest option comes first."; },
    safe: function (c) { return "If someone is hurting you, scaring you, or controlling you, these lines are private and free " + here(c) + ". They help you understand your choices and find a safe place, without ever forcing you into anything."; },
    comm: function (c) { return "Recovery and a fresh start are easier around people. Drop-in centres, youth hubs, recovery and faith groups. A healthy way to fill the time and belong, " + here(c) + "."; },
    play: function (c) { return "Sport keeps kids and teens busy, connected, and well. These help families " + here(c) + " cover registration and gear, even when money is tight."; },
    "new": function (c) { return "Arriving somewhere new and not knowing what exists is its own kind of hard. Ontario has free settlement workers and free legal help, for jobs, language, housing, benefits, and your rights. Start here, " + here(c) + "."; },
    money: function () { return "Money stress makes everything harder. These are free Government of Canada tools, with no selling and no catch. Start with one small thing."; },
    all: function (c) { return "If your situation doesn't fit a box, start here. One free call connects you to a real person who can point you to food, housing, health, money, and more, " + (c === ALL ? "anywhere in Ontario" : "including " + c) + "."; }
  };

  /* ---------- Resources (region:null = province-wide, always available) ---------- */
  var R = [
    /* TALK */
    { cats: ["talk", "all"], hot: true, who: "Right now · 24/7", title: "988 Suicide Crisis Helpline", body: "If you're thinking about suicide, or worried about someone who is. Call or text 988 any time, free, anywhere in Canada.", actions: [{ label: "Call or text 988", href: "tel:988" }] },
    { cats: ["talk"], who: "Ontario · addiction & mental health", title: "ConnexOntario", body: "Free, confidential, government-funded line for drugs, alcohol, gambling, or mental health. They find local treatment for you, even with no insurance. Open 24/7.", actions: [{ label: "Call 1-866-531-2600", href: "tel:18665312600" }, { label: "Website", href: "https://connexontario.ca", alt: true }] },
    { cats: ["talk"], who: "Ontario · ages 5–29", title: "Kids Help Phone", body: "For kids, teens, and young adults. Call any time, or text CONNECT to 686868. Free, confidential, and they actually get it.", actions: [{ label: "Call 1-800-668-6868", href: "tel:18006686868" }, { label: "Text 686868", href: "sms:686868?body=CONNECT", alt: true }] },
    { cats: ["talk", "all"], who: "Ontario · a nurse, free", title: "Health811", body: "Dial 811 to talk to a registered nurse, free, 24/7, about any health worry, including mental health or substance use. No health card needed.", actions: [{ label: "Call 811", href: "tel:811" }, { label: "Website", href: "https://health811.ontario.ca", alt: true }] },
    { cats: ["talk"], who: "Ontario · post-secondary students", title: "Good2Talk", body: "Free, confidential, 24/7 support for college and university students in Ontario, in over 100 languages. Call or text.", actions: [{ label: "Call 1-866-925-5454", href: "tel:18669255454" }, { label: "Text GOOD2TALKON to 686868", href: "sms:686868?body=GOOD2TALKON", alt: true }] },
    { cats: ["talk"], who: "Indigenous peoples · 24/7", title: "Hope for Wellness Helpline", body: "Immediate counselling and crisis support for all First Nations, Inuit, and Métis. Available in English, French, Cree, Ojibway, and Inuktitut.", actions: [{ label: "Call 1-855-242-3310", href: "tel:18552423310" }, { label: "Online chat", href: "https://www.hopeforwellness.ca", alt: true }] },
    { cats: ["talk"], who: "Indigenous · Ontario · 24/7", title: "Métis Nation of Ontario crisis line", body: "A 24-hour mental health and addictions crisis line with culturally specific support for Métis adults, youth, and families, in English and French.", actions: [{ label: "Call 1-877-767-7572", href: "tel:18777677572" }] },
    { cats: ["talk"], who: "Black youth & families", title: "Black Youth Helpline", body: "A culturally safe, professional helpline for Black youth, families, and schools across Ontario. Open every day, 9am–10pm.", actions: [{ label: "Call 1-833-294-8650", href: "tel:18332948650" }, { label: "Website", href: "https://blackyouth.ca", alt: true }] },
    { cats: ["talk"], who: "2SLGBTQ+ youth · 29 & under", title: "LGBT YouthLine", body: "Confidential, non-judgemental peer support by and for 2SLGBTQ+ youth across Ontario, by phone, text, or chat.", actions: [{ label: "Call 1-800-268-9688", href: "tel:18002689688" }, { label: "Text 647-694-4275", href: "sms:16476944275", alt: true }] },
    { cats: ["talk"], who: "Muslim mental health", title: "Naseeha", body: "Confidential, culturally and spiritually aware support for Muslim youth and anyone who needs it: mental health, faith, family, and more.", actions: [{ label: "Call 1-866-627-3342", href: "tel:18666273342" }, { label: "Website", href: "https://naseeha.org", alt: true }] },
    { cats: ["talk", "comm", "new"], who: "Spanish-speaking · Toronto & GTA", title: "Centre for Spanish Speaking Peoples", body: "A trusted Toronto non-profit serving Spanish-speaking communities since 1973: counselling, support for women facing abuse, youth and seniors programs, settlement help, and a free legal clinic. En español.", actions: [{ label: "Call 416-533-8545", href: "tel:14165338545" }, { label: "Website", href: "https://spanishservices.org/en/", alt: true }] },
    { cats: ["talk"], who: "Ontario · local distress centres", title: "Distress & Crisis Ontario", body: "A network of community distress centres across Ontario, a listening ear for anyone feeling lonely, low, or in crisis, often 24/7.", actions: [{ label: "Find a centre", href: "https://www.dcontario.org" }] },

    /* FOOD — province-wide */
    { cats: ["food"], who: "All of Ontario", title: "Find a food bank (Feed Ontario)", body: "Ontario's food bank network. Type your town and it lists the nearest member food bank with its address and contact.", actions: [{ label: "Find food", href: "https://feedontario.ca/find-a-food-bank/" }] },
    { cats: ["food", "all"], who: "Anywhere in Ontario · 24/7", title: "Call 211 for food", body: "Dial 211 and a real person finds food banks, free meals, and meal programs near you, with hours and whether you need to book. Many languages.", actions: [{ label: "Call 211", href: "tel:211" }, { label: "Search online", href: "https://211ontario.ca", alt: true }] },
    /* FOOD — local */
    { cats: ["food"], region: "gta", regionLabel: "Toronto & GTA", verified: true, who: "Toronto & GTA", title: "Daily Bread Food Bank", body: "Over 100 member food banks across Toronto. No ID required for a single person. Use their finder or call to locate your nearest one.", actions: [{ label: "Find food", href: "https://www.dailybread.ca/" }, { label: "Call 416-203-0050", href: "tel:14162030050", alt: true }] },
    { cats: ["food"], region: "ottawa", regionLabel: "Ottawa", local: true, who: "Ottawa", title: "Ottawa Food Bank", body: "Coordinates food banks and meal programs across Ottawa. Their site finds your nearest neighbourhood food bank and community meal.", actions: [{ label: "Find food", href: "https://www.ottawafoodbank.ca/" }, { label: "Call 211", href: "tel:211", alt: true }] },
    { cats: ["food"], region: "hamilton", regionLabel: "Hamilton", local: true, who: "Hamilton", title: "Hamilton Food Share", body: "The hub for Hamilton's emergency food network. Their 'Looking for help' page lists food banks and hot-meal programs across the city.", actions: [{ label: "Find food", href: "https://hamiltonfoodshare.org/looking-for-help" }, { label: "Call 211", href: "tel:211", alt: true }] },
    { cats: ["food"], region: "london", regionLabel: "London", local: true, who: "London", title: "London Food Bank", body: "Serving London and Middlesex. They point you to the nearest food bank or community meal, with no need to explain why.", actions: [{ label: "Find food", href: "https://londonfoodbank.ca/" }, { label: "Call 211", href: "tel:211", alt: true }] },
    { cats: ["food"], region: "waterloo", regionLabel: "Kitchener · Waterloo · Cambridge", local: true, who: "Waterloo Region", title: "The Food Bank of Waterloo Region", body: "Connects you to food banks and community programs across Kitchener, Waterloo and Cambridge.", actions: [{ label: "Find food", href: "https://www.thefoodbank.ca/" }, { label: "Call 211", href: "tel:211", alt: true }] },
    { cats: ["food"], region: "kingston", regionLabel: "Kingston", local: true, who: "Kingston", title: "Partners in Mission Food Bank", body: "Kingston's central food bank, supplying neighbourhood programs across the city. Find help or call 211 to confirm hours.", actions: [{ label: "Find food", href: "https://partnersinmissionfoodbank.com/" }, { label: "Call 211", href: "tel:211", alt: true }] },
    { cats: ["food"], region: "sudbury", regionLabel: "Greater Sudbury", local: true, who: "Greater Sudbury", title: "Sudbury Food Bank", body: "Supplies emergency food to programs across Greater Sudbury. Their site and 211 find your nearest pickup.", actions: [{ label: "Find food", href: "https://www.sudburyfoodbank.ca/" }, { label: "Call 211", href: "tel:211", alt: true }] },
    { cats: ["food"], region: "thunderbay", regionLabel: "Thunder Bay & region", local: true, who: "Thunder Bay", title: "Regional Food Distribution Assoc.", body: "Northwestern Ontario's food network, based in Thunder Bay. Find a food bank or meal program near you.", actions: [{ label: "Find food", href: "https://www.rfda.ca/" }, { label: "Call 211", href: "tel:211", alt: true }] },
    { cats: ["food"], region: "barrie", regionLabel: "Barrie", local: true, who: "Barrie", title: "Barrie Food Bank", body: "Serving Barrie and the surrounding area. Check eligibility and hours, or call 211 to confirm before you go.", actions: [{ label: "Find food", href: "https://barriefoodbank.org/" }, { label: "Call 211", href: "tel:211", alt: true }] },
    { cats: ["food"], region: "guelph", regionLabel: "Guelph", local: true, who: "Guelph", title: "Guelph Food Bank", body: "Guelph's community food bank. Their site lists hours and what to bring; 211 can confirm the nearest option.", actions: [{ label: "Find food", href: "https://guelphfoodbank.com/" }, { label: "Call 211", href: "tel:211", alt: true }] },

    /* SAFE */
    { cats: ["safe"], hot: true, who: "Kids & teens · 24/7", title: "Kids Help Phone", body: "If you're young and someone at home is hurting you. Call, or text CONNECT to 686868, any time. It listens first.", actions: [{ label: "Call 1-800-668-6868", href: "tel:18006686868" }, { label: "Text 686868", href: "sms:686868?body=CONNECT", alt: true }] },
    { cats: ["safe"], who: "Gender-based abuse · 24/7", title: "Assaulted Women's Helpline", body: "For anyone facing abuse from a partner or family member. Free, confidential crisis support and shelter referrals, 24/7, in many languages.", actions: [{ label: "Call 1-866-863-0511", href: "tel:18668630511" }, { label: "Website", href: "https://www.awhl.org", alt: true }] },
    { cats: ["safe"], who: "Seniors · elder abuse", title: "Seniors Safety Line", body: "Free, confidential support 24/7 for older adults experiencing abuse or neglect, in many languages, with referrals to local help.", actions: [{ label: "Call 1-866-299-1011", href: "tel:18662991011" }] },
    { cats: ["safe", "all"], who: "Find shelter · 24/7", title: "Call 211 for a safe place", body: "Dial 211 to be connected to emergency shelter, youth shelters, and local safety support anywhere in Ontario. Free and confidential.", actions: [{ label: "Call 211", href: "tel:211" }, { label: "Search online", href: "https://211ontario.ca", alt: true }] },

    /* COMMUNITY */
    { cats: ["comm"], who: "All ages · all of Ontario", title: "Find your local YMCA", body: "Swimming, gyms, drop-in sports, youth nights, and adult programs. As a charity, the Y offers financial assistance so cost is rarely a barrier.", actions: [{ label: "Find a Y", href: "https://www.ymca.ca/find-a-y" }] },
    { cats: ["comm", "all"], who: "Community programs · 24/7", title: "Call 211 for community & faith groups", body: "211 lists recreation centres, drop-in groups, faith and cultural communities, and free local programs in your own town.", actions: [{ label: "Call 211", href: "tel:211" }, { label: "Search online", href: "https://211ontario.ca", alt: true }] },
    { cats: ["comm"], who: "Youth · ages 12–25", title: "Youth Wellness Hubs Ontario", body: "Free, walk-in spaces for young people with mental health support, activities, and a community to connect with. Find a hub near you.", actions: [{ label: "Find a hub", href: "https://youthhubs.ca/" }] },
    { cats: ["comm"], who: "Peer recovery support", title: "Recovery groups near you", body: "Want to be around others staying sober? ConnexOntario connects you to free self-help and peer recovery groups for alcohol and drugs, 24/7.", actions: [{ label: "Call 1-866-531-2600", href: "tel:18665312600" }, { label: "Website", href: "https://connexontario.ca", alt: true }] },
    { cats: ["comm"], who: "Farmers & rural Ontario · 24/7", title: "Farmer Wellness Initiative", body: "Free, confidential counselling for Ontario farmers and their families, 365 days a year, with counsellors who understand farm life.", actions: [{ label: "Call 1-866-267-6255", href: "tel:18662676255" }] },

    /* SPORTS */
    { cats: ["play"], who: "Can't afford the fees?", title: "KidSport Ontario", body: "Grants of up to $250 a year to cover sport registration for kids 18 and under from families facing money barriers. Apply free online.", actions: [{ label: "Apply", href: "https://kidsportcanada.ca/ontario/" }] },
    { cats: ["play"], who: "Canada-wide · sport funding", title: "Canadian Tire Jumpstart", body: "Helps kids who can't afford it get into sport, covering registration, equipment, and transport. Also runs free community programs.", actions: [{ label: "Apply", href: "https://jumpstart.canadiantire.ca/" }] },
    { cats: ["play"], who: "All ages · all of Ontario", title: "YMCA sports & swim", body: "Registered and drop-in sports, swim lessons, and day camps, with financial assistance available. Find your local Y.", actions: [{ label: "Find a Y", href: "https://www.ymca.ca/find-a-y" }] },

    /* NEW & LEGAL */
    { cats: ["new"], who: "Free · government-funded", title: "Find free newcomer services", body: "The official Government of Canada finder. Free settlement workers near you help with jobs, language classes, housing, schools, health, and benefits.", actions: [{ label: "Find services", href: "https://ircc.canada.ca/english/newcomers/services/index.asp" }] },
    { cats: ["new"], who: "First stop for newcomers", title: "YMCA Newcomer Information Centre", body: "A free, welcoming first stop in Ontario. Get a personal settlement plan and clear answers on work, education, health, and life in Canada.", actions: [{ label: "Open", href: "https://newcomersincanada.ca" }] },
    { cats: ["new"], who: "Free legal help", title: "Legal Aid Ontario", body: "Free or low-cost legal help if you can't afford a lawyer: criminal, family, refugee and immigration, and housing. Facing domestic violence? A free 2-hour consult, no income test.", actions: [{ label: "Call 1-800-668-8258", href: "tel:18006688258" }, { label: "Website", href: "https://www.legalaid.on.ca", alt: true }] },
    { cats: ["new"], who: "Everyday legal problems", title: "Community legal clinics", body: "Local clinics give free help with the essentials: housing and eviction, ODSP and Ontario Works, employment, and human rights. Find your nearest clinic.", actions: [{ label: "Find a clinic", href: "https://www.legalaid.on.ca/legal-clinics/" }] },

    /* MONEY */
    { cats: ["money"], who: "Canada · free tool", title: "Budget Planner (FCAC)", body: "The government's free budget tool. It does the math and shows where your money goes, so you can find room to breathe. No account needed.", actions: [{ label: "Open tool", href: "https://itools-ioutils.fcac-acfc.gc.ca/BP-PB/budget-planner" }] },
    { cats: ["money"], who: "Canada · know the trap", title: "The truth about payday loans", body: "Borrowing $100 can cost $14 to $17 in fees, over 300% a year, and it traps you in a cycle. Read the plain facts before you ever sign one.", actions: [{ label: "Read first", href: "https://www.canada.ca/en/financial-consumer-agency/services/loans/payday-loans.html" }] },
    { cats: ["money"], who: "Canada · learn the basics", title: "Money basics, no jargon", body: "Free guides on banking, debt, credit, and saving from the Financial Consumer Agency of Canada. Plain language, nothing to buy.", actions: [{ label: "Learn", href: "https://www.canada.ca/en/financial-consumer-agency/services/financial-toolkit.html" }] },

    /* ALL */
    { cats: ["all"], hot: true, who: "All of Ontario · 24/7", title: "Call 211 Ontario", body: "Dial 2-1-1 from any phone, free, any hour. They listen and connect you to local help for whatever you're facing. Over 150 languages.", actions: [{ label: "Call 211", href: "tel:211" }, { label: "Search online", href: "https://211ontario.ca", alt: true }] }
  ];

  var TIPS = [
    { h: "Avoid high-interest debt", p: "Payday loans and \u201Cinstant pay\u201D apps are the most expensive way to borrow. Try 211 or a food bank for emergency basics first. It's free, not a loan." },
    { h: "Pay highest-interest first", p: "If you owe on more than one thing, put extra money toward the debt with the biggest interest rate. It costs you the most each month." },
    { h: "A tiny buffer beats a loan", p: "Even $5–10 set aside when you can means an unexpected cost doesn't force you into borrowing at high interest later." },
    { h: "Prices rising? Review, don't borrow", p: "When costs go up, the FCAC's advice is to trim expenses and avoid taking on new debt, rather than covering the gap with credit." }
  ];

  var state = { tab: "talk", city: ALL };

  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function visibleFor(tab, city) {
    var reg = regionOf(city);
    var list = R.filter(function (r) {
      if (r.cats.indexOf(tab) === -1) return false;
      if (!r.region) return true;
      if (city === ALL) return true;
      return r.region === reg;
    });
    // local-first when a specific city is chosen
    if (city !== ALL) list.sort(function (a, b) { return (b.region ? 1 : 0) - (a.region ? 1 : 0); });
    return list;
  }

  function cardHTML(r, i, tab, city) {
    var color = r.hot ? "var(--coral)" : COLOR[tab];
    var icon = TABS.filter(function (t) { return t.id === tab; })[0].icon;
    var foot = "";
    if (r.local) foot += '<span class="tag local">✓ <b>Local</b> · confirm via 211</span>';
    else foot += '<span class="tag">✓ <b>Verified</b></span>';
    if (city !== ALL && r.region) foot += '<span class="tag here-tag">📍 <b>In ' + esc(city) + "</b></span>";
    else if (city !== ALL && !r.region) foot += '<span class="tag here-tag">✓ Available in ' + esc(city) + "</span>";
    else if (r.regionLabel) foot += '<span class="tag">· ' + esc(r.regionLabel) + "</span>";
    r.actions.forEach(function (a, j) {
      var cls = a.alt ? "go alt" : "go";
      var arrow = a.alt ? "" : ' <span aria-hidden="true">→</span>';
      var ext = a.href.indexOf("http") === 0 ? ' target="_blank" rel="noopener noreferrer"' : "";
      foot += '<a class="' + cls + '" href="' + a.href + '"' + ext + ">" + esc(a.label) + arrow + "</a>";
    });
    return '<article class="res' + (r.hot ? " hot" : "") + '" style="--cat:' + color + ';animation-delay:' + (i * 50) + 'ms">' +
      '<div class="top"><span class="dot">' + icon + '</span><span class="who">' + esc(r.who) + "</span></div>" +
      "<h3>" + esc(r.title) + "</h3><p>" + esc(r.body) + "</p>" +
      '<div class="foot">' + foot + "</div></article>";
  }

  function render() {
    var tab = TABS.filter(function (t) { return t.id === state.tab; })[0];
    var list = visibleFor(state.tab, state.city);
    var html = '<section class="panel">';
    html += '<div class="phead"><h2>' + esc(tab.title) + '</h2><span class="note">' + esc(tab.note) + "</span></div>";
    html += '<p class="pintro">' + INTRO[state.tab](state.city) + "</p>";
    html += '<div class="cards">' + list.map(function (r, i) { return cardHTML(r, i, state.tab, state.city); }).join("") + "</div>";
    if (state.tab === "money") html += '<div class="tips">' + TIPS.map(function (t) { return '<div class="tip"><h4>' + esc(t.h) + "</h4><p>" + esc(t.p) + "</p></div>"; }).join("") + "</div>";
    html += "</section>";
    document.getElementById("panel").innerHTML = html;

    // city-aware count + hint
    var total = R.filter(function (r) { return !r.region || state.city === ALL || r.region === regionOf(state.city); }).length;
    var hint = document.getElementById("cityhint");
    if (state.city === ALL) hint.innerHTML = "Showing all <b>" + total + "</b> verified services across Ontario. Pick your city and anything local to you moves to the top.";
    else hint.innerHTML = "Showing <b>" + total + "</b> free, verified services for <b>" + esc(state.city) + "</b>, with anything local to you first.";
    var locText = document.getElementById("locText");
    if (locText) locText.textContent = state.city === ALL ? "Ontario" : state.city;
  }

  function buildChrome() {
    var tl = document.getElementById("tablist");
    TABS.forEach(function (t, i) {
      var b = el("button", "tab");
      b.type = "button"; b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(i === 0));
      b.id = "tab-" + t.id;
      b.style.setProperty("--cat", COLOR[t.id]);
      b.innerHTML = '<span class="ic">' + t.icon + "</span>" + esc(t.label);
      b.addEventListener("click", function () { selectTab(t.id); });
      b.addEventListener("keydown", function (e) {
        var idx = i;
        if (e.key === "ArrowRight") idx = (i + 1) % TABS.length;
        else if (e.key === "ArrowLeft") idx = (i - 1 + TABS.length) % TABS.length;
        else return;
        e.preventDefault(); tl.children[idx].focus(); selectTab(TABS[idx].id);
      });
      tl.appendChild(b);
    });
    var sel = document.getElementById("city");
    CITIES.forEach(function (c) { var o = el("option"); o.value = c; o.textContent = c; sel.appendChild(o); });
    sel.value = state.city;
    sel.addEventListener("change", function () {
      state.city = sel.value; render();
      var card = document.querySelector(".citycard");
      if (card) { card.animate([{ boxShadow: "0 0 0 3px rgba(12,110,131,.35)" }, { boxShadow: "var(--sh-card)" }], { duration: 600, easing: "ease-out" }); }
    });
  }

  function selectTab(id) {
    state.tab = id;
    TABS.forEach(function (t) { document.getElementById("tab-" + t.id).setAttribute("aria-selected", String(t.id === id)); });
    render();
  }

  /* ---------- Intro splash → site ---------- */
  function initSplash() {
    var splash = document.getElementById("splash");
    var vid = document.getElementById("introVid");
    var bar = document.getElementById("vidbar");
    var skip = document.getElementById("skip");
    var done = false, maxTimer;

    function dismiss() {
      if (done) return; done = true;
      clearTimeout(maxTimer);
      splash.classList.add("leaving");
      document.body.classList.remove("intro");
      document.body.classList.add("entered");
      setTimeout(function () { try { vid.pause(); } catch (e) {} splash.style.display = "none"; }, 850);
    }

    skip.addEventListener("click", dismiss);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") dismiss(); });

    if (vid) { vid.play().catch(function () {}); }
    // The intro runs about four seconds, then glides into the site. Skip or Esc end it early.
    if (bar) { bar.style.transition = "width 4s linear"; requestAnimationFrame(function () { bar.style.width = "100%"; }); }
    maxTimer = setTimeout(dismiss, 4000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("intro");
    buildChrome();
    render();
    initSplash();
  });
})();
