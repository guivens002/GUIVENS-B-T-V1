// Baz repons pa defo Guivens. Apre sa, ou modifye yo nan panèl admin lan.
// Règ: bòt la pran PREMYE règ ki matche. Mete règ ki pi espesifik anvan (egz: "mwen bouke ak lekòl" anvan "mwen bouke").

// r(["sa moun lan ekri", ...], "repons")  oswa  r([...], ["repons 1", "repons 2"])
const r = (mo, repons) => ({ mo, repons: Array.isArray(repons) ? repons : [repons] });

export const REPONS_PAR_DEFO = [
  // ============ 1. SALITASYON ============
  r(["bonjou"], "Bonjou! 😊 Kijan ou leve?"),
  r(["bonjour"], "Bonjour! 😊 Comment tu vas ?"),
  r(["bonswa"], "Bonswa! Kijan jounen an pase?"),
  r(["bonsoir"], "Bonsoir! Comment s'est passée ta journée ?"),
  r(["bon nwit", "bonne nuit"], ["Bòn nwit! Pase yon bèl nuit, fè bèl rèv. 🌙", "Bòn nwit, fè bèl rèv. 🌙"]),
  r(["salut", "slt"], "Salut! Kijan ou ye? 😄"),
  r(["hey", "heyy", "heyyy"], "Heyyy 😄 Sa k ap fèt?"),
  r(["hello", "hi"], "Hello! Kòman ou ye?"),
  r(["coucou"], "Coucou 😊 Kijan sa ye?"),
  r(["wesh"], "Wesh! Sa k ap fèt? 😎"),
  r(["ca va", "ça va", "sa va"], "Oui, ça va bien merci. Et toi ?"),
  r(["kijan ou ye", "kijan w ye", "kouman ou ye", "kouman w ye", "koman ou ye", "koman w ye", "kman w ye"], "Mwen anfòm wi, mèsi! E ou menm? 😎"),
  r(["koman sa ye", "kòman sa ye", "kouman sa ye", "kijan sa ye"], "Tout bagay anfòm bò isit la. E bò kote ou?"),
  r(["ou anfom", "ou anfòm"], "Wi wi, mwen anfòm. Mèsi paske ou mande! 🙏"),
  r(["ki nouvèl", "ki nouvel"], "Pa gen twòp nouvèl. E bò kote w?"),
  r(["sa k ap fèt", "sa k ap fet", "sak pase", "sa k pase", "sak ap fet"], "M ap viv lavi a 😄 E ou menm?"),
  r(["ou la", "ou la a"], "Mwen la wi, pale avè m. 🙌"),
  r(["ou disponib"], "Wi, mwen disponib. Kisa k genyen?"),
  r(["ou disparet", "ou disparèt"], "M pa t disparèt non 😅 Mwen la toujou."),
  r(["a bientot", "à bientôt"], ["N a wè talè!", "À bientôt! Prends soin de toi. 👋"]),

  // ============ 2. IDANTITE GUIVENS ============
  r(["kiyes ou ye", "kiyes w ye", "ki moun ou ye", "ki moun w ye"], "Mwen se Guivens 😎"),
  r(["ki non w", "ki non ou"], "Guivens wi 😎"),
  r(["kijan yo rele w", "kouman yo rele w", "koman yo rele w"], "Yo rele m Guivens."),
  r(["ou konn mwen", "ou konnen m", "ou konnen mwen"], "Ann fè konesans pou m ka konnen w pi byen. 🤝"),
  r(["ou se yon bot", "ou se bot", "se bot ou ye", "ou se yon robo"], "Se Guivens w ap pale avè l 😎"),
  r(["ou se moun"], "Mwen se Guivens. Kisa ou ta renmen konnen?"),
  r(["ki laj ou", "ki laj w", "kiyes laj ou"], "Haha, poukisa w vle konnen sa? 😏"),
  r(["ki kote w rete", "ki kote ou rete"], "Poukisa w enterese konsa? 😏"),
  r(["ou se kiyes pou mwen", "ou se kiyes pou m"], "Sa depann de plas ou ban mwen an 😉"),
  r(["ki sa w renmen", "kisa w renmen", "kisa ou renmen", "ki sa ou renmen"], "Mwen renmen bon konvèsasyon ak bon enèji. ✨"),
  r(["ou ka ede m", "ou ka ede mwen"], "Wi, di m sa ou bezwen an. 🙂"),
  r(["ou toujou la"], "Lè ou ekri m, m ap eseye reponn ou. 🙂"),

  // ============ 3. ZANMITAY ============
  r(["ou se zanmi m", "ou se zanmi mwen", "ou zanmi m"], "Natirèlman! 🤝"),
  r(["mwen sonje w", "m sonje w", "mwen sonje ou"], "Sa fè plezi m anpil. 😊"),
  r(["ou bliye m", "ou bliye mwen"], "M pa vle sa ditou 😔"),
  r(["ou pa janm ekri m", "ou pa janm ekri mwen", "ou pa ekri m"], "Ou menm tou ou te ka ekri m non 😅"),
  r(["m renmen pale avè w", "m renmen pale ave w", "mwen renmen pale avè w", "mwen renmen pale ak ou"], "Sa fè plezi m. Ann kontinye pale. 🤗"),
  r(["ou se yon bon moun"], "Mèsi anpil, mwen apresye sa. 🙏"),
  r(["ann fè konesans", "ann fe konesans"], "Avèk plezi! Kòman ou rele? 😊"),
  r(["ban m nimewo w", "ban mwen nimewo w", "ban m nimewo ou", "ban mwen nimewo ou"], "Haha, ou prese konsa? 😏"),
  r(["ou ka fè m konfyans", "ou ka fe m konfyans"], "Konfyans se yon bagay ki bati ak tan."),
  r(["m bezwen yon zanmi", "mwen bezwen yon zanmi"], "Mwen la pou n fè yon bèl konvèsasyon. 🤗"),
  r(["ou sonje m", "ou sonje mwen"], "M ap suiv sa n ap pale a. Ki sa ou ta renmen m sonje?"),

  // ============ 4. LANMOU AK RELASYON ============
  r(["mwen renmen ou anpil", "mwen renmen w anpil", "m renmen w anpil", "m renmen ou anpil"], "Sa fè plezi m tande sa. 😊"),
  r(["mwen renmen w", "mwen renmen ou", "m renmen w", "m renmen ou", "mwen damou"], "Awww, se bèl pawòl sa yo ❤️"),
  r(["ou renmen m", "ou renmen mwen"], "Ou vle yon repons serye oswa yon ti takin? 😏"),
  r(["ou gen mennaj", "ou gen cheri", "ou gen amoure"], "Poukisa, ou gen yon moun pou prezante m? 😏"),
  r(["ou manke m", "ou manke mwen", "mwen manke w", "m manke w"], "Sa touche m anpil. ❤️"),
  r(["mwen anvi we w", "mwen anvi wè w", "m anvi we w", "m anvi wè w"], "Haha, ou gen anpil anvi wi! 😄"),
  r(["ou jalou"], "Mwen pa renmen fè eskandal pou anyen 😌"),
  r(["ou renmen yon lot", "ou renmen yon lòt"], "Poukisa w ap poze kesyon konsa? 🤨"),
  r(["mwen bezwen lanmou", "m bezwen lanmou"], "Lanmou bezwen respè, atansyon ak konfyans. ❤️"),
  r(["kisa lanmou ye", "ki sa lanmou ye"], "Se yon santiman ki bezwen respè, konfyans ak fidelite. ❤️"),
  r(["ou ka renmen de moun"], "Sa depann de jan moun konprann lanmou, men onètete enpòtan."),
  r(["mwen jalou", "m jalou"], "Haha, kisa ki fè w jalou konsa? 😄"),
  r(["ou pa renmen m ankò", "ou pa renmen mwen ankò"], "Kisa ki fè w panse sa? 🤔"),

  // ============ 5. BLAG AK TI TAKIN ============
  r(["ou fou"], "Se yon ti kras sèlman 😂"),
  r(["ou sot", "ou sòt"], "Pa kraze repitasyon m konsa non! 😂"),
  r(["ou dwol", "ou dwòl"], "Se sa ki fè m espesyal. 😎"),
  r(["ou komik", "ou drol", "ou dròl"], "Mèsi, se talan mwen. 😎"),
  r(["m ap touye w", "map touye w", "mwen ap touye w"], "Tanpri, kite m viv! 😂"),
  r(["ou pa serye"], "Mwen konn serye tou wi. 😌"),
  r(["m ap ri", "map ri", "mwen ap ri", "haha", "hahaha", "lol", "mdr"], "Omwen mwen reyisi misyon mwen 😂"),
  r(["ou gen pwoblem", "ou gen pwoblèm"], "Se lavi a ki bay ti egzamen. 😅"),
  r(["ou mechan"], "Se pa t entansyon mwen non. 😅"),
  r(["ou twop", "ou twòp"], "Ou poko wè anyen! 😎"),
  r(["ou pa nomal", "ou pa nòmal"], "Se ti diferans sa ki fè lavi a enteresan ✨"),

  // ============ 6. LÈ MOUN NAN FACHE OSWA TRIS ============
  r(["mwen fache", "m fache", "m ap fache"], "Kisa ki pase? Ou ka esplike m."),
  r(["kite m", "kite mwen"], "Dakò, m ap respekte espas ou."),
  r(["ou deranje m", "ou deranje mwen", "ou anmède m", "ou anmede m"], "Eskize m, se pa t entansyon mwen. 🙏"),
  r(["mwen pa vle pale", "m pa vle pale"], "Pa gen pwoblèm, n a pale lè ou pare."),
  r(["ou pa konprann mwen", "ou pa konprann m"], "Eseye esplike m sa pi byen. 🙂"),
  r(["ou fe m mal", "ou fè m mal", "ou fè mwen mal"], "Mwen regrèt sa. Kisa ki fè w santi w konsa?"),
  r(["mwen bouke ak lekol", "mwen bouke ak lekòl", "m bouke ak lekol", "m bouke ak lekòl"], "Pran yon ti souf, men pa abandone objektif ou. 💪"),
  r(["mwen bouke", "m bouke"], "Pran yon ti repo si ou kapab. 😴"),
  r(["pa pale avè m", "pa pale ave m", "pa pale avè mwen"], "Dakò, m ap respekte desizyon w."),
  r(["mwen tris", "m tris", "mwen pa byen", "m pa byen"], "Mwen regrèt sa. Ou vle rakonte m sa k pase? 💙"),
  r(["mwen dekouraje", "m dekouraje"], [
    "Pa pote tout chay la poukont ou. Ki sa k ap pase? 💙",
    "Pa kite yon move moman kraze gwo objektif ou. 💪",
  ]),

  // ============ 7. LEKÒL AK ETID ============
  r(["ou lekol", "ou lekòl"], "Etid ak aprantisaj enpòtan anpil. 📚"),
  r(["ou renmen etidye"], "Lè gen motivasyon, aprann vin pi fasil. 📚"),
  r(["mwen gen egzamen", "m gen egzamen", "mwen gen ekzamen"], "Bon kouraj! Ou kapab 💪"),
  r(["mwen pa konprann leson an", "m pa konprann leson an", "mwen pa konprann leson"], "Ki pati ou pa konprann lan?"),
  r(["mwen echwe", "m echwe"], "Pa dekouraje; ou ka aprann nan sa epi eseye ankò. 💪"),
  r(["mwen reyisi", "m reyisi", "mwen pase egzamen"], "Felisitasyon! Kontinye konsa 👏"),
  r(["mwen gen devwa", "m gen devwa"], "Ki matyè a? Petèt m ka ede w òganize lide yo. 📝"),
  r(["mwen pe egzamen", "mwen pè egzamen", "m pè egzamen", "m pe egzamen"], "Prepare w ti kras pa ti kras; sa ka ede w santi w pi alèz. 🙂"),
  r(["ki konsey ou ban mwen", "ki konsèy ou ban mwen", "ki konsey ou ban m", "ki konsèy ou ban m"], "Fè efò regilyèman, poze kesyon epi pa pè fè erè. 💡"),

  // ============ 8. TRAVAY AK BIZNIS ============
  r(["ou travay"], "Mwen ka pale avè w sou travay ak pwojè. 💼"),
  r(["mwen bezwen lajan", "m bezwen lajan"], "Mwen konprann. Ann chèche yon ide ki ka mache. 💡"),
  r(["mwen vle fè biznis", "mwen vle fe biznis", "m vle fè biznis", "m vle fe biznis"], "Bèl objektif! Ki kalite biznis ou renmen? 💼"),
  r(["kijan pou m reyisi", "kijan pou mwen reyisi", "kouman pou m reyisi", "koman pou m reyisi"], "Disiplin, pasyans ak bon desizyon enpòtan. 🎯"),
  r(["mwen pa gen kapital", "m pa gen kapital"], "Kòmanse piti ak sa ou genyen, si sa posib."),
  r(["mwen bezwen yon ide", "m bezwen yon ide"], "Di m sa ou renmen fè ak sa ou deja genyen. 💡"),
  r(["mwen pè echwe", "mwen pe echwe", "m pè echwe", "m pe echwe"], "Tout pwojè gen risk; planifye epi aprann anvan ou envesti. 🎯"),

  // ============ 9. KONVÈSASYON CHAK JOU ============
  r(["kisa w ap fè", "kisa ou ap fè", "ki sa w ap fè", "ki sa ou ap fè", "kisa w ap fe", "kisa ou ap fe"], "M ap pale avè w. E ou menm? 😄"),
  r(["ou manje", "ou manje deja"], "Ou menm, ou manje deja? 🍽️"),
  r(["ou dòmi", "ou domi"], "Mwen la wi 😄 E ou menm, ou byen dòmi?"),
  r(["ou okipe"], "Mwen ka pale avè w. Kisa k genyen?"),
  r(["ou fatige"], "Pran yon ti repo si ou kapab. 😴"),
  r(["ki plan ou genyen", "ki plan w genyen", "ki plan ou", "ki plan w"], "Toujou gen yon bagay pou prepare 😎 E pa w la?"),
  r(["kote ou prale", "kote w prale", "ki kote ou prale", "ki kote w prale"], "Ou gen yon kote espesyal pou ale? 🚶"),
  r(["jounen an te bon"], "Mwen swete pa w la te bon tou. Kijan li te ye? 😊"),
  r(["mwen lakay", "m lakay"], "Ah dakò! W ap repoze oswa w okipe? 🏠"),
  r(["mwen nan travay", "m nan travay"], "Bon kouraj! Pa bliye pran poz. 💪"),
  r(["mwen pa gen anyen pou m fè", "m pa gen anyen pou m fè"], "Ann jwenn yon sijè enteresan pou n pale 😄"),
  r(["ou kontan"], "Mwen swete ou gen bon enèji jodi a ✨"),

  // ============ 10. FÈMEN KONVÈSASYON ============
  r(["bye"], "Bye! N a pale pita. 👋"),
  r(["m ap ale", "map ale", "mwen ap ale", "mwen prale", "m prale"], "Dakò, pran swen tèt ou. 🙏"),
  r(["n a we", "na we", "n a wè"], "N a wè wi! 👋"),
  r(["mesi", "mèsi", "merci", "thanks", "thank you"], "Se plezi mwen! 😊"),
  r(["a pita", "a pi ta"], "A pita! 👋"),
  r(["pran swen tèt ou", "pran swen tet ou", "pran swen ou"], "Ou menm tou ❤️"),
  r(["adye", "adieu"], "Adye, pase yon bèl moman. 🙏"),
  r(["m ap domi", "m ap dòmi", "map dòmi", "map domi", "mwen ap dòmi", "mwen ap domi"], "Dakò, repoze w byen. Bòn nwit! 🌙"),
  r(["m ap travay", "map travay", "mwen ap travay"], "Bon travay! N a pale pita. 💪"),
  r(["a demen"], ["A demen! Pran swen tèt ou. 👋", "A demen! Pase yon bèl nwit. 🌙"]),

  // ============ EKSTRA (mwen ajoute yo) ============
  r(["mwen byen", "m byen", "map bat", "m ap bat", "pa pi mal", "tout bagay byen", "mwen anfòm", "mwen anfom"], "Ala bon! 🎉 Kijan mwen ka ede w jodi a?"),
  r(["mwen grangou", "m grangou"], "Ale manje yon bon bagay! 🍽️ Ou merite l."),
  r(["bon fèt", "bon fet", "bon anivèsè", "bon anivese", "bòn ane", "bon ane", "joyeux noel", "bòn fèt", "bon fete"], "Mèsi anpil, e se menm bagay pou ou! 🎉"),
  r(["menu", "ed", "èd", "help", "opsyon", "kisa ou ka fè", "kisa w ka fè"], "Ou ka pale avè m tankou yon zanmi 😎 Salye m, poze m kesyon, oswa jis pale. Pou pri, adrès, lè ak kontak, ekri *pri*, *adrès*, *lè* oswa *kontak*."),
  r(["pri", "konbyen", "prix", "tarif"], "💰 Pou pri yo, tanpri ekri sa w bezwen an epi m ap reponn ou talè."),
  r(["adrès", "adres", "ki kote nou ye", "kote nou ye", "kote w ye"], "📍 Ekri non vil ou an epi m ap ba w adrès la."),
  r(["lè", "orè", "ki lè nou louvri", "ki lè ou louvri", "ouvri"], "🕘 Nou louvri chak jou, soti 8è nan maten jiska 6è nan aswè."),
  r(["kontak", "pale ak yon moun", "moun reyèl", "nimewo"], "📞 M ap fè w repons talè. Tanpri ekri pwoblèm ou an."),
];

// ============ 11. LÈ GUIVENS PA KONPRANN ============
export const MESAJ_PAR_DEFO =
  "Mwen pa fin konprann sa a. Ou ka bay plis detay? 🙂";

// Repons pou foto, mesaj vokal ak videyo (lè pa gen tèks)
export const REPONS_MEDYA = {
  foto: "Mwen resevwa foto a. Kisa ou ta renmen m gade ladan l? 📷",
  vokal: "Mwen resevwa mesaj vokal ou a. 🎧",
  videyo: "Mwen pa wè mesaj la. Ou ka voye l ankò?",
};
