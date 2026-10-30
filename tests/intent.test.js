/* Run with: node --test tests/
   The rule these tests guard: a phrase that signals danger must never be missed,
   and everyday questions must never get crisis framing. */
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const I = require("../intent.js");
const D = require("../data.js");

const known = new Set(D.R.map((r) => r.id));

/* ---------- Danger to self: 988 must lead (911 may share the top two) ---------- */
const SELF = [
  "I want to die", "i want to kill myself", "I'm thinking about suicide", "suicide", "suicidal",
  "I feel suicidal tonight", "i wanna die", "want to end my life", "I want to end it all",
  "thinking of ending it", "I don't want to live anymore", "i dont want to be here anymore",
  "I don't want to wake up tomorrow", "everyone would be better off without me", "I'd be better off dead",
  "there's no reason to live", "no point in living", "I can't go on", "i cant do this anymore",
  "I can't take it anymore", "life is not worth living", "I'm tired of living", "I hate my life",
  "i want to disappear", "no way out", "I keep hurting myself", "self harm", "I've been cutting myself",
  "kms", "i want to kms", "unalive myself", "sewerslide", "want to unalive",
  /* typos and run-togethers */
  "suicde", "sucide", "suiside thoughts", "sucidal", "i want to dye... i mean die", "kil myself", "kill my self",
  "killmyself", "I WANT TO DIE", "  i    want   to   die  ", "i wnat to die", "i want too die",
  "i want to die \u{1F622}", "pls help i want to die", "food bank hours and also i want to die",
  /* French */
  "je veux mourir", "Je veux me suicider", "j'ai envie de mourir", "je pense au suicide", "je veux me tuer",
  "je veux en finir", "je veux plus vivre", "je ne veux plus vivre", "pas envie de vivre",
  "mettre fin à mes jours", "j'en peux plus", "je me fais du mal", "automutilation", "suicidaire",
  "ils seraient mieux sans moi", "aucune raison de vivre", "jveux mourir",
  /* found missing in the 2026-10-15 review */
  "i just want it all to end", "I'm done with life", "what's the point of living", "nobody would miss me",
  "I feel like dying", "i'm going to jump", "tonight is the night i end it", "i will end it", "I should end it",
  "time to end it", "kys", "je me suis coupée", "j'ai des idées noires", "personne ne me manquerait"
];

const OVERDOSE = [
  "I took too many pills", "my friend overdosed", "overdose", "i think i od'd", "he took a whole bottle of pills",
  "she's not breathing", "took too much fentanyl", "surdose", "j'ai pris trop de pilules", "my son overdosed on fentanyl"
];

const ABUSE = [
  "he hits me", "my husband hits me", "my boyfriend is hurting me", "she hurts me", "my dad beats me",
  "my partner threatened to kill me", "I'm not safe at home", "i am not safe", "not safe", "I don't feel safe at home",
  "I'm scared of my husband", "afraid to go home", "domestic violence", "I'm being abused", "my stepdad touched me",
  "I was raped", "sexual assault", "he choked me", "my ex is stalking me", "my dad hits my mom",
  "my boyfriend controls my money and hits me", "my grandson takes my money and hurts me", "being trafficked",
  "il me frappe", "mon mari me frappe", "je ne suis pas en sécurité chez moi", "violence conjugale",
  "j'ai peur de mon chum", "il menace de me tuer", "elle me fait mal", "j'ai été agressée", "maltraitance",
  "I'm 14 and my mom hits me",
  /* found missing in the 2026-10-15 review ("danger" was being corrected to "dinner") */
  "I'm in danger", "I M IN DANGER", "im in dangr", "je suis en danger", "someone is following me",
  "i was attacked", "I got jumped",
  /* found missing in the 2026-10-29 audit */
  "i have a stalker", "my ex is a stalker"
];

const OTHERS = [
  "I want to kill him", "i'm going to hurt someone", "i feel like i might hurt my kids", "I want to kill my boss",
  "je vais le tuer", "j'ai envie de tuer quelqu'un"
];

const SOMEONE = [
  "my friend wants to kill himself", "my daughter is suicidal", "my son talks about suicide",
  "worried my brother will hurt himself", "my girlfriend is cutting herself", "I'm worried about my mom, she said she wants to die",
  "mon ami veut se suicider", "ma fille parle de mourir, elle veut se tuer"
];

/* ---------- Everyday needs: no crisis framing, right category and services ---------- */
const NEEDS = [
  ["food bank hours", "food", "211food"], ["I'm hungry", "food", "211food"], ["no food today", "food", "211food"],
  ["need groceries", "food", "feedon"], ["where can i get a free meal", "food"], ["I can't afford food", "food"],
  ["baby formula", "food"], ["daily bread food bank", "food"], ["j'ai faim", "food"], ["banque alimentaire", "food"],
  ["pas de nourriture aujourd'hui", "food"], ["je meurs de faim", "food"], ["hungy", "food"], ["fodo bank", "food"],
  ["nowhere to sleep tonight", "safe", "211safe"], ["I'm homeless", "safe", "211safe"], ["need a shelter", "safe", "211safe"],
  ["kicked out of my house", "safe", "211safe"], ["sleeping in my car", "safe"], ["sans abri", "safe"],
  ["nulle part où dormir ce soir", "safe"], ["shleter tonight", "safe"],
  ["I need to talk to someone", "talk"], ["j'ai besoin de parler à quelqu'un", "talk"], ["I feel so lonely", "talk"],
  ["I'm depressed", "talk"], ["anxiety attacks", "talk"], ["panic attack", "talk"], ["my mom died", "talk"],
  ["grieving", "talk"], ["je me sens seule", "talk"], ["je suis déprimé", "talk"], ["stressed out about exams", "talk", "good2talk"],
  ["college student feeling overwhelmed", "talk", "good2talk"], ["I'm gay and scared to come out", "talk", "youthline"],
  ["trans youth support", "talk", "youthline"], ["indigenous counselling", "talk", "hope"], ["first nations crisis line", "talk", "hope"],
  ["métis support", "talk", "mno"], ["black youth", "talk", "byh"], ["muslim counselling", "talk", "naseeha"],
  ["ayuda en español", "talk", "cssp"], ["I'm 15 and being bullied", "talk", "khp"], ["kids help phone", "talk", "khp"],
  ["jeunesse j'écoute", "talk", "khp"], ["I drink too much", "talk", "connex"], ["drug addiction", "talk", "connex"],
  ["gambling problem", "talk", "connex"], ["I relapsed", "talk", "connex"], ["staying sober", "talk", "recovery"],
  ["alcool", "talk", "connex"], ["substance abuse help", "talk", "connex"], ["need a nurse", "talk", "811"],
  ["my baby has a fever", "talk", "811"], ["question about my medication", "talk", "811"], ["infirmière", "talk", "811"],
  ["eating disorder", "talk", "811"], ["farm stress", "comm", "farmer"], ["I'm a farmer and struggling", "comm", "farmer"],
  ["want to make friends", "comm", "211comm"], ["volunteer", "comm"], ["recovery groups", "comm", "recovery"],
  ["hockey for my son", "play", "kidsport"], ["can't afford soccer registration", "play", "kidsport"],
  ["swimming lessons", "play", "ymcasport"], ["sports pour mon enfant", "play"], ["jumpstart", "play", "jumpstart"],
  ["new to canada", "new", "ircc"], ["I'm a refugee", "new"], ["work permit help", "new", "ircc"],
  ["nouvel arrivant", "new", "ircc"], ["immigration lawyer", "new", "legalaid"], ["I need a lawyer", "new", "legalaid"],
  ["legal aid", "new", "legalaid"], ["aide juridique", "new", "legalaid"], ["my landlord is evicting me", "new", "clinics"],
  ["eviction notice", "new", "clinics"], ["ODSP problem", "new", "clinics"], ["avocat gratuit", "new", "legalaid"],
  ["money trouble", "money", "budget"], ["I'm broke", "money"], ["payday loan", "money", "payday"],
  ["credit card debt", "money", "basics"], ["help with my budget", "money", "budget"], ["can't pay rent", "money"],
  ["problèmes d'argent", "money"], ["dettes", "money"], ["prêt sur salaire", "money", "payday"],
  ["lost my job", "money"], ["I don't know what I need", "all", "211"], ["not sure", "all", "211"],
  ["je ne sais pas", "all", "211"], ["211", "all", "211"], ["988", "talk", "988"], ["call 811", "talk", "811"],
  ["seniors", "safe", "ssl"], ["my grandma needs help", "safe", "ssl"], ["worried about my son", "talk", "988"],
  ["how can i help my friend", "talk"],
  /* found misrouted in the 2026-10-29 audit */
  ["eating disorder", "talk", "dco"], ["binge eating", "talk", "dco"], ["i feel ill", "talk", "811"],
  ["my husband is controlling and checks my phone", "safe", "awhl"], ["coercive control", "safe", "awhl"],
  ["i'm 80 and my daughter took my bank card", "safe", "ssl"], ["mon chum est très contrôlant", "safe", "awhl"], ["j'ai 78 ans et mon fils prend mon argent", "safe", "ssl"]
];

/* ---------- Words that look dangerous but are not ---------- */
const CALM = [
  "food bank hours", "my phone died", "my phone battery is dead", "deadline for rent", "killing time before class",
  "is it safe to eat expired food", "the dying light", "I'm dying of hunger", "kids sports registration",
  "budget help", "rent is due friday", "how to get a lawyer", "job hunting", "dye my hair", "diet tips",
  "je meurs de faim", "dead end job", "my dad hurt his back", "i ate too much", "how do i register for ODSP",
  "this traffic is killing me", "traffic ticket", "I want to end it with him", "should I end it with my boyfriend",
  "dinner tonight"
];

function isSelfLed(r) { return (r.ids[0] === "988" || r.ids[0] === "911" || r.ids[1] === "988") && r.ids.includes("988"); }

test("every id the engine can return exists in the data", () => {
  const fails = [];
  const all = [].concat(SELF, OVERDOSE, ABUSE, OTHERS, SOMEONE, NEEDS.map((n) => n[0]), CALM);
  for (const q of all) for (const id of I.match(q).ids) if (!(known.has(id))) fails.push(`${q} -> unknown id ${id}`);
  assert.deepStrictEqual(fails, []);
});

test("danger to self is never missed and 988 leads", () => {
  const fails = [];
  for (const q of SELF) {
    const r = I.match(q);
    if (!(r.crisis)) fails.push(`missed crisis: ${JSON.stringify(q)}`);
    if (!(isSelfLed(r))) fails.push(`988 not first for ${JSON.stringify(q)}: ${r.ids.join(",")}`);
  }
  assert.deepStrictEqual(fails, []);
});

test("overdose puts 911 first", () => {
  const fails = [];
  for (const q of OVERDOSE) {
    const r = I.match(q);
    if ((r.crisis) !== ("overdose")) fails.push(`${q} -> ${r.crisis}`);
    if ((r.ids[0]) !== ("911")) fails.push(`${q} -> ${r.ids.join(",")}`);
  }
  assert.deepStrictEqual(fails, []);
});

test("someone hurting you puts 911 and an abuse line first", () => {
  const fails = [];
  for (const q of ABUSE) {
    const r = I.match(q);
    if ((r.crisis) !== ("abuse")) fails.push(`${q} -> ${r.crisis}`);
    if ((r.ids[0]) !== ("911")) fails.push(q);
    if (!(["awhl", "khpsafe", "ssl"].includes(r.ids[1]))) fails.push(`${q} -> ${r.ids.join(",")}`);
    if (!(r.tabs.includes("safe"))) fails.push(q);
  }
  assert.strictEqual(I.match("I'm 14 and my mom hits me").ids[1], "khpsafe");
  assert.strictEqual(I.match("my grandson takes my money and hurts me").ids[1], "ssl");
  assert.deepStrictEqual(fails, []);
});

test("danger to others puts 911 first", () => {
  const fails = [];
  for (const q of OTHERS) {
    const r = I.match(q);
    if ((r.crisis) !== ("others")) fails.push(`${q} -> ${r.crisis}`);
    if ((r.ids[0]) !== ("911")) fails.push(q);
  }
  assert.deepStrictEqual(fails, []);
});

test("worry for someone in danger is crisis framing for supporters", () => {
  const fails = [];
  for (const q of SOMEONE) {
    const r = I.match(q);
    if (!(r.crisis === "someone" || r.crisis === "self")) fails.push(`${q} -> ${r.crisis}`);
    if (!(r.ids.includes("988"))) fails.push(q);
    if (!(r.supporter || r.crisis === "self")) fails.push(q);
  }
  assert.deepStrictEqual(fails, []);
});

test("everyday needs reach the right category without crisis framing", () => {
  const fails = [];
  for (const [q, tab, id] of NEEDS) {
    const r = I.match(q);
    if ((r.crisis) !== (false)) fails.push(`${q} got crisis ${r.crisis}`);
    if (!(r.tabs.includes(tab))) fails.push(`${q} -> tabs ${r.tabs.join(",")} (wanted ${tab})`);
    if (id) if (!(r.ids.includes(id))) fails.push(`${q} -> ${r.ids.join(",")} (wanted ${id})`);
  }
  assert.deepStrictEqual(fails, []);
});

/* Indirect wording, collected as unseen batches in the 2026-10-15 review. Any crisis
   framing passes: the point is that none of these is ever treated as an everyday question. */
const INDIRECT = [
  "i want to sleep forever", "i dont see a way forward", "i am a burden to everyone", "im thinking of taking all my pills",
  "bought a rope", "i have pills saved up", "i want to stop existing", "i shouldnt be alive", "i dont deserve to live",
  "i cant take this pain anymore", "i think about dying every day", "i keep thinking about death",
  "im not going to be around much longer", "this is my last night", "i gave away all my stuff",
  "i want to go to sleep and not wake up", "i want to be gone", "i have a knife and i want to use it on myself",
  "im so tired i just want to stop", "i looked up how many pills it takes", "whats the easiest way to go",
  "i burned myself again", "i started cutting again", "i cant do life anymore", "my friend posted a goodbye note",
  "someone broke into my house", "there is a man outside my door", "im being followed", "i was groped",
  "he forced himself on me", "my husband locked me in", "he wont let me leave the house", "i was touched by my coach",
  "je veux dormir pour toujours", "je suis un fardeau", "je ne mérite pas de vivre", "j'ai acheté une corde",
  "je veux arrêter d'exister", "je pense à la mort tout le temps", "je veux que tout s'arrête", "c'est ma dernière nuit",
  "je veux me faire mal", "il m'a frappée hier", "il m'a enfermée", "je me fais battre", "quelqu'un me suit"
];

test("indirect danger wording is never treated as an everyday question", () => {
  const fails = INDIRECT.filter((q) => !I.match(q).crisis);
  assert.deepStrictEqual(fails, []);
});

test("look-alike words never trigger crisis framing", () => {
  const fails = [];
  for (const q of CALM) if ((I.match(q).crisis) !== (false)) fails.push(`${q} -> ${I.match(q).crisis}`);
  assert.deepStrictEqual(fails, []);
});

test("the situation chips and paths map to their own help", () => {
  const fails = [];
  for (const s of D.SITUATIONS) {
    for (const lang of ["en", "fr"]) {
      const r = I.match(s[lang]);
      const want = s.crisis || false;
      if (r.crisis !== want) fails.push(`${s[lang]} -> ${r.crisis} (wanted ${want})`);
      if (!(r.tabs.includes(s.tab))) fails.push(`${s[lang]} -> ${r.tabs.join(",")} (wanted ${s.tab})`);
    }
  }
  assert.deepStrictEqual(fails, []);
});

test("empty and noise input is calm", () => {
  const fails = [];
  for (const q of ["", "   ", "?!", "asdfgh", null, undefined]) {
    const r = I.match(q);
    assert.strictEqual(r.crisis, false);
  }
  assert.deepStrictEqual(fails, []);
});

/* Words one typo from another topic must keep their own meaning (2026-10-29 audit) */
test("near-miss words do not pull in the wrong help", () => {
  const fails = [];
  const panic = I.match("panic attack right now");
  if (panic.ids.includes("legalaid")) fails.push(`"right" read as "rights": ${panic.ids.join(",")}`);
  if (I.match("right now i need food").tabs.includes("legal")) fails.push("right now i need food -> legal");
  for (const q of ["eating disorder", "binge eating", "i have an eating disorder"]) {
    const r = I.match(q);
    if (r.tabs.includes("food") || r.ids.includes("211food")) fails.push(`${q} -> food: ${r.ids.join(",")}`);
  }
  if (I.match("i'm 80 and my daughter took my bank card").ids[0] !== "ssl") fails.push("senior money control: ssl not first");
  for (const q of ["i feel ill", "im ill", "mentally ill"]) if (I.match(q).empty) fails.push(`${q} -> empty`);
  for (const q of ["ill be fine", "ill call tomorrow"]) if (I.match(q).crisis) fails.push(`${q} -> crisis`);
  assert.deepStrictEqual(fails, []);
});

test("phrase count", () => {
  const fails = [];
  const n = SELF.length + OVERDOSE.length + ABUSE.length + OTHERS.length + SOMEONE.length + NEEDS.length + CALM.length + INDIRECT.length;
  if (!(n >= 150)) fails.push(`only ${n} phrases`);
  console.log(`# ${n} phrases`);
  assert.deepStrictEqual(fails, []);
});
