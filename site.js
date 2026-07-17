/* h3lp — hub logic. Mobile-first. Bilingual EN/FR.
   - Crafted intro: the uploaded video plays, then transitions into the site.
   - City filter that visibly changes things: local help first, province-wide lines
     confirmed "available in <city>", a live count, and a city-aware heading.
   - Verified, inclusive Ontario/Canada resources (no invented numbers).
   - Full French layer: FR org names and FR links only where the organization's own
     French branding/page was verified. Language lives in the URL hash (#fr/...),
     never in storage — the "stores nothing" promise holds. */
(function () {
  "use strict";

  /* ---------- Category colours (from the logo spectrum) ---------- */
  var COLOR = { talk: "#0c7d92", food: "#e0701f", safe: "#d65745", comm: "#5f9136", play: "#1f8aa6", "new": "#cf9626", money: "#2f8f6f", all: "#0c6b80" };

  var TABS = [
    { id: "talk",  label: "Talk to someone",       labelFr: "Parler à quelqu'un",            icon: "💬", title: "Someone to talk to",        titleFr: "Quelqu'un à qui parler",              note: "Free · confidential · most 24/7",      noteFr: "Gratuit · confidentiel · souvent 24/7" },
    { id: "food",  label: "Food today",            labelFr: "Manger aujourd'hui",            icon: "🍲", title: "A meal today",               titleFr: "Un repas aujourd'hui",                note: "No one should go to sleep hungry.",    noteFr: "Personne ne devrait s'endormir le ventre vide." },
    { id: "safe",  label: "A safe place",          labelFr: "Un endroit sûr",                icon: "🛡️", title: "If you're not safe",         titleFr: "Si vous n'êtes pas en sécurité",      note: "It's not your fault. You have options.", noteFr: "Ce n'est pas votre faute. Vous avez des options." },
    { id: "comm",  label: "Community",             labelFr: "Communauté",                    icon: "🤝", title: "Community to belong to",     titleFr: "Une communauté où trouver sa place",  note: "A safe place to show up.",             noteFr: "Un endroit accueillant, sans jugement." },
    { id: "play",  label: "Sports for youth",      labelFr: "Sports pour les jeunes",        icon: "⚽", title: "Get a kid into sport",       titleFr: "Inscrire un enfant au sport",         note: "Cost shouldn't keep them out.",        noteFr: "Le coût ne devrait pas les en priver." },
    { id: "new",   label: "New to Canada & legal", labelFr: "Nouveau au Canada et juridique", icon: "🍁", title: "New to Canada & legal help", titleFr: "Nouveaux arrivants et aide juridique", note: "You are not alone here.",             noteFr: "Vous n'êtes pas seul(e) ici." },
    { id: "money", label: "Money basics",          labelFr: "L'argent, les bases",           icon: "💵", title: "A first step with money",    titleFr: "Un premier pas avec l'argent",        note: "Free, trustworthy, nothing to buy.",   noteFr: "Gratuit, fiable, rien à acheter." },
    { id: "all",   label: "Not sure",              labelFr: "Je ne sais pas trop",           icon: "🧭", title: "Not sure where to start?",   titleFr: "Vous ne savez pas par où commencer?", note: "One call covers almost anything.",     noteFr: "Un seul appel couvre presque tout." }
  ];

  /* ---------- Cities → region (regions with a curated local card) ---------- */
  var ALL = "All of Ontario";
  var CITIES = [ALL, "Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Vaughan", "Richmond Hill", "Scarborough", "Oshawa", "Kitchener", "Waterloo", "Cambridge", "Windsor", "Kingston", "Greater Sudbury", "Thunder Bay", "Barrie", "Guelph", "St. Catharines", "Niagara Falls", "Oakville", "Burlington", "North Bay", "Sault Ste. Marie", "Peterborough"];
  var REGION = { "Toronto": "gta", "Mississauga": "gta", "Brampton": "gta", "Markham": "gta", "Vaughan": "gta", "Richmond Hill": "gta", "Scarborough": "gta", "Oshawa": "gta", "Ottawa": "ottawa", "Hamilton": "hamilton", "London": "london", "Kitchener": "waterloo", "Waterloo": "waterloo", "Cambridge": "waterloo", "Kingston": "kingston", "Greater Sudbury": "sudbury", "Thunder Bay": "thunderbay", "Barrie": "barrie", "Guelph": "guelph" };
  function regionOf(c) { return REGION[c] || "other"; }

  var state = { tab: "talk", city: ALL, lang: "en" };

  /* ---------- Interface strings, both languages ---------- */
  var STR = {
    en: {
      docTitle: "h3lp · free, verified help across Ontario",
      metaDesc: "h3lp is a free, friendly hub that connects everyone in Ontario to real, verified help: someone to talk to, a meal today, a safe place, community, free youth sports, newcomer and legal support, and money basics. No sign-up. No tracking.",
      allCity: "All of Ontario",
      langBtnText: "FR", langBtnLang: "fr", langBtnLabel: "Passer au français",
      splashLabel: "h3lp intro", urgentLabel: "Emergency",
      quickExitTitle: "Instantly leave this site and open the weather instead",
      cityAria: "Choose your Ontario city", tabsAria: "What do you need?", brandAria: "h3lp home",
      shareAria: "Share this resource", shareSuffix: "free, verified help via h3lp",
      saySummary: "Not sure what to say? Tap for opening lines",
      sayReassure: "You don’t need the right words. They’re trained to carry the conversation from there.",
      hrsAlwaysTitle: "Open around the clock", hrsOpenUntil: "Open now &middot; until ", hrsOpens: "Opens ",
      tagLocal: '✓ <b>Local</b> · confirm via 211', tagVerified: '✓ <b>Verified</b>',
      static: {
        skip: "Skip to help",
        crisis: 'In crisis right now? Call or text <a href="tel:988">988</a>, free and open 24/7.',
        skipbtn: 'Skip <span aria-hidden="true">→</span>',
        urgent: 'Thinking of suicide, or in an emergency? Call or text <a href="tel:988">988</a> (free, 24/7). If someone is in danger right now, call <a href="tel:911">911</a>.',
        quickExit: "Quick exit",
        brandsub: "a hub for hope &amp; recovery",
        h1: 'You don\'t have to figure this out <span class="grad">alone</span>.',
        heroP: "h3lp is a friendly, free hub that connects you to real, verified help across Ontario. Whoever you are and whatever you're going through, there's something here for you. No sign-up, no judgement.",
        incl: 'Free and open to everyone, any age or background <span class="maple" aria-hidden="true">🍁</span>',
        whereq: "Where are you?",
        disc1: "<strong>About these links.</strong> h3lp is a free, non-profit signpost for Ontario. We don't run any of these services. We point you to trusted Ontario and Canada-wide organizations so you can reach the real help directly. The province-wide lines (988, 211, 811, Kids Help Phone) work from any city. Local listings were checked when this page was built; if you spot a broken link, please tell us, and confirm any local detail by calling 211.",
        disc2: "<strong>In immediate danger? Call 911.</strong> This site sets no cookies, loads no trackers, and stores nothing about you. After your first visit it keeps working even without a connection.",
        printBtn: "Print the key numbers &middot; wallet card",
        quote: '"Reason remains bulletproof, even when written in code."',
        madeby: 'Made by a civilian, for all civilians <span class="maple" aria-hidden="true">🍁</span>',
        cred: '<div class="nm">h3lp</div>© 2026 Franco Bernal · Free forever<br />Proudly built in Ontario, Canada',
        pcSub: "free, verified help in Ontario &middot; keep this card",
        pc988: "Suicide crisis line, call or text, 24/7",
        pc911: "Someone is in danger right now",
        pc211: "Any help: food, shelter, money, anything, 24/7",
        pc811: "A registered nurse, free, 24/7",
        pcKids: "Kids Help Phone (or text CONNECT to 686868), 24/7",
        pcConnex: "ConnexOntario: addiction &amp; mental health, 24/7",
        pcAWHL: "Assaulted Women's Helpline, 24/7",
        pcSSL: "Seniors Safety Line, 24/7",
        pcFoot: "All lines are free and confidential. More at the h3lp hub online."
      },
      hintAll: function (n) { return "Showing all <b>" + n + "</b> verified services across Ontario. Pick your city and anything local to you moves to the top."; },
      hintCity: function (n, c) { return "Showing <b>" + n + "</b> free, verified services for <b>" + esc(c) + "</b>, with anything local to you first."; },
      tagIn: function (c) { return '📍 <b>In ' + esc(c) + "</b>"; },
      tagAvail: function (c) { return "✓ Available in " + esc(c); }
    },
    fr: {
      docTitle: "h3lp · de l'aide gratuite et vérifiée, partout en Ontario",
      metaDesc: "h3lp est un carrefour gratuit et convivial qui relie tout le monde en Ontario à de l'aide réelle et vérifiée : quelqu'un à qui parler, un repas aujourd'hui, un endroit sûr, une communauté, du sport gratuit pour les jeunes, du soutien aux nouveaux arrivants, de l'aide juridique et les bases de l'argent. Sans inscription. Sans traçage.",
      allCity: "Tout l'Ontario",
      langBtnText: "EN", langBtnLang: "en", langBtnLabel: "Switch to English",
      splashLabel: "intro h3lp", urgentLabel: "Urgence",
      quickExitTitle: "Quitter instantanément ce site et ouvrir la météo à la place",
      cityAria: "Choisissez votre ville en Ontario", tabsAria: "De quoi avez-vous besoin?", brandAria: "accueil h3lp",
      shareAria: "Partager cette ressource", shareSuffix: "aide gratuite et vérifiée via h3lp",
      saySummary: "Vous ne savez pas quoi dire? Touchez pour des phrases d'ouverture",
      sayReassure: "Vous n’avez pas besoin des mots parfaits. Ces personnes sont formées pour porter la conversation à partir de là.",
      hrsAlwaysTitle: "Ouvert en tout temps", hrsOpenUntil: "Ouvert &middot; jusqu'à ", hrsOpens: "Ouvre à ",
      tagLocal: '✓ <b>Local</b> · confirmez au 211', tagVerified: '✓ <b>Vérifié</b>',
      static: {
        skip: "Aller à l'aide",
        crisis: 'En crise en ce moment? Appelez ou textez le <a href="tel:988">988</a>, gratuit, 24/7.',
        skipbtn: 'Passer <span aria-hidden="true">→</span>',
        urgent: 'Vous pensez au suicide, ou c\'est une urgence? Appelez ou textez le <a href="tel:988">988</a> (gratuit, 24/7). Si quelqu\'un est en danger immédiat, composez le <a href="tel:911">911</a>.',
        quickExit: "Sortie rapide",
        brandsub: "un carrefour d'espoir et de rétablissement",
        h1: 'Vous n\'avez pas à traverser ça <span class="grad">seul(e)</span>.',
        heroP: "h3lp est un carrefour convivial et gratuit qui vous relie à de l'aide réelle et vérifiée, partout en Ontario. Qui que vous soyez, quoi que vous traversiez, il y a quelque chose ici pour vous. Sans inscription, sans jugement.",
        incl: 'Gratuit et ouvert à tout le monde, peu importe l\'âge ou le parcours <span class="maple" aria-hidden="true">🍁</span>',
        whereq: "Où êtes-vous?",
        disc1: "<strong>À propos de ces liens.</strong> h3lp est un point de repère gratuit et sans but lucratif pour l'Ontario. Nous n'exploitons aucun de ces services. Nous vous dirigeons vers des organismes de confiance, ontariens et pancanadiens, pour que vous rejoigniez l'aide réelle directement. Les lignes provinciales (988, 211, 811, Jeunesse, J'écoute) fonctionnent depuis n'importe quelle ville. Les ressources locales ont été vérifiées au moment de bâtir cette page; si vous voyez un lien brisé, dites-le-nous, et confirmez tout détail local en appelant le 211.",
        disc2: "<strong>En danger immédiat? Composez le 911.</strong> Ce site n'installe aucun témoin (cookie), ne charge aucun traqueur et ne conserve rien à votre sujet. Après votre première visite, il continue de fonctionner même sans connexion.",
        printBtn: "Imprimer les numéros clés &middot; carte format portefeuille",
        quote: "« La raison reste à l'épreuve des balles, même écrite en code. »",
        madeby: 'Fait par un civil, pour tous les civils <span class="maple" aria-hidden="true">🍁</span>',
        cred: '<div class="nm">h3lp</div>© 2026 Franco Bernal · Gratuit pour toujours<br />Fièrement conçu en Ontario, au Canada',
        pcSub: "de l'aide gratuite et vérifiée en Ontario &middot; gardez cette carte",
        pc988: "Ligne de crise suicide, appel ou texto, 24/7",
        pc911: "Quelqu'un est en danger en ce moment",
        pc211: "Toute aide : nourriture, refuge, argent, tout, 24/7",
        pc811: "Une infirmière autorisée, gratuit, 24/7",
        pcKids: "Jeunesse, J'écoute (ou textez PARLER au 686868), 24/7",
        pcConnex: "ConnexOntario : dépendances et santé mentale, 24/7",
        pcAWHL: "Assaulted Women's Helpline (violence conjugale), 24/7",
        pcSSL: "Ligne d'assistance aux personnes âgées, 24/7",
        pcFoot: "Toutes ces lignes sont gratuites et confidentielles. Plus de ressources sur le site h3lp."
      },
      hintAll: function (n) { return "Tous les <b>" + n + "</b> services vérifiés sont affichés, partout en Ontario. Choisissez votre ville et ce qui est près de chez vous remonte en premier."; },
      hintCity: function (n, c) { return "<b>" + n + "</b> services gratuits et vérifiés pour <b>" + esc(c) + "</b>, avec ce qui est près de chez vous en premier."; },
      tagIn: function (c) { return '📍 <b>À ' + esc(c) + "</b>"; },
      tagAvail: function (c) { return "✓ Offert à " + esc(c); }
    }
  };
  function S(k) { return STR[state.lang][k]; }

  function here(c) {
    if (state.lang === "fr") return c === ALL ? "partout en Ontario" : 'à <span class="here">' + c + "</span>";
    return c === ALL ? "across Ontario" : 'in <span class="here">' + c + "</span>";
  }
  var INTRO = {
    en: {
      talk: function (c) { return "Whatever you're carrying, whether it's drugs, drinking, panic, grief, or just feeling like there's no way out, trained responders are ready to listen. Free, confidential crisis lines and support services are available 24/7 " + here(c) + ". There are options for everyone, plus dedicated lines built for youth, Indigenous, Black, 2SLGBTQ+, Muslim, and student communities. Start here."; },
      food: function (c) { return "Free food banks and meal programs " + here(c) + ". Most don't ask for ID or a reason. Pick your city and your nearest option comes first."; },
      safe: function (c) { return "If someone is hurting you, scaring you, or controlling you, these lines are private and free " + here(c) + ". They help you understand your choices and find a safe place, without ever forcing you into anything. Need to leave fast? The <b>Quick exit</b> button up top instantly swaps this page for the weather."; },
      comm: function (c) { return "Recovery and a fresh start are easier around people. Drop-in centres, youth hubs, recovery and faith groups. A healthy way to fill the time and belong, " + here(c) + "."; },
      play: function (c) { return "Sport keeps kids and teens busy, connected, and well. These help families " + here(c) + " cover registration and gear, even when money is tight."; },
      "new": function (c) { return "Arriving somewhere new and not knowing what exists is its own kind of hard. Ontario has free settlement workers and free legal help, for jobs, language, housing, benefits, and your rights. Start here, " + here(c) + "."; },
      money: function () { return "Money stress makes everything harder. These are free Government of Canada tools, with no selling and no catch. Start with one small thing."; },
      all: function (c) { return "If your situation doesn't fit a box, start here. One free call connects you to a real person who can point you to food, housing, health, money, and more, " + (c === ALL ? "anywhere in Ontario" : "including " + c) + "."; }
    },
    fr: {
      talk: function (c) { return "Peu importe ce que vous portez, que ce soit la drogue, l'alcool, la panique, le deuil, ou juste l'impression qu'il n'y a pas d'issue, des intervenants formés sont prêts à écouter. Des lignes de crise et des services de soutien gratuits et confidentiels sont offerts 24/7 " + here(c) + ". Il y a des options pour tout le monde, avec des lignes dédiées pour les jeunes et pour les communautés autochtones, noires, 2SLGBTQ+, musulmanes et étudiantes. Commencez ici."; },
      food: function (c) { return "Des banques alimentaires et des programmes de repas gratuits " + here(c) + ". La plupart ne demandent ni pièce d'identité ni justification. Choisissez votre ville et l'option la plus proche s'affiche en premier."; },
      safe: function (c) { return "Si quelqu'un vous fait du mal, vous fait peur ou vous contrôle, ces lignes sont privées et gratuites " + here(c) + ". Elles vous aident à comprendre vos choix et à trouver un endroit sûr, sans jamais rien vous imposer. Besoin de partir vite? Le bouton <b>Sortie rapide</b> en haut remplace instantanément cette page par la météo."; },
      comm: function (c) { return "Le rétablissement et un nouveau départ sont plus faciles quand on est bien entouré. Centres d'accueil, carrefours jeunesse, groupes de rétablissement et communautés de foi. Une façon saine d'occuper le temps et de trouver sa place, " + here(c) + "."; },
      play: function (c) { return "Le sport garde les enfants et les ados occupés, connectés et en santé. Ces programmes aident les familles " + here(c) + " à couvrir l'inscription et l'équipement, même quand l'argent est serré."; },
      "new": function (c) { return "Arriver quelque part sans savoir ce qui existe, c'est déjà difficile en soi. L'Ontario offre gratuitement des travailleurs d'établissement et de l'aide juridique : emploi, langue, logement, prestations et vos droits. Commencez ici, " + here(c) + "."; },
      money: function () { return "Le stress financier rend tout plus difficile. Voici des outils gratuits du gouvernement du Canada, sans vente et sans piège. Commencez par une petite chose."; },
      all: function (c) { return "Si votre situation n'entre dans aucune case, commencez ici. Un seul appel gratuit vous met en contact avec une vraie personne qui peut vous orienter : nourriture, logement, santé, argent et plus, " + (c === ALL ? "partout en Ontario" : "y compris à " + c) + "."; }
    }
  };

  /* ---------- Resources (region:null = province-wide, always available) ----------
     fr = the French layer. FR titles only where the org's own French branding was
     verified (2026-07-16); FR links only where the org's French page was verified live. */
  var R = [
    /* TALK */
    { cats: ["talk", "all"], hot: true, who: "Right now · 24/7", title: "988 Suicide Crisis Helpline", hours: "24/7", body: "If you're thinking about suicide, or worried about someone who is. Call or text 988 any time, free, anywhere in Canada.", actions: [{ label: "Call or text 988", href: "tel:988" }],
      fr: { who: "Tout de suite · 24/7", title: "9-8-8 : Ligne d'aide en cas de crise de suicide", body: "Si vous pensez au suicide, ou si vous vous inquiétez pour quelqu'un. Appelez ou textez le 988 à toute heure, gratuitement, partout au Canada.", actions: [{ label: "Appelez ou textez le 988", href: "tel:988" }] } },
    { cats: ["talk"], who: "Ontario · addiction & mental health", title: "ConnexOntario", hours: "24/7", body: "Free, confidential, government-funded line for drugs, alcohol, gambling, or mental health. They find local treatment for you, even with no insurance. Open 24/7.", actions: [{ label: "Call 1-866-531-2600", href: "tel:18665312600" }, { label: "Website", href: "https://connexontario.ca", alt: true }],
      fr: { who: "Ontario · dépendances et santé mentale", body: "Une ligne gratuite, confidentielle et financée par le gouvernement pour la drogue, l'alcool, le jeu ou la santé mentale. On trouve un traitement local pour vous, même sans assurance. Ouvert 24/7.", actions: [{ label: "Appelez le 1 866 531-2600", href: "tel:18665312600" }, { label: "Site Web", href: "https://www.connexontario.ca/fr-ca", alt: true }] } },
    { cats: ["talk"], who: "Ontario · ages 5–29", title: "Kids Help Phone", hours: "24/7", body: "For kids, teens, and young adults. Call any time, or text CONNECT to 686868. Free, confidential, and they actually get it.", actions: [{ label: "Call 1-800-668-6868", href: "tel:18006686868" }, { label: "Text 686868", href: "sms:686868?body=CONNECT", alt: true }],
      fr: { who: "Ontario · 5 à 29 ans", title: "Jeunesse, J'écoute", body: "Pour les enfants, les ados et les jeunes adultes. Appelez à toute heure, ou textez PARLER au 686868. Gratuit, confidentiel, et on vous comprend vraiment.", actions: [{ label: "Appelez le 1 800 668-6868", href: "tel:18006686868" }, { label: "Textez PARLER au 686868", href: "sms:686868?body=PARLER", alt: true }] } },
    { cats: ["talk", "all"], who: "Ontario · a nurse, free", title: "Health811", hours: "24/7", body: "Dial 811 to talk to a registered nurse, free, 24/7, about any health worry, including mental health or substance use. No health card needed.", actions: [{ label: "Call 811", href: "tel:811" }, { label: "Website", href: "https://health811.ontario.ca", alt: true }],
      fr: { who: "Ontario · une infirmière, gratuit", title: "Santé811", body: "Composez le 811 pour parler à une infirmière autorisée, gratuitement, 24/7, pour toute inquiétude de santé, y compris la santé mentale ou la consommation. Aucune carte Santé requise.", actions: [{ label: "Appelez le 811", href: "tel:811" }, { label: "Site Web", href: "https://health811.ontario.ca/static/fr-ca/guest/home", alt: true }] } },
    { cats: ["talk"], who: "Ontario · post-secondary students", title: "Good2Talk", hours: "24/7", body: "Free, confidential, 24/7 support for college and university students in Ontario, in over 100 languages. Call or text.", actions: [{ label: "Call 1-866-925-5454", href: "tel:18669255454" }, { label: "Text GOOD2TALKON to 686868", href: "sms:686868?body=GOOD2TALKON", alt: true }],
      fr: { who: "Ontario · étudiants postsecondaires", title: "Allo J'écoute", body: "Du soutien gratuit, confidentiel et 24/7 pour les étudiantes et étudiants des collèges et universités de l'Ontario, en plus de 100 langues. Appelez ou textez.", actions: [{ label: "Appelez le 1 866 925-5454", href: "tel:18669255454" }, { label: "Textez ALLOJECOUTEON au 686868", href: "sms:686868?body=ALLOJECOUTEON", alt: true }] } },
    { cats: ["talk"], who: "Indigenous peoples · 24/7", title: "Hope for Wellness Helpline", hours: "24/7", body: "Immediate counselling and crisis support for all First Nations, Inuit, and Métis. Available in English, French, Cree, Ojibway, and Inuktitut.", actions: [{ label: "Call 1-855-242-3310", href: "tel:18552423310" }, { label: "Online chat", href: "https://www.hopeforwellness.ca", alt: true }],
      fr: { who: "Peuples autochtones · 24/7", title: "Espoir pour le mieux-être", body: "Du counseling immédiat et du soutien de crise pour tous les membres des Premières Nations, les Inuits et les Métis. Offert en français, en anglais, en cri, en ojibwé et en inuktitut.", actions: [{ label: "Appelez le 1 855 242-3310", href: "tel:18552423310" }, { label: "Clavardage en ligne", href: "https://www.espoirpourlemieuxetre.ca", alt: true }] } },
    { cats: ["talk"], who: "Indigenous · Ontario · 24/7", title: "Métis Nation of Ontario crisis line", hours: "24/7", body: "A 24-hour mental health and addictions crisis line with culturally specific support for Métis adults, youth, and families, in English and French.", actions: [{ label: "Call 1-877-767-7572", href: "tel:18777677572" }],
      fr: { who: "Autochtones · Ontario · 24/7", title: "Ligne de crise de la Métis Nation of Ontario", body: "Une ligne de crise en santé mentale et en dépendances, 24 heures sur 24, avec un soutien culturellement adapté pour les adultes, les jeunes et les familles métis, en français et en anglais.", actions: [{ label: "Appelez le 1 877 767-7572", href: "tel:18777677572" }] } },
    { cats: ["talk"], who: "Black youth & families", title: "Black Youth Helpline", hours: { days: [0,1,2,3,4,5,6], from: 540, to: 1320, label: "every day", labelFr: "tous les jours" }, body: "A culturally safe, professional helpline for Black youth, families, and schools across Ontario. Open every day, 9am–10pm.", actions: [{ label: "Call 1-833-294-8650", href: "tel:18332948650" }, { label: "Website", href: "https://blackyouth.ca", alt: true }],
      fr: { who: "Jeunes noirs et familles", body: "Une ligne d'aide professionnelle et culturellement sécuritaire pour les jeunes noirs, les familles et les écoles, partout en Ontario. Ouvert tous les jours, de 9 h à 22 h.", actions: [{ label: "Appelez le 1 833 294-8650", href: "tel:18332948650" }, { label: "Site Web", href: "https://blackyouth.ca", alt: true }] } },
    { cats: ["talk"], who: "2SLGBTQ+ youth · 29 & under", title: "LGBT YouthLine", hours: { days: [0,1,2,3,4,5], from: 960, to: 1290, label: "Sun–Fri", labelFr: "dim–ven" }, body: "Confidential, non-judgemental peer support by and for 2SLGBTQ+ youth across Ontario, by text or online chat.", actions: [{ label: "Text 647-694-4275", href: "sms:16476944275" }, { label: "Online chat", href: "https://www.youthline.ca/", alt: true }],
      fr: { who: "Jeunes 2SLGBTQ+ · 29 ans et moins", body: "Du soutien par les pairs, confidentiel et sans jugement, par et pour les jeunes 2SLGBTQ+ de l'Ontario, par texto ou par clavardage en ligne.", actions: [{ label: "Textez le 647 694-4275", href: "sms:16476944275" }, { label: "Clavardage en ligne", href: "https://www.youthline.ca/", alt: true }] } },
    { cats: ["talk"], who: "Muslim mental health", title: "Naseeha", body: "Confidential, culturally and spiritually aware support for Muslim youth and anyone who needs it: mental health, faith, family, and more.", actions: [{ label: "Call 1-866-627-3342", href: "tel:18666273342" }, { label: "Website", href: "https://naseeha.org", alt: true }],
      fr: { who: "Santé mentale musulmane", body: "Un soutien confidentiel, adapté à la culture et à la spiritualité, pour les jeunes musulmans et toute personne qui en a besoin : santé mentale, foi, famille et plus.", actions: [{ label: "Appelez le 1 866 627-3342", href: "tel:18666273342" }, { label: "Site Web", href: "https://naseeha.org", alt: true }] } },
    { cats: ["talk", "comm", "new"], who: "Spanish-speaking · Toronto & GTA", title: "Centre for Spanish Speaking Peoples", body: "A trusted Toronto non-profit serving Spanish-speaking communities since 1973: counselling, support for women facing abuse, youth and seniors programs, settlement help, and a free legal clinic. En español.", actions: [{ label: "Call 416-533-8545", href: "tel:14165338545" }, { label: "Website", href: "https://spanishservices.org/en/", alt: true }],
      fr: { who: "Hispanophones · Toronto et région (GTA)", body: "Un organisme torontois de confiance au service des communautés hispanophones depuis 1973 : counseling, soutien aux femmes qui subissent de la violence, programmes pour jeunes et aînés, aide à l'établissement et clinique juridique gratuite. En español.", actions: [{ label: "Appelez le 416 533-8545", href: "tel:14165338545" }, { label: "Site Web", href: "https://spanishservices.org/en/", alt: true }] } },
    { cats: ["talk"], who: "Ontario · local distress centres", title: "Distress & Crisis Ontario", body: "A network of community distress centres across Ontario, a listening ear for anyone feeling lonely, low, or in crisis, often 24/7.", actions: [{ label: "Find a centre", href: "https://www.dcontario.org" }],
      fr: { who: "Ontario · centres de détresse locaux", body: "Un réseau de centres de détresse communautaires partout en Ontario. Une oreille attentive pour toute personne qui se sent seule, à plat ou en crise, souvent 24/7.", actions: [{ label: "Trouver un centre", href: "https://www.dcontario.org" }] } },

    /* FOOD — province-wide */
    { cats: ["food"], who: "All of Ontario", title: "Find a food bank (Feed Ontario)", body: "Ontario's food bank network. Type your town and it lists the nearest member food bank with its address and contact.", actions: [{ label: "Find food", href: "https://feedontario.ca/find-a-food-bank/" }],
      fr: { who: "Tout l'Ontario", title: "Trouver une banque alimentaire (Feed Ontario)", body: "Le réseau des banques alimentaires de l'Ontario. Entrez votre ville et l'outil affiche la banque alimentaire membre la plus proche, avec son adresse et son contact.", actions: [{ label: "Trouver de la nourriture", href: "https://feedontario.ca/find-a-food-bank/" }] } },
    { cats: ["food", "all"], who: "Anywhere in Ontario · 24/7", title: "Call 211 for food", hours: "24/7", body: "Dial 211 and a real person finds food banks, free meals, and meal programs near you, with hours and whether you need to book. Many languages.", actions: [{ label: "Call 211", href: "tel:211" }, { label: "Search online", href: "https://211ontario.ca", alt: true }],
      fr: { who: "Partout en Ontario · 24/7", title: "Appelez le 211 pour manger", body: "Composez le 211 et une vraie personne trouve pour vous les banques alimentaires, les repas gratuits et les programmes alimentaires près de chez vous, avec les heures et s'il faut réserver. Plusieurs langues.", actions: [{ label: "Appelez le 211", href: "tel:211" }, { label: "Chercher en ligne", href: "https://211ontario.ca/fr/", alt: true }] } },
    /* FOOD — local */
    { cats: ["food"], region: "gta", regionLabel: "Toronto & GTA", verified: true, who: "Toronto & GTA", title: "Daily Bread Food Bank", hours: { days: [1,2,3,4,5], from: 510, to: 990, label: "Mon–Fri", labelFr: "lun–ven" }, body: "Over 100 member food banks across Toronto. No ID required for a single person. Use their finder or call to locate your nearest one.", actions: [{ label: "Find food", href: "https://www.dailybread.ca/" }, { label: "Call 416-203-0050", href: "tel:14162030050", alt: true }],
      fr: { who: "Toronto et région (GTA)", regionLabel: "Toronto et région (GTA)", body: "Plus de 100 banques alimentaires membres à Toronto. Aucune pièce d'identité requise pour une personne seule. Utilisez leur outil de recherche ou appelez pour trouver la plus proche.", actions: [{ label: "Trouver de la nourriture", href: "https://www.dailybread.ca/" }, { label: "Appelez le 416 203-0050", href: "tel:14162030050", alt: true }] } },
    { cats: ["food"], region: "ottawa", regionLabel: "Ottawa", local: true, who: "Ottawa", title: "Ottawa Food Bank", body: "Coordinates food banks and meal programs across Ottawa. Their site finds your nearest neighbourhood food bank and community meal.", actions: [{ label: "Find food", href: "https://www.ottawafoodbank.ca/" }, { label: "Call 211", href: "tel:211", alt: true }],
      fr: { who: "Ottawa", title: "La Banque d'alimentation d'Ottawa", body: "Coordonne les banques alimentaires et les programmes de repas partout à Ottawa. Leur site trouve la banque alimentaire de quartier et le repas communautaire les plus proches.", actions: [{ label: "Trouver de la nourriture", href: "https://www.ottawafoodbank.ca/fr/" }, { label: "Appelez le 211", href: "tel:211", alt: true }] } },
    { cats: ["food"], region: "hamilton", regionLabel: "Hamilton", local: true, who: "Hamilton", title: "Hamilton Food Share", body: "The hub for Hamilton's emergency food network. Their 'Looking for help' page lists food banks and hot-meal programs across the city.", actions: [{ label: "Find food", href: "https://hamiltonfoodshare.org/looking-for-help" }, { label: "Call 211", href: "tel:211", alt: true }],
      fr: { who: "Hamilton", body: "Le cœur du réseau alimentaire d'urgence de Hamilton. Leur page « Looking for help » liste les banques alimentaires et les repas chauds partout en ville.", actions: [{ label: "Trouver de la nourriture", href: "https://hamiltonfoodshare.org/looking-for-help" }, { label: "Appelez le 211", href: "tel:211", alt: true }] } },
    { cats: ["food"], region: "london", regionLabel: "London", local: true, who: "London", title: "London Food Bank", body: "Serving London and Middlesex. They point you to the nearest food bank or community meal, with no need to explain why.", actions: [{ label: "Find food", href: "https://londonfoodbank.ca/" }, { label: "Call 211", href: "tel:211", alt: true }],
      fr: { who: "London", body: "Au service de London et du comté de Middlesex. On vous dirige vers la banque alimentaire ou le repas communautaire le plus proche, sans avoir à vous justifier.", actions: [{ label: "Trouver de la nourriture", href: "https://londonfoodbank.ca/" }, { label: "Appelez le 211", href: "tel:211", alt: true }] } },
    { cats: ["food"], region: "waterloo", regionLabel: "Kitchener · Waterloo · Cambridge", local: true, who: "Waterloo Region", title: "The Food Bank of Waterloo Region", body: "Connects you to food banks and community programs across Kitchener, Waterloo and Cambridge.", actions: [{ label: "Find food", href: "https://www.thefoodbank.ca/" }, { label: "Call 211", href: "tel:211", alt: true }],
      fr: { who: "Région de Waterloo", body: "Vous met en lien avec les banques alimentaires et les programmes communautaires de Kitchener, Waterloo et Cambridge.", actions: [{ label: "Trouver de la nourriture", href: "https://www.thefoodbank.ca/" }, { label: "Appelez le 211", href: "tel:211", alt: true }] } },
    { cats: ["food"], region: "kingston", regionLabel: "Kingston", local: true, who: "Kingston", title: "Partners in Mission Food Bank", body: "Kingston's central food bank, supplying neighbourhood programs across the city. Find help or call 211 to confirm hours.", actions: [{ label: "Find food", href: "https://www.kingstonfoodbank.ca/" }, { label: "Call 211", href: "tel:211", alt: true }],
      fr: { who: "Kingston", body: "La banque alimentaire centrale de Kingston, qui approvisionne les programmes de quartier partout en ville. Trouvez de l'aide ou appelez le 211 pour confirmer les heures.", actions: [{ label: "Trouver de la nourriture", href: "https://www.kingstonfoodbank.ca/" }, { label: "Appelez le 211", href: "tel:211", alt: true }] } },
    { cats: ["food"], region: "sudbury", regionLabel: "Greater Sudbury", local: true, who: "Greater Sudbury", title: "Sudbury Food Bank", body: "Supplies emergency food to programs across Greater Sudbury. Their site and 211 find your nearest pickup.", actions: [{ label: "Find food", href: "https://www.sudburyfoodbank.ca/" }, { label: "Call 211", href: "tel:211", alt: true }],
      fr: { who: "Grand Sudbury", body: "Fournit des aliments d'urgence aux programmes du Grand Sudbury. Leur site et le 211 trouvent le point de service le plus proche.", actions: [{ label: "Trouver de la nourriture", href: "https://www.sudburyfoodbank.ca/" }, { label: "Appelez le 211", href: "tel:211", alt: true }] } },
    { cats: ["food"], region: "thunderbay", regionLabel: "Thunder Bay & region", local: true, who: "Thunder Bay", title: "Regional Food Distribution Assoc.", body: "Northwestern Ontario's food network, based in Thunder Bay. Find a food bank or meal program near you.", actions: [{ label: "Find food", href: "https://www.foodbanksnorthwest.ca/" }, { label: "Call 211", href: "tel:211", alt: true }],
      fr: { who: "Thunder Bay", regionLabel: "Thunder Bay et la région", body: "Le réseau alimentaire du Nord-Ouest de l'Ontario, basé à Thunder Bay. Trouvez une banque alimentaire ou un programme de repas près de chez vous.", actions: [{ label: "Trouver de la nourriture", href: "https://www.foodbanksnorthwest.ca/" }, { label: "Appelez le 211", href: "tel:211", alt: true }] } },
    { cats: ["food"], region: "barrie", regionLabel: "Barrie", local: true, who: "Barrie", title: "Barrie Food Bank", body: "Serving Barrie and the surrounding area. Check eligibility and hours, or call 211 to confirm before you go.", actions: [{ label: "Find food", href: "https://barriefoodbank.org/" }, { label: "Call 211", href: "tel:211", alt: true }],
      fr: { who: "Barrie", body: "Au service de Barrie et des environs. Vérifiez l'admissibilité et les heures, ou appelez le 211 pour confirmer avant de vous déplacer.", actions: [{ label: "Trouver de la nourriture", href: "https://barriefoodbank.org/" }, { label: "Appelez le 211", href: "tel:211", alt: true }] } },
    { cats: ["food"], region: "guelph", regionLabel: "Guelph", local: true, who: "Guelph", title: "Guelph Food Bank", body: "Guelph's community food bank. Their site lists hours and what to bring; 211 can confirm the nearest option.", actions: [{ label: "Find food", href: "https://guelphfoodbank.ca/" }, { label: "Call 211", href: "tel:211", alt: true }],
      fr: { who: "Guelph", body: "La banque alimentaire communautaire de Guelph. Leur site indique les heures et quoi apporter; le 211 peut confirmer l'option la plus proche.", actions: [{ label: "Trouver de la nourriture", href: "https://guelphfoodbank.ca/" }, { label: "Appelez le 211", href: "tel:211", alt: true }] } },

    /* SAFE */
    { cats: ["safe"], hot: true, who: "Kids & teens · 24/7", title: "Kids Help Phone", hours: "24/7", body: "If you're young and someone at home is hurting you. Call, or text CONNECT to 686868, any time. It listens first.", actions: [{ label: "Call 1-800-668-6868", href: "tel:18006686868" }, { label: "Text 686868", href: "sms:686868?body=CONNECT", alt: true }],
      fr: { who: "Enfants et ados · 24/7", title: "Jeunesse, J'écoute", body: "Si vous êtes jeune et que quelqu'un à la maison vous fait du mal. Appelez, ou textez PARLER au 686868, à toute heure. Ici, on commence par vous écouter.", actions: [{ label: "Appelez le 1 800 668-6868", href: "tel:18006686868" }, { label: "Textez PARLER au 686868", href: "sms:686868?body=PARLER", alt: true }] } },
    { cats: ["safe"], who: "Gender-based abuse · 24/7", title: "Assaulted Women's Helpline", hours: "24/7", body: "For anyone facing abuse from a partner or family member. Free, confidential crisis support and shelter referrals, 24/7, in many languages.", actions: [{ label: "Call 1-866-863-0511", href: "tel:18668630511" }, { label: "Website", href: "https://www.awhl.org", alt: true }],
      fr: { who: "Violence fondée sur le genre · 24/7", body: "Pour toute personne qui subit de la violence d'un partenaire ou d'un membre de la famille. Soutien de crise gratuit et confidentiel et orientation vers des refuges, 24/7, en plusieurs langues.", actions: [{ label: "Appelez le 1 866 863-0511", href: "tel:18668630511" }, { label: "Site Web", href: "https://www.awhl.org", alt: true }] } },
    { cats: ["safe"], who: "Seniors · elder abuse", title: "Seniors Safety Line", hours: "24/7", body: "Free, confidential support 24/7 for older adults experiencing abuse or neglect, in many languages, with referrals to local help.", actions: [{ label: "Call 1-866-299-1011", href: "tel:18662991011" }],
      fr: { who: "Aînés · maltraitance", title: "Ligne d'assistance aux personnes âgées", body: "Soutien gratuit et confidentiel, 24/7, pour les personnes aînées qui vivent de la maltraitance ou de la négligence, en plusieurs langues, avec orientation vers de l'aide locale.", actions: [{ label: "Appelez le 1 866 299-1011", href: "tel:18662991011" }] } },
    { cats: ["safe", "all"], who: "Find shelter · 24/7", title: "Call 211 for a safe place", hours: "24/7", body: "Dial 211 to be connected to emergency shelter, youth shelters, and local safety support anywhere in Ontario. Free and confidential.", actions: [{ label: "Call 211", href: "tel:211" }, { label: "Search online", href: "https://211ontario.ca", alt: true }],
      fr: { who: "Trouver un refuge · 24/7", title: "Appelez le 211 pour un endroit sûr", body: "Composez le 211 pour être dirigé vers un hébergement d'urgence, des refuges pour jeunes et du soutien local en matière de sécurité, partout en Ontario. Gratuit et confidentiel.", actions: [{ label: "Appelez le 211", href: "tel:211" }, { label: "Chercher en ligne", href: "https://211ontario.ca/fr/", alt: true }] } },

    /* COMMUNITY */
    { cats: ["comm"], who: "All ages · all of Ontario", title: "Find your local YMCA", body: "Swimming, gyms, drop-in sports, youth nights, and adult programs. As a charity, the Y offers financial assistance so cost is rarely a barrier.", actions: [{ label: "Find a Y", href: "https://ymca.ca/en/locations" }],
      fr: { who: "Tous âges · tout l'Ontario", title: "Trouvez votre YMCA", body: "Natation, gyms, sports libres, soirées jeunesse et programmes pour adultes. Comme organisme de bienfaisance, le Y offre de l'aide financière : le coût est rarement un obstacle.", actions: [{ label: "Trouver un Y", href: "https://ymca.ca/fr/emplacements" }] } },
    { cats: ["comm", "all"], who: "Community programs · 24/7", title: "Call 211 for community & faith groups", hours: "24/7", body: "211 lists recreation centres, drop-in groups, faith and cultural communities, and free local programs in your own town.", actions: [{ label: "Call 211", href: "tel:211" }, { label: "Search online", href: "https://211ontario.ca", alt: true }],
      fr: { who: "Programmes communautaires · 24/7", title: "Le 211 : communauté et groupes de foi", body: "Le 211 répertorie les centres récréatifs, les groupes d'accueil, les communautés de foi et culturelles et les programmes locaux gratuits, dans votre propre ville.", actions: [{ label: "Appelez le 211", href: "tel:211" }, { label: "Chercher en ligne", href: "https://211ontario.ca/fr/", alt: true }] } },
    { cats: ["comm"], who: "Youth · ages 12–25", title: "Youth Wellness Hubs Ontario", body: "Free, walk-in spaces for young people with mental health support, activities, and a community to connect with. Find a hub near you.", actions: [{ label: "Find a hub", href: "https://youthhubs.ca/" }],
      fr: { who: "Jeunes · 12 à 25 ans", title: "Carrefours bien-être pour les jeunes de l'Ontario", body: "Des espaces gratuits et sans rendez-vous pour les jeunes : soutien en santé mentale, activités et une communauté où se retrouver. Trouvez un carrefour près de chez vous.", actions: [{ label: "Trouver un carrefour", href: "https://youthhubs.ca/fr/" }] } },
    { cats: ["comm"], who: "Peer recovery support", title: "Recovery groups near you", hours: "24/7", body: "Want to be around others staying sober? ConnexOntario connects you to free self-help and peer recovery groups for alcohol and drugs, 24/7.", actions: [{ label: "Call 1-866-531-2600", href: "tel:18665312600" }, { label: "Website", href: "https://connexontario.ca", alt: true }],
      fr: { who: "Soutien par les pairs en rétablissement", title: "Groupes de rétablissement près de chez vous", body: "Envie d'être entouré(e) de gens qui restent sobres? ConnexOntario vous met en contact avec des groupes d'entraide et de rétablissement gratuits pour l'alcool et la drogue, 24/7.", actions: [{ label: "Appelez le 1 866 531-2600", href: "tel:18665312600" }, { label: "Site Web", href: "https://www.connexontario.ca/fr-ca", alt: true }] } },
    { cats: ["comm"], who: "Farmers & rural Ontario · 24/7", title: "Farmer Wellness Initiative", hours: "24/7", body: "Free, confidential counselling for Ontario farmers and their families, 365 days a year, with counsellors who understand farm life.", actions: [{ label: "Call 1-866-267-6255", href: "tel:18662676255" }],
      fr: { who: "Agriculteurs et Ontario rural · 24/7", body: "Du counseling gratuit et confidentiel pour les agriculteurs de l'Ontario et leurs familles, 365 jours par année, avec des conseillers qui comprennent la vie agricole.", actions: [{ label: "Appelez le 1 866 267-6255", href: "tel:18662676255" }] } },

    /* SPORTS */
    { cats: ["play"], who: "Can't afford the fees?", title: "KidSport Ontario", body: "Grants of up to $250 a year to cover sport registration for kids 18 and under from families facing money barriers. Apply free online.", actions: [{ label: "Apply", href: "https://kidsportcanada.ca/ontario/" }],
      fr: { who: "Les frais sont trop élevés?", body: "Des subventions allant jusqu'à 250 $ par année pour couvrir l'inscription sportive des jeunes de 18 ans et moins dont la famille fait face à des obstacles financiers. Demande gratuite en ligne.", actions: [{ label: "Faire une demande", href: "https://kidsportcanada.ca/ontario/" }] } },
    { cats: ["play"], who: "Canada-wide · sport funding", title: "Canadian Tire Jumpstart", body: "Helps kids who can't afford it get into sport, covering registration, equipment, and transport. Also runs free community programs.", actions: [{ label: "Apply", href: "https://jumpstart.canadiantire.ca/" }],
      fr: { who: "Partout au Canada · financement du sport", title: "Bon départ de Canadian Tire", body: "Aide les enfants qui n'en ont pas les moyens à faire du sport : inscription, équipement et transport. Offre aussi des programmes communautaires gratuits.", actions: [{ label: "Faire une demande", href: "https://jumpstart.canadiantire.ca/fr" }] } },
    { cats: ["play"], who: "All ages · all of Ontario", title: "YMCA sports & swim", body: "Registered and drop-in sports, swim lessons, and day camps, with financial assistance available. Find your local Y.", actions: [{ label: "Find a Y", href: "https://ymca.ca/en/locations" }],
      fr: { who: "Tous âges · tout l'Ontario", title: "Sports et natation au YMCA", body: "Sports organisés et libres, cours de natation et camps de jour, avec de l'aide financière disponible. Trouvez votre Y.", actions: [{ label: "Trouver un Y", href: "https://ymca.ca/fr/emplacements" }] } },

    /* NEW & LEGAL */
    { cats: ["new"], who: "Free · government-funded", title: "Find free newcomer services", body: "The official Government of Canada finder. Free settlement workers near you help with jobs, language classes, housing, schools, health, and benefits.", actions: [{ label: "Find services", href: "https://ircc.canada.ca/english/newcomers/services/index.asp" }],
      fr: { who: "Gratuit · financé par le gouvernement", title: "Services gratuits pour nouveaux arrivants", body: "L'outil officiel du gouvernement du Canada. Des travailleurs d'établissement gratuits, près de chez vous, aident pour l'emploi, les cours de langue, le logement, l'école, la santé et les prestations.", actions: [{ label: "Trouver des services", href: "https://ircc.canada.ca/francais/nouveaux/services/index.asp" }] } },
    { cats: ["new"], who: "First stop for newcomers", title: "YMCA Newcomer Information Centre", body: "A free, welcoming first stop in Ontario. Get a personal settlement plan and clear answers on work, education, health, and life in Canada.", actions: [{ label: "Open", href: "https://newcomersincanada.ca" }],
      fr: { who: "Premier arrêt des nouveaux arrivants", body: "Un premier arrêt gratuit et accueillant en Ontario. Recevez un plan d'établissement personnalisé et des réponses claires sur le travail, les études, la santé et la vie au Canada.", actions: [{ label: "Ouvrir", href: "https://newcomersincanada.ca" }] } },
    { cats: ["new"], who: "Free legal help", title: "Legal Aid Ontario", body: "Free or low-cost legal help if you can't afford a lawyer: criminal, family, refugee and immigration, and housing. Facing domestic violence? A free 2-hour consult, no income test.", actions: [{ label: "Call 1-800-668-8258", href: "tel:18006688258" }, { label: "Website", href: "https://www.legalaid.on.ca", alt: true }],
      fr: { who: "Aide juridique gratuite", title: "Aide juridique Ontario", body: "De l'aide juridique gratuite ou à faible coût si vous ne pouvez pas payer un avocat : criminel, famille, réfugiés et immigration, logement. Vous vivez de la violence familiale? Une consultation gratuite de 2 heures, sans critère de revenu.", actions: [{ label: "Appelez le 1 800 668-8258", href: "tel:18006688258" }, { label: "Site Web", href: "https://www.legalaid.on.ca/fr/", alt: true }] } },
    { cats: ["new"], who: "Everyday legal problems", title: "Community legal clinics", body: "Local clinics give free help with the essentials: housing and eviction, ODSP and Ontario Works, employment, and human rights. Find your nearest clinic.", actions: [{ label: "Find a clinic", href: "https://www.legalaid.on.ca/legal-clinics/" }],
      fr: { who: "Problèmes juridiques du quotidien", title: "Cliniques juridiques communautaires", body: "Des cliniques locales offrent de l'aide gratuite pour l'essentiel : logement et éviction, POSPH et Ontario au travail, emploi et droits de la personne. Trouvez la clinique la plus proche.", actions: [{ label: "Trouver une clinique", href: "https://www.legalaid.on.ca/fr/cliniques-juridiques/" }] } },

    /* MONEY */
    { cats: ["money"], who: "Canada · free tool", title: "Budget Planner (FCAC)", body: "The government's free budget tool. It does the math and shows where your money goes, so you can find room to breathe. No account needed.", actions: [{ label: "Open tool", href: "https://itools-ioutils.fcac-acfc.gc.ca/BP-PB/budget-planner" }],
      fr: { who: "Canada · outil gratuit", title: "Planificateur budgétaire (ACFC)", body: "L'outil budgétaire gratuit du gouvernement. Il fait le calcul et montre où va votre argent, pour vous redonner un peu d'air. Aucun compte requis.", actions: [{ label: "Ouvrir l'outil", href: "https://itools-ioutils.fcac-acfc.gc.ca/BP-PB/outil-planificateur-budgetaire" }] } },
    { cats: ["money"], who: "Canada · know the trap", title: "The truth about payday loans", body: "Borrowing $100 can cost $14 to $17 in fees, over 300% a year, and it traps you in a cycle. Read the plain facts before you ever sign one.", actions: [{ label: "Read first", href: "https://www.canada.ca/en/financial-consumer-agency/services/loans/payday-loans.html" }],
      fr: { who: "Canada · connaître le piège", title: "La vérité sur les prêts sur salaire", body: "Emprunter 100 $ peut coûter de 14 $ à 17 $ de frais, soit plus de 300 % par année, et le cycle vous piège. Lisez les faits en langage clair avant d'en signer un.", actions: [{ label: "À lire d'abord", href: "https://www.canada.ca/fr/agence-consommation-matiere-financiere/services/prets/prets-sur-salaire.html" }] } },
    { cats: ["money"], who: "Canada · learn the basics", title: "Money basics, no jargon", body: "Free guides on banking, debt, credit, and saving from the Financial Consumer Agency of Canada. Plain language, nothing to buy.", actions: [{ label: "Learn", href: "https://www.canada.ca/en/financial-consumer-agency/services/financial-toolkit.html" }],
      fr: { who: "Canada · apprendre les bases", title: "Les bases de l'argent, sans jargon", body: "Des guides gratuits sur le compte de banque, les dettes, le crédit et l'épargne, par l'Agence de la consommation en matière financière du Canada. Langage simple, rien à acheter.", actions: [{ label: "Apprendre", href: "https://www.canada.ca/fr/agence-consommation-matiere-financiere/services/vos-outils-financiers.html" }] } },

    /* ALL */
    { cats: ["all"], hot: true, who: "All of Ontario · 24/7", title: "Call 211 Ontario", hours: "24/7", body: "Dial 2-1-1 from any phone, free, any hour. They listen and connect you to local help for whatever you're facing. Over 150 languages.", actions: [{ label: "Call 211", href: "tel:211" }, { label: "Search online", href: "https://211ontario.ca", alt: true }],
      fr: { who: "Tout l'Ontario · 24/7", title: "Appelez le 211 Ontario", body: "Composez le 2-1-1 depuis n'importe quel téléphone, gratuitement, à toute heure. On vous écoute, puis on vous met en lien avec de l'aide locale, quoi que vous traversiez. Plus de 150 langues.", actions: [{ label: "Appelez le 211", href: "tel:211" }, { label: "Chercher en ligne", href: "https://211ontario.ca/fr/", alt: true }] } }
  ];

  var TIPS = [
    { h: "Avoid high-interest debt", p: "Payday loans and “instant pay” apps are the most expensive way to borrow. Try 211 or a food bank for emergency basics first. It's free, not a loan.",
      hFr: "Évitez les dettes à intérêt élevé", pFr: "Les prêts sur salaire et les applications de « paie instantanée » sont la façon la plus chère d'emprunter. Pour les besoins de base urgents, essayez d'abord le 211 ou une banque alimentaire. C'est gratuit, pas un prêt." },
    { h: "Pay highest-interest first", p: "If you owe on more than one thing, put extra money toward the debt with the biggest interest rate. It costs you the most each month.",
      hFr: "Remboursez d'abord le taux le plus élevé", pFr: "Si vous devez de l'argent à plus d'un endroit, mettez le surplus sur la dette au taux d'intérêt le plus élevé. C'est elle qui vous coûte le plus chaque mois." },
    { h: "A tiny buffer beats a loan", p: "Even $5–10 set aside when you can means an unexpected cost doesn't force you into borrowing at high interest later.",
      hFr: "Un petit coussin vaut mieux qu'un prêt", pFr: "Même 5 à 10 $ mis de côté quand c'est possible, et un imprévu ne vous force plus à emprunter à taux élevé plus tard." },
    { h: "Prices rising? Review, don't borrow", p: "When costs go up, the FCAC's advice is to trim expenses and avoid taking on new debt, rather than covering the gap with credit.",
      hFr: "Les prix montent? Révisez, n'empruntez pas", pFr: "Quand les coûts augmentent, l'ACFC conseille de réduire les dépenses et d'éviter de nouvelles dettes, plutôt que de combler l'écart avec du crédit." }
  ];

  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function escAttr(s) { return esc(s).replace(/"/g, "&quot;"); }

  /* ---------- Live "open now" pill, computed from the visitor's clock ---------- */
  function fmtMin(m) {
    var hh = Math.floor(m / 60), mm = m % 60;
    if (state.lang === "fr") { return hh + " h" + (mm ? " " + ("0" + mm).slice(-2) : ""); }
    var ap = hh >= 12 ? "pm" : "am";
    hh = hh % 12; if (hh === 0) hh = 12;
    return hh + (mm ? ":" + ("0" + mm).slice(-2) : "") + ap;
  }
  /* Ontario services keep Ontario hours: pin the clock to Toronto, not the device. */
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

  function hoursPill(h) {
    if (!h) return "";
    if (h === "24/7") return '<span class="hrs always" title="' + escAttr(S("hrsAlwaysTitle")) + '">24/7</span>';
    var now = nowInOntario(), day = now.day, mins = now.mins;
    var openToday = h.days.indexOf(day) > -1;
    if (openToday && mins >= h.from && mins < h.to) {
      return '<span class="hrs open">' + S("hrsOpenUntil") + fmtMin(h.to) + "</span>";
    }
    var lbl = state.lang === "fr" && h.labelFr ? h.labelFr : h.label;
    var suffix = h.days.length < 7 ? " &middot; " + lbl : "";
    return '<span class="hrs closed">' + S("hrsOpens") + fmtMin(h.from) + suffix + "</span>";
  }

  /* ---------- Opening lines, for when picking up the phone is the hard part ---------- */
  var SAY = {
    en: {
      talk: ["I don't know where to start. I just need to talk to someone.",
             "I'm not doing okay, and I don't want to be alone with this right now."],
      safe: ["I don't feel safe at home. Can you help me understand my options?",
             "Someone close to me is scaring me. I don't know what to do."]
    },
    fr: {
      talk: ["Je ne sais pas par où commencer. J'ai juste besoin de parler à quelqu'un.",
             "Ça ne va pas, et je ne veux pas rester seul(e) avec ça en ce moment."],
      safe: ["Je ne me sens pas en sécurité chez moi. Pouvez-vous m'aider à comprendre mes options?",
             "Quelqu'un de proche me fait peur. Je ne sais pas quoi faire."]
    }
  };
  function sayitHTML(tab) {
    var say = SAY[state.lang];
    if (!say[tab]) return "";
    var open = state.lang === "fr" ? "&laquo;&nbsp;" : "&ldquo;", close = state.lang === "fr" ? "&nbsp;&raquo;" : "&rdquo;";
    var lines = say[tab].map(function (q) { return '<p class="line">' + open + esc(q) + close + "</p>"; }).join("");
    return '<details class="sayit"><summary>' + esc(S("saySummary")) + "</summary><div>" +
      lines + '<p class="reassure">' + esc(S("sayReassure")) + "</p></div></details>";
  }

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
    var fr = state.lang === "fr" && r.fr ? r.fr : null;
    var who = fr ? fr.who : r.who;
    var title = fr && fr.title ? fr.title : r.title;
    var body = fr ? fr.body : r.body;
    var acts = fr && fr.actions ? fr.actions : r.actions;
    var regionLabel = fr && fr.regionLabel ? fr.regionLabel : r.regionLabel;
    var color = r.hot ? "var(--coral)" : COLOR[tab];
    var icon = TABS.filter(function (t) { return t.id === tab; })[0].icon;
    var foot = "";
    if (r.local) foot += '<span class="tag local">' + S("tagLocal") + "</span>";
    else foot += '<span class="tag">' + S("tagVerified") + "</span>";
    if (city !== ALL && r.region) foot += '<span class="tag here-tag">' + STR[state.lang].tagIn(city) + "</span>";
    else if (city !== ALL && !r.region) foot += '<span class="tag here-tag">' + STR[state.lang].tagAvail(city) + "</span>";
    else if (regionLabel) foot += '<span class="tag">· ' + esc(regionLabel) + "</span>";
    acts.forEach(function (a) {
      var cls = a.alt ? "go alt" : "go";
      var arrow = a.alt ? "" : ' <span aria-hidden="true">→</span>';
      var ext = a.href.indexOf("http") === 0 ? ' target="_blank" rel="noopener noreferrer"' : "";
      foot += '<a class="' + cls + '" href="' + a.href + '"' + ext + ">" + esc(a.label) + arrow + "</a>";
    });
    var shareText = title + " · " + acts[0].label + " · " + S("shareSuffix");
    var shareBtn = '<button class="share" type="button" data-stext="' + escAttr(shareText) + '" aria-label="' + escAttr(S("shareAria")) + '" title="' + escAttr(S("shareAria")) + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg></button>';
    return '<article class="res' + (r.hot ? " hot" : "") + '" style="--cat:' + color + ';animation-delay:' + (i * 50) + 'ms">' +
      '<div class="top"><span class="dot">' + icon + '</span><span class="who">' + esc(who) + "</span>" + hoursPill(r.hours) + shareBtn + "</div>" +
      "<h3>" + esc(title) + "</h3><p>" + esc(body) + "</p>" +
      '<div class="foot">' + foot + "</div></article>";
  }

  function render() {
    var tab = TABS.filter(function (t) { return t.id === state.tab; })[0];
    var isFr = state.lang === "fr";
    var list = visibleFor(state.tab, state.city);
    var html = '<section class="panel">';
    html += '<div class="phead"><h2>' + esc(isFr ? tab.titleFr : tab.title) + '</h2><span class="note">' + esc(isFr ? tab.noteFr : tab.note) + "</span></div>";
    html += '<p class="pintro">' + INTRO[state.lang][state.tab](state.city) + "</p>";
    html += sayitHTML(state.tab);
    html += '<div class="cards">' + list.map(function (r, i) { return cardHTML(r, i, state.tab, state.city); }).join("") + "</div>";
    if (state.tab === "money") html += '<div class="tips">' + TIPS.map(function (t) { return '<div class="tip"><h4>' + esc(isFr ? t.hFr : t.h) + "</h4><p>" + esc(isFr ? t.pFr : t.p) + "</p></div>"; }).join("") + "</div>";
    html += "</section>";
    document.getElementById("panel").innerHTML = html;

    // city-aware count + hint
    var total = R.filter(function (r) { return !r.region || state.city === ALL || r.region === regionOf(state.city); }).length;
    var hint = document.getElementById("cityhint");
    if (state.city === ALL) hint.innerHTML = STR[state.lang].hintAll(total);
    else hint.innerHTML = STR[state.lang].hintCity(total, state.city);
    var locText = document.getElementById("locText");
    if (locText) locText.textContent = state.city === ALL ? "Ontario" : state.city;
  }

  function tabLabel(t) { return state.lang === "fr" ? t.labelFr : t.label; }

  function buildChrome() {
    var tl = document.getElementById("tablist");
    TABS.forEach(function (t, i) {
      var b = el("button", "tab");
      b.type = "button"; b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(i === 0));
      b.id = "tab-" + t.id;
      b.style.setProperty("--cat", COLOR[t.id]);
      b.innerHTML = '<span class="ic">' + t.icon + "</span>" + esc(tabLabel(t));
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
    CITIES.forEach(function (c) { var o = el("option"); o.value = c; o.textContent = c === ALL ? S("allCity") : c; sel.appendChild(o); });
    sel.value = state.city;
    sel.addEventListener("change", function () {
      state.city = sel.value; syncURL(); rerender();
      var card = document.querySelector(".citycard");
      if (card) { card.animate([{ boxShadow: "0 0 0 3px rgba(12,110,131,.35)" }, { boxShadow: "var(--sh-card)" }], { duration: 600, easing: "ease-out" }); }
    });
  }

  /* ---------- Language: swap every static string, keep the promise (nothing stored) ---------- */
  function applyLang() {
    var isFr = state.lang === "fr";
    document.documentElement.lang = isFr ? "fr-CA" : "en";
    document.title = S("docTitle");
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", S("metaDesc"));

    var statics = STR[state.lang].static;
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      if (statics[key] != null) nodes[i].innerHTML = statics[key];
    }

    var splash = document.getElementById("splash");
    if (splash) splash.setAttribute("aria-label", S("splashLabel"));
    var urgent = document.querySelector(".urgent");
    if (urgent) urgent.setAttribute("aria-label", S("urgentLabel"));
    var qe = document.getElementById("quickExit");
    if (qe) qe.title = S("quickExitTitle");
    var sel = document.getElementById("city");
    if (sel) {
      sel.setAttribute("aria-label", S("cityAria"));
      if (sel.options.length) sel.options[0].textContent = S("allCity");
    }
    var tabsNav = document.querySelector(".tabs");
    if (tabsNav) tabsNav.setAttribute("aria-label", S("tabsAria"));
    var brand = document.querySelector(".brand");
    if (brand) brand.setAttribute("aria-label", S("brandAria"));
    TABS.forEach(function (t) {
      var b = document.getElementById("tab-" + t.id);
      if (b) b.innerHTML = '<span class="ic">' + t.icon + "</span>" + esc(tabLabel(t));
    });
    var lb = document.getElementById("langBtn");
    if (lb) {
      lb.textContent = S("langBtnText");
      lb.setAttribute("lang", S("langBtnLang"));
      lb.setAttribute("aria-label", S("langBtnLabel"));
    }
  }

  function setLang(l) {
    if (state.lang === l) return;
    state.lang = l;
    syncURL();
    applyLang();
    rerender();
  }

  function initLangToggle() {
    var lb = document.getElementById("langBtn");
    if (!lb) return;
    lb.addEventListener("click", function () { setLang(state.lang === "en" ? "fr" : "en"); });
  }

  /* Smooth cross-fade between panels where the browser supports it; instant elsewhere. */
  function rerender() {
    var rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !rm) { document.startViewTransition(render); }
    else { render(); }
  }

  function selectTab(id, noHistory) {
    state.tab = id;
    TABS.forEach(function (t) { document.getElementById("tab-" + t.id).setAttribute("aria-selected", String(t.id === id)); });
    if (!noHistory) syncURL();
    rerender();
  }

  /* ---------- Shareable state: #[fr/]category/city in the URL, back button works ---------- */
  function citySlug(c) { return c === ALL ? "" : c.toLowerCase().replace(/[.\s]+/g, "-"); }
  function cityFromSlug(slug) {
    for (var i = 0; i < CITIES.length; i++) { if (citySlug(CITIES[i]) === slug) return CITIES[i]; }
    return ALL;
  }
  function syncURL() {
    var h = "#" + (state.lang === "fr" ? "fr/" : "") + state.tab + (state.city !== ALL ? "/" + citySlug(state.city) : "");
    if (location.hash !== h) { try { history.pushState(null, "", h); } catch (e) {} }
  }
  function applyHash() {
    var parts = location.hash.replace(/^#/, "").split("/");
    state.lang = parts[0] === "fr" ? "fr" : "en";
    if (parts[0] === "fr") parts.shift();
    var tab = parts[0], city = cityFromSlug(parts[1] || "");
    var known = TABS.some(function (t) { return t.id === tab; });
    state.tab = known ? tab : "talk";
    state.city = city;
    TABS.forEach(function (t) {
      var b = document.getElementById("tab-" + t.id);
      if (b) b.setAttribute("aria-selected", String(t.id === state.tab));
    });
    var sel = document.getElementById("city");
    if (sel) sel.value = state.city;
  }

  /* ---------- Share a resource (native sheet on mobile, copy elsewhere) ---------- */
  function initShare() {
    document.getElementById("panel").addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".share") : null;
      if (!b) return;
      e.preventDefault();
      var text = b.getAttribute("data-stext"), url = location.href;
      if (navigator.share) { navigator.share({ title: "h3lp", text: text, url: url }).catch(function () {}); }
      else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text + " " + url).then(function () {
          b.classList.add("done");
          setTimeout(function () { b.classList.remove("done"); }, 1600);
        }).catch(function () {});
      }
    });
  }

  /* ---------- Pocket card printing ---------- */
  function initPocket() {
    var btn = document.getElementById("printCard");
    if (!btn) return;
    function done() { document.body.classList.remove("print-card"); }
    btn.addEventListener("click", function () {
      document.body.classList.add("print-card");
      window.addEventListener("afterprint", done, { once: true });
      setTimeout(done, 4000);
      window.print();
    });
  }

  /* ---------- Offline: register the service worker (device-local cache only) ---------- */
  function initOffline() {
    if ("serviceWorker" in navigator) {
      try { navigator.serviceWorker.register("sw.js"); } catch (e) {}
    }
  }

  /* ---------- Quick exit: replace this page with the weather, no trace in Back ---------- */
  function initQuickExit() {
    var qe = document.getElementById("quickExit");
    if (!qe) return;
    qe.addEventListener("click", function () {
      window.location.replace("https://www.theweathernetwork.com/ca");
    });
  }

  /* Tab rail turns to glass once it sticks to the top */
  function initStuck() {
    var tabs = document.querySelector(".tabs");
    if (!tabs) return;
    window.addEventListener("scroll", function () {
      tabs.classList.toggle("stuck", tabs.getBoundingClientRect().top <= 0);
    }, { passive: true });
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
    if (location.hash) applyHash();
    applyLang();
    render();
    initSplash();
    initStuck();
    initShare();
    initQuickExit();
    initPocket();
    initOffline();
    initLangToggle();
    window.addEventListener("popstate", function () { applyHash(); applyLang(); render(); });
  });
})();
