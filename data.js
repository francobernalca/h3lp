/* h3lp data and words, EN and FR. Pure data: no DOM, nothing stored, nothing sent.
   - R: every service. Numbers, keywords and links were verified by hand (June and July
     2026, French layer 2026-07-16). Change one only after checking it at the source.
   - FR titles only where the organisation’s own French name was verified; FR links only
     where its French page was verified live. 19 entries keep their English title on purpose.
   - scope: on = anywhere in Ontario, ca = across Canada, finder = a search tool.
     region = a local service; it is shown only for cities in that region. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.H3lpData = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var TABS = [
    {"id":"talk","icon":"talk","en":{"label":"Talk to someone","title":"Someone to talk to","note":"Free · confidential · most 24/7"},"fr":{"label":"Parler à quelqu’un","title":"Quelqu’un à qui parler","note":"Gratuit · confidentiel · souvent 24/7"}},
    {"id":"food","icon":"food","en":{"label":"Food today","title":"A meal today","note":"No one should go to sleep hungry."},"fr":{"label":"Manger aujourd’hui","title":"Un repas aujourd’hui","note":"Personne ne devrait s’endormir le ventre vide."}},
    {"id":"safe","icon":"safe","en":{"label":"A safe place","title":"If you’re not safe","note":"It’s not your fault. You have options."},"fr":{"label":"Un endroit sûr","title":"Si vous n’êtes pas en sécurité","note":"Ce n’est pas votre faute. Vous avez des options."}},
    {"id":"comm","icon":"community","en":{"label":"Community","title":"Community to belong to","note":"A safe place to show up."},"fr":{"label":"Communauté","title":"Une communauté où trouver sa place","note":"Un endroit accueillant, sans jugement."}},
    {"id":"play","icon":"sport","en":{"label":"Sports for youth","title":"Get a kid into sport","note":"Cost shouldn’t keep them out."},"fr":{"label":"Sports pour les jeunes","title":"Inscrire un enfant au sport","note":"Le coût ne devrait pas les en priver."}},
    {"id":"new","icon":"new","en":{"label":"New to Canada & legal","title":"New to Canada & legal help","note":"You are not alone here."},"fr":{"label":"Nouveau au Canada et juridique","title":"Nouveaux arrivants et aide juridique","note":"Vous n’êtes pas seul(e) ici."}},
    {"id":"money","icon":"money","en":{"label":"Money basics","title":"A first step with money","note":"Free, trustworthy, nothing to buy."},"fr":{"label":"L’argent, les bases","title":"Un premier pas avec l’argent","note":"Gratuit, fiable, rien à acheter."}},
    {"id":"all","icon":"compass","en":{"label":"Not sure","title":"Not sure where to start?","note":"One call covers almost anything."},"fr":{"label":"Je ne sais pas trop","title":"Vous ne savez pas par où commencer?","note":"Un seul appel couvre presque tout."}}
  ];

  /* Cities: the slug is the old #hash form, kept so shared links still open the same view.
     lat/lon are fixed city centres, used only to ask Open-Meteo for that city’s forecast. */
  var CITIES = [
    { slug: "", en: "All of Ontario", fr: "Tout l’Ontario" },
    { slug: "toronto", en: "Toronto", region: "toronto", lat: 43.6532, lon: -79.3832 },
    { slug: "ottawa", en: "Ottawa", region: "ottawa", lat: 45.4215, lon: -75.6972 },
    { slug: "mississauga", en: "Mississauga", lat: 43.589, lon: -79.6441 },
    { slug: "brampton", en: "Brampton", lat: 43.7315, lon: -79.7624 },
    { slug: "hamilton", en: "Hamilton", region: "hamilton", lat: 43.2557, lon: -79.8711 },
    { slug: "london", en: "London", region: "london", lat: 42.9849, lon: -81.2453 },
    { slug: "markham", en: "Markham", lat: 43.8561, lon: -79.337 },
    { slug: "vaughan", en: "Vaughan", lat: 43.8361, lon: -79.4983 },
    { slug: "richmond-hill", en: "Richmond Hill", lat: 43.8828, lon: -79.4403 },
    { slug: "scarborough", en: "Scarborough", region: "toronto", lat: 43.7764, lon: -79.2318 },
    { slug: "oshawa", en: "Oshawa", lat: 43.8971, lon: -78.8658 },
    { slug: "kitchener", en: "Kitchener", region: "waterloo", lat: 43.4516, lon: -80.4925 },
    { slug: "waterloo", en: "Waterloo", region: "waterloo", lat: 43.4643, lon: -80.5204 },
    { slug: "cambridge", en: "Cambridge", region: "waterloo", lat: 43.3616, lon: -80.3144 },
    { slug: "windsor", en: "Windsor", lat: 42.3149, lon: -83.0364 },
    { slug: "kingston", en: "Kingston", region: "kingston", lat: 44.2312, lon: -76.486 },
    { slug: "greater-sudbury", en: "Greater Sudbury", fr: "Grand Sudbury", region: "sudbury", lat: 46.4917, lon: -80.993 },
    { slug: "thunder-bay", en: "Thunder Bay", region: "thunderbay", lat: 48.3809, lon: -89.2477 },
    { slug: "barrie", en: "Barrie", region: "barrie", lat: 44.3894, lon: -79.6903 },
    { slug: "guelph", en: "Guelph", region: "guelph", lat: 43.5448, lon: -80.2482 },
    { slug: "st-catharines", en: "St. Catharines", lat: 43.1594, lon: -79.2469 },
    { slug: "niagara-falls", en: "Niagara Falls", lat: 43.0896, lon: -79.0849 },
    { slug: "oakville", en: "Oakville", lat: 43.4675, lon: -79.6877 },
    { slug: "burlington", en: "Burlington", lat: 43.3255, lon: -79.799 },
    { slug: "north-bay", en: "North Bay", lat: 46.3091, lon: -79.4608 },
    { slug: "sault-ste-marie", en: "Sault Ste. Marie", fr: "Sault-Sainte-Marie", lat: 46.5219, lon: -84.3461 },
    { slug: "peterborough", en: "Peterborough", lat: 44.3091, lon: -78.3197 }
  ];

  var R = [
    {"id":"988","svc":"988","scope":"ca","cats":["talk","all"],"hot":true,"who":"Right now · 24/7","title":"988 Suicide Crisis Helpline","hours":"24/7","body":"If you're thinking about suicide, or worried about someone who is. Call or text 988 any time, free, anywhere in Canada.","actions":[{"label":"Call 988","href":"tel:988"},{"label":"Text 988","href":"sms:988"}],"fr":{"who":"Tout de suite · 24/7","title":"9-8-8 : Ligne d'aide en cas de crise de suicide","body":"Si vous pensez au suicide, ou si vous vous inquiétez pour quelqu'un. Appelez ou textez le 988 à toute heure, gratuitement, partout au Canada.","actions":[{"label":"Appelez le 988","href":"tel:988"},{"label":"Textez le 988","href":"sms:988"}]}},
    {"id":"connex","svc":"connex","scope":"on","cats":["talk"],"who":"Ontario · addiction & mental health","title":"ConnexOntario","hours":"24/7","body":"Free, confidential, government-funded line for drugs, alcohol, gambling, or mental health. They find local treatment for you, even with no insurance. Open 24/7.","actions":[{"label":"Call 1-866-531-2600","href":"tel:18665312600"},{"label":"Website","href":"https://connexontario.ca","alt":true}],"fr":{"who":"Ontario · dépendances et santé mentale","body":"Une ligne gratuite, confidentielle et financée par le gouvernement pour la drogue, l'alcool, le jeu ou la santé mentale. On trouve un traitement local pour vous, même sans assurance. Ouvert 24/7.","actions":[{"label":"Appelez le 1 866 531-2600","href":"tel:18665312600"},{"label":"Site Web","href":"https://www.connexontario.ca/fr-ca","alt":true}]}},
    {"id":"khp","svc":"khp","scope":"on","cats":["talk"],"who":"Ontario · ages 5–29","title":"Kids Help Phone","hours":"24/7","body":"For kids, teens, and young adults. Call any time, or text CONNECT to 686868. Free, confidential, and they actually get it.","actions":[{"label":"Call 1-800-668-6868","href":"tel:18006686868"},{"label":"Text 686868","href":"sms:686868?body=CONNECT","alt":true}],"fr":{"who":"Ontario · 5 à 29 ans","title":"Jeunesse, J'écoute","body":"Pour les enfants, les ados et les jeunes adultes. Appelez à toute heure, ou textez PARLER au 686868. Gratuit, confidentiel, et on vous comprend vraiment.","actions":[{"label":"Appelez le 1 800 668-6868","href":"tel:18006686868"},{"label":"Textez PARLER au 686868","href":"sms:686868?body=PARLER","alt":true}]}},
    {"id":"811","svc":"811","scope":"on","cats":["talk","all"],"who":"Ontario · a nurse, free","title":"Health811","hours":"24/7","body":"Dial 811 to talk to a registered nurse, free, 24/7, about any health worry, including mental health or substance use. No health card needed.","actions":[{"label":"Call 811","href":"tel:811"},{"label":"Website","href":"https://health811.ontario.ca","alt":true}],"fr":{"who":"Ontario · une infirmière, gratuit","title":"Santé811","body":"Composez le 811 pour parler à une infirmière autorisée, gratuitement, 24/7, pour toute inquiétude de santé, y compris la santé mentale ou la consommation. Aucune carte Santé requise.","actions":[{"label":"Appelez le 811","href":"tel:811"},{"label":"Site Web","href":"https://health811.ontario.ca/static/fr-ca/guest/home","alt":true}]}},
    {"id":"good2talk","svc":"good2talk","scope":"on","cats":["talk"],"who":"Ontario · post-secondary students","title":"Good2Talk","hours":"24/7","body":"Free, confidential, 24/7 support for college and university students in Ontario, in over 100 languages. Call or text.","actions":[{"label":"Call 1-866-925-5454","href":"tel:18669255454"},{"label":"Text GOOD2TALKON to 686868","href":"sms:686868?body=GOOD2TALKON","alt":true}],"fr":{"who":"Ontario · étudiants postsecondaires","title":"Allo J'écoute","body":"Du soutien gratuit, confidentiel et 24/7 pour les étudiantes et étudiants des collèges et universités de l'Ontario, en plus de 100 langues. Appelez ou textez.","actions":[{"label":"Appelez le 1 866 925-5454","href":"tel:18669255454"},{"label":"Textez ALLOJECOUTEON au 686868","href":"sms:686868?body=ALLOJECOUTEON","alt":true}]}},
    {"id":"hope","svc":"hope","scope":"ca","cats":["talk"],"who":"Indigenous peoples · 24/7","title":"Hope for Wellness Helpline","hours":"24/7","body":"Immediate counselling and crisis support for all First Nations, Inuit, and Métis. Available in English, French, Cree, Ojibway, and Inuktitut.","actions":[{"label":"Call 1-855-242-3310","href":"tel:18552423310"},{"label":"Online chat","href":"https://www.hopeforwellness.ca","alt":true}],"fr":{"who":"Peuples autochtones · 24/7","title":"Espoir pour le mieux-être","body":"Du counseling immédiat et du soutien de crise pour tous les membres des Premières Nations, les Inuits et les Métis. Offert en français, en anglais, en cri, en ojibwé et en inuktitut.","actions":[{"label":"Appelez le 1 855 242-3310","href":"tel:18552423310"},{"label":"Clavardage en ligne","href":"https://www.espoirpourlemieuxetre.ca","alt":true}]}},
    {"id":"mno","svc":"mno","scope":"on","cats":["talk"],"who":"Indigenous · Ontario · 24/7","title":"Métis Nation of Ontario crisis line","hours":"24/7","body":"A 24-hour mental health and addictions crisis line with culturally specific support for Métis adults, youth, and families, in English and French.","actions":[{"label":"Call 1-877-767-7572","href":"tel:18777677572"}],"fr":{"who":"Autochtones · Ontario · 24/7","title":"Ligne de crise de la Métis Nation of Ontario","body":"Une ligne de crise en santé mentale et en dépendances, 24 heures sur 24, avec un soutien culturellement adapté pour les adultes, les jeunes et les familles métis, en français et en anglais.","actions":[{"label":"Appelez le 1 877 767-7572","href":"tel:18777677572"}]}},
    {"id":"byh","svc":"byh","scope":"on","cats":["talk"],"who":"Black youth & families","title":"Black Youth Helpline","hours":{"days":[0,1,2,3,4,5,6],"from":540,"to":1320,"label":"every day","labelFr":"tous les jours"},"body":"A culturally safe, professional helpline for Black youth, families, and schools across Ontario. Open every day, 9am–10pm.","actions":[{"label":"Call 1-833-294-8650","href":"tel:18332948650"},{"label":"Website","href":"https://blackyouth.ca","alt":true}],"fr":{"who":"Jeunes noirs et familles","body":"Une ligne d'aide professionnelle et culturellement sécuritaire pour les jeunes noirs, les familles et les écoles, partout en Ontario. Ouvert tous les jours, de 9 h à 22 h.","actions":[{"label":"Appelez le 1 833 294-8650","href":"tel:18332948650"},{"label":"Site Web","href":"https://blackyouth.ca","alt":true}]}},
    {"id":"youthline","svc":"youthline","scope":"on","cats":["talk"],"who":"2SLGBTQ+ youth · 29 & under","title":"LGBT YouthLine","hours":{"days":[0,1,2,3,4,5],"from":960,"to":1290,"label":"Sun–Fri","labelFr":"dim–ven"},"body":"Confidential, non-judgemental peer support by and for 2SLGBTQ+ youth across Ontario, by text or online chat.","actions":[{"label":"Text 647-694-4275","href":"sms:16476944275"},{"label":"Online chat","href":"https://www.youthline.ca/","alt":true}],"fr":{"who":"Jeunes 2SLGBTQ+ · 29 ans et moins","body":"Du soutien par les pairs, confidentiel et sans jugement, par et pour les jeunes 2SLGBTQ+ de l'Ontario, par texto ou par clavardage en ligne.","actions":[{"label":"Textez le 647 694-4275","href":"sms:16476944275"},{"label":"Clavardage en ligne","href":"https://www.youthline.ca/","alt":true}]}},
    {"id":"naseeha","svc":"naseeha","cats":["talk"],"who":"Muslim mental health","title":"Naseeha","body":"Confidential, culturally and spiritually aware support for Muslim youth and anyone who needs it: mental health, faith, family, and more.","actions":[{"label":"Call 1-866-627-3342","href":"tel:18666273342"},{"label":"Website","href":"https://naseeha.org","alt":true}],"fr":{"who":"Santé mentale musulmane","body":"Un soutien confidentiel, adapté à la culture et à la spiritualité, pour les jeunes musulmans et toute personne qui en a besoin : santé mentale, foi, famille et plus.","actions":[{"label":"Appelez le 1 866 627-3342","href":"tel:18666273342"},{"label":"Site Web","href":"https://naseeha.org","alt":true}]}},
    {"id":"cssp","svc":"cssp","cats":["talk","comm","new"],"region":"toronto","regionLabel":"Toronto","local":true,"who":"Spanish-speaking · Toronto","title":"Centre for Spanish Speaking Peoples","body":"A trusted Toronto non-profit serving Spanish-speaking communities since 1973: counselling, support for women facing abuse, youth and seniors programs, settlement help, and a free legal clinic. En español.","actions":[{"label":"Call 416-533-8545","href":"tel:14165338545"},{"label":"Website","href":"https://spanishservices.org/en/","alt":true}],"fr":{"who":"Hispanophones · Toronto","body":"Un organisme torontois de confiance au service des communautés hispanophones depuis 1973 : counseling, soutien aux femmes qui subissent de la violence, programmes pour jeunes et aînés, aide à l'établissement et clinique juridique gratuite. En español.","actions":[{"label":"Appelez le 416 533-8545","href":"tel:14165338545"},{"label":"Site Web","href":"https://spanishservices.org/en/","alt":true}]}},
    {"id":"dco","svc":"dco","scope":"finder","cats":["talk"],"who":"Ontario · local distress centres","title":"Distress & Crisis Ontario","body":"A network of community distress centres across Ontario, a listening ear for anyone feeling lonely, low, or in crisis, often 24/7.","actions":[{"label":"Find a centre","href":"https://www.dcontario.org"}],"fr":{"who":"Ontario · centres de détresse locaux","body":"Un réseau de centres de détresse communautaires partout en Ontario. Une oreille attentive pour toute personne qui se sent seule, à plat ou en crise, souvent 24/7.","actions":[{"label":"Trouver un centre","href":"https://www.dcontario.org"}]}},
    {"id":"feedon","svc":"feedon","scope":"finder","cats":["food"],"who":"All of Ontario","title":"Find a food bank (Feed Ontario)","body":"Ontario's food bank network. Type your town and it lists the nearest member food bank with its address and contact.","actions":[{"label":"Find food","href":"https://feedontario.ca/find-a-food-bank/"}],"fr":{"who":"Tout l'Ontario","title":"Trouver une banque alimentaire (Feed Ontario)","body":"Le réseau des banques alimentaires de l'Ontario. Entrez votre ville et l'outil affiche la banque alimentaire membre la plus proche, avec son adresse et son contact.","actions":[{"label":"Trouver de la nourriture","href":"https://feedontario.ca/find-a-food-bank/"}]}},
    {"id":"211food","svc":"211","scope":"on","cats":["food","all"],"who":"Anywhere in Ontario · 24/7","title":"Call 211 for food","hours":"24/7","body":"Dial 211 and a real person finds food banks, free meals, and meal programs near you, with hours and whether you need to book. Many languages.","actions":[{"label":"Call 211","href":"tel:211"},{"label":"Search online","href":"https://211ontario.ca","alt":true}],"fr":{"who":"Partout en Ontario · 24/7","title":"Appelez le 211 pour manger","body":"Composez le 211 et une vraie personne trouve pour vous les banques alimentaires, les repas gratuits et les programmes alimentaires près de chez vous, avec les heures et s'il faut réserver. Plusieurs langues.","actions":[{"label":"Appelez le 211","href":"tel:211"},{"label":"Chercher en ligne","href":"https://211ontario.ca/fr/","alt":true}]}},
    {"id":"dailybread","svc":"dailybread","cats":["food"],"region":"toronto","regionLabel":"Toronto","local":true,"who":"Toronto","title":"Daily Bread Food Bank","hours":{"days":[1,2,3,4,5],"from":510,"to":990,"label":"Mon–Fri","labelFr":"lun–ven"},"body":"Over 100 member food banks across Toronto. No ID required for a single person. Use their finder or call to locate your nearest one.","actions":[{"label":"Find food","href":"https://www.dailybread.ca/"},{"label":"Call 416-203-0050","href":"tel:14162030050","alt":true}],"fr":{"who":"Toronto","body":"Plus de 100 banques alimentaires membres à Toronto. Aucune pièce d'identité requise pour une personne seule. Utilisez leur outil de recherche ou appelez pour trouver la plus proche.","actions":[{"label":"Trouver de la nourriture","href":"https://www.dailybread.ca/"},{"label":"Appelez le 416 203-0050","href":"tel:14162030050","alt":true}]}},
    {"id":"ottawafb","svc":"ottawafb","cats":["food"],"region":"ottawa","regionLabel":"Ottawa","local":true,"who":"Ottawa","title":"Ottawa Food Bank","body":"Coordinates food banks and meal programs across Ottawa. Their site finds your nearest neighbourhood food bank and community meal.","actions":[{"label":"Find food","href":"https://www.ottawafoodbank.ca/"},{"label":"Call 211","href":"tel:211","alt":true}],"fr":{"who":"Ottawa","title":"La Banque d'alimentation d'Ottawa","body":"Coordonne les banques alimentaires et les programmes de repas partout à Ottawa. Leur site trouve la banque alimentaire de quartier et le repas communautaire les plus proches.","actions":[{"label":"Trouver de la nourriture","href":"https://www.ottawafoodbank.ca/fr/"},{"label":"Appelez le 211","href":"tel:211","alt":true}]}},
    {"id":"hamiltonfs","svc":"hamiltonfs","cats":["food"],"region":"hamilton","regionLabel":"Hamilton","local":true,"who":"Hamilton","title":"Hamilton Food Share","body":"The hub for Hamilton's emergency food network. Their 'Looking for help' page lists food banks and hot-meal programs across the city.","actions":[{"label":"Find food","href":"https://hamiltonfoodshare.org/looking-for-help"},{"label":"Call 211","href":"tel:211","alt":true}],"fr":{"who":"Hamilton","body":"Le cœur du réseau alimentaire d'urgence de Hamilton. Leur page « Looking for help » liste les banques alimentaires et les repas chauds partout en ville.","actions":[{"label":"Trouver de la nourriture","href":"https://hamiltonfoodshare.org/looking-for-help"},{"label":"Appelez le 211","href":"tel:211","alt":true}]}},
    {"id":"londonfb","svc":"londonfb","cats":["food"],"region":"london","regionLabel":"London","local":true,"who":"London","title":"London Food Bank","body":"Serving London and Middlesex. They point you to the nearest food bank or community meal, with no need to explain why.","actions":[{"label":"Find food","href":"https://londonfoodbank.ca/"},{"label":"Call 211","href":"tel:211","alt":true}],"fr":{"who":"London","body":"Au service de London et du comté de Middlesex. On vous dirige vers la banque alimentaire ou le repas communautaire le plus proche, sans avoir à vous justifier.","actions":[{"label":"Trouver de la nourriture","href":"https://londonfoodbank.ca/"},{"label":"Appelez le 211","href":"tel:211","alt":true}]}},
    {"id":"waterloofb","svc":"waterloofb","cats":["food"],"region":"waterloo","regionLabel":"Kitchener · Waterloo · Cambridge","local":true,"who":"Waterloo Region","title":"The Food Bank of Waterloo Region","body":"Connects you to food banks and community programs across Kitchener, Waterloo and Cambridge.","actions":[{"label":"Find food","href":"https://www.thefoodbank.ca/"},{"label":"Call 211","href":"tel:211","alt":true}],"fr":{"who":"Région de Waterloo","body":"Vous met en lien avec les banques alimentaires et les programmes communautaires de Kitchener, Waterloo et Cambridge.","actions":[{"label":"Trouver de la nourriture","href":"https://www.thefoodbank.ca/"},{"label":"Appelez le 211","href":"tel:211","alt":true}]}},
    {"id":"kingstonfb","svc":"kingstonfb","cats":["food"],"region":"kingston","regionLabel":"Kingston","local":true,"who":"Kingston","title":"Partners in Mission Food Bank","body":"Kingston's central food bank, supplying neighbourhood programs across the city. Find help or call 211 to confirm hours.","actions":[{"label":"Find food","href":"https://www.kingstonfoodbank.ca/"},{"label":"Call 211","href":"tel:211","alt":true}],"fr":{"who":"Kingston","body":"La banque alimentaire centrale de Kingston, qui approvisionne les programmes de quartier partout en ville. Trouvez de l'aide ou appelez le 211 pour confirmer les heures.","actions":[{"label":"Trouver de la nourriture","href":"https://www.kingstonfoodbank.ca/"},{"label":"Appelez le 211","href":"tel:211","alt":true}]}},
    {"id":"sudburyfb","svc":"sudburyfb","cats":["food"],"region":"sudbury","regionLabel":"Greater Sudbury","local":true,"who":"Greater Sudbury","title":"Sudbury Food Bank","body":"Supplies emergency food to programs across Greater Sudbury. Their site and 211 find your nearest pickup.","actions":[{"label":"Find food","href":"https://www.sudburyfoodbank.ca/"},{"label":"Call 211","href":"tel:211","alt":true}],"fr":{"who":"Grand Sudbury","body":"Fournit des aliments d'urgence aux programmes du Grand Sudbury. Leur site et le 211 trouvent le point de service le plus proche.","actions":[{"label":"Trouver de la nourriture","href":"https://www.sudburyfoodbank.ca/"},{"label":"Appelez le 211","href":"tel:211","alt":true}]}},
    {"id":"tbayfb","svc":"tbayfb","cats":["food"],"region":"thunderbay","regionLabel":"Thunder Bay & region","local":true,"who":"Thunder Bay","title":"Regional Food Distribution Assoc.","body":"Northwestern Ontario's food network, based in Thunder Bay. Find a food bank or meal program near you.","actions":[{"label":"Find food","href":"https://www.foodbanksnorthwest.ca/"},{"label":"Call 211","href":"tel:211","alt":true}],"fr":{"who":"Thunder Bay","regionLabel":"Thunder Bay et la région","body":"Le réseau alimentaire du Nord-Ouest de l'Ontario, basé à Thunder Bay. Trouvez une banque alimentaire ou un programme de repas près de chez vous.","actions":[{"label":"Trouver de la nourriture","href":"https://www.foodbanksnorthwest.ca/"},{"label":"Appelez le 211","href":"tel:211","alt":true}]}},
    {"id":"barriefb","svc":"barriefb","cats":["food"],"region":"barrie","regionLabel":"Barrie","local":true,"who":"Barrie","title":"Barrie Food Bank","body":"Serving Barrie and the surrounding area. Check eligibility and hours, or call 211 to confirm before you go.","actions":[{"label":"Find food","href":"https://barriefoodbank.org/"},{"label":"Call 211","href":"tel:211","alt":true}],"fr":{"who":"Barrie","body":"Au service de Barrie et des environs. Vérifiez l'admissibilité et les heures, ou appelez le 211 pour confirmer avant de vous déplacer.","actions":[{"label":"Trouver de la nourriture","href":"https://barriefoodbank.org/"},{"label":"Appelez le 211","href":"tel:211","alt":true}]}},
    {"id":"guelphfb","svc":"guelphfb","cats":["food"],"region":"guelph","regionLabel":"Guelph","local":true,"who":"Guelph","title":"Guelph Food Bank","body":"Guelph's community food bank. Their site lists hours and what to bring; 211 can confirm the nearest option.","actions":[{"label":"Find food","href":"https://guelphfoodbank.ca/"},{"label":"Call 211","href":"tel:211","alt":true}],"fr":{"who":"Guelph","body":"La banque alimentaire communautaire de Guelph. Leur site indique les heures et quoi apporter; le 211 peut confirmer l'option la plus proche.","actions":[{"label":"Trouver de la nourriture","href":"https://guelphfoodbank.ca/"},{"label":"Appelez le 211","href":"tel:211","alt":true}]}},
    {"id":"khpsafe","svc":"khp","scope":"on","cats":["safe"],"hot":true,"who":"Kids & teens · 24/7","title":"Kids Help Phone","hours":"24/7","body":"If you're young and someone at home is hurting you. Call, or text CONNECT to 686868, any time. It listens first.","actions":[{"label":"Call 1-800-668-6868","href":"tel:18006686868"},{"label":"Text 686868","href":"sms:686868?body=CONNECT","alt":true}],"fr":{"who":"Enfants et ados · 24/7","title":"Jeunesse, J'écoute","body":"Si vous êtes jeune et que quelqu'un à la maison vous fait du mal. Appelez, ou textez PARLER au 686868, à toute heure. Ici, on commence par vous écouter.","actions":[{"label":"Appelez le 1 800 668-6868","href":"tel:18006686868"},{"label":"Textez PARLER au 686868","href":"sms:686868?body=PARLER","alt":true}]}},
    {"id":"awhl","svc":"awhl","scope":"on","cats":["safe"],"who":"Gender-based abuse · 24/7","title":"Assaulted Women's Helpline","hours":"24/7","body":"For anyone facing abuse from a partner or family member. Free, confidential crisis support and shelter referrals, 24/7, in many languages.","actions":[{"label":"Call 1-866-863-0511","href":"tel:18668630511"},{"label":"Website","href":"https://www.awhl.org","alt":true}],"fr":{"who":"Violence fondée sur le genre · 24/7","body":"Pour toute personne qui subit de la violence d'un partenaire ou d'un membre de la famille. Soutien de crise gratuit et confidentiel et orientation vers des refuges, 24/7, en plusieurs langues.","actions":[{"label":"Appelez le 1 866 863-0511","href":"tel:18668630511"},{"label":"Site Web","href":"https://www.awhl.org","alt":true}]}},
    {"id":"ssl","svc":"ssl","scope":"on","cats":["safe"],"who":"Seniors · elder abuse","title":"Seniors Safety Line","hours":"24/7","body":"Free, confidential support 24/7 for older adults experiencing abuse or neglect, in many languages, with referrals to local help.","actions":[{"label":"Call 1-866-299-1011","href":"tel:18662991011"}],"fr":{"who":"Aînés · maltraitance","title":"Ligne d'assistance aux personnes âgées","body":"Soutien gratuit et confidentiel, 24/7, pour les personnes aînées qui vivent de la maltraitance ou de la négligence, en plusieurs langues, avec orientation vers de l'aide locale.","actions":[{"label":"Appelez le 1 866 299-1011","href":"tel:18662991011"}]}},
    {"id":"211safe","svc":"211","scope":"on","cats":["safe","all"],"who":"Find shelter · 24/7","title":"Call 211 for a safe place","hours":"24/7","body":"Dial 211 to be connected to emergency shelter, youth shelters, and local safety support anywhere in Ontario. Free and confidential.","actions":[{"label":"Call 211","href":"tel:211"},{"label":"Search online","href":"https://211ontario.ca","alt":true}],"fr":{"who":"Trouver un refuge · 24/7","title":"Appelez le 211 pour un endroit sûr","body":"Composez le 211 pour être dirigé vers un hébergement d'urgence, des refuges pour jeunes et du soutien local en matière de sécurité, partout en Ontario. Gratuit et confidentiel.","actions":[{"label":"Appelez le 211","href":"tel:211"},{"label":"Chercher en ligne","href":"https://211ontario.ca/fr/","alt":true}]}},
    {"id":"ymca","svc":"ymca","scope":"finder","cats":["comm"],"who":"All ages · all of Ontario","title":"Find your local YMCA","body":"Swimming, gyms, drop-in sports, youth nights, and adult programs. As a charity, the Y offers financial assistance so cost is rarely a barrier.","actions":[{"label":"Find a Y","href":"https://ymca.ca/en/locations"}],"fr":{"who":"Tous âges · tout l'Ontario","title":"Trouvez votre YMCA","body":"Natation, gyms, sports libres, soirées jeunesse et programmes pour adultes. Comme organisme de bienfaisance, le Y offre de l'aide financière : le coût est rarement un obstacle.","actions":[{"label":"Trouver un Y","href":"https://ymca.ca/fr/emplacements"}]}},
    {"id":"211comm","svc":"211","scope":"on","cats":["comm","all"],"who":"Community programs · 24/7","title":"Call 211 for community & faith groups","hours":"24/7","body":"211 lists recreation centres, drop-in groups, faith and cultural communities, and free local programs in your own town.","actions":[{"label":"Call 211","href":"tel:211"},{"label":"Search online","href":"https://211ontario.ca","alt":true}],"fr":{"who":"Programmes communautaires · 24/7","title":"Le 211 : communauté et groupes de foi","body":"Le 211 répertorie les centres récréatifs, les groupes d'accueil, les communautés de foi et culturelles et les programmes locaux gratuits, dans votre propre ville.","actions":[{"label":"Appelez le 211","href":"tel:211"},{"label":"Chercher en ligne","href":"https://211ontario.ca/fr/","alt":true}]}},
    {"id":"hubs","svc":"hubs","scope":"finder","cats":["comm"],"who":"Youth · ages 12–25","title":"Youth Wellness Hubs Ontario","body":"Free, walk-in spaces for young people with mental health support, activities, and a community to connect with. Find a hub near you.","actions":[{"label":"Find a hub","href":"https://youthhubs.ca/"}],"fr":{"who":"Jeunes · 12 à 25 ans","title":"Carrefours bien-être pour les jeunes de l'Ontario","body":"Des espaces gratuits et sans rendez-vous pour les jeunes : soutien en santé mentale, activités et une communauté où se retrouver. Trouvez un carrefour près de chez vous.","actions":[{"label":"Trouver un carrefour","href":"https://youthhubs.ca/fr/"}]}},
    {"id":"recovery","svc":"connex","scope":"on","cats":["comm"],"who":"Peer recovery support","title":"Recovery groups near you","hours":"24/7","body":"Want to be around others staying sober? ConnexOntario connects you to free self-help and peer recovery groups for alcohol and drugs, 24/7.","actions":[{"label":"Call 1-866-531-2600","href":"tel:18665312600"},{"label":"Website","href":"https://connexontario.ca","alt":true}],"fr":{"who":"Soutien par les pairs en rétablissement","title":"Groupes de rétablissement près de chez vous","body":"Envie d'être entouré(e) de gens qui restent sobres? ConnexOntario vous met en contact avec des groupes d'entraide et de rétablissement gratuits pour l'alcool et la drogue, 24/7.","actions":[{"label":"Appelez le 1 866 531-2600","href":"tel:18665312600"},{"label":"Site Web","href":"https://www.connexontario.ca/fr-ca","alt":true}]}},
    {"id":"farmer","svc":"farmer","scope":"on","cats":["comm"],"who":"Farmers & rural Ontario · 24/7","title":"Farmer Wellness Initiative","hours":"24/7","body":"Free, confidential counselling for Ontario farmers and their families, 365 days a year, with counsellors who understand farm life.","actions":[{"label":"Call 1-866-267-6255","href":"tel:18662676255"}],"fr":{"who":"Agriculteurs et Ontario rural · 24/7","body":"Du counseling gratuit et confidentiel pour les agriculteurs de l'Ontario et leurs familles, 365 jours par année, avec des conseillers qui comprennent la vie agricole.","actions":[{"label":"Appelez le 1 866 267-6255","href":"tel:18662676255"}]}},
    {"id":"kidsport","svc":"kidsport","scope":"on","cats":["play"],"who":"Can't afford the fees?","title":"KidSport Ontario","body":"Grants of up to $250 a year to cover sport registration for kids 18 and under from families facing money barriers. Apply free online.","actions":[{"label":"Apply","href":"https://kidsportcanada.ca/ontario/"}],"fr":{"who":"Les frais sont trop élevés?","body":"Des subventions allant jusqu'à 250 $ par année pour couvrir l'inscription sportive des jeunes de 18 ans et moins dont la famille fait face à des obstacles financiers. Demande gratuite en ligne.","actions":[{"label":"Faire une demande","href":"https://kidsportcanada.ca/ontario/"}]}},
    {"id":"jumpstart","svc":"jumpstart","scope":"ca","cats":["play"],"who":"Canada-wide · sport funding","title":"Canadian Tire Jumpstart","body":"Helps kids who can't afford it get into sport, covering registration, equipment, and transport. Also runs free community programs.","actions":[{"label":"Apply","href":"https://jumpstart.canadiantire.ca/"}],"fr":{"who":"Partout au Canada · financement du sport","title":"Bon départ de Canadian Tire","body":"Aide les enfants qui n'en ont pas les moyens à faire du sport : inscription, équipement et transport. Offre aussi des programmes communautaires gratuits.","actions":[{"label":"Faire une demande","href":"https://jumpstart.canadiantire.ca/fr"}]}},
    {"id":"ymcasport","svc":"ymca","scope":"finder","cats":["play"],"who":"All ages · all of Ontario","title":"YMCA sports & swim","body":"Registered and drop-in sports, swim lessons, and day camps, with financial assistance available. Find your local Y.","actions":[{"label":"Find a Y","href":"https://ymca.ca/en/locations"}],"fr":{"who":"Tous âges · tout l'Ontario","title":"Sports et natation au YMCA","body":"Sports organisés et libres, cours de natation et camps de jour, avec de l'aide financière disponible. Trouvez votre Y.","actions":[{"label":"Trouver un Y","href":"https://ymca.ca/fr/emplacements"}]}},
    {"id":"ircc","svc":"ircc","scope":"finder","cats":["new"],"who":"Free · government-funded","title":"Find free newcomer services","body":"The official Government of Canada finder. Free settlement workers near you help with jobs, language classes, housing, schools, health, and benefits.","actions":[{"label":"Find services","href":"https://ircc.canada.ca/english/newcomers/services/index.asp"}],"fr":{"who":"Gratuit · financé par le gouvernement","title":"Services gratuits pour nouveaux arrivants","body":"L'outil officiel du gouvernement du Canada. Des travailleurs d'établissement gratuits, près de chez vous, aident pour l'emploi, les cours de langue, le logement, l'école, la santé et les prestations.","actions":[{"label":"Trouver des services","href":"https://ircc.canada.ca/francais/nouveaux/services/index.asp"}]}},
    {"id":"nic","svc":"nic","cats":["new"],"who":"First stop for newcomers","title":"YMCA Newcomer Information Centre","body":"A free, welcoming first stop in Ontario. Get a personal settlement plan and clear answers on work, education, health, and life in Canada.","actions":[{"label":"Open","href":"https://newcomersincanada.ca"}],"fr":{"who":"Premier arrêt des nouveaux arrivants","body":"Un premier arrêt gratuit et accueillant en Ontario. Recevez un plan d'établissement personnalisé et des réponses claires sur le travail, les études, la santé et la vie au Canada.","actions":[{"label":"Ouvrir","href":"https://newcomersincanada.ca"}]}},
    {"id":"legalaid","svc":"legalaid","scope":"on","cats":["new"],"who":"Free legal help","title":"Legal Aid Ontario","body":"Free or low-cost legal help if you can't afford a lawyer: criminal, family, refugee and immigration, and housing. Facing domestic violence? A free 2-hour consult, no income test.","actions":[{"label":"Call 1-800-668-8258","href":"tel:18006688258"},{"label":"Website","href":"https://www.legalaid.on.ca","alt":true}],"fr":{"who":"Aide juridique gratuite","title":"Aide juridique Ontario","body":"De l'aide juridique gratuite ou à faible coût si vous ne pouvez pas payer un avocat : criminel, famille, réfugiés et immigration, logement. Vous vivez de la violence familiale? Une consultation gratuite de 2 heures, sans critère de revenu.","actions":[{"label":"Appelez le 1 800 668-8258","href":"tel:18006688258"},{"label":"Site Web","href":"https://www.legalaid.on.ca/fr/","alt":true}]}},
    {"id":"clinics","svc":"clinics","scope":"finder","cats":["new"],"who":"Everyday legal problems","title":"Community legal clinics","body":"Local clinics give free help with the essentials: housing and eviction, ODSP and Ontario Works, employment, and human rights. Find your nearest clinic.","actions":[{"label":"Find a clinic","href":"https://www.legalaid.on.ca/legal-clinics/"}],"fr":{"who":"Problèmes juridiques du quotidien","title":"Cliniques juridiques communautaires","body":"Des cliniques locales offrent de l'aide gratuite pour l'essentiel : logement et éviction, POSPH et Ontario au travail, emploi et droits de la personne. Trouvez la clinique la plus proche.","actions":[{"label":"Trouver une clinique","href":"https://www.legalaid.on.ca/fr/cliniques-juridiques/"}]}},
    {"id":"budget","svc":"budget","scope":"ca","cats":["money"],"who":"Canada · free tool","title":"Budget Planner (FCAC)","body":"The government's free budget tool. It does the math and shows where your money goes, so you can find room to breathe. No account needed.","actions":[{"label":"Open tool","href":"https://itools-ioutils.fcac-acfc.gc.ca/BP-PB/budget-planner"}],"fr":{"who":"Canada · outil gratuit","title":"Planificateur budgétaire (ACFC)","body":"L'outil budgétaire gratuit du gouvernement. Il fait le calcul et montre où va votre argent, pour vous redonner un peu d'air. Aucun compte requis.","actions":[{"label":"Ouvrir l'outil","href":"https://itools-ioutils.fcac-acfc.gc.ca/BP-PB/outil-planificateur-budgetaire"}]}},
    {"id":"payday","svc":"payday","scope":"ca","cats":["money"],"who":"Canada · know the trap","title":"The truth about payday loans","body":"Borrowing $100 can cost $14 to $17 in fees, over 300% a year, and it traps you in a cycle. Read the plain facts before you ever sign one.","actions":[{"label":"Read first","href":"https://www.canada.ca/en/financial-consumer-agency/services/loans/payday-loans.html"}],"fr":{"who":"Canada · connaître le piège","title":"La vérité sur les prêts sur salaire","body":"Emprunter 100 $ peut coûter de 14 $ à 17 $ de frais, soit plus de 300 % par année, et le cycle vous piège. Lisez les faits en langage clair avant d'en signer un.","actions":[{"label":"À lire d'abord","href":"https://www.canada.ca/fr/agence-consommation-matiere-financiere/services/prets/prets-sur-salaire.html"}]}},
    {"id":"basics","svc":"basics","scope":"ca","cats":["money"],"who":"Canada · learn the basics","title":"Money basics, no jargon","body":"Free guides on banking, debt, credit, and saving from the Financial Consumer Agency of Canada. Plain language, nothing to buy.","actions":[{"label":"Learn","href":"https://www.canada.ca/en/financial-consumer-agency/services/financial-toolkit.html"}],"fr":{"who":"Canada · apprendre les bases","title":"Les bases de l'argent, sans jargon","body":"Des guides gratuits sur le compte de banque, les dettes, le crédit et l'épargne, par l'Agence de la consommation en matière financière du Canada. Langage simple, rien à acheter.","actions":[{"label":"Apprendre","href":"https://www.canada.ca/fr/agence-consommation-matiere-financiere/services/vos-outils-financiers.html"}]}},
    {"id":"211","svc":"211","scope":"on","cats":["all"],"hot":true,"who":"All of Ontario · 24/7","title":"Call 211 Ontario","hours":"24/7","body":"Dial 2-1-1 from any phone, free, any hour. They listen and connect you to local help for whatever you're facing. Over 150 languages.","actions":[{"label":"Call 211","href":"tel:211"},{"label":"Search online","href":"https://211ontario.ca","alt":true}],"fr":{"who":"Tout l'Ontario · 24/7","title":"Appelez le 211 Ontario","body":"Composez le 2-1-1 depuis n'importe quel téléphone, gratuitement, à toute heure. On vous écoute, puis on vous met en lien avec de l'aide locale, quoi que vous traversiez. Plus de 150 langues.","actions":[{"label":"Appelez le 211","href":"tel:211"},{"label":"Chercher en ligne","href":"https://211ontario.ca/fr/","alt":true}]}},
    {"id":"911","svc":"911","scope":"ca","cats":[],"hot":true,"who":"Emergency · police, fire, ambulance","title":"Call 911","hours":"24/7","body":"If someone is in danger right now, or someone has taken too much of something, call 911. Free from any phone.","actions":[{"label":"Call 911","href":"tel:911"}],"fr":{"who":"Urgence · police, pompiers, ambulance","title":"Appelez le 911","body":"Si quelqu'un est en danger en ce moment, ou si quelqu'un a trop consommé, composez le 911. Gratuit depuis n'importe quel téléphone.","actions":[{"label":"Appelez le 911","href":"tel:911"}]}}
  ];

  var TIPS = [
    {"h":"Avoid high-interest debt","p":"Payday loans and “instant pay” apps are the most expensive way to borrow. Try 211 or a food bank for emergency basics first. It’s free, not a loan.","hFr":"Évitez les dettes à intérêt élevé","pFr":"Les prêts sur salaire et les applications de « paie instantanée » sont la façon la plus chère d’emprunter. Pour les besoins de base urgents, essayez d’abord le 211 ou une banque alimentaire. C’est gratuit, pas un prêt."},
    {"h":"Pay highest-interest first","p":"If you owe on more than one thing, put extra money toward the debt with the biggest interest rate. It costs you the most each month.","hFr":"Remboursez d’abord le taux le plus élevé","pFr":"Si vous devez de l’argent à plus d’un endroit, mettez le surplus sur la dette au taux d’intérêt le plus élevé. C’est elle qui vous coûte le plus chaque mois."},
    {"h":"A tiny buffer beats a loan","p":"Even $5–10 set aside when you can means an unexpected cost doesn’t force you into borrowing at high interest later.","hFr":"Un petit coussin vaut mieux qu’un prêt","pFr":"Même 5 à 10 $ mis de côté quand c’est possible, et un imprévu ne vous force plus à emprunter à taux élevé plus tard."},
    {"h":"Prices rising? Review, don’t borrow","p":"When costs go up, the FCAC’s advice is to trim expenses and avoid taking on new debt, rather than covering the gap with credit.","hFr":"Les prix montent? Révisez, n’empruntez pas","pFr":"Quand les coûts augmentent, l’ACFC conseille de réduire les dépenses et d’éviter de nouvelles dettes, plutôt que de combler l’écart avec du crédit."}
  ];
  var SAY = {
    "en": {
      "talk": [
        "I don’t know where to start. I just need to talk to someone.",
        "I’m not doing okay, and I don’t want to be alone with this right now."
      ],
      "safe": [
        "I don’t feel safe at home. Can you help me understand my options?",
        "Someone close to me is scaring me. I don’t know what to do."
      ]
    },
    "fr": {
      "talk": [
        "Je ne sais pas par où commencer. J’ai juste besoin de parler à quelqu’un.",
        "Ça ne va pas, et je ne veux pas rester seul(e) avec ça en ce moment."
      ],
      "safe": [
        "Je ne me sens pas en sécurité chez moi. Pouvez-vous m’aider à comprendre mes options?",
        "Quelqu’un de proche me fait peur. Je ne sais pas quoi faire."
      ]
    }
  };
  /* {here} becomes "across Ontario" or "in Toronto"; {hereAll} names the chosen city */
  var INTRO = {
    "en": {
      "talk": "Whatever you’re carrying, whether it’s drugs, drinking, panic, grief, or just feeling like there’s no way out, trained responders are ready to listen. Free, confidential crisis lines and support services are available 24/7 {here}. There are options for everyone, plus dedicated lines built for youth, Indigenous, Black, 2SLGBTQ+, Muslim, and student communities. Start here.",
      "food": "Free food banks and meal programs {here}. Most don’t ask for ID or a reason. Pick your city and your nearest option comes first.",
      "safe": "If someone is hurting you, scaring you, or controlling you, these lines are private and free {here}. They help you understand your choices and find a safe place, without ever forcing you into anything. Need to leave fast? The <b>Quick exit</b> button up top instantly swaps this page for the weather.",
      "comm": "Recovery and a fresh start are easier around people. Drop-in centres, youth hubs, recovery and faith groups. A healthy way to fill the time and belong, {here}.",
      "play": "Sport keeps kids and teens busy, connected, and well. These help families {here} cover registration and gear, even when money is tight.",
      "new": "Arriving somewhere new and not knowing what exists is its own kind of hard. Ontario has free settlement workers and free legal help, for jobs, language, housing, benefits, and your rights. Start here, {here}.",
      "money": "Money stress makes everything harder. These are free Government of Canada tools, with no selling and no catch. Start with one small thing.",
      "all": "If your situation doesn’t fit a box, start here. One free call connects you to a real person who can point you to food, housing, health, money, and more, {hereAll}."
    },
    "fr": {
      "talk": "Peu importe ce que vous portez, que ce soit la drogue, l’alcool, la panique, le deuil, ou juste l’impression qu’il n’y a pas d’issue, des intervenants formés sont prêts à écouter. Des lignes de crise et des services de soutien gratuits et confidentiels sont offerts 24/7 {here}. Il y a des options pour tout le monde, avec des lignes dédiées pour les jeunes et pour les communautés autochtones, noires, 2SLGBTQ+, musulmanes et étudiantes. Commencez ici.",
      "food": "Des banques alimentaires et des programmes de repas gratuits {here}. La plupart ne demandent ni pièce d’identité ni justification. Choisissez votre ville et l’option la plus proche s’affiche en premier.",
      "safe": "Si quelqu’un vous fait du mal, vous fait peur ou vous contrôle, ces lignes sont privées et gratuites {here}. Elles vous aident à comprendre vos choix et à trouver un endroit sûr, sans jamais rien vous imposer. Besoin de partir vite? Le bouton <b>Sortie rapide</b> en haut remplace instantanément cette page par la météo.",
      "comm": "Le rétablissement et un nouveau départ sont plus faciles quand on est bien entouré. Centres d’accueil, carrefours jeunesse, groupes de rétablissement et communautés de foi. Une façon saine d’occuper le temps et de trouver sa place, {here}.",
      "play": "Le sport garde les enfants et les ados occupés, connectés et en santé. Ces programmes aident les familles {here} à couvrir l’inscription et l’équipement, même quand l’argent est serré.",
      "new": "Arriver quelque part sans savoir ce qui existe, c’est déjà difficile en soi. L’Ontario offre gratuitement des travailleurs d’établissement et de l’aide juridique : emploi, langue, logement, prestations et vos droits. Commencez ici, {here}.",
      "money": "Le stress financier rend tout plus difficile. Voici des outils gratuits du gouvernement du Canada, sans vente et sans piège. Commencez par une petite chose.",
      "all": "Si votre situation n’entre dans aucune case, commencez ici. Un seul appel gratuit vous met en contact avec une vraie personne qui peut vous orienter : nourriture, logement, santé, argent et plus, {hereAll}."
    }
  };

  /* Situation chips under the search field. ids = a hand-picked list; otherwise the tab. */
  var SITUATIONS = [
    { id: "talk", icon: "talk", tab: "talk", en: "I need to talk to someone", fr: "J’ai besoin de parler à quelqu’un" },
    { id: "unsafe", icon: "safe", tab: "safe", crisis: "abuse", ids: ["911", "awhl", "khpsafe", "211safe", "ssl", "legalaid"],
      en: "I’m not safe at home", fr: "Je ne suis pas en sécurité chez moi" },
    { id: "food", icon: "food", tab: "food", en: "No food today", fr: "Rien à manger aujourd’hui" },
    { id: "sleep", icon: "bed", tab: "safe", ids: ["211safe", "211", "awhl", "khpsafe"], weather: true,
      en: "Nowhere to sleep tonight", fr: "Nulle part où dormir ce soir" },
    { id: "new", icon: "new", tab: "new", en: "New to Canada", fr: "Nouveau au Canada" },
    { id: "money", icon: "money", tab: "money", en: "Money trouble", fr: "Problèmes d’argent" }
  ];

  /* The three ways in, after 988.ca */
  var PATHS = [
    { id: "now", icon: "lifebuoy", hot: true, ids: ["911", "988", "khp", "connex", "211"] },
    { id: "unsure", icon: "compass", tab: "all" },
    { id: "someone", icon: "someone", ids: ["988", "khp", "connex", "awhl", "ssl", "211"] }
  ];

  /* Save key numbers: what goes into the contacts file */
  var CONTACTS = [
    { tel: "988", en: "988 Suicide Crisis Helpline", fr: "9-8-8 : Ligne d'aide en cas de crise de suicide", noteEn: "Call or text 988. Free, 24/7.", noteFr: "Appelez ou textez le 988. Gratuit, 24/7." },
    { tel: "911", en: "911 Emergency", fr: "911 Urgence", noteEn: "Someone is in danger right now.", noteFr: "Quelqu’un est en danger en ce moment." },
    { tel: "211", en: "211 Ontario", fr: "211 Ontario", noteEn: "Any help: food, shelter, money. Free, 24/7, 150+ languages.", noteFr: "Toute aide : nourriture, refuge, argent. Gratuit, 24/7, plus de 150 langues." },
    { tel: "811", en: "Health811", fr: "Santé811", noteEn: "A registered nurse. Free, 24/7.", noteFr: "Une infirmière autorisée. Gratuit, 24/7." },
    { tel: "+18006686868", en: "Kids Help Phone", fr: "Jeunesse, J'écoute", noteEn: "Or text CONNECT to 686868. Free, 24/7.", noteFr: "Ou textez PARLER au 686868. Gratuit, 24/7." },
    { tel: "+18665312600", en: "ConnexOntario", fr: "ConnexOntario", noteEn: "Addiction and mental health. Free, 24/7.", noteFr: "Dépendances et santé mentale. Gratuit, 24/7." },
    { tel: "+18668630511", en: "Assaulted Women's Helpline", fr: "Assaulted Women's Helpline", noteEn: "Abuse from a partner or family member. Free, 24/7.", noteFr: "Violence d’un partenaire ou d’un membre de la famille. Gratuit, 24/7." },
    { tel: "+18662991011", en: "Seniors Safety Line", fr: "Ligne d'assistance aux personnes âgées", noteEn: "Older adults facing abuse. Free, 24/7.", noteFr: "Personnes aînées victimes de maltraitance. Gratuit, 24/7." }
  ];

  /* Lines offered as tick boxes in the safety plan (step 5) */
  var PLAN_LINES = ["988", "211", "khp", "connex", "awhl", "811", "hope", "good2talk"];

  var STR = {
    en: {
      docTitle: "h3lp · free, verified help across Ontario",
      metaDesc: "h3lp is a free, friendly hub that connects everyone in Ontario to real, verified help: someone to talk to, a meal today, a safe place, community, free youth sports, newcomer and legal support, and money basics. No sign-up. No tracking.",
      skip: "Skip to help",
      stripLabel: "Emergency lines",
      stripNote: "Thinking of suicide, or someone in danger?",
      call988: "Call 988", call988Short: "988", call988Aria: "Call 988, the suicide crisis helpline",
      text988: "Text 988", text988Short: "Text", text988Aria: "Text 988, the suicide crisis helpline",
      call911: "Call 911", call911Short: "911", call911Aria: "Call 911, emergency",
      exit: "Quick exit", exitShort: "Exit", exitAria: "Quick exit: leave this site now and open the weather",
      shiftHint: "or press Shift 3 times",
      shiftLive: "Shift pressed {n} of 3 times",
      brandAria: "h3lp, back to the top",
      langBtn: "FR", langBtnLang: "fr", langBtnAria: "Passer au français",
      h1: "You don’t have to figure this out alone.",
      lede: "Free help across Ontario, checked by hand. What you type here stays on this device.",
      sos: { a: "Thinking of suicide? Call or text", b: ", free, any hour. Someone in danger right now? Call", c: "." },
      searchLabel: "What’s going on?",
      searchPlaceholder: "Say it in your own words",
      searchHelp: "For example: I can’t pay my rent. Nothing you type is sent or saved.",
      searchClear: "Clear",
      results: "{n} services match", result1: "1 service matches",
      noMatch: "Nothing matched those words yet. 211 can help with almost anything, any time.",
      crisis: {
        self: "You matter. You can talk to someone right now.",
        abuse: "It is not your fault. You deserve to be safe. You can talk to someone right now.",
        overdose: "If someone has taken too much, call 911 now. Stay with them if it is safe.",
        others: "You reached out, and that matters. You can talk to someone right now, before anything happens.",
        someone: "You can call or text 988 together, or call to ask how to help them."
      },
      seeAll: "See all: {tab}",
      chipsLabel: "Or tap what fits",
      pathsLabel: "Or start here",
      paths: {
        now: { label: "I need help right now", sub: "Call or text, any hour", title: "Help right now",
          lead: "If you or someone else is in danger, call 911. To talk about suicide, a crisis or anything that feels too heavy, call or text 988. Both are free, any hour." },
        unsure: { label: "I’m not sure what I need", sub: "One call to 211 covers almost anything", title: "Not sure where to start?" },
        someone: { label: "I’m worried about someone", sub: "How to help, and who can help you help", title: "When you’re worried about someone",
          lead: "You don’t need special training to help. These steps come from crisis lines.",
          steps: [
            "Ask how they are, and listen. It is okay to ask them directly if they are thinking about suicide. Asking does not put the idea in their head.",
            "You don’t have to fix it. Stay calm, stay with them, and take them seriously.",
            "Help them reach support. You can call or text 988 together, any hour.",
            "If they are in danger right now, call 911. Stay with them if it is safe for you.",
            "Look after yourself too. 988 also supports people who are worried about someone."
          ] }
      },
      whileYouWait: "While you wait, or before you call",
      breatheLink: "Breathe with me for a minute",
      whereq: "Where are you?",
      cityNote: "Your city changes the food listings and the weather check. Phone lines work anywhere in Ontario.",
      cityAria: "Choose your Ontario city",
      browseTitle: "Browse by need",
      backToBrowse: "Browse other needs",
      hintAll: "{n} services in this list. Your city changes the food listings; phone lines work anywhere in Ontario.",
      hintCity: "{n} services in this list for {city}. Local food help comes first; phone lines work anywhere in Ontario.",
      saySummary: "Not sure what to say? Tap for opening lines",
      sayReassure: "You don’t need the right words. They’re trained to carry the conversation from there.",
      status: { always: "24/7", open: "Open now, until {t}", opens: "Opens {t}", opensDay: "Opens {day} {t}", confirm: "Call to confirm hours", online: "Online, any time" },
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      copyNumber: "Copy number", copied: "Copied", share: "Share", shared: "Link copied",
      shareSuffix: "free, verified help via h3lp",
      tagLocal: "Local · confirm hours with 211", tagChecked: "Checked July 2026",
      tagIn: "In {city}",
      scope: { on: "Anywhere in Ontario", ca: "Across Canada", finder: "Search for one near you" },
      exitHelp: "To leave fast, tap Exit at the top, or press Shift 3 times.",
      exitPrivacy: "Quick exit does not clear your history. Use a private window if someone checks your phone.",
      weather: {
        cold: "Feels like {t} tonight in {city}. If you or someone you know needs a warm place, call 211, any time.",
        hot: "Feels like {t} today in {city}. If you or someone you know needs a cool place, call 211, any time.",
        source: "Forecast from Open-Meteo. Not an official warning.",
        call: "Call 211", safe: "Safe places"
      },
      toolsTitle: "Tools for right now",
      toolsLead: "Simple things that work on this device, even offline.",
      tools: {
        breathe: { title: "Breathe with me", sub: "One minute of slow breathing, or a grounding exercise." },
        plan: { title: "My safety plan", sub: "Write down what helps, for the hard moments. Print it, or keep it here." },
        numbers: { title: "Save key numbers", sub: "Add 988, 211 and other free lines to your contacts in one tap." },
        wallet: { title: "Print a wallet card", sub: "The key numbers on a small card for your wallet." }
      },
      close: "Close",
      breathe: {
        label: "While you wait, or before you call. This does not replace talking to someone.",
        modeBreath: "Slow breathing", modeGround: "5-4-3-2-1 grounding",
        caution: "Breathe gently, do not force it. Stop if you feel dizzy.",
        start: "Start, one minute", pause: "Pause", resume: "Continue", again: "Again",
        ready: "Sit or stand however is comfortable. Breathe in for 4, out for 6.",
        in: "Breathe in", out: "Breathe out",
        left: "{s} seconds left",
        done: "That was one minute. How do you feel? You can still talk to someone, any time.",
        groundIntro: "Keep your eyes open. Look around and name, out loud or in your head:",
        ground: ["5 things you can see", "4 things you can touch", "3 things you can hear", "2 things you can smell", "1 thing you can taste"],
        next: "Next", back: "Back", groundDone: "You did it. Notice how you feel now. You can still talk to someone, any time."
      },
      plan: {
        intro: "A plan for hard moments, written while you feel steadier. Go through the steps in order. If one does not help, try the next.",
        credit: "Based on the Safety Planning Intervention by Stanley and Brown.",
        notReplace: "This plan does not replace professional help. In danger right now? Call 911.",
        steps: [
          { t: "My warning signs", h: "Thoughts, feelings or situations that tell me a hard time may be starting.", p: "For example: I stop answering messages" },
          { t: "Things I can do on my own to cope", h: "Small things that calm me or take my mind off it.", p: "For example: a walk, a shower, music" },
          { t: "People and places that take my mind off things", h: "Who I can be around, and where I can go, without having to talk about it.", p: "For example: my cousin, the library" },
          { t: "People I can ask for help", h: "Names and numbers of people I trust to tell how I feel.", p: "Name and phone number" },
          { t: "Crisis lines and professionals", h: "Lines I can call or text any time. Add my own doctor or counsellor below.", p: "My doctor, counsellor or clinic" },
          { t: "Making my space safer", h: "Things I can do to make where I am safer when I feel this way, like asking someone I trust to keep certain things for me for a while.", p: "What I will do" },
          { t: "My reasons to keep going", h: "Optional. People, plans, pets or things I care about.", p: "For example: my dog, my sister, seeing the lake" }
        ],
        modeTitle: "Keep it private",
        modePrint: "Don’t save, just print",
        modeSave: "Save on this device",
        saveWarn: "Saved only in this browser, never sent anywhere. Anyone who uses this device could open it. On iPhone, Safari may erase it after 7 days without a visit, so print a copy or save it as an image too.",
        statusSaved: "Saved on this device.",
        statusTemp: "Not saved. It will be gone when you close this page.",
        del: "Delete my plan", deleted: "Your plan was deleted from this device.",
        printFull: "Print full page", printWallet: "Print wallet size", saveImage: "Save as image",
        imageName: "my-safety-plan.png",
        printFoot: "In danger right now? Call 911. Call or text 988 any time. h3lp.francobernal.ca"
      },
      numbers: {
        lead: "Adds these free lines to your phone’s contacts. The file is made on this device; nothing is sent.",
        save: "Save to contacts", after: "Open the downloaded file to add them to your contacts.",
        fileName: "h3lp-key-numbers.vcf"
      },
      pcSub: "free, verified help in Ontario · keep this card",
      pc988: "Suicide crisis line, call or text, 24/7",
      pc911: "Someone is in danger right now",
      pc211: "Any help: food, shelter, money, anything, 24/7",
      pc811: "A registered nurse, free, 24/7",
      pcKids: "Kids Help Phone (or text CONNECT to 686868), 24/7",
      pcConnex: "ConnexOntario: addiction & mental health, 24/7",
      pcAWHL: "Assaulted Women's Helpline, 24/7",
      pcSSL: "Seniors Safety Line, 24/7",
      pcFoot: "All lines are free and confidential. More help: h3lp.francobernal.ca",
      aboutTitle: "About h3lp",
      about: "h3lp is a free signpost for Ontario, made by Franco Bernal. We don’t run any of these services. We point you to trusted Ontario and Canada-wide organizations so you can reach real help directly. Every number was checked by hand; confirm local details by calling 211.",
      privacyTitle: "Privacy",
      privacy: "No account, no cookies, no tracking. What you type stays on this device. If you choose a city, h3lp asks Open-Meteo for that city’s weather forecast; nothing about you is sent. After your first visit, h3lp works without a connection.",
      report: "Report a broken link", reportSub: "Opens your email app.",
      reportSubject: "h3lp: a link or number needs fixing",
      sky: "The line and the light at the top of the page follow the sky over Toronto right now.",
      sunrise: "Next sunrise: {t}.",
      danger: "In immediate danger? Call 911.",
      quote: "“Reason remains bulletproof, even when written in code.”",
      madeby: "Made by a civilian, for all civilians",
      cred: "© 2026 Franco Bernal · Free forever · Proudly built in Ontario, Canada",
      here: "across Ontario", hereCity: "in {city}", hereAll: "anywhere in Ontario", hereAllCity: "including {city}",
      facts: { checked: "Every number checked by hand, July 2026", lang: "English and French", offline: "Works offline after your first visit" },
      nfTitle: "This page doesn’t exist.",
      nfBody: "The link may be out of date, or the address slightly off.",
      nfHelp: "Need help now? Call or text 988, any hour. If someone is in danger, call 911. For anything else, call 211.",
      nfHome: "Back to h3lp",
      nsLead: "Search and tools need JavaScript, which is off. These free lines work any time:",
      ns211: "Full list of local services: 211ontario.ca"
    },
    fr: {
      docTitle: "h3lp · de l’aide gratuite et vérifiée, partout en Ontario",
      metaDesc: "h3lp est un carrefour gratuit et convivial qui relie tout le monde en Ontario à de l’aide réelle et vérifiée : quelqu’un à qui parler, un repas aujourd’hui, un endroit sûr, une communauté, du sport gratuit pour les jeunes, du soutien aux nouveaux arrivants, de l’aide juridique et les bases de l’argent. Sans inscription. Sans traçage.",
      skip: "Aller à l’aide",
      stripLabel: "Lignes d’urgence",
      stripNote: "Vous pensez au suicide, ou quelqu’un est en danger?",
      call988: "Appeler le 988", call988Short: "988", call988Aria: "Appeler le 988, la ligne d’aide en cas de crise de suicide",
      text988: "Texto au 988", text988Short: "Texto", text988Aria: "Texter le 988, la ligne d’aide en cas de crise de suicide",
      call911: "Appeler le 911", call911Short: "911", call911Aria: "Appeler le 911, urgence",
      exit: "Sortie rapide", exitShort: "Sortir", exitAria: "Sortie rapide : quitter ce site maintenant et ouvrir la météo",
      shiftHint: "ou appuyez 3 fois sur Maj",
      shiftLive: "Touche Maj : {n} sur 3",
      brandAria: "h3lp, retour en haut",
      langBtn: "EN", langBtnLang: "en", langBtnAria: "Switch to English",
      h1: "Vous n’avez pas à traverser ça seul(e).",
      lede: "De l’aide gratuite partout en Ontario, vérifiée à la main. Ce que vous écrivez ici reste sur cet appareil.",
      sos: { a: "Vous pensez au suicide? Appelez ou textez le", b: ", gratuit, à toute heure. Quelqu’un est en danger en ce moment? Composez le", c: "." },
      searchLabel: "Qu’est-ce qui se passe?",
      searchPlaceholder: "Dites-le dans vos mots",
      searchHelp: "Par exemple : je n’arrive pas à payer mon loyer. Rien de ce que vous écrivez n’est envoyé ni enregistré.",
      searchClear: "Effacer",
      results: "{n} services correspondent", result1: "1 service correspond",
      noMatch: "Aucun résultat pour ces mots. Le 211 peut aider pour presque tout, à toute heure.",
      crisis: {
        self: "Vous comptez. Vous pouvez parler à quelqu’un dès maintenant.",
        abuse: "Ce n’est pas votre faute. Vous méritez d’être en sécurité. Vous pouvez parler à quelqu’un dès maintenant.",
        overdose: "Si quelqu’un a trop consommé, appelez le 911 maintenant. Restez avec la personne si c’est sécuritaire.",
        others: "Vous avez tendu la main, et ça compte. Vous pouvez parler à quelqu’un dès maintenant, avant que quelque chose arrive.",
        someone: "Vous pouvez appeler ou texter le 988 ensemble, ou appeler pour savoir comment aider la personne."
      },
      seeAll: "Tout voir : {tab}",
      chipsLabel: "Ou touchez ce qui vous ressemble",
      pathsLabel: "Ou commencez ici",
      paths: {
        now: { label: "J’ai besoin d’aide tout de suite", sub: "Appel ou texto, à toute heure", title: "De l’aide tout de suite",
          lead: "Si vous ou quelqu’un d’autre êtes en danger, appelez le 911. Pour parler de suicide, d’une crise ou de tout ce qui semble trop lourd, appelez ou textez le 988. Les deux sont gratuits, à toute heure." },
        unsure: { label: "Je ne sais pas trop ce qu’il me faut", sub: "Un appel au 211 couvre presque tout", title: "Vous ne savez pas par où commencer?" },
        someone: { label: "Je m’inquiète pour quelqu’un", sub: "Comment aider, et qui peut vous aider à aider", title: "Quand vous vous inquiétez pour quelqu’un",
          lead: "Pas besoin de formation spéciale pour aider. Ces étapes viennent des lignes de crise.",
          steps: [
            "Demandez à la personne comment elle va, et écoutez. Vous pouvez lui demander directement si elle pense au suicide. Poser la question ne lui donne pas l’idée.",
            "Vous n’avez pas à tout régler. Restez calme, restez avec elle et prenez-la au sérieux.",
            "Aidez-la à joindre du soutien. Vous pouvez appeler ou texter le 988 ensemble, à toute heure.",
            "Si elle est en danger immédiat, appelez le 911. Restez avec elle si c’est sécuritaire pour vous.",
            "Prenez soin de vous aussi. Le 988 soutient aussi les personnes inquiètes pour quelqu’un."
          ] }
      },
      whileYouWait: "En attendant, ou avant d’appeler",
      breatheLink: "Respirez avec moi pendant une minute",
      whereq: "Où êtes-vous?",
      cityNote: "Votre ville change les ressources alimentaires et la vérification météo. Les lignes téléphoniques fonctionnent partout en Ontario.",
      cityAria: "Choisissez votre ville en Ontario",
      browseTitle: "Parcourir par besoin",
      backToBrowse: "Parcourir d’autres besoins",
      hintAll: "{n} services dans cette liste. Votre ville change les ressources alimentaires; les lignes téléphoniques fonctionnent partout en Ontario.",
      hintCity: "{n} services dans cette liste pour {city}. L’aide alimentaire locale passe en premier; les lignes téléphoniques fonctionnent partout en Ontario.",
      saySummary: "Vous ne savez pas quoi dire? Touchez pour des phrases d’ouverture",
      sayReassure: "Vous n’avez pas besoin des mots parfaits. Ces personnes sont formées pour porter la conversation à partir de là.",
      status: { always: "24/7", open: "Ouvert jusqu’à {t}", opens: "Ouvre à {t}", opensDay: "Ouvre {day} à {t}", confirm: "Heures à confirmer", online: "En ligne, en tout temps" },
      days: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
      copyNumber: "Copier le numéro", copied: "Copié", share: "Partager", shared: "Lien copié",
      shareSuffix: "aide gratuite et vérifiée via h3lp",
      tagLocal: "Local · confirmez les heures au 211", tagChecked: "Vérifié en juillet 2026",
      tagIn: "À {city}",
      scope: { on: "Partout en Ontario", ca: "Partout au Canada", finder: "Cherchez le plus proche" },
      exitHelp: "Pour partir vite, touchez Sortir en haut, ou appuyez 3 fois sur Maj.",
      exitPrivacy: "La sortie rapide n’efface pas votre historique. Utilisez une fenêtre privée si quelqu’un vérifie votre téléphone.",
      weather: {
        cold: "Ressenti de {t} ce soir à {city}. Si vous ou une personne que vous connaissez avez besoin d’un endroit chaud, appelez le 211, à toute heure.",
        hot: "Ressenti de {t} aujourd’hui à {city}. Si vous ou une personne que vous connaissez avez besoin d’un endroit frais, appelez le 211, à toute heure.",
        source: "Prévision d’Open-Meteo. Ce n’est pas un avertissement officiel.",
        call: "Appeler le 211", safe: "Endroits sûrs"
      },
      toolsTitle: "Des outils pour maintenant",
      toolsLead: "Des outils simples qui fonctionnent sur cet appareil, même hors ligne.",
      tools: {
        breathe: { title: "Respirez avec moi", sub: "Une minute de respiration lente, ou un exercice d’ancrage." },
        plan: { title: "Mon plan de sécurité", sub: "Notez ce qui vous aide, pour les moments difficiles. Imprimez-le, ou gardez-le ici." },
        numbers: { title: "Enregistrer les numéros clés", sub: "Ajoutez le 988, le 211 et d’autres lignes gratuites à vos contacts, d’un seul geste." },
        wallet: { title: "Imprimer une carte portefeuille", sub: "Les numéros clés sur une petite carte pour votre portefeuille." }
      },
      close: "Fermer",
      breathe: {
        label: "En attendant, ou avant d’appeler. Cela ne remplace pas une conversation avec quelqu’un.",
        modeBreath: "Respiration lente", modeGround: "Ancrage 5-4-3-2-1",
        caution: "Respirez doucement, sans forcer. Arrêtez si vous avez un étourdissement.",
        start: "Commencer, une minute", pause: "Pause", resume: "Continuer", again: "Recommencer",
        ready: "Assis ou debout, comme vous êtes bien. Inspirez sur 4, expirez sur 6.",
        in: "Inspirez", out: "Expirez",
        left: "Encore {s} secondes",
        done: "C’était une minute. Comment vous sentez-vous? Vous pouvez toujours parler à quelqu’un, à toute heure.",
        groundIntro: "Gardez les yeux ouverts. Regardez autour de vous et nommez, à voix haute ou dans votre tête :",
        ground: ["5 choses que vous voyez", "4 choses que vous pouvez toucher", "3 choses que vous entendez", "2 choses que vous pouvez sentir", "1 chose que vous pouvez goûter"],
        next: "Suivant", back: "Retour", groundDone: "Bravo. Remarquez comment vous vous sentez maintenant. Vous pouvez toujours parler à quelqu’un, à toute heure."
      },
      plan: {
        intro: "Un plan pour les moments difficiles, écrit quand vous vous sentez plus stable. Suivez les étapes dans l’ordre. Si une étape n’aide pas, passez à la suivante.",
        credit: "Inspiré de l’intervention de planification de la sécurité de Stanley et Brown.",
        notReplace: "Ce plan ne remplace pas l’aide professionnelle. En danger immédiat? Appelez le 911.",
        steps: [
          { t: "Mes signes d’alerte", h: "Les pensées, émotions ou situations qui me disent qu’un moment difficile commence peut-être.", p: "Par exemple : je ne réponds plus aux messages" },
          { t: "Ce que je peux faire par moi-même pour tenir le coup", h: "Des petites choses qui me calment ou me changent les idées.", p: "Par exemple : marcher, une douche, de la musique" },
          { t: "Des gens et des lieux qui me changent les idées", h: "Avec qui je peux passer du temps, et où je peux aller, sans devoir en parler.", p: "Par exemple : ma cousine, la bibliothèque" },
          { t: "Les personnes à qui je peux demander de l’aide", h: "Le nom et le numéro de personnes de confiance à qui dire comment je me sens.", p: "Nom et numéro de téléphone" },
          { t: "Lignes de crise et professionnels", h: "Des lignes à appeler ou à texter en tout temps. Ajoutez votre médecin ou votre intervenant ci-dessous.", p: "Mon médecin, mon intervenant ou ma clinique" },
          { t: "Rendre mon espace plus sûr", h: "Ce que je peux faire pour rendre l’endroit où je suis plus sûr quand je me sens ainsi, comme demander à une personne de confiance de garder certaines choses pour moi pendant un temps.", p: "Ce que je vais faire" },
          { t: "Mes raisons de continuer", h: "Facultatif. Des personnes, des projets, des animaux ou des choses qui comptent pour moi.", p: "Par exemple : mon chien, ma sœur, voir le lac" }
        ],
        modeTitle: "Gardez-le privé",
        modePrint: "Ne pas enregistrer, seulement imprimer",
        modeSave: "Enregistrer sur cet appareil",
        saveWarn: "Enregistré seulement dans ce navigateur, jamais envoyé. Toute personne qui utilise cet appareil pourrait l’ouvrir. Sur iPhone, Safari peut l’effacer après 7 jours sans visite : imprimez-en une copie ou enregistrez-le aussi en image.",
        statusSaved: "Enregistré sur cet appareil.",
        statusTemp: "Non enregistré. Il disparaîtra quand vous fermerez cette page.",
        del: "Supprimer mon plan", deleted: "Votre plan a été supprimé de cet appareil.",
        printFull: "Imprimer en pleine page", printWallet: "Imprimer en format portefeuille", saveImage: "Enregistrer en image",
        imageName: "mon-plan-de-securite.png",
        printFoot: "En danger immédiat? Appelez le 911. Appelez ou textez le 988 à toute heure. h3lp.francobernal.ca"
      },
      numbers: {
        lead: "Ajoute ces lignes gratuites aux contacts de votre téléphone. Le fichier est créé sur cet appareil; rien n’est envoyé.",
        save: "Ajouter aux contacts", after: "Ouvrez le fichier téléchargé pour les ajouter à vos contacts.",
        fileName: "h3lp-numeros-cles.vcf"
      },
      pcSub: "de l’aide gratuite et vérifiée en Ontario · gardez cette carte",
      pc988: "Ligne de crise suicide, appel ou texto, 24/7",
      pc911: "Quelqu’un est en danger en ce moment",
      pc211: "Toute aide : nourriture, refuge, argent, tout, 24/7",
      pc811: "Une infirmière autorisée, gratuit, 24/7",
      pcKids: "Jeunesse, J'écoute (ou textez PARLER au 686868), 24/7",
      pcConnex: "ConnexOntario : dépendances et santé mentale, 24/7",
      pcAWHL: "Assaulted Women's Helpline (violence conjugale), 24/7",
      pcSSL: "Ligne d'assistance aux personnes âgées, 24/7",
      pcFoot: "Toutes ces lignes sont gratuites et confidentielles. Plus d’aide : h3lp.francobernal.ca",
      aboutTitle: "À propos de h3lp",
      about: "h3lp est un point de repère gratuit pour l’Ontario, créé par Franco Bernal. Nous n’exploitons aucun de ces services. Nous vous dirigeons vers des organismes de confiance, ontariens et pancanadiens, pour que vous rejoigniez l’aide réelle directement. Chaque numéro a été vérifié à la main; confirmez les détails locaux en appelant le 211.",
      privacyTitle: "Confidentialité",
      privacy: "Aucun compte, aucun témoin, aucun traçage. Ce que vous écrivez reste sur cet appareil. Si vous choisissez une ville, h3lp demande à Open-Meteo la prévision météo de cette ville; rien à votre sujet n’est envoyé. Après votre première visite, h3lp fonctionne sans connexion.",
      report: "Signaler un lien brisé", reportSub: "Ouvre votre application courriel.",
      reportSubject: "h3lp : un lien ou un numéro à corriger",
      sky: "La ligne et la lumière en haut de la page suivent le ciel de Toronto en ce moment.",
      sunrise: "Prochain lever du soleil : {t}.",
      danger: "En danger immédiat? Composez le 911.",
      quote: "« La raison reste à l’épreuve des balles, même écrite en code. »",
      madeby: "Fait par un civil, pour tous les civils",
      cred: "© 2026 Franco Bernal · Gratuit pour toujours · Fièrement conçu en Ontario, au Canada",
      here: "partout en Ontario", hereCity: "à {city}", hereAll: "partout en Ontario", hereAllCity: "y compris à {city}",
      facts: { checked: "Chaque numéro vérifié à la main, juillet 2026", lang: "Français et anglais", offline: "Fonctionne hors ligne après votre première visite" },
      nfTitle: "Cette page n’existe pas.",
      nfBody: "Le lien est peut-être périmé, ou l’adresse légèrement erronée.",
      nfHelp: "Besoin d’aide maintenant? Appelez ou textez le 988, à toute heure. Si quelqu’un est en danger, composez le 911. Pour tout le reste, appelez le 211.",
      nfHome: "Retour à h3lp",
      nsLead: "La recherche et les outils ont besoin de JavaScript, qui est désactivé. Ces lignes gratuites fonctionnent en tout temps :",
      ns211: "Liste complète des services locaux : 211ontario.ca/fr"
    }
  };

  return { TABS: TABS, CITIES: CITIES, R: R, TIPS: TIPS, SAY: SAY, INTRO: INTRO, SITUATIONS: SITUATIONS, PATHS: PATHS, CONTACTS: CONTACTS, PLAN_LINES: PLAN_LINES, STR: STR };
});
