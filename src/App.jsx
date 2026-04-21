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
  { id:"e01_01", ep:1, word:"賞金首", reading:"しょうきんくび", meaning:"bounty target", tier:1,
    kb:[{k:"賞",r:"しょう",m:"prize",rad:["𠂉","貝"],rm:["award","shell/money"],mn:"A prize paid in shells — ancient money rewarded for merit"},{k:"金",r:"きん",m:"gold/money",rad:["人","土"],rm:["person","earth"],mn:"A person mining from the earth — gold, money"},{k:"首",r:"くび",m:"neck/head",rad:["𠂉","自"],rm:["hair","self/face"],mn:"Hair above a face — the head or neck"}],
    wm:"Prize money (賞金) put on someone's head (首) — a person with a price on their neck" },
  { id:"e01_02", ep:1, word:"組織", reading:"そしき", meaning:"organization / syndicate", tier:1,
    kb:[{k:"組",r:"そ",m:"group/assemble",rad:["糸","且"],rm:["thread","stacked"],mn:"Threads layered on top of each other — an organized group"},{k:"織",r:"しき",m:"weave/structure",rad:["糸","戠"],rm:["thread","weave mark"],mn:"Threads woven into a marked pattern — organized structure"}],
    wm:"Threads woven together in layers — a tightly organized structure, like a crime syndicate" },
  { id:"e01_03", ep:1, word:"雑魚", reading:"ざこ", meaning:"small fry / weakling / nobody", tier:1,
    kb:[{k:"雑",r:"ざ",m:"mixed/misc",rad:["隹","木","又"],rm:["bird","tree","hand"],mn:"Birds in a tree caught by hand — a mixed, motley bunch"},{k:"魚",r:"こ",m:"fish",rad:["魚"],rm:["fish"],mn:"Pictograph of a fish. 雑魚 = mixed small fish = nobodies"}],
    wm:"Mixed small fish caught alongside the real catch — the nobodies of the criminal world" },
  { id:"e01_04", ep:1, word:"火星", reading:"かせい", meaning:"Mars", tier:1,
    kb:[{k:"火",r:"か",m:"fire",rad:["火"],rm:["fire"],mn:"Pictograph of flames. 火星 = fire star = Mars (the red planet)"},{k:"星",r:"せい",m:"star/planet",rad:["日","生"],rm:["sun","life/birth"],mn:"A sun that gives life — a star"}],
    wm:"Fire star (火星) — ancient astronomers named Mars perfectly. Everyone wants to escape there" },
  { id:"e01_05", ep:1, word:"目薬", reading:"めぐすり", meaning:"eye drops (the drug in ep 1)", tier:1,
    kb:[{k:"目",r:"め",m:"eye",rad:["目"],rm:["eye"],mn:"Pictograph of an eye turned sideways. 目薬 = medicine for the eye"},{k:"薬",r:"ぐすり",m:"medicine",rad:["艹","楽"],rm:["plant","comfort"],mn:"Plants that bring comfort — medicine"}],
    wm:"Eye (目) medicine (薬) — Bloody Eye is a combat drug disguised as eyedrops" },
  { id:"e01_06", ep:1, word:"賞金稼ぎ", reading:"しょうきんかせぎ", meaning:"bounty hunter", tier:1,
    kb:[{k:"賞",r:"しょう",m:"prize",rad:["𠂉","貝"],rm:["award","shell/money"],mn:"A prize paid in shells — ancient money rewarded for merit"},{k:"金",r:"きん",m:"money",rad:["人","土"],rm:["person","earth"],mn:"A person mining from the earth — gold, money"},{k:"稼",r:"かせ(ぎ)",m:"earning/working",rad:["禾","家"],rm:["grain","house"],mn:"Grain for the house — earning your keep, working"}],
    wm:"Someone who earns their living through prize money — the whole Bebop premise" },
  { id:"e01_07", ep:1, word:"無理", reading:"むり", meaning:"impossible / unreasonable", tier:1,
    kb:[{k:"無",r:"む",m:"nothing/without",rad:["𠂉","灬"],rm:["arms spread","fire"],mn:"A person dancing over fire — the ancient character for nothingness. 無理 = no reason = impossible"},{k:"理",r:"り",m:"reason/logic",rad:["王","里"],rm:["king","village"],mn:"The king's logic governs the village — reason, order"}],
    wm:"Without (無) reason or logic (理) — literally 'no logic to it', therefore impossible" },
  { id:"e01_08", ep:1, word:"幸せ", reading:"しあわせ", meaning:"happiness / fortunate", tier:1,
    kb:[{k:"幸",r:"しあわ(せ)",m:"fortune/luck",rad:["土","𠂉","工"],rm:["earth","divine","work"],mn:"Divine work on earth — when heaven aligns with labor, fortune follows"}],
    wm:"Divine work aligned with earthly effort — fortune arrives when heaven and labor meet" },
  { id:"e01_09", ep:1, word:"仲間", reading:"なかま", meaning:"companion / comrade", tier:2,
    kb:[{k:"仲",r:"なか",m:"middle/relationship",rad:["人","中"],rm:["person","middle"],mn:"A person in the middle — a go-between, a companion"},{k:"間",r:"ま",m:"space/between",rad:["門","日"],rm:["gate","sun"],mn:"Sun shining through a gate — the space between"}],
    wm:"The person in the middle of your space — Asimov betrays his 仲間" },
  { id:"e01_10", ep:1, word:"諦める", reading:"あきらめる", meaning:"to give up", tier:2,
    kb:[{k:"諦",r:"あきら(める)",m:"resign/see clearly",rad:["言","帝"],rm:["words","emperor"],mn:"When the emperor speaks, there is no arguing — to resign oneself, give up"}],
    wm:"When the emperor's word is final, you see clearly that it's over — accept and stop fighting" },
  { id:"e01_11", ep:1, word:"畜生", reading:"ちくしょう", meaning:"damn it! (mild expletive)", tier:3,
    kb:[{k:"畜",r:"ちく",m:"livestock/animal",rad:["玄","田"],rm:["dark","field"],mn:"Dark field creatures — livestock. As expletive: calling something a beast"},{k:"生",r:"しょう",m:"life/creature",rad:["土","𠂉"],rm:["earth","sprout"],mn:"A sprout pushing up through earth — life, birth"}],
    wm:"Livestock creature (畜生) — calling something beastly. The old card player shouts this repeatedly" },
  { id:"e01_12", ep:1, word:"サツ", reading:"さつ", meaning:"cops / the fuzz (slang)", tier:3,
    kb:[], wm:"Slang clipping of 察 from 警察 (police). Like saying 'the fuzz' instead of 'the police force'" },
  { id:"e01_13", ep:1, word:"カモ", reading:"かも", meaning:"sucker / easy mark (lit. duck)", tier:3,
    kb:[{k:"鴨",r:"かも",m:"duck",rad:["甲","鳥"],rm:["number one","bird"],mn:"A bird marked number one for catching — a duck, easy prey"}],
    wm:"Ducks are easy to catch — so カモ means someone easily exploited. The old man accuses Spike of treating him like one" },
  { id:"e01_14", ep:1, word:"死に物狂い", reading:"しにものぐるい", meaning:"desperately / with everything", tier:3,
    kb:[{k:"死",r:"し",m:"death",rad:["歹","匕"],rm:["bone/death","person"],mn:"A crumbling bone beside a fallen person — death"},{k:"物",r:"もの",m:"thing",rad:["牛","勿"],rm:["cow","do not"],mn:"A cow marked do not touch — a thing, an object"},{k:"狂",r:"ぐるい",m:"crazy/berserk",rad:["犭","王"],rm:["animal","king"],mn:"An animal that thinks it's king — crazy, berserk"}],
    wm:"Crazy about death-level things — so desperate dying doesn't matter. Used for the Hypergate digging" },
  { id:"e01_15", ep:1, word:"時代遅れ", reading:"じだいおくれ", meaning:"outdated / behind the times", tier:2,
    kb:[{k:"時",r:"じ",m:"time",rad:["日","寺"],rm:["sun","temple"],mn:"Sun over a temple marking the hours — time"},{k:"代",r:"だい",m:"era/generation",rad:["人","弋"],rm:["person","substitute"],mn:"A person as a substitute — generation, era"},{k:"遅",r:"おく(れ)",m:"late/slow",rad:["⻌","犀"],rm:["movement","rhinoceros"],mn:"Moving like a rhinoceros — slow, late"}],
    wm:"Late to the current era — Spike calls himself 時代遅れのカウボーイ with full irony" },

  // ── EP 02 ──
  { id:"e02_01", ep:2, word:"窃盗犯", reading:"せっとうはん", meaning:"serial thief / theft criminal", tier:1,
    kb:[{k:"窃",r:"せっ",m:"steal secretly",rad:["穴","切"],rm:["hole","cut"],mn:"Cutting through a hole — to steal secretly"},{k:"盗",r:"とう",m:"steal",rad:["次","皿"],rm:["next","dish"],mn:"Taking the next dish — to steal"},{k:"犯",r:"はん",m:"crime",rad:["犭","巳"],rm:["animal","snake"],mn:"An animal striking like a snake — crime, offense"}],
    wm:"Hakim is described as 連続窃盗犯 — his whole episode is about what he actually stole" },
  { id:"e02_02", ep:2, word:"逃走中", reading:"とうそうちゅう", meaning:"currently on the run / fleeing", tier:1,
    kb:[{k:"逃",r:"とう",m:"flee",rad:["⻌","兆"],rm:["movement","omen"],mn:"Moving at the first omen of danger — to flee"},{k:"走",r:"そう",m:"run",rad:["走"],rm:["run"],mn:"Pictograph of a person running — to run"},{k:"中",r:"ちゅう",m:"in the middle of",rad:["口","丨"],rm:["box","line"],mn:"A line through the middle of a box — currently doing something"}],
    wm:"Fleeing (逃走) in progress (中) — literally mid-escape, the standard wanted notice phrasing" },
  { id:"e02_03", ep:2, word:"実験動物", reading:"じっけんどうぶつ", meaning:"laboratory / experimental animal", tier:2,
    kb:[{k:"実",r:"じっ",m:"real/actual",rad:["宀","貫"],rm:["roof","penetrate"],mn:"What penetrates through a roof — something real and solid"},{k:"験",r:"けん",m:"test/effect",rad:["馬","㑒"],rm:["horse","test"],mn:"Testing a horse's reactions — experiment, test"},{k:"動",r:"どう",m:"move",rad:["重","力"],rm:["heavy","power"],mn:"Power moving something heavy — motion"},{k:"物",r:"ぶつ",m:"thing/creature",rad:["牛","勿"],rm:["cow","do not"],mn:"A cow marked do not touch — a thing, a creature"}],
    wm:"What Ein actually is — an 実験動物, an animal used in secret illegal research" },
  { id:"e02_04", ep:2, word:"整形", reading:"せいけい", meaning:"plastic surgery", tier:2,
    kb:[{k:"整",r:"せい",m:"arrange/fix",rad:["攴","束"],rm:["strike","bundle"],mn:"Striking a bundle into order — to arrange, fix, tidy"},{k:"形",r:"けい",m:"shape/form",rad:["開","彡"],rm:["open","decorative strokes"],mn:"Decorative strokes opening into a form — shape"}],
    wm:"Arrange (整) the shape (形) — Hakim keeps surgically changing his face to escape recognition" },
  { id:"e02_05", ep:2, word:"踏み倒す", reading:"ふみたおす", meaning:"to skip out on a bill / stiff someone", tier:3,
    kb:[{k:"踏",r:"ふみ",m:"step/tread",rad:["足","水"],rm:["foot","water"],mn:"A foot stepping through water — to tread, trample"},{k:"倒",r:"たおす",m:"topple/knock over",rad:["人","到"],rm:["person","arrive"],mn:"A person who has arrived at falling — to topple"}],
    wm:"Trample down (踏み倒す) a debt — the info dealer was stiffed by Hakim and wants revenge" },

  // ── EP 03 ──
  { id:"e03_01", ep:3, word:"借金", reading:"しゃっきん", meaning:"debt", tier:1,
    kb:[{k:"借",r:"しゃっ",m:"borrow",rad:["人","昔"],rm:["person","long ago"],mn:"A person reaching back to long ago — to borrow, referring to the past"},{k:"金",r:"きん",m:"money",rad:["人","土"],rm:["person","earth"],mn:"A person mining from the earth — gold, money"}],
    wm:"Borrowed (借) money (金) — Faye's defining trait throughout the entire series" },
  { id:"e03_02", ep:3, word:"イカサマ", reading:"いかさま", meaning:"cheating / fraud", tier:2,
    kb:[], wm:"Pure Japanese slang for cheating at cards — いかにも様 (how proper!) used sarcastically. Faye and the casino are both at it" },
  { id:"e03_03", ep:3, word:"暗号", reading:"あんごう", meaning:"code / cipher", tier:2,
    kb:[{k:"暗",r:"あん",m:"dark/secret",rad:["日","音"],rm:["sun","sound"],mn:"The sun making sound in darkness — hidden, dark, secret"},{k:"号",r:"ごう",m:"number/code",rad:["口","丂"],rm:["mouth","bent"],mn:"A mouth making a bent sound — a code, signal, number"}],
    wm:"Secret (暗) code (号) — the chip contains a 暗号解読 program that unlocks almost any security" },
  { id:"e03_04", ep:3, word:"解読", reading:"かいどく", meaning:"decipherment / decoding", tier:2,
    kb:[{k:"解",r:"かい",m:"solve/untie",rad:["角","刀","牛"],rm:["horn","knife","cow"],mn:"Using a knife to separate a cow's horn — to untie, solve, break apart"},{k:"読",r:"どく",m:"read",rad:["言","売"],rm:["words","sell"],mn:"Words being sold/exchanged — to read"}],
    wm:"To untie (解) and read (読) — what the crypto-breaker chip does to any encrypted system" },

  // ── EP 04 ──
  { id:"e04_01", ep:4, word:"環境保護", reading:"かんきょうほご", meaning:"environmental protection", tier:1,
    kb:[{k:"環",r:"かん",m:"ring/cycle",rad:["王","睘"],rm:["king","circular"],mn:"A king's circular loop — a ring, cycle, environment"},{k:"境",r:"きょう",m:"boundary/environment",rad:["土","竟"],rm:["earth","boundary"],mn:"Earth at its boundary — environment, territory"},{k:"保",r:"ほ",m:"protect/preserve",rad:["人","呆"],rm:["person","upright"],mn:"A person keeping something upright — to protect, preserve"},{k:"護",r:"ご",m:"guard/defend",rad:["言","隻"],rm:["words","one"],mn:"Words of one who guards — to defend, protect"}],
    wm:"Space Warriors' stated mission — their 環境保護 becomes eco-terror when they release the virus" },
  { id:"e04_02", ep:4, word:"ウイルス", reading:"ういrusu", meaning:"virus", tier:1,
    kb:[], wm:"From English 'virus' — MonkeyBusiness is the biological weapon that targets only humans in this episode" },
  { id:"e04_03", ep:4, word:"位相差空間", reading:"いそうさくうかん", meaning:"hyperspace / phase-difference space", tier:2,
    kb:[{k:"位",r:"い",m:"position/rank",rad:["人","立"],rm:["person","stand"],mn:"A person standing in a position — rank, place, position"},{k:"相",r:"そう",m:"phase/mutual",rad:["木","目"],rm:["tree","eye"],mn:"An eye in a tree watching — mutual, phase"},{k:"差",r:"さ",m:"difference",rad:["羊","工"],rm:["sheep","work"],mn:"Working with sheep — difference, disparity"},{k:"空間",r:"くうかん",m:"space",rad:["穴","工"],rm:["hole","work"],mn:"Working through a hole — empty space"}],
    wm:"The sci-fi gate technology — objects sealed in 位相差空間 exist but never interact with our reality" },
  { id:"e04_04", ep:4, word:"封鎖", reading:"ふうさ", meaning:"blockade / sealing off", tier:2,
    kb:[{k:"封",r:"ふう",m:"seal/close",rad:["圭","寸"],rm:["jade/earth","measure"],mn:"Measuring earth to seal it — to close, seal"},{k:"鎖",r:"さ",m:"chain/lock",rad:["金","琐"],rm:["metal","small pieces"],mn:"Metal in small linked pieces — a chain, to lock"}],
    wm:"Seal (封) with a chain (鎖) — the government 封鎖s the hyperspace gate to stop the missile" },

  // ── EP 05 ──
  { id:"e05_01", ep:5, word:"裏切る", reading:"うらぎる", meaning:"to betray", tier:1,
    kb:[{k:"裏",r:"うら",m:"back/reverse",rad:["衣","里"],rm:["clothing","village"],mn:"The back side of clothing, the reverse side — behind, the hidden underside"},{k:"切",r:"ぎる",m:"cut",rad:["七","刀"],rm:["seven","knife"],mn:"A knife cutting — to cut"}],
    wm:"To cut (切) from behind (裏) — Vicious betrays Mao, the defining act of Spike's backstory" },
  { id:"e05_02", ep:5, word:"仁義", reading:"じんぎ", meaning:"code of honor / duty", tier:2,
    kb:[{k:"仁",r:"じん",m:"benevolence/humanity",rad:["人","二"],rm:["person","two"],mn:"Two people (人二) — the relationship between people; benevolence, humanity"},{k:"義",r:"ぎ",m:"righteousness/duty",rad:["羊","我"],rm:["sheep","self"],mn:"The self (我) with the quality of a sheep (羊) — righteousness, what is right"}],
    wm:"渡世の仁義 — the code of the underworld. Mao lived by it; Vicious killed him for it" },
  { id:"e05_03", ep:5, word:"悪魔", reading:"あくま", meaning:"devil / demon", tier:2,
    kb:[{k:"悪",r:"あく",m:"evil/bad",rad:["亜","心"],rm:["second/ugly","heart"],mn:"An ugly (亜) heart (心) — evil, bad"},{k:"魔",r:"ま",m:"demon/magic",rad:["广","鬼"],rm:["house/spread","ghost"],mn:"A ghost spreading under a wide roof — a demon, supernatural evil"}],
    wm:"Vicious is described as 悪魔 — and the episode's title asks us to feel sympathy for him" },
  { id:"e05_04", ep:5, word:"渡世", reading:"とせい", meaning:"the underworld life", tier:3,
    kb:[{k:"渡",r:"と",m:"cross/pass through",rad:["氵","度"],rm:["water","degree/pass"],mn:"Water you must pass through — to cross, to get through"},{k:"世",r:"せい",m:"world/generation",rad:["廿","乙"],rm:["twenty","second"],mn:"Generations passing like a twisting line — world, generation"}],
    wm:"渡世の仁義 — literally 'the righteousness of crossing the world'. The criminal life's code" },

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
    wm:"この世の果てで会おう — Vincent's farewell to Spike. The movie ends there, at the edge of everything" },,
// NEW EXPANDED VOCAB - inserted before the ]; closing the VOCAB array
// EP01 additions
  { id:"e01_n01", ep:1, word:"逃げる", reading:"にげる", meaning:"to run away / to flee", tier:1, kb:[], wm:"にげる — Asimov and Katerina are constantly 逃げている from everything" },
  { id:"e01_n02", ep:1, word:"捕まえる", reading:"つかまえる", meaning:"to catch / to capture", tier:1, kb:[], wm:"つかまえる — what bounty hunters do for a living; 賞金首を捕まえる" },
  { id:"e01_n03", ep:1, word:"逃げ込む", reading:"にげこむ", meaning:"to flee into / to take refuge in", tier:2, kb:[], wm:"にげこむ — やつはティワナの女の所に逃げ込んだらしい" },
  { id:"e01_n04", ep:1, word:"壊す", reading:"こわす", meaning:"to break / to destroy", tier:1, kb:[], wm:"こわす — Spike breaks everything: ships, shops, bones. おまえが壊した機体" },
  { id:"e01_n05", ep:1, word:"修理", reading:"しゅうり", meaning:"repair", tier:1, kb:[], wm:"しゅうり — 機体の修理 costs eat all the bounty money" },
  { id:"e01_n06", ep:1, word:"治療費", reading:"ちりょうひ", meaning:"medical treatment fee", tier:2, kb:[], wm:"ちりょうひ — 警官の治療費 eats the rest" },
  { id:"e01_n07", ep:1, word:"抗争", reading:"こうそう", meaning:"conflict / turf war", tier:2, kb:[], wm:"こうそう — rival gang 抗争 three days ago created the opening" },
  { id:"e01_n08", ep:1, word:"敵対する", reading:"てきたいする", meaning:"to be hostile to / to oppose", tier:2, kb:[], wm:"てきたいする — 敵対する組織 = a rival/enemy organization" },
  { id:"e01_n09", ep:1, word:"売人", reading:"ばいにん", meaning:"dealer / seller (drugs/contraband)", tier:2, kb:[], wm:"ばいにん — sells Bloody Eye to Asimov; drug dealer" },
  { id:"e01_n10", ep:1, word:"最上級品", reading:"さいじょうきゅうひん", meaning:"top grade / highest quality product", tier:3, kb:[], wm:"さいじょうきゅうひん — the Bloody Eye is 最上級品 of illegal eye drops" },
  { id:"e01_n11", ep:1, word:"非合法", reading:"ひごうほう", meaning:"illegal / unlawful", tier:1, kb:[], wm:"ひごうほう — 非合法目薬 = illegal eye drops. The show's world runs on 非合法 goods" },
  { id:"e01_n12", ep:1, word:"資金源", reading:"しきんげん", meaning:"source of funding / financial backer", tier:2, kb:[], wm:"しきんげん — Asimov stole the 組織の資金源 — their funding source" },
  { id:"e01_n13", ep:1, word:"仕切る", reading:"しきる", meaning:"to control / to run (a territory)", tier:2, kb:[], wm:"しきる — アステロイド一帯を仕切る組織 = the syndicate that controls the whole asteroid belt" },
  { id:"e01_n14", ep:1, word:"弱る", reading:"よわる", meaning:"to weaken / to be in bad shape", tier:2, kb:[], wm:"よわる — 弱ってる雑魚は相手にしない — Spike won't fight weaklings" },
  { id:"e01_n15", ep:1, word:"利口", reading:"りこう", meaning:"clever / smart / wise", tier:2, kb:[], wm:"りこう — それが利口だわ — Katerina recognizes Spike's cleverness" },

// EP02 additions
  { id:"e02_n01", ep:2, word:"賞金", reading:"しょうきん", meaning:"bounty / prize money", tier:1, kb:[], wm:"しょうきん — the show revolves around collecting 賞金. 800万ウーロン this episode" },
  { id:"e02_n02", ep:2, word:"生きたまま", reading:"いきたまま", meaning:"alive / while still living", tier:1, kb:[], wm:"いきたまま — 賞金首を生きたまま連れてくること — bounty condition: bring them alive" },
  { id:"e02_n03", ep:2, word:"指名手配", reading:"しめいてはい", meaning:"wanted (by police)", tier:1, kb:[], wm:"しめいてはい — 指名手配者情報 = wanted criminal information; Big Shot opens with this" },
  { id:"e02_n04", ep:2, word:"条件", reading:"じょうけん", meaning:"condition / terms", tier:1, kb:[], wm:"じょうけん — 条件はいつものように — the standard conditions for collecting a bounty" },
  { id:"e02_n05", ep:2, word:"大物", reading:"おおもの", meaning:"big catch / important person / major target", tier:1, kb:[], wm:"おおもの — 久しぶりの大物だ — Jet says this is a rare big-money target" },
  { id:"e02_n06", ep:2, word:"珍しい", reading:"めずらしい", meaning:"rare / unusual", tier:1, kb:[], wm:"めずらしい — 珍しい種類じゃないわね — Faye dismisses Ein as not rare" },
  { id:"e02_n07", ep:2, word:"価値", reading:"かち", meaning:"value / worth", tier:1, kb:[], wm:"かち — イヌに価値はなくても飼い主には価値がある — the real value is the owner" },
  { id:"e02_n08", ep:2, word:"飼い主", reading:"かいぬし", meaning:"owner (of a pet)", tier:2, kb:[], wm:"かいぬし — Ein's owner is the real bounty target. 飼う = to keep/raise + 主 = master" },
  { id:"e02_n09", ep:2, word:"世話が焼ける", reading:"せわがやける", meaning:"to be a handful / to be trouble", tier:3, kb:[], wm:"せわがやける — Spike complains about Ein: 世話が焼けるったらねえぜ" },
  { id:"e02_n10", ep:2, word:"繊細", reading:"せんさい", meaning:"delicate / sensitive", tier:2, kb:[], wm:"せんさい — うちの子みんな繊細なんだから — the pet shop owner about her animals" },

// EP03 additions  
  { id:"e03_n01", ep:3, word:"カジノ", reading:"kajino", meaning:"casino", tier:1, kb:[], wm:"カジノ — the episode is set in one. Used to launder money and run scams" },
  { id:"e03_n02", ep:3, word:"チップ", reading:"chippu", meaning:"casino chip (and microchip)", tier:1, kb:[], wm:"チップ — double meaning: casino chip AND the microchip hidden inside it. The whole plot" },
  { id:"e03_n03", ep:3, word:"運がいい", reading:"うんがいい", meaning:"lucky / fortunate", tier:1, kb:[], wm:"うんがいい — 俺は運がいいわけでもない — Spike claims his success is 気風 not luck" },
  { id:"e03_n04", ep:3, word:"気風", reading:"きっぷ", meaning:"spirit / generous character / style", tier:3, kb:[], wm:"きっぷがいい — Spike's defining boast. A spirit of generous boldness" },
  { id:"e03_n05", ep:3, word:"莫大", reading:"ばくだい", meaning:"enormous / vast (amount)", tier:2, kb:[], wm:"ばくだい — 君には莫大な借金があるそうだな — Faye's debt is enormous" },
  { id:"e03_n06", ep:3, word:"常習犯", reading:"じょうしゅうはん", meaning:"repeat offender / habitual criminal", tier:2, kb:[], wm:"じょうしゅうはん — 見かけによらず常習犯 — Big Shot's description of Faye" },
  { id:"e03_n07", ep:3, word:"魔法の鍵", reading:"まほうのかぎ", meaning:"magic key", tier:3, kb:[], wm:"まほうのかぎ — what the crypto-breaker chip is called. 魔法 = magic, 鍵 = key" },
  { id:"e03_n08", ep:3, word:"闇ルート", reading:"やみルート", meaning:"black market channel / underground route", tier:2, kb:[], wm:"やみルート — 闇ルートに流れた — the program leaked into black market channels" },
  { id:"e03_n09", ep:3, word:"血眼", reading:"ちまなこ", meaning:"desperately searching / bloodshot with effort", tier:3, kb:[], wm:"ちまなこ — 警察とISSPが血眼になって探していた — both police and ISSP are desperately hunting it" },
  { id:"e03_n10", ep:3, word:"現金", reading:"げんきん", meaning:"cash / ready money", tier:1, kb:[], wm:"げんきん — 現金指定とはな — insisting on cash payment; old fashioned" },

// EP04 additions
  { id:"e04_n01", ep:4, word:"希少", reading:"きしょう", meaning:"rare / scarce", tier:2, kb:[], wm:"きしょう — 希少動物保護 = protection of rare animals; the eco-terrorists' stated mission" },
  { id:"e04_n02", ep:4, word:"保全", reading:"ほぜん", meaning:"conservation / preservation", tier:2, kb:[], wm:"ほぜん — 宇宙環境の保全 = conservation of the space environment" },
  { id:"e04_n03", ep:4, word:"禁漁", reading:"きんりょう", meaning:"fishing ban / prohibition on catching", tier:2, kb:[], wm:"きんりょう — 海ネズミ禁漁 = ban on catching sea rats; the terrorists' demand" },
  { id:"e04_n04", ep:4, word:"誘拐", reading:"ゆうかい", meaning:"kidnapping / abduction", tier:1, kb:[], wm:"ゆうかい — 連中ウイルス学の権威を誘拐して — they kidnapped a virology expert" },
  { id:"e04_n05", ep:4, word:"遺伝子", reading:"いでんし", meaning:"gene / genetics", tier:2, kb:[], wm:"いでんし — 人間とサルの遺伝子の違いはわずか2パーセント — monkey gene gap" },
  { id:"e04_n06", ep:4, word:"釈放", reading:"しゃくほう", meaning:"release (from custody)", tier:2, kb:[], wm:"しゃくほう — すぐ釈放するようにってお達しだ — ordered to release Twinkle immediately" },
  { id:"e04_n07", ep:4, word:"要求", reading:"ようきゅう", meaning:"demand / request", tier:1, kb:[], wm:"ようきゅう — 要求を拒否している — the government is refusing their demands" },
  { id:"e04_n08", ep:4, word:"脅迫", reading:"きょうはく", meaning:"threat / intimidation", tier:2, kb:[], wm:"きょうはく — 交渉って名目の脅迫だ — it's intimidation disguised as negotiation" },
  { id:"e04_n09", ep:4, word:"人質", reading:"ひとじち", meaning:"hostage", tier:1, kb:[], wm:"ひとじち — 人質はガニメデの住民800万人 — 8 million hostages" },
  { id:"e04_n10", ep:4, word:"逸脱する", reading:"いつだつする", meaning:"to deviate / to stray from", tier:2, kb:[], wm:"いつだつする — 大いなる自然のシステムから逸脱し — humanity has deviated from nature's system" },

// EP05 additions
  { id:"e05_n01", ep:5, word:"友情", reading:"ゆうじょう", meaning:"friendship", tier:1, kb:[], wm:"ゆうじょう — 新たな関係と友情を祝って — toasting new relationships and friendship; hollow words before betrayal" },
  { id:"e05_n02", ep:5, word:"繁栄", reading:"はんえい", meaning:"prosperity / flourishing", tier:2, kb:[], wm:"はんえい — お互いの繁栄を願って — wishing each other prosperity; crime lord formalities" },
  { id:"e05_n03", ep:5, word:"幹部", reading:"かんぶ", meaning:"executive / senior member", tier:1, kb:[], wm:"かんぶ — レッドドラゴンの幹部 = senior executive of the Red Dragon syndicate" },
  { id:"e05_n04", ep:5, word:"心当たり", reading:"こころあたり", meaning:"having an idea about / knowing something of", tier:2, kb:[], wm:"こころあたり — 心当たりもある — I have some leads/ideas about it" },
  { id:"e05_n05", ep:5, word:"代償", reading:"だいしょう", meaning:"price / cost / sacrifice", tier:2, kb:[], wm:"だいしょう — 先走った揚げ句の代償だ — the price of acting impulsively. Gren lost his arm as 代償" },
  { id:"e05_n06", ep:5, word:"牙", reading:"きば", meaning:"fang / tusk", tier:2, kb:[], wm:"きば — やつは牙をなくした獣だ — Vicious says Mao lost his fangs; a predator weakened" },
  { id:"e05_n07", ep:5, word:"獣", reading:"けもの", meaning:"beast / wild animal", tier:2, kb:[], wm:"けもの — 別の血を求めさまよう獣の血 — blood of beasts that wander seeking different blood" },
  { id:"e05_n08", ep:5, word:"再会", reading:"さいかい", meaning:"reunion / meeting again", tier:1, kb:[], wm:"さいかい — 久しぶりの再会だぜ — Spike greets Vicious sarcastically as a reunion" },
  { id:"e05_n09", ep:5, word:"命乞い", reading:"いのちごい", meaning:"begging for one's life", tier:3, kb:[], wm:"いのちごい — 命乞いか — Vicious sneers: 'are you begging for your life?'" },
  { id:"e05_n10", ep:5, word:"恩人", reading:"おんじん", meaning:"benefactor / person one owes gratitude to", tier:2, kb:[], wm:"おんじん — 恩人だってさっさと殺しちまうんだからな — even his benefactor, he killed without hesitation" },

// EP06 additions
  { id:"e06_n01", ep:6, word:"抑制する", reading:"よくせいする", meaning:"to suppress / to restrain", tier:2, kb:[], wm:"よくせいする — 老化を抑制するメラトニンに似た物質 — suppresses aging like melatonin" },
  { id:"e06_n02", ep:6, word:"エネルギー", reading:"enerugi", meaning:"energy", tier:1, kb:[], wm:"エネルギー — 膨大なエネルギーが閉じ込められている — enormous energy sealed in the ring stone" },
  { id:"e06_n03", ep:6, word:"大ざっぱ", reading:"おおざっぱ", meaning:"rough / approximate / broad strokes", tier:2, kb:[], wm:"おおざっぱ — 大ざっぱに言えば仮説はこうだ — roughly speaking, the hypothesis goes like this" },
  { id:"e06_n04", ep:6, word:"義理", reading:"ぎり", meaning:"duty / obligation / honor", tier:2, kb:[], wm:"ぎり — 男は義理に生きるもんだ — men live by duty/obligation" },
  { id:"e06_n05", ep:6, word:"裏切り", reading:"うらぎり", meaning:"betrayal", tier:1, kb:[], wm:"うらぎり — Giraffe's 裏切り sent Zebra to the wilderness; backstabbing among allies" },
  { id:"e06_n06", ep:6, word:"仕組む", reading:"しくむ", meaning:"to scheme / to set up / to contrive", tier:2, kb:[], wm:"しくむ — ジラフが仕組んだ — Giraffe set it up; schemed the betrayal" },
  { id:"e06_n07", ep:6, word:"楽になる", reading:"らくになる", meaning:"to feel relief / to be released from suffering", tier:2, kb:[], wm:"らくになる — だが楽になってきた — Wen feels relief as he finally begins to die" },
  { id:"e06_n08", ep:6, word:"豚に真珠", reading:"ぶたにしんじゅ", meaning:"pearls before swine", tier:3, kb:[], wm:"ぶたにしんじゅ — おまえが持っていても豚に真珠だ — Wen says this to Spike about the ring" },

// EP07 additions
  { id:"e07_n01", ep:7, word:"入れ墨", reading:"いれずみ", meaning:"tattoo", tier:1, kb:[], wm:"いれずみ — ドラゴンの入れ墨ってだけじゃあ — just a dragon tattoo to go on isn't much" },
  { id:"e07_n02", ep:7, word:"積み荷", reading:"つみに", meaning:"cargo / freight / load", tier:1, kb:[], wm:"つみに — やつの積み荷はやばい — his cargo is dangerous (solid nitro)" },
  { id:"e07_n03", ep:7, word:"吹き飛ぶ", reading:"ふきとぶ", meaning:"to be blown away / to explode", tier:1, kb:[], wm:"ふきとぶ — この小惑星ごと吹っ飛ぶ量 — enough to blow up the whole asteroid" },
  { id:"e07_n04", ep:7, word:"誘爆", reading:"ゆうばく", meaning:"sympathetic detonation / chain explosion", tier:2, kb:[], wm:"ゆうばく — リアクターに誘爆が起きてて — chain explosions happening in the reactor" },
  { id:"e07_n05", ep:7, word:"一触即発", reading:"いっしょくそくはつ", meaning:"hair-trigger / on the verge of explosion", tier:3, kb:[], wm:"いっしょくそくはつ — てことは一触即発 — one touch and it explodes; used about the nitro" },
  { id:"e07_n06", ep:7, word:"安定剤", reading:"あんていざい", meaning:"stabilizer / sedative", tier:2, kb:[], wm:"あんていざい — 多分安定剤だ — the leaking substance is probably the stabilizer" },
  { id:"e07_n07", ep:7, word:"助かる", reading:"たすかる", meaning:"to be saved / to survive / to be a big help", tier:1, kb:[], wm:"たすかる — 助かったぜ — phew, we survived. VT saves Spike and Faye from the mine" },
  { id:"e07_n08", ep:7, word:"恩に着る", reading:"おんにきる", meaning:"to be grateful / to owe a debt of gratitude", tier:3, kb:[], wm:"おんにきる — ありがと、恩に着るよ — VT says this to the truckers who helped find Decker" },

// EP08 additions
  { id:"e08_n01", ep:8, word:"師匠", reading:"ししょう", meaning:"master / teacher / sensei", tier:1, kb:[], wm:"ししょう — よろしく師匠 — Roco starts calling Spike 師匠 after just one lesson" },
  { id:"e08_n02", ep:8, word:"強くなる", reading:"つよくなる", meaning:"to become strong / to get stronger", tier:1, kb:[], wm:"つよくなる — 俺あんたみたいに強くなりてえんだよ — Roco's goal: become as strong as Spike" },
  { id:"e08_n03", ep:8, word:"力", reading:"ちから", meaning:"strength / power / force", tier:1, kb:[], wm:"ちから — 大事なのは流れだ、力じゃない — what matters is flow, not brute 力" },
  { id:"e08_n04", ep:8, word:"流れ", reading:"ながれ", meaning:"flow / current / stream", tier:1, kb:[], wm:"ながれ — 力の流れをコントロールする — control the flow of force; Spike's fighting philosophy" },
  { id:"e08_n05", ep:8, word:"妹", reading:"いもうと", meaning:"younger sister", tier:1, kb:[], wm:"いもうと — 妹思いなんだな — Spike notes Roco loves his younger sister Stella" },
  { id:"e08_n06", ep:8, word:"体質", reading:"たいしつ", meaning:"constitution / physical disposition", tier:2, kb:[], wm:"たいしつ — あたしは体質のせいで目が — her physical constitution causes the Venus disease" },
  { id:"e08_n07", ep:8, word:"慣れる", reading:"なれる", meaning:"to get used to / to become accustomed", tier:1, kb:[], wm:"なれる — 慣れればどうってことないわ — you get used to it; Stella about her blindness" },
  { id:"e08_n08", ep:8, word:"友達", reading:"ともだち", meaning:"friend", tier:1, kb:[], wm:"ともだち — あんたと友達になれたかな — Roco's dying words: could we have been friends?" },

// EP09 additions
  { id:"e09_n01", ep:9, word:"謎", reading:"なぞ", meaning:"mystery / riddle / enigma", tier:1, kb:[], wm:"なぞ — 謎の地上絵 — mysterious geoglyphs. 謎 is used constantly for anything unexplained" },
  { id:"e09_n02", ep:9, word:"落書き", reading:"らくがき", meaning:"graffiti / doodle / scrawl", tier:1, kb:[], wm:"らくがき — 地球に落書き — drawing graffiti on Earth. The satellite's lonely art project" },
  { id:"e09_n03", ep:9, word:"宇宙人", reading:"うちゅうじん", meaning:"alien / extraterrestrial", tier:1, kb:[], wm:"うちゅうじん — 宇宙人ですよ、決まってるじゃないですか — the commentator insists it's aliens" },
  { id:"e09_n04", ep:9, word:"ハッキング", reading:"hakkingu", meaning:"hacking", tier:1, kb:[], wm:"ハッキング — 衛星にハッキングした — hacked into the satellite. Core concept of the episode" },
  { id:"e09_n05", ep:9, word:"アクセスコード", reading:"access code", meaning:"access code", tier:1, kb:[], wm:"アクセスコード — 衛星へのアクセスコードが失われている — the access code is gone; can't reach the satellite" },
  { id:"e09_n06", ep:9, word:"独自", reading:"どくじ", meaning:"unique / independent / original", tier:2, kb:[], wm:"どくじ — 独自の判断で行動を続ける — continues acting on its own independent judgment" },
  { id:"e09_n07", ep:9, word:"寂しい", reading:"さびしい", meaning:"lonely / lonesome", tier:1, kb:[], wm:"さびしい — きっと寂しかったんだろ — Spike says the satellite acted out of loneliness" },
  { id:"e09_n08", ep:9, word:"約束", reading:"やくそく", meaning:"promise / appointment", tier:1, kb:[], wm:"やくそく — 約束だよ、ビバップ号の仲間にしてくれるってね — Ed's 'promise' to join the Bebop" },

// EP10 additions
  { id:"e10_n01", ep:10, word:"ふるさと", reading:"ふるさと", meaning:"hometown / birthplace", tier:1, kb:[], wm:"ふるさと — ガニメデってあんたのふるさとなんでしょ — Faye notes Ganymede is Jet's hometown" },
  { id:"e10_n02", ep:10, word:"久しぶり", reading:"ひさしぶり", meaning:"long time no see / after a long time", tier:1, kb:[], wm:"ひさしぶり — 久しぶりだな、ドネリー — meeting an old acquaintance after years apart" },
  { id:"e10_n03", ep:10, word:"懐かしい", reading:"なつかしい", meaning:"nostalgic / dear (memories)", tier:1, kb:[], wm:"なつかしい — ガニメデの時間は止まったまま — Jet is stuck in 懐かしい feelings" },
  { id:"e10_n04", ep:10, word:"恋人", reading:"こいびと", meaning:"lover / romantic partner", tier:1, kb:[], wm:"こいびと — リントはただの恋人 — Alisa says Lint is just her boyfriend; casual delivery" },
  { id:"e10_n05", ep:10, word:"共犯", reading:"きょうはん", meaning:"accomplice / co-conspirator", tier:2, kb:[], wm:"きょうはん — 一緒にいればおまえも共犯になっちまう — being with him makes her an accomplice too" },
  { id:"e10_n06", ep:10, word:"現実感", reading:"げんじつかん", meaning:"sense of reality / feeling of realness", tier:2, kb:[], wm:"げんじつかん — ただ現実感がないだけだった — he just felt no sense of reality when she left" },
  { id:"e10_n07", ep:10, word:"麻痺する", reading:"まひする", meaning:"to go numb / to be paralyzed", tier:2, kb:[], wm:"まひする — 自分の中で何かがまひしていくのを感じた — something going numb inside him" },
  { id:"e10_n08", ep:10, word:"生き方", reading:"いきかた", meaning:"way of life / how one lives", tier:1, kb:[], wm:"いきかた — 自分で生き方を決めたかったの — she wanted to decide her own way of life" },

// EP11 additions
  { id:"e11_n01", ep:11, word:"運命", reading:"うんめい", meaning:"fate / destiny", tier:1, kb:[], wm:"うんめい — まあこれも運命なんだが — Jet narrates: well, this is fate too" },
  { id:"e11_n02", ep:11, word:"自由業", reading:"じゆうぎょう", meaning:"freelance work / self-employment", tier:2, kb:[], wm:"じゆうぎょう — 要するに自由業であり仕事がないときは全然ない — freelance: when there's no work, there's none at all" },
  { id:"e11_n03", ep:11, word:"稼ぐ", reading:"かせぐ", meaning:"to earn / to make money", tier:1, kb:[], wm:"かせぐ — 手っ取り早く稼ごうとしてしまう — always trying to earn money the quick way" },
  { id:"e11_n04", ep:11, word:"上前をはねる", reading:"うわまえをはねる", meaning:"to skim off the top / to take a cut", tier:3, kb:[], wm:"うわまえをはねる — 人の上前をはねて生きていこうとする人間には天罰が — those who skim off others get divine punishment" },
  { id:"e11_n05", ep:11, word:"突然変異", reading:"とつぜんへんい", meaning:"mutation", tier:2, kb:[], wm:"とつぜんへんい — ネズミか何かが突然変異を起こして謎の生物に進化 — a mutated rat evolved into a mystery creature" },
  { id:"e11_n06", ep:11, word:"傷跡", reading:"きずあと", meaning:"scar / wound mark", tier:2, kb:[], wm:"きずあと — この首の傷跡 — the scar on the neck proves it wasn't a normal rat bite" },
  { id:"e11_n07", ep:11, word:"熱源", reading:"ねつげん", meaning:"heat source", tier:2, kb:[], wm:"ねつげん — 熱源を感知できるようになってる — Spike's device can detect heat sources to find the creature" },

// EP12 additions
  { id:"e12_n01", ep:12, word:"通信", reading:"つうしん", meaning:"communication / transmission", tier:1, kb:[], wm:"つうしん — カリストからの通信はビシャス様に直接入った — the communication came directly to Vicious" },
  { id:"e12_n02", ep:12, word:"取引", reading:"とりひき", meaning:"deal / transaction / trade", tier:1, kb:[], wm:"とりひき — レッドアイの取引を要求 — demanding a deal for Red Eye drugs" },
  { id:"e12_n03", ep:12, word:"帰還兵", reading:"きかんへい", meaning:"returning soldier / veteran", tier:2, kb:[], wm:"きかんへい — タイタン帰還兵 — veterans who survived the Titan campaign. Both Gren and Spike" },
  { id:"e12_n04", ep:12, word:"防寒着", reading:"ぼうかんぎ", meaning:"cold weather clothing / winter gear", tier:2, kb:[], wm:"ぼうかんぎ — 十分な防寒着を用意して — prepare adequate cold weather gear for Callisto" },
  { id:"e12_n05", ep:12, word:"冷却剤", reading:"れいきゃくざい", meaning:"coolant / refrigerant", tier:2, kb:[], wm:"れいきゃくざい — ラジエーターから冷却剤を抜いて行きやがった — Faye drained the coolant from the radiator" },
  { id:"e12_n06", ep:12, word:"居場所", reading:"いばしょ", meaning:"one's place / where one belongs", tier:1, kb:[], wm:"いばしょ — 戻ってもおまえの居場所はないぜ — even if you come back, there's no place for you here" },
  { id:"e12_n07", ep:12, word:"しかばね", reading:"しかばね", meaning:"corpse / dead body", tier:2, kb:[], wm:"しかばね — しかばねどもが — Vicious insults his loyal guards as corpses even while alive" },
  { id:"e12_n08", ep:12, word:"掟", reading:"おきて", meaning:"code / rule / law of the land", tier:2, kb:[], wm:"おきて — 弱肉強食がこの世のおきて — survival of the fittest is the rule of this world" },

// EP13 additions
  { id:"e13_n01", ep:13, word:"部隊", reading:"ぶたい", meaning:"military unit / troop", tier:1, kb:[], wm:"ぶたい — タイタンの同じ部隊にいた — they were in the same unit on Titan" },
  { id:"e13_n02", ep:13, word:"容疑", reading:"ようぎ", meaning:"suspicion / charge (crime)", tier:2, kb:[], wm:"ようぎ — スパイの容疑で投獄された — imprisoned on suspicion of being a spy" },
  { id:"e13_n03", ep:13, word:"証言", reading:"しょうげん", meaning:"testimony / statement", tier:2, kb:[], wm:"しょうげん — ビシャスが証言したと聞かされたよ — told that Vicious gave testimony against him" },
  { id:"e13_n04", ep:13, word:"薬漬け", reading:"くすりづけ", meaning:"strung out on drugs / dependent on medication", tier:2, kb:[], wm:"くすりづけ — 刑務所で精神をやられて薬漬けになった — his mind broke and he became drug-dependent in prison" },
  { id:"e13_n05", ep:13, word:"バランスが崩れる", reading:"バランスがくずれる", meaning:"balance is disrupted / thrown off", tier:2, kb:[], wm:"バランスがくずれる — ホルモンのバランスが崩れてこうなった — hormonal imbalance caused this physical change" },
  { id:"e13_n06", ep:13, word:"悲しそう", reading:"かなしそう", meaning:"looking sad / appearing sorrowful", tier:1, kb:[], wm:"かなしそう — 笑ってたよ、悲しそうに笑ってた — she was smiling, but sadly; Julia's expression at the bar" },
  { id:"e13_n07", ep:13, word:"確かめる", reading:"たしかめる", meaning:"to confirm / to verify / to check", tier:1, kb:[], wm:"たしかめる — それを確かめたいんだ — Gren wants to verify whether Vicious really framed him" },

// EP14 additions
  { id:"e14_n01", ep:14, word:"手がかり", reading:"てがかり", meaning:"clue / lead (in investigation)", tier:1, kb:[], wm:"てがかり — 肝心の賞金首の手がかりはなし — not a single clue about the actual mastermind" },
  { id:"e14_n02", ep:14, word:"手口", reading:"てぐち", meaning:"method / modus operandi", tier:2, kb:[], wm:"てぐち — 20件とも全く同じ手口だ — all 20 cases used exactly the same method" },
  { id:"e14_n03", ep:14, word:"潜入", reading:"せんにゅう", meaning:"infiltration / sneaking in", tier:2, kb:[], wm:"せんにゅう — 料金所に潜入 — infiltrating the tollbooth to install the device" },
  { id:"e14_n04", ep:14, word:"強奪", reading:"ごうだつ", meaning:"robbery / seizure by force", tier:2, kb:[], wm:"ごうだつ — クレジットカードから全額を一瞬にして強奪 — instantly seizing the full amount from credit cards" },
  { id:"e14_n05", ep:14, word:"復讐", reading:"ふくしゅう", meaning:"revenge / vengeance", tier:1, kb:[], wm:"ふくしゅう — 当時復讐に燃えていたヘックスはこの計画を仕組んだ — Hex devised the plan burning with revenge" },
  { id:"e14_n06", ep:14, word:"もうろく", reading:"もうろく", meaning:"senile / dotage / losing one's mind with age", tier:3, kb:[], wm:"もうろく — すっかりもうろくしちまって — he's completely senile; Hex forgot his own scheme" },
  { id:"e14_n07", ep:14, word:"根本的", reading:"こんぽんてき", meaning:"fundamental / basic", tier:2, kb:[], wm:"こんぽんてき — ゲートの根本的な欠陥 — the fundamental flaw of the gate system" },
  { id:"e14_n08", ep:14, word:"詮索", reading:"せんさく", meaning:"prying / nosing around / meddling", tier:2, kb:[], wm:"せんさく — 余計な詮索はせんほうが身のためだ — unnecessary prying is dangerous for your health" },

// EP15 additions
  { id:"e15_n01", ep:15, word:"解凍", reading:"かいとう", meaning:"defrosting / thawing out", tier:1, kb:[], wm:"かいとう — 彼女は無事解凍されたと思うかね — was she successfully defrosted? The doctor's check" },
  { id:"e15_n02", ep:15, word:"保存", reading:"ほぞん", meaning:"preservation / storage / saving", tier:1, kb:[], wm:"ほぞん — 冷凍保存されていたんです — she had been preserved by cryogenic freezing for 54 years" },
  { id:"e15_n03", ep:15, word:"事故", reading:"じこ", meaning:"accident", tier:1, kb:[], wm:"じこ — 大変な事故に巻き込まれたようです — she seems to have been caught in a terrible accident" },
  { id:"e15_n04", ep:15, word:"不条理", reading:"ふじょうり", meaning:"absurd / unreasonable / irrational", tier:2, kb:[], wm:"ふじょうり — 勝手に生き返らせて借金払えなんて不条理よ — it's absurd: revive her without asking and demand payment" },
  { id:"e15_n05", ep:15, word:"遺産", reading:"いさん", meaning:"inheritance / estate / legacy", tier:2, kb:[], wm:"いさん — 彼の遺産は全て君のものになる — all his estate will become yours; the trap Whitney sets" },
  { id:"e15_n06", ep:15, word:"未来", reading:"みらい", meaning:"the future", tier:1, kb:[], wm:"みらい — 過去はどうあれ未来はあるだろ — whatever the past, there's a future. Spike to Faye" },
  { id:"e15_n07", ep:15, word:"出会い", reading:"であい", meaning:"encounter / meeting (by chance)", tier:1, kb:[], wm:"であい — 生きていればすてきな出会いだってあるかもしれない — if you're alive, wonderful encounters await" },
  { id:"e15_n08", ep:15, word:"詐欺師", reading:"さぎし", meaning:"swindler / con artist", tier:1, kb:[], wm:"さぎし — 立派な詐欺師だよ — you're a first-rate con artist; Spike to Ronnie/Londes in EP23 too" },

// EP16 additions
  { id:"e16_n01", ep:16, word:"投降", reading:"とうこう", meaning:"surrender / giving oneself up", tier:2, kb:[], wm:"とうこう — おとなしく投降すれば — if you surrender quietly... the prisoner ignores this" },
  { id:"e16_n02", ep:16, word:"反乱", reading:"はんらん", meaning:"rebellion / uprising / mutiny", tier:1, kb:[], wm:"はんらん — 囚人の反乱が起きたらしい — a prisoner rebellion apparently broke out on the transport ship" },
  { id:"e16_n03", ep:16, word:"逮捕", reading:"たいほ", meaning:"arrest", tier:1, kb:[], wm:"たいほ — ウダイ・タクシム、おまえを逮捕する — Jet's formal arrest declaration; his old police instinct" },
  { id:"e16_n04", ep:16, word:"管轄外", reading:"かんかつがい", meaning:"outside one's jurisdiction", tier:2, kb:[], wm:"かんかつがい — 管轄外だろう — it's outside your jurisdiction; Bob warns Jet off the case" },
  { id:"e16_n05", ep:16, word:"組織", reading:"そしき", meaning:"organization / syndicate", tier:1, kb:[], wm:"そしき — 組織にとって邪魔な存在だったおまえを消すために — to eliminate you who were a nuisance to the organization" },
  { id:"e16_n06", ep:16, word:"仕組まれる", reading:"しくまれる", meaning:"to be set up / to be framed", tier:2, kb:[], wm:"しくまれる — あれは初めから仕組まれていたのさ — it was set up from the very beginning" },
  { id:"e16_n07", ep:16, word:"禁煙", reading:"きんえん", meaning:"no smoking / quitting smoking", tier:1, kb:[], wm:"きんえん — 禁煙10日目だ — it's my 10th day of not smoking; Fad's mundane detail before betrayal" },

// EP17 additions
  { id:"e17_n01", ep:17, word:"非常事態", reading:"ひじょうじたい", meaning:"emergency / state of emergency", tier:1, kb:[], wm:"ひじょうじたい — こういうのを非常事態っていうんじゃないの — isn't this what you'd call an emergency?" },
  { id:"e17_n02", ep:17, word:"食料", reading:"しょくりょう", meaning:"food / provisions", tier:1, kb:[], wm:"しょくりょう — おまえは食料でも調達して — you go find some food/provisions" },
  { id:"e17_n03", ep:17, word:"調達", reading:"ちょうたつ", meaning:"to procure / to gather / to obtain", tier:2, kb:[], wm:"ちょうたつ — 食料でも調達して — go procure some food. 調達 = getting/sourcing supplies" },
  { id:"e17_n04", ep:17, word:"慣性の法則", reading:"かんせいのほうそく", meaning:"law of inertia", tier:2, kb:[], wm:"かんせいのほうそく — 慣性の法則でエウロパに着くんだよ — by the law of inertia we'll reach Europa eventually" },
  { id:"e17_n05", ep:17, word:"逆恨み", reading:"さかうらみ", meaning:"misplaced grudge / blaming the wrong person", tier:3, kb:[], wm:"さかうらみ — そりゃ逆恨みってやつじゃ — that's a misplaced grudge; Domino's brother blamed the mushroom seller" },
  { id:"e17_n06", ep:17, word:"現金のみ", reading:"げんきんのみ", meaning:"cash only", tier:1, kb:[], wm:"げんきんのみ — 現金のみだ、マネーカードも許さん — cash only; no money cards accepted" },
  { id:"e17_n07", ep:17, word:"栽培", reading:"さいばい", meaning:"cultivation / growing (plants)", tier:2, kb:[], wm:"さいばい — この中で栽培しているとは — to think they were cultivating them inside the ship" },

// EP18 additions
  { id:"e18_n01", ep:18, word:"竜宮城", reading:"りゅうぐうじょう", meaning:"Dragon Palace (from Urashima Taro folktale)", tier:2, kb:[], wm:"りゅうぐうじょう — とんだ竜宮城だぜ — what a Dragon Palace this turned out to be; bitter irony" },
  { id:"e18_n02", ep:18, word:"玉手箱", reading:"たまてばこ", meaning:"treasure box (Urashima Taro / Pandora's box)", tier:2, kb:[], wm:"たまてばこ — 土産にと渡されたのが玉手箱 — the parting gift was the treasure box; theme of the episode" },
  { id:"e18_n03", ep:18, word:"遺物", reading:"いぶつ", meaning:"relic / artifact / remnant", tier:2, kb:[], wm:"いぶつ — 古き良き時代の遺物ってやつだ — a relic of the good old days; about the VHS tape" },
  { id:"e18_n04", ep:18, word:"土産", reading:"みやげ", meaning:"souvenir / gift", tier:1, kb:[], wm:"みやげ — 土産にと渡されたのが玉手箱 — as a parting gift he was given the treasure box" },
  { id:"e18_n05", ep:18, word:"差出人", reading:"さしだしにん", meaning:"sender (of a package/letter)", tier:2, kb:[], wm:"さしだしにん — 差出人不明 — sender unknown; the mysterious tape arrives with no sender information" },
  { id:"e18_n06", ep:18, word:"応援する", reading:"おうえんする", meaning:"to cheer for / to support", tier:1, kb:[], wm:"おうえんする — あたしは必ずあなたを応援している — young Faye's message: I'll always cheer for you" },
  { id:"e18_n07", ep:18, word:"細胞", reading:"さいぼう", meaning:"cell (biological)", tier:2, kb:[], wm:"さいぼう — 体の細胞一つ一つ目覚めていますか — is every single cell of your body awakening?" },

// EP19 additions
  { id:"e19_n01", ep:19, word:"釣り", reading:"つり", meaning:"fishing", tier:1, kb:[], wm:"つり — 大体性に合わないのよ、ただ待ってるだけなんてのはさ — Faye hates fishing; just waiting isn't her style" },
  { id:"e19_n02", ep:19, word:"極意", reading:"ごくい", meaning:"essence / secret / ultimate truth (of a skill)", tier:2, kb:[], wm:"ごくい — ポイントを定めひたすら待つ、それが釣りの極意 — the essence of fishing is to set your spot and just wait" },
  { id:"e19_n03", ep:19, word:"世直し", reading:"よなおし", meaning:"social reform / fixing the world", tier:2, kb:[], wm:"よなおし — こりゃ世直しってわけか — so this is world reform? Spike's sarcastic take on the pirates' Robin Hood logic" },
  { id:"e19_n04", ep:19, word:"感染", reading:"かんせん", meaning:"infection / contagion", tier:1, kb:[], wm:"かんせん — もしウイルスに感染したら — if the ship gets infected with the virus" },
  { id:"e19_n05", ep:19, word:"漂流", reading:"ひょうりゅう", meaning:"adrift / drifting", tier:2, kb:[], wm:"ひょうりゅう — コンピューターが壊れちゃって漂流してるの — the computer broke and the ship is drifting" },
  { id:"e19_n06", ep:19, word:"大気圏再突入", reading:"たいきけんさいとつにゅう", meaning:"atmospheric reentry", tier:2, kb:[], wm:"たいきけんさいとつにゅう — the climax: reentry at the right angle or burn up forever" },
  { id:"e19_n07", ep:19, word:"引力", reading:"いんりょく", meaning:"gravity / gravitational pull", tier:2, kb:[], wm:"いんりょく — 地球の引力圏 — Earth's gravitational zone; Spike needs to use it to decelerate" },
  { id:"e19_n08", ep:19, word:"骨董品", reading:"こっとうひん", meaning:"antique / vintage item", tier:1, kb:[], wm:"こっとうひん — 本気でこんな骨董品を？ — are you seriously using this antique? (about the biplane)" },

// EP20 additions
  { id:"e20_n01", ep:20, word:"うわさ", reading:"うわさ", meaning:"rumor / hearsay", tier:1, kb:[], wm:"うわさ — これはあくまでうわさだが — this is strictly a rumor, but... Jet uses this to ask about Mad Pierrot" },
  { id:"e20_n02", ep:20, word:"不運", reading:"ふうん", meaning:"bad luck / misfortune", tier:1, kb:[], wm:"ふうん — おまえの相棒もつくづく不運だな — your partner is really and truly unlucky" },
  { id:"e20_n03", ep:20, word:"極秘扱い", reading:"ごくひあつかい", meaning:"top secret treatment / classified", tier:2, kb:[], wm:"ごくひあつかい — こいつは極秘扱いだ — this case is classified top secret" },
  { id:"e20_n04", ep:20, word:"脱走", reading:"だっそう", meaning:"escape / breakout / desertion", tier:2, kb:[], wm:"だっそう — 初めは復讐のために収容所を脱走した — escaped from the facility initially for revenge" },
  { id:"e20_n05", ep:20, word:"純粋", reading:"じゅんすい", meaning:"pure / innocent / naive", tier:2, kb:[], wm:"じゅんすい — ガキほど純粋で残酷なもんはねえ — nothing is as pure and cruel as a child" },
  { id:"e20_n06", ep:20, word:"残酷", reading:"ざんこく", meaning:"cruel / brutal", tier:2, kb:[], wm:"ざんこく — 純粋で残酷 — pure and cruel; Tongpu's childlike mind with superhuman killing ability" },
  { id:"e20_n07", ep:20, word:"戦闘能力", reading:"せんとうのうりょく", meaning:"combat capability / fighting ability", tier:2, kb:[], wm:"せんとうのうりょく — 超人的な戦闘能力を持った子ども — a child with superhuman combat capabilities" },

// EP21 additions
  { id:"e21_n01", ep:21, word:"奇妙", reading:"きみょう", meaning:"strange / bizarre / peculiar", tier:1, kb:[], wm:"きみょう — この奇妙な事件の始まりは — the beginning of this bizarre case" },
  { id:"e21_n02", ep:21, word:"行方", reading:"ゆくえ", meaning:"whereabouts / movements", tier:1, kb:[], wm:"ゆくえ — パオの行方を調べることにした — decided to investigate Pao's whereabouts" },
  { id:"e21_n03", ep:21, word:"不審", reading:"ふしん", meaning:"suspicious / doubtful", tier:2, kb:[], wm:"ふしん — 不審に思った俺は — feeling suspicious, I decided to investigate" },
  { id:"e21_n04", ep:21, word:"協力", reading:"きょうりょく", meaning:"cooperation / assistance", tier:1, kb:[], wm:"きょうりょく — 私に協力してください — please cooperate with me; Meifa asks Jet for help" },
  { id:"e21_n05", ep:21, word:"エネルギー", reading:"enerugi", meaning:"energy", tier:1, kb:[], wm:"エネルギー — 太陽からやってくるエネルギー — energy coming from the sun; feng shui cosmology" },
  { id:"e21_n06", ep:21, word:"磁石", reading:"じしゃく", meaning:"magnet / compass needle", tier:1, kb:[], wm:"じしゃく — 磁石を外してあるのに — even though the magnet has been removed; the sun stone overrides it" },
  { id:"e21_n07", ep:21, word:"引き合う", reading:"ひきあう", meaning:"to attract each other / to be drawn together", tier:2, kb:[], wm:"ひきあう — 石同士が引き合って父のいる場所を示してる — the stones attract each other and point to her father" },
  { id:"e21_n08", ep:21, word:"コンサルタント", reading:"konsarutanto", meaning:"consultant", tier:2, kb:[], wm:"コンサルタント — 組織のコンサルタントをしてた — Pao was a consultant for the organization" },

// EP22 additions
  { id:"e22_n01", ep:22, word:"爆弾", reading:"ばくだん", meaning:"bomb", tier:1, kb:[], wm:"ばくだん — 爆弾を仕掛ける — to plant a bomb; what Teddy Bomber does to every tall building" },
  { id:"e22_n02", ep:22, word:"犯罪周期", reading:"はんざいしゅうき", meaning:"crime cycle / criminal pattern", tier:2, kb:[], wm:"はんざいしゅうき — ユーの犯罪周期を計算すれば — by calculating your crime cycle it was easy to predict" },
  { id:"e22_n03", ep:22, word:"哲学", reading:"てつがく", meaning:"philosophy", tier:2, kb:[], wm:"てつがく — 哲学なき資本主義が生み出した全ての無駄に対して — against all the waste produced by capitalism without philosophy" },
  { id:"e22_n04", ep:22, word:"美学", reading:"びがく", meaning:"aesthetics / personal code / style", tier:2, kb:[], wm:"びがく — 自分の美学にこだわる — he sticks to his personal aesthetics; Teddy never targets people" },
  { id:"e22_n05", ep:22, word:"引退", reading:"いんたい", meaning:"retirement / withdrawal", tier:1, kb:[], wm:"いんたい — きょう限りでカウボーイを引退する — as of today I retire from being a cowboy" },
  { id:"e22_n06", ep:22, word:"道楽", reading:"どうらく", meaning:"hobby / pastime / self-indulgence", tier:3, kb:[], wm:"どうらく — ぼんぼんの道楽よ — it's just a rich kid's hobby; Faye dismisses Andy's cowboy adventure" },
  { id:"e22_n07", ep:22, word:"根拠", reading:"こんきょ", meaning:"basis / grounds / evidence", tier:2, kb:[], wm:"こんきょ — それじゃ何を根拠に言ってんだよ — then what are your grounds for saying that?" },

// EP23 additions
  { id:"e23_n01", ep:23, word:"肉体", reading:"にくたい", meaning:"the body / flesh", tier:1, kb:[], wm:"にくたい — 肉体とは単なる物体であり — the body is merely an object; the cult's opening sermon" },
  { id:"e23_n02", ep:23, word:"魂", reading:"たましい", meaning:"soul / spirit", tier:1, kb:[], wm:"たましい — 汚れた肉体を捨てよ、目覚めよ魂 — discard the impure body, awaken the soul" },
  { id:"e23_n03", ep:23, word:"欲望", reading:"よくぼう", meaning:"desire / craving / lust", tier:2, kb:[], wm:"よくぼう — 物欲、食欲、性欲、独占欲、名声欲 — material desire, hunger, lust, possessiveness, desire for fame" },
  { id:"e23_n04", ep:23, word:"信者", reading:"しんじゃ", meaning:"believer / follower / cult member", tier:1, kb:[], wm:"しんじゃ — スクラッチの信者たちは — the believers of Scratch are dying. 2万人 already" },
  { id:"e23_n05", ep:23, word:"入信", reading:"にゅうしん", meaning:"joining a religion / converting", tier:2, kb:[], wm:"にゅうしん — あなたが入信したきっかけというのは — what led you to join (the religion)?" },
  { id:"e23_n06", ep:23, word:"腐りきった", reading:"くさりきった", meaning:"completely rotten / utterly corrupt", tier:2, kb:[], wm:"くさりきった — この腐りきった世界で生きていくのは容易なことじゃない — living in this utterly rotten world is not easy" },
  { id:"e23_n07", ep:23, word:"架空", reading:"かくう", meaning:"fictitious / imaginary / made-up", tier:2, kb:[], wm:"かくう — ロンデスなんて男はこの世に存在しない、俺が作り出した架空のキャラクター — a fictitious character I created" },
  { id:"e23_n08", ep:23, word:"生命維持装置", reading:"せいめいいじそうち", meaning:"life support system", tier:2, kb:[], wm:"せいめいいじそうち — 生命維持装置は止めるなよ — don't stop the life support system; Ronnie is physically alive in the hospital" },

// EP24 additions
  { id:"e24_n01", ep:24, word:"絆", reading:"きずな", meaning:"bond / tie / connection", tier:1, kb:[], wm:"きずな — 人間、絆ってのは大事にしないと — bonds between people are important to cherish" },
  { id:"e24_n02", ep:24, word:"幽霊", reading:"ゆうれい", meaning:"ghost / spirit", tier:1, kb:[], wm:"ゆうれい — 実は彼女はね、幽霊なのよ — actually, she's a ghost; the old classmate's joke about Faye" },
  { id:"e24_n03", ep:24, word:"同級生", reading:"どうきゅうせい", meaning:"classmate / schoolmate", tier:1, kb:[], wm:"どうきゅうせい — ハイスクールのときの同級の — classmate from high school; confirms Faye's past was real" },
  { id:"e24_n04", ep:24, word:"探し物", reading:"さがしもの", meaning:"something being searched for / lost item", tier:1, kb:[], wm:"さがしもの — ちょっと探し物があって — I have something I'm looking for; Ed looking for water" },
  { id:"e24_n05", ep:24, word:"隕石", reading:"いんせき", meaning:"meteorite", tier:2, kb:[], wm:"いんせき — しょっちゅう隕石が降ってきて地形が変わってる — meteorites keep falling and changing the terrain" },
  { id:"e24_n06", ep:24, word:"転々とする", reading:"てんてんとする", meaning:"to move from place to place", tier:2, kb:[], wm:"てんてんとする — あちこち転々としながら探してるって言ってた — said he was searching while moving from place to place" },
  { id:"e24_n07", ep:24, word:"懸ける", reading:"かける", meaning:"to bet / to wager / to stake", tier:2, kb:[], wm:"かける — 賞金を懸けたのもまさかおまえ — was it really you who put up the bounty? (Ed did for just 50 woolongs)" },

// EP25 additions
  { id:"e25_n01", ep:25, word:"処刑", reading:"しょけい", meaning:"execution", tier:1, kb:[], wm:"しょけい — ビシャスは処刑されます — Vicious will be executed; the elder council's sentence" },
  { id:"e25_n02", ep:25, word:"拘束", reading:"こうそく", meaning:"restraint / detention / confinement", tier:2, kb:[], wm:"こうそく — 長老たちに拘束されました — he was detained by the elders after the failed coup" },
  { id:"e25_n03", ep:25, word:"裁き", reading:"さばき", meaning:"judgment / ruling / trial", tier:2, kb:[], wm:"さばき — 裁きの広間へ連れていけ — take him to the hall of judgment" },
  { id:"e25_n04", ep:25, word:"片割れ", reading:"かたわれ", meaning:"other half / one's missing piece", tier:2, kb:[], wm:"かたわれ — あいつは俺がなくした俺の片割れさ — she's the fragment of myself that I lost" },
  { id:"e25_n05", ep:25, word:"組織を抜ける", reading:"そしきをぬける", meaning:"to leave the organization / to quit the syndicate", tier:2, kb:[], wm:"そしきをぬける — これが終わったら俺は組織を抜ける — when this is over I'll leave the organization" },
  { id:"e25_n06", ep:25, word:"継承", reading:"けいしょう", meaning:"succession / inheritance (of power)", tier:2, kb:[], wm:"けいしょう — 組織の継承問題を巡って — surrounding the succession question of the organization" },
  { id:"e25_n07", ep:25, word:"異分子", reading:"いぶんし", meaning:"dissident element / foreign body", tier:3, kb:[], wm:"いぶんし — 異分子は種の一粒までつぶす — they crush every last dissident to the last seed; the elders' ideology" },

// EP26 additions
  { id:"e26_n01", ep:26, word:"獣", reading:"けもの", meaning:"beast / wild animal", tier:2, kb:[], wm:"けもの — 行き場をなくした獣か — a beast that has nowhere to go; Vicious calls Spike this" },
  { id:"e26_n02", ep:26, word:"守り星", reading:"まもりぼし", meaning:"guardian star / protecting star", tier:2, kb:[], wm:"まもりぼし — 全て自分の星を持っている、守り星となる — every living thing has its own star, which becomes a guardian star" },
  { id:"e26_n03", ep:26, word:"流れる", reading:"ながれる", meaning:"to flow / to stream / (of a star) to shoot", tier:1, kb:[], wm:"ながれる — 命が尽きるとき星もまた流れて消えゆく — when life ends, the star too flows and fades away" },
  { id:"e26_n04", ep:26, word:"現実", reading:"げんじつ", meaning:"reality", tier:1, kb:[], wm:"げんじつ — 俺が本当に生きてるかどうか確かめに行くんだ — going to confirm whether I'm really alive; what is real?" },
  { id:"e26_n05", ep:26, word:"縛られる", reading:"しばられる", meaning:"to be bound / to be tied down", tier:2, kb:[], wm:"しばられる — あんたのほうが過去に縛られてる — you're more tied down by the past than you think, Faye says to Spike" },
  { id:"e26_n06", ep:26, word:"糸の切れた凧", reading:"いとのきれたたこ", meaning:"a kite with a broken string (rudderless)", tier:3, kb:[], wm:"いとのきれたたこ — みんな糸の切れた凧みたいに行き場を無くしちまってる — everyone is rudderless like a kite with a broken string" },
  { id:"e26_n07", ep:26, word:"運命", reading:"うんめい", meaning:"fate / destiny", tier:1, kb:[], wm:"うんめい — どの道おまえとはこうなる運命だ — it was fate that things would come to this between us" },

// MOVIE additions
  { id:"mv_n01", ep:27, word:"事故", reading:"じこ", meaning:"accident", tier:1, kb:[], wm:"じこ — タンクローリーの爆発事故 — the tanker truck explosion accident that opens the film" },
  { id:"mv_n02", ep:27, word:"生物兵器", reading:"せいぶつへいき", meaning:"biological weapon", tier:2, kb:[], wm:"せいぶつへいき — 生物兵器の使用も考えられるとして — the use of biological weapons is also being considered" },
  { id:"mv_n03", ep:27, word:"痕跡", reading:"こんせき", meaning:"trace / mark / evidence left behind", tier:2, kb:[], wm:"こんせき — 痕跡が何も見つからない — no traces found at all; the nanomachines vanish completely" },
  { id:"mv_n04", ep:27, word:"血液", reading:"けつえき", meaning:"blood", tier:1, kb:[], wm:"けつえき — 誰かの血液？内密に調べてほしいの — someone's blood? I need you to investigate it secretly" },
  { id:"mv_n05", ep:27, word:"培養", reading:"ばいよう", meaning:"cultivation / culturing (cells/bacteria)", tier:2, kb:[], wm:"ばいよう — 私の中にワクチンがあるなら培養して民間人に使えるはず — if there's a vaccine in me, it can be cultured and used on civilians" },
  { id:"mv_n06", ep:27, word:"軍事利用", reading:"ぐんじりよう", meaning:"military use / militarization", tier:2, kb:[], wm:"ぐんじりよう — ナノマシンの軍事利用はアムステルダム条約で禁止されてるはず — military use of nanomachines should be prohibited by the Amsterdam Treaty" },
  { id:"mv_n07", ep:27, word:"抹殺", reading:"まっさつ", meaning:"erasure / obliteration / killing off", tier:2, kb:[], wm:"まっさつ — ナノマシンに関する全ての情報を抹殺することだ — our purpose is to obliterate all information related to nanomachines" },
  { id:"mv_n08", ep:27, word:"記憶を失う", reading:"きおくをうしなう", meaning:"to lose one's memory / amnesia", tier:1, kb:[], wm:"きおくをうしなう — 俺は記憶を失っていた、自分が誰なのかすら — I had lost my memory, couldn't even remember who I was" },
  { id:"mv_n09", ep:27, word:"境界線", reading:"きょうかいせん", meaning:"boundary line / dividing line", tier:2, kb:[], wm:"きょうかいせん — 正常と異常の境界線など誰に引ける — who can draw the boundary line between normal and abnormal?" },
  { id:"mv_n10", ep:27, word:"孤独", reading:"こどく", meaning:"loneliness / solitude", tier:1, kb:[], wm:"こどく — あの人は生まれたときから一人だったの — he was alone from the moment he was born; Vincent's 孤独 is total" },

];

const TIER_LABELS = {1:"CORE",2:"SITUATIONAL",3:"SLANG/IDIOM"};
const TIER_COLORS = {1:"#e8412a",2:"#e8a22a",3:"#7c4de8"};
const STORAGE_KEY = "bebop_srs_v2";
const READINESS_THRESHOLD = 1; 
const UNLOCK_THRESHOLD = 70; // % readiness to unlock next episode  = "ready"

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

function getDue(vocab, progress) {
  const now=Date.now();
  return vocab.filter(v=>{ const p=progress[v.id]; return !p||p.interval===0||p.nextReview<=now; });
}

function getEpReadiness(epId, progress) {
  const epVocab = VOCAB.filter(v=>v.ep===epId);
  if (!epVocab.length) return 0;
  const ready = epVocab.filter(v=>progress[v.id]?.interval>=READINESS_THRESHOLD).length;
  return Math.round((ready/epVocab.length)*100);
}

function isEpUnlocked(epId, progress) {
  if (epId === 1) return true; // EP01 always unlocked
  const prevId = epId === 27 ? 26 : epId - 1; // movie unlocks after EP26
  return getEpReadiness(prevId, progress) >= UNLOCK_THRESHOLD;
}

export default function App() {
  const [progress,setProgress]=useState({});
  const [currentCard,setCurrentCard]=useState(null);
  const [flipped,setFlipped]=useState(false);
  const [mode,setMode]=useState("home"); // home | study | stats
  const [studyEp,setStudyEp]=useState(null);
  const [session,setSession]=useState({reviewed:0,correct:0});
  const [loading,setLoading]=useState(true);
  const [saveMsg,setSaveMsg]=useState("");
  const [expandedKanji,setExpandedKanji]=useState(null);
  const [filterTier,setFilterTier]=useState(0);

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

  const pickNext = useCallback((prog, vocab)=>{
    const due=getDue(vocab,prog);
    if(!due.length) return null;
    due.sort((a,b)=>{ const pa=prog[a.id],pb=prog[b.id]; if(!pa&&pb)return -1; if(pa&&!pb)return 1; if(!pa&&!pb)return 0; return pa.nextReview-pb.nextReview; });
    return due[0];
  },[]);

  const startStudy = (epId)=>{
    setStudyEp(epId);
    const vocab = getStudyVocab(epId, filterTier||null);
    setCurrentCard(pickNext(progress, vocab));
    setFlipped(false); setExpandedKanji(null);
    setSession({reviewed:0,correct:0});
    setMode("study");
  };

  const answer=(quality)=>{
    if(!currentCard) return;
    const updated=sm2(progress[currentCard.id]||{},quality);
    const np={...progress,[currentCard.id]:{...updated}};
    setProgress(np); save(np);
    setSession(s=>({reviewed:s.reviewed+1,correct:s.correct+(quality>=2?1:0)}));
    const vocab = getStudyVocab(studyEp, filterTier||null);
    setCurrentCard(pickNext(np, vocab));
    setFlipped(false); setExpandedKanji(null);
  };

  const nextInt=(quality)=>{
    if(!currentCard) return "";
    const {interval}=sm2(progress[currentCard.id]||{},quality);
    return interval===1?"<1d":`+${interval}d`;
  };

  const globalDue = getDue(VOCAB, progress).length;
  const globalStudied = VOCAB.filter(v=>progress[v.id]).length;

  if(loading) return(
    <div style={{minHeight:"100vh",background:"#070707",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{color:"#e8412a",fontFamily:"monospace",fontSize:14,letterSpacing:6}}>読み込み中…</span>
    </div>
  );

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
                const due = getDue(epVocab,progress).length;
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
                {studyEp?(EPISODES.find(e=>e.ep===studyEp)?.title||`EP${studyEp}`):"ALL EPISODES"}
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
                  <span style={{color:TIER_COLORS[currentCard.tier],fontSize:9,fontFamily:"monospace",letterSpacing:2}}>{TIER_LABELS[currentCard.tier]}</span>
                  <span style={{color:"#222",fontSize:9,fontFamily:"monospace"}}>EP{currentCard.ep===27?"映画":String(currentCard.ep).padStart(2,"0")}</span>
                </div>

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
                      <div style={{fontSize:30,color:"#fff",lineHeight:1}}>{currentCard.word}</div>
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
                      <button key={q} style={{...S.ansBtn,background:bg}} onClick={()=>answer(q)}>
                        <span style={{color:"#fff",fontSize:9,letterSpacing:1,fontFamily:"monospace",fontWeight:700}}>{label}</span>
                        <span style={{color:"rgba(255,255,255,0.35)",fontSize:8,fontFamily:"monospace"}}>{nextInt(q)}</span>
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

        {/* ── STATS ── */}
        {mode==="stats"&&(
          <>
            <div style={{fontSize:9,color:"#222",letterSpacing:4,fontFamily:"monospace",borderBottom:"1px solid #111",paddingBottom:8,marginBottom:20}}>
              OVERALL PROGRESS — {VOCAB.length} WORDS
            </div>
            {EPISODES.map(ep=>{
              const epVocab=VOCAB.filter(v=>v.ep===ep.id);
              const studied=epVocab.filter(v=>progress[v.id]).length;
              const mastered=epVocab.filter(v=>progress[v.id]?.interval>=21).length;
              const ready=epVocab.filter(v=>progress[v.id]?.interval>=READINESS_THRESHOLD).length;
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
                      const isMastered=p?.interval>=21;
                      const isReady=p?.interval>=READINESS_THRESHOLD;
                      const isDue=!p||p.nextReview<=Date.now();
                      return(
                        <div key={v.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                          <span style={{fontSize:16,color:isMastered?"#4de89a":isReady?"#e8a22a":isDue?TIER_COLORS[v.tier]:"#1e1e1e"}}>{v.word}</span>
                          <span style={{fontSize:7,color:"#1e1e1e",fontFamily:"monospace"}}>{p?`+${p.interval}d`:"new"}</span>
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
