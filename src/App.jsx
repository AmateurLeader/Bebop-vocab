import { useState, useEffect, useCallback } from "react";

const storage = {
  get: (key) => { try { const v = localStorage.getItem(key); return v ? { value: v } : null; } catch(e) { return null; } },
  set: (key, value) => { try { localStorage.setItem(key, value); return true; } catch(e) { return false; } },
};

// ─── EPISODE METADATA ───────────────────────────────────────────────
const EPISODES = [
  { id:1,  title:"Asteroid Blues",              titleJa:"アステロイド・ブルース" },
  { id:2,  title:"Stray Dog Strut",             titleJa:"野良犬のストラット" },
  { id:3,  title:"Honky Tonk Women",            titleJa:"ホンキィ・トンク・ウィメン" },
  { id:4,  title:"Gateway Shuffle",             titleJa:"ゲートウェイ・シャッフル" },
  { id:5,  title:"Ballad of Fallen Angels",     titleJa:"堕天使たちのバラッド" },
  { id:6,  title:"Sympathy for the Devil",      titleJa:"悪魔を憐れむ歌" },
  { id:7,  title:"Heavy Metal Queen",           titleJa:"ヘヴィ・メタル・クイーン" },
  { id:8,  title:"Waltz for Venus",             titleJa:"ワルツ・フォー・ヴィーナス" },
  { id:9,  title:"Jamming with Edward",         titleJa:"ジャミング・ウィズ・エドワード" },
  { id:10, title:"Ganymede Elegy",              titleJa:"ガニメデ慕情" },
  { id:11, title:"Toys in the Attic",           titleJa:"闇夜のヘヴィ・ロック" },
  { id:12, title:"Jupiter Jazz Pt.1",           titleJa:"ジュピター・ジャズ（前編）" },
  { id:13, title:"Jupiter Jazz Pt.2",           titleJa:"ジュピター・ジャズ（後編）" },
  { id:14, title:"Bohemian Rhapsody",           titleJa:"ボヘミアン・ラプソディ" },
  { id:15, title:"My Funny Valentine",          titleJa:"マイ・ファニー・ヴァレンタイン" },
  { id:16, title:"Black Dog Serenade",          titleJa:"ブラック・ドッグ・セレナーデ" },
  { id:17, title:"Mushroom Samba",              titleJa:"マッシュルーム・サンバ" },
  { id:18, title:"Speak Like a Child",          titleJa:"スピーク・ライク・ア・チャイルド" },
  { id:19, title:"Wild Horses",                 titleJa:"ワイルド・ホーセス" },
  { id:20, title:"Pierrot le Fou",              titleJa:"道化師の鎮魂歌" },
  { id:21, title:"Boogie Woogie Feng Shui",     titleJa:"ブギ・ウギ・フンシェイ" },
  { id:22, title:"Cowboy Funk",                 titleJa:"カウボーイ・ファンク" },
  { id:23, title:"Brain Scratch",               titleJa:"ブレイン・スクラッチ" },
  { id:24, title:"Hard Luck Woman",             titleJa:"ハード・ラック・ウーマン" },
  { id:25, title:"Real Folk Blues Pt.1",        titleJa:"ザ・リアル・フォーク・ブルース（前編）" },
  { id:26, title:"Real Folk Blues Pt.2",        titleJa:"ザ・リアル・フォーク・ブルース（後編）" },
  { id:27, title:"Knockin' on Heaven's Door",   titleJa:"天国の扉（映画）" },
];

// ─── VOCAB DATA ──────────────────────────────────────────────────────
const VOCAB = [

  // ── EP 01 ──
// ── CORE NOUNS ──────────────────────────────────────────────────────

  { id:"e01_01", ep:1, word:"賞金首", reading:"しょうきんくび", meaning:"bounty target / wanted person", tier:1,
    kb:[{k:"賞",r:"しょう",m:"prize/reward",rad:["𠂉","貝"],rm:["award","shell=money"],mn:"A prize paid in shell-money — a reward for achievement"},{k:"金",r:"きん",m:"gold/money",rad:["人","土"],rm:["person","earth"],mn:"A person mining from the earth — gold, money"},{k:"首",r:"くび",m:"neck/head",rad:["𠂉","自"],rm:["hair","self/face"],mn:"Hair above a face — the head, the neck"}],
    ex:[{j:"こいつが次の賞金首だ。",r:"こいつがつぎのしょうきんくびだ。",e:"This guy is our next bounty target."},{j:"賞金首を生きたまま連れてくること。",r:"しょうきんくびをいきたままつれてくること。",e:"Bring the bounty target back alive."},{j:"彼は太陽系で最も危険な賞金首だ。",r:"かれはたいようけいでもっともきけんなしょうきんくびだ。",e:"He is the most dangerous bounty target in the solar system."}],
    wm:"Prize-money (賞金) put on someone's neck (首) — a price on their head. The whole show is built on this word." },

  { id:"e01_02", ep:1, word:"組織", reading:"そしき", meaning:"organization / syndicate", tier:1,
    kb:[{k:"組",r:"そ",m:"group/assemble",rad:["糸","且"],rm:["thread","stacked layers"],mn:"Threads layered together — an organized group"},{k:"織",r:"しき",m:"weave/structure",rad:["糸","戠"],rm:["thread","weave mark"],mn:"Threads woven into a pattern — organized structure"}],
    ex:[{j:"アステロイド一帯を仕切る組織の幹部だ。",r:"あすてろいどいったいをしきるそしきのかんぶだ。",e:"He's an executive of the syndicate that controls the asteroid belt."},{j:"彼は組織を逃げ出した。",r:"かれはそしきをにげだした。",e:"He ran away from the organization."},{j:"その組織は違法な薬を売っている。",r:"そのそしきはいほうなくすりをうっている。",e:"That organization sells illegal drugs."}],
    wm:"Threads (糸) woven in layers — a tightly structured body. When Bebop says 組織 it always means dangerous people with power." },

  { id:"e01_03", ep:1, word:"幹部", reading:"かんぶ", meaning:"executive / senior member of an organization", tier:1,
    kb:[{k:"幹",r:"かん",m:"trunk/main/core",rad:["干","倝"],rm:["dry/main","brilliant"],mn:"The main dry trunk of a tree — the core, the leadership"},{k:"部",r:"ぶ",m:"section/department",rad:["咅","阝"],rm:["sound","city/town"],mn:"A section of a town — a department, division"}],
    ex:[{j:"アステロイド一帯を仕切る組織の幹部なんだがな。",r:"あすてろいどいったいをしきるそしきのかんぶなんだがな。",e:"He's an executive of the organization that controls the asteroid belt."},{j:"会社の幹部が集まった。",r:"かいしゃのかんぶがあつまった。",e:"The company executives gathered."},{j:"彼は組織の幹部として知られている。",r:"かれはそしきのかんぶとしてしられている。",e:"He is known as an executive of the organization."}],
    wm:"The trunk (幹) of a department (部) — core leadership. Asimov is 組織の幹部, making his betrayal catastrophic for the syndicate." },

  { id:"e01_04", ep:1, word:"雑魚", reading:"ざこ", meaning:"small fry / weakling / nobody important", tier:2,
    kb:[{k:"雑",r:"ざ",m:"mixed/miscellaneous",rad:["隹","木","又"],rm:["bird","tree","hand"],mn:"Birds grabbed from a tree by hand — a motley mixed bunch"},{k:"魚",r:"こ",m:"fish",rad:["魚"],rm:["fish"],mn:"Pictograph of a fish — fish"}],
    ex:[{j:"あんな所は雑魚の行く所だよ。",r:"あんなところはざこのいくところだよ。",e:"A place like that is where small fry go."},{j:"雑魚の割に賞金は250万だ。",r:"ざこのわりにしょうきんは250まんだ。",e:"For a small fry, the bounty is 2.5 million."},{j:"あいつらはただの雑魚だ、心配するな。",r:"あいつらはただのざこだ、しんぱいするな。",e:"Those guys are just small fry, don't worry about them."}],
    wm:"Mixed small fish (雑魚) — the bycatch, the nobodies. Spike dismisses Tijuana; Jet immediately fires back with the 250万 bounty. Always question the label." },

  { id:"e01_05", ep:1, word:"賞金", reading:"しょうきん", meaning:"prize money / bounty / reward money", tier:1,
    kb:[{k:"賞",r:"しょう",m:"prize/reward",rad:["𠂉","貝"],rm:["award","shell=money"],mn:"A prize paid in shell-money — a reward"},{k:"金",r:"きん",m:"gold/money",rad:["人","土"],rm:["person","earth"],mn:"A person mining from the earth — gold, money"}],
    ex:[{j:"この間の賞金100万ウーロンはどこいったんだよ。",r:"このあいだのしょうきん100まんウーロンはどこいったんだよ。",e:"Where did last time's bounty of 1 million woolongs go?"},{j:"賞金は250万だ。",r:"しょうきんは250まんだ。",e:"The bounty is 2.5 million."},{j:"殺したら賞金はパーよ。",r:"ころしたらしょうきんはぱーよ。",e:"Kill them and the bounty's gone."}],
    wm:"The number that drives every decision. 賞金 is always immediately followed by how much it is — 250万, 1500万, etc. The show runs on this." },

  { id:"e01_06", ep:1, word:"賞金稼ぎ", reading:"しょうきんかせぎ", meaning:"bounty hunter", tier:1,
    kb:[{k:"賞",r:"しょう",m:"prize",rad:["𠂉","貝"],rm:["award","shell=money"],mn:"Prize paid in shells"},{k:"金",r:"きん",m:"money",rad:["人","土"],rm:["person","earth"],mn:"Person mining earth — money"},{k:"稼",r:"かせ(ぎ)",m:"earn/work for income",rad:["禾","家"],rm:["grain","house"],mn:"Bringing grain home — earning income"}],
    ex:[{j:"賞金稼ぎは諦めたか？",r:"しょうきんかせぎはあきらめたか？",e:"Have you given up bounty hunting?"},{j:"太陽系30万の賞金稼ぎのみんな、元気かい？",r:"たいようけい30まんのしょうきんかせぎのみんな、げんきかい？",e:"Hey all 300,000 bounty hunters of the solar system, you doing well?"},{j:"賞金稼ぎは危険な仕事だ。",r:"しょうきんかせぎはきけんなしごとだ。",e:"Bounty hunting is dangerous work."}],
    wm:"Someone who earns (稼ぎ) prize money (賞金) — the Bebop crew's entire identity. Spike says this to Katerina with perfect deadpan: ご名答. 賞金稼ぎ." },

  { id:"e01_07", ep:1, word:"目薬", reading:"めぐすり", meaning:"eye drops (here: the combat drug Bloody Eye)", tier:1,
    kb:[{k:"目",r:"め",m:"eye",rad:["目"],rm:["eye"],mn:"Pictograph of an eye — the eye"},{k:"薬",r:"ぐすり",m:"medicine/drug",rad:["艹","楽"],rm:["plant","comfort/ease"],mn:"A plant that brings comfort — medicine, drug"}],
    ex:[{j:"やつは例の目薬を使ってんだ。",r:"やつはれいのめぐすりをつかってんだ。",e:"He's using those eye drops."},{j:"目薬をさしてください。",r:"めぐすりをさしてください。",e:"Please put in some eye drops."},{j:"その目薬は非合法だ。",r:"そのめぐすりはひごうほうだ。",e:"Those eye drops are illegal."}],
    wm:"Eye (目) medicine (薬) — Bloody Eye is a combat stimulant disguised as eye drops. The innocent container hiding the dangerous contents." },

  { id:"e01_08", ep:1, word:"売人", reading:"ばいにん", meaning:"dealer / seller of contraband", tier:2,
    kb:[{k:"売",r:"ばい",m:"sell",rad:["士","買"],rm:["samurai","buy"],mn:"A samurai who buys then sells — to sell, trade"},{k:"人",r:"にん",m:"person",rad:["人"],rm:["person"],mn:"Pictograph of a person"}],
    ex:[{j:"売人なら分かるだろ。",r:"ばいにんならわかるだろ。",e:"If you're a dealer you'd understand."},{j:"彼はいつから売人になった？",r:"かれはいつからばいにんになった？",e:"When did he become a dealer?"},{j:"麻薬の売人が逮捕された。",r:"まやくのばいにんがたいほされた。",e:"The drug dealer was arrested."}],
    wm:"Spike asks the bar owner if a 売人 would recognize the Bloody Eye. A person (人) who sells (売) — drug dealer, contraband trader." },

  { id:"e01_09", ep:1, word:"資金源", reading:"しきんげん", meaning:"funding source / financial backer", tier:2,
    kb:[{k:"資",r:"し",m:"funds/resources/capital",rad:["貝","次"],rm:["shell=money","next"],mn:"Shell-money passing to the next level — funds, capital"},{k:"金",r:"きん",m:"money",rad:["人","土"],rm:["person","earth"],mn:"A person mining from the earth — gold, money"},{k:"源",r:"げん",m:"source/origin/spring",rad:["氵","原"],rm:["water","original field"],mn:"Water at its original place — a source, spring, origin"}],
    ex:[{j:"組織の資金源となってた非合法目薬だ。",r:"そしきのしきんげんとなってたひごうほうめぐすりだ。",e:"It's the illegal eye drops that had been the organization's funding source."},{j:"資金源を断てば組織は崩壊する。",r:"しきんげんをたてばそしきはほうかいする。",e:"Cut the funding source and the organization will collapse."},{j:"彼らの資金源は何だ？",r:"かれらのしきんげんはなんだ？",e:"What is their source of funding?"}],
    wm:"What Asimov stole — 組織の資金源, the syndicate's lifeblood in those little bottles. This is why they cannot let him run." },

  { id:"e01_10", ep:1, word:"上物", reading:"うわもの", meaning:"top quality goods / premium item", tier:3,
    kb:[{k:"上",r:"うわ",m:"top/above/upper",rad:["一","丨"],rm:["horizontal line","vertical line"],mn:"A line rising above another — top, upper, above"},{k:"物",r:"もの",m:"thing/goods/object",rad:["牛","勿"],rm:["cow","do not"],mn:"A cow marked do-not-touch — a thing, goods"}],
    ex:[{j:"非合法目薬ん中でも飛び切りの上物だ。",r:"ひごうほうめぐすりんなかでもとびきりのうわものだ。",e:"It's top quality even among illegal eye drops."},{j:"今回は上物を持ってきた。",r:"こんかいはうわものをもってきた。",e:"I brought top-grade stuff this time."},{j:"さすが上物、品質が違う。",r:"さすがうわもの、ひんしつがちがう。",e:"As expected of premium quality, the standard is different."}],
    wm:"Flying above (上) ordinary goods (物) — the elite tier. Bloody Eye is described as 飛び切りの上物 (exceptionally top grade) even within the illegal drug market." },

  { id:"e01_11", ep:1, word:"治療費", reading:"ちりょうひ", meaning:"medical treatment costs / hospital bill", tier:2,
    kb:[{k:"治",r:"ち",m:"govern/cure/treat",rad:["氵","台"],rm:["water","platform/stand"],mn:"Water channeled on a platform — to cure, treat, govern"},{k:"療",r:"りょう",m:"heal/treat medically",rad:["疒","尞"],rm:["sickness","fuel/light"],mn:"Burning away disease with light — to heal, treat"},{k:"費",r:"ひ",m:"expense/cost/spend",rad:["弗","貝"],rm:["negate","shell=money"],mn:"Negating your shell-money — an expense"}],
    ex:[{j:"おまえがけがさせた警官の治療費でパーだ。",r:"おまえがけがさせたけいかんのちりょうひでぱーだ。",e:"All gone on treatment costs for the officer you injured."},{j:"治療費が高くて払えない。",r:"ちりょうひがたかくてはらえない。",e:"The medical costs are too high to pay."},{j:"治療費を保険でカバーした。",r:"ちりょうひをほけんでカバーした。",e:"Insurance covered the medical costs."}],
    wm:"One of three things that devour every bounty: ship 修理 + shop 修理 + 警官の治療費. The comic formula that opens the show, establishing the crew's permanent poverty." },

  { id:"e01_12", ep:1, word:"抗争", reading:"こうそう", meaning:"conflict / turf war / feud between organizations", tier:2,
    kb:[{k:"抗",r:"こう",m:"resist/oppose",rad:["扌","亢"],rm:["hand","resist/oppose"],mn:"A hand raised in opposition — to resist, oppose"},{k:"争",r:"そう",m:"compete/fight/contend",rad:["爪","争"],rm:["claw","contend"],mn:"Claws contending with each other — to fight, compete"}],
    ex:[{j:"３日前こいつの組織と敵対する組織との抗争があったんだ。",r:"みっかまえこいつのそしきとてきたいするそしきとのこうそうがあったんだ。",e:"Three days ago there was a turf war with a rival organization."},{j:"組織間の抗争が続いている。",r:"そしきかんのこうそうがつづいている。",e:"The conflict between organizations continues."},{j:"抗争に巻き込まれた。",r:"こうそうにまきこまれた。",e:"I got caught up in the feud."}],
    wm:"The rival gang 抗争 three days ago created the chaos Asimov exploited to steal and run. Conflict always creates opportunity." },

  { id:"e01_13", ep:1, word:"仲間", reading:"なかま", meaning:"companion / fellow / member of the group / crew", tier:1,
    kb:[{k:"仲",r:"なか",m:"middle/relationship/between",rad:["亻","中"],rm:["person","middle"],mn:"A person in the middle — mediator, inner circle companion"},{k:"間",r:"ま",m:"space/between/gap",rad:["門","日"],rm:["gate","sun"],mn:"Sun shining through a gate — the space between, an interval"}],
    ex:[{j:"こいつは仲間を殺してとんずらしやがった。",r:"こいつはなかまをころしてとんずらしやがった。",e:"This guy killed his companions and ran."},{j:"俺たちは仲間だ。",r:"おれたちはなかまだ。",e:"We're crewmates."},{j:"仲間を大切にしなさい。",r:"なかまをたいせつにしなさい。",e:"Cherish your companions."}],
    wm:"The person (仲) who shares your space (間) — those close to you, your crew. Killing 仲間 is the unforgivable betrayal; it's why Asimov has a bounty at all." },

  { id:"e01_14", ep:1, word:"相棒", reading:"あいぼう", meaning:"partner / buddy / trusted companion", tier:1,
    kb:[{k:"相",r:"あい",m:"mutual/together/each other",rad:["木","目"],rm:["tree","eye"],mn:"An eye watching a tree — mutual observation, together"},{k:"棒",r:"ぼう",m:"stick/rod/pole",rad:["木","奉"],rm:["tree","offer/present"],mn:"A tree offered as a stick — a rod, the stick you lean on"}],
    ex:[{j:"10年来の相棒だ。",r:"じゅうねんらいのあいぼうだ。",e:"We've been partners for 10 years (Spike about the Swordfish)."},{j:"スパイクは俺の相棒だ。",r:"すぱいくはおれのあいぼうだ。",e:"Spike is my partner."},{j:"相棒のいない賞金稼ぎは難しい。",r:"あいぼうのいないしょうきんかせぎはむずかしい。",e:"Bounty hunting without a partner is tough."}],
    wm:"Mutual (相) staff (棒) — the one you lean on together. Spike calls the Swordfish his 10年来の相棒 before any human relationship. Objects can be partners too." },

  { id:"e01_15", ep:1, word:"火星", reading:"かせい", meaning:"Mars (the planet)", tier:1,
    kb:[{k:"火",r:"か",m:"fire",rad:["火"],rm:["fire"],mn:"Pictograph of flames — fire"},{k:"星",r:"せい",m:"star/planet",rad:["日","生"],rm:["sun","birth/life"],mn:"A sun from which life emerges — a star, planet"}],
    ex:[{j:"火星生まれだ。",r:"かせいうまれだ。",e:"I was born on Mars."},{j:"やつらは火星に行くつもりだぜ。",r:"やつらはかせいにいくつもりだぜ。",e:"Those guys are planning to go to Mars."},{j:"火星で幸せに暮らせるのよ。",r:"かせいでしあわせにくらせるのよ。",e:"We can live happily on Mars."}],
    wm:"Fire star (火星) — ancient astronomers named Mars for its red color. EP01's promised land: Katerina dreams of escape there, Spike was born there." },

  { id:"e01_16", ep:1, word:"幸せ", reading:"しあわせ", meaning:"happiness / good fortune / being blessed", tier:1,
    kb:[{k:"幸",r:"しあわ(せ)",m:"fortune/luck/happiness",rad:["土","𠂉","工"],rm:["earth","divine","work"],mn:"Divine work on earth — fortune, when heaven and labor align"}],
    ex:[{j:"じゃあきっと幸せになれるわ。",r:"じゃあきっとしあわせになれるわ。",e:"Then you'll surely be able to become happy."},{j:"火星で幸せに暮らせるのよ。",r:"かせいでしあわせにくらせるのよ。",e:"We can live happily on Mars."},{j:"彼女は今幸せそうだ。",r:"かのじょはいましあわせそうだ。",e:"She looks happy now."}],
    wm:"Katerina's dream: 火星で幸せに暮らせる. Spike's reply: 金があるやつだけさ. The show's entire worldview delivered in one exchange at a bar." },

  { id:"e01_17", ep:1, word:"機体", reading:"きたい", meaning:"aircraft body / spacecraft / the ship itself", tier:1,
    kb:[{k:"機",r:"き",m:"machine/aircraft/mechanism",rad:["木","幾"],rm:["tree","how many/mechanism"],mn:"A wooden mechanism — a machine, loom, aircraft"},{k:"体",r:"たい",m:"body/form",rad:["亻","本"],rm:["person","root/origin"],mn:"A person's root/origin — the body, form"}],
    ex:[{j:"おまえが壊した機体の修理でパーだ。",r:"おまえがこわしたきたいのしゅうりでぱーだ。",e:"All gone on the repair for the aircraft body you broke."},{j:"機体の点検をした。",r:"きたいのてんけんをした。",e:"I inspected the aircraft body."},{j:"機体が損傷している。",r:"きたいがそんしょうしている。",e:"The aircraft body is damaged."}],
    wm:"The Swordfish, the Hammerhead, the Bebop itself — all called 機体. 機体の修理 (repair costs) is the first joke of the series and the last word every episode." },

  { id:"e01_18", ep:1, word:"修理", reading:"しゅうり", meaning:"repair / fix", tier:1,
    kb:[{k:"修",r:"しゅう",m:"cultivate/repair/improve",rad:["亻","攸"],rm:["person","flowing water"],mn:"A person improving like flowing water — to cultivate, repair"},{k:"理",r:"り",m:"reason/order/logic",rad:["王","里"],rm:["king","village"],mn:"The king imposing logical order — reason, to set right"}],
    ex:[{j:"おまえが壊した機体の修理と店の修理でパーだ。",r:"おまえがこわしたきたいのしゅうりとみせのしゅうりでぱーだ。",e:"All gone on repair for the ship you broke and the shop you broke."},{j:"修理に出した。",r:"しゅうりにだした。",e:"I sent it in for repair."},{j:"この修理はいくらかかりますか？",r:"このしゅうりはいくらかかりますか？",e:"How much will this repair cost?"}],
    wm:"The eternal Bebop cycle: earn bounty → spend on 修理. Everything Spike breaks must be fixed. 修理代 (repair costs) = the punchline of every mission." },

  { id:"e01_19", ep:1, word:"警官", reading:"けいかん", meaning:"police officer / cop", tier:1,
    kb:[{k:"警",r:"けい",m:"warn/alert/police",rad:["言","攴","苟"],rm:["words","strike","carefully"],mn:"Carefully striking out words of warning — to warn, alert, police"},{k:"官",r:"かん",m:"official/government",rad:["宀","㠯"],rm:["roof","official seal"],mn:"An official under a roof — a government official"}],
    ex:[{j:"おまえがけがさせた警官の治療費でパーだ。",r:"おまえがけがさせたけいかんのちりょうひでぱーだ。",e:"All gone on treatment costs for the officer you injured."},{j:"警官が来た。",r:"けいかんがきた。",e:"A police officer came."},{j:"警官に職務質問された。",r:"けいかんにしょくむしつもんされた。",e:"I was questioned by a police officer."}],
    wm:"Every Spike fight ends with 警官の治療費 — injured cops are always part of the collateral damage. 警官 = a uniformed police officer specifically." },

  // ── CORE VERBS ──────────────────────────────────────────────────────

  { id:"e01_20", ep:1, word:"仕切る", reading:"しきる", meaning:"to control / to run / to be in charge of (a territory)", tier:2,
    kb:[{k:"仕",r:"し",m:"serve/handle/do",rad:["亻","士"],rm:["person","samurai"],mn:"A samurai-person doing their duty — to serve, handle"},{k:"切る",r:"きる",m:"cut/do decisively",rad:["七","刀"],rm:["seven","knife"],mn:"A knife cutting through — to cut, act decisively"}],
    ex:[{j:"アステロイド一帯を仕切る組織の幹部だ。",r:"あすてろいどいったいをしきるそしきのかんぶだ。",e:"He's an executive of the organization that runs the whole asteroid belt."},{j:"彼がこの地区を仕切っている。",r:"かれがこのちくをしきっている。",e:"He controls this district."},{j:"今日の会議は俺が仕切る。",r:"きょうのかいぎはおれがしきる。",e:"I'll run today's meeting."}],
    wm:"Handle (仕) + cut through (切る) — to run the show, decisively control territory. The organization 仕切る the whole asteroid belt: total control." },

  { id:"e01_21", ep:1, word:"逃げる", reading:"にげる", meaning:"to run away / to flee / to escape", tier:1,
    kb:[{k:"逃",r:"に(げる)",m:"flee/escape",rad:["⻌","兆"],rm:["movement","omen/sign"],mn:"Moving at the first sign of danger — to flee"}],
    ex:[{j:"もう逃げきれないわ。",r:"もうにげきれないわ。",e:"We can't escape anymore."},{j:"火星へ逃げるつもりか？",r:"かせいへにげるつもりか？",e:"Are you planning to flee to Mars?"},{j:"逃げ道がない。",r:"にげみちがない。",e:"There's no escape route."}],
    wm:"Movement (⻌) at the first omen (兆) — to flee before it's too late. Asimov and Katerina are always 逃げている from everything." },

  { id:"e01_22", ep:1, word:"逃げ込む", reading:"にげこむ", meaning:"to flee into / to take refuge in a place", tier:2,
    kb:[{k:"逃",r:"に(げ)",m:"flee",rad:["⻌","兆"],rm:["movement","omen"],mn:"Moving at the first omen — to flee"},{k:"込む",r:"こむ",m:"go into/crowd into",rad:["⻌","入"],rm:["movement","enter"],mn:"Moving into a place — to crowd in, go into"}],
    ex:[{j:"やつはティワナの女の所に逃げ込んだらしい。",r:"やつはてぃわなのおんなのところににげこんだらしい。",e:"Apparently he fled to a woman's place in Tijuana."},{j:"家に逃げ込んだ。",r:"いえににげこんだ。",e:"He fled into the house."},{j:"物陰に逃げ込む。",r:"ものかげににげこむ。",e:"To take refuge in the shadows."}],
    wm:"Flee (逃げ) + go into (込む) — running INTO a specific place for cover. The 込む specifies direction; the compound is more precise than 逃げる alone." },

  { id:"e01_23", ep:1, word:"逃げきれない", reading:"にげきれない", meaning:"cannot fully escape / can't get away completely", tier:2,
    kb:[{k:"逃",r:"に(げ)",m:"flee",rad:["⻌","兆"],rm:["movement","omen"],mn:"Moving at the first omen — to flee"},{k:"切",r:"き(れない)",m:"cut through/complete",rad:["七","刀"],rm:["seven","knife"],mn:"A knife cutting completely through — to complete, finish"}],
    ex:[{j:"もう逃げきれないわ。",r:"もうにげきれないわ。",e:"We can't escape anymore."},{j:"追いつかれて逃げきれなかった。",r:"おいつかれてにげきれなかった。",e:"I was caught up and couldn't escape."},{j:"逃げきれるか？",r:"にげきれるか？",e:"Can you make a complete escape?"}],
    wm:"〜きれない = cannot do completely. 逃げ切れない = can't cut all the way through (完切) the escape = can't fully get away. Katerina's final words." },

  { id:"e01_24", ep:1, word:"逃がす", reading:"にがす", meaning:"to let escape / to allow to get away / to release", tier:2,
    kb:[{k:"逃",r:"に(がす)",m:"flee/let go",rad:["⻌","兆"],rm:["movement","omen"],mn:"Movement at the first sign — to flee, let go of"}],
    ex:[{j:"逃がすな！撃てー！",r:"にがすな！うてー！",e:"Don't let them escape! Fire!"},{j:"チャンスを逃がした。",r:"チャンスをにがした。",e:"I let the chance slip away."},{j:"魚を逃がしてしまった。",r:"さかなをにがしてしまった。",e:"I let the fish get away."}],
    wm:"DIFFERENT from 逃げる (you flee yourself) — 逃がす is transitive: you let something/someone ELSE escape. Critical distinction for bounty hunters." },

  { id:"e01_25", ep:1, word:"捕まえる", reading:"つかまえる", meaning:"to catch / to capture / to arrest", tier:1,
    kb:[{k:"捕",r:"つか(まえる)",m:"catch/seize",rad:["扌","甫"],rm:["hand","spread/large"],mn:"A hand spreading wide to grab — to catch, seize"}],
    ex:[{j:"やつを捕まえるのは無理だ。",r:"やつをつかまえるのはむりだ。",e:"Catching him is impossible."},{j:"捕まえないの？",r:"つかまえないの？",e:"Aren't you going to catch him?"},{j:"犯人をやっと捕まえた。",r:"はんにんをやっとつかまえた。",e:"We finally caught the criminal."}],
    wm:"A hand (扌) spreading (甫) wide to grab — the fundamental bounty hunter action. Everything the crew does leads to this verb." },

  { id:"e01_26", ep:1, word:"壊す", reading:"こわす", meaning:"to break / to destroy / to damage", enTarget:"broke", tier:1,
    kb:[{k:"壊",r:"こわ(す)",m:"break/destroy/demolish",rad:["土","褱"],rm:["earth","embrace/ruin"],mn:"Earth embracing ruin — to break apart, demolish, destroy"}],
    ex:[{j:"おまえが壊した機体の修理でパーだ。",r:"おまえがこわしたきたいのしゅうりでぱーだ。",e:"All gone on the repair for the ship you broke."},{j:"テレビが壊れた。",r:"てれびがこわれた。",e:"The TV broke."},{j:"壊さないように気をつけて。",r:"こわさないようにきをつけて。",e:"Be careful not to break it."}],
    wm:"Spike 壊す everything he touches — ships, shops, bones. His most frequently demonstrated skill. 壊す (active) vs 壊れる (breaks on its own)." },

  { id:"e01_27", ep:1, word:"諦める", reading:"あきらめる", meaning:"to give up / to resign oneself / to accept defeat", tier:1,
    kb:[{k:"諦",r:"あきら(める)",m:"resign oneself / see clearly",rad:["言","帝"],rm:["words","emperor"],mn:"When the emperor speaks, there is no arguing — to resign oneself to the truth"}],
    ex:[{j:"今回は俺も諦めた。",r:"こんかいはおれもあきらめた。",e:"This time even I gave up."},{j:"諦めろ！逃げ場はない。",r:"あきらめろ！にげばはない。",e:"Give up! There's nowhere to run."},{j:"諦めないで続けてください。",r:"あきらめないでつづけてください。",e:"Please keep going without giving up."}],
    wm:"When the emperor's (帝) word (言) is final — you see clearly there's no point resisting. 諦める is surrender to reality, not weakness." },

  { id:"e01_28", ep:1, word:"売りさばく", reading:"うりさばく", meaning:"to sell off / to move (merchandise) / to deal (contraband)", tier:2,
    kb:[{k:"売",r:"うり",m:"sell",rad:["士","買"],rm:["samurai","buy"],mn:"A samurai who buys then sells — to sell"},{k:"さばく",r:"さばく",m:"handle/deal with/dispatch",rad:[""],rm:[""],mn:"To handle, process, or dispatch goods efficiently"}],
    ex:[{j:"その前にこいつを売りさばく。",r:"そのまえにこいつをうりさばく。",e:"Before that, I'll sell this off."},{j:"密輸品を売りさばいた。",r:"みつゆひんをうりさばいた。",e:"He sold off the smuggled goods."},{j:"在庫を全部売りさばいた。",r:"ざいこをぜんぶうりさばいた。",e:"I moved all the inventory."}],
    wm:"Asimov's plan: sell off (売りさばく) the stolen Bloody Eye before escaping to Mars. 売りさばく specifically means moving a large amount of goods quickly." },

  { id:"e01_29", ep:1, word:"掘る", reading:"ほる", meaning:"to dig / to excavate", tier:2,
    kb:[{k:"掘",r:"ほ(る)",m:"dig/excavate",rad:["扌","屈"],rm:["hand","bent/crouching"],mn:"A hand bent low digging — to dig, excavate"}],
    ex:[{j:"死に物狂いで掘ったな。",r:"しにものぐるいでほったな。",e:"We dug like our lives depended on it."},{j:"ゲートを掘った。",r:"ゲートをほった。",e:"We dug the gate."},{j:"穴を掘る。",r:"あなをほる。",e:"To dig a hole."}],
    wm:"The old gambler's grievance — 俺が一生懸命ゲート掘ったおかげ (thanks to me digging the gate). He means the hyperspace tunnels. 掘る is the verb of that generation's sacrifice." },

  { id:"e01_30", ep:1, word:"耕す", reading:"たがやす", meaning:"to cultivate / to till (land)", enTarget:"cultivated", tier:2,
    kb:[{k:"耕",r:"たがや(す)",m:"cultivate/till",rad:["耒","井"],rm:["plow","well/grid"],mn:"A plow working a grid of fields — to cultivate, till"}],
    ex:[{j:"この土地耕したおかげなんだぞ。",r:"このとちたがやしたおかげなんだぞ。",e:"It's because we cultivated this land."},{j:"畑を耕す。",r:"はたけをたがやす。",e:"To till a field."},{j:"死に物狂いで種まいた。",r:"しにものぐるいでたねまいた。",e:"We planted seeds desperately."}],
    wm:"The second gambler uses 耕した (cultivated the land) while the first said 掘った (dug the gate). They're having the same argument about who deserves credit — just differently." },

  { id:"e01_31", ep:1, word:"狙う", reading:"ねらう", meaning:"to aim at / to target / to have one's sights on", tier:1,
    kb:[{k:"狙",r:"ねら(う)",m:"aim/target/lurk",rad:["犭","且"],rm:["animal","moreover/stacked"],mn:"An animal stacking up to lunge — to aim at, lurk for"}],
    ex:[{j:"おまえは女に狙われる。",r:"おまえはおんなにねらわれる。",e:"You will be targeted by a woman."},{j:"賞金首を狙う。",r:"しょうきんくびをねらう。",e:"To target a bounty."},{j:"彼女が俺を狙っている。",r:"かのじょがおれをねらっている。",e:"She has her sights on me."}],
    wm:"The fortune teller warns Spike: おまえは女に狙われる. She's right. 狙われる (passive = be targeted) — Katerina almost kills him." },

  { id:"e01_32", ep:1, word:"見せる", reading:"みせる", meaning:"to show / to let see / to display", tier:1,
    kb:[{k:"見",r:"み(せる)",m:"see/show",rad:["目","儿"],rm:["eye","legs/person"],mn:"A person led by their eyes — to see, look"},{k:"せる",r:"せる",m:"causative — make/let",rad:[""],rm:[""],mn:"Causative suffix: make or let someone do something"}],
    ex:[{j:"本物かどうか見せてもらおうか。",r:"ほんものかどうかみせてもらおうか。",e:"Let me see whether it's the real thing."},{j:"よーく見ておくんだな。",r:"よーくみておくんだな。",e:"Take a good look and remember it."},{j:"見せてくれ。",r:"みせてくれ。",e:"Show me."}],
    wm:"The bar patron demands Asimov 見せてもらおうか — show me if it's real. Then gets a demonstration of Bloody Eye he won't forget." },

  // ── ADJECTIVES & ADVERBS ────────────────────────────────────────────

  { id:"e01_33", ep:1, word:"非合法", reading:"ひごうほう", meaning:"illegal / unlawful / against the law", tier:1,
    kb:[{k:"非",r:"ひ",m:"not/wrong/anti-",rad:["非"],rm:["opposed wings"],mn:"Two wings spread in opposite directions — against, wrong, not"},{k:"合",r:"ごう",m:"fit/match/combine",rad:["亼","口"],rm:["gather","mouth"],mn:"Mouths gathering to agree — to match, fit, combine"},{k:"法",r:"ほう",m:"law/method",rad:["氵","去"],rm:["water","go away"],mn:"Water channeled away properly — law, method, order"}],
    ex:[{j:"非合法目薬ん中でも飛び切りの上物だ。",r:"ひごうほうめぐすりんなかでもとびきりのうわものだ。",e:"Top quality even among illegal eye drops."},{j:"その行為は非合法だ。",r:"そのこういはひごうほうだ。",e:"That act is illegal."},{j:"非合法な商売はやめろ。",r:"ひごうほうなしょうばいはやめろ。",e:"Stop your illegal business."}],
    wm:"Not (非) fitting/matching (合) the law (法) — against the law. The Bebop universe runs almost entirely on 非合法 goods and services." },

  { id:"e01_34", ep:1, word:"時代遅れ", reading:"じだいおくれ", meaning:"out of date / behind the times / old-fashioned", tier:2,
    kb:[{k:"時",r:"じ",m:"time/hour",rad:["日","寺"],rm:["sun","temple"],mn:"The sun's position measured at a temple — time"},{k:"代",r:"だい",m:"era/generation",rad:["亻","弋"],rm:["person","substitute"],mn:"A person substituting for the next — an era, generation"},{k:"遅",r:"おく(れ)",m:"late/slow/delayed",rad:["⻌","犀"],rm:["movement","rhinoceros"],mn:"Moving as slowly as a rhinoceros — late, delayed"}],
    ex:[{j:"時代遅れのカウボーイさ。",r:"じだいおくれのカウボーイさ。",e:"I'm an out-of-date cowboy."},{j:"その考え方は時代遅れだ。",r:"そのかんがえかたはじだいおくれだ。",e:"That way of thinking is behind the times."},{j:"時代遅れでも、それが俺のスタイルだ。",r:"じだいおくれでも、それがおれのスタイルだ。",e:"Even if I'm out of date, that's my style."}],
    wm:"Spike's self-description to Katerina — 時代遅れのカウボーイ. Said without self-pity or irony. The whole show's ethos in four words." },

  { id:"e01_35", ep:1, word:"利口", reading:"りこう", meaning:"clever / smart / sensible choice", tier:2,
    kb:[{k:"利",r:"り",m:"benefit/profit/advantageous",rad:["禾","刀"],rm:["grain","knife"],mn:"A knife harvesting grain efficiently — advantageous, profitable"},{k:"口",r:"こう",m:"mouth/opening",rad:["口"],rm:["mouth"],mn:"Pictograph of a mouth — opening, gateway"}],
    ex:[{j:"それが利口だわ。",r:"それがりこうだわ。",e:"That's the smart thing to do."},{j:"弱ってる雑魚は相手にしない、それが利口だわ。",r:"よわってるざこはあいてにしない、それがりこうだわ。",e:"Not dealing with weakened small fry — that's smart."},{j:"利口な子どもですね。",r:"りこうなこどもですね。",e:"What a clever child."}],
    wm:"Katerina says this to Spike when he declines to fight the weakened Asimov — それが利口だわ. Recognition of wisdom in restraint, from someone who sees him clearly." },

  { id:"e01_36", ep:1, word:"優雅", reading:"ゆうが", meaning:"elegant / graceful / refined", tier:2,
    kb:[{k:"優",r:"ゆう",m:"gentle/superior/actor",rad:["亻","憂"],rm:["person","sorrow/elegance"],mn:"A person with graceful sorrow — gentle, superior, elegant"},{k:"雅",r:"が",m:"elegant/refined",rad:["牙","隹"],rm:["fang","bird"],mn:"A refined bird with a fang — elegant, refined, graceful"}],
    ex:[{j:"昼寝とは優雅だな。",r:"ひるねとはゆうがだな。",e:"Taking a nap in the middle of the day — how elegant."},{j:"優雅な生活を送っている。",r:"ゆうがなせいかつをおくっている。",e:"He's living an elegant life."},{j:"優雅な身のこなし。",r:"ゆうがなみのこなし。",e:"Graceful movement."}],
    wm:"Jet says 昼寝とは優雅だな sarcastically when he finds Spike asleep. 優雅 is used ironically here — their lives are anything but elegant." },

  { id:"e01_37", ep:1, word:"のんきな", reading:"のんきな", meaning:"carefree / easygoing / laid-back (sometimes negatively: not taking things seriously)", tier:2,
    kb:[],
    ex:[{j:"のんきな曲だぜ。",r:"のんきなきょくだぜ。",e:"What a carefree song."},{j:"のんきなやつだな。",r:"のんきなやつだな。",e:"What a laid-back guy."},{j:"こんな状況でのんきなことを言うな。",r:"こんなじょうきょうでのんきなことをいうな。",e:"Don't say carefree things in a situation like this."}],
    wm:"Spike says のんきな曲だぜ about Tank! playing as they arrive at the dangerous gate. Ironic appreciation — the upbeat jazz against the grim job." },

  // ── KEY EXPRESSIONS ──────────────────────────────────────────────────

  { id:"e01_38", ep:1, word:"取りあえず", reading:"とりあえず", meaning:"for now / first of all / anyway / at any rate", enTarget:"for now", tier:1,
    kb:[],
    ex:[{j:"取りあえずこっちは警察筋にあたってから行く。",r:"とりあえずこっちはけいさつすじにあたってからいく。",e:"For now I'll check with police contacts first, then go."},{j:"取りあえず座ってください。",r:"とりあえずすわってください。",e:"Please sit down for now."},{j:"取りあえず連絡だけしといた。",r:"とりあえずれんらくだけしといた。",e:"I at least got in touch for now."}],
    wm:"Grab (取り) without delay (あえず) — a practical 'first things first, deal with the rest later'. Very high frequency in casual spoken Japanese." },

  { id:"e01_39", ep:1, word:"当てになる", reading:"あてになる", meaning:"to be reliable / dependable / trustworthy", enTarget:"relied on", tier:2,
    kb:[],
    ex:[{j:"当てになんのかねえ、あのおやじ。",r:"あてになんのかねえ、あのおやじ。",e:"Can that old man be relied on, I wonder."},{j:"彼は全然当てにならない。",r:"かれはぜんぜんあてにならない。",e:"He's completely unreliable."},{j:"天気予報なんて当てにならない。",r:"てんきよほうなんてあてにならない。",e:"Weather forecasts are never reliable."}],
    wm:"当て = a target/aim + になる = become → becomes something you can aim at = reliable. 当てにならない = can't be aimed at = unreliable. Spike doubts Jet's contact." },

  { id:"e01_40", ep:1, word:"ご名答", reading:"ごめいとう", meaning:"correct answer! / right on! / well guessed!", tier:3,
    kb:[{k:"名",r:"めい",m:"name/fame/renowned",rad:["夕","口"],rm:["evening","mouth"],mn:"Speaking a name in darkness — name, fame, renown"},{k:"答",r:"とう",m:"answer/reply",rad:["竹","合"],rm:["bamboo","combine/match"],mn:"Bamboo sections combining properly — an answer, reply"}],
    ex:[{j:"ご名答。賞金稼ぎです。",r:"ごめいとう。しょうきんかせぎです。",e:"Exactly right. I'm a bounty hunter."},{j:"ご名答！よく分かりましたね。",r:"ごめいとう！よくわかりましたね。",e:"Correct! You figured it out well."},{j:"ご名答、一問正解。",r:"ごめいとう、いちもんせいかい。",e:"Correct answer, one point."}],
    wm:"ご (honorific) + 名答 (excellent answer) — polite praise for guessing correctly. Spike delivers this with perfect cool when Katerina identifies him as a bounty hunter." },

  { id:"e01_41", ep:1, word:"ご無沙汰", reading:"ごぶさた", meaning:"long time no see / it's been a while (formal)", tier:2,
    kb:[{k:"無",r:"ぶ",m:"without/nothing",rad:["𠂉","灬"],rm:["spreading arms","fire"],mn:"A person dancing over fire — nothingness, without"},{k:"沙",r:"さ",m:"sand/gravel",rad:["氵","少"],rm:["water","few"],mn:"Few water drops — sand, fine particles"},{k:"汰",r:"た",m:"wash/select/eliminate",rad:["氵","太"],rm:["water","fat/too much"],mn:"Water washing away excess — to wash, select"}],
    ex:[{j:"ご無沙汰。",r:"ごぶさた。",e:"It's been a while / Long time no see."},{j:"長らくご無沙汰しております。",r:"ながらくごぶさたしております。",e:"I'm sorry for being out of touch so long."},{j:"ご無沙汰でした、元気でしたか？",r:"ごぶさたでした、げんきでしたか？",e:"It's been a while — have you been well?"}],
    wm:"Spike says this to the arms dealer / information broker. 無沙汰 = without contact/communication. ご is the honorific prefix. Standard way to open after a long absence." },

  { id:"e01_42", ep:1, word:"失敬", reading:"しっけい", meaning:"excuse me / pardon me / I beg your pardon (for an intrusion)", tier:3,
    kb:[{k:"失",r:"しっ",m:"lose/miss/fail",rad:["手","乙"],rm:["hand","twisting"],mn:"Something twisting out of a hand — to lose, miss, fail"},{k:"敬",r:"けい",m:"respect/revere",rad:["苟","攵"],rm:["carefully","strike"],mn:"Carefully striking with reverence — to respect, revere"}],
    ex:[{j:"いやあ、失敬失敬。",r:"いやあ、しっけいしっけい。",e:"Ah, excuse me, excuse me."},{j:"失敬しました。",r:"しっけいしました。",e:"I beg your pardon."},{j:"ちょっと失敬。",r:"ちょっとしっけい。",e:"If you'll excuse me for a moment."}],
    wm:"Spike says 失敬失敬 (excuse me, excuse me) after eating someone's food uninvited. It's ironic — genuinely polite word used right after being completely rude." },

  // ── SLANG & ROUGH SPEECH ─────────────────────────────────────────────

  { id:"e01_43", ep:1, word:"畜生", reading:"ちくしょう", meaning:"damn it! / for crying out loud! (expletive)", tier:3,
    kb:[{k:"畜",r:"ちく",m:"livestock/domestic animal",rad:["玄","田"],rm:["dark/mysterious","field"],mn:"Dark-field creatures — livestock, domestic animals"},{k:"生",r:"しょう",m:"life/birth/creature",rad:["土","𠂉"],rm:["earth","sprout"],mn:"A sprout pushing through the earth — life, birth, creature"}],
    ex:[{j:"まただ！畜生この野郎！",r:"まただ！ちくしょうこのやろう！",e:"Again! Damn it, you bastard!"},{j:"畜生、しくじった。",r:"ちくしょう、しくじった。",e:"Damn it, I messed up."},{j:"畜生め！逃げやがった！",r:"ちくしょうめ！にげやがった！",e:"Damn it, he got away!"}],
    wm:"Calling something a beast (畜生) in frustration — like 'damn it'. The gambling old man shouts this constantly every time he loses, which is always." },

  { id:"e01_44", ep:1, word:"サツ", reading:"さつ", meaning:"cops / the police (rough slang)", tier:3,
    kb:[],
    ex:[{j:"サツが動き出す前に何とかしねえと。",r:"さつがうごきだすまえになんとかしねえと。",e:"We have to do something before the cops start moving."},{j:"サツに捕まるな。",r:"さつにつかまるな。",e:"Don't let the cops catch you."},{j:"サツが来るぞ、急げ！",r:"さつがくるぞ、いそげ！",e:"The fuzz is coming, hurry!"}],
    wm:"Clipping of 警察 (けいさつ) — like saying 'the fuzz'. Very rough criminal-world slang. Characters who use it are definitely not law-abiding citizens." },

  { id:"e01_45", ep:1, word:"カモ", reading:"かも", meaning:"sucker / easy mark / easy prey (lit. duck)", tier:3,
    kb:[],
    ex:[{j:"おまえらそうやって俺のことカモにしてっけどな。",r:"おまえらそうやっておれのことカモにしてっけどな。",e:"You guys keep treating me as a sucker like that."},{j:"あいつはカモだ、簡単に騙せる。",r:"あいつはカモだ、かんたんにだませる。",e:"That guy's an easy mark, easy to fool."},{j:"詐欺師はカモを探している。",r:"さぎしはカモをさがしている。",e:"Con artists are always looking for suckers."}],
    wm:"Ducks (鴨) are famously easy to catch — so カモ means someone easily exploited. The old gambler accuses Spike and Jet of treating him as one." },

  { id:"e01_46", ep:1, word:"とんずら", reading:"とんずら", meaning:"running away / making a getaway / doing a runner", tier:3,
    kb:[],
    ex:[{j:"こいつは仲間を殺してとんずらしやがった。",r:"こいつはなかまをころしてとんずらしやがった。",e:"This guy killed his companions and did a runner."},{j:"金を持ってとんずらした。",r:"かねをもってとんずらした。",e:"He took the money and ran."},{j:"とんずらするな！",r:"とんずらするな！",e:"Don't run away!"}],
    wm:"Slang for fleeing/running away suddenly, usually with something stolen. More vivid and criminal than just 逃げる. Asimov とんずらした with the syndicate's entire drug supply." },

  { id:"e01_47", ep:1, word:"やっべえ", reading:"やっべえ", meaning:"oh shit / that's bad / we're in trouble (slang)", tier:3,
    kb:[],
    ex:[{j:"やっべえな。サツが動き出す前に何とかしねえと。",r:"やっべえな。さつがうごきだすまえになんとかしねえと。",e:"Oh shit. We have to do something before the cops start moving."},{j:"やっべえ、忘れてた！",r:"やっべえ、わすれてた！",e:"Shit, I forgot!"},{j:"これはやっべえ状況だ。",r:"これはやっべえじょうきょうだ。",e:"This is a bad situation."}],
    wm:"やばい (やばい) → やべえ → やっべえ (extra emphasis). A slang expression of alarm or trouble. Very rough, very casual, very common in anime." },

  { id:"e01_48", ep:1, word:"切れまくる", reading:"きれまくる", meaning:"going completely berserk / losing it / totally flipping out", tier:3,
    kb:[{k:"切",r:"き(れ)",m:"cut/snap",rad:["七","刀"],rm:["seven","knife"],mn:"A knife cutting — to snap, cut, run out"},{k:"まくる",r:"まくる",m:"keep doing intensively / do repeatedly",rad:[""],rm:[""],mn:"Suffix: do something over and over, intensively"}],
    ex:[{j:"たく、アシモフの野郎切れまくってんぜ。",r:"たく、あしもふのやろうきれまくってんぜ。",e:"Damn, Asimov is completely going berserk."},{j:"あいつ最近切れまくってる。",r:"あいつさいきんきれまくってる。",e:"That guy has been losing it constantly lately."},{j:"ブラッディアイを使って切れまくる。",r:"ぶらっでぃあいをつかってきれまくる。",e:"He uses Bloody Eye and goes completely berserk."}],
    wm:"切れる (snap/lose temper) + まくる (do intensively, repeatedly) = completely and continuously losing it. The Bloody Eye makes Asimov 切れまくる beyond control." },

  { id:"e01_49", ep:1, word:"しつこい", reading:"しつこい", meaning:"persistent / relentless / won't give up / annoyingly stubborn", tier:2,
    kb:[],
    ex:[{j:"このっ、しつけえんだっつうの。",r:"このっ、しつけえんだっつうの。",e:"This one — I said you're relentless!"},{j:"しつこいな、もういいよ。",r:"しつこいな、もういいよ。",e:"You're so persistent, give it a rest."},{j:"しつこく追いかける。",r:"しつこくおいかける。",e:"To chase relentlessly."}],
    wm:"Spike says this during the fight — しつけえんだっつうの (I said you're persistent!). しつこい is a key adjective for describing someone who won't stop or won't give up." },

  // ── GRAMMAR POINTS ──────────────────────────────────────────────────

  { id:"e01_50", ep:1, word:"〜てしまう", reading:"〜てしまう", meaning:"ended up doing ~ / did ~ completely (often with regret)", tier:1,
    kb:[],
    ex:[{j:"仲間を殺してとんずらしてしまった。",r:"なかまをころしてとんずらしてしまった。",e:"He ended up killing his companions and running."},{j:"全部使ってしまった。",r:"ぜんぶつかってしまった。",e:"I ended up using it all up."},{j:"忘れてしまいました。",r:"わすれてしまいました。",e:"I went ahead and forgot (completely)."}],
    wm:"〜てしまう adds completion or regret. 食べてしまった = ate it all up. 死んでしまった = went and died. One of the highest-frequency grammar patterns in spoken Japanese." },

  { id:"e01_51", ep:1, word:"〜らしい", reading:"〜らしい", meaning:"apparently ~ / it seems ~ / I heard that ~ (inference from evidence)", tier:1,
    kb:[],
    ex:[{j:"やつはティワナの女の所に逃げ込んだらしい。",r:"やつはてぃわなのおんなのところににげこんだらしい。",e:"Apparently he fled to a woman's place in Tijuana."},{j:"彼は病気らしい。",r:"かれはびょうきらしい。",e:"He seems to be sick (from what I hear/see)."},{j:"あの映画は面白いらしいよ。",r:"あのえいがはおもしろいらしいよ。",e:"I hear that movie is interesting."}],
    wm:"〜らしい = hearsay or evidence-based inference. More detached than 〜そうだ. Bounty hunters trade in 〜らしい intelligence constantly — it's the currency of their work." },

  { id:"e01_52", ep:1, word:"〜つもり", reading:"〜つもり", meaning:"intend to ~ / plan to ~ / think one is ~", tier:1,
    kb:[],
    ex:[{j:"やつらは火星に行くつもりだぜ。",r:"やつらはかせいにいくつもりだぜ。",e:"Those guys are planning to go to Mars."},{j:"火星へ逃げるつもりか？",r:"かせいへにげるつもりか？",e:"Are you planning to flee to Mars?"},{j:"明日から運動するつもりだ。",r:"あしたからうんどうするつもりだ。",e:"I intend to start exercising from tomorrow."}],
    wm:"〜つもり marks a firm intention or assumption. 知ってるつもりだった = I thought I knew (but was wrong). Very versatile for plans, accusations, and self-deception." },

  { id:"e01_53", ep:1, word:"〜割に", reading:"〜わりに", meaning:"for ~ / considering ~ / unexpectedly given ~", tier:2,
    kb:[],
    ex:[{j:"雑魚の割に賞金は250万だ。",r:"ざこのわりにしょうきんは250まんだ。",e:"For a small fry, the bounty is 2.5 million."},{j:"値段の割においしい。",r:"ねだんのわりにおいしい。",e:"It's tasty considering the price."},{j:"若い割に落ち着いている。",r:"わかいわりにおちついている。",e:"He's calm considering how young he is."}],
    wm:"〜割に creates contrast between expectation and reality. 雑魚の割に高い = unexpectedly high for a nobody. Jet uses it to hook Spike who had dismissed the job." },

  { id:"e01_54", ep:1, word:"〜わけ", reading:"〜わけ", meaning:"reason why / that means / makes sense that / no wonder", tier:2,
    kb:[],
    ex:[{j:"金がないときは言うんだよ、そういうわけだよ。",r:"かねがないときはいうんだよ、そういうわけだよ。",e:"That's why he says it when there's no money — that's the reason."},{j:"だから行けないわけだ。",r:"だからいけないわけだ。",e:"That's why I can't go — it makes sense now."},{j:"そういうわけか、なるほど。",r:"そういうわけか、なるほど。",e:"I see, so that's why."}],
    wm:"わけ = the underlying reason or logic. 〜わけだ = 'that's why / it figures'. 〜わけない = 'there's no way'. 〜わけにはいかない = 'I can't (given the circumstances)'." },

  { id:"e01_55", ep:1, word:"〜ってんだよ", reading:"〜ってんだよ", meaning:"I'm SAYING that ~ / I said ~ (emphatic frustrated repetition)", tier:3,
    kb:[],
    ex:[{j:"言わねえってんだよ！",r:"いわねえってんだよ！",e:"I SAID I won't say it!"},{j:"知らねえってんだよ、何度言えば分かるんだ。",r:"しらねえってんだよ、なんどいえばわかるんだ。",e:"I'm TELLING you I don't know — how many times do I have to say it."},{j:"無理だってんだよ！",r:"むりだってんだよ！",e:"I SAID it's impossible!"}],
    wm:"〜と言っているんだよ compressed into rough casual speech. Used when repeating yourself in frustration. Very rough, very male, very Bebop. The emphasis is on 'I ALREADY SAID IT'." },

  { id:"e01_56", ep:1, word:"〜てもらおうか", reading:"〜てもらおうか", meaning:"would you please ~ / let me have ~ (firm request, slightly threatening)", tier:2,
    kb:[],
    ex:[{j:"本物かどうか見せてもらおうか。",r:"ほんものかどうかみせてもらおうか。",e:"Let me see whether it's the real thing."},{j:"話を聞かせてもらおうか。",r:"はなしをきかせてもらおうか。",e:"Why don't you tell me the story."},{j:"一緒に来てもらおうか。",r:"いっしょにきてもらおうか。",e:"I'll have you come with me."}],
    wm:"〜てもらおうか = 'I'll receive the favor of you doing ~'. Grammatically polite but contextually it's a demand. The gap between form and content = understated intimidation." },

  { id:"e01_57", ep:1, word:"〜たまま", reading:"〜たまま", meaning:"while remaining ~ / still in the state of ~ / without changing", tier:1,
    kb:[],
    ex:[{j:"生きたまま連れてくること。",r:"いきたままつれてくること。",e:"Bring them while keeping them alive."},{j:"服を着たまま寝た。",r:"ふくをきたままねた。",e:"I slept while still in my clothes."},{j:"立ったまま話した。",r:"たったままはなした。",e:"I spoke while standing up (without sitting down)."}],
    wm:"〜たまま = while remaining in that state, without that state changing. 生きたまま = while staying alive. Verb past + まま freezes the state. Essential grammar." },

  // ── ADDITIONAL VOCAB FROM DIALOGUE ───────────────────────────────────

  { id:"e01_58", ep:1, word:"敵対する", reading:"てきたいする", meaning:"to be hostile to / to oppose / to be at odds with", tier:2,
    kb:[{k:"敵",r:"てき",m:"enemy/opponent",rad:["啇","攵"],rm:["go straight to","strike"],mn:"Striking straight at someone — an enemy, opponent"},{k:"対",r:"たい",m:"versus/oppose/face",rad:["丵","寸"],rm:["grass growing up","inch/measure"],mn:"Measured against what grows opposite — versus, face, oppose"}],
    ex:[{j:"敵対する組織との抗争があったんだ。",r:"てきたいするそしきとのこうそうがあったんだ。",e:"There was a turf war with a rival organization."},{j:"彼らは互いに敵対している。",r:"かれらはたがいにてきたいしている。",e:"They are hostile to each other."},{j:"敵対する勢力に囲まれた。",r:"てきたいするせいりょくにかこまれた。",e:"Surrounded by hostile forces."}],
    wm:"敵 (enemy) + 対 (versus/face) + する = to be in opposition to. 敵対する組織 = a rival organization actively working against you. Standard crime/conflict vocabulary." },

  { id:"e01_59", ep:1, word:"死に物狂い", reading:"しにものぐるい", meaning:"desperately / with everything one has / like one's life depends on it", enTarget:"lives depended", tier:3,
    kb:[{k:"死",r:"し",m:"death",rad:["歹","匕"],rm:["bone fragment","crouching person"],mn:"A crumbling bone beside a fallen person — death"},{k:"物",r:"もの",m:"thing/object",rad:["牛","勿"],rm:["cow","do not"],mn:"A cow marked do-not-touch — a thing"},{k:"狂",r:"ぐるい",m:"mad/crazy/berserk",rad:["犭","王"],rm:["animal","king"],mn:"An animal that acts like a king — crazy, berserk"}],
    ex:[{j:"死に物狂いで掘ったな。",r:"しにものぐるいでほったな。",e:"We dug like our lives depended on it."},{j:"死に物狂いで働いた。",r:"しにものぐるいではたらいた。",e:"I worked with everything I had."},{j:"死に物狂いで逃げた。",r:"しにものぐるいでにげた。",e:"He fled desperately."}],
    wm:"Going berserk (狂い) about death-things (死に物) — so desperate that dying doesn't matter. The old man describes building the gates this way. Extreme effort." },

  { id:"e01_60", ep:1, word:"一生懸命", reading:"いっしょうけんめい", meaning:"with all one's effort / as hard as one can / earnestly", tier:1,
    kb:[{k:"一",r:"いっ",m:"one",rad:["一"],rm:["one line"],mn:"One horizontal line — one"},{k:"生",r:"しょう",m:"life",rad:["土","𠂉"],rm:["earth","sprout"],mn:"A sprout from earth — life"},{k:"懸",r:"けん",m:"hang/stake/be at risk",rad:["縣","心"],rm:["hang/suspend","heart"],mn:"A heart hanging in suspension — to stake, be at risk"},{k:"命",r:"めい",m:"life/fate",rad:["亼","叩"],rm:["gather","kneel"],mn:"Fate gathered while kneeling — life, fate"}],
    ex:[{j:"俺が一生懸命ゲート掘ったおかげなんだぞ。",r:"おれがいっしょうけんめいゲートほったおかげなんだぞ。",e:"It's thanks to me digging the gate as hard as I could."},{j:"一生懸命勉強した。",r:"いっしょうけんめいべんきょうした。",e:"I studied as hard as I could."},{j:"一生懸命働きます。",r:"いっしょうけんめいはたらきます。",e:"I will work with all my effort."}],
    wm:"One (一) life (生) staked (懸) on this (命) — staking your life on one thing = giving everything. The go-to expression for maximum effort in Japanese." },

  { id:"e01_61", ep:1, word:"泥棒", reading:"どろぼう", meaning:"thief / robber / burglar", tier:1,
    kb:[{k:"泥",r:"どろ",m:"mud/mire",rad:["氵","尼"],rm:["water","nun/crouching"],mn:"Water of the crouching low — mud, mire (someone who lurks in the mud)"},{k:"棒",r:"ぼう",m:"stick/rod",rad:["木","奉"],rm:["tree","offer"],mn:"An offered tree — a stick, rod (reference to old stick-fighting thieves)"}],
    ex:[{j:"泥棒！",r:"どろぼう！",e:"Thief!"},{j:"泥棒に入られた。",r:"どろぼうにはいられた。",e:"We were broken into (a burglar entered)."},{j:"あいつはただの泥棒だ。",r:"あいつはただのどろぼうだ。",e:"That guy is just a thief."}],
    wm:"The old gambler shouts 泥棒！ when Spike and Jet win his money. His accusation is reflexive — he can't believe he lost fairly. Essential everyday word." },

  { id:"e01_62", ep:1, word:"借り", reading:"かり", meaning:"a debt (of gratitude) / something owed / owing someone", tier:2,
    kb:[{k:"借",r:"か(り)",m:"borrow",rad:["亻","昔"],rm:["person","long ago/former"],mn:"A person in a former arrangement — to borrow, be in debt"}],
    ex:[{j:"返すとも。あんたには借りがある。",r:"かえすとも。あんたにはかりがある。",e:"Of course I'll return it. I owe you."},{j:"彼には借りがある。",r:"かれにはかりがある。",e:"I owe him."},{j:"借りは返す。",r:"かりはかえす。",e:"I repay my debts."}],
    wm:"The arms dealer tells Spike 借りがある (I owe you). In the underworld, debts of obligation (借り) are currency. Tracking 借り and returning them is how relationships work." },

  { id:"e01_63", ep:1, word:"懐", reading:"ふところ", meaning:"pocket / bosom / (someone's) possession", tier:2,
    kb:[{k:"懐",r:"ふところ",m:"pocket/bosom/heart/nostalgia",rad:["忄","褱"],rm:["heart","embrace/hold"],mn:"A heart held in an embrace — pocket, bosom, what one holds dear"}],
    ex:[{j:"やつの懐から頂戴した。",r:"やつのふところからちょうだいした。",e:"I received it from his pocket (I took it from him)."},{j:"懐が温かい。",r:"ふところがあたたかい。",e:"His pockets are deep (he has money)."},{j:"懐に入れた。",r:"ふところにいれた。",e:"I put it in my pocket/bosom."}],
    wm:"Spike took the Bloody Eye sample from Asimov's 懐 — his pocket/person. 懐から頂戴した = 'I received it from his person' = I pickpocketed it while fighting." },

  { id:"e01_64", ep:1, word:"連中", reading:"れんちゅう", meaning:"those people / that bunch / those guys (slightly contemptuous)", tier:2,
    kb:[{k:"連",r:"れん",m:"connect/serial",rad:["⻌","車"],rm:["movement","wheel"],mn:"Wheels moving in a connected series — connected, serial"},{k:"中",r:"ちゅう",m:"middle/among/group",rad:["口","丨"],rm:["box","line through"],mn:"A line through a box — the middle, among, in a group"}],
    ex:[{j:"連中は大騒ぎよ。",r:"れんちゅうはおおさわぎよ。",e:"Those guys are in a huge uproar."},{j:"あの連中は何者だ？",r:"あのれんちゅうはなにものだ？",e:"Who are those guys?"},{j:"連中を全員捕まえろ。",r:"れんちゅうをぜんいんつかまえろ。",e:"Catch all of those people."}],
    wm:"れんちゅう = a connected bunch of people (連中). Slightly dismissive or contemptuous — those people over there. The syndicate 連中 are furious at Asimov." },

  { id:"e01_65", ep:1, word:"奥", reading:"おく", meaning:"the back / the inside / deeper in", tier:1,
    kb:[{k:"奥",r:"おく",m:"interior/back/depths",rad:["宀","釆","大"],rm:["roof","sort/branch","big"],mn:"A big branching thing deep under a roof — the interior, back, depths"}],
    ex:[{j:"奥に１缶くらいあるんじゃないか。",r:"おくに1かんくらいあるんじゃないか。",e:"There should be about one can in the back."},{j:"奥に入ってください。",r:"おくにはいってください。",e:"Please go further inside."},{j:"山の奥深く。",r:"やまのおくふかく。",e:"Deep in the mountains."}],
    wm:"The bartender says tomato juice might be 奥に (in the back). 奥 = the inner/deeper part. Also used metaphorically: 心の奥 = the depths of one's heart." },

  { id:"e01_66", ep:1, word:"通過する", reading:"つうかする", meaning:"to pass through / to go through / to transit", tier:1,
    kb:[{k:"通",r:"つう",m:"pass through/communicate",rad:["⻌","甬"],rm:["movement","cylinder/passage"],mn:"Moving through a cylindrical passage — to pass through, communicate"},{k:"過",r:"か",m:"pass/exceed/go by",rad:["⻌","咼"],rm:["movement","bone/face"],mn:"Moving past a skull — to pass by, exceed"}],
    ex:[{j:"ゲートを通過しましたら料金所に１列でお並びください。",r:"ゲートをつうかしましたらりょうきんじょにいちれつでおならびください。",e:"After passing through the gate, please line up in one row at the toll booth."},{j:"検査を通過した。",r:"けんさをつうかした。",e:"I passed the inspection."},{j:"国境を通過する。",r:"こっきょうをつうかする。",e:"To pass through a border crossing."}],
    wm:"The gate announcement uses 通過する officially. 通 (pass through) + 過 (go past) = move completely through something. Applied to gates, checkpoints, exams." },

  { id:"e01_67", ep:1, word:"料金所", reading:"りょうきんじょ", meaning:"toll booth / toll gate / fee station", tier:2,
    kb:[{k:"料",r:"りょう",m:"fee/material/ration",rad:["米","斗"],rm:["rice","measuring cup"],mn:"Rice measured out — a fee, ration, material"},{k:"金",r:"きん",m:"money",rad:["人","土"],rm:["person","earth"],mn:"Money"},{k:"所",r:"じょ",m:"place/location",rad:["户","斤"],rm:["door/household","axe/skill"],mn:"A skilled household — a place, location"}],
    ex:[{j:"料金所に１列でお並びください。",r:"りょうきんじょにいちれつでおならびください。",e:"Please line up in one row at the toll booth."},{j:"高速道路の料金所で払った。",r:"こうそくどうろのりょうきんじょではらった。",e:"I paid at the highway toll booth."},{j:"料金所が混雑している。",r:"りょうきんじょがこんざつしている。",e:"The toll booth is congested."}],
    wm:"Where Spike and Jet must navigate with their bounty — the 料金所 is the chokepoint. 料 (fee) + 金 (money) + 所 (place) = the place where you pay." },

  { id:"e01_68", ep:1, word:"引き落とし", reading:"ひきおとし", meaning:"automatic debit / direct withdrawal / charging", tier:2,
    kb:[{k:"引",r:"ひき",m:"pull/draw/subtract",rad:["弓","丨"],rm:["bow","line"],mn:"A bow being drawn back — to pull, draw, subtract"},{k:"落とし",r:"おとし",m:"drop/deduct/fall",rad:["艹","水","夂"],rm:["plant","water","follow downward"],mn:"Water following downward — to drop, fall, deduct"}],
    ex:[{j:"クレジットセンサーを引き落としモードにして通過してください。",r:"クレジットセンサーをひきおとしモードにしてつうかしてください。",e:"Please set your credit sensor to debit mode and pass through."},{j:"口座から引き落とされた。",r:"こうざからひきおとされた。",e:"It was debited from my account."},{j:"自動引き落としで払う。",r:"じどうひきおとしではらう。",e:"To pay by automatic debit."}],
    wm:"The gate system uses automatic 引き落とし — this is exactly how Hakim's crime works in EP02. Learning gate payment vocabulary in EP01 sets up the next episode." },

  { id:"e01_69", ep:1, word:"旅芸人", reading:"たびげいにん", meaning:"travelling entertainer / wandering performer", tier:3,
    kb:[{k:"旅",r:"たび",m:"journey/travel",rad:["方","𠂉"],rm:["direction","spreading"],mn:"Spreading out in a direction — a journey, travel"},{k:"芸",r:"げい",m:"art/skill/performance",rad:["艹","云"],rm:["plant","say/cloud"],mn:"A plant saying things — art, skill, performance"},{k:"人",r:"にん",m:"person",rad:["人"],rm:["person"],mn:"A person"}],
    ex:[{j:"本当は旅芸人なんだ。",r:"ほんとうはたびげいにんなんだ。",e:"Actually, I'm a travelling entertainer."},{j:"旅芸人が町を回っていた。",r:"たびげいにんがまちをまわっていた。",e:"Travelling entertainers were going around town."},{j:"旅芸人のような生活。",r:"たびげいにんのようなせいかつ。",e:"A life like a travelling performer."}],
    wm:"Spike's cover story when chatting with Katerina — 本当は旅芸人なんだ. Perfect deadpan. She says 冗談か本気か分からない — exactly the intended effect." },

  { id:"e01_70", ep:1, word:"悪い夢", reading:"わるいゆめ", meaning:"bad dream / nightmare", tier:2,
    kb:[{k:"悪",r:"わる(い)",m:"bad/evil/wrong",rad:["亜","心"],rm:["ugly/second-rate","heart"],mn:"An ugly heart — bad, evil"},{k:"夢",r:"ゆめ",m:"dream",rad:["艹","夕","冖"],rm:["plants","evening","cover"],mn:"Plants veiled in evening mist — a dream"}],
    ex:[{j:"悪い夢さ。",r:"わるいゆめさ。",e:"It was a bad dream."},{j:"昨夜悪い夢を見た。",r:"さくやわるいゆめをみた。",e:"I had a bad dream last night."},{j:"これは悪い夢じゃないのか？",r:"これはわるいゆめじゃないのか？",e:"Isn't this some kind of bad dream?"}],
    wm:"Spike's line after being outsmarted — 悪い夢さ. The phrase returns word-for-word in EP26 between Spike and Julia. EP01 plants the seed of the show's ending." },

  { id:"e01_71", ep:1, word:"現れる", reading:"あらわれる", meaning:"to appear / to show up / to emerge", tier:1,
    kb:[{k:"現",r:"あらわ(れる)",m:"appear/manifest/present",rad:["王","見"],rm:["king/gem","see"],mn:"A gem coming into view — to appear, manifest, be present"}],
    ex:[{j:"北の街はずれに赤い目のコヨーテは現れる。",r:"きたのまちはずれにあかいめのコヨーテはあらわれる。",e:"A red-eyed coyote appears at the edge of the northern town."},{j:"突然彼が現れた。",r:"とつぜんかれがあらわれた。",e:"He appeared suddenly."},{j:"問題が現れた。",r:"もんだいがあらわれた。",e:"A problem appeared."}],
    wm:"The fortune teller's prediction — 赤い目のコヨーテは現れる. 現 = gem/present + 見 = see = something coming into visible existence." },

  { id:"e01_72", ep:1, word:"弱る", reading:"よわる", meaning:"to weaken / to be in bad shape / to be worn down", tier:2,
    kb:[{k:"弱",r:"よわ(る)",m:"weak/feeble",rad:["弓","弓"],rm:["bow","bow"],mn:"Two small bows — weak, feeble (contrast with 強 strong)"}],
    ex:[{j:"弱ってる雑魚は相手にしないんだ。",r:"よわってるざこはあいてにしないんだ。",e:"I don't deal with weakened small fry."},{j:"病気で体が弱った。",r:"びょうきでからだがよわった。",e:"My body weakened from illness."},{j:"弱ったな、どうしよう。",r:"よわったな、どうしよう。",e:"This is a problem, what should I do?"}],
    wm:"Katerina tells Spike: 弱ってる雑魚は相手にしない — she recognizes his wisdom. 弱る = to become weak. Also used like '困った' to mean 'this is a problem'." },

  { id:"e01_73", ep:1, word:"相手にする", reading:"あいてにする", meaning:"to deal with / to engage with / to take on as an opponent", tier:2,
    kb:[{k:"相",r:"あい",m:"mutual/together",rad:["木","目"],rm:["tree","eye"],mn:"An eye watching a tree — mutual, together"},{k:"手",r:"て",m:"hand",rad:["手"],rm:["hand"],mn:"A hand"},{k:"にする",r:"にする",m:"make into / treat as",rad:[""],rm:[""],mn:"To make into, treat as, regard as"}],
    ex:[{j:"弱ってる雑魚は相手にしないんだ。",r:"よわってるざこはあいてにしないんだ。",e:"I don't deal with weakened small fry."},{j:"そんな話、相手にしない。",r:"そんなはなし、あいてにしない。",e:"I won't engage with that kind of talk."},{j:"彼を相手にするな。",r:"かれをあいてにするな。",e:"Don't deal with him."}],
    wm:"相手 = partner/opponent + にする = treat as. 相手にしない = refuse to engage with. Used when dismissing someone as not worth your attention." },

  { id:"e01_74", ep:1, word:"息を止める", reading:"いきをとめる", meaning:"to stop someone's breathing / to kill silently", tier:2,
    kb:[{k:"息",r:"いき",m:"breath/breathing",rad:["自","心"],rm:["nose/self","heart"],mn:"The heart's self — breath, breathing"},{k:"止める",r:"とめる",m:"stop/halt",rad:["止"],rm:["stop/foot"],mn:"A foot stopping — to stop, halt"}],
    ex:[{j:"あいつの息を止めるなんざ１秒でできた。",r:"あいつのいきをとめるなんざ1びょうでできた。",e:"Stopping that guy's breathing would have taken one second."},{j:"息を止めて潜った。",r:"いきをとめてもぐった。",e:"I held my breath and dove under."},{j:"息をのむ。",r:"いきをのむ。",e:"To catch one's breath (in surprise)."}],
    wm:"Katerina says this showing she saw Spike's full ability — he could have killed Asimov in a second but chose not to. 息 (breath) + 止める (stop) = stop breathing = kill." },

  { id:"e01_75", ep:1, word:"頼り過ぎ", reading:"たよりすぎ", meaning:"relying too much / overdependent", tier:2,
    kb:[{k:"頼",r:"たよ(り)",m:"rely on/depend",rad:["頁","束"],rm:["head/page","bundle"],mn:"A bundled head — to lean/rely on"},{k:"過ぎ",r:"すぎ",m:"too much/exceed/pass",rad:["⻌","咼"],rm:["movement","bone/face"],mn:"Moving past what is appropriate — too much, exceed"}],
    ex:[{j:"目に頼り過ぎなんだよ。",r:"めにたよりすぎなんだよ。",e:"You're relying on your eyes too much."},{j:"人に頼り過ぎるな。",r:"ひとにたよりすぎるな。",e:"Don't rely on people too much."},{j:"薬に頼り過ぎている。",r:"くすりにたよりすぎている。",e:"He's relying too much on medicine."}],
    wm:"Spike's taunt during the fight — 目に頼り過ぎなんだよ. Bloody Eye enhances vision but creates tunnel focus. 〜過ぎ = doing something to excess. Very common pattern." },

  { id:"e01_76", ep:1, word:"抜け出す", reading:"ぬけだす", meaning:"to escape from / to break free / to slip out of", tier:2,
    kb:[{k:"抜",r:"ぬ(け)",m:"pull out/extract/escape",rad:["扌","友"],rm:["hand","friend/pull"],mn:"A hand pulling out a friend — to extract, pull out, escape"},{k:"出す",r:"だす",m:"put out/come out",rad:["凵","止"],rm:["container","stop/foot"],mn:"Taking something out of a container — to put out, come out"}],
    ex:[{j:"やっとここの暮らしから抜け出せるんじゃない。",r:"やっとここのくらしからぬけだせるんじゃない。",e:"We can finally escape from this life here."},{j:"その状況から抜け出した。",r:"そのじょうきょうからぬけだした。",e:"I escaped from that situation."},{j:"組織から抜け出す。",r:"そしきからぬけだす。",e:"To break free from the organization."}],
    wm:"Katerina's dream — やっとここの暮らしから抜け出せる. 抜け (slip/pull out) + 出す (come out) = escape completely. More final than just 逃げる." },

  { id:"e01_77", ep:1, word:"張り合い", reading:"はりあい", meaning:"worth / reward / satisfaction / incentive", tier:2,
    kb:[{k:"張",r:"は(り)",m:"stretch/extend/put up",rad:["弓","長"],rm:["bow","long"],mn:"A long bow stretched taut — to stretch, extend, put up"},{k:"合い",r:"あい",m:"fit/match/mutual",rad:["亼","口"],rm:["gather","mouth"],mn:"Mouths gathering together — to fit, match, mutual"}],
    ex:[{j:"安い賞金首じゃ張り合いなくてね。",r:"やすいしょうきんくびじゃはりあいなくてね。",e:"Cheap bounty targets aren't worth the effort."},{j:"張り合いのある仕事だ。",r:"はりあいのあるしごとだ。",e:"It's rewarding work."},{j:"張り合いがない。",r:"はりあいがない。",e:"There's no satisfaction in it / no point."}],
    wm:"The arms dealer says 安い賞金首じゃ張り合いない — not worth the effort. 張り合い = the satisfaction of matching/stretching against something worthy. No worthy opponent = no 張り合い." },

  { id:"e01_78", ep:1, word:"詳しく", reading:"くわしく", meaning:"in detail / thoroughly / with full explanation", tier:1,
    kb:[{k:"詳",r:"くわ(しく)",m:"detailed/thorough",rad:["言","羊"],rm:["words","sheep"],mn:"Words as many as sheep — detailed, thorough, many words"}],
    ex:[{j:"詳しく聞きたいねえ。",r:"くわしくききたいねえ。",e:"I'd like to hear about it in detail."},{j:"詳しく説明してください。",r:"くわしくせつめいしてください。",e:"Please explain in detail."},{j:"彼は火星について詳しい。",r:"かれはかせいについてくわしい。",e:"He knows a lot about Mars."}],
    wm:"The bar scene — someone says 詳しく聞きたいねえ right before the fight breaks out. They never get their detailed explanation. Wanting details is always interrupted in this world." },

  { id:"e01_79", ep:1, word:"腹が減る", reading:"はらがへる", meaning:"to get hungry / to be hungry (lit. stomach empties)", tier:1,
    kb:[{k:"腹",r:"はら",m:"stomach/belly/guts",rad:["月","复"],rm:["body/flesh","return/again"],mn:"Flesh that keeps returning to emptiness — stomach, belly, guts"},{k:"減る",r:"へる",m:"decrease/diminish/empty out",rad:["氵","減"],rm:["water","decrease"],mn:"Water decreasing — to diminish, decrease, empty out"}],
    ex:[{j:"腹減ったなあ。",r:"はらへったなあ。",e:"I'm hungry."},{j:"腹が減っては戦ができぬ。",r:"はらがへってはいくさができぬ。",e:"An army marches on its stomach (proverb)."},{j:"腹が減ったら食べなさい。",r:"はらがへったらたべなさい。",e:"Eat when you're hungry."}],
    wm:"The show's running joke — the crew is always hungry because there's no 賞金. 腹が減る is one of the most essential phrases in casual Japanese. 腹 (belly) + 減る (decrease) = empty stomach." },

  { id:"e01_80", ep:1, word:"乗り気でない", reading:"のりきでない", meaning:"not feeling it / unenthusiastic / not keen", tier:2,
    kb:[{k:"乗",r:"の(り)",m:"ride/get on/be into",rad:["木","𠂉"],rm:["tree","person up high"],mn:"A person riding high in a tree — to ride, get on, be into"},{k:"気",r:"き",m:"spirit/feeling/mood",rad:["气","米"],rm:["air","rice"],mn:"Energy/rice rising as steam — spirit, feeling, mood"}],
    ex:[{j:"乗らねえな。",r:"のらねえな。",e:"I'm not feeling it / not keen."},{j:"彼は乗り気でない。",r:"かれはのりきでない。",e:"He's not enthusiastic about it."},{j:"その計画には乗り気になれない。",r:"そのけいかくにはのりきになれない。",e:"I can't get enthusiastic about that plan."}],
    wm:"Spike says 乗らねえな when Jet pitches the Tijuana bounty — he's not feeling it. 乗る (to ride/get on) used metaphorically = to get on board with an idea. 乗らない = not getting on board." },

  { id:"e01_81", ep:1, word:"甘く見る", reading:"あまくみる", meaning:"to underestimate / to take lightly / to not take seriously", tier:2,
    kb:[{k:"甘",r:"あま(く)",m:"sweet/naive/lenient",rad:["甘"],rm:["sweet"],mn:"Something sweet in the mouth — sweet, naive, lenient"},{k:"見る",r:"みる",m:"see/look/view",rad:["目","儿"],rm:["eye","legs/person"],mn:"A person led by their eyes — to see, look, view"}],
    ex:[{j:"おまえは女を甘く見ておる。",r:"おまえはおんなをあまくみておる。",e:"You're underestimating women."},{j:"敵を甘く見るな。",r:"てきをあまくみるな。",e:"Don't underestimate the enemy."},{j:"その仕事を甘く見ていた。",r:"そのしごとをあまくみていた。",e:"I was taking that job too lightly."}],
    wm:"The fortune teller's warning to Spike — おまえは女を甘く見ておる. He does exactly that and nearly dies. 甘く (sweetly/naively) + 見る (see/view) = to view something as too sweet/easy." },

  { id:"e01_82", ep:1, word:"安い", reading:"やすい", meaning:"cheap / inexpensive / low (value)", tier:1,
    kb:[{k:"安",r:"やす(い)",m:"cheap/peaceful/easy",rad:["宀","女"],rm:["roof","woman"],mn:"A woman under a roof — peaceful, secure, cheap (costs little to maintain peace)"}],
    ex:[{j:"安い男だな。",r:"やすいおとこだな。",e:"What a cheap man (low value)."},{j:"安い賞金首じゃ張り合いなくてね。",r:"やすいしょうきんくびじゃはりあいなくてね。",e:"Cheap bounty targets aren't worth the effort."},{j:"この店は安い。",r:"このみせはやすい。",e:"This shop is cheap."}],
    wm:"あんたの値段知ってるか — たったの250万ウーロンだぜ。安い男だな. Spike is told his own bounty value contemptuously. 安い here = low value, not just inexpensive." },

  { id:"e01_83", ep:1, word:"パー", reading:"パー", meaning:"all gone / wiped out / zero (slang)", tier:3,
    kb:[],
    ex:[{j:"おまえが壊した機体の修理と店の修理と治療費でパーだ。",r:"おまえがこわしたきたいのしゅうりとみせのしゅうりとちりょうひでパーだ。",e:"All gone on the ship repair, shop repair, and treatment costs."},{j:"全部パーになった。",r:"ぜんぶパーになった。",e:"It all went to zero / all wiped out."},{j:"努力がパーになった。",r:"どりょくがパーになった。",e:"All my effort came to nothing."}],
    wm:"パー from パーフェクトゼロ or the hand gesture (open palm = zero in some Japanese games). Jet uses it to mean the entire bounty is gone — 全部パー. The show's recurring financial punchline." },

  { id:"e01_84", ep:1, word:"アディオス", reading:"アディオス", meaning:"adios / goodbye (Spanish loanword, used dramatically)", tier:3,
    kb:[],
    ex:[{j:"アディオス カウボーイ。",r:"アディオス カウボーイ。",e:"Adios, cowboy."},{j:"アディオス。",r:"アディオス。",e:"Adios."},{j:"別れを告げた。",r:"わかれをつげた。",e:"He said his farewell."}],
    wm:"Katerina's farewell to Spike — アディオス カウボーイ. Spanish in a Japanese show set in space. The word choice signals she sees him as exactly what he called himself: a cowboy." },

  { id:"e01_85", ep:1, word:"〜なんざ", reading:"〜なんざ", meaning:"things like ~ / something as trivial as ~ (dismissive)", tier:3,
    kb:[],
    ex:[{j:"あいつの息を止めるなんざ１秒でできた。",r:"あいつのいきをとめるなんざ1びょうでできた。",e:"Something like stopping his breathing would have taken one second."},{j:"そんなことなんざ気にしない。",r:"そんなことなんざきにしない。",e:"I don't care about something like that."},{j:"100万なんざ安いもんだ。",r:"100まんなんざやすいもんだ。",e:"Something like 1 million is nothing."}],
    wm:"〜なんざ = 〜などは contracted, rough/dismissive. Implies the thing mentioned is trivial or contemptible. Katerina: stopping his breathing なんざ (= a thing as trivial as) one second. Chilling understatement." },

  { id:"e01_86", ep:1, word:"迎えに来る", reading:"むかえにくる", meaning:"to come to pick someone up / to come for someone", tier:1,
    kb:[{k:"迎",r:"むか(え)",m:"receive/go to meet/welcome",rad:["⻌","卬"],rm:["movement","rise to meet"],mn:"Moving to rise and meet someone — to welcome, go to meet"}],
    ex:[{j:"私あんたが迎えに来てくれるの、ずっと待ってた。",r:"わたしあんたがむかえにきてくれるの、ずっとまってた。",e:"I was always waiting for you to come for me."},{j:"空港まで迎えに来てくれた。",r:"くうこうまでむかえにきてくれた。",e:"He came to pick me up at the airport."},{j:"迎えに来てください。",r:"むかえにきてください。",e:"Please come to pick me up."}],
    wm:"Katerina's heartbreaking line — ずっと待ってた. She waited for Spike to come for her, not knowing he was also running. 迎えに来る = come TO receive someone = pick up, rescue, collect." },

  // ── EP 02+ (existing) ──
  // ── CORE NOUNS ──────────────────────────────────────────────────────

  { id:"e02_01", ep:2, word:"大物", reading:"おおもの", meaning:"big catch / major target / important figure", tier:1,
    kb:[{k:"大",r:"おお",m:"big/large/great",rad:["大"],rm:["large person with arms spread"],mn:"A person with arms spread wide — big, great"},{k:"物",r:"もの",m:"thing/person of significance",rad:["牛","勿"],rm:["cow","do not"],mn:"A notable cow you cannot touch — a significant thing or person"}],
    ex:[{j:"久しぶりの大物だ、頑張ってゲットしてくれたまえ。",r:"ひさしぶりのおおものだ、がんばってゲットしてくれたまえ。",e:"It's a big catch for the first time in a while — do your best to get him."},{j:"あいつは大物の賞金首だ。",r:"あいつはおおもののしょうきんくびだ。",e:"That guy is a major bounty target."},{j:"今度こそ大物を捕まえる。",r:"こんどこそおおものをつかまえる。",e:"This time I'll definitely catch a big one."}],
    wm:"Big Shot's hosts say 久しぶりの大物 with genuine excitement about the 800万 bounty. The show calibrates importance entirely by bounty size." },

  { id:"e02_02", ep:2, word:"実験動物", reading:"じっけんどうぶつ", meaning:"laboratory animal / experimental animal", tier:2,
    kb:[{k:"実",r:"じっ",m:"fruit/reality/actual",rad:["宀","貫"],rm:["roof","thread through"],mn:"A thread through to the core under a roof — actual substance, reality"},{k:"験",r:"けん",m:"test/effect/verify",rad:["馬","㒼"],rm:["horse","full"],mn:"A horse pushed to full capacity — to test, verify"},{k:"動",r:"どう",m:"move/motion",rad:["重","力"],rm:["heavy","strength/power"],mn:"Strength moving something heavy — motion, movement"},{k:"物",r:"ぶつ",m:"thing/creature",rad:["牛","勿"],rm:["cow","do not"],mn:"A notable creature — a thing"}],
    ex:[{j:"とある研究機関から実験動物を奪って逃走中なんだ。",r:"とあるけんきゅうきかんからじっけんどうぶつをうばってとうそうちゅうなんだ。",e:"He's on the run after stealing a laboratory animal from a certain research institution."},{j:"実験動物の保護を訴える。",r:"じっけんどうぶつのほごをうったえる。",e:"To appeal for the protection of laboratory animals."},{j:"実験動物として使われた。",r:"じっけんどうぶつとしてつかわれた。",e:"It was used as a laboratory animal."}],
    wm:"Ein's origin — stolen 実験動物 from a 研究機関 (research institution). The fact the institution was doing 非合法 research is why they never filed a report." },

  { id:"e02_03", ep:2, word:"研究機関", reading:"けんきゅうきかん", meaning:"research institution / research organization", tier:2,
    kb:[{k:"研",r:"けん",m:"sharpen/polish/research",rad:["石","干"],rm:["stone","dry/polish"],mn:"Polishing a stone — to sharpen, refine, research"},{k:"究",r:"きゅう",m:"investigate/exhaust/root",rad:["穴","九"],rm:["cave","nine/extreme"],mn:"Going to the extreme depths of a cave — to investigate thoroughly"},{k:"機",r:"き",m:"machine/mechanism/opportunity",rad:["木","幾"],rm:["tree","how many/mechanism"],mn:"A wooden mechanism — machine, loom, opportunity"},{k:"関",r:"かん",m:"connection/gateway/barrier",rad:["門","𤕩"],rm:["gate","block"],mn:"Something blocking a gate — a barrier, connection, gateway"}],
    ex:[{j:"非合法に育てていた研究機関から盗んだ。",r:"ひごうほうにそだてていたけんきゅうきかんからぬすんだ。",e:"He stole it from the research institution that was raising it illegally."},{j:"大学の研究機関で働いている。",r:"だいがくのけんきゅうきかんではたらいている。",e:"I work at a university research institution."},{j:"研究機関が新しい発見を発表した。",r:"けんきゅうきかんがあたらしいはっけんをはっぴょうした。",e:"The research institution announced a new discovery."}],
    wm:"The institution that created Ein never reported his theft — because their 非合法 research would be exposed. Hidden crimes protecting hidden crimes." },

  { id:"e02_04", ep:2, word:"データ犬", reading:"データけん", meaning:"data dog / genetically enhanced intelligent dog", tier:2,
    kb:[],
    ex:[{j:"彼が盗んだのはある研究機関が非合法に育てていたデータ犬だったらしい。",r:"かれがぬすんだのはあるけんきゅうきかんがひごうほうにそだてていたデータけんだったらしい。",e:"What he stole was apparently a data dog that a certain research institution had been raising illegally."},{j:"データ犬は普通の犬とは違う。",r:"データけんはふつうのいぬとはちがう。",e:"Data dogs are different from ordinary dogs."},{j:"コレクターの間では天文学的な値段がついてるそうだ。",r:"コレクターのあいだではてんもんがくてきなねだんがついてるそうだ。",e:"Apparently among collectors they go for astronomical prices."}],
    wm:"Ein is a データ犬 — essentially a living computer with fur. His true nature is never explained. Spike treats him as worthless; he's actually priceless." },

  { id:"e02_05", ep:2, word:"天文学的", reading:"てんもんがくてき", meaning:"astronomical / astronomically (large/expensive)", tier:2,
    kb:[{k:"天",r:"てん",m:"heaven/sky",rad:["一","大"],rm:["one","big person"],mn:"A great person beneath the sky — heaven, the sky"},{k:"文",r:"もん",m:"writing/pattern/letter",rad:["文"],rm:["pattern/writing"],mn:"A pattern — writing, letters, patterns"},{k:"学",r:"がく",m:"study/learning",rad:["爫","冖","子"],rm:["claw","cover","child"],mn:"A child under cover learning — study, learning"},{k:"的",r:"てき",m:"-like/-ish/of the nature of",rad:["白","勺"],rm:["white","ladle/mark"],mn:"A white target mark — -like, -ish, of the nature of"}],
    ex:[{j:"天文学的な値段がついてるそうだ。",r:"てんもんがくてきなねだんがついてるそうだ。",e:"Apparently they go for astronomical prices."},{j:"天文学的な数字だ。",r:"てんもんがくてきなすうじだ。",e:"That's an astronomical number."},{j:"被害額は天文学的な規模だった。",r:"ひがいがくはてんもんがくてきなきぼだった。",e:"The damage was on an astronomical scale."}],
    wm:"天文学 (astronomy) + 的 (-like) = astronomical. Used in Japanese exactly like English 'astronomical' to mean unimaginably large. Ein is worth more than his bounty." },

  { id:"e02_06", ep:2, word:"整形", reading:"せいけい", meaning:"plastic surgery / cosmetic surgery", tier:2,
    kb:[{k:"整",r:"せい",m:"arrange/put in order",rad:["束","攵","正"],rm:["bundle","strike","correct"],mn:"Striking bundles into correct arrangement — to arrange, put in order"},{k:"形",r:"けい",m:"form/shape/appearance",rad:["彡","开"],rm:["hair/lines","open"],mn:"Lines creating an open shape — form, shape, appearance"}],
    ex:[{j:"整形のやり過ぎで金がなくなったか？",r:"せいけいのやりすぎでかねがなくなったか？",e:"Did you run out of money from too much plastic surgery?"},{j:"彼は整形手術で顔を変えた。",r:"かれはせいけいしゅじゅつでかおをかえた。",e:"He changed his face with plastic surgery."},{j:"整形後の写真だ。",r:"せいけいごのしゃしんだ。",e:"This is a photo from after the surgery."}],
    wm:"Hakim keeps changing his face through 整形 to avoid capture — and runs broke doing it. The photo Jet has is already outdated. Disguise as a business expense." },

  { id:"e02_07", ep:2, word:"完璧", reading:"かんぺき", meaning:"perfect / flawless / complete", tier:1,
    kb:[{k:"完",r:"かん",m:"complete/perfect/whole",rad:["宀","元"],rm:["roof","origin/yuan"],mn:"An origin perfectly contained under a roof — complete, whole"},{k:"璧",r:"ぺき",m:"jade disc/flawless gem",rad:["玉","辟"],rm:["jade","open/sovereign"],mn:"A sovereign jade disc — flawless, perfect"}],
    ex:[{j:"完璧な駄犬だ。完璧な、ただも同然だ。",r:"かんぺきなだけんだ。かんぺきな、ただもどうぜんだ。",e:"A perfectly useless dog. Perfectly worthless, basically free."},{j:"完璧な計画だ。",r:"かんぺきなけいかくだ。",e:"A perfect plan."},{j:"彼女の仕事は完璧だ。",r:"かのじょのしごとはかんぺきだ。",e:"Her work is flawless."}],
    wm:"Spike says 完璧な駄犬 (perfectly worthless dog) twice — with contempt, then takes Ein home anyway. 完璧 used as sarcastic intensifier is very Spike." },

  { id:"e02_08", ep:2, word:"駄犬", reading:"だけん", meaning:"worthless dog / useless mutt", tier:3,
    kb:[{k:"駄",r:"だ",m:"useless/pack horse/inferior",rad:["馬","大"],rm:["horse","big"],mn:"A big horse used only for carrying packs — a beast of burden, something lowly/useless"},{k:"犬",r:"けん",m:"dog",rad:["犬"],rm:["dog"],mn:"Pictograph of a dog"}],
    ex:[{j:"完璧な駄犬だ。",r:"かんぺきなだけんだ。",e:"A perfectly worthless dog."},{j:"この駄犬め！",r:"このだけんめ！",e:"This useless mutt!"},{j:"駄犬でも飼い主には価値がある。",r:"だけんでもかいぬしにはかちがある。",e:"Even a worthless dog, the owner has value."}],
    wm:"駄 (inferior/useless, from pack-horse) + 犬 (dog) = useless mutt. Spike's contemptuous label for Ein. He adopts him anyway. His actions always betray his words." },

  { id:"e02_09", ep:2, word:"価値", reading:"かち", meaning:"value / worth / merit", tier:1,
    kb:[{k:"価",r:"か",m:"price/value",rad:["亻","賈"],rm:["person","goods/price"],mn:"A person involved in pricing goods — value, price"},{k:"値",r:"ち",m:"price/value/worth",rad:["亻","直"],rm:["person","straight/honest"],mn:"A person's honest straight worth — price, value"}],
    ex:[{j:"イヌに価値はなくても飼い主には価値がある。",r:"いぬにかちはなくてもかいぬしにはかちがある。",e:"Even if the dog has no value, the owner has value."},{j:"この情報の価値はいくらだ？",r:"このじょうほうのかちはいくらだ？",e:"What is this information worth?"},{j:"本当の価値も知らんくせに。",r:"ほんとうのかちもしらんくせに。",e:"You don't even know the real value."}],
    wm:"The key insight of EP02: the dog itself has no 価値 on the surface, but the owner does — the real 価値 is always elsewhere. The show's recurring lesson." },

  { id:"e02_10", ep:2, word:"飼い主", reading:"かいぬし", meaning:"pet owner / keeper of an animal", tier:1,
    kb:[{k:"飼",r:"か(い)",m:"raise/keep/feed (animals)",rad:["食","司"],rm:["food/eat","manage"],mn:"Managing the feeding — to raise, keep, feed an animal"},{k:"主",r:"ぬし",m:"master/owner/main",rad:["丶","王"],rm:["dot","king"],mn:"A king with a dot above — a master, owner, the main one"}],
    ex:[{j:"イヌに価値はなくても飼い主には価値がある。",r:"いぬにかちはなくてもかいぬしにはかちがある。",e:"Even if the dog has no value, the owner has value."},{j:"飼い主が犬を探している。",r:"かいぬしがいぬをさがしている。",e:"The owner is looking for his dog."},{j:"あなたが飼い主ですか？",r:"あなたがかいぬしですか？",e:"Are you the owner?"}],
    wm:"Spike figures out that finding the 飼い主 is the actual job — the dog leads to the bounty. 飼う (to keep animals) + 主 (owner) = pet keeper." },

  { id:"e02_11", ep:2, word:"首輪", reading:"くびわ", meaning:"collar (for a pet/animal)", tier:2,
    kb:[{k:"首",r:"くび",m:"neck",rad:["𠂉","自"],rm:["hair","face"],mn:"Hair above a face — the neck"},{k:"輪",r:"わ",m:"ring/wheel/circle",rad:["車","侖"],rm:["wheel","orderly/rotate"],mn:"A wheel rotating in an orderly circle — a ring, wheel, circle"}],
    ex:[{j:"首輪を付けてやろうな。",r:"くびわをつけてやろうな。",e:"I'll put a collar on you."},{j:"犬に首輪を付けた。",r:"いぬにくびわをつけた。",e:"I put a collar on the dog."},{j:"首輪に名前が書いてある。",r:"くびわになまえがかいてある。",e:"There's a name written on the collar."}],
    wm:"Spike puts a 首輪 on Ein at the end — accepting him as crew without admitting it. A ring (輪) around the neck (首). Action speaks louder than his complaints." },

  { id:"e02_12", ep:2, word:"犬笛", reading:"いぬぶえ", meaning:"dog whistle (inaudible to humans)", tier:2,
    kb:[{k:"犬",r:"いぬ",m:"dog",rad:["犬"],rm:["dog"],mn:"Pictograph of a dog"},{k:"笛",r:"ぶえ",m:"flute/whistle/pipe",rad:["竹","由"],rm:["bamboo","reason/stem"],mn:"A bamboo instrument — a flute, whistle, pipe"}],
    ex:[{j:"犬笛を使うぞ。",r:"いぬぶえをつかうぞ。",e:"I'll use the dog whistle."},{j:"人間には聞こえないんですよ。",r:"にんげんにはきこえないんですよ。",e:"Humans can't hear it."},{j:"犬笛で犬を集めた。",r:"いぬぶえでいぬをあつめた。",e:"I gathered the dogs with a dog whistle."}],
    wm:"The joke: Jet uses a 犬笛, declares 気のなげえ話 (what a drawn-out plan), then is baffled when he can't hear it. Ein obviously hears it and moves. Perfect comedy beat." },

  { id:"e02_13", ep:2, word:"寿命", reading:"じゅみょう", meaning:"lifespan / life expectancy / how long something lasts", tier:2,
    kb:[{k:"寿",r:"じゅ",m:"longevity/long life",rad:["士","口","寸"],rm:["samurai","mouth","inch"],mn:"A samurai measuring out long life with mouth and hand — longevity"},{k:"命",r:"みょう",m:"life/fate/command",rad:["亼","叩"],rm:["gather","kneel"],mn:"Fate gathered while kneeling — life, fate"}],
    ex:[{j:"寿命だ。",r:"じゅみょうだ。",e:"It's reached the end of its life."},{j:"この機械はもう寿命だ。",r:"このきかいはもうじゅみょうだ。",e:"This machine has already reached the end of its life."},{j:"人間の寿命は80年くらいだ。",r:"にんげんのじゅみょうはやくじゅうはちじゅうねんくらいだ。",e:"The human lifespan is about 80 years."}],
    wm:"The information broker looks at his equipment and says 寿命だ — it's dying. Underworld dealers always have old gear. 寿命 applies to people, machines, relationships." },

  { id:"e02_14", ep:2, word:"情報", reading:"じょうほう", meaning:"information / intelligence / data", tier:1,
    kb:[{k:"情",r:"じょう",m:"feeling/emotion/situation/info",rad:["忄","青"],rm:["heart","blue/clear"],mn:"A clear heart — feelings, the state of things, information"},{k:"報",r:"ほう",m:"report/reward/repay",rad:["幸","阝"],rm:["fortune/lucky","city/town"],mn:"Fortune reported to the town — to report, inform, repay"}],
    ex:[{j:"情報か。ネタはアブドゥル・ハキム。",r:"じょうほうか。ネタはアブドゥル・ハキム。",e:"Information? The lead is Abdul Hakim."},{j:"情報が欲しいんなら出すもん出しな。",r:"じょうほうがほしいんならだすもんだしな。",e:"If you want information, pay up."},{j:"その情報は料金内だな。",r:"そのじょうほうはりょうきんないだな。",e:"That information is included in the fee."}],
    wm:"情報 = the currency of the underworld. 情報が欲しいなら出すもん出しな = pay for what you want. All the Bebop's intelligence work runs on purchasing 情報." },

  { id:"e02_15", ep:2, word:"手がかり", reading:"てがかり", meaning:"clue / lead / something to go on", tier:1,
    kb:[{k:"手",r:"て",m:"hand",rad:["手"],rm:["hand"],mn:"Pictograph of a hand"},{k:"掛",r:"か(かり)",m:"hang/apply/depend on",rad:["扌","卦"],rm:["hand","trigram/apply"],mn:"A hand applying or hanging something — to engage, apply, depend on"}],
    ex:[{j:"手がかりもないのか。",r:"てがかりもないのか。",e:"Don't you even have a clue?"},{j:"手がかりを見つけた。",r:"てがかりをみつけた。",e:"I found a clue."},{j:"その手がかりを追う。",r:"そのてがかりをおう。",e:"I'll follow that lead."}],
    wm:"手 (hand) + 掛かり (something to hang on) = a hand-hold = a lead or clue. The broker has 手がかりもない about where Hakim is. No handholds = no progress." },

  { id:"e02_16", ep:2, word:"ネタ", reading:"ネタ", meaning:"lead / tip / intel (slang for information)", tier:2,
    kb:[],
    ex:[{j:"ネタはアブドゥル・ハキム、いただき。",r:"ネタはアブドゥル・ハキム、いただき。",e:"The lead is Abdul Hakim — got it."},{j:"いいネタがある。",r:"いいネタがある。",e:"I've got a good tip."},{j:"そのネタはガセじゃないか。",r:"そのネタはガセじゃないか。",e:"Isn't that tip fake?"}],
    wm:"ネタ = slang for information/material/lead. From 種 (たね, seed/material) reversed. Used in journalism, comedy, and crime alike. The broker sells 情報 by the ネタ." },

  { id:"e02_17", ep:2, word:"逃走", reading:"とうそう", meaning:"escape / fleeing / running away (especially from crime/police)", tier:1,
    kb:[{k:"逃",r:"とう",m:"flee/escape",rad:["⻌","兆"],rm:["movement","omen/sign"],mn:"Moving at the first sign of danger — to flee"},{k:"走",r:"そう",m:"run",rad:["走"],rm:["running person"],mn:"A person running with hair flying — to run"}],
    ex:[{j:"実験動物を奪って逃走中なんだ。",r:"じっけんどうぶつをうばってとうそうちゅうなんだ。",e:"He's on the run after stealing the laboratory animal."},{j:"逃走を続けている。",r:"とうそうをつづけている。",e:"He continues to flee."},{j:"逃走を阻止しろ。",r:"とうそうをそしろ。",e:"Stop the escape."}],
    wm:"逃げる (verb: to flee) → 逃走 (noun: an escape/flight). 逃走中 = currently fleeing. The formal/news register version. 逃走犯 = fugitive." },

  { id:"e02_18", ep:2, word:"踏み倒す", reading:"ふみたおす", meaning:"to run out on a debt / to skip out / to default on payment", tier:3,
    kb:[{k:"踏",r:"ふみ",m:"step/tread/trample",rad:["足","𭡄"],rm:["foot","trampled"],mn:"A foot trampling — to step, tread"},{k:"倒す",r:"たおす",m:"knock down/overthrow",rad:["亻","到"],rm:["person","arrive/reach"],mn:"A person knocked to arrive at the ground — to knock down, overthrow"}],
    ex:[{j:"あいつ踏み倒していきやがった。",r:"あいつふみたおしていきやがった。",e:"That bastard ran out on his debt and left."},{j:"飲み代を踏み倒した。",r:"のみだいをふみたおした。",e:"He skipped out on the bar tab."},{j:"借金を踏み倒すのは犯罪だ。",r:"しゃっきんをふみたおすのははんざいだ。",e:"Running out on a debt is a crime."}],
    wm:"Hakim skipped out on the broker without paying — 踏み倒していきやがった. 踏み (trampling) + 倒す (knocking down) = trampling the debt into the ground. Vivid imagery." },

  { id:"e02_19", ep:2, word:"骨董品", reading:"こっとうひん", meaning:"antique / vintage item / relic", tier:2,
    kb:[{k:"骨",r:"こっ",m:"bone/frame/essential",rad:["骨"],rm:["bone"],mn:"Pictograph of a bone — bone, framework, essential"},{k:"董",r:"とう",m:"supervise/manage/old goods",rad:["艹","重"],rm:["plant","heavy/important"],mn:"Heavy important plants — old, supervising"},{k:"品",r:"ひん",m:"goods/quality/item",rad:["品"],rm:["three mouths/many goods"],mn:"Many goods for mouths — goods, quality, items"}],
    ex:[{j:"そいつは骨董品だな。",r:"そいつはこっとうひんだな。",e:"That's an antique."},{j:"30年代のレアもんだよ、そりゃあ骨董品だ。",r:"30ねんだいのレアもんだよ、そりゃあこっとうひんだ。",e:"It's a rare item from the 30s — that's a genuine antique."},{j:"骨董品の価値は分からない。",r:"こっとうひんのかちはわからない。",e:"I don't understand the value of antiques."}],
    wm:"The pet shop owner recognizes Ein's leash as a 骨董品 from the 30s — suddenly its value changes entirely. What looks old and worthless may be priceless." },

  { id:"e02_20", ep:2, word:"命懸け", reading:"いのちがけ", meaning:"risking one's life / life-or-death", tier:2,
    kb:[{k:"命",r:"いのち",m:"life/fate",rad:["亼","叩"],rm:["gather","kneel"],mn:"Fate gathered while kneeling — life, fate"},{k:"懸",r:"が(け)",m:"hang/stake/be at risk",rad:["縣","心"],rm:["hang/suspend","heart"],mn:"A heart hanging in suspension — to stake, be at risk"}],
    ex:[{j:"たかが200ウーロンのイヌのために命懸けか。",r:"たかが200ウーロンのいぬのためにいのちがけか。",e:"Risking your life for a mere 200-woolong dog?"},{j:"命懸けで戦った。",r:"いのちがけでたたかった。",e:"I fought with my life on the line."},{j:"命懸けの仕事だ。",r:"いのちがけのしごとだ。",e:"It's life-or-death work."}],
    wm:"Hakim mocks Spike's pursuit: 命懸けか — risking your life for 200 woolongs? He doesn't know the dog's real value. The contempt is completely misplaced." },

  // ── CORE VERBS ──────────────────────────────────────────────────────

  { id:"e02_21", ep:2, word:"奪う", reading:"うばう", meaning:"to snatch / to steal / to seize by force", tier:1,
    kb:[{k:"奪",r:"うば(う)",m:"snatch/seize/rob",rad:["隹","寸"],rm:["bird","measure/hand"],mn:"A bird seized by a measuring hand — to snatch, seize, rob"}],
    ex:[{j:"実験動物を奪って逃走中だ。",r:"じっけんどうぶつをうばってとうそうちゅうだ。",e:"He's on the run after snatching a laboratory animal."},{j:"財布を奪われた。",r:"さいふをうばわれた。",e:"My wallet was stolen (snatched from me)."},{j:"チャンスを奪う。",r:"チャンスをうばう。",e:"To steal someone's chance."}],
    wm:"奪う is more forceful than 盗む (steal quietly) — it implies snatching by force. Hakim 奪った (seized) from a research facility, not just stole." },

  { id:"e02_22", ep:2, word:"踏み込む", reading:"ふみこむ", meaning:"to step into / to barge in / to venture into", tier:2,
    kb:[{k:"踏",r:"ふみ",m:"step/tread",rad:["足","𭡄"],rm:["foot","trampled"],mn:"A foot trampling — to step, tread"},{k:"込む",r:"こむ",m:"go into/crowd into",rad:["⻌","入"],rm:["movement","enter"],mn:"Moving into a place — to crowd in, go into"}],
    ex:[{j:"ラボに踏み込んできた。",r:"らぼにふみこんできた。",e:"He came barging into the lab."},{j:"危険地帯に踏み込む。",r:"きけんちたいにふみこむ。",e:"To venture into a dangerous area."},{j:"プライベートに踏み込むな。",r:"プライベートにふみこむな。",e:"Don't barge into (someone's) private life."}],
    wm:"踏み (step/tread) + 込む (go into) = step forcefully into. Hakim 踏み込んだ into the lab to steal Ein. More assertive than just entering." },

  { id:"e02_23", ep:2, word:"始末する", reading:"しまつする", meaning:"to dispose of / to deal with / to finish off", tier:2,
    kb:[{k:"始",r:"し",m:"begin/start",rad:["女","台"],rm:["woman","platform/start"],mn:"A woman on a platform — to begin, start"},{k:"末",r:"まつ",m:"end/tip/minor",rad:["木","一"],rm:["tree","one line at top"],mn:"A line at the top of a tree — the tip, the end"}],
    ex:[{j:"それが嫌なら自分で始末すんのね。",r:"それがいやならじぶんでしまつすんのね。",e:"If you don't like it, deal with it yourself."},{j:"このトラブルを始末しろ。",r:"このトラブルをしまつしろ。",e:"Deal with this trouble."},{j:"後始末が大変だ。",r:"あとしまつがたいへんだ。",e:"The cleanup afterwards is tough."}],
    wm:"The pet shop owner coldly tells Hakim to 始末 the dog if he doesn't like the price. 始末する = deal with from beginning (始) to end (末). Often implies disposing of something inconvenient." },

  { id:"e02_24", ep:2, word:"泣かせる", reading:"なかせる", meaning:"to be touching / to make one cry / pathetically moving", tier:3,
    kb:[{k:"泣",r:"な(か)",m:"cry/weep",rad:["氵","立"],rm:["water","stand"],mn:"Water standing up — tears, to cry"},{k:"せる",r:"せる",m:"causative — make/let",rad:[""],rm:[""],mn:"Causative suffix: make someone do something"}],
    ex:[{j:"泣かせる話じゃないか。",r:"なかせるはなしじゃないか。",e:"Isn't that a touching/pathetic story?"},{j:"泣かせる映画だ。",r:"なかせるえいがだ。",e:"It's a movie that makes you cry."},{j:"泣かせるなよ。",r:"なかせるなよ。",e:"Don't make me cry (don't be so moving/pathetic)."}],
    wm:"Hakim mocks Spike: 泣かせる話じゃないか (isn't that a touching/pathetic story?) about risking life for a cheap dog. 泣かせる = makes-cry = either touching or pathetically tragic depending on tone." },

  { id:"e02_25", ep:2, word:"放り出す", reading:"ほうりだす", meaning:"to throw out / to dump / to abandon", tier:2,
    kb:[{k:"放",r:"ほう(り)",m:"release/let go/throw",rad:["方","攵"],rm:["direction","strike/follow"],mn:"Striking something in a direction — to release, throw, let go"},{k:"出す",r:"だす",m:"put out/take out/throw out",rad:["凵","止"],rm:["container","stop/foot"],mn:"Taking something out of a container — to put out, take out"}],
    ex:[{j:"こんな駄犬放り出しちまおうって言ったんだ。",r:"こんなだけんほうりだしちまおうっていったんだ。",e:"I said let's just throw out this useless dog."},{j:"仕事を放り出した。",r:"しごとをほうりだした。",e:"He abandoned his work."},{j:"子どもを放り出すな。",r:"こどもをほうりだすな。",e:"Don't abandon children."}],
    wm:"Spike says 放り出しちまおう about Ein. 放り (throwing) + 出す (out) = throw out completely. He's always threatening to abandon Ein; he never does." },

  { id:"e02_26", ep:2, word:"つぶれる", reading:"つぶれる", meaning:"to be crushed / to collapse / to go bust", tier:2,
    kb:[{k:"潰",r:"つぶ(れる)",m:"crush/smash/collapse",rad:["氵","貴"],rm:["water","precious/value"],mn:"Water crushing what was precious — to crush, collapse"}],
    ex:[{j:"こいつがつぶれたら終わりなんだ。",r:"こいつがつぶれたらおわりなんだ。",e:"If this thing gets crushed, it's all over."},{j:"会社がつぶれた。",r:"かいしゃがつぶれた。",e:"The company went bust."},{j:"目がつぶれる。",r:"めがつぶれる。",e:"My eyes are getting crushed / going blind."}],
    wm:"Jet worries about the cargo being damaged during the chase — こいつがつぶれたら終わり. In EP02 context = crushing Ein = losing the bounty. Also used for businesses collapsing." },

  // ── ADJECTIVES & EXPRESSIONS ────────────────────────────────────────

  { id:"e02_27", ep:2, word:"珍しい", reading:"めずらしい", meaning:"rare / unusual / uncommon", tier:1,
    kb:[{k:"珍",r:"めずら(しい)",m:"rare/unusual/strange",rad:["王","彡"],rm:["king/gem","hair/lines"],mn:"A gem with flowing lines — rare, unusual, precious"}],
    ex:[{j:"珍しい種類じゃないわね。",r:"めずらしいしゅるいじゃないわね。",e:"It's not a rare breed."},{j:"珍しい鳥を見た。",r:"めずらしいとりをみた。",e:"I saw a rare bird."},{j:"珍しいことがあった。",r:"めずらしいことがあった。",e:"Something unusual happened."}],
    wm:"The pet shop owner dismisses Ein: 珍しい種類じゃないわね (not a rare breed). She's completely wrong about his value. The surface never matches the reality." },

  { id:"e02_28", ep:2, word:"気の長い", reading:"きのながい", meaning:"patient / long-suffering / drawn-out (requiring patience)", tier:2,
    kb:[{k:"気",r:"き",m:"spirit/energy",rad:["气","米"],rm:["air/energy","rice"],mn:"Energy/rice rising as steam — vital spirit, energy"},{k:"長",r:"なが(い)",m:"long",rad:["长"],rm:["long hair/elder"],mn:"A person with long flowing hair — long"}],
    ex:[{j:"気のなげえ話だよな、たく。",r:"きのながえはなしだよな、たく。",e:"What a drawn-out plan, honestly."},{j:"気の長い仕事だ。",r:"きのながいしごとだ。",e:"It's work that requires patience."},{j:"気の長い人だ。",r:"きのながいひとだ。",e:"He's a patient person."}],
    wm:"Jet says 気のなげえ話 about using a dog whistle to find Ein. Sometimes the only option requires patience. 気が長い = spirit is long = patient/drawn-out." },

  { id:"e02_29", ep:2, word:"妙に", reading:"みょうに", meaning:"strangely / oddly / suspiciously", tier:2,
    kb:[{k:"妙",r:"みょう",m:"strange/wonderful/subtle",rad:["女","少"],rm:["woman","few/small"],mn:"A woman with few/small features — strange, subtle, wonderful"}],
    ex:[{j:"妙に目立つスーツケースを持ってたな。",r:"みょうにめだつスーツケースをもってたな。",e:"He was carrying a strangely conspicuous suitcase."},{j:"妙な感じがする。",r:"みょうなかんじがする。",e:"I have a strange feeling."},{j:"妙に静かだ。",r:"みょうにしずかだ。",e:"It's oddly quiet."}],
    wm:"The observation that cracks the case: 妙に目立つスーツケース. 妙に = oddly/suspiciously. The suitcase that should be hiding something is instead advertising it." },

  { id:"e02_30", ep:2, word:"熱くなる", reading:"あつくなる", meaning:"to get heated / to get worked up / to lose one's cool", tier:2,
    kb:[{k:"熱",r:"あつ(く)",m:"hot/passionate/fever",rad:["火","熱"],rm:["fire","heat"],mn:"Fire creating heat — hot, passion, fever"},{k:"なる",r:"なる",m:"become",rad:[""],rm:[""],mn:"To become, turn into"}],
    ex:[{j:"俺のどこが熱くなってるよ。",r:"おれのどこがあつくなってるよ。",e:"What part of me is getting worked up?"},{j:"熱くなるな、冷静に。",r:"あつくなるな、れいせいに。",e:"Don't get heated — stay calm."},{j:"試合になると熱くなる。",r:"しあいになるとあつくなる。",e:"He gets worked up when it's a match."}],
    wm:"Jet accuses Spike of being 熱くなってる about the chase. Spike denies it. His refusal to admit feelings is his whole character. 熱くなる = getting fired up/emotional." },

  { id:"e02_31", ep:2, word:"上等", reading:"じょうとう", meaning:"bring it on / fine by me / that's excellent", tier:2,
    kb:[{k:"上",r:"じょう",m:"upper/top",rad:["一","丨"],rm:["horizon","rising"],mn:"A line rising above the horizon — upper, top"},{k:"等",r:"とう",m:"grade/equal/class",rad:["竹","寺"],rm:["bamboo","temple/wait"],mn:"Bamboo measured equally at a temple — grade, class, equal"}],
    ex:[{j:"上等だ。逃げられるもんなら逃げてみろ。",r:"じょうとうだ。にげられるもんならにげてみろ。",e:"Bring it on. Try to run if you can."},{j:"上等じゃないか。やってやる。",r:"じょうとうじゃないか。やってやる。",e:"That's fine by me. Let's do it."},{j:"上等な品物だ。",r:"じょうとうなしなものだ。",e:"It's a top-grade item."}],
    wm:"Spike says 上等だ before the final chase — 'bring it on / fine by me'. Originally means 'top grade/class', used colloquially as acceptance of a challenge. Classic tough-guy phrase." },

  { id:"e02_32", ep:2, word:"胸くそ悪い", reading:"むなくそわるい", meaning:"disgusting / makes one's stomach turn / repulsive", tier:3,
    kb:[{k:"胸",r:"むな",m:"chest/breast/heart",rad:["月","匈"],rm:["body/flesh","chest"],mn:"The flesh of the chest — chest, breast, heart"},{k:"くそ",r:"くそ",m:"crap/crap- (intensifier)",rad:[""],rm:[""],mn:"Excrement — very rough intensifier"},{k:"悪",r:"わる(い)",m:"bad",rad:["亜","心"],rm:["ugly","heart"],mn:"An ugly heart — bad, wrong"}],
    ex:[{j:"くっそお、胸くそ悪い。",r:"くっそお、むなくそわるい。",e:"Damn it, this makes my stomach turn."},{j:"あいつの態度は胸くそ悪い。",r:"あいつのたいどはむなくそわるい。",e:"His attitude is disgusting."},{j:"胸くそ悪い話だ。",r:"むなくそわるいはなしだ。",e:"It's a stomach-turning story."}],
    wm:"Spike's reaction to losing Ein temporarily — 胸くそ悪い. Literally: 'chest-crap-bad'. The compound くそ as intensifier makes this rough and visceral. Very colloquial." },

  { id:"e02_33", ep:2, word:"落ち着かない", reading:"おちつかない", meaning:"restless / unsettled / can't calm down / fidgety", tier:2,
    kb:[{k:"落",r:"お(ち)",m:"fall/drop/settle",rad:["艹","水","夂"],rm:["plant","water","follow downward"],mn:"Water following downward — to fall, drop, settle"},{k:"着く",r:"つ(く)",m:"arrive/settle/attach",rad:["羊","目"],rm:["sheep","eye"],mn:"A sheep arriving at sight — to arrive, settle, attach"}],
    ex:[{j:"落ち着かないやつだ。",r:"おちつかないやつだ。",e:"He's a restless guy."},{j:"落ち着け。",r:"おちつけ。",e:"Calm down."},{j:"ころころ顔を変えるから落ち着かない。",r:"ころころかおをかえるからおちつかない。",e:"He keeps changing his face, so he's unsettled."}],
    wm:"Jet says 落ち着かないやつ about Hakim who keeps changing his face through 整形. 落ち着く = fall + settle = to calm down. 落ち着かない = cannot settle = restless." },

  // ── GRAMMAR POINTS ──────────────────────────────────────────────────

  { id:"e02_34", ep:2, word:"〜てくれ", reading:"〜てくれ", meaning:"do ~ for me / please do ~ (rough request)", tier:1,
    kb:[],
    ex:[{j:"頑張ってゲットしてくれたまえ。",r:"がんばってゲットしてくれたまえ。",e:"Do your best to get him."},{j:"早く来てくれ。",r:"はやくきてくれ。",e:"Come quickly (for me)."},{j:"黙ってくれないか。",r:"だまってくれないか。",e:"Would you please be quiet?"}],
    wm:"〜てくれ = do ~ for me. The speaker receives the benefit. Compare 〜てあげる (you do for others). 〜てくれ is rough/direct; 〜てください is polite. Essential request pattern." },

  { id:"e02_35", ep:2, word:"〜にしちゃ", reading:"〜にしちゃ", meaning:"for ~ / considering ~ (colloquial version of 〜にしては)", tier:2,
    kb:[],
    ex:[{j:"200ウーロンにしちゃ大事に扱ってたな。",r:"200ウーロンにしちゃたいせつにあつかってたな。",e:"For 200 woolongs, he was handling it with great care."},{j:"子どもにしちゃ上手だ。",r:"こどもにしちゃじょうずだ。",e:"For a kid, he's pretty good."},{j:"値段にしちゃいいものだ。",r:"ねだんにしちゃいいものだ。",e:"For the price, it's good quality."}],
    wm:"〜にしちゃ = 〜にしては contracted (casual speech). Creates contrast between category and quality: 値段にしちゃいい = 'good for its price category'. Common in colloquial speech." },

  { id:"e02_36", ep:2, word:"〜やがる", reading:"〜やがる", meaning:"(offensive auxiliary) doing ~ (used to express contempt for subject's action)", tier:3,
    kb:[],
    ex:[{j:"あいつ踏み倒していきやがった。",r:"あいつふみたおしていきやがった。",e:"That bastard went and skipped out on his debt."},{j:"逃げやがった！",r:"にげやがった！",e:"The bastard ran away!"},{j:"また遅刻しやがった。",r:"またちこくしやがった。",e:"He went and was late again (contemptible)."}],
    wm:"〜やがる = extremely rough/contemptuous auxiliary. Indicates the speaker has contempt for the subject doing the action. 逃げた vs 逃げやがった = fled vs the bastard fled. Only used in anger." },

  { id:"e02_37", ep:2, word:"〜くせに", reading:"〜くせに", meaning:"even though ~ / despite ~ (with contempt or reproach)", tier:2,
    kb:[],
    ex:[{j:"本当の価値も知らんくせに。",r:"ほんとうのかちもしらんくせに。",e:"And you don't even know the real value."},{j:"何も知らないくせに偉そうだ。",r:"なにもしらないくせにえらそうだ。",e:"Acting high and mighty despite knowing nothing."},{j:"失敗したくせに謝らない。",r:"しっぱいしたくせにあやまらない。",e:"Despite having failed, he won't apologize."}],
    wm:"〜くせに = despite (with reproach). Implies the subject should know better or behave differently given their situation. 知らんくせに = knowing nothing yet acting as if..." },

  { id:"e02_38", ep:2, word:"〜もんか", reading:"〜もんか", meaning:"as if ~ / no way ~ / there's no chance that ~ (strong denial)", tier:3,
    kb:[],
    ex:[{j:"こんな200ウーロンの犬に命懸けするもんか。",r:"こんな200ウーロンのいぬにいのちがけするもんか。",e:"As if I'd risk my life for a 200-woolong dog."},{j:"負けるもんか。",r:"まけるもんか。",e:"No way I'm losing."},{j:"諦めるもんか。",r:"あきらめるもんか。",e:"As if I'd give up."}],
    wm:"〜もんか = extremely strong denial of a suggestion. 〜ものか (formal) → 〜もんか (rough). Used to express that something is unthinkable. Spike would say this about many things." },

  // ── ADDITIONAL DIALOGUE VOCAB ──────────────────────────────────────

  { id:"e02_39", ep:2, word:"条件", reading:"じょうけん", meaning:"condition / terms / requirement", tier:1,
    kb:[{k:"条",r:"じょう",m:"article/clause/line",rad:["木","攵"],rm:["tree","strike/follow"],mn:"Lines struck in a tree — articles, clauses, conditions"},{k:"件",r:"けん",m:"matter/case/item",rad:["亻","牛"],rm:["person","cow"],mn:"A person's matter — a case, item, affair"}],
    ex:[{j:"条件はいつものように賞金首を生きたまま連れてくることだ。",r:"じょうけんはいつものようにしょうきんくびをいきたままつれてくることだ。",e:"The condition as always is to bring the bounty target back alive."},{j:"その条件なら引き受ける。",r:"そのじょうけんならひきうける。",e:"If those are the conditions, I'll take it."},{j:"条件を守ってください。",r:"じょうけんをまもってください。",e:"Please follow the conditions."}],
    wm:"Big Shot states 条件 every episode. The always-present 条件: 生きたまま. This transforms bounty hunting from combat into capture, making every mission harder." },

  { id:"e02_40", ep:2, word:"行方不明", reading:"ゆくえふめい", meaning:"whereabouts unknown / missing / gone without a trace", tier:1,
    kb:[{k:"行",r:"ゆく",m:"go/direction",rad:["行"],rm:["crossroads"],mn:"A crossroads — to go, direction"},{k:"方",r:"え",m:"direction/way",rad:["方"],rm:["direction"],mn:"A person pointing — direction, way"},{k:"不",r:"ふ",m:"not/un-",rad:["不"],rm:["not"],mn:"A bird that won't land — not, un-"},{k:"明",r:"めい",m:"clear/bright/known",rad:["日","月"],rm:["sun","moon"],mn:"Sun and moon together — bright, clear, known"}],
    ex:[{j:"行方不明のままなんだって。",r:"ゆくえふめいのままなんだって。",e:"They say it's still missing / whereabouts unknown."},{j:"彼は行方不明になった。",r:"かれはゆくえふめいになった。",e:"He went missing."},{j:"行方不明者を捜索している。",r:"ゆくえふめいしゃをそうさくしている。",e:"They're searching for the missing person."}],
    wm:"Big Shot says Ein is still 行方不明 at episode's end. 行く (going) + 方 (direction) + 不 (not) + 明 (known) = direction of travel not known = missing." },

  { id:"e02_41", ep:2, word:"ダニ", reading:"ダニ", meaning:"tick / mite (parasite)", tier:2,
    kb:[],
    ex:[{j:"とにかくダニを何とかしないとな。",r:"とにかくダニをなんとかしないとな。",e:"Anyway, we have to do something about the ticks."},{j:"犬にダニがついた。",r:"いぬにダニがついた。",e:"The dog got ticks."},{j:"ダニを取り除いた。",r:"ダニをとりのぞいた。",e:"I removed the ticks."}],
    wm:"Jet and Spike's domestic problem with Ein immediately after acquiring him — ダニ. The transition from dangerous chase to pest-control mundanity is pure Bebop comedy." },

  { id:"e02_42", ep:2, word:"引き取る", reading:"ひきとる", meaning:"to take in / to collect / to take charge of / to take back", tier:2,
    kb:[{k:"引",r:"ひき",m:"pull/draw",rad:["弓","丨"],rm:["bow","line"],mn:"A bow being drawn — to pull, draw"},{k:"取る",r:"とる",m:"take",rad:["又","耳"],rm:["hand","ear"],mn:"A hand grabbing an ear — to take, grab"}],
    ex:[{j:"そいつらにこのけだもの引き取ってもらえ。",r:"そいつらにこのけだもののひきとってもらえ。",e:"Have those guys take in this animal."},{j:"子どもを引き取った。",r:"こどもをひきとった。",e:"I took in the child."},{j:"荷物を引き取りに来た。",r:"にもつをひきとりにきた。",e:"I came to collect my luggage."}],
    wm:"Spike tells Jet to have the environmental group 引き取る Ein — take him off their hands. 引き (pull/draw) + 取る (take) = pull in and take = take in, collect, receive custody of." },

  { id:"e02_43", ep:2, word:"鎖", reading:"くさり", meaning:"chain / chain leash", tier:2,
    kb:[{k:"鎖",r:"くさり",m:"chain/lock",rad:["金","小"],rm:["metal","small"],mn:"Small metal links — a chain, lock"}],
    ex:[{j:"鎖が長いな。",r:"くさりがながいな。",e:"The chain is long."},{j:"犬を鎖につないだ。",r:"いぬをくさりにつないだ。",e:"I chained the dog up."},{j:"鎖を外してくれ。",r:"くさりをはずしてくれ。",e:"Please remove the chain."}],
    wm:"The antique chain leash catches the pet shop owner's eye — ウェイ・オブ・ザ・ドラゴンモデル from the 30s. A 鎖 (chain) that becomes a 骨董品 and a plot device." },

  { id:"e02_44", ep:2, word:"ジョーカー", reading:"ジョーカー", meaning:"joker (playing card) / trump card / wild card", tier:2,
    kb:[],
    ex:[{j:"とにかくジョーカーはこっちが持ってるんだ。",r:"とにかくジョーカーはこっちがもってるんだ。",e:"Anyway, we're the ones holding the joker (trump card)."},{j:"ジョーカーを持っている。",r:"ジョーカーをもっている。",e:"I'm holding the joker."},{j:"切り札を出した。",r:"きりふだをだした。",e:"He played his trump card."}],
    wm:"The researcher says ジョーカーはこっちが持ってる — meaning they have the leverage (Ein). In Japanese, ジョーカー can mean a trump card or wildcard advantage, not just the playing card." },

  { id:"e02_45", ep:2, word:"世話が焼ける", reading:"せわがやける", meaning:"to be a handful / troublesome / high maintenance", tier:3,
    kb:[],
    ex:[{j:"世話が焼けるったらねえぜ。ガキとけだもんは嫌いなんだよ。",r:"せわがやけるったらねえぜ。がきとけだもんはきらいなんだよ。",e:"They're such a handful, I tell you. I hate kids and animals."},{j:"あの子は世話が焼ける。",r:"あのこはせわがやける。",e:"That child is really a handful."},{j:"世話が焼ける人だな。",r:"せわがやけるひとだな。",e:"What a troublesome person."}],
    wm:"世話 (care) が焼ける (gets burned) = the care burns you out. Spike's famous complaint about Ein — and Ein, Faye, and Ed together. The Bebop crew is one extended 世話が焼ける situation." },

  { id:"e02_46", ep:2, word:"〜っつうの", reading:"〜っつうの", meaning:"I said ~ / I'm telling you ~ (emphatic repetition, rough)", tier:3,
    kb:[],
    ex:[{j:"上がるなっつうの！",r:"あがるなっつうの！",e:"I SAID don't get on there!"},{j:"やめろっつうの！",r:"やめろっつうの！",e:"I SAID stop it!"},{j:"知らないっつうの！",r:"しらないっつうの！",e:"I'm TELLING you I don't know!"}],
    wm:"〜と言っているの contracted → 〜っていうの → 〜っつうの (very rough). Same function as 〜ってんだよ from EP01 — frustrated repetition, 'I ALREADY SAID'. Very Bebop speech register." },

  { id:"e02_47", ep:2, word:"かっぱらう", reading:"かっぱらう", meaning:"to swipe / to pilfer / to grab and run", tier:3,
    kb:[],
    ex:[{j:"荷物をかっぱらっていくやつ。",r:"にもつをかっぱらっていくやつ。",e:"The type who grabs stuff and runs."},{j:"財布をかっぱらわれた。",r:"さいふをかっぱらわれた。",e:"My wallet got swiped."},{j:"船を襲って何でもかっぱらっていく。",r:"ふねをおそってなんでもかっぱらっていく。",e:"They attack ships and grab anything."}],
    wm:"More casual and vivid than 盗む (steal) or 奪う (seize). かっぱらう implies a quick opportunistic grab — pirates かっぱらう in EP19. Petty theft energy." },

  { id:"e02_48", ep:2, word:"幸せかい", reading:"しあわせかい", meaning:"are you happy? / are things good? (casual question)", tier:2,
    kb:[],
    ex:[{j:"幸せかい？ええ、とっても。",r:"しあわせかい？ええ、とっても。",e:"Are you happy? Yes, very."},{j:"幸せかい、今の生活は？",r:"しあわせかい、いまのせいかつは？",e:"Are you happy with your current life?"},{j:"幸せかどうか分からない。",r:"しあわせかどうかわからない。",e:"I don't know if I'm happy."}],
    wm:"A moment of genuine gentleness in EP02 — someone asks Ein 幸せかい and he responds. The show uses Ein as a vehicle for sincerity the human characters won't show." },

  { id:"e02_49", ep:2, word:"かい", reading:"かい", meaning:"? (casual question particle, softer than か)", tier:1,
    kb:[],
    ex:[{j:"幸せかい？",r:"しあわせかい？",e:"Are you happy?"},{j:"分かったかい？",r:"わかったかい？",e:"Did you understand?"},{j:"食べたかい？",r:"たべたかい？",e:"Did you eat?"}],
    wm:"かい = か + い, a softer/warmer question particle. Used by older men or in gentle speech. Contrasts with か (neutral) and かな (wondering to oneself). Creates warmer tone than plain か." },

  { id:"e02_50", ep:2, word:"〜ものだ", reading:"〜ものだ", meaning:"it is a fact that ~ / things are such that ~ / one should ~", tier:2,
    kb:[],
    ex:[{j:"ばあちゃんにやりかけたことは最後までやり通せって言われなかったか。",r:"ばあちゃんにやりかけたことはさいごまでやりとおせっていわれなかったか。",e:"Didn't your grandma tell you to see things through to the end?"},{j:"約束は守るものだ。",r:"やくそくはまもるものだ。",e:"One should keep promises. / Promises are meant to be kept."},{j:"人間は間違えるものだ。",r:"にんげんはまちがえるものだ。",e:"People make mistakes. / It's human nature to make mistakes."}],
    wm:"〜ものだ = expresses a general truth, social norm, or nostalgic 'how things should be'. やるものだ = one should do it. The bounty hunter quoting his grandmother: pure comedy." },

  // ── NOUNS ────────────────────────────────────────────────────────────

  { id:"e02_a01", ep:2, word:"窃盗犯", reading:"せっとうはん", meaning:"thief / person guilty of theft", tier:1,
    kb:[{k:"窃",r:"せっ",m:"steal/pilfer",rad:["穴","切"],rm:["hole","cut"],mn:"Cutting through a hole — to steal, pilfer secretly"},{k:"盗",r:"とう",m:"steal/rob",rad:["次","皿"],rm:["next/covet","dish"],mn:"Coveting the dish — to steal, rob"},{k:"犯",r:"はん",m:"crime/offend",rad:["犭","己"],rm:["animal","self"],mn:"An animal acting on self-interest — crime, offense"}],
    ex:[{j:"もともと彼は連続ペット窃盗犯なんだってよ。",r:"もともとかれはれんぞくペットせっとうはんなんだってよ。",e:"Originally he's a serial pet thief, apparently."},{j:"窃盗犯が逮捕された。",r:"せっとうはんがたいほされた。",e:"The thief was arrested."},{j:"連続窃盗犯を追っている。",r:"れんぞくせっとうはんをおっている。",e:"We're pursuing a serial thief."}],
    wm:"Big Shot's intro for Hakim — 連続ペット窃盗犯. 窃 (secret stealing through a hole) + 盗 (coveting the dish) + 犯 (criminal act) = someone who serially steals pets." },

  { id:"e02_a02", ep:2, word:"格言", reading:"かくげん", meaning:"proverb / maxim / wise saying", tier:2,
    kb:[{k:"格",r:"かく",m:"standard/status/grid",rad:["木","各"],rm:["tree","each/separate"],mn:"Each tree in its place — a standard, status, framework"},{k:"言",r:"げん",m:"word/say/speak",rad:["言"],rm:["words"],mn:"Words coming from a mouth — word, speech, saying"}],
    ex:[{j:"帰る前のひなを数えるな、って格言があるぜ。",r:"かえるまえのひなをかぞえるな、ってかくげんがあるぜ。",e:"There's a saying: don't count your chicks before they hatch."},{j:"格言を覚えている。",r:"かくげんをおぼえている。",e:"I remember the proverb."},{j:"日本の格言は深い。",r:"にほんのかくげんはふかい。",e:"Japanese proverbs run deep."}],
    wm:"Spike quotes a 格言 before the final chase — 帰る前のひなを数えるな (don't count your chickens). A 格 (standard) + 言 (saying) = a saying that sets the standard of wisdom." },

  { id:"e02_a03", ep:2, word:"ひな", reading:"ひな", meaning:"chick / baby bird / hatchling", tier:3,
    kb:[],
    ex:[{j:"帰る前のひなを数えるな。",r:"かえるまえのひなをかぞえるな。",e:"Don't count your chicks before they hatch."},{j:"ひなが卵から生まれた。",r:"ひながたまごからうまれた。",e:"A chick hatched from the egg."},{j:"ひな祭りは女の子の節句だ。",r:"ひなまつりはおんなのこのせっくだ。",e:"Hinamatsuri is a festival for girls."}],
    wm:"Baby birds (ひな) you haven't counted yet. The proverb warns against assuming a bounty is already yours — applicable to Spike chasing Hakim through three disguises." },

  { id:"e02_a04", ep:2, word:"苦労", reading:"くろう", meaning:"hardship / toil / trouble / effort", tier:1,
    kb:[{k:"苦",r:"く",m:"suffering/hardship/bitter",rad:["艹","古"],rm:["plant","old/hard"],mn:"Old hardened plants — suffering, bitterness, hardship"},{k:"労",r:"ろう",m:"labor/toil/work hard",rad:["火","力"],rm:["fire","strength/power"],mn:"Strength like fire — labor, toil, work hard"}],
    ex:[{j:"今までの苦労が台無しだ。",r:"いままでのくろうがだいなしだ。",e:"All the hardship up to now has been ruined."},{j:"苦労した甲斐があった。",r:"くろうしたかいがあった。",e:"The effort was worth it."},{j:"人生は苦労の連続だ。",r:"じんせいはくろうのれんぞくだ。",e:"Life is a series of hardships."}],
    wm:"苦 (bitter/suffering) + 労 (toil) = hardship endured through effort. 苦労が台無し = the toil is wasted/ruined. Hakim's complaint every time a disguise fails." },

  { id:"e02_a05", ep:2, word:"台無し", reading:"だいなし", meaning:"ruined / wasted / all for nothing", tier:2,
    kb:[{k:"台",r:"だい",m:"stand/platform/base",rad:["厶","口"],rm:["private","mouth"],mn:"A platform with a mouth — a base, stand, counter"},{k:"無し",r:"なし",m:"without/none",rad:["𠂉","灬"],rm:["arms spread","fire"],mn:"Without — none, without, non-existent"}],
    ex:[{j:"今までの苦労が台無しだ。",r:"いままでのくろうがだいなしだ。",e:"All the hardship up to now is ruined."},{j:"雨で台無しになった。",r:"あめでだいなしになった。",e:"It was ruined by the rain."},{j:"せっかくの計画が台無しだ。",r:"せっかくのけいかくがだいなしだ。",e:"The carefully laid plan has been ruined."}],
    wm:"台 (the platform/base something stood on) + 無し (without/gone) = the foundation is gone = ruined, wasted. Everything Hakim built collapses: 苦労が台無し." },

  { id:"e02_a06", ep:2, word:"釣り", reading:"つり", meaning:"change (money returned) / fishing", tier:2,
    kb:[{k:"釣",r:"つ(り)",m:"fish/angle/lure/change",rad:["金","勺"],rm:["metal","ladle/draw out"],mn:"Metal that draws out — a fishing hook; money drawn out as change"}],
    ex:[{j:"機体全部オーバーホールしても釣りがくるな。",r:"きたいぜんぶオーバーホールしてもつりがくるな。",e:"Even overhauling the whole ship, there'd still be change left over."},{j:"釣りはいらないよ。",r:"つりはいらないよ。",e:"Keep the change."},{j:"釣りを忘れた。",r:"つりをわすれた。",e:"I forgot my change."}],
    wm:"Jet calculates: 800万 bounty - full overhaul costs = still 釣り (change) left over. The same kanji as fishing (釣る) because both involve drawing something out — fish or leftover money." },

  { id:"e02_a07", ep:2, word:"オーバーホール", reading:"オーバーホール", meaning:"complete overhaul / full mechanical rebuild", tier:1,
    kb:[],
    ex:[{j:"機体全部オーバーホールしても釣りがくるな。",r:"きたいぜんぶオーバーホールしてもつりがくるな。",e:"Even a full ship overhaul, there'd still be change left."},{j:"エンジンをオーバーホールした。",r:"エンジンをオーバーホールした。",e:"I overhauled the engine."},{j:"オーバーホールに出した。",r:"オーバーホールにだした。",e:"I sent it in for a full overhaul."}],
    wm:"Jet's excited calculation when he sees 800万: we could オーバーホール the whole ship AND have money left. The bounty represents total mechanical salvation for the Bebop." },

  { id:"e02_a08", ep:2, word:"出世払い", reading:"しゅっせばらい", meaning:"deferred payment / pay when you make it / I'll pay you when I'm successful", tier:3,
    kb:[{k:"出世",r:"しゅっせ",m:"success in life / getting ahead",rad:["凵","止","世"],rm:["container","stop/foot","world"],mn:"Stepping out into the world — success, getting ahead in society"},{k:"払い",r:"ばらい",m:"payment/払う",rad:["扌","払"],rm:["hand","払"],mn:"A hand paying — payment"}],
    ex:[{j:"出世払いだ。",r:"しゅっせばらいだ。",e:"Pay me when you make it."},{j:"出世払いにしてください。",r:"しゅっせばらいにしてください。",e:"Please put it on deferred payment."},{j:"出世払いなんて信用できない。",r:"しゅっせばらいなんてしんようできない。",e:"Deferred payment isn't trustworthy."}],
    wm:"出世 (success in life) + 払い (payment) = I'll pay you when I've made it big. A very Japanese cultural concept: deferring debt until you succeed. Often used humorously to mean 'never'." },

  { id:"e02_a09", ep:2, word:"警察に渡る", reading:"けいさつにわたる", meaning:"to end up with the police / to fall into police hands", tier:2,
    kb:[{k:"警察",r:"けいさつ",m:"police",rad:[""],rm:[""],mn:"Police"},{k:"渡る",r:"わたる",m:"cross over / pass to / reach",rad:["氵","度"],rm:["water","degree/cross"],mn:"Water crossed — to cross over, pass to someone else, reach"}],
    ex:[{j:"あれが警察に渡ったらまずいことになる。",r:"あれがけいさつにわたったらまずいことになる。",e:"If that ends up with the police, things will get bad."},{j:"証拠が警察に渡った。",r:"しょうこがけいさつにわたった。",e:"The evidence passed to the police."},{j:"情報が警察に渡るのを防ぐ。",r:"じょうほうがけいさつにわたるのをふせぐ。",e:"To prevent the information from reaching the police."}],
    wm:"The research institution's fear — if Ein (the illegal 実験動物) 警察に渡る, their whole 非合法 research program gets exposed. Their silence is what makes Hakim's crime invisible." },

  { id:"e02_a10", ep:2, word:"明るみに出る", reading:"あかるみにでる", meaning:"to come to light / to be exposed / to become public", tier:2,
    kb:[{k:"明",r:"あか(るみ)",m:"bright/clear",rad:["日","月"],rm:["sun","moon"],mn:"Sun and moon together — bright, clear, illuminated"},{k:"出る",r:"でる",m:"come out/emerge",rad:["凵","止"],rm:["container","foot"],mn:"A foot stepping out of a container — to come out, emerge"}],
    ex:[{j:"われわれの研究が明るみに出たら大変だ。",r:"われわれのけんきゅうがあかるみにでたらたいへんだ。",e:"If our research comes to light, it'll be a disaster."},{j:"不正が明るみに出た。",r:"ふせいがあかるみにでた。",e:"The corruption came to light."},{j:"真実が明るみに出るのは時間の問題だ。",r:"しんじつがあかるみにでるのはじかんのもんだいだ。",e:"It's only a matter of time before the truth comes to light."}],
    wm:"明るみ (bright/illuminated place) + 出る (come out) = step into the light = be exposed. The research institution fears their 非合法 work 明るみに出る. Their fear = plot logic." },

  { id:"e02_a11", ep:2, word:"背に腹は代えられない", reading:"せにはらはかえられない", meaning:"needs must / desperate times call for desperate measures (lit. can't swap your back for your belly)", tier:3,
    kb:[],
    ex:[{j:"背に腹は代えられん。",r:"せにはらはかえられん。",e:"Needs must — desperate times call for desperate measures."},{j:"背に腹は代えられないので、借金した。",r:"せにはらはかえられないので、しゃっきんした。",e:"Needs must, so I took out a loan."},{j:"背に腹は代えられない時もある。",r:"せにはらはかえられないときもある。",e:"There are times when needs must."}],
    wm:"Your back (背) and belly (腹) are both you — you can't swap them. Meaning: you can't substitute one vital thing for another. Used when forced into an unpleasant necessity." },

  { id:"e02_a12", ep:2, word:"諸行無常", reading:"しょぎょうむじょう", meaning:"impermanence of all things / nothing lasts forever (Buddhist concept)", tier:3,
    kb:[{k:"諸",r:"しょ",m:"various/all",rad:["言","者"],rm:["words","person/thing"],mn:"Words about all people/things — various, all"},{k:"行",r:"ぎょう",m:"act/practice/go",rad:["行"],rm:["crossroads"],mn:"A crossroads — to go, act, practice"},{k:"無",r:"む",m:"nothing/without",rad:["𠂉","灬"],rm:["arms spread","fire"],mn:"A person dancing over fire — nothingness, without"},{k:"常",r:"じょう",m:"constant/always/normal",rad:["巾","尚"],rm:["cloth","esteem"],mn:"A cloth always held high — constant, always, normal"}],
    ex:[{j:"諸行無常がこの世のおきてだ。",r:"しょぎょうむじょうがこのよのおきてだ。",e:"The impermanence of all things is the law of this world."},{j:"諸行無常、盛者必衰。",r:"しょぎょうむじょう、じょうしゃひっすい。",e:"All things are impermanent; the mighty must fall."},{j:"諸行無常を感じる。",r:"しょぎょうむじょうをかんじる。",e:"I feel the impermanence of everything."}],
    wm:"Core Buddhist teaching: all things (諸行) are without permanence (無常). The information broker uses this to justify everything being temporary — his equipment, intel, and life." },

  { id:"e02_a13", ep:2, word:"盛者必衰", reading:"じょうしゃひっすい", meaning:"the mighty must fall / all who rise must fall (Buddhist proverb)", tier:3,
    kb:[{k:"盛",r:"じょう",m:"prosperous/peak/flourishing",rad:["皿","成"],rm:["dish","succeed"],mn:"A dish of success — prosperous, at its peak"},{k:"者",r:"しゃ",m:"person/one who",rad:["耂","日"],rm:["old/elder","sun"],mn:"An elder under the sun — a person, one who"},{k:"必",r:"ひっ",m:"certain/inevitable/must",rad:["心","丿"],rm:["heart","sweep"],mn:"A heart swept through — certain, inevitable"},{k:"衰",r:"すい",m:"decline/wither/decay",rad:["衣","口"],rm:["clothing","mouth"],mn:"Clothing over a shrinking mouth — to decline, wither"}],
    ex:[{j:"盛者必衰の鐘が鳴る。",r:"じょうしゃひっすいのかねがなる。",e:"The bell of inevitable decline rings."},{j:"盛者必衰、誰でも落ちる時が来る。",r:"じょうしゃひっすい、だれでもおちるときがくる。",e:"The mighty must fall — everyone's time to drop comes."},{j:"諸行無常、盛者必衰。",r:"しょぎょうむじょう、じょうしゃひっすい。",e:"All is impermanent; the mighty must fall."}],
    wm:"From the opening of Heike Monogatari — the prosperous must inevitably decline. The broker's philosophy: Hakim's run will end, the Bebop's luck will run out, everything 衰える." },

  // ── VERBS ────────────────────────────────────────────────────────────

  { id:"e02_a14", ep:2, word:"盗む", reading:"ぬすむ", meaning:"to steal / to pilfer / to take secretly", tier:1,
    kb:[{k:"盗",r:"ぬす(む)",m:"steal/rob",rad:["次","皿"],rm:["next/covet","dish"],mn:"Coveting the dish — to steal, rob"}],
    ex:[{j:"彼が盗んだのはデータ犬だった。",r:"かれがぬすんだのはデータけんだった。",e:"What he stole was a data dog."},{j:"財布を盗まれた。",r:"さいふをぬすまれた。",e:"My wallet was stolen."},{j:"アイデアを盗むな。",r:"アイデアをぬすむな。",e:"Don't steal ideas."}],
    wm:"盗む vs 奪う: 盗む = steal quietly/secretly. 奪う = seize by force. Hakim 盗んだ (quietly stole) Ein; he didn't 奪った (violently seize). The method matters." },

  { id:"e02_a15", ep:2, word:"ぶら下がる", reading:"ぶらさがる", meaning:"to hang from / to dangle from", tier:2,
    kb:[{k:"下",r:"さが(る)",m:"hang down/lower",rad:["一","丨"],rm:["horizon","descending"],mn:"A line descending below the horizon — to hang down, lower"}],
    ex:[{j:"あんたの首にぶら下がってる800万ウーロンさ。",r:"あんたのくびにぶらさがってる800まんウーロンさ。",e:"It's the 8 million woolongs dangling from your neck."},{j:"木にぶら下がる。",r:"きにぶらさがる。",e:"To hang from a tree."},{j:"手すりにぶら下がった。",r:"てすりにぶらさがった。",e:"I dangled from the handrail."}],
    wm:"The information broker's poetic way of saying Hakim has a bounty — 首にぶら下がってる800万 (8 million dangling from your neck). ぶら下がる = dangle/hang = the bounty literally hanging over him." },

  { id:"e02_a16", ep:2, word:"ころころ変える", reading:"ころころかえる", meaning:"to keep changing / to change repeatedly / to be constantly shifting", tier:2,
    kb:[],
    ex:[{j:"たく、ころころ顔変えやがって。",r:"たく、ころころかおかえやがって。",e:"Damn, keeps changing his face over and over."},{j:"意見をころころ変える人だ。",r:"いけんをころころかえるひとだ。",e:"He's a person who keeps changing his opinion."},{j:"ころころ変わる天気。",r:"ころころかわるてんき。",e:"Constantly changing weather."}],
    wm:"ころころ is an onomatopoeia for small round things rolling — coins, marbles. ころころ変える = changing as freely as rolling things. Jet's frustration at Hakim's endless 整形." },

  { id:"e02_a17", ep:2, word:"つぎ込む", reading:"つぎこむ", meaning:"to pour into / to invest heavily / to sink money into", tier:2,
    kb:[{k:"注",r:"つ(ぎ)",m:"pour/invest",rad:["氵","主"],rm:["water","main/master"],mn:"Mastering the flow of water — to pour, invest"},{k:"込む",r:"こむ",m:"go into/crowd into",rad:["⻌","入"],rm:["movement","enter"],mn:"Moving into a place — to crowd in, go into"}],
    ex:[{j:"いくらつぎ込んでると思ってるんだ。",r:"いくらつぎこんでるとおもってるんだ。",e:"Do you know how much I've been pouring into it?"},{j:"研究に全財産をつぎ込んだ。",r:"けんきゅうにぜんざいさんをつぎこんだ。",e:"I poured my entire fortune into the research."},{j:"時間をつぎ込む。",r:"じかんをつぎこむ。",e:"To pour time into something."}],
    wm:"The researcher's outrage — いくらつぎ込んでると思ってるんだ (do you know how much I've poured into this?). 注ぐ (pour) + 込む (into) = pour everything into something obsessively." },

  { id:"e02_a18", ep:2, word:"育てる", reading:"そだてる", meaning:"to raise / to bring up / to cultivate / to nurture", tier:1,
    kb:[{k:"育",r:"そだ(てる)",m:"raise/nurture/grow",rad:["亠","月"],rm:["lid/crown","body/flesh"],mn:"A crowned body — a child being raised, nurtured to grow"}],
    ex:[{j:"ある研究機関が非合法に育てていたデータ犬だった。",r:"あるけんきゅうきかんがひごうほうにそだてていたデータけんだった。",e:"It was a data dog that a certain research institution had been raising illegally."},{j:"子どもを育てる。",r:"こどもをそだてる。",e:"To raise a child."},{j:"才能を育てる。",r:"さいのうをそだてる。",e:"To cultivate talent."}],
    wm:"The institution 非合法に育てていた Ein — raising illegally. 育てる = to raise over time, nurturing growth. The continuous past form 育てていた = had been raising (ongoing project)." },

  { id:"e02_a19", ep:2, word:"向かう", reading:"むかう", meaning:"to head toward / to face / to go in the direction of", tier:1,
    kb:[{k:"向",r:"む(かう)",m:"face/direction/toward",rad:["口","冂"],rm:["mouth","frame/enclosure"],mn:"A mouth facing out of a frame — to face, direct toward"}],
    ex:[{j:"やつは第６インターに向かってるぜ。",r:"やつはだい6インターにむかってるぜ。",e:"He's heading toward the 6th interchange."},{j:"目標に向かって進む。",r:"もくひょうにむかってすすむ。",e:"Move forward toward the goal."},{j:"東京に向かった。",r:"とうきょうにむかった。",e:"I headed toward Tokyo."}],
    wm:"Jet tracking Hakim: やつは第６インターに向かってる. 向かう = orienting and moving toward. Very common directional verb — used for physical travel and metaphorical direction alike." },

  { id:"e02_a20", ep:2, word:"目立つ", reading:"めだつ", meaning:"to stand out / to be conspicuous / to attract attention", tier:1,
    kb:[{k:"目",r:"め",m:"eye",rad:["目"],rm:["eye"],mn:"Pictograph of an eye"},{k:"立つ",r:"だつ",m:"stand/stand out",rad:["立"],rm:["standing person"],mn:"A person standing upright — to stand, stand out"}],
    ex:[{j:"妙に目立つスーツケースを持ってたな。",r:"みょうにめだつスーツケースをもってたな。",e:"He was carrying a strangely conspicuous suitcase."},{j:"目立つ服を着ている。",r:"めだつふくをきている。",e:"He's wearing conspicuous clothes."},{j:"目立たないようにしろ。",r:"めだたないようにしろ。",e:"Try not to stand out."}],
    wm:"目 (eye) + 立つ (stand up) = stand up to the eyes = stand out. The suitcase that 目立つ is the clue that cracks the case. Things that 目立つ in the underworld are dangerous." },

  { id:"e02_a21", ep:2, word:"構わない", reading:"かまわない", meaning:"don't mind / it's fine / no problem / I don't care", tier:1,
    kb:[{k:"構",r:"かま(わない)",m:"mind/care about/structure",rad:["木","冓"],rm:["tree","build/construct"],mn:"A tree built into structure — to construct, mind, care about"}],
    ex:[{j:"構わん。やれ。",r:"かまわん。やれ。",e:"I don't mind. Do it."},{j:"構わないよ、好きにして。",r:"かまわないよ、すきにして。",e:"I don't mind — do as you like."},{j:"どちらでも構わない。",r:"どちらでもかまわない。",e:"Either is fine with me."}],
    wm:"構う (to mind/care about) → 構わない (not mind) = don't care, it's fine. Very common. 構わん is the rough/masculine form. Used to give permission or signal indifference." },

  { id:"e02_a22", ep:2, word:"叩く", reading:"たたく", meaning:"to hit / to knock / to strike / to beat", tier:1,
    kb:[{k:"叩",r:"たた(く)",m:"hit/knock/beat",rad:["口","卜"],rm:["mouth","divination/strike"],mn:"Striking down with force — to hit, knock, beat"}],
    ex:[{j:"１発叩いといてくれ。",r:"いっぱつたたいといてくれ。",e:"Give him one good hit for me."},{j:"ドアを叩く。",r:"ドアをたたく。",e:"To knock on a door."},{j:"肩を叩かれた。",r:"かたをたたかれた。",e:"Someone tapped me on the shoulder."}],
    wm:"１発叩いといてくれ = give him one punch while you're at it. 叩く covers hitting (people), knocking (doors), and even typing keys. Broad, common verb for striking." },

  { id:"e02_a23", ep:2, word:"謝る", reading:"あやまる", meaning:"to apologize / to say sorry", tier:1,
    kb:[{k:"謝",r:"あやま(る)",m:"apologize/thank/forgive",rad:["言","射"],rm:["words","shoot/release"],mn:"Words released like an arrow — to apologize, release words of regret"}],
    ex:[{j:"謝ってるじゃねえか。",r:"あやまってるじゃねえか。",e:"I'm apologizing, aren't I?"},{j:"素直に謝れ。",r:"すなおにあやまれ。",e:"Just apologize honestly."},{j:"謝っても遅い。",r:"あやまっても おそい。",e:"It's too late to apologize."}],
    wm:"Spike to Hakim after accidentally bumping him — 謝ってるじゃねえか (I'm apologizing, aren't I?). Said while fighting. The absurdity of maintaining social courtesy mid-combat." },

  { id:"e02_a24", ep:2, word:"やり通す", reading:"やりとおす", meaning:"to see through to the end / to follow through / to complete what one started", tier:2,
    kb:[{k:"やり",r:"やり",m:"do/perform",rad:[""],rm:[""],mn:"To do, perform"},{k:"通す",r:"とおす",m:"pass through/let through/see through",rad:["⻌","甬"],rm:["movement","passage/cylinder"],mn:"Moving through a passage — to pass through, see through to the end"}],
    ex:[{j:"やりかけたことは最後までやり通せって言われなかったか。",r:"やりかけたことはさいごまでやりとおせっていわれなかったか。",e:"Weren't you told to see things through to the very end?"},{j:"何があってもやり通す。",r:"なにがあってもやりとおす。",e:"I'll see it through no matter what."},{j:"最後までやり通した。",r:"さいごまでやりとおした。",e:"I followed through to the very end."}],
    wm:"やる (do) + 通す (pass all the way through) = do all the way through = see something to completion. The bounty hunter quotes his grandmother's wisdom. Applied to chasing Ein across three disguises." },

  // ── ADJECTIVES & EXPRESSIONS ─────────────────────────────────────────

  { id:"e02_a25", ep:2, word:"ありふれた", reading:"ありふれた", meaning:"common / ordinary / nothing special / run-of-the-mill", tier:2,
    kb:[{k:"有",r:"あり",m:"exist/have",rad:["月","ナ"],rm:["flesh/moon","hand"],mn:"A hand under the moon — to have, exist"},{k:"触れる",r:"ふれ(た)",m:"touch/come across",rad:["角","蚤"],rm:["horn","flea"],mn:"A flea touching with its tiny legs — to touch, come across"}],
    ex:[{j:"かわいいけどありふれてて珍しい種類じゃないわね。",r:"かわいいけどありふれててめずらしいしゅるいじゃないわね。",e:"It's cute but common — not a rare breed."},{j:"ありふれた話だ。",r:"ありふれたはなしだ。",e:"It's a common/ordinary story."},{j:"ありふれた日常。",r:"ありふれたにちじょう。",e:"An ordinary everyday life."}],
    wm:"有り (to exist) + 触れた (touched/encountered) = something encountered everywhere = common, run-of-the-mill. The pet shop owner dismisses Ein as ありふれた. She's spectacularly wrong." },

  { id:"e02_a26", ep:2, word:"繊細", reading:"せんさい", meaning:"delicate / sensitive / fine / subtle", tier:2,
    kb:[{k:"繊",r:"せん",m:"fine/delicate/slender",rad:["糸","韱"],rm:["thread","fine/slender"],mn:"Fine thread — delicate, slender, subtle"},{k:"細",r:"さい",m:"thin/fine/small",rad:["糸","囟"],rm:["thread","brain/fontanelle"],mn:"A thread thin as a brain-seam — fine, thin, small"}],
    ex:[{j:"うちの子みんな繊細なんだから。",r:"うちのこみんなせんさいなんだから。",e:"All of my babies are delicate, you know."},{j:"彼は繊細な人だ。",r:"かれはせんさいなひとだ。",e:"He's a sensitive person."},{j:"繊細な作業が必要だ。",r:"せんさいなさぎょうがひつようだ。",e:"Delicate work is required."}],
    wm:"The pet shop owner says her animals are all 繊細 (delicate) when Spike and Jet cause chaos. Fine thread (糸) metaphor — easily damaged, requiring careful handling. Often used for sensitive people too." },

  { id:"e02_a27", ep:2, word:"感度良好", reading:"かんどりょうこう", meaning:"signal is good / receiving clearly / loud and clear", tier:2,
    kb:[{k:"感",r:"かん",m:"feel/sense",rad:["咸","心"],rm:["all/sense","heart"],mn:"A heart that senses everything — to feel, sense"},{k:"度",r:"ど",m:"degree/extent/level",rad:["广","又","寸"],rm:["shelter","hand","measure"],mn:"A measured hand under shelter — degree, level, extent"},{k:"良",r:"りょう",m:"good/fine",rad:["艮"],rm:["good/fine"],mn:"Food that is just right — good, fine"},{k:"好",r:"こう",m:"good/like/fond",rad:["女","子"],rm:["woman","child"],mn:"A woman with a child — good, like, fond of"}],
    ex:[{j:"感度良好。",r:"かんどりょうこう。",e:"Signal is good / Loud and clear."},{j:"感度良好、聞こえてるよ。",r:"かんどりょうこう、きこえてるよ。",e:"Loud and clear — I can hear you."},{j:"受信感度良好だ。",r:"じゅしんかんどりょうこうだ。",e:"Reception is excellent."}],
    wm:"Radio/comms terminology: 感度 (sensitivity/reception) + 良好 (good condition) = receiving clearly. Jet confirms signal quality during the tracking operation. Classic cop/military communication language." },

  { id:"e02_a28", ep:2, word:"探し物", reading:"さがしもの", meaning:"something one is looking for / lost item", tier:1,
    kb:[{k:"探",r:"さが(し)",m:"search/look for",rad:["扌","罙"],rm:["hand","deep/explore"],mn:"A hand reaching deep — to search, look for"},{k:"物",r:"もの",m:"thing/object",rad:["牛","勿"],rm:["cow","do not"],mn:"A notable thing — an object"}],
    ex:[{j:"あんたには探し物か尋ね人があるとな。",r:"あんたにはさがしものかたずねびとがあるとな。",e:"You seem to have something you're looking for or someone you're seeking."},{j:"探し物が見つかった。",r:"さがしものがみつかった。",e:"I found what I was looking for."},{j:"探し物はなんですか？",r:"さがしものはなんですか？",e:"What are you looking for?"}],
    wm:"探し物 = the thing being searched for. The fortune-telling parrot nails it — a thing (the dog) leads to a person (the bounty). Every Bebop mission is an 探し物 of some kind." },

  { id:"e02_a29", ep:2, word:"尋ね人", reading:"たずねびと", meaning:"person being sought / missing person (formal/written)", tier:2,
    kb:[{k:"尋",r:"たず(ね)",m:"inquire/seek/look for",rad:["工","口","寸"],rm:["craft","mouth","measure"],mn:"Measuring with crafted words from the mouth — to inquire, seek"},{k:"人",r:"びと",m:"person",rad:["人"],rm:["person"],mn:"A person"}],
    ex:[{j:"あんたには探し物か尋ね人があるとな。",r:"あんたにはさがしものかたずねびとがあるとな。",e:"You seem to have something you're looking for or someone you're seeking."},{j:"尋ね人の広告を出した。",r:"たずねびとのこうこくをだした。",e:"I put out a missing person notice."},{j:"尋ね人は見つかっただろうか。",r:"たずねびとはみつかっただろうか。",e:"Did they find the person they were looking for?"}],
    wm:"Formal/poetic pairing with 探し物: 探し物 (lost thing) / 尋ね人 (sought person). The parrot uses this elevated language for comic effect — profound-sounding wisdom from a bird." },

  { id:"e02_a30", ep:2, word:"機嫌が悪い", reading:"きげんがわるい", meaning:"in a bad mood / irritable / grumpy", tier:1,
    kb:[{k:"機",r:"き",m:"machine/mechanism/mood",rad:["木","幾"],rm:["tree","mechanism"],mn:"A wooden mechanism — also: the working of a person's mood"},{k:"嫌",r:"げん",m:"dislike/unpleasant",rad:["女","兼"],rm:["woman","combine/hold"],mn:"A woman holding everything at once — unpleasant, dislike"},{k:"悪",r:"わる(い)",m:"bad/evil",rad:["亜","心"],rm:["ugly","heart"],mn:"An ugly heart — bad, evil"}],
    ex:[{j:"うるせえや、俺は今機嫌が悪いんだ。",r:"うるせえや、おれはいまきげんがわるいんだ。",e:"Shut up — I'm in a bad mood right now."},{j:"今日は機嫌が悪い。",r:"きょうはきげんがわるい。",e:"I'm in a bad mood today."},{j:"なぜそんなに機嫌が悪いの？",r:"なぜそんなにきげんがわるいの？",e:"Why are you in such a bad mood?"}],
    wm:"機嫌 (mood/temper) + が悪い (is bad) = in a bad mood. Hakim says this before a fight. Opposite: 機嫌がいい (good mood). 機嫌をとる = to try to improve someone's mood." },

  { id:"e02_a31", ep:2, word:"しまった", reading:"しまった", meaning:"oh no! / damn it! / I've made a mistake (sudden realization)", tier:1,
    kb:[],
    ex:[{j:"しまった！逃げられた。",r:"しまった！にげられた。",e:"Damn it! He got away."},{j:"しまった、財布を忘れた。",r:"しまった、さいふをわすれた。",e:"Oh no, I forgot my wallet."},{j:"しまった、間違えた。",r:"しまった、まちがえた。",e:"Damn, I made a mistake."}],
    wm:"The interjection form of しまう (to put away/finish). しまった = it has been put away (badly) = a bad completion just happened = oh no/damn. Used constantly in Bebop when things go wrong." },

  { id:"e02_a32", ep:2, word:"手を打つ", reading:"てをうつ", meaning:"to take action / to make a move / to do something about it", tier:2,
    kb:[{k:"手",r:"て",m:"hand",rad:["手"],rm:["hand"],mn:"A hand"},{k:"打つ",r:"う(つ)",m:"hit/strike/make a move",rad:["扌","丁"],rm:["hand","nail/strike"],mn:"A hand striking a nail — to hit, make a move"}],
    ex:[{j:"早く手を打たんと。",r:"はやくてをうたんと。",e:"We have to make a move quickly."},{j:"何か手を打つ必要がある。",r:"なにかてをうつひつようがある。",e:"We need to take some kind of action."},{j:"手を打つのが遅かった。",r:"てをうつのがおそかった。",e:"We were too slow to take action."}],
    wm:"Originally from board games (go/shogi) — to play a move (手). 手を打つ = strike a hand/move = take action to address a situation. Very common expression for decisive action." },

  // ── GRAMMAR ──────────────────────────────────────────────────────────

  { id:"e02_a33", ep:2, word:"〜だって", reading:"〜だって", meaning:"even ~ / ~ too / they say that ~ (casual hearsay)", tier:1,
    kb:[],
    ex:[{j:"もともと彼は連続ペット窃盗犯なんだってよ。",r:"もともとかれはれんぞくペットせっとうはんなんだってよ。",e:"Apparently he's originally a serial pet thief, they say."},{j:"彼だって間違えることがある。",r:"かれだってまちがえることがある。",e:"Even he makes mistakes sometimes."},{j:"私だってやれば できる。",r:"わたしだってやればできる。",e:"Even I can do it if I try."}],
    wm:"〜だって has two uses: (1) hearsay marker (〜だって = they say that ~, casual version of 〜そうだ/〜らしい), (2) emphatic even/also (even X / X too). Context tells you which." },

  { id:"e02_a34", ep:2, word:"〜てんのか", reading:"〜てんのか", meaning:"are you ~ing? / what are you doing? (rough/challenging)", tier:3,
    kb:[],
    ex:[{j:"何しやがる、何てんのか。",r:"なにしやがる、なにてんのか。",e:"What are you doing, what are you up to?"},{j:"何考えてんのか。",r:"なにかんがえてんのか。",e:"What are you thinking?"},{j:"本気でやってんのか？",r:"ほんきでやってんのか？",e:"Are you seriously doing this?"}],
    wm:"〜ているのか → 〜てんのか (very rough). A challenging question, often aggressive. What the hell are you doing? — implies the speaker is angry or disbelieving. Very Bebop register." },

  { id:"e02_a35", ep:2, word:"〜てもらいたい", reading:"〜てもらいたい", meaning:"I want you to ~ / I would like ~ done for me", tier:1,
    kb:[],
    ex:[{j:"取引の時間を延ばしてもらいたい。",r:"とりひきのじかんをのばしてもらいたい。",e:"I'd like to have the time for the deal extended."},{j:"もっと詳しく説明してもらいたい。",r:"もっとくわしくせつめいしてもらいたい。",e:"I'd like a more detailed explanation."},{j:"静かにしてもらいたい。",r:"しずかにしてもらいたい。",e:"I'd like you to be quiet."}],
    wm:"〜てもらいたい = want to receive the favor of ~ being done = I want you to do ~. Politer and more formal than 〜てくれ, less stiff than 〜ていただきたい. Used in requests/negotiations." },

  { id:"e02_a36", ep:2, word:"〜にすぎない", reading:"〜にすぎない", meaning:"nothing more than ~ / merely ~ / just ~", tier:2,
    kb:[],
    ex:[{j:"しょせんはイヌにすぎない。",r:"しょせんはイヌにすぎない。",e:"In the end, it's nothing more than a dog."},{j:"これは始まりにすぎない。",r:"これははじまりにすぎない。",e:"This is nothing more than the beginning."},{j:"噂にすぎない。",r:"うわさにすぎない。",e:"It's nothing more than a rumor."}],
    wm:"〜にすぎない = does not exceed (過ぎる) the category of ~. Dismissive: 'merely, nothing more than'. Hakim says this about Ein — just a dog. 価値がある is the show's reply to this dismissal." },

  { id:"e03_01", ep:3, word:"借金", reading:"しゃっきん", meaning:"debt / money owed / being in debt", tier:1,
    kb:[{k:"借",r:"しゃ(っ)",m:"borrow/rent/be indebted",rad:["亻","昔"],rm:["person","long ago/former"],mn:"A person bound to a former arrangement — to borrow, be in debt"},{k:"金",r:"きん",m:"money",rad:["人","土"],rm:["person","earth"],mn:"Person mining earth — money"}],
    ex:[{j:"君には莫大な借金があるそうだな。",r:"きみにはばくだいなしゃっきんがあるそうだな。",e:"I hear you have enormous debt."},{j:"借金を返す。",r:"しゃっきんをかえす。",e:"To pay back debt."},{j:"借金まみれの生活だ。",r:"しゃっきんまみれのせいかつだ。",e:"A life buried in debt."}],
    wm:"Faye's defining problem throughout the entire series. Her 借金 from the cold sleep era is so massive (3億+) it becomes a running joke she never resolves." },

  { id:"e03_02", ep:3, word:"カジノ", reading:"カジノ", meaning:"casino", tier:1,
    kb:[],
    ex:[{j:"フェイはカジノで稼いでいる。",r:"フェイはカジノでかせいでいる。",e:"Faye earns money at casinos."},{j:"カジノでイカサマをした。",r:"カジノでイカサマをした。",e:"She cheated at the casino."},{j:"カジノの金は天下の回り物だ。",r:"カジノのかねはてんかのまわりものだ。",e:"Casino money circulates around the world."}],
    wm:"EP03's setting — Faye runs a blackjack scam here. The 高そう then turns out to contain a 暗号解読プログラム. The casino is where everything intersects." },

  { id:"e03_03", ep:3, word:"イカサマ", reading:"イカサマ", meaning:"cheating / fraud / rigged / trickery", tier:2,
    kb:[],
    ex:[{j:"イカサマ勝負に付き合ってやったんだぜ。",r:"イカサマしょうぶにつきあってやったんだぜ。",e:"I went along with the rigged match."},{j:"イカサマをしていた！",r:"イカサマをしていた！",e:"She was cheating!"},{j:"イカサマを見抜くのも腕のうち。",r:"イカサマをみぬくのもうでのうち。",e:"Seeing through cheating is also a skill."}],
    wm:"Faye's whole game is イカサマ — but she says 見抜くのも腕のうち (spotting it is also skill). Her personal philosophy of life in one line." },

  { id:"e03_04", ep:3, word:"証拠", reading:"しょうこ", meaning:"evidence / proof", tier:1,
    kb:[{k:"証",r:"しょう",m:"proof/certify/evidence",rad:["言","登"],rm:["words","ascend/register"],mn:"Words ascending to official record — to certify, prove"},{k:"拠",r:"こ",m:"basis/grounds/rely on",rad:["扌","居"],rm:["hand","reside/occupy"],mn:"A hand occupying a solid position — basis, grounds"}],
    ex:[{j:"証拠があって言ってんのかしら？",r:"しょうこがあっていってんのかしら？",e:"Do you have evidence to say that?"},{j:"証拠を見せろ。",r:"しょうこをみせろ。",e:"Show me the evidence."},{j:"証拠がなければ逮捕できない。",r:"しょうこがなければたいほできない。",e:"Without evidence we can't arrest them."}],
    wm:"Faye challenges the casino boss: 証拠があって言ってんのかしら? — the bold bluff that shows how she operates. She makes them prove it first." },

  { id:"e03_05", ep:3, word:"暗号", reading:"あんごう", meaning:"code / cipher / encryption", tier:2,
    kb:[{k:"暗",r:"あん",m:"dark/secret/hidden",rad:["日","音"],rm:["sun","sound/shadow"],mn:"The sun hidden by sound/shadow — dark, hidden, secret"},{k:"号",r:"ごう",m:"signal/number/code",rad:["口","丂"],rm:["mouth","snaking/signal"],mn:"A mouth signaling in a pattern — a code, signal, number"}],
    ex:[{j:"暗号解読プログラムが入っている。",r:"あんごうかいどくプログラムがはいっている。",e:"A code-breaking program is inside it."},{j:"暗号を解読する。",r:"あんごうをかいどくする。",e:"To decode a cipher."},{j:"暗号化されたデータ。",r:"あんごうかされたデータ。",e:"Encrypted data."}],
    wm:"The MacGuffin of EP03: a 暗号解読プログラム (code-breaking program) hidden in a casino chip. The villain calls it 魔法の鍵 (magic key)." },

  { id:"e03_06", ep:3, word:"魔法の鍵", reading:"まほうのかぎ", meaning:"magic key / a tool that unlocks anything", tier:3,
    kb:[{k:"魔",r:"ま",m:"demon/evil/magic",rad:["广","鬼"],rm:["shelter","demon"],mn:"A demon under shelter — evil, magical"},{k:"法",r:"ほう",m:"law/method",rad:["氵","去"],rm:["water","go away"],mn:"Water channeled in a method — law, method"},{k:"鍵",r:"かぎ",m:"key/lock",rad:["金","建"],rm:["metal","build/establish"],mn:"Metal that builds (opens) something — a key"}],
    ex:[{j:"言ってみりゃ魔法の鍵ってわけだ。",r:"いってみりゃまほうのかぎってわけだ。",e:"You could call it a magic key."},{j:"魔法の鍵を使ってどんな扉も開く。",r:"まほうのかぎをつかってどんなとびらもあく。",e:"Use the magic key to open any door."},{j:"ほとんどの暗号を解読できる魔法の鍵だ。",r:"ほとんどのあんごうをかいどくできるまほうのかぎだ。",e:"It's a magic key that can break almost any encryption."}],
    wm:"Gren's poetic name for the クリプトブレイカー chip — 魔法の鍵. Something that unlocks everything is the most valuable and dangerous thing imaginable." },

  { id:"e03_07", ep:3, word:"莫大", reading:"ばくだい", meaning:"enormous / vast / immense (amount or scale)", tier:2,
    kb:[{k:"莫",r:"ばく",m:"vast/enormous/vague",rad:["艹","日","大"],rm:["plant","sun","big"],mn:"A vast expanse of plants under the sun — enormous, vast"},{k:"大",r:"だい",m:"big/great",rad:["大"],rm:["large person"],mn:"A person with arms spread wide — big, great"}],
    ex:[{j:"君には莫大な借金があるそうだな。",r:"きみにはばくだいなしゃっきんがあるそうだな。",e:"I hear you have enormous debt."},{j:"莫大な費用がかかる。",r:"ばくだいなひようがかかる。",e:"It costs an enormous amount."},{j:"莫大な利益を得た。",r:"ばくだいなりえきをえた。",e:"They made a vast profit."}],
    wm:"莫 (vast sky/expanse) + 大 (big) = truly enormous scale. Faye's debt from the cold sleep is 莫大 — it's the defining scale of her problem." },

  { id:"e03_08", ep:3, word:"常習犯", reading:"じょうしゅうはん", meaning:"repeat offender / habitual criminal", tier:2,
    kb:[{k:"常",r:"じょう",m:"always/normal/constant",rad:["巾","尚"],rm:["cloth","esteem/above"],mn:"A cloth always held high — constant, normal, always"},{k:"習",r:"しゅう",m:"practice/habit/learn",rad:["羽","白"],rm:["feathers","white"],mn:"White feathers — birds practicing flight, to learn through repetition"},{k:"犯",r:"はん",m:"crime/offend",rad:["犭","己"],rm:["animal","self"],mn:"An animal acting on self-interest — crime, offense"}],
    ex:[{j:"見かけによらず常習犯。",r:"みかけによらずじょうしゅうはん。",e:"A repeat offender despite appearances."},{j:"彼は常習犯として知られている。",r:"かれはじょうしゅうはんとしてしられている。",e:"He is known as a repeat offender."},{j:"常習犯には厳しい判決が出た。",r:"じょうしゅうはんにはきびしいはんけつがでた。",e:"The repeat offender received a harsh sentence."}],
    wm:"Big Shot's intro for Faye on TV — 見かけによらず常習犯. She looks innocent but is always at it. Her reputation precedes her." },

  { id:"e03_09", ep:3, word:"一文無し", reading:"いちもんなし", meaning:"broke / penniless / without a penny", tier:2,
    kb:[],
    ex:[{j:"一文無しで警察行きよ。",r:"いちもんなしでけいさつゆきよ。",e:"They go to the police penniless."},{j:"賭けに負けて一文無しになった。",r:"かけにまけていちもんなしになった。",e:"I lost the bet and ended up penniless."},{j:"一文無しになってどうする。",r:"いちもんなしになってどうする。",e:"What will you do when you're penniless?"}],
    wm:"一文 (one mon = ancient smallest coin) + 無し (none) = not even the smallest coin. The Bebop crew's permanent condition." },

  { id:"e03_10", ep:3, word:"気風がいい", reading:"きっぷがいい", meaning:"generous in spirit / bold and magnanimous / having great style", tier:3,
    kb:[{k:"気",r:"き",m:"spirit/air/energy",rad:["气","米"],rm:["air/energy","rice"],mn:"Energy/rice rising as steam — vital spirit, energy"},{k:"風",r:"ふ(っぷ)",m:"wind/style/manner",rad:["凡","虫"],rm:["common","insect"],mn:"Common movement like insect wings — wind, style, manner"}],
    ex:[{j:"俺は運がいいわけでも腕がいいわけでもないんだ。気風がいいのさ。",r:"おれはうんがいいわけでもうでがいいわけでもないんだ。きっぷがいいのさ。",e:"I'm not lucky and I'm not skilled. I just have great spirit."},{j:"気風のいい男だ。",r:"きっぷのいいおとこだ。",e:"He's a man of generous bold spirit."},{j:"気風がいいから好かれる。",r:"きっぷがいいからすかれる。",e:"He's liked because of his great spirit."}],
    wm:"Spike's explanation for why he always wins — not luck or skill but 気風 (spirit/character). The most Spike possible answer. Untranslatable but deeply Japanese." },

  { id:"e03_11", ep:3, word:"わらしべ長者", reading:"わらしべちょうじゃ", meaning:"straw millionaire (Japanese folktale of trading up from nothing)", tier:3,
    kb:[],
    ex:[{j:"わらしべ長者のやり直しか。",r:"わらしべちょうじゃのやりなおしか。",e:"Another attempt at the straw millionaire story?"},{j:"まるでわらしべ長者みたいだ。",r:"まるでわらしべちょうじゃみたいだ。",e:"It's just like the straw millionaire story."},{j:"小さなものが大きな価値になった。",r:"ちいさなものがおおきなかちになった。",e:"A small thing became something of great value."}],
    wm:"A folktale where a man trades a straw into a mansion through lucky swaps. Spike says this when the casino chip becomes a 3000万 deal — exactly that story." },

  { id:"e03_12", ep:3, word:"損して得取れ", reading:"そんしてとくとれ", meaning:"take a loss to gain more / spend money to make money (proverb)", tier:3,
    kb:[],
    ex:[{j:"損して得取れってやつさ。",r:"そんしてとくとれってやつさ。",e:"It's what they call 'take a loss to make a gain'."},{j:"損して得取れという考えで投資した。",r:"そんしてとくとれというかんがえでとうしした。",e:"I invested with the take-a-loss-to-gain mindset."},{j:"損して得取れ、短期の損は長期の得。",r:"そんしてとくとれ、たんきのそんはちょうきのとく。",e:"Short-term loss is long-term gain."}],
    wm:"Spike quotes this as if Charlie Parker said it — Jet points out Charlie Parker said no such thing. The proverb strategy drives the 3000万 deal plan." },

  { id:"e03_13", ep:3, word:"〜にもほどがある", reading:"〜にもほどがある", meaning:"there's a limit to how ~ / there are limits to ~", tier:3,
    kb:[],
    ex:[{j:"言いがかりにもほどがあるんじゃない。",r:"いいがかりにもほどがあるんじゃない。",e:"There's a limit to the accusations you can make."},{j:"冗談にもほどがある。",r:"じょうだんにもほどがある。",e:"There are limits to joking."},{j:"迷惑にもほどがある。",r:"めいわくにもほどがある。",e:"There's a limit to how much trouble one can cause."}],
    wm:"〜にもほどがある = even X has its limits. Faye says this about Spike's accusation. Very useful expression for expressing that something has gone too far." },

  { id:"e03_14", ep:3, word:"〜わけにはいかない", reading:"〜わけにはいかない", meaning:"cannot / must not / there's no way I can ~", tier:2,
    kb:[],
    ex:[{j:"警察に渡すわけにはいかない。",r:"けいさつにわたすわけにはいかない。",e:"There's no way I can hand it over to the police."},{j:"諦めるわけにはいかない。",r:"あきらめるわけにはいかない。",e:"I can't just give up."},{j:"嘘をつくわけにはいかない。",r:"うそをつくわけにはいかない。",e:"I cannot tell a lie."}],
    wm:"〜わけにはいかない = the situation/logic makes it impossible. Stronger than ～できない — it's not ability but propriety or circumstance that prevents it." },

// ═══════════════════════════════════════════════════
// EP04: GATEWAY SHUFFLE
// ═══════════════════════════════════════════════════

  { id:"e04_01", ep:4, word:"環境保護", reading:"かんきょうほご", meaning:"environmental protection / conservation", tier:1,
    kb:[{k:"環",r:"かん",m:"ring/cycle/environ",rad:["王","睘"],rm:["king","look around"],mn:"A king looking around in all directions — surrounding, ring, environment"},{k:"境",r:"きょう",m:"border/boundary",rad:["土","竟"],rm:["earth","end/result"],mn:"Where earth ends — a boundary, border"},{k:"保",r:"ほ",m:"protect/preserve",rad:["亻","呆"],rm:["person","protect"],mn:"A person protecting — to preserve"},{k:"護",r:"ご",m:"guard/protect",rad:["言","蒦"],rm:["words","grasp"],mn:"Words that grasp — to guard, protect"}],
    ex:[{j:"スペース・ウォリアーズは環境保護団体だ。",r:"スペース・ウォリアーズはかんきょうほごだんたいだ。",e:"Space Warriors is an environmental protection group."},{j:"環境保護のために戦う。",r:"かんきょうほごのためにたたかう。",e:"Fighting for environmental protection."},{j:"環境保護活動に参加した。",r:"かんきょうほごかつどうにさんかした。",e:"I participated in environmental protection activities."}],
    wm:"What Space Warriors claims to be — 環境保護 masks eco-terrorism. The gap between stated values and actual methods is EP04's central irony." },

  { id:"e04_02", ep:4, word:"テロリスト", reading:"テロリスト", meaning:"terrorist", tier:1,
    kb:[],
    ex:[{j:"私たちをテロリストと一緒にしないでいただける？",r:"わたしたちをテロリストといっしょにしないでいただける？",e:"Could you not put us in the same category as terrorists?"},{j:"テロリストとの交渉はない。",r:"テロリストとのこうしょうはない。",e:"There are no negotiations with terrorists."},{j:"テロリストが800万人を人質にした。",r:"テロリストが800まんにんをひとじちにした。",e:"The terrorist took 8 million people hostage."}],
    wm:"Twinkle insists they're 平和の戦士 (warriors of peace) not テロリスト. The show doesn't let her off the hook — the virus plan is exactly terrorism." },

  { id:"e04_03", ep:4, word:"ウイルス", reading:"ウイルス", meaning:"virus", tier:1,
    kb:[],
    ex:[{j:"ウイルスの名前はモンキービジネス。",r:"ウイルスのなまえはモンキービジネス。",e:"The virus's name is Monkey Business."},{j:"コンピューターウイルスに感染した。",r:"コンピューターウイルスにかんせんした。",e:"It got infected with a computer virus."},{j:"そのウイルスは人間だけを狙える。",r:"そのウイルスはにんげんだけをねらえる。",e:"That virus can target only humans."}],
    wm:"モンキービジネス — targets the 2% genetic difference between humans and monkeys, turning people into apes. Dark sci-fi biology wearing a comedy episode's costume." },

  { id:"e04_04", ep:4, word:"遺伝子", reading:"いでんし", meaning:"gene / genetics / genetic code", tier:2,
    kb:[{k:"遺",r:"い",m:"leave behind/inherit/bequeath",rad:["⻌","貴"],rm:["movement","precious/valuable"],mn:"Precious things left behind in movement — inheritance, bequest"},{k:"伝",r:"でん",m:"transmit/convey/pass on",rad:["亻","云"],rm:["person","say/cloud"],mn:"A person conveying — to transmit, pass on"},{k:"子",r:"し",m:"child/small particle",rad:["子"],rm:["child"],mn:"A child — child, small particle, seed"}],
    ex:[{j:"人間とサルの遺伝子の違いはわずか２パーセントだ。",r:"にんげんとさるのいでんしのちがいはわずか2ぱーせんとだ。",e:"The genetic difference between humans and monkeys is only 2 percent."},{j:"遺伝子研究が進んでいる。",r:"いでんしけんきゅうがすすんでいる。",e:"Genetic research is advancing."},{j:"遺伝子を操作する技術。",r:"いでんしをそうさするぎじゅつ。",e:"Technology for manipulating genes."}],
    wm:"The key concept in Monkey Business — targets the 遺伝子 that separates humans from monkeys. A real concept used for dark sci-fi." },

  { id:"e04_05", ep:4, word:"要求", reading:"ようきゅう", meaning:"demand / request / requirement", tier:1,
    kb:[{k:"要",r:"よう",m:"require/essential/main point",rad:["西","女"],rm:["cover/west","woman"],mn:"A woman at the center of things — to need, require"},{k:"求",r:"きゅう",m:"seek/demand/request",rad:["水","丨"],rm:["water","line/flowing"],mn:"Flowing like water to find something — to seek, demand"}],
    ex:[{j:"そちらの要求どおり賞金も取り消した。",r:"そちらのようきゅうどおりしょうきんもとりけした。",e:"As per your demands, we've also cancelled the bounty."},{j:"要求を呑む。",r:"ようきゅうをのむ。",e:"To accept/swallow a demand."},{j:"その要求は無理だ。",r:"そのようきゅうはむりだ。",e:"That demand is impossible."}],
    wm:"Twinkle's 要求: ban catching sea rats AND release her. Classic hostage logic — the demands are just the visible tip of the real agenda." },

  { id:"e04_06", ep:4, word:"脅迫", reading:"きょうはく", meaning:"threat / coercion / intimidation", tier:2,
    kb:[{k:"脅",r:"きょう",m:"threaten/coerce",rad:["月","劦"],rm:["body/flesh","three forces"],mn:"Three forces pressing on the body — to threaten, coerce"},{k:"迫",r:"はく",m:"press/force/close in",rad:["⻌","白"],rm:["movement","white/clear"],mn:"Moving in with clear force — to press, close in on"}],
    ex:[{j:"連中がやってんのは交渉という名目の脅迫だ。",r:"れんちゅうがやってんのはこうしょうというなもくのきょうはくだ。",e:"What they're doing is intimidation disguised as negotiation."},{j:"脅迫は犯罪だ。",r:"きょうはくははんざいだ。",e:"Intimidation is a crime."},{j:"脅迫に屈しない。",r:"きょうはくにくっしない。",e:"I won't yield to threats."}],
    wm:"Spike calls it exactly — 交渉という名目の脅迫 (intimidation disguised as negotiation). The clearest political language in the episode." },

  { id:"e04_07", ep:4, word:"人質", reading:"ひとじち", meaning:"hostage", tier:1,
    kb:[{k:"人",r:"ひと",m:"person",rad:["人"],rm:["person"],mn:"A person"},{k:"質",r:"じち",m:"substance/pawn/pledge/quality",rad:["斤","貝"],rm:["axe/cut","shell/money"],mn:"Shell-money cut as collateral — a pawn, pledge, substance"}],
    ex:[{j:"人質はガニメデの住民800万人だ。",r:"ひとじちはガニメデのじゅうみん800まんにんだ。",e:"The hostages are 8 million residents of Ganymede."},{j:"人質を取るな！",r:"ひとじちをとるな！",e:"Don't take hostages!"},{j:"人質交渉が始まった。",r:"ひとじちこうしょうがはじまった。",e:"Hostage negotiations have begun."}],
    wm:"Twinkle threatens 800万人 as 人質 with a single virus — the scale of bioterrorism makes this a genuinely dark episode under its absurd comedy surface." },

  { id:"e04_08", ep:4, word:"釈放", reading:"しゃくほう", meaning:"release from custody / letting someone go free", tier:2,
    kb:[{k:"釈",r:"しゃく",m:"explain/release/set free",rad:["釆","尺"],rm:["sort out/distinguish","measure"],mn:"Measuring out what has been sorted — to explain, release"},{k:"放",r:"ほう",m:"release/set free/let go",rad:["方","攵"],rm:["direction","strike/follow"],mn:"Striking someone in a direction — to release, set free"}],
    ex:[{j:"すぐ釈放するようにってお達しだ。",r:"すぐしゃくほうするようにっておたっしだ。",e:"There's an order to release her immediately."},{j:"釈放された後、何をするつもりだ？",r:"しゃくほうされたあと、なにをするつもりだ？",e:"What do you plan to do after being released?"},{j:"証拠不十分で釈放された。",r:"しょうこふじゅうぶんでしゃくほうされた。",e:"Released due to insufficient evidence."}],
    wm:"The government orders Twinkle's 釈放 immediately — caving to the 要求. Bob tells Jet this with disgust. Spike creates the alternative." },

  { id:"e04_09", ep:4, word:"位相差空間", reading:"いそうさくうかん", meaning:"phase space / hyperspace / the space inside warp gates", tier:2,
    kb:[],
    ex:[{j:"サイルごと位相差空間に閉じ込めるつもりだ。",r:"サイルごといそうさくうかんにとじこめるつもりだ。",e:"They're planning to trap it in phase space along with the missile."},{j:"位相差空間に閉じ込められた物質は永遠に交わらない。",r:"いそうさくうかんにとじこめられたぶっしつはえいえんにまじわらない。",e:"Matter trapped in phase space never interacts with our world again."},{j:"ゲートは位相差空間を利用している。",r:"ゲートはいそうさくうかんをりようしている。",e:"The gates use phase space."}],
    wm:"The sci-fi concept behind Bebop's hyperspace gates — matter trapped in 位相差空間 is visible but never touches our world again. The missile disappears forever." },

  { id:"e04_10", ep:4, word:"逃げきれない", reading:"にげきれない", meaning:"cannot escape / can't get away completely", tier:2,
    kb:[{k:"逃",r:"に(げ)",m:"flee",rad:["⻌","兆"],rm:["movement","omen"],mn:"Moving at the first omen — to flee"},{k:"切",r:"き(れない)",m:"cut through/complete",rad:["七","刀"],rm:["seven","knife"],mn:"A knife cutting completely through — to complete, cut through"}],
    ex:[{j:"もう逃げきれないわ。",r:"もうにげきれないわ。",e:"We can't escape anymore."},{j:"追いつかれて逃げきれなかった。",r:"おいつかれてにげきれなかった。",e:"I was caught up and couldn't escape."},{j:"逃げきれるか？",r:"にげきれるか？",e:"Can you make a complete escape?"}],
    wm:"〜きれない = cannot do completely. 逃げ切れない = can't cut through (完切) the flight successfully = can't fully escape. Katerina's final words." },

  { id:"e04_11", ep:4, word:"〜ようとしても", reading:"〜ようとしても", meaning:"even if one tries to ~ / no matter how much one tries to ~", tier:2,
    kb:[],
    ex:[{j:"逃げようとしても逃げられない。",r:"にげようとしてもにげられない。",e:"Even if you try to escape, you can't."},{j:"忘れようとしても忘れられない。",r:"わすれようとしてもわすれられない。",e:"Even if I try to forget, I can't."},{j:"止めようとしても止められない。",r:"とめようとしてもとめられない。",e:"Even if I try to stop it, I can't."}],
    wm:"〜ようとしても + negative = even trying doesn't work. Creates a sense of futility and inevitability. Often heard in emotional contexts." },

  { id:"e04_12", ep:4, word:"打つ手なし", reading:"うつてなし", meaning:"no cards left to play / out of options / nothing more to be done", tier:3,
    kb:[],
    ex:[{j:"ISSPも打つ手なしなんだとさ。",r:"ISSPもうつてなしなんだとさ。",e:"Apparently even the ISSP is out of options."},{j:"打つ手なしで諦めた。",r:"うつてなしであきらめた。",e:"Out of options, they gave up."},{j:"打つ手なしの状況だ。",r:"うつてなしのじょうきょうだ。",e:"The situation is one with no options."}],
    wm:"打つ (to play/strike a move in chess or go) + 手 (move) + なし (none) = no moves left to make. Shogi/Go metaphor for being stuck in life." },

// ═══════════════════════════════════════════════════
// EP05: BALLAD OF FALLEN ANGELS
// ═══════════════════════════════════════════════════

  { id:"e05_01", ep:5, word:"繁栄", reading:"はんえい", meaning:"prosperity / flourishing / thriving", tier:2,
    kb:[{k:"繁",r:"はん",m:"prosperous/flourishing",rad:["糸","𣬈"],rm:["thread","every/abundant"],mn:"Threads multiplying abundantly — flourishing, prosperous"},{k:"栄",r:"えい",m:"glory/flourish/honor",rad:["艹","冖","木"],rm:["plant","cover","tree"],mn:"A tree crowned and covered with blooms — glory, flourishing"}],
    ex:[{j:"お互いの繁栄を願って。",r:"おたがいのはんえいをねがって。",e:"Wishing each other prosperity."},{j:"会社が繁栄している。",r:"かいしゃがはんえいしている。",e:"The company is prospering."},{j:"繁栄した都市。",r:"はんえいしたとし。",e:"A prosperous city."}],
    wm:"The empty toast at the crime lord meeting — お互いの繁栄を願って. Hollow words before betrayal. The show uses formal language to undercut meaning." },

  { id:"e05_02", ep:5, word:"心当たり", reading:"こころあたり", meaning:"have some idea about / know something of / having a lead", tier:2,
    kb:[{k:"心",r:"こころ",m:"heart/mind/spirit",rad:["心"],rm:["heart"],mn:"Pictograph of a heart — heart, mind"},{k:"当",r:"あた(り)",m:"hit/correspond/relevant",rad:["𠂉","田"],rm:["top","field"],mn:"The top of a field — to hit, correspond, be relevant"},{k:"心当たり",r:"こころあたり",m:"have a relevant connection in mind",rad:[],rm:[],mn:"心 (heart/mind) + 当たり (hits/relevant) = having something relevant in mind"}],
    ex:[{j:"心当たりもある。",r:"こころあたりもある。",e:"I have some leads/ideas about it."},{j:"心当たりがあれば教えてください。",r:"こころあたりがあればおしえてください。",e:"If you have any ideas, please let me know."},{j:"誰だか心当たりがない。",r:"だれだかこころあたりがない。",e:"I have no idea who it could be."}],
    wm:"Jet's response to hearing about Mao — 心当たりもある. Having 心当たり means your mind has 'hit' on something relevant. Common in investigation contexts." },

  { id:"e05_03", ep:5, word:"代償", reading:"だいしょう", meaning:"price / cost / sacrifice paid for something", tier:2,
    kb:[{k:"代",r:"だい",m:"replace/substitute/era/cost",rad:["亻","弋"],rm:["person","substitute"],mn:"A person being a substitute — to replace, the cost/price of substitution"},{k:"償",r:"しょう",m:"compensate/pay for",rad:["亻","賞"],rm:["person","prize/reward"],mn:"A person paying back a prize — to compensate, pay the cost"}],
    ex:[{j:"先走った揚げ句の代償だ。",r:"さきばしったあげくのだいしょうだ。",e:"It's the price of acting impulsively."},{j:"自由の代償は高い。",r:"じゆうのだいしょうはたかい。",e:"The price of freedom is high."},{j:"成功の代償として何かを失った。",r:"せいこうのだいしょうとしてなにかをうしなった。",e:"Something was lost as the price of success."}],
    wm:"Gren's arm lost to impulsive action — 先走った揚げ句の代償. 代償 is what you pay for a choice. The show is full of characters paying their 代償." },

  { id:"e05_04", ep:5, word:"牙", reading:"きば", meaning:"fang / tusk / predatory power", tier:2,
    kb:[{k:"牙",r:"きば",m:"fang/tusk",rad:["牙"],rm:["interlocking fang"],mn:"Pictograph of an interlocking fang — a fang, tusk, predatory tooth"}],
    ex:[{j:"やつは牙をなくした獣だ。だから死んだのさ。",r:"やつはきばをなくしたけものだ。だからしんだのさ。",e:"He's a beast that lost its fangs. That's why he died."},{j:"牙をむく。",r:"きばをむく。",e:"To bare one's fangs (to become aggressive)."},{j:"牙のない獣は危険じゃない。",r:"きばのないけものはきけんじゃない。",e:"A beast without fangs isn't dangerous."}],
    wm:"Vicious says this about Mao — 牙をなくした獣. A predator who lost the will or ability to kill is no longer a predator. Vicious has no respect for mercy." },

  { id:"e05_05", ep:5, word:"獣", reading:"けもの", meaning:"beast / wild animal / savage creature", tier:2,
    kb:[{k:"獣",r:"けもの",m:"beast/wild animal",rad:["犭","𠀒","口","一"],rm:["animal","hunting","mouth","one"],mn:"An animal tracked by hunters — a wild beast, savage creature"}],
    ex:[{j:"別の血を求めさまよう獣の血だ。",r:"べつのちをもとめさまようけもののちだ。",e:"It's the blood of a beast that wanders seeking different blood."},{j:"おまえも同じだ、獣だ。",r:"おまえもおなじだ、けものだ。",e:"You're the same — a beast."},{j:"獣のように戦う。",r:"けもののようにたたかう。",e:"To fight like a beast."}],
    wm:"Vicious sees both himself and Spike as 獣 — creatures that live by blood and cannot be domesticated. He means it as fact, not insult." },

  { id:"e05_06", ep:5, word:"覚めない夢", reading:"さめないゆめ", meaning:"a dream one cannot wake from / persistent dream", tier:2,
    kb:[],
    ex:[{j:"俺はただ覚めない夢を見てるだけさ。",r:"おれはたださめないゆめをみてるだけさ。",e:"I'm just seeing a dream I can't wake from."},{j:"覚めない夢のような現実。",r:"さめないゆめのようなげんじつ。",e:"A reality like a dream I can't wake from."},{j:"これは覚めない悪夢だ。",r:"これはさめないあくむだ。",e:"This is a nightmare I can't wake from."}],
    wm:"Spike's defining philosophy: 俺はただ覚めない夢を見てるだけさ. He can't tell past from present, or whether he's really alive. The show's central ambiguity." },

  { id:"e05_07", ep:5, word:"恩人", reading:"おんじん", meaning:"benefactor / person one owes gratitude to", tier:2,
    kb:[{k:"恩",r:"おん",m:"grace/favor/gratitude/debt",rad:["因","心"],rm:["cause/reason","heart"],mn:"The reason in one's heart — a favor received, grace, a debt of gratitude"},{k:"人",r:"じん",m:"person",rad:["人"],rm:["person"],mn:"A person"}],
    ex:[{j:"恩人だってさっさと殺しちまうんだからな。",r:"おんじんだってさっさころしちまうんだからな。",e:"He kills even his benefactors without hesitation."},{j:"彼女は私の恩人だ。",r:"かのじょはわたしのおんじんだ。",e:"She is my benefactor."},{j:"恩人を裏切るのか？",r:"おんじんをうらぎるのか？",e:"Are you going to betray your benefactor?"}],
    wm:"Spike accuses Vicious — even Mao (恩人) he killed. The 恩 (debt of gratitude) is the deepest obligation in Japanese ethics; killing your 恩人 is the ultimate betrayal." },

  { id:"e05_08", ep:5, word:"渡世の仁義", reading:"とせいのじんぎ", meaning:"the code of the underworld / obligation to one's outlaw path", tier:3,
    kb:[],
    ex:[{j:"渡世の仁義ってやつさ。",r:"とせいのじんぎってやつさ。",e:"It's what they call the code of the underworld."},{j:"渡世の仁義を守る男だ。",r:"とせいのじんぎをまもるおとこだ。",e:"He's a man who keeps the underworld code."},{j:"仁義なき戦い。",r:"じんぎなきたたかい。",e:"A fight without honor (famous yakuza film reference)."}],
    wm:"Gren's reason for going to face Vicious despite everything — 渡世の仁義. The code that binds men like them even when reason says to stay away." },

  { id:"e05_09", ep:5, word:"腐れ縁", reading:"くされえん", meaning:"rotten bond / tie that won't break no matter how rotten it gets", tier:3,
    kb:[{k:"腐",r:"くさ(れ)",m:"rot/decay",rad:["肉","付"],rm:["meat/flesh","attach"],mn:"Meat attaching and decaying — to rot, decay"},{k:"縁",r:"えん",m:"fate/connection/edge/bond",rad:["糸","彖"],rm:["thread","judge/decide"],mn:"A thread of fate decided by the universe — connection, bond, fate"}],
    ex:[{j:"腐れ縁の野良猫をな。",r:"くされえんののらねこをな。",e:"A stray cat I can't shake — that's the rotten bond."},{j:"あいつとは腐れ縁だ。",r:"あいつとはくされえんだ。",e:"I have a rotten, unbreakable bond with that guy."},{j:"腐れ縁というか、ずっと一緒にいる。",r:"くされえんというか、ずっといっしょにいる。",e:"You could call it a rotten bond — we've been together forever."}],
    wm:"Annie uses this about her stray cat. In the show, ALL the Bebop relationships are 腐れ縁 — people who should have parted ways long ago but can't." },

  { id:"e05_10", ep:5, word:"命乞い", reading:"いのちごい", meaning:"begging for one's life / pleading for mercy", tier:3,
    kb:[{k:"命",r:"いのち",m:"life/fate/command",rad:["亼","叩"],rm:["gather","kneel/beg"],mn:"Gathering while kneeling — fate, life, command"},{k:"乞",r:"ご(い)",m:"beg/request humbly",rad:["乞"],rm:["beg/request"],mn:"A person bent low in supplication — to beg, request humbly"}],
    ex:[{j:"命乞いか？",r:"いのちごいか？",e:"Are you begging for your life?"},{j:"命乞いをした。",r:"いのちごいをした。",e:"He begged for his life."},{j:"命乞いしても無駄だ。",r:"いのちごいしてもむだだ。",e:"Begging for your life is useless."}],
    wm:"Vicious sneers: 命乞いか? — then 'not your style'. He knows Spike. The line shows how well they know each other, even as enemies." },

  { id:"e05_11", ep:5, word:"奴", reading:"やつ", meaning:"guy / fellow / that person (casual, rough)", tier:1,
    kb:[{k:"奴",r:"やつ",m:"guy/fellow/slave (archaic)",rad:["女","又"],rm:["woman","hand"],mn:"A woman under a hand — originally slave, now rough 'guy/fellow'"}],
    ex:[{j:"あいつの息を止めるなんざ１秒でできた。",r:"あいつのいきをとめるなんざ1びょうでできた。",e:"Stopping that guy's breathing would have taken one second."},{j:"あいつは何者だ？",r:"あいつはなにものだ？",e:"Who is that guy?"},{j:"やつが来た。",r:"やつがきた。",e:"He came. / The guy showed up."}],
    wm:"やつ/あいつ = rough casual third-person. Very common in Bebop. こいつ (this guy here) / そいつ (that guy there) / あいつ (that guy over there/known person)." },

  { id:"e05_12", ep:5, word:"決着をつける", reading:"けっちゃくをつける", meaning:"to settle / bring to a conclusion / resolve once and for all", tier:2,
    kb:[{k:"決",r:"けっ",m:"decide/determine/conclude",rad:["氵","夬"],rm:["water","resolve/clear"],mn:"Water cleared of obstruction — to decide, determine"},{k:"着",r:"ちゃく",m:"arrive/attach/wear",rad:["羊","目"],rm:["sheep","eye"],mn:"A sheep arriving at sight — to arrive, attach, settle"}],
    ex:[{j:"この間の決着がまだだぜ。",r:"このあいだのけっちゃくがまだだぜ。",e:"We haven't settled things from last time yet."},{j:"今日こそ決着をつけよう。",r:"きょうこそけっちゃくをつけよう。",e:"Let's settle this today."},{j:"決着がつかないまま別れた。",r:"けっちゃくがつかないまましわかれた。",e:"We parted without resolution."}],
    wm:"Gren says 決着がまだだ to Spike — the Titan business was never finished. Everything in the final arc flows from unfinished 決着." },

  { id:"e05_13", ep:5, word:"片目", reading:"かため", meaning:"one eye / a single eye", tier:2,
    kb:[{k:"片",r:"かた",m:"one side/fragment/half",rad:["片"],rm:["half/fragment"],mn:"Half of something split — one side, fragment"},{k:"目",r:"め",m:"eye",rad:["目"],rm:["eye"],mn:"Pictograph of an eye"}],
    ex:[{j:"左右の瞳の色が違うのね。",r:"さゆうのひとみのいろがちがうのね。",e:"The colors of your left and right eyes are different."},{j:"片目で過去を見ていた。",r:"かためでかこをみていた。",e:"I was seeing the past with one eye."},{j:"片目は義眼だ。",r:"かためはぎがんだ。",e:"One eye is artificial."}],
    wm:"Spike's mismatched eyes — one real (present), one artificial (past). EP26 reveals this directly. Even his face is split between past and present." },

  { id:"e05_14", ep:5, word:"〜だけさ", reading:"〜だけさ", meaning:"just ~ / merely ~ / only ~ (casual male speech)", tier:2,
    kb:[],
    ex:[{j:"俺はただ覚めない夢を見てるだけさ。",r:"おれはたださめないゆめをみてるだけさ。",e:"I'm just seeing a dream I can't wake from."},{j:"時代遅れのカウボーイだけさ。",r:"じだいおくれのカウボーイだけさ。",e:"Just an out-of-date cowboy."},{j:"知ってるだけさ、気にするな。",r:"しってるだけさ、きにするな。",e:"I just happen to know, don't worry about it."}],
    wm:"〜だけさ = just/merely + さ (casual male sentence ender). Creates a dismissive, understated quality. Very characteristic of Spike's speech pattern." },


  // ── EP 06 ──
  { id:"e06_01", ep:6, word:"老化", reading:"ろうか", meaning:"aging / senescence", tier:1,
    kb:[{k:"老",r:"ろう",m:"old/age",rad:["老"],rm:["old"],mn:"Pictograph of an old person with a bent back and cane — old age"},{k:"化",r:"か",m:"transform/change",rad:["人","匕"],rm:["person","crouching person"],mn:"A person transforming into another posture — to change, transform"}],
    wm:"To transform (化) into old (老) — Wen stopped 老化 when the gate accident altered his pineal gland" },
  { id:"e06_02", ep:6, word:"松果体", reading:"しょうかたい", meaning:"pineal gland", tier:2,
    kb:[{k:"松",r:"しょう",m:"pine tree",rad:["木","公"],rm:["tree","public/noble"],mn:"A noble (公) tree (木) — the pine tree, symbol of endurance"},{k:"果",r:"か",m:"fruit/result",rad:["木","田"],rm:["tree","field"],mn:"A field (田) in a tree (木) — fruit, result"},{k:"体",r:"たい",m:"body",rad:["人","本"],rm:["person","root"],mn:"A person at their root — the body, form"}],
    wm:"Pine-cone (松果) body (体) — the pineal gland looks like a tiny pine cone; it produces melatonin" },
  { id:"e06_03", ep:6, word:"仮説", reading:"かせつ", meaning:"hypothesis", tier:2,
    kb:[{k:"仮",r:"か",m:"temporary/supposed",rad:["人","叚"],rm:["person","borrow"],mn:"A borrowed person — temporary, supposed, hypothetical"},{k:"説",r:"せつ",m:"theory/explanation",rad:["言","兌"],rm:["words","exchange"],mn:"Words being exchanged — a theory, explanation"}],
    wm:"A supposed (仮) theory (説) — the doctor's 仮説 about Wen's condition is the episode's scientific hook" },

  // ── EP 07 ──
  { id:"e07_01", ep:7, word:"爆発物", reading:"ばくはつぶつ", meaning:"explosives", tier:1,
    kb:[{k:"爆",r:"ばく",m:"explode",rad:["火","暴"],rm:["fire","violent"],mn:"Fire (火) acting violently (暴) — to explode"},{k:"発",r:"はつ",m:"discharge/emit",rad:["癶","弓"],rm:["legs spread","bow"],mn:"A bow with legs spread launching — to discharge, emit, launch"},{k:"物",r:"ぶつ",m:"thing",rad:["牛","勿"],rm:["cow","do not"],mn:"A cow marked do not touch — a thing, an object"}],
    wm:"Things (物) that explode (爆発) — Decker's cargo is solid nitro, enough to destroy the whole asteroid" },
  { id:"e07_02", ep:7, word:"二日酔い", reading:"ふつかよい", meaning:"hangover", tier:2,
    kb:[{k:"二",r:"ふつ",m:"two",rad:["二"],rm:["two"],mn:"Two horizontal strokes — the number two"},{k:"日",r:"か",m:"day",rad:["日"],rm:["sun/day"],mn:"Pictograph of the sun — day"},{k:"酔",r:"よい",m:"drunk/intoxicated",rad:["酉","卒"],rm:["wine vessel","finish"],mn:"A wine vessel (酉) that finished (卒) you — drunk"}],
    wm:"Two (二) days (日) drunk (酔い) — the morning after, Spike is in rough shape throughout EP07" },
  { id:"e07_03", ep:7, word:"伝説", reading:"でんせつ", meaning:"legend", tier:2,
    kb:[{k:"伝",r:"でん",m:"transmit/legend",rad:["人","云"],rm:["person","say/cloud"],mn:"A person saying things that cloud into legend — to transmit, legendary"},{k:"説",r:"せつ",m:"story/theory",rad:["言","兌"],rm:["words","exchange"],mn:"Words being exchanged — a story, theory"}],
    wm:"A transmitted (伝) story (説) — Ural Terpsichore is 伝説の賞金稼ぎ. VT's husband is mythologized" },

  // ── EP 08 ──
  { id:"e08_01", ep:8, word:"金星病", reading:"きんせいびょう", meaning:"Venus disease (fictional)", tier:1,
    kb:[{k:"金",r:"きん",m:"gold/metal",rad:["人","土"],rm:["person","earth"],mn:"A person mining from the earth — gold, metal"},{k:"星",r:"せい",m:"star/planet",rad:["日","生"],rm:["sun","life"],mn:"A sun that gives life — a star"},{k:"病",r:"びょう",m:"disease/illness",rad:["疒","丙"],rm:["sickness radical","third"],mn:"Under the sickness radical — disease"}],
    wm:"Venus (金星) disease (病) — the terraforming flora causes blindness in some people like Stella" },
  { id:"e08_02", ep:8, word:"特効薬", reading:"とっこうやく", meaning:"specific remedy / cure", tier:2,
    kb:[{k:"特",r:"とっ",m:"special/particular",rad:["牛","寺"],rm:["cow","temple"],mn:"A cow at a temple — special, particular, unique"},{k:"効",r:"こう",m:"effect/work",rad:["交","力"],rm:["cross/mix","power"],mn:"Power crossing over — to be effective, to work"},{k:"薬",r:"やく",m:"medicine",rad:["艹","楽"],rm:["plant","comfort"],mn:"Plants that bring comfort — medicine"}],
    wm:"Specially effective (特効) medicine (薬) — the Grey Ash plant is Stella's only chance at vision" },
  { id:"e08_03", ep:8, word:"水のようになれ", reading:"みずのようになれ", meaning:"become like water", tier:3,
    kb:[], wm:"Spike's martial arts philosophy — water has no fixed form, flows around obstacles, adapts to any shape" },

  // ── EP 09 ──
  { id:"e09_01", ep:9, word:"人工衛星", reading:"じんこうえいせい", meaning:"artificial satellite", tier:1,
    kb:[{k:"人",r:"じん",m:"person",rad:["人"],rm:["person"],mn:"Pictograph of a person — the simplest human"},{k:"工",r:"こう",m:"made/artificial",rad:["工"],rm:["work/craft"],mn:"The character for work/craft — made by hand"},{k:"衛",r:"えい",m:"guard/protect",rad:["行","韋"],rm:["go","tanned hide"],mn:"Going around like a guard protecting — to surround, satellite"},{k:"星",r:"せい",m:"star",rad:["日","生"],rm:["sun","life"],mn:"A sun that gives life — a star, heavenly body"}],
    wm:"Artificially (人工) made protecting star (衛星) — the 'criminal' is actually a lonely AI satellite from before the gate disaster" },
  { id:"e09_02", ep:9, word:"孤独", reading:"こどく", meaning:"loneliness / isolation", tier:2,
    kb:[{k:"孤",r:"こ",m:"orphan/alone",rad:["子","瓜"],rm:["child","melon"],mn:"A child (子) with only a melon (瓜) — an orphan, alone"},{k:"独",r:"どく",m:"alone/sole",rad:["犭","蜀"],rm:["animal","silkworm"],mn:"An animal (犭) as solitary as a silkworm (蜀) — alone, sole"}],
    wm:"Both parts mean alone — profound isolation. The satellite acted out of 孤独: it just wanted a friend" },
  { id:"e09_03", ep:9, word:"人工知能", reading:"じんこうちのう", meaning:"artificial intelligence", tier:2,
    kb:[{k:"人",r:"じん",m:"person",rad:["人"],rm:["person"],mn:"Pictograph of a person"},{k:"工",r:"こう",m:"artificial",rad:["工"],rm:["work/craft"],mn:"Made by work/craft — artificial"},{k:"知",r:"ち",m:"know/wisdom",rad:["矢","口"],rm:["arrow","mouth"],mn:"An arrow from the mouth — to know, wisdom"},{k:"能",r:"のう",m:"ability/can",rad:["月","能"],rm:["moon/flesh","bear-like"],mn:"Bear-like ability — talent, capability"}],
    wm:"Artificial (人工) intelligence (知能) — 'Mpoo' is one of Bebop's most sympathetic characters" },

  // ── EP 10 ──
  { id:"e10_01", ep:10, word:"故郷", reading:"ふるさと", meaning:"hometown / homeland", tier:1,
    kb:[{k:"故",r:"ふる",m:"old/former",rad:["古","攴"],rm:["old","strike"],mn:"Striking something old — the former, the past, an old story"},{k:"郷",r:"さと",m:"hometown/village",rad:["良","阝"],rm:["good","town"],mn:"A good town — hometown, village, native place"}],
    wm:"Old (故) home town (郷) — Ganymede is Jet's 故郷, and the episode is about how time changes people there" },
  { id:"e10_02", ep:10, word:"正当防衛", reading:"せいとうぼうえい", meaning:"self-defense (legal)", tier:2,
    kb:[{k:"正",r:"せい",m:"correct/righteous",rad:["一","止"],rm:["one","stop"],mn:"Stopping at one — correct, righteous, proper"},{k:"当",r:"とう",m:"appropriate/this",rad:["当"],rm:["appropriate"],mn:"Something appropriate, hitting the mark"},{k:"防",r:"ぼう",m:"defend/prevent",rad:["阝","方"],rm:["town","direction"],mn:"Defending from a directional attack — to prevent, defend"},{k:"衛",r:"えい",m:"protect",rad:["行","韋"],rm:["go","guard"],mn:"Going around to protect — to guard, defend"}],
    wm:"Rightfully (正当) defending (防衛) oneself — how Lint's killing of the loan shark is ultimately classified" },
  { id:"e10_03", ep:10, word:"浪花節", reading:"なにわぶし", meaning:"old-fashioned sentimentality", tier:3,
    kb:[{k:"浪",r:"なに",m:"wave/wandering",rad:["氵","良"],rm:["water","good"],mn:"Good water flowing — waves, wandering, drifting"},{k:"花",r:"わ",m:"flower",rad:["艹","化"],rm:["plant","transform"],mn:"A plant transforming into beauty — a flower"},{k:"節",r:"ぶし",m:"melody/joint/season",rad:["竹","即"],rm:["bamboo","immediately"],mn:"Bamboo joints — a joint, segment, melody, season"}],
    wm:"Osaka ballad style — Faye teases Jet for being a 浪花節 romantic, stuck in old-fashioned sentiment" },

  // ── EP 11 ──
  { id:"e11_01", ep:11, word:"弱肉強食", reading:"じゃくにくきょうしょく", meaning:"survival of the fittest", tier:2,
    kb:[{k:"弱",r:"じゃく",m:"weak",rad:["弓","彡"],rm:["bow","decoration"],mn:"Two bows with decorations — weak, delicate"},{k:"肉",r:"にく",m:"meat/flesh",rad:["肉"],rm:["meat"],mn:"Pictograph of meat — flesh, the body"},{k:"強",r:"きょう",m:"strong",rad:["弓","虫"],rm:["bow","insect"],mn:"A bow-strong as an insect — strong, powerful"},{k:"食",r:"しょく",m:"eat",rad:["人","良"],rm:["person","good"],mn:"A good person eating — food, to eat"}],
    wm:"Weak (弱) flesh (肉) eaten by the strong (強食) — Faye's philosophy in this episode" },
  { id:"e11_02", ep:11, word:"教訓", reading:"きょうくん", meaning:"lesson / moral", tier:2,
    kb:[{k:"教",r:"きょう",m:"teach",rad:["孝","攴"],rm:["filial piety","strike"],mn:"Striking with filial piety — to teach"},{k:"訓",r:"くん",m:"instruction/reading",rad:["言","川"],rm:["words","river"],mn:"Words flowing like a river — instruction, training"}],
    wm:"Teaching (教) instruction (訓) — Jet keeps narrating the episode's 教訓 like a fable, then immediately ignores it" },
  { id:"e11_03", ep:11, word:"天罰", reading:"てんばつ", meaning:"divine punishment", tier:3,
    kb:[{k:"天",r:"てん",m:"heaven/sky",rad:["一","大"],rm:["one","big"],mn:"One big thing above — heaven, the sky"},{k:"罰",r:"ばつ",m:"punishment/penalty",rad:["罒","刀"],rm:["net","knife"],mn:"A knife under a net — punishment, penalty"}],
    wm:"Heaven's (天) punishment (罰) — Jet invokes this when people get what's coming to them" },

  // ── EP 12 ──
  { id:"e12_01", ep:12, word:"誇り", reading:"ほこり", meaning:"pride / honor", tier:1,
    kb:[{k:"誇",r:"ほこ(り)",m:"boast/pride",rad:["言","夸"],rm:["words","boast"],mn:"Words of boasting — pride, to boast"}],
    wm:"レッドドラゴンの誇りにかけて — Vicious dismisses 誇り as something to be discarded when convenient" },
  { id:"e12_02", ep:12, word:"制裁", reading:"せいさい", meaning:"sanction / punishment", tier:2,
    kb:[{k:"制",r:"せい",m:"control/system",rad:["刀","未"],rm:["knife","not yet"],mn:"A knife cutting back the unfinished — to control, regulate"},{k:"裁",r:"さい",m:"judge/cut",rad:["衣","才"],rm:["clothing","talent"],mn:"Talent in cutting clothing — to judge, decide, cut"}],
    wm:"万機を乱す者への制裁は誰であろうと下される — anyone who disrupts the organization faces 制裁" },
  { id:"e12_03", ep:12, word:"吐き気", reading:"はきけ", meaning:"nausea / disgust", tier:3,
    kb:[{k:"吐",r:"は(き)",m:"vomit/spit",rad:["口","土"],rm:["mouth","earth"],mn:"Earth coming from a mouth — to vomit, spit out"},{k:"気",r:"け",m:"feeling/energy",rad:["气","米"],rm:["steam","rice"],mn:"Steam rising from cooked rice — energy, spirit, feeling"}],
    wm:"古い考えだ 吐き気がする — Vicious says old loyalty makes him sick. A moment of pure character" },

  // ── EP 13 ──
  { id:"e13_01", ep:13, word:"同志", reading:"どうし", meaning:"comrade / ally", tier:1,
    kb:[{k:"同",r:"どう",m:"same/together",rad:["冂","口"],rm:["enclosure","mouth"],mn:"Mouths enclosed together — the same, together"},{k:"志",r:"し",m:"will/aspiration",rad:["士","心"],rm:["samurai","heart"],mn:"A samurai's heart — will, aspiration, purpose"}],
    wm:"タイタンでは誰もが同志だった — Gren's heartbroken line about what the word 同志 meant to him" },
  { id:"e13_02", ep:13, word:"足を洗う", reading:"あしをあらう", meaning:"to go straight / quit the underworld", tier:3,
    kb:[{k:"足",r:"あし",m:"foot/leg",rad:["足"],rm:["foot"],mn:"Pictograph of a foot/leg"},{k:"洗",r:"あら(う)",m:"wash",rad:["氵","先"],rm:["water","ahead/first"],mn:"Water flowing ahead — to wash, clean"}],
    wm:"Wash (洗う) the feet (足) — Spike says this when he imagines a life with Julia. Leaving the underworld behind" },
  { id:"e13_03", ep:13, word:"戦地", reading:"せんち", meaning:"battlefield / war zone", tier:2,
    kb:[{k:"戦",r:"せん",m:"war/battle",rad:["単","戈"],rm:["single","weapon"],mn:"A single weapon — war, battle"},{k:"地",r:"ち",m:"land/ground",rad:["土","也"],rm:["earth","also"],mn:"Earth that also is — land, ground, place"}],
    wm:"War (戦) land (地) — both Spike and Gren were on Titan. One survived with memories, one without" },

  // ── EP 14 ──
  { id:"e14_01", ep:14, word:"首謀者", reading:"しゅぼうしゃ", meaning:"mastermind / ringleader", tier:1,
    kb:[{k:"首",r:"しゅ",m:"head/leader",rad:["𠂉","自"],rm:["hair","self/face"],mn:"Hair above a face — head, leader"},{k:"謀",r:"ぼう",m:"scheme/plot",rad:["言","某"],rm:["words","certain person"],mn:"A certain person's words in secret — to scheme, plot"},{k:"者",r:"しゃ",m:"person",rad:["土","日"],rm:["earth","sun"],mn:"A person under sun and earth — a person (suffix)"}],
    wm:"The head (首) schemer (謀者) — the 20 arrested criminals are only 実行犯; the 首謀者 is the real target" },
  { id:"e14_02", ep:14, word:"欠陥", reading:"けっかん", meaning:"defect / fundamental flaw", tier:2,
    kb:[{k:"欠",r:"けっ",m:"lack/deficiency",rad:["欠"],rm:["lack"],mn:"Pictograph of a person with an open mouth — lack, deficiency"},{k:"陥",r:"かん",m:"fall into/trap",rad:["阝","臽"],rm:["hill","pitfall"],mn:"A pitfall by the hill — to fall into, a trap, defect"}],
    wm:"A lack (欠) that traps (陥) — the gate has a fundamental 欠陥 that Hex exploited to prove his point" },
  { id:"e14_03", ep:14, word:"亡霊", reading:"ぼうれい", meaning:"ghost / ghost of the past", tier:2,
    kb:[{k:"亡",r:"ぼう",m:"dead/lost",rad:["一","人"],rm:["one","person"],mn:"A person gone from under one — dead, lost"},{k:"霊",r:"れい",m:"spirit/soul",rad:["雨","巫"],rm:["rain","shaman"],mn:"Rain from a shaman — spiritual rain, a spirit/soul"}],
    wm:"50年前の亡霊 — Hex is described as a ghost from 50 years ago, still trying to deliver his message" },

  // ── EP 15 ──
  { id:"e15_01", ep:15, word:"コールドスリープ", reading:"kōrudo surīpu", meaning:"cryogenic sleep", tier:1,
    kb:[], wm:"From English 'cold sleep' — Faye has been frozen for 54 years, making her the oldest character on Bebop" },
  { id:"e15_02", ep:15, word:"記憶", reading:"きおく", meaning:"memory", tier:1,
    kb:[{k:"記",r:"き",m:"record/write down",rad:["言","己"],rm:["words","self"],mn:"Words about the self — to record, note down"},{k:"憶",r:"おく",m:"remember/recollect",rad:["忄","意"],rm:["heart","meaning"],mn:"The heart holding meaning — to remember, recollect"}],
    wm:"Recording (記) in the heart (憶) — Faye has no 記憶 of her past self; the young Faye on the tape is a stranger" },
  { id:"e15_03", ep:15, word:"利息", reading:"りそく", meaning:"interest (on a debt)", tier:2,
    kb:[{k:"利",r:"り",m:"profit/benefit",rad:["禾","刀"],rm:["grain","knife"],mn:"A knife harvesting grain — profit, benefit, advantage"},{k:"息",r:"そく",m:"breath/interest",rad:["自","心"],rm:["self/nose","heart"],mn:"The heart and the nose — breath, rest, interest (money)"}],
    wm:"54年分の利息 — the hospital charges 54 years of 利息 on top of the original medical bill. 3億ウーロン total" },

  // ── EP 16 ──
  { id:"e16_01", ep:16, word:"囚人", reading:"しゅうじん", meaning:"prisoner", tier:1,
    kb:[{k:"囚",r:"しゅう",m:"prisoner",rad:["囗","人"],rm:["enclosure","person"],mn:"A person (人) inside an enclosure (囗) — a prisoner, the symbol is literally a person in a box"},{k:"人",r:"じん",m:"person",rad:["人"],rm:["person"],mn:"Pictograph of a standing person"}],
    wm:"A person (人) enclosed (囚) — the transport ship is full of 囚人, and one of them may be the key to Jet's past" },
  { id:"e16_02", ep:16, word:"裏切り", reading:"うらぎり", meaning:"betrayal", tier:1,
    kb:[{k:"裏",r:"うら",m:"back/reverse",rad:["衣","里"],rm:["clothing","village"],mn:"The back side of clothing — the hidden reverse"},{k:"切",r:"ぎり",m:"cut/sever",rad:["七","刀"],rm:["seven","knife"],mn:"A knife cutting — to cut, sever"}],
    wm:"The cut (切) from behind (裏) — Fad shot Jet, not Udai. The truth about Jet's lost arm" },
  { id:"e16_03", ep:16, word:"時効", reading:"じこう", meaning:"statute of limitations", tier:2,
    kb:[{k:"時",r:"じ",m:"time",rad:["日","寺"],rm:["sun","temple"],mn:"Sun over a temple marking hours — time"},{k:"効",r:"こう",m:"effect/expire",rad:["交","力"],rm:["cross","power"],mn:"Power crossing over — to be effective, also: to expire"}],
    wm:"Time (時) expired (効) — Jet keeps invoking 時効 for old debts. Ironic given his past hasn't expired for him" },

  // ── EP 17 ──
  { id:"e17_01", ep:17, word:"違法", reading:"いほう", meaning:"illegal", tier:1,
    kb:[{k:"違",r:"い",m:"differ/violate",rad:["⻌","韋"],rm:["movement","tanned hide"],mn:"Moving against the grain of tanned hide — to differ, deviate, violate"},{k:"法",r:"ほう",m:"law",rad:["氵","去"],rm:["water","go away"],mn:"Water that flows away — law channels things in order"}],
    wm:"Violating (違) the law (法) — Domino Walker is a 違法キノコのブローカー, and his mushrooms are very special" },
  { id:"e17_02", ep:17, word:"賞味期限", reading:"しょうみきげん", meaning:"best before date", tier:2,
    kb:[{k:"賞",r:"しょう",m:"prize/enjoy",rad:["𠂉","貝"],rm:["award","shell/money"],mn:"Prize paid in shells — to enjoy, savor"},{k:"味",r:"み",m:"taste/flavor",rad:["口","未"],rm:["mouth","not yet"],mn:"A mouth not yet satisfied — taste, flavor"},{k:"期",r:"き",m:"period/deadline",rad:["月","其"],rm:["moon","that"],mn:"That moon-period — a set time, deadline"},{k:"限",r:"げん",m:"limit",rad:["阝","艮"],rm:["hill","stop"],mn:"A hill that stops you — limit, boundary"}],
    wm:"Savoring (賞味) until the deadline (期限) — Spike's food is 1年 past this. Still worth eating apparently" },
  { id:"e17_03", ep:17, word:"腸捻転", reading:"ちょうねんてん", meaning:"intestinal volvulus / twisted gut", tier:3,
    kb:[{k:"腸",r:"ちょう",m:"intestine",rad:["月","昜"],rm:["flesh","sun rising"],mn:"Flesh (月) with rising energy (昜) — the intestine, long coiled organ"},{k:"捻",r:"ねん",m:"twist/wring",rad:["扌","念"],rm:["hand","thought"],mn:"A hand twisting with thought — to twist, wring"},{k:"転",r:"てん",m:"roll/turn",rad:["車","云"],rm:["wheel","say/cloud"],mn:"A wheel turning and saying — to roll, turn"}],
    wm:"Domino's brother laughed so hard at the mushrooms he died of 腸捻転 — literally twisted his intestines from laughing" },

  // ── EP 18 ──
  { id:"e18_01", ep:18, word:"過去", reading:"かこ", meaning:"the past", tier:1,
    kb:[{k:"過",r:"か",m:"pass/go beyond",rad:["⻌","咼"],rm:["movement","distorted face"],mn:"Movement with a distorted face — to pass, go too far, exceed"},{k:"去",r:"こ",m:"leave/past",rad:["土","厶"],rm:["earth","private"],mn:"What privately left the earth — to leave, the past"}],
    wm:"What has passed (過) and left (去) — the entire episode is Faye discovering she has a 過去 she can't remember" },
  { id:"e18_02", ep:18, word:"着払い", reading:"ちゃくばらい", meaning:"cash on delivery (COD)", tier:2,
    kb:[{k:"着",r:"ちゃく",m:"arrive/wear",rad:["羊","目"],rm:["sheep","eye"],mn:"A sheep under the eye — to arrive, put on"},{k:"払",r:"ばらい",m:"pay/sweep away",rad:["扌","厂"],rm:["hand","cliff"],mn:"A hand sweeping off a cliff — to pay, sweep away"}],
    wm:"Pay (払い) on arrival (着) — the tape arrives COD twice. The universe keeps billing Faye" },
  { id:"e18_03", ep:18, word:"磁気", reading:"じき", meaning:"magnetism / magnetic", tier:2,
    kb:[{k:"磁",r:"じ",m:"magnet/porcelain",rad:["石","兹"],rm:["stone","this/multiply"],mn:"A multiplying stone — a magnet, porcelain"},{k:"気",r:"き",m:"energy/spirit",rad:["气","米"],rm:["steam","rice"],mn:"Steam rising from cooked rice — energy, spirit, feeling"}],
    wm:"Magnetic (磁) energy (気) — videotape stores information as 磁気 signals. The otaku explains this at length" },

  // ── EP 19 ──
  { id:"e19_01", ep:19, word:"海賊", reading:"かいぞく", meaning:"pirate / space pirate", tier:1,
    kb:[{k:"海",r:"かい",m:"sea/ocean",rad:["氵","母"],rm:["water","mother"],mn:"Water as mother — the sea, ocean"},{k:"賊",r:"ぞく",m:"bandit/pirate",rad:["貝","戈"],rm:["shell/money","weapon"],mn:"A weapon against money/shells — a bandit, pirate"}],
    wm:"Sea (海) bandit (賊) — the 自称海賊 hit ships and steal cargo. Faye is used as bait" },
  { id:"e19_02", ep:19, word:"大気圏", reading:"たいきけん", meaning:"atmosphere", tier:2,
    kb:[{k:"大",r:"たい",m:"big/great",rad:["大"],rm:["big"],mn:"A person with arms spread wide — big, great"},{k:"気",r:"き",m:"air/energy",rad:["气","米"],rm:["steam","rice"],mn:"Steam rising from cooked rice — air, energy, atmosphere"},{k:"圏",r:"けん",m:"sphere/zone",rad:["囗","卷"],rm:["enclosure","roll"],mn:"An enclosed rolling sphere — a zone, sphere, orbit"}],
    wm:"The great (大) air (気) sphere (圏) — Spike must reenter the 大気圏 at the exact right angle or burn up" },
  { id:"e19_03", ep:19, word:"腐れ縁", reading:"くされえん", meaning:"an inescapable bond", tier:3,
    kb:[{k:"腐",r:"くさ(れ)",m:"rot/decay",rad:["月","府"],rm:["flesh","storehouse"],mn:"Flesh rotting in a storehouse — to rot, decay"},{k:"縁",r:"えん",m:"fate/bond/edge",rad:["糸","彖"],rm:["thread","edge"],mn:"A thread at the edge — fate, bond, connection"}],
    wm:"A rotten (腐れ) bond (縁) — Doohan's relationship with the Swordfish. You can't shake it even if you want to" },

  // ── EP 20 ──
  { id:"e20_01", ep:20, word:"殺し屋", reading:"ころしや", meaning:"assassin / hitman", tier:1,
    kb:[{k:"殺",r:"ころ(し)",m:"kill",rad:["木","殳"],rm:["tree","weapon"],mn:"A weapon against a tree — to kill, destroy"},{k:"屋",r:"や",m:"roof/person/shop",rad:["尸","至"],rm:["corpse/roof","arrive"],mn:"Something arriving under a roof — a shop, person who does something"}],
    wm:"The person (屋) who kills (殺し) — Tongpu is called 幻の殺し屋 東風, the phantom assassin" },
  { id:"e20_02", ep:20, word:"極秘", reading:"ごくひ", meaning:"top secret", tier:2,
    kb:[{k:"極",r:"ごく",m:"extreme/pole",rad:["木","極"],rm:["tree","extreme"],mn:"A tree at its most extreme — the pole, extreme, utmost"},{k:"秘",r:"ひ",m:"secret/hidden",rad:["禾","必"],rm:["grain","must"],mn:"Must (必) be like grain (禾) — hidden away like grain in storage, secret"}],
    wm:"Extremely (極) secret (秘) — the ISSP keeps Tongpu's existence 極秘. Seven VIPs have already died" },
  { id:"e20_03", ep:20, word:"退行現象", reading:"たいこうげんしょう", meaning:"regression phenomenon", tier:2,
    kb:[{k:"退",r:"たい",m:"retreat/regress",rad:["⻌","艮"],rm:["movement","stop"],mn:"Movement that stops — to retreat, regress, go back"},{k:"行",r:"こう",m:"go/conduct",rad:["行"],rm:["go"],mn:"Pictograph of a crossroads — to go, conduct"},{k:"現",r:"げん",m:"appear/present",rad:["王","見"],rm:["king","see"],mn:"A king seen — to appear, present"},{k:"象",r:"しょう",m:"phenomenon/elephant",rad:["豕","刀"],rm:["pig","knife"],mn:"An elephant-like shape — phenomenon, symbol"}],
    wm:"The experiment caused Tongpu's mental 退行現象 — he regressed to a child's mind while gaining superhuman power" },

  // ── EP 21 ──
  { id:"e21_01", ep:21, word:"風水", reading:"ふうすい", meaning:"feng shui", tier:1,
    kb:[{k:"風",r:"ふう",m:"wind",rad:["几","虫"],rm:["table","insect"],mn:"An insect on a table blown by wind — wind, style, manner"},{k:"水",r:"すい",m:"water",rad:["水"],rm:["water"],mn:"Pictograph of flowing water — water"}],
    wm:"Wind (風) and water (水) — the ancient Chinese art of aligning living spaces with natural energy flows" },
  { id:"e21_02", ep:21, word:"隠し子", reading:"かくしご", meaning:"illegitimate / hidden child", tier:3,
    kb:[{k:"隠",r:"かく(し)",m:"hide/conceal",rad:["阝","隐"],rm:["hill","hidden"],mn:"Hidden behind a hill — to conceal, hide"},{k:"子",r:"ご",m:"child",rad:["子"],rm:["child"],mn:"Pictograph of a child — child"}],
    wm:"Spike and Faye repeatedly joke that Meifa is Jet's 隠し子 — running gag of the episode" },
  { id:"e21_03", ep:21, word:"磁場", reading:"じば", meaning:"magnetic field", tier:2,
    kb:[{k:"磁",r:"じ",m:"magnetic",rad:["石","兹"],rm:["stone","multiply"],mn:"A multiplying stone — a magnet"},{k:"場",r:"ば",m:"field/place",rad:["土","昜"],rm:["earth","sun rising"],mn:"Earth where the sun rises — a place, field"}],
    wm:"Magnetic (磁) field (場) — the sun stone disrupts the compass, pointing toward Pao's location" },

  // ── EP 22 ──
  { id:"e22_01", ep:22, word:"爆破", reading:"ばくは", meaning:"bombing / blowing up", tier:1,
    kb:[{k:"爆",r:"ばく",m:"explode",rad:["火","暴"],rm:["fire","violent"],mn:"Fire acting violently — to explode"},{k:"破",r:"は",m:"destroy/break",rad:["石","皮"],rm:["stone","skin"],mn:"A stone splitting skin — to break, destroy"}],
    wm:"Explosive (爆) destruction (破) — Teddy Bomber keeps 爆破ing buildings to make a philosophical point nobody hears" },
  { id:"e22_02", ep:22, word:"同族嫌悪", reading:"どうぞくけんお", meaning:"dislike of those like yourself", tier:2,
    kb:[{k:"同",r:"どう",m:"same",rad:["冂","口"],rm:["enclosure","mouth"],mn:"Mouths enclosed together — same, together"},{k:"族",r:"ぞく",m:"tribe/kind",rad:["方","矢"],rm:["direction","arrow"],mn:"Arrows in a direction together — tribe, kind, group"},{k:"嫌",r:"けん",m:"dislike",rad:["女","兼"],rm:["woman","double/combine"],mn:"A woman combined with two things — dislike, suspect"},{k:"悪",r:"お",m:"hatred",rad:["亜","心"],rm:["second/ugly","heart"],mn:"An ugly heart — evil, hatred, dislike"}],
    wm:"Disliking (嫌悪) your own kind (同族) — why Spike and Andy clash so violently. They're too similar" },
  { id:"e22_03", ep:22, word:"御曹司", reading:"おんぞうし", meaning:"son of a wealthy family", tier:3,
    kb:[{k:"御",r:"おん",m:"honorable/control",rad:["彳","卸"],rm:["step","unload"],mn:"Controlling one's steps — honorable, to control"},{k:"曹",r:"ぞう",m:"officer/group",rad:["日","曰"],rm:["sun","say"],mn:"The sun saying things in groups — officers, a group"},{k:"司",r:"し",m:"manage/director",rad:["口","司"],rm:["mouth","manage"],mn:"A mouth managing — to manage, director"}],
    wm:"Andy is オニヤテ牧場の御曹司 — a rich rancher's son playing cowboy, which is everything Spike finds insufferable" },

  // ── EP 23 ──
  { id:"e23_01", ep:23, word:"宗教", reading:"しゅうきょう", meaning:"religion", tier:1,
    kb:[{k:"宗",r:"しゅう",m:"religion/sect",rad:["宀","示"],rm:["roof","show/altar"],mn:"An altar under a roof — religion, sect, ancestor"},{k:"教",r:"きょう",m:"teach/doctrine",rad:["孝","攴"],rm:["filial piety","strike"],mn:"Striking with filial piety — to teach, doctrine"}],
    wm:"Sect (宗) doctrine (教) — Scratch is a fake 宗教 using brain wave control to harvest its members' data" },
  { id:"e23_02", ep:23, word:"脳波", reading:"のうは", meaning:"brain waves", tier:1,
    kb:[{k:"脳",r:"のう",m:"brain",rad:["月","匘"],rm:["flesh","brain shape"],mn:"Flesh in a brain shape — the brain"},{k:"波",r:"は",m:"wave",rad:["氵","皮"],rm:["water","skin"],mn:"Water rippling like skin — a wave"}],
    wm:"Brain (脳) waves (波) — the ブレインドリーム game device reads 脳波 to copy the user's mind" },
  { id:"e23_03", ep:23, word:"植物状態", reading:"しょくぶつじょうたい", meaning:"vegetative state", tier:2,
    kb:[{k:"植",r:"しょく",m:"plant/cultivate",rad:["木","直"],rm:["tree","straight"],mn:"A straight tree — to plant, cultivate"},{k:"物",r:"ぶつ",m:"thing/being",rad:["牛","勿"],rm:["cow","do not"],mn:"A cow marked do not touch — a thing, being"},{k:"状",r:"じょう",m:"state/condition",rad:["犭","爿"],rm:["animal","plank"],mn:"An animal on a plank — a state, condition, letter"},{k:"態",r:"たい",m:"appearance/form",rad:["能","心"],rm:["ability","heart"],mn:"Heart with ability — appearance, form, attitude"}],
    wm:"Plant (植物) state (状態) — 13-year-old Ronnie Spangle has been in a 植物状態 for 2 years; 'Londes' is his dream" },

  // ── EP 24 ──
  { id:"e24_01", ep:24, word:"記憶", reading:"きおく", meaning:"memory", tier:1,
    kb:[{k:"記",r:"き",m:"record",rad:["言","己"],rm:["words","self"],mn:"Words about the self — to record, note down"},{k:"憶",r:"おく",m:"remember",rad:["忄","意"],rm:["heart","meaning"],mn:"The heart holding meaning — to remember"}],
    wm:"Faye's memories return in this episode — she visits her old house and meets an aged classmate" },
  { id:"e24_02", ep:24, word:"居場所", reading:"いばしょ", meaning:"one's place / where one belongs", tier:2,
    kb:[{k:"居",r:"い(ば)",m:"be/stay",rad:["尸","古"],rm:["corpse/shelter","old"],mn:"Staying under an old shelter — to be, to stay, to reside"},{k:"場",r:"しょ",m:"place",rad:["土","昜"],rm:["earth","sun rising"],mn:"Earth where the sun rises — a place, location"},{k:"所",r:"しょ",m:"place/location",rad:["户","斤"],rm:["door","axe"],mn:"An axe by a door — a place, location"}],
    wm:"The place (場所) where you are (居る) — Faye realizes the Bebop is her 居場所. Then Ed leaves" },
  { id:"e24_03", ep:24, word:"父親", reading:"ちちおや", meaning:"father", tier:2,
    kb:[{k:"父",r:"ちち",m:"father",rad:["父"],rm:["father"],mn:"Pictograph of a hand holding a stick — a father, who traditionally worked and disciplined"},{k:"親",r:"おや",m:"parent",rad:["立","木","見"],rm:["stand","tree","see"],mn:"Standing by a tree watching — a parent"}],
    wm:"Ed's 父親 finally appears — he forgot he left Ed at daycare 7 years ago. Ed chooses to go with him" },

  // ── EP 25 ──
  { id:"e25_01", ep:25, word:"クーデター", reading:"kūdetā", meaning:"coup d'état", tier:1,
    kb:[], wm:"From French — Vicious's failed 組織 takeover. When it fails, the elders sentence him to death" },
  { id:"e25_02", ep:25, word:"長老", reading:"ちょうろう", meaning:"elders / the council", tier:1,
    kb:[{k:"長",r:"ちょう",m:"long/senior",rad:["長"],rm:["long/senior"],mn:"Pictograph of long hair — long, senior, chief"},{k:"老",r:"ろう",m:"old/elder",rad:["老"],rm:["old"],mn:"Pictograph of a bent old person with a cane — old, elder"}],
    wm:"The senior (長) elders (老) — the shadowy council that runs Red Dragon. They sentence both Vicious and Spike" },
  { id:"e25_03", ep:25, word:"処刑", reading:"しょけい", meaning:"execution", tier:2,
    kb:[{k:"処",r:"しょ",m:"deal with/place",rad:["几","夂"],rm:["table","go slowly"],mn:"Slowly going to the table — to deal with, process"},{k:"刑",r:"けい",m:"punishment/penalty",rad:["开","刀"],rm:["open","knife"],mn:"A knife opening — punishment, penalty, sentence"}],
    wm:"Dealing out (処) punishment (刑) — ビシャスは処刑されます. The coup failed; the elders want him dead" },
  { id:"e25_04", ep:25, word:"傲慢", reading:"ごうまん", meaning:"arrogance", tier:2,
    kb:[{k:"傲",r:"ごう",m:"proud/haughty",rad:["人","敖"],rm:["person","proud wandering"],mn:"A person wandering proudly — haughty, arrogant"},{k:"慢",r:"まん",m:"slow/arrogant",rad:["忄","曼"],rm:["heart","spread out"],mn:"A heart spread out lazily — slow, neglectful, arrogant"}],
    wm:"おまえのその傲慢さはやがて全てを滅ぼす — the elders' diagnosis of Vicious. His pride will destroy everything" },

  // ── EP 26 ──
  { id:"e26_01", ep:26, word:"片割れ", reading:"かたわれ", meaning:"other half / missing piece", tier:1,
    kb:[{k:"片",r:"かた",m:"one side/fragment",rad:["片"],rm:["one side"],mn:"Half of a plank split down the middle — one side, a fragment"},{k:"割",r:"わ(れ)",m:"split/divide",rad:["害","刀"],rm:["harm","knife"],mn:"A knife that harms by splitting — to divide, split"}],
    wm:"俺が欲しかった俺のかけら — Spike describes Julia as his 片割れ, the missing fragment of himself" },
  { id:"e26_02", ep:26, word:"野良猫", reading:"のらねこ", meaning:"stray cat", tier:2,
    kb:[{k:"野",r:"の(ら)",m:"wild/field",rad:["里","予"],rm:["village","beforehand"],mn:"Beyond the village — wild field, unrefined"},{k:"良",r:"ら",m:"good/proper",rad:["良"],rm:["good"],mn:"Something that is good and well-made — good, fine"},{k:"猫",r:"ねこ",m:"cat",rad:["犭","苗"],rm:["animal","seedling"],mn:"An animal like a seedling — a cat (slender and delicate)"}],
    wm:"わしはただ迷い込んだ野良猫を手当てしてるだけだ — the bar owner's cover story for hiding Spike" },
  { id:"e26_03", ep:26, word:"確かめに行く", reading:"たしかめにいく", meaning:"going to make sure / verify", tier:3,
    kb:[{k:"確",r:"たし(か)",m:"certain/confirm",rad:["石","隺"],rm:["stone","crane"],mn:"A crane standing on stone — solid, certain, confirmed"}],
    wm:"死にに行くわけじゃない — 俺が本当に生きてるかどうか確かめに行くんだ. Spike's final answer to Faye" },
  { id:"e26_04", ep:26, word:"覚めない夢", reading:"さめないゆめ", meaning:"a dream you can't wake from", tier:3,
    kb:[{k:"覚",r:"さ(め)",m:"wake up/realize",rad:["学","見"],rm:["study","see"],mn:"Seeing through study — to wake up, realize, become aware"},{k:"夢",r:"ゆめ",m:"dream",rad:["艹","夕","冖"],rm:["plants","evening","cover"],mn:"Plants covered in evening mist — a dream"}],
    wm:"Spike's defining phrase throughout the series — finally, at the end, he says: いつの間にか覚めちまってた" },

  // ── MOVIE ──
  { id:"mv_01", ep:27, word:"ナノマシン", reading:"nano mashin", meaning:"nanomachines", tier:1,
    kb:[], wm:"The invisible weapon — billions of tiny machines that look like blood cells, replicate in the body, and destroy the brain" },
  { id:"mv_02", ep:27, word:"煉獄", reading:"れんごく", meaning:"purgatory", tier:1,
    kb:[{k:"煉",r:"れん",m:"refine/smelt",rad:["火","柬"],rm:["fire","select/east"],mn:"Fire selecting and refining — to smelt, refine, purify through pain"},{k:"獄",r:"ごく",m:"prison/hell",rad:["犭","言","犭"],rm:["animal","words","animal"],mn:"Animals on both sides of words — a prison, a place of judgment"}],
    wm:"Vincent's word for this world — the place between heaven and hell where souls suffer. The movie's true theme" },
  { id:"mv_03", ep:27, word:"ワクチン", reading:"wakuchin", meaning:"vaccine", tier:1,
    kb:[], wm:"From Dutch 'vaccin' — Electra unknowingly carries the cure in her own bloodstream after contact with Vincent" },
  { id:"mv_04", ep:27, word:"自己増殖", reading:"じこぞうしょく", meaning:"self-replication", tier:2,
    kb:[{k:"自",r:"じ",m:"self",rad:["自"],rm:["self"],mn:"Pictograph of a nose — the self (pointing to one's own nose)"},{k:"己",r:"こ",m:"self/oneself",rad:["己"],rm:["self"],mn:"A coiled form — the self, oneself"},{k:"増",r:"ぞう",m:"increase",rad:["土","曾"],rm:["earth","formerly/layer"],mn:"Earth layering up — to increase, multiply"},{k:"殖",r:"しょく",m:"multiply/breed",rad:["月","直"],rm:["flesh","straight"],mn:"Flesh growing straight and multiplying — to breed, multiply"}],
    wm:"The nanomachines 自己増殖 in the bloodstream — without a counter-agent, they will spread to everyone" },
  { id:"mv_05", ep:27, word:"扉", reading:"とびら", meaning:"door / gate / threshold", tier:2,
    kb:[{k:"扉",r:"とびら",m:"door/gate",rad:["户","非"],rm:["door","not/opposite"],mn:"A door that is not just a door — a double door, a gate, a threshold between worlds"}],
    wm:"Vincent has been searching for a 扉 out of this world since Titan — only to realize there is none" },
  { id:"mv_06", ep:27, word:"記憶喪失", reading:"きおくそうしつ", meaning:"amnesia / memory loss", tier:2,
    kb:[{k:"記",r:"き",m:"record",rad:["言","己"],rm:["words","self"],mn:"Words about the self — to record"},{k:"憶",r:"おく",m:"remember",rad:["忄","意"],rm:["heart","meaning"],mn:"The heart holding meaning — to remember"},{k:"喪",r:"そう",m:"lose/mourn",rad:["哭","衣"],rm:["wailing","clothing"],mn:"Wailing in mourning clothes — to lose, to mourn"},{k:"失",r:"しつ",m:"lose",rad:["手","乙"],rm:["hand","twisting"],mn:"Something twisting out of a hand — to lose"}],
    wm:"Vincent lost his 記憶 on Titan — he can't tell dreams from reality because his past self simply isn't there" },
  { id:"mv_07", ep:27, word:"この世の果て", reading:"このよのはて", meaning:"the end of this world / edge of everything", tier:3,
    kb:[{k:"果",r:"は(て)",m:"end/result/fruit",rad:["木","田"],rm:["tree","field"],mn:"A field in a tree — fruit, result, the end"},{k:"世",r:"よ",m:"world/generation",rad:["廿","乙"],rm:["twenty","second"],mn:"Generations passing — world, generation"}],
    wm:"この世の果てで会おう — Vincent's farewell to Spike. The movie ends there, at the edge of everything" }
];

const TIER_LABELS = {1:"CORE",2:"SITUATIONAL",3:"SLANG/IDIOM"};
const TIER_COLORS = {1:"#e8412a",2:"#e8a22a",3:"#7c4de8"};
const STORAGE_KEY = "bebop_srs_v2";
const READINESS_THRESHOLD = 1;
const UNLOCK_THRESHOLD = 70;

// ── SRS ──────────────────────────────────────────────────────────────
function sm2(card, quality) {
  let {interval=1,repetitions=0,easeFactor=2.5} = card;
  if (quality < 2) { repetitions=0; interval=0; }
  else {
    if (repetitions===0) interval=1;
    else if (repetitions===1) interval=6;
    else interval=Math.round(interval*easeFactor);
    repetitions+=1;
  }
  easeFactor=Math.max(1.3,easeFactor+0.1-(3-quality)*(0.08+(3-quality)*0.02));
  return {interval,repetitions,easeFactor,nextReview:Date.now()+interval*86400000};
}

// Flip cards due: no progress yet, or interval=0 (failed), or past nextReview
function getFlipDue(vocab, progress) {
  const now=Date.now();
  return vocab.filter(v=>{ const p=progress[v.id]; return !p||p.interval===0||p.nextReview<=now; });
}

// Fill-in cards due: flip must have interval>=1 first, then fill follows same SRS rule
function getFillDue(vocab, progress) {
  const now=Date.now();
  return vocab.filter(v=>{
    if(!v.ex||v.ex.length===0) return false;
    const flipP=progress[v.id];
    if(!flipP||flipP.interval<1) return false; // flip card not seen yet
    const fillId=v.id+"_fill";
    const fillP=progress[fillId];
    return !fillP||fillP.interval===0||fillP.nextReview<=now;
  });
}

// Build a session queue: flip cards first, then fill-in cards for unlocked words
// Fill cards are tagged with _isFill:true so the UI knows which mode to render
function buildQueue(vocab, progress) {
  const flipDue = getFlipDue(vocab, progress);
  const fillDue = getFillDue(vocab, progress).map(v=>({
    ...v,
    _isFill: true,
    _fillId: v.id+"_fill",
  }));
  // Flip cards sorted: new first, then by nextReview
  flipDue.sort((a,b)=>{
    const pa=progress[a.id], pb=progress[b.id];
    if(!pa&&pb) return -1; if(pa&&!pb) return 1; if(!pa&&!pb) return 0;
    return pa.nextReview-pb.nextReview;
  });
  // Fill cards sorted similarly by their fill progress
  fillDue.sort((a,b)=>{
    const pa=progress[a._fillId], pb=progress[b._fillId];
    if(!pa&&pb) return -1; if(pa&&!pb) return 1; if(!pa&&!pb) return 0;
    return pa.nextReview-pb.nextReview;
  });
  return [...flipDue, ...fillDue];
}

// A word is "ready" only when BOTH flip AND fill-in have interval >= threshold
function getEpReadiness(epId, progress) {
  const epVocab = VOCAB.filter(v=>v.ep===epId);
  if (!epVocab.length) return 0;
  const ready = epVocab.filter(v=>{
    const flipOk = progress[v.id]?.interval>=READINESS_THRESHOLD;
    const fillOk = progress[v.id+"_fill"]?.interval>=READINESS_THRESHOLD;
    return flipOk && fillOk;
  }).length;
  return Math.round((ready/epVocab.length)*100);
}

function isEpUnlocked(epId, progress) {
  if (epId === 1) return true;
  const prevId = epId === 27 ? 26 : epId - 1;
  return getEpReadiness(prevId, progress) >= UNLOCK_THRESHOLD;
}

// Pick which example sentence to show for fill-in — rotates by review count
function pickFillExample(vocab, progress) {
  const fillP = progress[vocab.id+"_fill"];
  const count = fillP?.repetitions||0;
  return vocab.ex[count % vocab.ex.length];
}

// Split a Japanese sentence around the target word to create the blank
// Returns { before, target, after } or null if word not found in sentence
function splitSentence(sentence, word, reading) {
  // 1. Exact match — dictionary form kanji
  let idx = sentence.indexOf(word);
  if(idx !== -1) return { before:sentence.slice(0,idx), target:word, after:sentence.slice(idx+word.length) };
  // 2. Exact match — reading (hiragana)
  idx = sentence.indexOf(reading);
  if(idx !== -1) return { before:sentence.slice(0,idx), target:reading, after:sentence.slice(idx+reading.length) };
  // 3. Stem match — handles conjugated forms (逃げる→逃げ, 掘る→掘, 壊す→壊)
  const particles = "をにはがもでとへのからまでよねわぞぜかなだ。、！？「」（）…";
  const tryStems = [word, reading].flatMap(s => [s.slice(0,-1), s.slice(0,-2)]).filter(s=>s.length>0);
  for(const stem of tryStems){
    idx = sentence.indexOf(stem);
    if(idx !== -1){
      let end = idx + stem.length;
      while(end < sentence.length && !particles.includes(sentence[end])) end++;
      return { before:sentence.slice(0,idx), target:sentence.slice(idx,end), after:sentence.slice(end) };
    }
  }
  return null;
}

// Extract all English keywords from meaning to try matching in the sentence
function findEnglishTargets(meaning) {
  const segments = meaning.split("/")
    .map(s=>s.replace(/^[\s~〜（）()]+/,"").replace(/[~〜（）()]+$/,"").replace(/^to\s+/i,"").trim())
    .filter(s=>s.length>2);
  const words = segments.flatMap(s=>s.split(/\s+/))
    .filter(w=>w.length>3 && !/^(the|and|one|that|this|with|from|into|also|just|ones)$/i.test(w));
  // Add common irregular past/conjugated forms
  const conjugated = words.flatMap(w=>{
    const forms = [w];
    if(w.match(/e$/i)) forms.push(w.slice(0,-1)+"ed",w.slice(0,-1)+"ing"); // escape→escaped
    else if(w.match(/[^aeiou]$/i)) forms.push(w+"ed",w+"ing",w+"s",w+w.slice(-1)+"ed"); // break→broke handled below
    // Common irregulars
    const irreg = {break:"broke",give:"gave",run:"ran",flee:"fled",catch:"caught",
                   take:"took",make:"made",come:"came",go:"went",get:"got",lose:"lost",
                   find:"found",leave:"left",bring:"brought",think:"thought",know:"knew",
                   see:"saw",say:"said",tell:"told",become:"became",put:"put",use:"used"};
    if(irreg[w.toLowerCase()]) forms.push(irreg[w.toLowerCase()]);
    return forms;
  });
  return [...new Set([...segments,...words,...conjugated])].sort((a,b)=>b.length-a.length);
}

// Normalise answer: trim whitespace, lowercase for comparison
function normaliseAnswer(s) { return s.trim().replace(/\s+/g,""); }

// Text-to-speech — speaks Japanese text using device's built-in TTS
function speak(text) {
  if(!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

export default function App() {
  const [progress,setProgress]=useState({});
  const [queue,setQueue]=useState([]);
  const [qIdx,setQIdx]=useState(0);
  const [flipped,setFlipped]=useState(false);
  const [mode,setMode]=useState("home");
  const [studyEp,setStudyEp]=useState(null);
  const [session,setSession]=useState({reviewed:0,correct:0});
  const [loading,setLoading]=useState(true);
  const [saveMsg,setSaveMsg]=useState("");
  const [expandedKanji,setExpandedKanji]=useState(null);
  const [filterTier,setFilterTier]=useState(0);
  // Fill-in state
  const [fillInput,setFillInput]=useState("");
  const [fillChecked,setFillChecked]=useState(false); // true after user submits answer
  const [fillCorrect,setFillCorrect]=useState(false);

  useEffect(()=>{
    const r=storage.get(STORAGE_KEY);
    if(r){ try{ setProgress(JSON.parse(r.value)); }catch(e){} }
    setLoading(false);
  },[]);

  const save=useCallback((np)=>{
    storage.set(STORAGE_KEY,JSON.stringify(np));
    setSaveMsg("✓"); setTimeout(()=>setSaveMsg(""),1200);
  },[]);

  const getStudyVocab = useCallback((epId, tier)=>{
    let v = epId ? VOCAB.filter(x=>x.ep===epId) : VOCAB;
    if(tier) v = v.filter(x=>x.tier===tier);
    return v;
  },[]);

  const currentCard = queue[qIdx] || null;

  const startStudy = (epId)=>{
    const vocab = getStudyVocab(epId, filterTier||null);
    const q = buildQueue(vocab, progress);
    setQueue(q);
    setQIdx(0);
    setFlipped(false); setExpandedKanji(null);
    setFillInput(""); setFillChecked(false); setFillCorrect(false);
    setSession({reviewed:0,correct:0});
    setStudyEp(epId);
    setMode("study");
  };

  const advanceQueue = (np) => {
    setFlipped(false); setExpandedKanji(null);
    setFillInput(""); setFillChecked(false); setFillCorrect(false);
    // Rebuild queue from current position: keep remaining items, re-add failed ones at end
    const vocab = getStudyVocab(studyEp, filterTier||null);
    const newQ = buildQueue(vocab, np);
    setQueue(newQ);
    setQIdx(0);
  };

  // Answer a FLIP card
  const answerFlip=(quality)=>{
    if(!currentCard||currentCard._isFill) return;
    const updated=sm2(progress[currentCard.id]||{},quality);
    const np={...progress,[currentCard.id]:{...updated}};
    setProgress(np); save(np);
    setSession(s=>({reviewed:s.reviewed+1,correct:s.correct+(quality>=2?1:0)}));
    advanceQueue(np);
  };

  // Check a FILL-IN answer (called when user submits)
  const checkFill=()=>{
    if(!currentCard||!currentCard._isFill) return;
    const ex = pickFillExample(currentCard, progress);
    const correct = normaliseAnswer(fillInput)===normaliseAnswer(currentCard.word)
                 || normaliseAnswer(fillInput)===normaliseAnswer(currentCard.reading);
    setFillCorrect(correct);
    setFillChecked(true);
  };

  // Grade a FILL-IN card after answer is shown
  const answerFill=(quality)=>{
    if(!currentCard||!currentCard._isFill) return;
    const fillId = currentCard._fillId;
    const updated=sm2(progress[fillId]||{},quality);
    const np={...progress,[fillId]:{...updated}};
    setProgress(np); save(np);
    setSession(s=>({reviewed:s.reviewed+1,correct:s.correct+(quality>=2?1:0)}));
    advanceQueue(np);
  };

  const nextInt=(quality, isFill)=>{
    if(!currentCard) return "";
    const id = isFill ? currentCard._fillId : currentCard.id;
    const {interval}=sm2(progress[id]||{},quality);
    return interval===1?"<1d":`+${interval}d`;
  };

  const globalFlipDue = getFlipDue(VOCAB, progress).length;
  const globalFillDue = getFillDue(VOCAB, progress).length;
  const globalDue = globalFlipDue + globalFillDue;
  const globalStudied = VOCAB.filter(v=>progress[v.id]).length;

  if(loading) return(
    <div style={{minHeight:"100vh",background:"#070707",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{color:"#e8412a",fontFamily:"monospace",fontSize:14,letterSpacing:6}}>読み込み中…</span>
    </div>
  );

  // Fill-in card rendering helpers
  const renderFillCard = () => {
    if(!currentCard||!currentCard._isFill) return null;
    const ex = pickFillExample(currentCard, progress);
    const split = splitSentence(ex.j, currentCard.word, currentCard.reading);
    const tc = TIER_COLORS[currentCard.tier];
    return (
      <div style={{...S.face,position:"relative",minHeight:280,justifyContent:"flex-start",paddingTop:20,background:"#0c0c0c",border:"1px solid #141414"}}>
        <div style={{...S.tierStripe,background:tc}}/>
        {/* Type badge */}
        <div style={{fontSize:7,letterSpacing:3,fontFamily:"monospace",color:tc,marginBottom:12,alignSelf:"flex-start"}}>FILL-IN</div>
        {/* English sentence — highlight the English equivalent of the target word */}
        <div style={{fontSize:13,color:"#999",lineHeight:1.7,marginBottom:16,width:"100%",textAlign:"left"}}>
          {(()=>{
            const eng = ex.e;
            // Use explicit enTarget if set on the vocab entry, else derive from meaning
            const targets = currentCard.enTarget
              ? [currentCard.enTarget, ...findEnglishTargets(currentCard.meaning)]
              : findEnglishTargets(currentCard.meaning);
            // Try each meaning segment until one matches in the sentence
            for(const target of targets){
              const escaped = target.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
              const re = new RegExp("("+escaped+")","i");
              const parts = eng.split(re);
              if(parts.length>1){
                return parts.map((p,i)=>
                  re.test(p)
                    ? <span key={i} style={{color:tc,fontWeight:700,borderBottom:`2px solid ${tc}`,padding:"0 2px",background:`${tc}18`}}>{p}</span>
                    : <span key={i}>{p}</span>
                );
              }
            }
            // Fallback: no match found, show full English sentence
            return <span>{eng}</span>;
          })()}
        </div>
        {/* Japanese sentence with blank */}
        <div style={{fontSize:18,lineHeight:2,marginBottom:16,width:"100%",textAlign:"left",letterSpacing:1}}>
          {split ? (
            <>
              <span style={{color:"#ccc"}}>{split.before}</span>
              <span style={{
                color:fillChecked?(fillCorrect?"#4de89a":"#e8412a"):tc,
                borderBottom:`2px solid ${fillChecked?(fillCorrect?"#4de89a":"#e8412a"):tc}`,
                minWidth:40,display:"inline-block",textAlign:"center",
                padding:"0 4px",background:`${tc}10`
              }}>
                {fillChecked ? split.target : "＿＿＿"}
              </span>
              <span style={{color:"#ccc"}}>{split.after}</span>
            </>
          ):(
            <span style={{color:"#555",fontSize:12}}>（文中に見つかりません — {ex.j}）</span>
          )}
        </div>
        {/* Input field — only shown before checking */}
        {!fillChecked&&(
          <div style={{width:"100%",display:"flex",gap:6}}>
            <input
              value={fillInput}
              onChange={e=>setFillInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&fillInput.trim()) checkFill(); }}
              placeholder="答えを入力…"
              autoFocus
              style={{
                flex:1,background:"#0f0f0f",border:`1px solid ${tc}`,
                color:"#fff",padding:"10px 12px",fontSize:16,fontFamily:"monospace",
                outline:"none",borderRadius:0,
              }}
            />
            <button
              onClick={checkFill}
              disabled={!fillInput.trim()}
              style={{
                background:tc,border:"none",color:"#fff",padding:"10px 16px",
                fontSize:11,fontFamily:"monospace",cursor:"pointer",letterSpacing:1,
                opacity:fillInput.trim()?1:0.4,
              }}
            >確認</button>
          </div>
        )}
        {/* Result shown after checking */}
        {fillChecked&&(
          <div style={{width:"100%"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{
                fontSize:12,fontFamily:"monospace",
                color:fillCorrect?"#4de89a":"#e8412a",letterSpacing:2,
              }}>
                {fillCorrect?"✓ CORRECT":"✗ INCORRECT"}
              </div>
              <button onClick={()=>{ const ex=pickFillExample(currentCard,progress); speak(ex.j); }}
                style={{background:"none",border:"1px solid #1e1e1e",color:"#444",fontSize:13,cursor:"pointer",padding:"3px 7px"}}
                title="Read sentence aloud">🔊</button>
            </div>
            {!fillCorrect&&(
              <div style={{fontSize:13,color:"#666",marginBottom:8}}>
                答え: <span style={{color:"#fff"}}>{currentCard.word}</span>
                <span style={{color:"#444",marginLeft:8}}>{currentCard.reading}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return(
    <div style={S.root}>
      <div style={S.scanlines}/>

      {/* HEADER */}
      <header style={S.header}>
        <div style={{cursor:"pointer"}} onClick={()=>setMode("home")}>
          <div style={S.logoMain}>BEBOP</div>
          <div style={S.logoSub}>語彙トレーナー · 26話 + 映画</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {saveMsg&&<span style={{color:"#4de89a",fontSize:9,fontFamily:"monospace"}}>{saveMsg}</span>}
          <div style={{display:"flex",gap:2}}>
            {[["home","HOME"],["stats","STATS"]].map(([m,l])=>(
              <button key={m} onClick={()=>setMode(m)} style={{...S.navBtn,...(mode===m?S.navBtnOn:{})}}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div style={S.page}>

        {/* ── HOME ── */}
        {mode==="home"&&(
          <>
            <div style={S.globalStats}>
              {[["TOTAL",VOCAB.length,"#666"],["STUDIED",globalStudied,"#e8a22a"],["DUE",globalDue,"#e8412a"],["MASTERED",VOCAB.filter(v=>progress[v.id]?.interval>=21).length,"#4de89a"]].map(([l,v,c])=>(
                <div key={l} style={S.statCell}>
                  <span style={{color:"#2a2a2a",fontSize:8,letterSpacing:2,fontFamily:"monospace"}}>{l}</span>
                  <span style={{color:c,fontSize:24,fontFamily:"monospace",fontWeight:700,lineHeight:1}}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{color:"#333",fontSize:9,letterSpacing:2,fontFamily:"monospace"}}>FILTER:</span>
              {[[0,"ALL"],[1,"CORE"],[2,"SITUATIONAL"],[3,"SLANG"]].map(([t,l])=>(
                <button key={t} onClick={()=>setFilterTier(t)}
                  style={{...S.filterBtn,...(filterTier===t?{background:t===0?"#ddd":TIER_COLORS[t],color:"#080808",border:`1px solid ${t===0?"#ddd":TIER_COLORS[t]}`}:{})}}>
                  {l}
                </button>
              ))}
            </div>

            <button style={{...S.bigBtn,marginBottom:20,opacity:globalDue===0?0.4:1}}
              onClick={()=>startStudy(null)} disabled={globalDue===0}>
              {globalDue===0?"本日分完了 ✓":`ALL EPISODES — ${globalDue} due`}
            </button>

            <div style={S.epGrid}>
              {EPISODES.map(ep=>{
                const epVocab = VOCAB.filter(v=>v.ep===ep.id);
                const due = getFlipDue(epVocab,progress).length + getFillDue(epVocab,progress).length;
                const readiness = getEpReadiness(ep.id,progress);
                const isMovie = ep.id===27;
                const unlocked = isEpUnlocked(ep.id,progress);
                return(
                  <div key={ep.id}
                    style={{...S.epCard, opacity:unlocked?1:0.35, cursor:unlocked?"pointer":"default", borderColor:unlocked?"#141414":"#0d0d0d"}}
                    onClick={()=>unlocked&&startStudy(ep.id)}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                      <span style={{color:unlocked?"#e8412a":"#333",fontSize:10,fontFamily:"monospace"}}>{isMovie?"映画":`EP${String(ep.id).padStart(2,"0")}`}</span>
                      {!unlocked&&<span style={{fontSize:12}}>🔒</span>}
                      {unlocked&&due>0&&<span style={{color:"#e8412a",fontSize:9,fontFamily:"monospace"}}>{due} due</span>}
                      {unlocked&&due===0&&<span style={{color:"#4de89a",fontSize:9,fontFamily:"monospace"}}>✓</span>}
                    </div>
                    <div style={{fontSize:11,color:unlocked?"#888":"#333",marginBottom:4,lineHeight:1.4}}>{ep.title}</div>
                    <div style={{fontSize:9,color:"#222",marginBottom:6}}>{ep.titleJa}</div>
                    {unlocked?(
                      <>
                        <div style={{height:2,background:"#111",borderRadius:1}}>
                          <div style={{height:2,background:readiness>=70?"#4de89a":readiness>=40?"#e8a22a":"#e8412a",width:`${readiness}%`,transition:"width 0.5s",borderRadius:1}}/>
                        </div>
                        <div style={{fontSize:8,color:"#333",fontFamily:"monospace",marginTop:3}}>{readiness}% ready</div>
                      </>
                    ):(
                      <div style={{fontSize:8,color:"#222",fontFamily:"monospace",marginTop:3}}>
                        prev ep needs {UNLOCK_THRESHOLD}% ready
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── STUDY ── */}
        {mode==="study"&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #111"}}>
              <button onClick={()=>setMode("home")} style={{...S.navBtn,fontSize:9}}>← BACK</button>
              <span style={{color:"#333",fontSize:10,fontFamily:"monospace"}}>
                {studyEp?(EPISODES.find(e=>e.id===studyEp)?.title||`EP${studyEp}`):"ALL EPISODES"}
              </span>
              <span style={{color:"#222",fontSize:10,fontFamily:"monospace"}}>{session.reviewed} done</span>
            </div>

            {!currentCard?(
              <div style={{textAlign:"center",paddingTop:60}}>
                <div style={{fontSize:36,color:"#e8412a",fontFamily:"monospace",letterSpacing:4,marginBottom:6}}>完了</div>
                <div style={{fontSize:9,color:"#333",letterSpacing:5,fontFamily:"monospace",marginBottom:24}}>SESSION COMPLETE</div>
                <div style={{display:"flex",gap:20,justifyContent:"center",fontFamily:"monospace",fontSize:12,marginBottom:32}}>
                  <span>{session.reviewed} reviewed</span>
                  <span style={{color:"#4de89a"}}>{session.correct} correct</span>
                  <span style={{color:"#e8412a"}}>{session.reviewed-session.correct} again</span>
                </div>
                <button style={S.bigBtn} onClick={()=>setMode("home")}>← BACK TO HOME</button>
              </div>
            ):(
              <>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{color:TIER_COLORS[currentCard.tier],fontSize:9,fontFamily:"monospace",letterSpacing:2}}>{TIER_LABELS[currentCard.tier]}</span>
                    {currentCard._isFill&&<span style={{color:"#444",fontSize:8,fontFamily:"monospace",letterSpacing:2,border:"1px solid #222",padding:"1px 5px"}}>FILL-IN</span>}
                  </div>
                  <span style={{color:"#222",fontSize:9,fontFamily:"monospace"}}>EP{currentCard.ep===27?"映画":String(currentCard.ep).padStart(2,"0")}</span>
                </div>

                {/* ── FILL-IN CARD ── */}
                {currentCard._isFill?(
                  <>
                    <div style={{marginBottom:14}}>
                      {renderFillCard()}
                    </div>
                    {/* After checking: show grading buttons */}
                    {fillChecked?(
                      <div style={{display:"flex",gap:4}}>
                        {[[0,"AGAIN","#9b2335"],[1,"HARD","#7a3a10"],[2,"GOOD","#155230"],[3,"EASY","#102a5c"]].map(([q,label,bg])=>(
                          <button key={q} style={{...S.ansBtn,background:bg}} onClick={()=>answerFill(q)}>
                            <span style={{color:"#fff",fontSize:9,letterSpacing:1,fontFamily:"monospace",fontWeight:700}}>{label}</span>
                            <span style={{color:"rgba(255,255,255,0.35)",fontSize:8,fontFamily:"monospace"}}>{nextInt(q,true)}</span>
                          </button>
                        ))}
                      </div>
                    ):(
                      <div style={{textAlign:"center",marginTop:4}}>
                        <span style={{color:"#181818",fontSize:9,letterSpacing:3,fontFamily:"monospace"}}>TYPE ANSWER AND TAP 確認</span>
                      </div>
                    )}
                  </>
                ):(
                  /* ── FLIP CARD ── */
                  <>
                    <div style={{perspective:1200,marginBottom:14,cursor:"pointer"}} onClick={()=>{ if(!flipped){setFlipped(true);setExpandedKanji(null);} }}>
                      <div style={{...S.cardInner,transform:flipped?"rotateY(180deg)":"rotateY(0deg)"}}>
                        {/* FRONT */}
                        <div style={S.face}>
                          <div style={{...S.tierStripe,background:TIER_COLORS[currentCard.tier]}}/>
                          <div style={{fontSize:52,color:"#fff",lineHeight:1,marginBottom:10}}>{currentCard.word}</div>
                          <div style={{fontSize:9,color:"#1a1a1a",letterSpacing:3,fontFamily:"monospace"}}>タップして確認</div>
                        </div>
                        {/* BACK */}
                        <div style={{...S.face,...S.faceBack}}>
                          <div style={{...S.tierStripe,background:TIER_COLORS[currentCard.tier]}}/>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:0}}>
                            <div style={{fontSize:30,color:"#fff",lineHeight:1}}>{currentCard.word}</div>
                            <button onClick={e=>{e.stopPropagation();speak(currentCard.word);}}
                              style={{background:"none",border:"1px solid #1e1e1e",color:"#444",fontSize:14,cursor:"pointer",padding:"4px 8px",flexShrink:0}}
                              title="Read aloud">🔊</button>
                          </div>
                          <div style={{fontSize:14,color:"#666",fontFamily:"monospace",marginBottom:2}}>{currentCard.reading}</div>
                          <div style={{fontSize:13,color:"#aaa",textAlign:"center",maxWidth:300,lineHeight:1.5,marginBottom:8}}>{currentCard.meaning}</div>
                          {currentCard.wm&&(
                            <div style={S.mnemoBox}>
                              <span style={{fontSize:11,flexShrink:0}}>💡</span>
                              <span style={{fontSize:10,color:"#888",lineHeight:1.5,fontFamily:"monospace"}}>{currentCard.wm}</span>
                            </div>
                          )}
                          {currentCard.kb?.length>0&&(
                            <div style={{width:"100%",marginTop:10}}>
                              <div style={{fontSize:8,color:"#1e1e1e",letterSpacing:3,fontFamily:"monospace",marginBottom:6,borderBottom:"1px solid #111",paddingBottom:4}}>KANJI BREAKDOWN</div>
                              <div style={{display:"flex",flexDirection:"column",gap:3}}>
                                {currentCard.kb.map((k,i)=>(
                                  <div key={i}>
                                    <button onClick={e=>{e.stopPropagation();setExpandedKanji(expandedKanji===i?null:i);}}
                                      style={{...S.kanjiRow,...(expandedKanji===i?S.kanjiRowOn:{})}}>
                                      <span style={{fontSize:28,color:"#fff",width:32,lineHeight:1,flexShrink:0}}>{k.k}</span>
                                      <div style={{display:"flex",flexDirection:"column",gap:1,flex:1,textAlign:"left"}}>
                                        <span style={{fontSize:9,color:"#666",fontFamily:"monospace"}}>{k.r}</span>
                                        <span style={{fontSize:11,color:"#bbb"}}>{k.m}</span>
                                      </div>
                                      <span style={{fontSize:8,color:"#333",fontFamily:"monospace"}}>{expandedKanji===i?"▲":"▼"}</span>
                                    </button>
                                    {expandedKanji===i&&(
                                      <div style={S.kanjiDetail} onClick={e=>e.stopPropagation()}>
                                        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                                          {k.rad.map((r,ri)=>(
                                            <div key={ri} style={S.radPill}>
                                              <span style={{fontSize:20,color:"#e8a22a"}}>{r}</span>
                                              <span style={{fontSize:8,color:"#555",fontFamily:"monospace"}}>{k.rm[ri]}</span>
                                            </div>
                                          ))}
                                        </div>
                                        <div style={S.mnemoBoxPurple}>
                                          <span style={{fontSize:11,flexShrink:0}}>🧠</span>
                                          <span style={{fontSize:10,color:"#888",lineHeight:1.5,fontFamily:"monospace"}}>{k.mn}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {flipped?(
                      <div style={{display:"flex",gap:4}}>
                        {[[0,"AGAIN","#9b2335"],[1,"HARD","#7a3a10"],[2,"GOOD","#155230"],[3,"EASY","#102a5c"]].map(([q,label,bg])=>(
                          <button key={q} style={{...S.ansBtn,background:bg}} onClick={()=>answerFlip(q)}>
                            <span style={{color:"#fff",fontSize:9,letterSpacing:1,fontFamily:"monospace",fontWeight:700}}>{label}</span>
                            <span style={{color:"rgba(255,255,255,0.35)",fontSize:8,fontFamily:"monospace"}}>{nextInt(q,false)}</span>
                          </button>
                        ))}
                      </div>
                    ):(
                      <div style={{textAlign:"center",marginTop:10}}>
                        <span style={{color:"#181818",fontSize:9,letterSpacing:3,fontFamily:"monospace"}}>TAP CARD TO REVEAL</span>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* ── STATS ── */}
        {mode==="stats"&&(
          <>
            <div style={{fontSize:9,color:"#222",letterSpacing:4,fontFamily:"monospace",borderBottom:"1px solid #111",paddingBottom:8,marginBottom:20}}>
              OVERALL PROGRESS — {VOCAB.length} WORDS
            </div>
            {EPISODES.map(ep=>{
              const epVocab=VOCAB.filter(v=>v.ep===ep.id);
              const studied=epVocab.filter(v=>progress[v.id]).length;
              const mastered=epVocab.filter(v=>progress[v.id]?.interval>=21&&progress[v.id+"_fill"]?.interval>=21).length;
              const ready=epVocab.filter(v=>progress[v.id]?.interval>=READINESS_THRESHOLD&&progress[v.id+"_fill"]?.interval>=READINESS_THRESHOLD).length;
              const readyPct=Math.round((ready/epVocab.length)*100);
              const isMovie=ep.id===27;
              return(
                <div key={ep.id} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid #0c0c0c"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:4}}>
                    <span style={{color:"#e8412a",fontSize:9,fontFamily:"monospace"}}>{isMovie?"映画":`EP${String(ep.id).padStart(2,"0")}`} {ep.title}</span>
                    <span style={{color:"#222",fontSize:9,fontFamily:"monospace"}}>{studied}/{epVocab.length} · {mastered} mastered</span>
                  </div>
                  <div style={{height:2,background:"#0e0e0e",marginBottom:4}}>
                    <div style={{height:2,background:readyPct>=70?"#4de89a":readyPct>=40?"#e8a22a":"#e8412a",width:`${readyPct}%`,transition:"width 0.5s"}}/>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {epVocab.map(v=>{
                      const p=progress[v.id];
                      const pf=progress[v.id+"_fill"];
                      const flipReady=p?.interval>=READINESS_THRESHOLD;
                      const fillReady=pf?.interval>=READINESS_THRESHOLD;
                      const bothReady=flipReady&&fillReady;
                      const isMastered=p?.interval>=21&&pf?.interval>=21;
                      const isDue=!p||p.nextReview<=Date.now();
                      return(
                        <div key={v.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                          <span style={{fontSize:16,color:isMastered?"#4de89a":bothReady?"#e8a22a":isDue?TIER_COLORS[v.tier]:"#1e1e1e"}}>{v.word}</span>
                          <div style={{display:"flex",gap:2}}>
                            <span style={{fontSize:6,color:flipReady?"#555":"#2a2a2a",fontFamily:"monospace"}}>F{p?`+${p.interval}d`:"·"}</span>
                            <span style={{fontSize:6,color:fillReady?"#555":"#2a2a2a",fontFamily:"monospace"}}>W{pf?`+${pf.interval}d`:"·"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

const S={
  root:{minHeight:"100vh",background:"#070707",color:"#ccc",fontFamily:"'Courier New',monospace",position:"relative"},
  scanlines:{position:"fixed",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)",pointerEvents:"none",zIndex:999},
  header:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:"1px solid #0f0f0f",background:"#050505",position:"sticky",top:0,zIndex:100},
  logoMain:{fontSize:20,fontWeight:700,letterSpacing:8,color:"#e8412a",fontFamily:"monospace",lineHeight:1},
  logoSub:{fontSize:8,letterSpacing:2,color:"#222",marginTop:2},
  navBtn:{background:"transparent",border:"1px solid #141414",color:"#2a2a2a",padding:"5px 10px",fontSize:9,cursor:"pointer",fontFamily:"monospace",letterSpacing:1},
  navBtnOn:{border:"1px solid #e8412a",color:"#e8412a",background:"rgba(232,65,42,0.04)"},
  page:{padding:"16px",maxWidth:600,margin:"0 auto"},
  globalStats:{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"},
  statCell:{display:"flex",flexDirection:"column",gap:2,background:"#0b0b0b",border:"1px solid #0f0f0f",padding:"8px 12px",minWidth:56},
  filterBtn:{background:"transparent",border:"1px solid #141414",color:"#2a2a2a",padding:"4px 8px",fontSize:8,cursor:"pointer",fontFamily:"monospace",letterSpacing:1},
  bigBtn:{width:"100%",background:"#e8412a",border:"none",color:"#fff",padding:"13px",fontSize:10,letterSpacing:3,cursor:"pointer",fontFamily:"monospace",fontWeight:700},
  epGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))",gap:8,marginTop:4},
  epCard:{background:"#0a0a0a",border:"1px solid #141414",padding:"10px",cursor:"pointer",transition:"border-color 0.2s"},
  cardInner:{position:"relative",minHeight:200,transformStyle:"preserve-3d",transition:"transform 0.5s cubic-bezier(0.4,0,0.2,1)"},
  face:{position:"absolute",inset:0,backfaceVisibility:"hidden",background:"#0c0c0c",border:"1px solid #141414",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px",gap:6,overflow:"hidden"},
  faceBack:{transform:"rotateY(180deg)",justifyContent:"flex-start",paddingTop:14,overflowY:"auto"},
  tierStripe:{position:"absolute",top:0,left:0,right:0,height:2},
  mnemoBox:{display:"flex",gap:6,alignItems:"flex-start",background:"rgba(232,162,42,0.05)",border:"1px solid rgba(232,162,42,0.1)",padding:"8px 10px",width:"100%",boxSizing:"border-box"},
  mnemoBoxPurple:{display:"flex",gap:6,alignItems:"flex-start",background:"rgba(124,77,232,0.05)",border:"1px solid rgba(124,77,232,0.1)",padding:"8px 10px"},
  kanjiRow:{width:"100%",display:"flex",alignItems:"center",gap:10,background:"#0f0f0f",border:"1px solid #141414",padding:"7px 10px",cursor:"pointer",boxSizing:"border-box"},
  kanjiRowOn:{background:"#131313",borderColor:"#222"},
  kanjiDetail:{background:"#0a0a0a",border:"1px solid #111",borderTop:"none",padding:"10px 12px"},
  radPill:{display:"flex",flexDirection:"column",alignItems:"center",background:"#0f0f0f",border:"1px solid #181818",padding:"6px 10px",gap:2},
  ansBtn:{flex:1,border:"none",padding:"12px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3},
};
