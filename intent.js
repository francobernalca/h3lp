/* h3lp intent engine. Maps what a person types, in English or French, to the
   services and categories that can help, and flags danger so crisis lines come first.
   Pure: no DOM, no network, no storage. Everything runs on the device.
   Rule of the engine: when in doubt about danger, treat it as danger. A false alarm
   shows 988 first with a kind line; a miss could cost a life. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.H3lpIntent = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---------- Normalising: lower case, no accents, no punctuation, slang expanded ---------- */
  var SLANG = {
    u: "you", ur: "your", r: "are", ya: "you", pls: "please", plz: "please", wanna: "want to",
    gonna: "going to", gotta: "got to", ima: "i am going to", imma: "i am going to", idk: "i do not know",
    im: "i am", ive: "i have", ill: "i will", dont: "do not", doesnt: "does not", didnt: "did not",
    cant: "can not", cannot: "can not", wont: "will not", isnt: "is not", aint: "am not", hes: "he is",
    shes: "she is", theyre: "they are", whats: "what is", bf: "boyfriend", gf: "girlfriend",
    hubby: "husband", kms: "kill myself", kll: "kill", kil: "kill", kys: "kill yourself", unalive: "kill myself", unaliving: "killing myself", unalived: "killed", wnat: "want", wnt: "want", watn: "want",
    sewerslide: "suicide", sewer: "sewer", od: "overdose", odd: "odd", oded: "overdosed", odeed: "overdosed",
    selfharm: "self harm", foodbank: "food bank", nowhere: "no where", noone: "no one", nobody: "no one",
    jveux: "je veux", jsuis: "je suis", chu: "je suis", jpeux: "je peux", jpense: "je pense", jai: "j ai",
    pk: "pourquoi", tsais: "tu sais", mtn: "maintenant", stp: "s il te plait", svp: "s il vous plait"
  };

  function stripAccents(s) {
    return s.normalize ? s.normalize("NFD").replace(/[̀-ͯ]/g, "") : s;
  }

  function normalize(text) {
    var s = stripAccents(String(text == null ? "" : text).toLowerCase());
    s = s.replace(/[‘’ʼ`´]/g, "'");
    s = s.replace(/\b([a-z]+)'(t|m|s|re|ve|ll|d)\b/g, "$1$2");   /* don't -> dont, i'm -> im */
    s = s.replace(/'/g, " ");                                      /* j'ai -> j ai, l'aide -> l aide */
    s = s.replace(/[^a-z0-9]+/g, " ").trim();
    s = s.replace(/([a-z])\1{2,}/g, "$1$1");                       /* hellllp -> hellp */
    if (!s) return "";
    return s.split(" ").map(function (w) { return SLANG.hasOwnProperty(w) ? SLANG[w] : w; }).join(" ");
  }

  /* ---------- Danger. Checked first, on the raw and the spell-corrected text ---------- */
  var KIN = "(?:he|she|they|husband|wife|partner|boyfriend|girlfriend|dad|father|mom|mother|stepdad|stepmom|stepfather|stepmother|brother|sister|uncle|aunt|son|daughter|ex|someone|caregiver|parent|parents|family|roommate|pimp|boss|grandson|granddaughter)";
  var HURTS = "(?:hits|hit|hitting|beats|beat|beating|hurts|hurt|hurting|kicks|kicked|chokes|choked|choking|strangles|strangled|slaps|slapped|punches|punched|abuses|abused|abusing|threatens|threatened|threatening|rapes|raped|touches|touched|grabs|grabbed|pushes|pushed|controls|controlling|stalks|stalking|scares|scaring|forces|forced)";
  var PEOPLE = "(?:husband|wife|partner|boyfriend|girlfriend|dad|father|mom|mother|brother|sister|son|daughter|kid|kids|baby|boss|roommate|neighbour|neighbor|ex|family|teacher|friend|coworker|landlord|stepdad|stepmom)";
  var DANGER = {
    overdose: [
      /\boverdos\w*/, /\bsurdos\w*/, /\b(i|he|she|they|we|just|have|has|might have|may have) odd\b/,
      /\b(took|taken|take|swallowed|had|ate|used|did|snorted|injected|smoked) (way )?(too many|too much|a lot of|lots of|a bunch of|all (of )?(my|the|his|her)|a whole (bottle|pack) of) (pills|meds|medication|medications|tablets|drugs|fentanyl|opioids|xanax|percs|percocet|oxy|tylenol|advil|sleeping pills|heroin|dope|alcohol)\b/,
      /\b(took|swallowed) (too many|a bottle of|a whole bottle of|a handful of|the whole bottle)\b/, /\btoo many pills\b/,
      /\b(pris|avale) trop de (pilules|medicaments|comprimes|cachets|drogue)\b/, /\btrop de (pilules|medicaments|comprimes|cachets)\b/, /\b(not|is not|isnt) (breathing|waking up)\b/, /\b(respire|reveille) (plus|pas)\b/
    ],
    abuse: [
      new RegExp("\\b" + KIN + "\\b(?: \\w+){0,3} " + HURTS + " (me|us|my \\w+|mom|mother|sister|brother|kids|children)\\b"),
      new RegExp("\\b" + HURTS + " me\\b"),
      /\b(being|been|getting|get|got|was|am|i am) (abused|hit|beaten|hurt|threatened|stalked|raped|assaulted|trafficked|choked|strangled|molested|groomed)\b/,
      new RegExp("\\b" + KIN + " (will|is going to|going to|said (he|she|they) would|threatened to|wants to|tried to|might) (kill|hurt) me\\b"),
      /\b(wants|tried|going|threatened) to kill me\b/,
      /\bnot safe\b(?! to (eat|drink|use|take|drive))/, /\b(feel|feeling|am|i am) unsafe\b/, /\bunsafe at home\b/,
      /\b(do not|never|dont) feel safe\b/,
      /\b(scared|afraid|terrified|frightened) (of|for) (my life|him|her|them|my (husband|wife|partner|boyfriend|girlfriend|dad|father|mom|mother|ex|family|parents))\b/,
      /\b(scared|afraid|terrified) to go home\b/,
      /\b(domestic|family|intimate partner|partner|dating) (violence|abuse)\b/, /\babus(e|ed|ive|ing)\b/,
      /\brape(d)?\b/, /\bsexual(ly)? (assault|assaulted|abuse|abused|harassed)\b/, /\bassaulted\b/, /\bassault(ed)? me\b/,
      /\btraffick\w*/, /\bmolest\w*/, /\bgroom(ed|ing) me\b/,
      /\b(me|m) (frappe|frappent|bat|battent|fait mal|font mal|menace|menacent|viole|violente|touche|controle|suit|fait peur|font peur|etrangle|pousse|insulte|enferme)\b/,
      /\b(pas|plus|jamais) en securite\b/, /\b(pas|plus) securitaire\b/,
      /\bviolence (conjugale|familiale|sexuelle|domestique|physique)\b/, /\bagress\w*/, /\bviol(ee|e)?\b/,
      /\bmaltrait\w*/, /\babus\w*/, /\bpeur (de|pour) (lui|elle|eux|ma vie|mon (mari|conjoint|chum|copain|pere|ex)|ma (femme|conjointe|blonde|copine|mere))\b/,
      /\bpeur de rentrer\b/, /\b(va|veut|menace de) me tuer\b/
    ],
    others: [
      new RegExp("\\b(want|going|planning|plan|thinking|urge|feel like|about|might|will|ready) (to )?(kill|hurt|harm|stab|shoot|beat up|murder) (him|her|them|someone|somebody|people|everyone|my " + PEOPLE + ")\\b"),
      new RegExp("\\b(i will|i am going to|i might|i could) (kill|hurt|harm|murder) (him|her|them|someone|somebody|people|my " + PEOPLE + ")\\b"),
      /\bhomicid\w*/, /\b(vais|veux|envie de|pourrais) (le |la |les )?(tuer|frapper|blesser)( quelqu un)?\b/,
      /\btuer quelqu un\b/
    ],
    self: [
      /kill ?my ?self/, /wan(t|na) ?to ?die(?!t)/, /\bwant\b(?: \w+){0,4} die\b/, /\bi \w+ (to|too) die\b/,
      /\bje me (fais|suis fait|suis faite) (du )?mal\b/, /\bje me (blesse|coupe|mutile|scarifie)\b/,
      /\bsuicid\w*/, /\bsucid\w*/, /\bsuisid\w*/, /\bsuicd\w*/, /\bsuic\b/,
      /\bkill(ing|ed)? (my ?self|me ?self|meself)\b/, /\bkil (my ?self|me)\b/,
      /\b(hurt|hurting|harm|harming|cut|cutting|burn|burning|starve|starving|punish|punishing) (my ?self)\b/,
      /\bself (harm\w*|injur\w*|hurt\w*)\b/,
      /\b(want|wanted|wanting|wish|going|ready|plan|planning|deserve|need|like) (to )?(die|be dead|disappear forever|not exist|not be here|not wake up|end it)\b/,
      /\b(i|i should|i could|i might|i will|let me|hope i|i hope i|i just want to|just want to) (die|be dead)\b/,
      /\b(better off|rather be|should be|wish i was|wish i were) dead\b/, /\bbetter off without me\b/,
      /\b(no|zero|not any|nothing) (reason|point|reasons) (to|in|for) (live|living|life|go on|going on|being alive|keep going|stay)\b/,
      /\b(do not|never|no longer|dont) (want|wanna) to (live|be alive|be here|exist|wake up|go on|keep going|keep living)\b/,
      /\b(can not|can t|could not|unable to) (go on|do this anymore|do this any more|take (it|this) (anymore|any more)|keep going|live like this|keep living|cope)\b/,
      /\b(end|ending) (it all|my life|everything|myself|my own life)\b/, /\bending it\b/, /\btake my (own )?life\b/,
      /\b(not|isnt|is not) worth (living|it anymore)\b/, /\blife is (not|no longer) worth\b/,
      /\b(give|giving|gave) up on (life|living|everything)\b/, /\btired of (living|life|being alive|existing)\b/,
      /\bno way out\b/, /\bhate my life\b/, /\bhate being alive\b/, /\bwant (it|this|everything) to (end|stop|be over)\b/,
      /\bwant to disappear\b/, /\b(jump|jumping) (off|from|in front of)\b/, /\bhang(ing)? my ?self\b/,
      /\bwrote a (note|goodbye)\b/, /\bsaying goodbye to everyone\b/, /\bgoodbye forever\b/,
      /\b(veux|voudrais|veut|vais|envie de|pense a|penser a|pret a|prete a|aimerais) (mourir|crever|disparaitre|en finir|me tuer|me suicider|plus vivre|plus etre la)\b/,
      /\b(me|m) (tuer|suicider|faire du mal|blesser|mutiler|pendre|jeter|scarifier|couper)\b/,
      /\ben finir\b/, /\bje veux (plus|pas) vivre\b/, /\b(plus|pas) envie de vivre\b/, /\bmettre fin a (mes jours|ma vie)\b/,
      /\b(finir|en finir) avec (la vie|tout|ma vie)\b/, /\bj en peux plus\b/, /\bje n en peux plus\b/,
      /\bautomutil\w*/, /\bscarif\w*/, /\bmourir\b/, /\bpas de raison de vivre\b/, /\bmieux sans moi\b/,
      /\bmieux mort(e)?\b/, /\b(aucune|plus de) raison de vivre\b/
    ],
    someone: [
      /\b(him|her|them)self\b/, /\bthemselves\b/,
      /\b(my|a|our) (friend|son|daughter|kid|child|brother|sister|mom|mother|dad|father|partner|husband|wife|boyfriend|girlfriend|student|coworker|cousin|roommate|grandson|granddaughter|grandma|grandpa|parent|client|teen|neighbour|neighbor)\b.{0,40}\b(suicid\w*|wants to die|want to die|kill (him|her|them)self|hurt(ing)? (him|her|them)self|self harm\w*|cutting|end (it|his life|her life|their life)|ending it|not want to live|no reason to live|talking about dying|talking about death)\b/,
      /\b(worried|scared|afraid|concerned) (about|for) (my|a|our|someone|somebody|him|her|them)\b.{0,40}\b(suicid\w*|die|dying|dead|kill|hurt|harm|end it|overdos\w*)\b/,
      /\b(il|elle|ils|elles) (veut|veulent|va|vont|pense|parle de) (mourir|se tuer|se suicider|en finir|se faire du mal)\b/,
      /\bse (tuer|suicider|faire du mal|blesser|mutiler)\b/
    ]
  };

  /* ---------- Situations. Each maps words to services (in order) and categories ---------- */
  var TOPICS = [
    { id: "lonely", tabs: ["talk", "comm"], ids: ["dco", "211comm", "hubs"], w: 2,
      re: /\b(lonely|lonley|alone|by myself|no friends|isolated|isolation|no one to talk|no one cares|seule?|isolee?|solitude|personne a qui parler|personne m aime)\b/ },
    { id: "feelings", tabs: ["talk"], ids: ["988", "dco", "connex", "811"], w: 2,
      re: /\b(sad|sadness|depress\w*|anxi\w*|panic\w*|stress\w*|overwhelm\w*|cry|crying|cried|mental health|burn ?out|burned out|burnt out|grief|grieving|griev\w*|lost my (mom|mother|dad|father|wife|husband|son|daughter|friend|baby|partner|brother|sister)|passed away|died|death|funeral|hopeless|empty inside|numb|nightmares?|trauma\w*|ptsd|not okay|not ok|not doing (well|good|okay|ok)|struggling|losing my mind|so tired|exhausted|can not sleep|insomnia|fatigue|fatiguee?|epuisee?|je dors pas|je ne dors pas|breakdown|melt ?down|triste\w*|tristesse|deprim\w*|depression|angoiss\w*|anxi\w*|panique|stresse?e?|pleure\w*|deuil|sante mentale|epuise\w*|desespere?e?|deces|decede\w*|funerailles|ca va pas|ca ne va pas|pas bien|mal dans ma peau)\b/ },
    { id: "talk", tabs: ["talk"], ids: ["988", "dco", "connex", "khp"], w: 1,
      re: /\b(talk|talking|someone to talk|need to talk|vent|listen|listener|counsel\w*|therap\w*|support line|helpline|hotline|crisis line|parler|jaser|ecoute|ecouter|quelqu un|ligne d aide|ligne d ecoute)\b/ },
    { id: "addiction", tabs: ["talk", "comm"], ids: ["connex", "recovery", "811"], w: 3,
      re: /\b(substances?|substance use|recovery|recovering|retablissement|drugs?|drinking|drink too much|alcohol\w*|drunk|addict\w*|gambl\w*|betting|casino|sober|sobriety|relapse\w*|withdraw\w*|detox|rehab|opioids?|fentanyl|meth|crack|cocaine|heroin|weed|cannabis|high all the time|using again|aa meeting|na meeting|drogues?|alcool\w*|dependan\w*|jeux d argent|sobre|sobriete|rechute|desintox\w*|consommation)\b/ },
    { id: "eating", tabs: ["talk"], ids: ["811", "khp", "dco"], w: 3,
      re: /\b(eating disorder|anorexi\w*|bulimi\w*|binge\w*|purging|trouble alimentaire|troubles alimentaires)\b/ },
    { id: "health", tabs: ["talk"], ids: ["811"], w: 2,
      re: /\b(nurse|sick|fever|medication|medicine|prescription|symptoms?|in pain|chronic pain|injur\w*|health|doctor|pregnan\w*|infirmier\w*|infirmiere|malade|medicament\w*|sante|docteur|medecin|enceinte|douleurs?|blessure|health ?811|telehealth|sante ?811|hospital|hopital|emergency room)\b/ },
    { id: "youth", tabs: ["talk"], ids: ["khp"], w: 2,
      re: /\b(kids?|child|children|teens?|teenager|youth|young person|young people|school|high school|bull(y|ied|ying)|parents|my mom|my dad|i am 1[0-9]|years old|jeunes?|ados?|adolescent\w*|enfants?|ecole|intimid\w*|secondaire|kids help phone|jeunesse j ecoute)\b/ },
    { id: "student", tabs: ["talk"], ids: ["good2talk"], w: 3,
      re: /\b(college|university|uni|campus|students?|exams?|midterms?|finals|dorm|residence|etudiant\w*|universite|cegep|good ?2 ?talk|allo j ecoute)\b/ },
    { id: "indigenous", tabs: ["talk"], ids: ["hope", "mno"], w: 4,
      re: /\b(indigenous|first nations?|inuit|inuk|metis|native|aboriginal|on reserve|autochtones?|premieres nations|anishinaabe|ojibw\w*|cree|mohawk|haudenosaunee|oji cree)\b/ },
    { id: "black", tabs: ["talk"], ids: ["byh"], w: 4,
      re: /\b(black|african|caribbean|noire?s?|afro\w*|racism|racist|racisme|raciste)\b/ },
    { id: "lgbtq", tabs: ["talk"], ids: ["youthline"], w: 4,
      re: /\b(gay|lesbian|bi|bisexual|trans|transgender|queer|nonbinary|non binary|lgbt\w*|2slgbt\w*|coming out|came out|homophob\w*|transphob\w*|gai|lesbienne|transgenre|bisexuel\w*|non binaire)\b/ },
    { id: "muslim", tabs: ["talk"], ids: ["naseeha"], w: 4,
      re: /\b(muslim|islam\w*|mosque|imam|musulman\w*|mosquee|naseeha)\b/ },
    { id: "spanish", tabs: ["talk", "new"], ids: ["cssp"], w: 4,
      re: /\b(spanish|espanol|hispan\w*|latin[oax]|latine|ayuda|necesito|comida|hablo|ayudame|mujer|violencia)\b/ },
    { id: "senior", tabs: ["safe", "talk"], ids: ["ssl", "811"], w: 3,
      re: /\b(senior|seniors|elder|elderly|older adult|older person|grandma|grandpa|grandmother|grandfather|grandson|granddaughter|grandchildren|grandkids|retired|pension|aine|aines|aine?e?s?|personnes? agee?s?|grand mere|grand pere|petit fils|petite fille|petits enfants|retraite)\b/ },
    { id: "farmer", tabs: ["comm"], ids: ["farmer"], w: 4,
      re: /\b(farm|farmer|farmers|farming|rural|crops?|livestock|agricultur\w*|ferme|fermier\w*|agricult\w*|rurale?)\b/ },
    { id: "food", tabs: ["food"], ids: ["211food", "feedon"], w: 3,
      re: /\b(food|hungry|hunger|starving|starve|eat|eating|meal|meals|groceries|grocery|food bank|nothing to eat|no food|lunch|dinner|breakfast|baby formula|formula for my baby|diapers|faim|manger|nourriture|repas|banque alimentaire|banques alimentaires|epicerie|affame\w*|meurs de faim|bouffe|daily bread|foodbank|banquealimentaire)\b/ },
    { id: "shelter", tabs: ["safe"], ids: ["211safe", "211"], w: 4,
      re: /\b(homeless\w*|shelter|shelters|no where to (sleep|go|stay|live)|place to (sleep|stay)|sleep tonight|sleeping (outside|rough|in my car|on the street)|sleep (outside|in my car|on the street)|kicked out|kicked me out|threw me out|on the street|couch surfing|no home|lost my (home|apartment|place|housing)|sans abri|itineran\w*|refuges?|hebergement|dormir (dehors|ce soir|dans mon auto|dans ma voiture)|nulle part (ou|pour) dormir|a la rue|mis a la porte|pas de logis|maison d hebergement)\b/ },
    { id: "housing", tabs: ["new", "money"], ids: ["clinics", "211", "legalaid"], w: 3,
      re: /\b(evict\w*|landlord|rent|rental|tenant|lease|ltb|landlord and tenant|repairs|mold|mould|loyer|locataire|proprietaire|bail|expuls\w*|eviction|logement)\b/ },
    { id: "community", tabs: ["comm"], ids: ["211comm", "ymca", "hubs"], w: 2,
      re: /\b(friends|belong|belonging|community|group|groups|club|clubs|meet people|make friends|volunteer\w*|church|faith|temple|synagogue|gurdwara|activit\w*|bored|boredom|something to do|communaute|groupes?|benevol\w*|eglise|foi|amis|amies|m ennuie|ennui|rencontrer des gens|loisirs)\b/ },
    { id: "sport", tabs: ["play"], ids: ["kidsport", "jumpstart", "ymcasport"], w: 3,
      re: /\b(sports?|hockey|soccer|football|basketball|baseball|volleyball|swim\w*|skating|dance|dancing|gym|team|camps?|registration|register|equipment|gear|skates|athlet\w*|natation|patin\w*|equipe|inscription|equipement|kidsport|jumpstart|bon depart)\b/ },
    { id: "newcomer", tabs: ["new"], ids: ["ircc", "nic", "legalaid"], w: 3,
      re: /\b(newcomers?|new to canada|new in canada|immigra\w*|refugees?|asylum|claimant|visa|work permit|study permit|permanent resident|pr card|citizenship|settle\w*|just moved to|moved to canada|arrived in canada|english class\w*|french class\w*|esl|lincs?|ircc|nouvel arrivant|nouvelle arrivante|nouveaux arrivants|nouveau au canada|nouvelle au canada|immigr\w*|refugi\w*|demandeur d asile|demande d asile|permis de travail|permis d etudes|residence permanente|resident permanent|citoyennete|cours d anglais|cours de francais|etablissement)\b/ },
    { id: "legal", tabs: ["new"], ids: ["legalaid", "clinics"], w: 3,
      re: /\b(lawyer\w*|legal|law|court|charged with|criminal charges?|arrest\w*|custody|divorce|separation|separated|sued|lawsuit|rights|human rights|fired|wrongful\w*|tribunal|odsp|ontario works|welfare|employment insurance|discriminat\w*|avocat\w*|juridique|droits|accuse|garde des enfants|aide sociale|posph|ontario au travail|congedie\w*|renvoye\w*|legal aid|aide juridique)\b/ },
    { id: "money", tabs: ["money"], ids: ["budget", "basics", "payday", "211"], w: 2,
      re: /\b(money|debts?|bills?|budget\w*|broke|loans?|payday|credit|credit card|bank|savings?|save money|afford|can not afford|pay (my )?(rent|bills)|overdue|collections?|bankrupt\w*|tax|taxes|tax clinic|cost of living|lost my job|laid off|unemployed|no job|need a job|argent|chomage|perdu mon emploi|dettes?|factures?|fauche\w*|prets?|pret sur salaire|banque|epargne|impots?|payer|cout de la vie|fin du mois|arrive pas)\b/ },
    { id: "payday", tabs: ["money"], ids: ["payday", "budget"], w: 4,
      re: /\b(payday loans?|cash advance|instant pay|pret sur salaire|prets sur salaire|avance de fonds)\b/ },
    { id: "worried", tabs: ["talk"], ids: ["988", "khp", "211"], w: 3,
      re: /\b(worried|concerned|scared|afraid) (about|for) (my|a|our|someone|somebody|him|her|them)\b|\b(inquiet|inquiete|m inquiete|peur) pour\b|\bhow (can i|do i|to) help (him|her|them|my|a friend|someone)\b|\bcomment aider\b/ },
    { id: "unsure", tabs: ["all"], ids: ["211", "811"], w: 1,
      re: /\b(not sure|i do not know|no idea|help|help me|everything|anything|lost|confused|where to start|where do i start|what do i do|je sais pas|je ne sais pas|aide|aidez moi|aide moi|perdu|perdue|par ou commencer|quoi faire|dental|dentist|dentaire|glasses|lunettes)\b/ },
    { id: "emergency", tabs: [], ids: ["911"], w: 5,
      re: /\b(911|emergency|ambulance|urgence|pompiers?)\b/ },
    { id: "n988", tabs: ["talk"], ids: ["988"], w: 5, re: /\b(988|9 8 8)\b/ },
    { id: "n211", tabs: ["all"], ids: ["211"], w: 5, re: /\b(211|2 1 1)\b/ },
    { id: "n811", tabs: ["talk"], ids: ["811"], w: 5, re: /\b(811)\b/ },
    { id: "connex", tabs: ["talk"], ids: ["connex"], w: 5, re: /\b(connex ?ontario|connex)\b/ },
    { id: "texting", tabs: ["talk"], ids: ["khp", "youthline", "988"], w: 1, re: /\b(text|texting|chat|online chat|texto|clavardage|clavarder)\b/ }
  ];

  /* Words worth correcting a typo towards. Short words (under 4 letters) are never
     corrected, so "die" or "od" only ever match when typed exactly. */
  var STOP = ("about after again also back been before being came come could diet does down each even feel from "
    + "give good have here home into just keep know last left life like long look made make many more most much "
    + "must need never next only other over said same see some still such take than that them then there these "
    + "they thing think this those time told very want well went were what when where which while will with "
    + "work would year your dans avec pour sans tout tous elle elles mais plus pour sont etre avoir fait faire "
    + "rien tres bien chez cette cela comme peux veux suis tu nous vous leur").split(" ");
  var VOCAB = {};
  (function buildVocab() {
    var extra = ("suicide suicidal myself overdose overdosed hungry starving shelter homeless depressed depression anxiety "
      + "anxious lonely abuse abused abusive boyfriend girlfriend husband partner landlord evicted eviction immigrant "
      + "immigration refugee newcomer lawyer money budget debt payday sports hockey soccer registration student "
      + "university college indigenous muslim spanish senior farmer alcohol drinking drugs gambling addiction "
      + "addicted sober relapse mental health nurse pregnant medication threatening threatened hitting beating "
      + "hurting scared afraid terrified worried friend daughter mother father sister brother nothing groceries "
      + "sleeping tonight emergency ambulance disappear anymore living alive kill killing harm cutting dead die "
      + "mourir suicider tuer frappe securite violence conjugale faim manger nourriture logement loyer expulsion "
      + "refugie avocat juridique argent dettes seule deprime anxieux angoisse alcool drogue dependance enfant "
      + "etudiant autochtone musulman fermier inquiet inquiete personne parler aide hebergement refuge").split(" ");
    var add = function (w) { if (w.length >= 5 && STOP.indexOf(w) === -1) VOCAB[w] = true; };
    extra.forEach(add);
    function harvest(re) {
      re.source.replace(/\\[bwsd]\*?|\(\?[:!=]|[^a-z]+/g, " ").split(" ").forEach(function (w) { if (w) add(w); });
    }
    Object.keys(DANGER).forEach(function (k) { DANGER[k].forEach(harvest); });
    TOPICS.forEach(function (t) { harvest(t.re); });
  })();
  ["food", "rent", "debt", "meal", "sick", "drug", "loan", "cash", "visa", "bank"].forEach(function (w) { VOCAB[w] = true; });
  var VOCAB_LIST = Object.keys(VOCAB);

  /* Damerau-Levenshtein (optimal string alignment), stopping early past max. */
  function distance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev2 = null, prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      var best = i;
      for (j = 1; j <= b.length; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
        cur[j] = v; if (v < best) best = v;
      }
      if (best > max) return max + 1;
      prev2 = prev; prev = cur;
    }
    return prev[b.length];
  }

  function correctWord(w) {
    if (w.length < 4 || VOCAB[w] || STOP.indexOf(w) > -1 || /\d/.test(w)) return w;
    var max = w.length <= 5 ? 1 : 2, best = w, bestD = max + 1;
    if (w.length === 4) max = 1;
    for (var i = 0; i < VOCAB_LIST.length; i++) {
      var v = VOCAB_LIST[i];
      if (v[0] !== w[0] && !(v[1] === w[0] && v[0] === w[1])) continue;   /* typos rarely hit the first letter */
      var d = distance(w, v, max);
      if (d < bestD || (d === bestD && d <= max && v.length > best.length)) { bestD = d; best = v; }
    }
    return bestD <= max ? best : w;
  }

  function correct(norm) {
    if (!norm) return "";
    return norm.split(" ").map(correctWord).join(" ");
  }

  function anyMatch(list, texts) {
    for (var i = 0; i < list.length; i++) for (var j = 0; j < texts.length; j++) if (list[i].test(texts[j])) return true;
    return false;
  }

  var PINS = {
    overdose: ["911", "988", "connex"],
    others: ["911", "988"],
    abuse: ["911", "awhl", "khpsafe", "211safe"],
    someone: ["988", "911", "khp"],
    self: ["988", "911"]
  };

  /* match(text) -> { crisis: false | "self" | "overdose" | "abuse" | "others" | "someone",
                      ids: [entry ids, best first], tabs: [category ids], topics: [...], empty } */
  function match(text) {
    var norm = normalize(text);
    var out = { query: norm, crisis: false, ids: [], tabs: [], topics: [], empty: !norm };
    if (!norm) return out;
    var fixed = correct(norm);
    var texts = fixed === norm ? [norm] : [norm, fixed];
    /* "substance abuse" is about drugs, not about someone hurting you */
    var calm = texts.map(function (t) {
      return t.replace(/\b(substance|substances|drug|drugs|alcohol|solvent|opioid|prescription) abus\w*/g, "$1 use")
        .replace(/\b(hit|hits|hitting) me up\b/g, "contact me").replace(/\b(beat|beats) me (at|in|to|by)\b/g, "won over me $2")
        .replace(/\babus (de|d) (substances|alcool|drogues?|medicaments)\b/g, "consommation");
    });
    /* the squashed form catches "kill my self" typed as one word, or "su icide" */
    var squashed = texts.concat([norm.replace(/ /g, "")]);
    var topicTexts = texts.map(function (t) {
      return t.replace(/\bfood banks?\b/g, "foodbank").replace(/\bbanques? alimentaires?\b/g, "banquealimentaire");
    });

    var self = anyMatch(DANGER.self, squashed);
    var od = anyMatch(DANGER.overdose, squashed);
    var abuse = anyMatch(DANGER.abuse, calm);
    var others = anyMatch(DANGER.others, texts);
    var someone = anyMatch(DANGER.someone, texts);
    if (od) out.crisis = "overdose";
    else if (others) out.crisis = "others";
    else if (someone && (self || /\b(suicid|kill|die|dying|death|dead|hurt|harm|cutting|mourir|tuer|blesser)/.test(fixed))) out.crisis = "someone";
    else if (abuse) out.crisis = "abuse";
    else if (self) out.crisis = "self";

    var scored = [];
    TOPICS.forEach(function (t, order) {
      for (var j = 0; j < topicTexts.length; j++) {
        if (t.re.test(topicTexts[j])) { scored.push({ t: t, s: t.w, o: order }); break; }
      }
    });
    scored.sort(function (a, b) { return b.s - a.s || a.o - b.o; });

    var ids = [], tabs = [];
    function addId(id) { if (ids.indexOf(id) === -1) ids.push(id); }
    function addTab(id) { if (id && tabs.indexOf(id) === -1) tabs.push(id); }
    var topicIds = scored.map(function (x) { return x.t.id; });
    var youth = topicIds.indexOf("youth") > -1, senior = topicIds.indexOf("senior") > -1;

    if (out.crisis) {
      var pins = PINS[out.crisis].slice();
      if (out.crisis === "abuse") {
        if (youth) pins = ["911", "khpsafe", "awhl", "211safe"];
        if (senior) pins = ["911", "ssl", "awhl", "211safe"];
        addTab("safe");
      } else if (out.crisis === "self" && youth) pins = ["988", "khp", "911"];
      pins.forEach(addId);
      if (out.crisis !== "abuse") addTab("talk");
    }
    scored.forEach(function (x) {
      /* during abuse, the food or shelter words still count, but never push a crisis pin down */
      x.t.ids.forEach(addId);
      x.t.tabs.forEach(addTab);
    });
    out.ids = ids;
    out.tabs = tabs;
    out.topics = topicIds;
    out.supporter = out.crisis === "someone" || topicIds.indexOf("worried") > -1;
    out.empty = !ids.length;
    return out;
  }

  return { match: match, normalize: normalize, correct: correct, distance: distance };
});
