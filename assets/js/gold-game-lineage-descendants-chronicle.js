/**
 * 家族传承 · 子弟长卷
 * 族徽、列传、市井摊、善行簿、闲职、藏书、武馆、观星、渔猎采药、乡音、仪容、小宠、友书、调解、厨艺、赛季比试、寻宝…
 * 在 descendants-saga.js 之后加载；升级类默认 12 小时冷却。不改变婚育门禁。
 */
(function () {
    'use strict';
    var HOUR_MS = 60 * 60 * 1000;
    var DAY_MS = 24 * 60 * 60 * 1000;
    var CD_12H = 12 * HOUR_MS;

    function cfg() { return window.lineageExtConfig; }
    function funds() { return player.investmentGame.userData; }
    function fmt(n) { return typeof formatSci === 'function' ? formatSci(n) : String(n); }
    function isAdult(m) {
        return typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : !!(m && m.isAdult);
    }
    function isMarried(m) {
        return !!(m && (m.isMarried || m.married || m.spouseId || m.spouseName));
    }
    function C() { return (cfg() && cfg().descChronicle) || {}; }
    function genLabel(g) {
        return typeof getGenerationLabel === 'function' ? getGenerationLabel(g) : ('第' + g + '代');
    }

    function installChronicleConfig() {
        if (!window.lineageExtConfig) return;
        var c = window.lineageExtConfig;
        if (c._descChronicleInstalled) return;
        c._descChronicleInstalled = true;

        c.descChronicle = {
            upgradeCd: CD_12H,
            // —— 族徽纹章（族级 12h）——
            emblem: {
                maxLv: 18,
                costBase: 100000000,
                growth: 2.72,
                per: { atk: 1.2, hp: 1.2, crit: 1.0 },
                needMembers: 3
            },
            // —— 藏书楼（族级 12h）——
            library: {
                maxLv: 15,
                costBase: 85000000,
                growth: 2.68,
                per: { atk: 0.7, hp: 0.8, crit: 1.3 }
            },
            // —— 列传编纂 ——
            bio: [
                { id: 'birth', name: '出生纪', cost: 15000000, needStage: 0, fame: 4, worldHp: 0.3 },
                { id: 'school', name: '开蒙纪', cost: 25000000, needStage: 2, fame: 6, worldCritDmg: 0.4 },
                { id: 'adult', name: '弱冠/及笄纪', cost: 40000000, needAdult: true, fame: 8, worldAtk: 0.5 },
                { id: 'wedding', name: '花烛纪', cost: 60000000, needMarried: true, fame: 10, worldHp: 0.6 },
                { id: 'deed', name: '功业纪', cost: 80000000, needFame: 60, fame: 12, worldAtk: 0.7, worldCritDmg: 0.5 },
                { id: 'elder', name: '暮年纪', cost: 100000000, needFame: 120, needAdult: true, fame: 15, worldAtk: 0.8, worldHp: 0.8, worldCritDmg: 0.8 }
            ],
            bioBook: {
                maxLv: 12,
                costBase: 120000000,
                growth: 2.75,
                per: { atk: 1.0, hp: 1.1, crit: 1.0 },
                perPage: { atk: 0.35, hp: 0.4, crit: 0.3 }
            },
            // —— 市井摊位 ——
            stalls: [
                { id: 'candy', name: '麦芽糖摊', cost: 5000000, cd: 3 * HOUR_MS, mood: 5, attr: 'business', gain: 1, fame: 1,
                  line: '{name}把糖拉成丝，小孩围成一圈，银子进得慢，笑进得快。' },
                { id: 'tea', name: '路边茶摊', cost: 6000000, cd: 3 * HOUR_MS, mood: 4, attr: 'charm', gain: 1, fame: 2,
                  line: '{name}添了一碗热水，听完路人半生故事，茶钱照收。' },
                { id: 'repair', name: '补锅修伞', cost: 7000000, cd: 4 * HOUR_MS, mood: 3, attr: 'physique', gain: 2, fame: 2,
                  line: '{name}把破伞修好，客人走时多塞了一文，说「下次还找你」。' },
                { id: 'story', name: '说书棚', cost: 8000000, cd: 4 * HOUR_MS, mood: 6, attr: 'intelligence', gain: 2, fame: 3,
                  line: '{name}说到紧要处停住要钱，听众又气又笑，袋子却松了。' },
                { id: 'herb', name: '草药零卖', cost: 9000000, cd: 4 * HOUR_MS, mood: 3, attr: 'intelligence', gain: 1, fame: 3, worldHp: 0.25,
                  line: '{name}辨认草叶时很认真，像在认人。' },
                { id: 'night_market', name: '夜市灯笼', cost: 12000000, cd: 5 * HOUR_MS, mood: 7, attr: 'business', gain: 2, fame: 4, needAdult: true,
                  line: '{name}挂起灯笼，夜色被照成白天的一半。' }
            ],
            // —— 善行功德 ——
            deeds: [
                { id: 'water', name: '施茶', cost: 3000000, cd: 3 * HOUR_MS, merit: 5, mood: 4, fame: 2,
                  line: '{name}在路口摆了茶，过路人拱手，茶凉了也不恼。' },
                { id: 'road', name: '修桥补路', cost: 20000000, cd: 6 * HOUR_MS, merit: 12, fame: 6, worldHp: 0.5,
                  line: '{name}垫平一块坑，回头看见老人走得稳了。' },
                { id: 'orphan', name: '济孤寒', cost: 25000000, cd: 6 * HOUR_MS, merit: 14, mood: 5, fame: 7, worldHp: 0.4,
                  line: '{name}送去棉衣，孩子叫了一声「恩人」，{name}耳朵红了。' },
                { id: 'bury', name: '掩骼埋胔', cost: 15000000, cd: 5 * HOUR_MS, merit: 10, fame: 5, worldCritDmg: 0.3,
                  line: '{name}把无主枯骨埋好，立了无名碑，风停了一会儿。' },
                { id: 'return', name: '拾金不昧', cost: 5000000, cd: 4 * HOUR_MS, merit: 8, fame: 5, mood: 6,
                  line: '{name}把银包还回去，对方要分一半，被坚决拒绝——回家却偷着乐。' }
            ],
            meritTiers: [
                { need: 0, name: '寻常', atk: 0, hp: 0, crit: 0 },
                { need: 40, name: '略有善名', atk: 0.5, hp: 0.8, crit: 0.3 },
                { need: 100, name: '一乡称善', atk: 1.2, hp: 1.8, crit: 0.8 },
                { need: 200, name: '德被邻里', atk: 2.5, hp: 3.2, crit: 1.5 },
                { need: 350, name: '十八代善士', atk: 4, hp: 5, crit: 2.5 }
            ],
            // —— 族中闲职（任命后升级 12h）——
            offices: [
                { id: 'gate', name: '守门', max: 12, costBase: 35000000, growth: 2.5, worldAtk: 0.55, attr: 'physique' },
                { id: 'ledger', name: '司账', max: 12, costBase: 38000000, growth: 2.5, worldAtk: 0.45, worldHp: 0.2, attr: 'business' },
                { id: 'library', name: '管书', max: 12, costBase: 36000000, growth: 2.5, worldCritDmg: 0.6, attr: 'intelligence' },
                { id: 'kitchen', name: '厨下', max: 12, costBase: 34000000, growth: 2.5, worldHp: 0.6, attr: 'charm' },
                { id: 'shrine', name: '奉祠', max: 12, costBase: 40000000, growth: 2.55, worldAtk: 0.35, worldHp: 0.35, worldCritDmg: 0.35, needAdult: true }
            ],
            // —— 藏书借阅 ——
            books: [
                { id: 'classic', name: '借经史', cost: 4000000, cd: 3 * HOUR_MS, attr: 'intelligence', gain: 2, mood: 2,
                  line: '{name}抱着书回来，路上差点撞到柱子。' },
                { id: 'math', name: '借算学', cost: 4500000, cd: 3 * HOUR_MS, attr: 'business', gain: 2, mood: 2,
                  line: '{name}把算草写满袖口，被长辈骂，又被悄悄夸。' },
                { id: 'poem', name: '借诗集', cost: 4000000, cd: 3 * HOUR_MS, attr: 'charm', gain: 2, mood: 4,
                  line: '{name}读到半夜，窗纸上映着一个摇头晃脑的影子。' },
                { id: 'military', name: '借兵书', cost: 6000000, cd: 4 * HOUR_MS, attr: 'physique', gain: 1, fame: 2, needAdult: true,
                  line: '{name}合上兵书，拳头不自觉握紧，又松开。' },
                { id: 'return_book', name: '按期还书', cost: 2000000, cd: 2 * HOUR_MS, mood: 3, fame: 2, merit: 2,
                  line: '{name}把书擦干净还回去，管书人点头：「这孩子靠谱。」' }
            ],
            // —— 武馆日课 ——
            dojo: [
                { id: 'stance', name: '扎马', cost: 5000000, cd: 3 * HOUR_MS, attr: 'physique', gain: 2, mood: -1,
                  line: '{name}腿抖得像筛糠，下来时却挺胸。' },
                { id: 'spar', name: '对木人', cost: 6000000, cd: 3 * HOUR_MS, attr: 'physique', gain: 2, fame: 1,
                  line: '{name}把木人打得吱呀响，自己手也红了。' },
                { id: 'breath', name: '调息', cost: 4500000, cd: 3 * HOUR_MS, attr: 'physique', gain: 1, sleep: 5, mood: 3,
                  line: '{name}把气沉下去，杂念像灰尘一样落定。' },
                { id: 'match', name: '馆内切磋', cost: 10000000, cd: 5 * HOUR_MS, attr: 'physique', gain: 3, fame: 4, needAdult: true, worldAtk: 0.35,
                  line: '{name}赢了一场，输了一场，都作了揖。' }
            ],
            // —— 观星 ——
            stars: [
                { id: 'north', name: '辨北斗', cost: 5000000, cd: 4 * HOUR_MS, attr: 'intelligence', gain: 2, mood: 4,
                  line: '{name}找到北斗，忽然觉得路没有那么黑。' },
                { id: 'season', name: '观时令星', cost: 7000000, cd: 4 * HOUR_MS, attr: 'intelligence', gain: 2, fame: 2, worldCritDmg: 0.25,
                  line: '{name}说某星偏了，明天该下雨——果然下了。' },
                { id: 'wish', name: '流星许愿', cost: 8000000, cd: 5 * HOUR_MS, mood: 8, fame: 2,
                  line: '{name}许了愿不说，只把手指藏进袖里。' },
                { id: 'ancestor_star', name: '寻祖星', cost: 25000000, cd: 8 * HOUR_MS, fame: 8, needGen: 6, worldAtk: 0.6, worldHp: 0.6, worldCritDmg: 0.6,
                  line: '{name}看见一颗很淡的星，像有人在很远的地方点头。' }
            ],
            // —— 渔猎采药 ——
            forage: [
                { id: 'fish', name: '溪边垂钓', cost: 4000000, cd: 3 * HOUR_MS, mood: 5, attr: 'business', gain: 1,
                  line: '{name}钓上一条小鱼，放回去，说「再长大些」。' },
                { id: 'hunt', name: '林缘设套', cost: 8000000, cd: 5 * HOUR_MS, attr: 'physique', gain: 2, fame: 2, needAdult: true,
                  line: '{name}空着手回来，却带回一身露水和清醒。' },
                { id: 'herb_pick', name: '山径采药', cost: 7000000, cd: 4 * HOUR_MS, attr: 'intelligence', gain: 2, worldHp: 0.3,
                  line: '{name}识得三味草，背回来时裤脚全是泥。' },
                { id: 'mushroom', name: '雨后寻菇', cost: 5000000, cd: 3 * HOUR_MS, mood: 6, attr: 'business', gain: 1,
                  line: '{name}找到一窝菇，分给全族，自己留最小的。' },
                { id: 'deep_wood', name: '深林一日', cost: 20000000, cd: 8 * HOUR_MS, attr: 'physique', gain: 3, fame: 5, needAdult: true, worldAtk: 0.5,
                  line: '{name}从深林回来，话少了，眼神却稳了。' }
            ],
            // —— 乡音歌谣 ——
            songs: [
                { id: 'lullaby', name: '学摇篮曲', cost: 3000000, cd: 3 * HOUR_MS, mood: 7, attr: 'charm', gain: 1,
                  line: '{name}唱得不准，弟弟却睡着了。' },
                { id: 'work', name: '号子', cost: 3500000, cd: 3 * HOUR_MS, mood: 5, attr: 'physique', gain: 1,
                  line: '{name}喊号子时脸红，越喊越齐。' },
                { id: 'festival', name: '节庆旧谣', cost: 6000000, cd: 4 * HOUR_MS, mood: 8, fame: 3, attr: 'charm', gain: 2,
                  line: '{name}把旧谣唱全了，老人眼眶湿了。' },
                { id: 'clan', name: '族歌定谱', cost: 30000000, cd: CD_12H, fame: 10, worldHp: 1, worldCritDmg: 0.5, needMembers: 4,
                  line: '族歌第一次有了定谱。{name}的声音被写进纸里。' }
            ],
            // —— 仪容服饰 ——
            attire: [
                { id: 'comb', name: '晨梳', cost: 2000000, cd: 2 * HOUR_MS, mood: 3, attr: 'charm', gain: 1,
                  line: '{name}把头发梳顺，镜子里的人像样多了。' },
                { id: 'new_robe', name: '添衣', cost: 15000000, cd: 6 * HOUR_MS, mood: 6, attr: 'charm', gain: 2, fame: 2,
                  line: '{name}穿上新衣，走路都小心翼翼，怕弄脏。' },
                { id: 'formal', name: '正装见客', cost: 20000000, cd: 6 * HOUR_MS, mood: 4, fame: 5, attr: 'charm', gain: 2, needAdult: true,
                  line: '{name}见客时腰板直，话也少说错。' },
                { id: 'badge', name: '佩族徽小饰', cost: 25000000, cd: 8 * HOUR_MS, fame: 6, worldAtk: 0.3, worldHp: 0.3,
                  line: '{name}佩上小饰，抬手时银光一闪，像提醒自己是谁家的人。' }
            ],
            // —— 小宠 ——
            pets: [
                { id: 'cat', name: '喂猫逗猫', cost: 3000000, cd: 3 * HOUR_MS, mood: 6, sleep: 2,
                  line: '{name}被猫踩了一脚，却说「它喜欢我」。' },
                { id: 'dog', name: '遛狗护院', cost: 4000000, cd: 3 * HOUR_MS, mood: 5, attr: 'physique', gain: 1, fame: 1,
                  line: '{name}和狗跑完一圈，双双喘气，双双得意。' },
                { id: 'bird', name: '教鸟学舌', cost: 5000000, cd: 4 * HOUR_MS, mood: 5, attr: 'charm', gain: 1,
                  line: '鸟学会叫{name}的乳名，全族笑了一整天。' },
                { id: 'bond_pet', name: '认主升契', cost: 40000000, cd: CD_12H, mood: 10, fame: 6, worldHp: 0.8, attrAll: 1,
                  line: '{name}与小宠心意相通。窗外的风都软了。' }
            ],
            // —— 友书往来 ——
            letters: [
                { id: 'write', name: '写给友人', cost: 4000000, cd: 3 * HOUR_MS, mood: 4, fame: 2, attr: 'intelligence', gain: 1,
                  line: '{name}把信写了三遍，才封上——最后一版最短。' },
                { id: 'reply', name: '回信', cost: 3500000, cd: 3 * HOUR_MS, mood: 5, fame: 2,
                  line: '{name}回信写到灯尽，信封角还画了个小月亮。' },
                { id: 'gift_letter', name: '随信寄物', cost: 12000000, cd: 5 * HOUR_MS, mood: 6, fame: 4, worldHp: 0.25,
                  line: '{name}寄出一块点心和一句话：别太想家，也别太不想。' },
                { id: 'reunion', name: '约友一叙', cost: 18000000, cd: 6 * HOUR_MS, mood: 8, fame: 5, attr: 'charm', gain: 2, needAdult: true,
                  line: '{name}与友人见面，先是客套，后来拍桌大笑。' }
            ],
            // —— 邻里调解 ——
            mediate: [
                { id: 'quarrel', name: '劝架', cost: 5000000, cd: 4 * HOUR_MS, merit: 4, fame: 3, mood: 2,
                  line: '{name}把两方劝开，自己被溅了一身茶，也不在意。' },
                { id: 'debt', name: '理清细账', cost: 10000000, cd: 5 * HOUR_MS, merit: 6, fame: 4, attr: 'business', gain: 1,
                  line: '{name}把糊涂账理清，两边都消了气，又都有点不好意思。' },
                { id: 'land', name: '地界说和', cost: 20000000, cd: 6 * HOUR_MS, merit: 10, fame: 6, needAdult: true, worldHp: 0.4,
                  line: '{name}在田埂上画了一条线，比官印还管用。' },
                { id: 'wedding_peace', name: '婚事说合', cost: 30000000, cd: 8 * HOUR_MS, merit: 12, fame: 8, needAdult: true, worldCritDmg: 0.4,
                  line: '{name}把两家说妥，红纸还未贴，笑先贴上了。' }
            ],
            // —— 厨艺谱 ——
            cook: [
                { id: 'porridge', name: '熬粥', cost: 2500000, cd: 2 * HOUR_MS, mood: 5, sleep: 3,
                  line: '{name}把粥熬稠，全族抢勺，碗底见了天。' },
                { id: 'bake', name: '蒸饼', cost: 4000000, cd: 3 * HOUR_MS, mood: 6, attr: 'charm', gain: 1,
                  line: '{name}饼歪了，味道却正，大家说「这叫家味」。' },
                { id: 'feast_dish', name: '宴客硬菜', cost: 15000000, cd: 5 * HOUR_MS, mood: 8, fame: 4, needAdult: true,
                  line: '{name}上了一道硬菜，客人夹了三回，还装没夹过。' },
                { id: 'secret', name: '家传秘味', cost: 35000000, cd: CD_12H, mood: 10, fame: 8, worldHp: 0.9, attrAll: 1,
                  line: '{name}把秘味做出来。老人说：就是这个味，八十年没变。' }
            ],
            // —— 赛季比试 ——
            seasonCup: {
                entryCost: 15000000,
                cd: 6 * HOUR_MS,
                winFame: 8,
                loseFame: 2,
                winAttr: 2,
                pointsWin: 10,
                pointsLose: 3,
                tiers: [
                    { need: 0, name: '未入流', atk: 0, hp: 0, crit: 0 },
                    { need: 30, name: '初露锋芒', atk: 0.8, hp: 0.8, crit: 0.5 },
                    { need: 80, name: '一方高手', atk: 2, hp: 2, crit: 1.5 },
                    { need: 160, name: '长卷魁首', atk: 4, hp: 4, crit: 3 }
                ]
            },
            // —— 寻宝考古 ——
            dig: [
                { id: 'yard', name: '翻院角', cost: 6000000, cd: 4 * HOUR_MS, mood: 4, fame: 2,
                  line: '{name}翻出一枚旧扣子，当宝贝似的收着。' },
                { id: 'attic', name: '清阁楼', cost: 10000000, cd: 5 * HOUR_MS, fame: 4, attr: 'intelligence', gain: 1,
                  line: '{name}在尘土里找到半本族谱副本，字迹模糊，心却亮。' },
                { id: 'river', name: '河滩淘物', cost: 12000000, cd: 5 * HOUR_MS, fame: 3, attr: 'business', gain: 1, worldAtk: 0.25,
                  line: '{name}淘到一块温润的石，说「像有人的体温」。' },
                { id: 'ruin', name: '故址探查', cost: 40000000, cd: 8 * HOUR_MS, fame: 10, needGen: 5, worldAtk: 0.8, worldHp: 0.8, worldCritDmg: 0.8,
                  line: '{name}在故址拾起一片瓦，听见风里有旧日人声。' }
            ]
        };

        var moreEvents = [
            { id: 'emblem_polish', title: '族徽重光', text: '旧族徽锈迹斑斑。有人提议重新錾刻，让门楣再亮一次。',
              choices: [
                { label: '升级族徽', cost: 170000000, effect: 'chroEmblemReady', prestige: 24, worldAtk: 5, worldHp: 3 },
                { label: '先擦拭供奉', cost: 40000000, effect: 'livingMood', amount: 8, prestige: 10 },
                { label: '日后再说', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'bio_compile', title: '列传开编', text: '纸墨备好。要把活着的人写成留给未来的字。',
              choices: [
                { label: '升级长卷总册', cost: 150000000, effect: 'chroBioReady', prestige: 22, worldCritDmg: 5 },
                { label: '先写一页试试', cost: 50000000, effect: 'chroBioBoost', prestige: 12 },
                { label: '怕写不好', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'library_expand', title: '藏书楼扩架', text: '书多到要掉下来。管书人说：再不开架，书要抗议。',
              choices: [
                { label: '扩建藏书楼', cost: 140000000, effect: 'chroLibraryReady', prestige: 22, worldCritDmg: 4, worldHp: 3 },
                { label: '先整理一遍', cost: 30000000, effect: 'livingMood', amount: 6, prestige: 8 },
                { label: '借出去减负', cost: 0, effect: 'none', prestige: 3 }
              ]},
            { id: 'merit_day', title: '善行日', text: '街坊说：你们家最近尽做好事。茶摊前多了几句闲话。',
              choices: [
                { label: '全族行善一天', cost: 90000000, effect: 'chroMeritBoost', prestige: 18, worldHp: 5 },
                { label: '默默继续', cost: 20000000, effect: 'livingMood', amount: 5, prestige: 8 },
                { label: '别宣扬', cost: 0, effect: 'none', prestige: 4 }
              ]},
            { id: 'cup_open', title: '长卷赛季开幕', text: '比武台搭好。少年摩拳，文士磨墨，商路也来凑热闹。',
              choices: [
                { label: '正式开赛鼓舞', cost: 80000000, effect: 'chroCupBoost', prestige: 16, worldAtk: 4 },
                { label: '犒赏选手', cost: 40000000, effect: 'livingMood', amount: 10, prestige: 10 },
                { label: '低调观战', cost: 0, effect: 'none', prestige: 3 }
              ]}
        ];
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'stall2', name: '市井营生', desc: '摆摊 2 次', need: 2, key: 'chroStall', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'deed2', name: '善行积德', desc: '完成善行 2 次', need: 2, key: 'chroDeed', rewardPrestige: 16, rewardFunds: 6000000, rewardExp: 14 },
            { id: 'book1', name: '藏书往来', desc: '借还书 1 次', need: 1, key: 'chroBook', rewardPrestige: 12, rewardFunds: 4000000, rewardExp: 10 },
            { id: 'forage1', name: '山野一日', desc: '渔猎采药 1 次', need: 1, key: 'chroForage', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'chroUp1', name: '长卷营建', desc: '升级族徽/藏书/闲职/列传总册 1 次', need: 1, key: 'chroUp', rewardPrestige: 25, rewardFunds: 15000000, rewardExp: 20 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensureChronicleData() {
        if (!player.children) return;
        installChronicleConfig();
        if (!player.children.descChronicle) {
            player.children.descChronicle = {
                emblemLv: 0, emblemCd: 0, emblemReady: false,
                libraryLv: 0, libraryCd: 0, libraryReady: false,
                bioBookLv: 0, bioBookCd: 0, bioReady: false,
                stallCd: {}, deedCd: {}, bookCd: {}, dojoCd: {}, starCd: {},
                forageCd: {}, songCd: {}, attireCd: {}, petCd: {}, letterCd: {},
                mediateCd: {}, cookCd: {}, digCd: {}, cupCd: {},
                meritBoost: false, cupBoost: false
            };
        }
        var d = player.children.descChronicle;
        ['stallCd', 'deedCd', 'bookCd', 'dojoCd', 'starCd', 'forageCd', 'songCd', 'attireCd', 'petCd', 'letterCd', 'mediateCd', 'cookCd', 'digCd', 'cupCd'].forEach(function (k) {
            if (!d[k] || typeof d[k] !== 'object') d[k] = {};
        });
        (player.children.children || []).forEach(function (m) {
            if (!m.chronicle) {
                m.chronicle = {
                    bios: {},
                    offices: {}, officeCd: {}, officeId: null,
                    merit: 0,
                    cupPoints: 0,
                    cupCd: 0
                };
            }
            var ch = m.chronicle;
            if (!ch.bios) ch.bios = {};
            if (!ch.offices) ch.offices = {};
            if (!ch.officeCd) ch.officeCd = {};
            if (ch.merit == null) ch.merit = 0;
            if (ch.cupPoints == null) ch.cupPoints = 0;
        });
    }

    function pushDiary(text) {
        if (!player.children.life && typeof ensureLifeData === 'function') ensureLifeData();
        if (!player.children.life) return;
        var d = player.children.life.diary;
        if (!Array.isArray(d)) { player.children.life.diary = []; d = player.children.life.diary; }
        d.unshift({ t: Date.now(), text: text });
        if (d.length > 110) d.length = 110;
    }

    function bump(key) {
        if (!player.children.dailyQuest) return;
        (cfg().dailyQuests || []).forEach(function (q) {
            if (q.key === key) player.children.dailyQuest.progress[q.id] = (player.children.dailyQuest.progress[q.id] || 0) + 1;
        });
    }

    function addMood(n) {
        if (!player.children.life) return;
        player.children.life.mood = Math.max(0, Math.min(100, (player.children.life.mood || 50) + (n || 0)));
    }

    function addFame(m, n) {
        if (!m) return;
        m.descFame = Math.max(0, (m.descFame || 0) + (n || 0));
    }

    function addSleep(m, n) {
        if (!m.nova) m.nova = { sleep: 70 };
        m.nova.sleep = Math.max(0, Math.min(100, (m.nova.sleep || 70) + (n || 0)));
    }

    function addAttr(m, key, n) {
        if (!m.attributes) m.attributes = {};
        if (key === 'all' || key === 'attrAll') {
            ['physique', 'intelligence', 'business', 'charm'].forEach(function (k) {
                m.attributes[k] = (m.attributes[k] || 0) + (n || 0);
            });
            return;
        }
        m.attributes[key] = (m.attributes[key] || 0) + (n || 0);
    }

    function addMerit(m, n) {
        if (!m || !m.chronicle) return;
        m.chronicle.merit = (m.chronicle.merit || 0) + (n || 0);
    }

    function addTempWorld(atk, hp, crit, hours) {
        if (!player.children.life) return;
        if (!player.children.life.tempWorld) player.children.life.tempWorld = { atk: 0, hp: 0, crit: 0, until: 0 };
        var tw = player.children.life.tempWorld;
        if (Date.now() > (tw.until || 0)) { tw.atk = 0; tw.hp = 0; tw.crit = 0; }
        tw.atk += atk || 0;
        tw.hp += hp || 0;
        tw.crit += crit || 0;
        tw.until = Date.now() + (hours || 3) * HOUR_MS;
    }

    function refreshUI() {
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    }

    function maxGen() {
        var g = 0;
        (player.children.children || []).forEach(function (m) { g = Math.max(g, m.generation || 1); });
        return g;
    }

    function memberCount() { return (player.children.children || []).length; }

    function cdLeft(until) { return Math.max(0, (until || 0) - Date.now()); }
    function cdHint(until) {
        var left = cdLeft(until);
        if (left <= 0) return '';
        return '冷却 ' + Math.floor(left / 3600000) + '时' + Math.ceil((left % 3600000) / 60000) + '分';
    }

    function pay(cost) {
        if ((funds().funds || 0) < cost) {
            logAction('资金不足（需 ' + fmt(cost) + '）', 'error');
            return false;
        }
        funds().funds -= cost;
        return true;
    }

    function getMember(idx) {
        var list = player.children.children || [];
        if (idx < 0 || idx >= list.length) return null;
        return list[idx];
    }

    function lifeStage(m) {
        if (typeof getFamilyLifeStage === 'function') return getFamilyLifeStage(m);
        if (isAdult(m)) return 3;
        return m.lifeStage != null ? m.lifeStage : 1;
    }

    // ——— 族徽 / 藏书楼 ———
    window.upgradeChronicleEmblem = function () {
        ensureChronicleData();
        var conf = C().emblem;
        var d = player.children.descChronicle;
        if ((d.emblemLv || 0) >= conf.maxLv) return logAction('族徽已满级', 'info');
        if (memberCount() < (conf.needMembers || 0)) return logAction('族人不足', 'error');
        if (cdLeft(d.emblemCd) > 0 && !d.emblemReady) return logAction(cdHint(d.emblemCd), 'error');
        var cost = Math.floor(conf.costBase * Math.pow(conf.growth, d.emblemLv || 0));
        if (!pay(cost)) return;
        d.emblemLv = (d.emblemLv || 0) + 1;
        d.emblemCd = Date.now() + CD_12H;
        d.emblemReady = false;
        bump('chroUp');
        pushDiary('族徽升至 Lv.' + d.emblemLv + '。门楣亮了一寸。');
        logAction('族徽升至 Lv.' + d.emblemLv + '（12h）', 'success');
        refreshUI();
    };

    window.upgradeChronicleLibrary = function () {
        ensureChronicleData();
        var conf = C().library;
        var d = player.children.descChronicle;
        if ((d.libraryLv || 0) >= conf.maxLv) return logAction('藏书楼已满级', 'info');
        if (cdLeft(d.libraryCd) > 0 && !d.libraryReady) return logAction(cdHint(d.libraryCd), 'error');
        var cost = Math.floor(conf.costBase * Math.pow(conf.growth, d.libraryLv || 0));
        if (!pay(cost)) return;
        d.libraryLv = (d.libraryLv || 0) + 1;
        d.libraryCd = Date.now() + CD_12H;
        d.libraryReady = false;
        bump('chroUp');
        pushDiary('藏书楼扩至 Lv.' + d.libraryLv + '。');
        logAction('藏书楼升至 Lv.' + d.libraryLv + '（12h）', 'success');
        refreshUI();
    };

    window.upgradeChronicleBioBook = function () {
        ensureChronicleData();
        var conf = C().bioBook;
        var d = player.children.descChronicle;
        if ((d.bioBookLv || 0) >= conf.maxLv) return logAction('列传总册已满级', 'info');
        if (cdLeft(d.bioBookCd) > 0 && !d.bioReady) return logAction(cdHint(d.bioBookCd), 'error');
        var cost = Math.floor(conf.costBase * Math.pow(conf.growth, d.bioBookLv || 0));
        if (!pay(cost)) return;
        d.bioBookLv = (d.bioBookLv || 0) + 1;
        d.bioBookCd = Date.now() + CD_12H;
        d.bioReady = false;
        bump('chroUp');
        logAction('列传总册升至 Lv.' + d.bioBookLv + '（12h）', 'success');
        refreshUI();
    };

    // ——— 列传页 ———
    window.writeChronicleBio = function (idx, bid) {
        ensureChronicleData();
        var m = getMember(idx);
        var page = (C().bio || []).find(function (x) { return x.id === bid; });
        if (!m || !page) return;
        if (m.chronicle.bios[bid]) return logAction('此纪已写入', 'info');
        if (page.needAdult && !isAdult(m)) return logAction('须成年', 'error');
        if (page.needMarried && !isMarried(m)) return logAction('须成婚', 'error');
        if (page.needFame && (m.descFame || 0) < page.needFame) return logAction('声望不足', 'error');
        if (page.needStage != null && lifeStage(m) < page.needStage) return logAction('人生阶段未到', 'error');
        if (!pay(page.cost)) return;
        m.chronicle.bios[bid] = true;
        addFame(m, page.fame || 0);
        addTempWorld(page.worldAtk, page.worldHp, page.worldCritDmg, 4);
        pushDiary(m.name + ' 的「' + page.name + '」写入长卷。');
        logAction(m.name + ' 写入「' + page.name + '」', 'success');
        refreshUI();
    };

    // ——— 通用短行动 ———
    function doSimpleAct(listKey, cdMapKey, bumpKey, id, idx, extraCheck) {
        ensureChronicleData();
        var act = (C()[listKey] || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        if (extraCheck && extraCheck(act, m) === false) return;
        if (act.needAdult && !isAdult(m)) return logAction('需成年', 'error');
        if (act.needGen && maxGen() < act.needGen) return logAction('需触及第' + act.needGen + '代', 'error');
        if (act.needMembers && memberCount() < act.needMembers) return logAction('族人不足', 'error');
        var d = player.children.descChronicle;
        var key = id + ':' + m.id;
        if (cdLeft(d[cdMapKey][key]) > 0) return logAction(cdHint(d[cdMapKey][key]), 'error');
        if (!pay(act.cost)) return;
        d[cdMapKey][key] = Date.now() + act.cd;
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        if (act.attr) addAttr(m, act.attr, act.gain || 1);
        if (act.attrAll) addAttr(m, 'all', act.attrAll);
        if (act.sleep) addSleep(m, act.sleep);
        if (act.merit) addMerit(m, act.merit);
        addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 3);
        if (bumpKey) bump(bumpKey);
        var line = (act.line || act.name).replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    }

    window.doChronicleStall = function (id, idx) { doSimpleAct('stalls', 'stallCd', 'chroStall', id, idx); };
    window.doChronicleDeed = function (id, idx) {
        ensureChronicleData();
        var act = (C().deeds || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        var d = player.children.descChronicle;
        var key = id + ':' + m.id;
        var cd = act.cd;
        if (d.meritBoost) { cd = Math.floor(cd * 0.5); d.meritBoost = false; }
        if (cdLeft(d.deedCd[key]) > 0) return logAction(cdHint(d.deedCd[key]), 'error');
        if (!pay(act.cost)) return;
        d.deedCd[key] = Date.now() + cd;
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        addMerit(m, act.merit || 0);
        addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 3);
        bump('chroDeed');
        var line = (act.line || '').replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    };
    window.doChronicleBook = function (id, idx) { doSimpleAct('books', 'bookCd', 'chroBook', id, idx); };
    window.doChronicleDojo = function (id, idx) { doSimpleAct('dojo', 'dojoCd', null, id, idx); };
    window.doChronicleStar = function (id, idx) { doSimpleAct('stars', 'starCd', null, id, idx); };
    window.doChronicleForage = function (id, idx) { doSimpleAct('forage', 'forageCd', 'chroForage', id, idx); };
    window.doChronicleSong = function (id, idx) { doSimpleAct('songs', 'songCd', null, id, idx); };
    window.doChronicleAttire = function (id, idx) { doSimpleAct('attire', 'attireCd', null, id, idx); };
    window.doChroniclePet = function (id, idx) { doSimpleAct('pets', 'petCd', null, id, idx); };
    window.doChronicleLetter = function (id, idx) { doSimpleAct('letters', 'letterCd', null, id, idx); };
    window.doChronicleMediate = function (id, idx) { doSimpleAct('mediate', 'mediateCd', null, id, idx); };
    window.doChronicleCook = function (id, idx) { doSimpleAct('cook', 'cookCd', null, id, idx); };
    window.doChronicleDig = function (id, idx) { doSimpleAct('dig', 'digCd', null, id, idx); };

    // ——— 闲职 ———
    window.assignChronicleOffice = function (idx, oid) {
        ensureChronicleData();
        var m = getMember(idx);
        var office = (C().offices || []).find(function (x) { return x.id === oid; });
        if (!m || !office) return;
        if (office.needAdult && !isAdult(m)) return logAction('此职须成年', 'error');
        if (m.chronicle.officeId === oid) return logAction('已任此职', 'info');
        if (!pay(8000000)) return;
        m.chronicle.officeId = oid;
        if (m.chronicle.offices[oid] == null) m.chronicle.offices[oid] = 0;
        pushDiary(m.name + ' 就任「' + office.name + '」。');
        logAction(m.name + ' 就任「' + office.name + '」', 'success');
        refreshUI();
    };

    window.upgradeChronicleOffice = function (idx) {
        ensureChronicleData();
        var m = getMember(idx);
        if (!m || !m.chronicle.officeId) return logAction('请先任命闲职', 'error');
        var oid = m.chronicle.officeId;
        var office = (C().offices || []).find(function (x) { return x.id === oid; });
        if (!office) return;
        var lv = m.chronicle.offices[oid] || 0;
        if (lv >= office.max) return logAction('闲职已满级', 'info');
        if (cdLeft(m.chronicle.officeCd[oid]) > 0) return logAction(cdHint(m.chronicle.officeCd[oid]), 'error');
        var cost = Math.floor(office.costBase * Math.pow(office.growth, lv));
        if (!pay(cost)) return;
        m.chronicle.offices[oid] = lv + 1;
        m.chronicle.officeCd[oid] = Date.now() + CD_12H;
        if (office.attr) addAttr(m, office.attr, 1);
        bump('chroUp');
        logAction(m.name + ' 「' + office.name + '」升至 Lv.' + (lv + 1) + '（12h）', 'success');
        refreshUI();
    };

    // ——— 赛季比试 ———
    window.enterChronicleCup = function (idx) {
        ensureChronicleData();
        var m = getMember(idx);
        if (!m) return;
        if (!isAdult(m)) return logAction('须成年参赛', 'error');
        var conf = C().seasonCup;
        var d = player.children.descChronicle;
        if (cdLeft(m.chronicle.cupCd) > 0 && !d.cupBoost) return logAction(cdHint(m.chronicle.cupCd), 'error');
        if (!pay(conf.entryCost)) return;
        m.chronicle.cupCd = Date.now() + conf.cd;
        d.cupBoost = false;
        var win = Math.random() < 0.55;
        if (win) {
            addFame(m, conf.winFame);
            addAttr(m, 'physique', conf.winAttr);
            m.chronicle.cupPoints = (m.chronicle.cupPoints || 0) + conf.pointsWin;
            pushDiary(m.name + ' 赛季比试获胜，积分 +' + conf.pointsWin + '。');
            logAction(m.name + ' 比试获胜！积分 ' + m.chronicle.cupPoints, 'success');
        } else {
            addFame(m, conf.loseFame);
            m.chronicle.cupPoints = (m.chronicle.cupPoints || 0) + conf.pointsLose;
            pushDiary(m.name + ' 比试惜败，仍有收获。');
            logAction(m.name + ' 惜败，积分 +' + conf.pointsLose, 'info');
        }
        refreshUI();
    };

    function meritTier(m) {
        var merit = (m.chronicle && m.chronicle.merit) || 0;
        var tier = (C().meritTiers || [])[0];
        (C().meritTiers || []).forEach(function (t) {
            if (merit >= t.need) tier = t;
        });
        return tier;
    }

    function cupTier(m) {
        var pts = (m.chronicle && m.chronicle.cupPoints) || 0;
        var tier = (C().seasonCup.tiers || [])[0];
        (C().seasonCup.tiers || []).forEach(function (t) {
            if (pts >= t.need) tier = t;
        });
        return tier;
    }

    function calcChronicleWorld() {
        ensureChronicleData();
        var atk = 0, hp = 0, crit = 0;
        var d = player.children.descChronicle;
        var em = C().emblem;
        atk += (d.emblemLv || 0) * (em.per.atk || 0);
        hp += (d.emblemLv || 0) * (em.per.hp || 0);
        crit += (d.emblemLv || 0) * (em.per.crit || 0);
        var lib = C().library;
        atk += (d.libraryLv || 0) * (lib.per.atk || 0);
        hp += (d.libraryLv || 0) * (lib.per.hp || 0);
        crit += (d.libraryLv || 0) * (lib.per.crit || 0);
        var bb = C().bioBook;
        atk += (d.bioBookLv || 0) * (bb.per.atk || 0);
        hp += (d.bioBookLv || 0) * (bb.per.hp || 0);
        crit += (d.bioBookLv || 0) * (bb.per.crit || 0);

        (player.children.children || []).forEach(function (m) {
            if (!m.chronicle) return;
            var pages = Object.keys(m.chronicle.bios || {}).length;
            atk += pages * (bb.perPage.atk || 0);
            hp += pages * (bb.perPage.hp || 0);
            crit += pages * (bb.perPage.crit || 0);

            var mt = meritTier(m);
            atk += mt.atk || 0;
            hp += mt.hp || 0;
            crit += mt.crit || 0;

            var ct = cupTier(m);
            atk += ct.atk || 0;
            hp += ct.hp || 0;
            crit += ct.crit || 0;

            (C().offices || []).forEach(function (o) {
                var lv = m.chronicle.offices[o.id] || 0;
                atk += lv * (o.worldAtk || 0);
                hp += lv * (o.worldHp || 0);
                crit += lv * (o.worldCritDmg || 0);
            });
        });
        return { atk: atk, hp: hp, crit: crit };
    }

    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        ensureChronicleData();
        var base = _origBonus ? _origBonus() : { worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var w = calcChronicleWorld();
        base.worldAtk = (base.worldAtk || 0) + w.atk;
        base.worldHp = (base.worldHp || 0) + w.hp;
        base.worldCritDmg = (base.worldCritDmg || 0) + w.crit;
        return base;
    };

    var _origResolve = window.resolveClanEvent;
    if (_origResolve) {
        window.resolveClanEvent = function (choiceIndex) {
            var ev = player.children && player.children.activeEvent;
            var ch = ev && ev.choices && ev.choices[choiceIndex];
            var result = _origResolve(choiceIndex);
            if (!ch) return result;
            ensureChronicleData();
            var d = player.children.descChronicle;
            if (ch.effect === 'chroEmblemReady') d.emblemReady = true;
            else if (ch.effect === 'chroLibraryReady') d.libraryReady = true;
            else if (ch.effect === 'chroBioReady') d.bioReady = true;
            else if (ch.effect === 'chroBioBoost') {
                var first = (player.children.children || [])[0];
                if (first) addFame(first, 8);
            } else if (ch.effect === 'chroMeritBoost') d.meritBoost = true;
            else if (ch.effect === 'chroCupBoost') d.cupBoost = true;
            return result;
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }
    function opts(filterFn) {
        return (player.children.children || []).map(function (m, i) {
            if (filterFn && !filterFn(m)) return '';
            var mt = meritTier(m);
            return '<option value="' + i + '">' + m.name + '（' + genLabel(m.generation || 1) +
                '·' + mt.name + '·望' + (m.descFame || 0) + '）</option>';
        }).join('');
    }

    function updateChroClanPanel() {
        var box = el('chroClanPanel');
        if (!box) return;
        ensureChronicleData();
        var d = player.children.descChronicle;
        var eCost = Math.floor(C().emblem.costBase * Math.pow(C().emblem.growth, d.emblemLv || 0));
        var lCost = Math.floor(C().library.costBase * Math.pow(C().library.growth, d.libraryLv || 0));
        var bCost = Math.floor(C().bioBook.costBase * Math.pow(C().bioBook.growth, d.bioBookLv || 0));
        var tag = function (cost) {
            return typeof lineageCostTag === 'function' ? lineageCostTag(cost, '12h') : ('（' + fmt(cost) + '）');
        };
        box.innerHTML = '<div class="c-hint">族徽 Lv.' + (d.emblemLv || 0) + ' · 下级 <b style="color:#FFD700;">' + fmt(eCost) + '</b>' +
            (cdHint(d.emblemCd) ? ' · ' + cdHint(d.emblemCd) : '') +
            (d.emblemReady ? ' · 免冷却就绪' : '') + '</div>' +
            '<button class="c-btn c-btn-gold" style="width:100%;" onclick="upgradeChronicleEmblem()">升级族徽' + tag(eCost) + '</button>' +
            '<div class="c-hint" style="margin-top:10px;">藏书楼 Lv.' + (d.libraryLv || 0) + ' · 下级 <b style="color:#FFD700;">' + fmt(lCost) + '</b>' +
            (cdHint(d.libraryCd) ? ' · ' + cdHint(d.libraryCd) : '') + '</div>' +
            '<button class="c-btn c-btn-blue" style="width:100%;margin-top:4px;" onclick="upgradeChronicleLibrary()">升级藏书楼' + tag(lCost) + '</button>' +
            '<div class="c-hint" style="margin-top:10px;">列传总册 Lv.' + (d.bioBookLv || 0) + ' · 下级 <b style="color:#FFD700;">' + fmt(bCost) + '</b>' +
            (cdHint(d.bioBookCd) ? ' · ' + cdHint(d.bioBookCd) : '') + '</div>' +
            '<button class="c-btn c-btn-purple" style="width:100%;margin-top:4px;" onclick="upgradeChronicleBioBook()">升级列传总册' + tag(bCost) + '</button>';
    }

    function updateChroBioOfficePanel() {
        var box = el('chroBioOfficePanel');
        if (!box) return;
        ensureChronicleData();
        box.innerHTML = '<div class="c-form-row"><label>子弟</label><select id="chroBioMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">列传编纂</h4><div class="c-train-grid">' + (C().bio || []).map(function (p) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + p.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="writeChronicleBio(+document.getElementById(\'chroBioMember\').value,\'' + p.id + '\')">写入</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">族中闲职</h4>' +
            '<div class="c-train-grid">' + (C().offices || []).map(function (o) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + o.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="assignChronicleOffice(+document.getElementById(\'chroBioMember\').value,\'' + o.id + '\')">任命</button></div>';
            }).join('') + '</div>' +
            '<button class="c-btn c-btn-orange" style="width:100%;margin-top:8px;" onclick="upgradeChronicleOffice(+document.getElementById(\'chroBioMember\').value)">升级当前闲职（12h）</button>';
    }

    function updateChroMarketPanel() {
        var box = el('chroMarketPanel');
        if (!box) return;
        ensureChronicleData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="chroMarketMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">市井摊位</h4><div class="c-train-grid">' + (C().stalls || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="doChronicleStall(\'' + a.id + '\',+document.getElementById(\'chroMarketMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">善行功德</h4><div class="c-train-grid">' + (C().deeds || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doChronicleDeed(\'' + a.id + '\',+document.getElementById(\'chroMarketMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">邻里调解</h4><div class="c-train-grid">' + (C().mediate || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="doChronicleMediate(\'' + a.id + '\',+document.getElementById(\'chroMarketMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateChroStudyPanel() {
        var box = el('chroStudyPanel');
        if (!box) return;
        ensureChronicleData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="chroStudyMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">藏书借阅</h4><div class="c-train-grid">' + (C().books || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="doChronicleBook(\'' + a.id + '\',+document.getElementById(\'chroStudyMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">武馆日课</h4><div class="c-train-grid">' + (C().dojo || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-orange" onclick="doChronicleDojo(\'' + a.id + '\',+document.getElementById(\'chroStudyMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">观星</h4><div class="c-train-grid">' + (C().stars || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-purple" onclick="doChronicleStar(\'' + a.id + '\',+document.getElementById(\'chroStudyMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateChroWildPanel() {
        var box = el('chroWildPanel');
        if (!box) return;
        ensureChronicleData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="chroWildMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">渔猎采药</h4><div class="c-train-grid">' + (C().forage || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="doChronicleForage(\'' + a.id + '\',+document.getElementById(\'chroWildMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">寻宝考古</h4><div class="c-train-grid">' + (C().dig || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="doChronicleDig(\'' + a.id + '\',+document.getElementById(\'chroWildMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">赛季比试</h4>' +
            '<button class="c-btn c-btn-orange" style="width:100%;" onclick="enterChronicleCup(+document.getElementById(\'chroWildMember\').value)">报名参赛（成年）</button>';
    }

    function updateChroLifePanel() {
        var box = el('chroLifePanel');
        if (!box) return;
        ensureChronicleData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="chroLifeMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">乡音歌谣</h4><div class="c-train-grid">' + (C().songs || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doChronicleSong(\'' + a.id + '\',+document.getElementById(\'chroLifeMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">仪容服饰</h4><div class="c-train-grid">' + (C().attire || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-purple" onclick="doChronicleAttire(\'' + a.id + '\',+document.getElementById(\'chroLifeMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">小宠</h4><div class="c-train-grid">' + (C().pets || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="doChroniclePet(\'' + a.id + '\',+document.getElementById(\'chroLifeMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">友书往来</h4><div class="c-train-grid">' + (C().letters || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="doChronicleLetter(\'' + a.id + '\',+document.getElementById(\'chroLifeMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">厨艺</h4><div class="c-train-grid">' + (C().cook || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-orange" onclick="doChronicleCook(\'' + a.id + '\',+document.getElementById(\'chroLifeMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    window.updateDescChroniclePanels = function () {
        installChronicleConfig();
        ensureChronicleData();
        updateChroClanPanel();
        updateChroBioOfficePanel();
        updateChroMarketPanel();
        updateChroStudyPanel();
        updateChroWildPanel();
        updateChroLifePanel();
    };

    // 不再从春秋 / living 级联刷新长卷；由 refreshActiveChildTabPanels 按页签刷新

    var _origSwitch = window.switchChildTab;
    window.switchChildTab = function (tab) {
        if (_origSwitch) _origSwitch(tab);
        var node = document.getElementById('childSectionDescChronicle');
        if (node) node.classList.toggle('active', tab === 'descchro');
    };

    installChronicleConfig();
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            installChronicleConfig();
            ensureChronicleData();
        }, 2800);
    });
    if (document.readyState !== 'loading') {
        setTimeout(function () {
            installChronicleConfig();
            ensureChronicleData();
        }, 2800);
    }
})();
